/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { action } from './inlineSystemTagsAction'
import { describe, expect, test } from 'vitest'
import { File, Permission, View, FileAction } from '@nextcloud/files'
import { emit, subscribe } from '@nextcloud/event-bus'
import { setNodeSystemTags } from '../utils'

const view = {
	id: 'files',
	name: 'Files',
} as View

describe('Inline system tags action conditions tests', () => {
	test('Default values', () => {
		const file = new File({
			id: 1,
			source: 'https://cloud.domain.com/remote.php/dav/files/admin/foobar.txt',
			owner: 'admin',
			mime: 'text/plain',
			permissions: Permission.ALL,
		})

		expect(action).toBeInstanceOf(FileAction)
		expect(action.id).toBe('system-tags')
		expect(action.displayName([file], view)).toBe('')
		expect(action.iconSvgInline([], view)).toBe('')
		expect(action.default).toBeUndefined()
		expect(action.enabled).toBeDefined()
		expect(action.order).toBe(0)
		// Always enabled
		expect(action.enabled!([file], view)).toBe(true)
	})

	test('Enabled with valid system tags', () => {
		const file = new File({
			id: 1,
			source: 'https://cloud.domain.com/remote.php/dav/files/admin/foobar.txt',
			owner: 'admin',
			mime: 'text/plain',
			permissions: Permission.ALL,
			attributes: {
				'system-tags': {
					'system-tag': 'Confidential',
				},
			},
		})

		expect(action.enabled!([file], view)).toBe(true)
	})
})

describe('Inline system tags action render tests', () => {
	test('Render something even when Node does not have system tags', async () => {
		const file = new File({
			id: 1,
			source: 'http://localhost/remote.php/dav/files/admin/foobar.txt',
			owner: 'admin',
			mime: 'text/plain',
			permissions: Permission.ALL,
		})

		const result = await action.renderInline!(file, view)
		expect(result).toBeInstanceOf(HTMLElement)
		expect(result!.outerHTML).toMatchInlineSnapshot(
			'"<ul class="files-list__system-tags" aria-label="Assigned collaborative tags" data-systemtags-fileid="1"></ul>"',
		)
	})

	test('Render a single system tag', async () => {
		const file = new File({
			id: 1,
			source: 'http://localhost/remote.php/dav/files/admin/foobar.txt',
			owner: 'admin',
			mime: 'text/plain',
			permissions: Permission.ALL,
			attributes: {
				'system-tags': {
					'system-tag': 'Confidential',
				},
			},
		})

		const result = await action.renderInline!(file, view)
		expect(result).toBeInstanceOf(HTMLElement)
		expect(result!.outerHTML).toMatchInlineSnapshot(
			'"<ul class="files-list__system-tags" aria-label="Assigned collaborative tags" data-systemtags-fileid="1"><li class="files-list__system-tag">Confidential</li></ul>"',
		)
	})

	test('Render two system tags', async () => {
		const file = new File({
			id: 1,
			source: 'http://localhost/remote.php/dav/files/admin/foobar.txt',
			owner: 'admin',
			mime: 'text/plain',
			permissions: Permission.ALL,
			attributes: {
				'system-tags': {
					'system-tag': ['Important', 'Confidential'],
				},
			},
		})

		const result = await action.renderInline!(file, view)
		expect(result).toBeInstanceOf(HTMLElement)
		expect(result!.outerHTML).toMatchInlineSnapshot(
			'"<ul class="files-list__system-tags" aria-label="Assigned collaborative tags" data-systemtags-fileid="1"><li class="files-list__system-tag">Important</li><li class="files-list__system-tag">Confidential</li></ul>"',
		)
	})

	test('Render multiple system tags', async () => {
		const file = new File({
			id: 1,
			source: 'http://localhost/remote.php/dav/files/admin/foobar.txt',
			owner: 'admin',
			mime: 'text/plain',
			permissions: Permission.ALL,
			attributes: {
				'system-tags': {
					'system-tag': [
						'Important',
						'Confidential',
						'Secret',
						'Classified',
					],
				},
			},
		})

		const result = await action.renderInline!(file, view)
		expect(result).toBeInstanceOf(HTMLElement)
		expect(result!.outerHTML).toMatchInlineSnapshot(
			'"<ul class="files-list__system-tags" aria-label="Assigned collaborative tags" data-systemtags-fileid="1"><li class="files-list__system-tag">Important</li><li class="files-list__system-tag files-list__system-tag--more" title="Confidential, Secret, Classified" aria-hidden="true" role="presentation">+3</li><li class="files-list__system-tag hidden-visually">Confidential</li><li class="files-list__system-tag hidden-visually">Secret</li><li class="files-list__system-tag hidden-visually">Classified</li></ul>"',
		)
	})

	test('Render gets updated on system tag change', async () => {
		const file = new File({
			id: 1,
			source: 'http://localhost/remote.php/dav/files/admin/foobar.txt',
			owner: 'admin',
			mime: 'text/plain',
			permissions: Permission.ALL,
			attributes: {
				'system-tags': {
					'system-tag': [
						'Important',
						'Confidential',
						'Secret',
						'Classified',
					],
				},
			},
		})

		const result = await action.renderInline!(file, view) as HTMLElement
		document.body.appendChild(result)
		expect(result).toBeInstanceOf(HTMLElement)
		expect(document.body.innerHTML).toMatchInlineSnapshot(
			'"<ul class="files-list__system-tags" aria-label="Assigned collaborative tags" data-systemtags-fileid="1"><li class="files-list__system-tag">Important</li><li class="files-list__system-tag files-list__system-tag--more" title="Confidential, Secret, Classified" aria-hidden="true" role="presentation">+3</li><li class="files-list__system-tag hidden-visually">Confidential</li><li class="files-list__system-tag hidden-visually">Secret</li><li class="files-list__system-tag hidden-visually">Classified</li></ul>"',
		)

		// Subscribe to the event
		const eventPromise = new Promise((resolve) => {
			subscribe('systemtags:node:updated', resolve)
		})

		// Change tags
		setNodeSystemTags(file, ['Public'])
		emit('systemtags:node:updated', file)
		expect(file.attributes!['system-tags']!['system-tag']).toEqual(['Public'])

		// Wait for the event to be processed
		await eventPromise

		expect(document.body.innerHTML).toMatchInlineSnapshot(
			'"<ul class="files-list__system-tags" aria-label="Assigned collaborative tags" data-systemtags-fileid="1"><li class="files-list__system-tag">Public</li></ul>"',
		)
	})
})
