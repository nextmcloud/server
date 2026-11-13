/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCSPNonce } from '@nextcloud/auth'
import { n, t } from '@nextcloud/l10n'
import Vue from 'vue'

import ExternalShareActions from './services/ExternalShareActions.js'
import ShareSearch from './services/ShareSearch.js'
import TabSections from './services/TabSections.js'

// eslint-disable-next-line camelcase
__webpack_nonce__ = getCSPNonce()

// Init Sharing services
window.OCA.Sharing ??= {}

Object.assign(window.OCA.Sharing, { ShareSearch: new ShareSearch() })
Object.assign(window.OCA.Sharing, { ExternalShareActions: new ExternalShareActions() })
Object.assign(window.OCA.Sharing, { ShareTabSections: new TabSections() })

Vue.prototype.t = t
Vue.prototype.n = n
