/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/files/src/logger.js":
/*!**********************************!*\
  !*** ./apps/files/src/logger.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/logger */ "./node_modules/@nextcloud/logger/dist/index.js");
/**
 * @copyright Copyright (c) 2022 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_nextcloud_logger__WEBPACK_IMPORTED_MODULE_0__.getLoggerBuilder)().setApp('files').detectUser().build());

/***/ }),

/***/ "./apps/files/src/actions/sidebarAction.ts":
/*!*************************************************!*\
  !*** ./apps/files/src/actions/sidebarAction.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTION_DETAILS: () => (/* binding */ ACTION_DETAILS),
/* harmony export */   action: () => (/* binding */ action)
/* harmony export */ });
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _mdi_svg_svg_information_variant_svg_raw__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mdi/svg/svg/information-variant.svg?raw */ "./node_modules/@mdi/svg/svg/information-variant.svg?raw");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../logger.js */ "./apps/files/src/logger.js");
/**
 * @copyright Copyright (c) 2023 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */




const ACTION_DETAILS = 'details';
const action = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.FileAction({
  id: ACTION_DETAILS,
  displayName: () => (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__.translate)('files', 'Open details'),
  iconSvgInline: () => _mdi_svg_svg_information_variant_svg_raw__WEBPACK_IMPORTED_MODULE_2__,
  // Sidebar currently supports user folder only, /files/USER
  enabled: nodes => {
    var _window, _ref, _nodes$0$root;
    // Only works on single node
    if (nodes.length !== 1) {
      return false;
    }
    if (!nodes[0]) {
      return false;
    }
    // Only work if the sidebar is available
    if (!((_window = window) !== null && _window !== void 0 && (_window = _window.OCA) !== null && _window !== void 0 && (_window = _window.Files) !== null && _window !== void 0 && _window.Sidebar)) {
      return false;
    }
    return (_ref = ((_nodes$0$root = nodes[0].root) === null || _nodes$0$root === void 0 ? void 0 : _nodes$0$root.startsWith('/files/')) && nodes[0].permissions !== _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.Permission.NONE) !== null && _ref !== void 0 ? _ref : false;
  },
  async exec(node, view, dir) {
    try {
      // TODO: migrate Sidebar to use a Node instead
      await window.OCA.Files.Sidebar.open(node.path);
      // Silently update current fileid
      window.OCP.Files.Router.goToRoute(null, {
        view: view.id,
        fileid: node.fileid
      }, {
        ...window.OCP.Files.Router.query,
        dir
      }, true);
      return null;
    } catch (error) {
      _logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].error('Error while opening sidebar', {
        error
      });
      return false;
    }
  },
  order: -50
});

/***/ }),

/***/ "./apps/files_sharing/src/actions/acceptShareAction.ts":
/*!*************************************************************!*\
  !*** ./apps/files_sharing/src/actions/acceptShareAction.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   action: () => (/* binding */ action)
/* harmony export */ });
/* harmony import */ var _nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/event-bus */ "./node_modules/@nextcloud/event-bus/dist/index.mjs");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.mjs");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.es.mjs");
/* harmony import */ var _mdi_svg_svg_check_svg_raw__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mdi/svg/svg/check.svg?raw */ "./node_modules/@mdi/svg/svg/check.svg?raw");
/* harmony import */ var _views_shares__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../views/shares */ "./apps/files_sharing/src/views/shares.ts");







const action = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_2__.FileAction({
  id: 'accept-share',
  displayName: nodes => (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translatePlural)('files_sharing', 'Accept share', 'Accept shares', nodes.length),
  iconSvgInline: () => _mdi_svg_svg_check_svg_raw__WEBPACK_IMPORTED_MODULE_5__,
  enabled: (nodes, view) => nodes.length > 0 && view.id === _views_shares__WEBPACK_IMPORTED_MODULE_6__.pendingSharesViewId,
  async exec(node) {
    try {
      const isRemote = !!node.attributes.remote;
      const url = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateOcsUrl)('apps/files_sharing/api/v1/{shareBase}/pending/{id}', {
        shareBase: isRemote ? 'remote_shares' : 'shares',
        id: node.attributes.id
      });
      await _nextcloud_axios__WEBPACK_IMPORTED_MODULE_4__["default"].post(url);
      // Remove from current view
      (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__.emit)('files:node:deleted', node);
      return true;
    } catch (error) {
      return false;
    }
  },
  async execBatch(nodes, view, dir) {
    return Promise.all(nodes.map(node => this.exec(node, view, dir)));
  },
  order: 1,
  inline: () => true
});
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_2__.registerFileAction)(action);

/***/ }),

/***/ "./apps/files_sharing/src/actions/openInFilesAction.ts":
/*!*************************************************************!*\
  !*** ./apps/files_sharing/src/actions/openInFilesAction.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   action: () => (/* binding */ action)
/* harmony export */ });
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _views_shares__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../views/shares */ "./apps/files_sharing/src/views/shares.ts");



const action = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.FileAction({
  id: 'open-in-files',
  displayName: () => (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__.translate)('files', 'Open in Files'),
  iconSvgInline: () => '',
  enabled: (nodes, view) => [_views_shares__WEBPACK_IMPORTED_MODULE_2__.sharesViewId, _views_shares__WEBPACK_IMPORTED_MODULE_2__.sharedWithYouViewId, _views_shares__WEBPACK_IMPORTED_MODULE_2__.sharedWithOthersViewId, _views_shares__WEBPACK_IMPORTED_MODULE_2__.sharingByLinksViewId
  // Deleted and pending shares are not
  // accessible in the files app.
  ].includes(view.id),
  async exec(node) {
    window.OCP.Files.Router.goToRoute(null,
    // use default route
    {
      view: 'files',
      fileid: node.fileid
    }, {
      dir: node.dirname,
      openfile: 'true'
    });
    return null;
  },
  // Before openFolderAction
  order: -1000,
  default: _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.DefaultType.HIDDEN
});
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerFileAction)(action);

/***/ }),

/***/ "./apps/files_sharing/src/actions/rejectShareAction.ts":
/*!*************************************************************!*\
  !*** ./apps/files_sharing/src/actions/rejectShareAction.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   action: () => (/* binding */ action)
/* harmony export */ });
/* harmony import */ var _nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/event-bus */ "./node_modules/@nextcloud/event-bus/dist/index.mjs");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.mjs");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.es.mjs");
/* harmony import */ var _mdi_svg_svg_close_svg_raw__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mdi/svg/svg/close.svg?raw */ "./node_modules/@mdi/svg/svg/close.svg?raw");
/* harmony import */ var _views_shares__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../views/shares */ "./apps/files_sharing/src/views/shares.ts");







const action = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_2__.FileAction({
  id: 'reject-share',
  displayName: nodes => (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translatePlural)('files_sharing', 'Reject share', 'Reject shares', nodes.length),
  iconSvgInline: () => _mdi_svg_svg_close_svg_raw__WEBPACK_IMPORTED_MODULE_5__,
  enabled: (nodes, view) => {
    if (view.id !== _views_shares__WEBPACK_IMPORTED_MODULE_6__.pendingSharesViewId) {
      return false;
    }
    if (nodes.length === 0) {
      return false;
    }
    // disable rejecting group shares from the pending list because they anyway
    // land back into that same list after rejecting them
    if (nodes.some(node => node.attributes.remote_id && node.attributes.share_type === window.OC.Share.SHARE_TYPE_REMOTE_GROUP)) {
      return false;
    }
    return true;
  },
  async exec(node) {
    try {
      const isRemote = !!node.attributes.remote;
      const url = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateOcsUrl)('apps/files_sharing/api/v1/{shareBase}/{id}', {
        shareBase: isRemote ? 'remote_shares' : 'shares',
        id: node.attributes.id
      });
      await _nextcloud_axios__WEBPACK_IMPORTED_MODULE_4__["default"].delete(url);
      // Remove from current view
      (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__.emit)('files:node:deleted', node);
      return true;
    } catch (error) {
      return false;
    }
  },
  async execBatch(nodes, view, dir) {
    return Promise.all(nodes.map(node => this.exec(node, view, dir)));
  },
  order: 2,
  inline: () => true
});
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_2__.registerFileAction)(action);

/***/ }),

/***/ "./apps/files_sharing/src/actions/restoreShareAction.ts":
/*!**************************************************************!*\
  !*** ./apps/files_sharing/src/actions/restoreShareAction.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   action: () => (/* binding */ action)
/* harmony export */ });
/* harmony import */ var _nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/event-bus */ "./node_modules/@nextcloud/event-bus/dist/index.mjs");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _mdi_svg_svg_arrow_u_left_top_svg_raw__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mdi/svg/svg/arrow-u-left-top.svg?raw */ "./node_modules/@mdi/svg/svg/arrow-u-left-top.svg?raw");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.es.mjs");
/* harmony import */ var _views_shares__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../views/shares */ "./apps/files_sharing/src/views/shares.ts");







const action = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.FileAction({
  id: 'restore-share',
  displayName: nodes => (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translatePlural)('files_sharing', 'Restore share', 'Restore shares', nodes.length),
  iconSvgInline: () => _mdi_svg_svg_arrow_u_left_top_svg_raw__WEBPACK_IMPORTED_MODULE_4__,
  enabled: (nodes, view) => nodes.length > 0 && view.id === _views_shares__WEBPACK_IMPORTED_MODULE_6__.deletedSharesViewId,
  async exec(node) {
    try {
      const url = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_2__.generateOcsUrl)('apps/files_sharing/api/v1/deletedshares/{id}', {
        id: node.attributes.id
      });
      await _nextcloud_axios__WEBPACK_IMPORTED_MODULE_5__["default"].post(url);
      // Remove from current view
      (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__.emit)('files:node:deleted', node);
      return true;
    } catch (error) {
      return false;
    }
  },
  async execBatch(nodes, view, dir) {
    return Promise.all(nodes.map(node => this.exec(node, view, dir)));
  },
  order: 1,
  inline: () => true
});
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.registerFileAction)(action);

/***/ }),

/***/ "./apps/files_sharing/src/actions/sharingStatusAction.ts":
/*!***************************************************************!*\
  !*** ./apps/files_sharing/src/actions/sharingStatusAction.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   action: () => (/* binding */ action)
/* harmony export */ });
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _nextcloud_sharing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/sharing */ "./node_modules/@nextcloud/sharing/dist/index.js");
/* harmony import */ var _mdi_svg_svg_account_group_svg_raw__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @mdi/svg/svg/account-group.svg?raw */ "./node_modules/@mdi/svg/svg/account-group.svg?raw");
/* harmony import */ var _mdi_svg_svg_account_plus_svg_raw__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mdi/svg/svg/account-plus.svg?raw */ "./node_modules/@mdi/svg/svg/account-plus.svg?raw");
/* harmony import */ var _mdi_svg_svg_link_svg_raw__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mdi/svg/svg/link.svg?raw */ "./node_modules/@mdi/svg/svg/link.svg?raw");
/* harmony import */ var _core_img_apps_circles_svg_raw__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../core/img/apps/circles.svg?raw */ "./core/img/apps/circles.svg?raw");
/* harmony import */ var _files_src_actions_sidebarAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../files/src/actions/sidebarAction */ "./apps/files/src/actions/sidebarAction.ts");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.mjs");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.mjs");
/* harmony import */ var _sharingStatusAction_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./sharingStatusAction.scss */ "./apps/files_sharing/src/actions/sharingStatusAction.scss");
var _window, _window$matchMedia;
/**
 * @copyright Copyright (c) 2023 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */











const isDarkMode = ((_window = window) === null || _window === void 0 || (_window$matchMedia = _window.matchMedia) === null || _window$matchMedia === void 0 || (_window$matchMedia = _window$matchMedia.call(_window, '(prefers-color-scheme: dark)')) === null || _window$matchMedia === void 0 ? void 0 : _window$matchMedia.matches) === true || document.querySelector('[data-themes*=dark]') !== null;
const generateAvatarSvg = function (userId) {
  let isGuest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const url = isDarkMode ? '/avatar/{userId}/32/dark' : '/avatar/{userId}/32';
  const avatarUrl = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_8__.generateUrl)(isGuest ? url : url + '?guestFallback=true', {
    userId
  });
  return "<svg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\"\n\t\txmlns=\"http://www.w3.org/2000/svg\" class=\"sharing-status__avatar\">\n\t\t<image href=\"".concat(avatarUrl, "\" height=\"32\" width=\"32\" />\n\t</svg>");
};
const isExternal = node => {
  return node.attributes.remote_id !== undefined;
};
const action = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.FileAction({
  id: 'sharing-status',
  displayName(nodes) {
    var _node$attributes, _node$attributes2, _getCurrentUser;
    const node = nodes[0];
    const shareTypes = Object.values((node === null || node === void 0 || (_node$attributes = node.attributes) === null || _node$attributes === void 0 ? void 0 : _node$attributes['share-types']) || {}).flat();
    const ownerId = node === null || node === void 0 || (_node$attributes2 = node.attributes) === null || _node$attributes2 === void 0 ? void 0 : _node$attributes2['owner-id'];
    if (shareTypes.length > 0 || ownerId !== ((_getCurrentUser = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_9__.getCurrentUser)()) === null || _getCurrentUser === void 0 ? void 0 : _getCurrentUser.uid) || isExternal(node)) {
      return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__.translate)('files_sharing', 'Shared');
    }
    return '';
  },
  title(nodes) {
    var _node$attributes3, _node$attributes4, _node$attributes5, _node$attributes6, _getCurrentUser2;
    const node = nodes[0];
    const ownerId = node === null || node === void 0 || (_node$attributes3 = node.attributes) === null || _node$attributes3 === void 0 ? void 0 : _node$attributes3['owner-id'];
    const ownerDisplayName = node === null || node === void 0 || (_node$attributes4 = node.attributes) === null || _node$attributes4 === void 0 ? void 0 : _node$attributes4['owner-display-name'];
    // Mixed share types
    if (Array.isArray((_node$attributes5 = node.attributes) === null || _node$attributes5 === void 0 ? void 0 : _node$attributes5['share-types']) && ((_node$attributes6 = node.attributes) === null || _node$attributes6 === void 0 ? void 0 : _node$attributes6['share-types'].length) > 1) {
      return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__.translate)('files_sharing', 'Shared multiple times with different people');
    }
    if (ownerId && (ownerId !== ((_getCurrentUser2 = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_9__.getCurrentUser)()) === null || _getCurrentUser2 === void 0 ? void 0 : _getCurrentUser2.uid) || isExternal(node))) {
      return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__.translate)('files_sharing', 'Shared by {ownerDisplayName}', {
        ownerDisplayName
      });
    }
    return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__.translate)('files_sharing', 'Show sharing options');
  },
  iconSvgInline(nodes) {
    var _node$attributes7, _node$attributes8, _node$attributes9, _node$attributes10, _getCurrentUser3;
    const node = nodes[0];
    const shareTypes = Object.values((node === null || node === void 0 || (_node$attributes7 = node.attributes) === null || _node$attributes7 === void 0 ? void 0 : _node$attributes7['share-types']) || {}).flat();
    // Mixed share types
    if (Array.isArray((_node$attributes8 = node.attributes) === null || _node$attributes8 === void 0 ? void 0 : _node$attributes8['share-types']) && ((_node$attributes9 = node.attributes) === null || _node$attributes9 === void 0 ? void 0 : _node$attributes9['share-types'].length) > 1) {
      return _mdi_svg_svg_account_plus_svg_raw__WEBPACK_IMPORTED_MODULE_4__;
    }
    // Link shares
    if (shareTypes.includes(_nextcloud_sharing__WEBPACK_IMPORTED_MODULE_2__.Type.SHARE_TYPE_LINK) || shareTypes.includes(_nextcloud_sharing__WEBPACK_IMPORTED_MODULE_2__.Type.SHARE_TYPE_EMAIL)) {
      return _mdi_svg_svg_link_svg_raw__WEBPACK_IMPORTED_MODULE_5__;
    }
    // Group shares
    if (shareTypes.includes(_nextcloud_sharing__WEBPACK_IMPORTED_MODULE_2__.Type.SHARE_TYPE_GROUP) || shareTypes.includes(_nextcloud_sharing__WEBPACK_IMPORTED_MODULE_2__.Type.SHARE_TYPE_REMOTE_GROUP)) {
      return _mdi_svg_svg_account_group_svg_raw__WEBPACK_IMPORTED_MODULE_3__;
    }
    // Circle shares
    if (shareTypes.includes(_nextcloud_sharing__WEBPACK_IMPORTED_MODULE_2__.Type.SHARE_TYPE_CIRCLE)) {
      return _core_img_apps_circles_svg_raw__WEBPACK_IMPORTED_MODULE_6__;
    }
    const ownerId = node === null || node === void 0 || (_node$attributes10 = node.attributes) === null || _node$attributes10 === void 0 ? void 0 : _node$attributes10['owner-id'];
    if (ownerId && (ownerId !== ((_getCurrentUser3 = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_9__.getCurrentUser)()) === null || _getCurrentUser3 === void 0 ? void 0 : _getCurrentUser3.uid) || isExternal(node))) {
      return generateAvatarSvg(ownerId, isExternal(node));
    }
    return _mdi_svg_svg_account_plus_svg_raw__WEBPACK_IMPORTED_MODULE_4__;
  },
  enabled(nodes) {
    var _node$attributes11, _node$attributes12, _getCurrentUser4;
    if (nodes.length !== 1) {
      return false;
    }
    const node = nodes[0];
    const ownerId = node === null || node === void 0 || (_node$attributes11 = node.attributes) === null || _node$attributes11 === void 0 ? void 0 : _node$attributes11['owner-id'];
    const isMixed = Array.isArray((_node$attributes12 = node.attributes) === null || _node$attributes12 === void 0 ? void 0 : _node$attributes12['share-types']);
    // If the node is shared multiple times with
    // different share types to the current user
    if (isMixed) {
      return true;
    }
    // If the node is shared by someone else
    if (ownerId && (ownerId !== ((_getCurrentUser4 = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_9__.getCurrentUser)()) === null || _getCurrentUser4 === void 0 ? void 0 : _getCurrentUser4.uid) || isExternal(node))) {
      return true;
    }
    return (node.permissions & _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.Permission.SHARE) !== 0;
  },
  async exec(node, view, dir) {
    // You need read permissions to see the sidebar
    if ((node.permissions & _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.Permission.READ) !== 0) {
      var _window$OCA, _window$OCA$setActive;
      (_window$OCA = window.OCA) === null || _window$OCA === void 0 || (_window$OCA = _window$OCA.Files) === null || _window$OCA === void 0 || (_window$OCA = _window$OCA.Sidebar) === null || _window$OCA === void 0 || (_window$OCA$setActive = _window$OCA.setActiveTab) === null || _window$OCA$setActive === void 0 || _window$OCA$setActive.call(_window$OCA, 'sharing');
      return _files_src_actions_sidebarAction__WEBPACK_IMPORTED_MODULE_7__.action.exec(node, view, dir);
    }
    return null;
  },
  inline: () => true
});
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerFileAction)(action);

/***/ }),

/***/ "./apps/files_sharing/src/init.ts":
/*!****************************************!*\
  !*** ./apps/files_sharing/src/init.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _views_shares__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./views/shares */ "./apps/files_sharing/src/views/shares.ts");
/* harmony import */ var _actions_acceptShareAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./actions/acceptShareAction */ "./apps/files_sharing/src/actions/acceptShareAction.ts");
/* harmony import */ var _actions_openInFilesAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actions/openInFilesAction */ "./apps/files_sharing/src/actions/openInFilesAction.ts");
/* harmony import */ var _actions_rejectShareAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./actions/rejectShareAction */ "./apps/files_sharing/src/actions/rejectShareAction.ts");
/* harmony import */ var _actions_restoreShareAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./actions/restoreShareAction */ "./apps/files_sharing/src/actions/restoreShareAction.ts");
/* harmony import */ var _actions_sharingStatusAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./actions/sharingStatusAction */ "./apps/files_sharing/src/actions/sharingStatusAction.ts");
/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 * @author Julius Härtl <jus@bitgrid.net>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */







(0,_views_shares__WEBPACK_IMPORTED_MODULE_1__["default"])();
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerDavProperty)('nc:share-attributes', {
  nc: 'http://nextcloud.org/ns'
});
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerDavProperty)('oc:share-types', {
  oc: 'http://owncloud.org/ns'
});
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerDavProperty)('ocs:share-permissions', {
  ocs: 'http://open-collaboration-services.org/ns'
});

/***/ }),

/***/ "./apps/files_sharing/src/services/SharingService.ts":
/*!***********************************************************!*\
  !*** ./apps/files_sharing/src/services/SharingService.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getContents: () => (/* binding */ getContents),
/* harmony export */   rootPath: () => (/* binding */ rootPath)
/* harmony export */ });
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.mjs");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.mjs");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.es.mjs");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./logger */ "./apps/files_sharing/src/services/logger.ts");
var _getCurrentUser;





const rootPath = "/files/".concat((_getCurrentUser = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__.getCurrentUser)()) === null || _getCurrentUser === void 0 ? void 0 : _getCurrentUser.uid);
const headers = {
  'Content-Type': 'application/json'
};
const ocsEntryToNode = async function (ocsEntry) {
  try {
    var _ocsEntry$tags;
    // Federated share handling
    if ((ocsEntry === null || ocsEntry === void 0 ? void 0 : ocsEntry.remote_id) !== undefined) {
      const mime = (await __webpack_require__.e(/*! import() */ "node_modules_mime_dist_src_index_js").then(__webpack_require__.bind(__webpack_require__, /*! mime */ "./node_modules/mime/dist/src/index.js"))).default;
      // This won't catch files without an extension, but this is the best we can do
      ocsEntry.mimetype = mime.getType(ocsEntry.name);
      ocsEntry.item_type = ocsEntry.mimetype ? 'file' : 'folder';
      // Need to set permissions to NONE for federated shares
      ocsEntry.item_permissions = _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.Permission.NONE;
      ocsEntry.permissions = _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.Permission.NONE;
      ocsEntry.uid_owner = ocsEntry.owner;
      // TODO: have the real display name stored somewhere
      ocsEntry.displayname_owner = ocsEntry.owner;
    }
    const isFolder = (ocsEntry === null || ocsEntry === void 0 ? void 0 : ocsEntry.item_type) === 'folder';
    const hasPreview = (ocsEntry === null || ocsEntry === void 0 ? void 0 : ocsEntry.has_preview) === true;
    const Node = isFolder ? _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.Folder : _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.File;
    // If this is an external share that is not yet accepted,
    // we don't have an id. We can fallback to the row id temporarily
    const fileid = ocsEntry.file_source || ocsEntry.id;
    // Generate path and strip double slashes
    const path = (ocsEntry === null || ocsEntry === void 0 ? void 0 : ocsEntry.path) || ocsEntry.file_target || ocsEntry.name;
    const source = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateRemoteUrl)("dav/".concat(rootPath, "/").concat(path).replaceAll(/\/\//gm, '/'));
    // Prefer share time if more recent than item mtime
    let mtime = ocsEntry !== null && ocsEntry !== void 0 && ocsEntry.item_mtime ? new Date(ocsEntry.item_mtime * 1000) : undefined;
    if ((ocsEntry === null || ocsEntry === void 0 ? void 0 : ocsEntry.stime) > ((ocsEntry === null || ocsEntry === void 0 ? void 0 : ocsEntry.item_mtime) || 0)) {
      mtime = new Date(ocsEntry.stime * 1000);
    }
    return new Node({
      id: fileid,
      source,
      owner: ocsEntry === null || ocsEntry === void 0 ? void 0 : ocsEntry.uid_owner,
      mime: (ocsEntry === null || ocsEntry === void 0 ? void 0 : ocsEntry.mimetype) || 'application/octet-stream',
      mtime,
      size: ocsEntry === null || ocsEntry === void 0 ? void 0 : ocsEntry.item_size,
      permissions: (ocsEntry === null || ocsEntry === void 0 ? void 0 : ocsEntry.item_permissions) || (ocsEntry === null || ocsEntry === void 0 ? void 0 : ocsEntry.permissions),
      root: rootPath,
      attributes: {
        ...ocsEntry,
        'has-preview': hasPreview,
        // Also check the sharingStatusAction.ts code
        'owner-id': ocsEntry === null || ocsEntry === void 0 ? void 0 : ocsEntry.uid_owner,
        'owner-display-name': ocsEntry === null || ocsEntry === void 0 ? void 0 : ocsEntry.displayname_owner,
        'share-types': ocsEntry === null || ocsEntry === void 0 ? void 0 : ocsEntry.share_type,
        favorite: ocsEntry !== null && ocsEntry !== void 0 && (_ocsEntry$tags = ocsEntry.tags) !== null && _ocsEntry$tags !== void 0 && _ocsEntry$tags.includes(window.OC.TAG_FAVORITE) ? 1 : 0
      }
    });
  } catch (error) {
    _logger__WEBPACK_IMPORTED_MODULE_4__["default"].error('Error while parsing OCS entry', {
      error
    });
    return null;
  }
};
const getShares = function () {
  let shared_with_me = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  const url = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateOcsUrl)('apps/files_sharing/api/v1/shares');
  return _nextcloud_axios__WEBPACK_IMPORTED_MODULE_3__["default"].get(url, {
    headers,
    params: {
      shared_with_me,
      include_tags: true
    }
  });
};
const getSharedWithYou = function () {
  return getShares(true);
};
const getSharedWithOthers = function () {
  return getShares();
};
const getRemoteShares = function () {
  const url = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateOcsUrl)('apps/files_sharing/api/v1/remote_shares');
  return _nextcloud_axios__WEBPACK_IMPORTED_MODULE_3__["default"].get(url, {
    headers,
    params: {
      include_tags: true
    }
  });
};
const getPendingShares = function () {
  const url = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateOcsUrl)('apps/files_sharing/api/v1/shares/pending');
  return _nextcloud_axios__WEBPACK_IMPORTED_MODULE_3__["default"].get(url, {
    headers,
    params: {
      include_tags: true
    }
  });
};
const getRemotePendingShares = function () {
  const url = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateOcsUrl)('apps/files_sharing/api/v1/remote_shares/pending');
  return _nextcloud_axios__WEBPACK_IMPORTED_MODULE_3__["default"].get(url, {
    headers,
    params: {
      include_tags: true
    }
  });
};
const getDeletedShares = function () {
  const url = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateOcsUrl)('apps/files_sharing/api/v1/deletedshares');
  return _nextcloud_axios__WEBPACK_IMPORTED_MODULE_3__["default"].get(url, {
    headers,
    params: {
      include_tags: true
    }
  });
};
/**
 * Group an array of objects (here Nodes) by a key
 * and return an array of arrays of them.
 */
const groupBy = function (nodes, key) {
  return Object.values(nodes.reduce(function (acc, curr) {
    (acc[curr[key]] = acc[curr[key]] || []).push(curr);
    return acc;
  }, {}));
};
const getContents = async function () {
  var _getCurrentUser2;
  let sharedWithYou = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  let sharedWithOthers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  let pendingShares = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  let deletedshares = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  let filterTypes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  const promises = [];
  if (sharedWithYou) {
    promises.push(getSharedWithYou(), getRemoteShares());
  }
  if (sharedWithOthers) {
    promises.push(getSharedWithOthers());
  }
  if (pendingShares) {
    promises.push(getPendingShares(), getRemotePendingShares());
  }
  if (deletedshares) {
    promises.push(getDeletedShares());
  }
  const responses = await Promise.all(promises);
  const data = responses.map(response => response.data.ocs.data).flat();
  let contents = (await Promise.all(data.map(ocsEntryToNode))).filter(node => node !== null);
  if (filterTypes.length > 0) {
    contents = contents.filter(node => {
      var _node$attributes;
      return filterTypes.includes((_node$attributes = node.attributes) === null || _node$attributes === void 0 ? void 0 : _node$attributes.share_type);
    });
  }
  // Merge duplicate shares and group their attributes
  // Also check the sharingStatusAction.ts code
  contents = groupBy(contents, 'source').map(nodes => {
    const node = nodes[0];
    node.attributes['share-types'] = nodes.map(node => node.attributes['share-types']);
    return node;
  });
  return {
    folder: new _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.Folder({
      id: 0,
      source: (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateRemoteUrl)('dav' + rootPath),
      owner: ((_getCurrentUser2 = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__.getCurrentUser)()) === null || _getCurrentUser2 === void 0 ? void 0 : _getCurrentUser2.uid) || null
    }),
    contents
  };
};

/***/ }),

/***/ "./apps/files_sharing/src/services/logger.ts":
/*!***************************************************!*\
  !*** ./apps/files_sharing/src/services/logger.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/logger */ "./node_modules/@nextcloud/logger/dist/index.js");
/**
 * @copyright Copyright (c) 2022 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_nextcloud_logger__WEBPACK_IMPORTED_MODULE_0__.getLoggerBuilder)().setApp('files_sharing').detectUser().build());

/***/ }),

/***/ "./apps/files_sharing/src/views/shares.ts":
/*!************************************************!*\
  !*** ./apps/files_sharing/src/views/shares.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   deletedSharesViewId: () => (/* binding */ deletedSharesViewId),
/* harmony export */   pendingSharesViewId: () => (/* binding */ pendingSharesViewId),
/* harmony export */   sharedWithOthersViewId: () => (/* binding */ sharedWithOthersViewId),
/* harmony export */   sharedWithYouViewId: () => (/* binding */ sharedWithYouViewId),
/* harmony export */   sharesViewId: () => (/* binding */ sharesViewId),
/* harmony export */   sharingByLinksViewId: () => (/* binding */ sharingByLinksViewId)
/* harmony export */ });
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _mdi_svg_svg_account_clock_svg_raw__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mdi/svg/svg/account-clock.svg?raw */ "./node_modules/@mdi/svg/svg/account-clock.svg?raw");
/* harmony import */ var _mdi_svg_svg_account_group_svg_raw__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @mdi/svg/svg/account-group.svg?raw */ "./node_modules/@mdi/svg/svg/account-group.svg?raw");
/* harmony import */ var _mdi_svg_svg_account_plus_svg_raw__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mdi/svg/svg/account-plus.svg?raw */ "./node_modules/@mdi/svg/svg/account-plus.svg?raw");
/* harmony import */ var _mdi_svg_svg_account_svg_raw__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mdi/svg/svg/account.svg?raw */ "./node_modules/@mdi/svg/svg/account.svg?raw");
/* harmony import */ var _mdi_svg_svg_delete_svg_raw__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mdi/svg/svg/delete.svg?raw */ "./node_modules/@mdi/svg/svg/delete.svg?raw");
/* harmony import */ var _mdi_svg_svg_link_svg_raw__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @mdi/svg/svg/link.svg?raw */ "./node_modules/@mdi/svg/svg/link.svg?raw");
/* harmony import */ var _services_SharingService__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../services/SharingService */ "./apps/files_sharing/src/services/SharingService.ts");
/**
 * @copyright Copyright (c) 2023 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */









const sharesViewId = 'shareoverview';
const sharedWithYouViewId = 'sharingin';
const sharedWithOthersViewId = 'sharingout';
const sharingByLinksViewId = 'sharinglinks';
const deletedSharesViewId = 'deletedshares';
const pendingSharesViewId = 'pendingshares';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  const Navigation = (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.getNavigation)();
  Navigation.register(new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.View({
    id: sharesViewId,
    name: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'Shares'),
    caption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'Overview of shared files.'),
    emptyTitle: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'No shares'),
    emptyCaption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'Files and folders you shared or have been shared with you will show up here'),
    icon: _mdi_svg_svg_account_plus_svg_raw__WEBPACK_IMPORTED_MODULE_4__,
    order: 20,
    columns: [],
    getContents: () => (0,_services_SharingService__WEBPACK_IMPORTED_MODULE_8__.getContents)()
  }));
  Navigation.register(new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.View({
    id: sharedWithYouViewId,
    name: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'Shared with you'),
    caption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'List of files that are shared with you.'),
    emptyTitle: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'Nothing shared with you yet'),
    emptyCaption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'Files and folders others shared with you will show up here'),
    icon: _mdi_svg_svg_account_svg_raw__WEBPACK_IMPORTED_MODULE_5__,
    order: 1,
    parent: sharesViewId,
    columns: [],
    getContents: () => (0,_services_SharingService__WEBPACK_IMPORTED_MODULE_8__.getContents)(true, false, false, false)
  }));
  Navigation.register(new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.View({
    id: sharedWithOthersViewId,
    name: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'Shared with others'),
    caption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'List of files that you shared with others.'),
    emptyTitle: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'Nothing shared yet'),
    emptyCaption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'Files and folders you shared will show up here'),
    icon: _mdi_svg_svg_account_group_svg_raw__WEBPACK_IMPORTED_MODULE_3__,
    order: 2,
    parent: sharesViewId,
    columns: [],
    getContents: () => (0,_services_SharingService__WEBPACK_IMPORTED_MODULE_8__.getContents)(false, true, false, false)
  }));
  Navigation.register(new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.View({
    id: sharingByLinksViewId,
    name: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'Shared by link'),
    caption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'List of files that are shared by link.'),
    emptyTitle: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'No shared links'),
    emptyCaption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'Files and folders you shared by link will show up here'),
    icon: _mdi_svg_svg_link_svg_raw__WEBPACK_IMPORTED_MODULE_7__,
    order: 3,
    parent: sharesViewId,
    columns: [],
    getContents: () => (0,_services_SharingService__WEBPACK_IMPORTED_MODULE_8__.getContents)(false, true, false, false, [window.OC.Share.SHARE_TYPE_LINK])
  }));
  Navigation.register(new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.View({
    id: deletedSharesViewId,
    name: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'Deleted shares'),
    caption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'List of shares you left.'),
    emptyTitle: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'No deleted shares'),
    emptyCaption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'Shares you have left will show up here'),
    icon: _mdi_svg_svg_delete_svg_raw__WEBPACK_IMPORTED_MODULE_6__,
    order: 4,
    parent: sharesViewId,
    columns: [],
    getContents: () => (0,_services_SharingService__WEBPACK_IMPORTED_MODULE_8__.getContents)(false, false, false, true)
  }));
  Navigation.register(new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.View({
    id: pendingSharesViewId,
    name: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'Pending shares'),
    caption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'List of unapproved shares.'),
    emptyTitle: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'No pending shares'),
    emptyCaption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files_sharing', 'Shares you have received but not approved will show up here'),
    icon: _mdi_svg_svg_account_clock_svg_raw__WEBPACK_IMPORTED_MODULE_2__,
    order: 5,
    parent: sharesViewId,
    columns: [],
    getContents: () => (0,_services_SharingService__WEBPACK_IMPORTED_MODULE_8__.getContents)(false, false, true, false)
  }));
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./apps/files_sharing/src/actions/sharingStatusAction.scss":
/*!**********************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./apps/files_sharing/src/actions/sharingStatusAction.scss ***!
  \**********************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@charset "UTF-8";
/**
 * @copyright Copyright (c) 2023 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
.action-items > .files-list__row-action-sharing-status {
  direction: rtl;
  padding-right: 0 !important;
}

svg.sharing-status__avatar {
  height: 32px !important;
  width: 32px !important;
  max-height: 32px !important;
  max-width: 32px !important;
  border-radius: 32px;
  overflow: hidden;
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./apps/files_sharing/src/actions/sharingStatusAction.scss":
/*!*****************************************************************!*\
  !*** ./apps/files_sharing/src/actions/sharingStatusAction.scss ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_sharingStatusAction_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!../../../../node_modules/sass-loader/dist/cjs.js!./sharingStatusAction.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./apps/files_sharing/src/actions/sharingStatusAction.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_sharingStatusAction_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_sharingStatusAction_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_sharingStatusAction_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_sharingStatusAction_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./core/img/apps/circles.svg?raw":
/*!***************************************!*\
  !*** ./core/img/apps/circles.svg?raw ***!
  \***************************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/account-clock.svg?raw":
/*!*********************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/account-clock.svg?raw ***!
  \*********************************************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-account-clock\" viewBox=\"0 0 24 24\"><path d=\"M10.63,14.1C12.23,10.58 16.38,9.03 19.9,10.63C23.42,12.23 24.97,16.38 23.37,19.9C22.24,22.4 19.75,24 17,24C14.3,24 11.83,22.44 10.67,20H1V18C1.06,16.86 1.84,15.93 3.34,15.18C4.84,14.43 6.72,14.04 9,14C9.57,14 10.11,14.05 10.63,14.1V14.1M9,4C10.12,4.03 11.06,4.42 11.81,5.17C12.56,5.92 12.93,6.86 12.93,8C12.93,9.14 12.56,10.08 11.81,10.83C11.06,11.58 10.12,11.95 9,11.95C7.88,11.95 6.94,11.58 6.19,10.83C5.44,10.08 5.07,9.14 5.07,8C5.07,6.86 5.44,5.92 6.19,5.17C6.94,4.42 7.88,4.03 9,4M17,22A5,5 0 0,0 22,17A5,5 0 0,0 17,12A5,5 0 0,0 12,17A5,5 0 0,0 17,22M16,14H17.5V16.82L19.94,18.23L19.19,19.53L16,17.69V14Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/account-group.svg?raw":
/*!*********************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/account-group.svg?raw ***!
  \*********************************************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-account-group\" viewBox=\"0 0 24 24\"><path d=\"M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/account-plus.svg?raw":
/*!********************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/account-plus.svg?raw ***!
  \********************************************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-account-plus\" viewBox=\"0 0 24 24\"><path d=\"M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/account.svg?raw":
/*!***************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/account.svg?raw ***!
  \***************************************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-account\" viewBox=\"0 0 24 24\"><path d=\"M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/arrow-u-left-top.svg?raw":
/*!************************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/arrow-u-left-top.svg?raw ***!
  \************************************************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-arrow-u-left-top\" viewBox=\"0 0 24 24\"><path d=\"M20 13.5C20 17.09 17.09 20 13.5 20H6V18H13.5C16 18 18 16 18 13.5S16 9 13.5 9H7.83L10.91 12.09L9.5 13.5L4 8L9.5 2.5L10.92 3.91L7.83 7H13.5C17.09 7 20 9.91 20 13.5Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/check.svg?raw":
/*!*************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/check.svg?raw ***!
  \*************************************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-check\" viewBox=\"0 0 24 24\"><path d=\"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/close.svg?raw":
/*!*************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/close.svg?raw ***!
  \*************************************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-close\" viewBox=\"0 0 24 24\"><path d=\"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/delete.svg?raw":
/*!**************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/delete.svg?raw ***!
  \**************************************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-delete\" viewBox=\"0 0 24 24\"><path d=\"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/link.svg?raw":
/*!************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/link.svg?raw ***!
  \************************************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-link\" viewBox=\"0 0 24 24\"><path d=\"M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z\" /></svg>";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "-" + chunkId + ".js?v=" + "879cdfe808888dd61e8a" + "";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "nextcloud:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"files_sharing-init": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunknextcloud"] = self["webpackChunknextcloud"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["core-common"], () => (__webpack_require__("./apps/files_sharing/src/init.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=files_sharing-init.js.map?v=77663bd8e85c1fcce423