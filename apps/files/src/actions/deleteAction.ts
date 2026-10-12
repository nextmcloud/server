/*!
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IFileAction } from '@nextcloud/files'

import CloseSvg from '@mdi/svg/svg/close.svg?raw'
import NetworkOffSvg from '@mdi/svg/svg/network-off.svg?raw'
import TrashCanSvg from '@mdi/svg/svg/trash-can-outline.svg?raw'
import { Permission } from '@nextcloud/files'
import { loadState } from '@nextcloud/initial-state'
import { t } from '@nextcloud/l10n'
import PQueue from 'p-queue'
import logger from '../logger.ts'
import { askConfirmation, canDisconnectOnly, canUnshareOnly, deleteNode, displayName, shouldAskForConfirmation } from './deleteUtils.ts'

// TODO: once the files app is migrated to the new frontend use the import instead:
// import { TRASHBIN_VIEW_ID } from '../../../files_trashbin/src/files_views/trashbinView.ts'
const TRASHBIN_VIEW_ID = 'trashbin'

const queue = new PQueue({ concurrency: 5 })

export const ACTION_DELETE = 'delete'

/**
 * Delete a node, retrying once since concurrent batch deletes can trigger transient server-side locks/timeouts.
 *
 * @param node - the node to delete
 */
async function deleteNodeWithRetry(node: Parameters<typeof deleteNode>[0]) {
	try {
		await deleteNode(node)
	} catch {
		await deleteNode(node)
	}
}

export const action: IFileAction = {
	id: ACTION_DELETE,
	displayName,
	iconSvgInline: ({ nodes }) => {
		if (canUnshareOnly(nodes)) {
			return CloseSvg
		}

		if (canDisconnectOnly(nodes)) {
			return NetworkOffSvg
		}

		return TrashCanSvg
	},

	enabled({ nodes, view }) {
		if (view.id === TRASHBIN_VIEW_ID) {
			const config = loadState('files_trashbin', 'config', { allow_delete: true })
			if (config.allow_delete === false) {
				return false
			}
		}

		return nodes.length > 0 && nodes
			.map((node) => node.permissions)
			.every((permission) => (permission & Permission.DELETE) !== 0)
	},

	async exec({ nodes, view }) {
		try {
			let confirm = true

			// Trick to detect if the action was called from a keyboard event
			// we need to make sure the method calling have its named containing 'keydown'
			// here we use `onKeydown` method from the FileEntryActions component
			const callStack = new Error().stack || ''
			const isCalledFromEventListener = callStack.toLocaleLowerCase().includes('keydown')

			if (shouldAskForConfirmation() || isCalledFromEventListener) {
				confirm = await askConfirmation([nodes[0]], view)
			}

			// If the user cancels the deletion, we don't want to do anything
			if (confirm === false) {
				return null
			}

			await deleteNode(nodes[0])

			return true
		} catch (error) {
			logger.error('Error while deleting a file', { error, source: nodes[0].source, node: nodes[0] })
			return false
		}
	},

	async execBatch({ nodes, view }) {
		let confirm = true

		if (shouldAskForConfirmation()) {
			confirm = await askConfirmation(nodes, view)
		} else if (nodes.length >= 5 && !canUnshareOnly(nodes) && !canDisconnectOnly(nodes)) {
			confirm = await askConfirmation(nodes, view)
		}

		// If the user cancels the deletion, we don't want to do anything
		if (confirm === false) {
			return Promise.all(nodes.map(() => null))
		}

		// queue.add already returns a promise resolving with the task's result
		const promises = nodes.map((node) => queue.add(async (): Promise<boolean> => {
			try {
				await deleteNodeWithRetry(node)
				return true
			} catch (error) {
				logger.error('Error while deleting a file', { error, source: node.source, node })
				return false
			}
		}))

		return Promise.all(promises)
	},

	destructive: true,
	order: 100,

	hotkey: {
		description: t('files', 'Delete'),
		key: 'Delete',
	},
}
