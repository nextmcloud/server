/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { File, Folder, Permission } from '@nextcloud/files'
import { describe, expect, it } from 'vitest'
import { usePreviewImage } from './usePreviewImage.ts'

const mtime = new Date('2026-10-04T21:22:22Z')

/**
 * Build a file node as the views construct them.
 *
 * @param attributes - Node attributes, e.g. the etag or a view specific preview URL
 */
function createFile(attributes: Record<string, unknown>): File {
	return new File({
		id: 931,
		source: 'http://nextcloud.local/remote.php/dav/files/user/image.png',
		owner: 'user',
		mime: 'image/png',
		mtime,
		permissions: Permission.READ,
		root: '/files/user',
		attributes: { 'has-preview': true, ...attributes },
	})
}

describe('composable: usePreviewImage', () => {
	it('uses the etag as cache buster', () => {
		const url = new URL(usePreviewImage(createFile({ etag: 'ad2f0b51ceaec9104ee8524bb51b9ab1' })).value!)
		expect(url.pathname).toMatch(/\/core\/preview$/)
		expect(url.searchParams.get('v')).toBe('ad2f0b')
	})

	it('falls back to the mtime when the node has no etag', () => {
		// Trashbin nodes get a null etag, shares API nodes have none at all
		for (const attributes of [{ etag: null }, {}]) {
			const url = new URL(usePreviewImage(createFile(attributes)).value!)
			expect(url.pathname).toMatch(/\/core\/preview$/)
			expect(url.searchParams.get('v')).toBe(String(mtime.getTime()).slice(0, 6))
		}
	})

	it('keeps a view provided preview URL', () => {
		const url = new URL(usePreviewImage(createFile({
			etag: null,
			previewUrl: '/apps/files_trashbin/preview?fileId=931&x=32&y=32',
		})).value!)
		expect(url.pathname).toMatch(/\/apps\/files_trashbin\/preview$/)
		expect(url.searchParams.get('fileId')).toBe('931')
	})

	it('falls back to a mime icon when the node has no preview', () => {
		const node = createFile({ 'has-preview': false, etag: null })
		expect(usePreviewImage(node).value).toContain('/core/mimeicon?mime=image%2Fpng')
	})

	it('returns nothing for folders', () => {
		const folder = new Folder({
			id: 913,
			source: 'http://nextcloud.local/remote.php/dav/files/user/folder',
			owner: 'user',
			permissions: Permission.READ,
			root: '/files/user',
		})
		expect(usePreviewImage(folder).value).toBeUndefined()
	})
})
