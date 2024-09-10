/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@nextcloud/upload/node_modules/eventemitter3/index.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@nextcloud/upload/node_modules/eventemitter3/index.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ "./apps/files/src/logger.js":
/*!**********************************!*\
  !*** ./apps/files/src/logger.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./apps/files/src/services/ServiceWorker.js":
/*!**************************************************!*\
  !*** ./apps/files/src/services/ServiceWorker.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.mjs");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../logger.js */ "./apps/files/src/logger.js");
/**
 * @copyright Copyright (c) 2019 Gary Kim <gary@garykim.dev>
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', async () => {
      try {
        const url = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__.generateUrl)('/apps/files/preview-service-worker.js', {}, {
          noRewrite: true
        });
        const registration = await navigator.serviceWorker.register(url, {
          scope: '/'
        });
        _logger_js__WEBPACK_IMPORTED_MODULE_1__["default"].debug('SW registered: ', {
          registration
        });
      } catch (error) {
        _logger_js__WEBPACK_IMPORTED_MODULE_1__["default"].error('SW registration failed: ', {
          error
        });
      }
    });
  } else {
    _logger_js__WEBPACK_IMPORTED_MODULE_1__["default"].debug('Service Worker is not enabled on this browser.');
  }
});

/***/ }),

/***/ "./apps/files/src/actions/deleteAction.ts":
/*!************************************************!*\
  !*** ./apps/files/src/actions/deleteAction.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   action: () => (/* binding */ action)
/* harmony export */ });
/* harmony import */ var _nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/event-bus */ "./node_modules/@nextcloud/event-bus/dist/index.mjs");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.es.mjs");
/* harmony import */ var _mdi_svg_svg_close_svg_raw__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mdi/svg/svg/close.svg?raw */ "./node_modules/@mdi/svg/svg/close.svg?raw");
/* harmony import */ var _mdi_svg_svg_network_off_svg_raw__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mdi/svg/svg/network-off.svg?raw */ "./node_modules/@mdi/svg/svg/network-off.svg?raw");
/* harmony import */ var _mdi_svg_svg_trash_can_svg_raw__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @mdi/svg/svg/trash-can.svg?raw */ "./node_modules/@mdi/svg/svg/trash-can.svg?raw");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../logger.js */ "./apps/files/src/logger.js");
/* harmony import */ var p_queue__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! p-queue */ "./node_modules/p-queue/dist/index.js");
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










const canUnshareOnly = nodes => {
  return nodes.every(node => node.attributes['is-mount-root'] === true && node.attributes['mount-type'] === 'shared');
};
const canDisconnectOnly = nodes => {
  return nodes.every(node => node.attributes['is-mount-root'] === true && node.attributes['mount-type'] === 'external');
};
const isMixedUnshareAndDelete = nodes => {
  if (nodes.length === 1) {
    return false;
  }
  const hasSharedItems = nodes.some(node => canUnshareOnly([node]));
  const hasDeleteItems = nodes.some(node => !canUnshareOnly([node]));
  return hasSharedItems && hasDeleteItems;
};
const isAllFiles = nodes => {
  return !nodes.some(node => node.type !== _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.FileType.File);
};
const isAllFolders = nodes => {
  return !nodes.some(node => node.type !== _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.FileType.Folder);
};
const displayName = (nodes, view) => {
  /**
   * If we're in the trashbin, we can only delete permanently
   */
  if (view.id === 'trashbin') {
    return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Delete permanently');
  }
  /**
   * If we're in the sharing view, we can only unshare
   */
  if (isMixedUnshareAndDelete(nodes)) {
    return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Delete and unshare');
  }
  /**
   * If those nodes are all the root node of a
   * share, we can only unshare them.
   */
  if (canUnshareOnly(nodes)) {
    if (nodes.length === 1) {
      return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Leave this share');
    }
    return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Leave these shares');
  }
  /**
   * If those nodes are all the root node of an
   * external storage, we can only disconnect it.
   */
  if (canDisconnectOnly(nodes)) {
    if (nodes.length === 1) {
      return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Disconnect storage');
    }
    return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Disconnect storages');
  }
  /**
   * If we're only selecting files, use proper wording
   */
  if (isAllFiles(nodes)) {
    if (nodes.length === 1) {
      return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Delete file');
    }
    return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Delete files');
  }
  /**
   * If we're only selecting folders, use proper wording
   */
  if (isAllFolders(nodes)) {
    if (nodes.length === 1) {
      return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Delete folder');
    }
    return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Delete folders');
  }
  return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Delete');
};
const queue = new p_queue__WEBPACK_IMPORTED_MODULE_9__["default"]({
  concurrency: 5
});
const action = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.FileAction({
  id: 'delete',
  displayName,
  iconSvgInline: nodes => {
    if (canUnshareOnly(nodes)) {
      return _mdi_svg_svg_close_svg_raw__WEBPACK_IMPORTED_MODULE_5__;
    }
    if (canDisconnectOnly(nodes)) {
      return _mdi_svg_svg_network_off_svg_raw__WEBPACK_IMPORTED_MODULE_6__;
    }
    return _mdi_svg_svg_trash_can_svg_raw__WEBPACK_IMPORTED_MODULE_7__;
  },
  enabled(nodes) {
    return nodes.length > 0 && nodes.map(node => node.permissions).every(permission => (permission & _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.Permission.DELETE) !== 0);
  },
  async exec(node, view, dir) {
    try {
      await _nextcloud_axios__WEBPACK_IMPORTED_MODULE_4__["default"].delete(node.encodedSource);
      // Let's delete even if it's moved to the trashbin
      // since it has been removed from the current view
      // and changing the view will trigger a reload anyway.
      (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__.emit)('files:node:deleted', node);
      return true;
    } catch (error) {
      _logger_js__WEBPACK_IMPORTED_MODULE_8__["default"].error('Error while deleting a file', {
        error,
        source: node.source,
        node
      });
      return false;
    }
  },
  async execBatch(nodes, view, dir) {
    const confirm = await new Promise(resolve => {
      if (nodes.length >= 5 && !canUnshareOnly(nodes) && !canDisconnectOnly(nodes)) {
        // TODO use a proper dialog from @nextcloud/dialogs when available
        window.OC.dialogs.confirmDestructive((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'You are about to delete {count} items.', {
          count: nodes.length
        }), (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Confirm deletion'), {
          type: window.OC.dialogs.YES_NO_BUTTONS,
          confirm: displayName(nodes, view),
          confirmClasses: 'error',
          cancel: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Cancel')
        }, decision => {
          resolve(decision);
        });
        return;
      }
      resolve(true);
    });
    // If the user cancels the deletion, we don't want to do anything
    if (confirm === false) {
      (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_2__.showInfo)((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Deletion cancelled'));
      return Promise.all(nodes.map(() => false));
    }
    // Map each node to a promise that resolves with the result of exec(node)
    const promises = nodes.map(node => {
      // Create a promise that resolves with the result of exec(node)
      const promise = new Promise(resolve => {
        queue.add(async () => {
          const result = await this.exec(node, view, dir);
          resolve(result !== null ? result : false);
        });
      });
      return promise;
    });
    return Promise.all(promises);
  },
  order: 100
});

/***/ }),

/***/ "./apps/files/src/actions/downloadAction.ts":
/*!**************************************************!*\
  !*** ./apps/files/src/actions/downloadAction.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   action: () => (/* binding */ action)
/* harmony export */ });
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.mjs");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _mdi_svg_svg_arrow_down_svg_raw__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @mdi/svg/svg/arrow-down.svg?raw */ "./node_modules/@mdi/svg/svg/arrow-down.svg?raw");
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




const triggerDownload = function (url) {
  const hiddenElement = document.createElement('a');
  hiddenElement.download = '';
  hiddenElement.href = url;
  hiddenElement.click();
};
const downloadNodes = function (dir, nodes) {
  const secret = Math.random().toString(36).substring(2);
  const url = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__.generateUrl)('/apps/files/ajax/download.php?dir={dir}&files={files}&downloadStartSecret={secret}', {
    dir,
    secret,
    files: JSON.stringify(nodes.map(node => node.basename))
  });
  triggerDownload(url);
};
const isDownloadable = function (node) {
  if ((node.permissions & _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.Permission.READ) === 0) {
    return false;
  }
  // If the mount type is a share, ensure it got download permissions.
  if (node.attributes['mount-type'] === 'shared') {
    var _node$attributes$shar, _shareAttributes$find;
    const shareAttributes = JSON.parse((_node$attributes$shar = node.attributes['share-attributes']) !== null && _node$attributes$shar !== void 0 ? _node$attributes$shar : 'null');
    const downloadAttribute = shareAttributes === null || shareAttributes === void 0 || (_shareAttributes$find = shareAttributes.find) === null || _shareAttributes$find === void 0 ? void 0 : _shareAttributes$find.call(shareAttributes, attribute => attribute.scope === 'permissions' && attribute.key === 'download');
    if (downloadAttribute !== undefined && downloadAttribute.enabled === false) {
      return false;
    }
  }
  return true;
};
const action = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.FileAction({
  id: 'download',
  displayName: () => (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_2__.translate)('files', 'Download'),
  iconSvgInline: () => _mdi_svg_svg_arrow_down_svg_raw__WEBPACK_IMPORTED_MODULE_3__,
  enabled(nodes) {
    if (nodes.length === 0) {
      return false;
    }
    // We can download direct dav files. But if we have
    // some folders, we need to use the /apps/files/ajax/download.php
    // endpoint, which only supports user root folder.
    if (nodes.some(node => node.type === _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.FileType.Folder) && nodes.some(node => {
      var _node$root;
      return !((_node$root = node.root) !== null && _node$root !== void 0 && _node$root.startsWith('/files'));
    })) {
      return false;
    }
    return nodes.every(isDownloadable);
  },
  async exec(node, view, dir) {
    if (node.type === _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.FileType.Folder) {
      downloadNodes(dir, [node]);
      return null;
    }
    triggerDownload(node.encodedSource);
    return null;
  },
  async execBatch(nodes, view, dir) {
    if (nodes.length === 1) {
      this.exec(nodes[0], view, dir);
      return [null];
    }
    downloadNodes(dir, nodes);
    return new Array(nodes.length).fill(null);
  },
  order: 30
});

/***/ }),

/***/ "./apps/files/src/actions/editLocallyAction.ts":
/*!*****************************************************!*\
  !*** ./apps/files/src/actions/editLocallyAction.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   action: () => (/* binding */ action)
/* harmony export */ });
/* harmony import */ var _nextcloud_paths__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/paths */ "./node_modules/@nextcloud/paths/dist/index.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.mjs");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.mjs");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.es.mjs");
/* harmony import */ var _mdi_svg_svg_laptop_svg_raw__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @mdi/svg/svg/laptop.svg?raw */ "./node_modules/@mdi/svg/svg/laptop.svg?raw");
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








const openLocalClient = async function (path) {
  const link = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateOcsUrl)('apps/files/api/v1') + '/openlocaleditor?format=json';
  try {
    var _getCurrentUser;
    const result = await _nextcloud_axios__WEBPACK_IMPORTED_MODULE_6__["default"].post(link, {
      path
    });
    const uid = (_getCurrentUser = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__.getCurrentUser)()) === null || _getCurrentUser === void 0 ? void 0 : _getCurrentUser.uid;
    let url = "nc://open/".concat(uid, "@") + window.location.host + (0,_nextcloud_paths__WEBPACK_IMPORTED_MODULE_0__.encodePath)(path);
    url += '?token=' + result.data.ocs.data.token;
    window.location.href = url;
  } catch (error) {
    (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_4__.showError)((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'Failed to redirect to client'));
  }
};
const action = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_3__.FileAction({
  id: 'edit-locally',
  displayName: () => (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'Edit locally'),
  iconSvgInline: () => _mdi_svg_svg_laptop_svg_raw__WEBPACK_IMPORTED_MODULE_7__,
  // Only works on single files
  enabled(nodes) {
    // Only works on single node
    if (nodes.length !== 1) {
      return false;
    }
    return (nodes[0].permissions & _nextcloud_files__WEBPACK_IMPORTED_MODULE_3__.Permission.UPDATE) !== 0;
  },
  async exec(node) {
    openLocalClient(node.path);
    return null;
  },
  order: 25
});

/***/ }),

/***/ "./apps/files/src/actions/favoriteAction.ts":
/*!**************************************************!*\
  !*** ./apps/files/src/actions/favoriteAction.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   action: () => (/* binding */ action),
/* harmony export */   favoriteNode: () => (/* binding */ favoriteNode)
/* harmony export */ });
/* harmony import */ var _nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/event-bus */ "./node_modules/@nextcloud/event-bus/dist/index.mjs");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.mjs");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.es.mjs");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js");
/* harmony import */ var _mdi_svg_svg_star_outline_svg_raw__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mdi/svg/svg/star-outline.svg?raw */ "./node_modules/@mdi/svg/svg/star-outline.svg?raw");
/* harmony import */ var _mdi_svg_svg_star_svg_raw__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mdi/svg/svg/star.svg?raw */ "./node_modules/@mdi/svg/svg/star.svg?raw");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../logger.js */ "./apps/files/src/logger.js");
/* harmony import */ var _nextcloud_paths__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @nextcloud/paths */ "./node_modules/@nextcloud/paths/dist/index.js");
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










// If any of the nodes is not favorited, we display the favorite action.
const shouldFavorite = nodes => {
  return nodes.some(node => node.attributes.favorite !== 1);
};
const favoriteNode = async (node, view, willFavorite) => {
  try {
    // TODO: migrate to webdav tags plugin
    const url = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateUrl)('/apps/files/api/v1/files') + (0,_nextcloud_paths__WEBPACK_IMPORTED_MODULE_8__.encodePath)(node.path);
    await _nextcloud_axios__WEBPACK_IMPORTED_MODULE_4__["default"].post(url, {
      tags: willFavorite ? [window.OC.TAG_FAVORITE] : []
    });
    // Let's delete if we are in the favourites view
    // AND if it is removed from the user favorites
    // AND it's in the root of the favorites view
    if (view.id === 'favorites' && !willFavorite && node.dirname === '/') {
      (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__.emit)('files:node:deleted', node);
    }
    // Update the node webdav attribute
    vue__WEBPACK_IMPORTED_MODULE_9__["default"].set(node.attributes, 'favorite', willFavorite ? 1 : 0);
    // Dispatch event to whoever is interested
    if (willFavorite) {
      (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__.emit)('files:favorites:added', node);
    } else {
      (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__.emit)('files:favorites:removed', node);
    }
    return true;
  } catch (error) {
    const action = willFavorite ? 'adding a file to favourites' : 'removing a file from favourites';
    _logger_js__WEBPACK_IMPORTED_MODULE_7__["default"].error('Error while ' + action, {
      error,
      source: node.source,
      node
    });
    return false;
  }
};
const action = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_2__.FileAction({
  id: 'favorite',
  displayName(nodes) {
    return shouldFavorite(nodes) ? (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Add to favorites') : (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Remove from favorites');
  },
  iconSvgInline: nodes => {
    return shouldFavorite(nodes) ? _mdi_svg_svg_star_outline_svg_raw__WEBPACK_IMPORTED_MODULE_5__ : _mdi_svg_svg_star_svg_raw__WEBPACK_IMPORTED_MODULE_6__;
  },
  enabled(nodes) {
    // We can only favorite nodes within files and with permissions
    return !nodes.some(node => {
      var _node$root, _node$root$startsWith;
      return !((_node$root = node.root) !== null && _node$root !== void 0 && (_node$root$startsWith = _node$root.startsWith) !== null && _node$root$startsWith !== void 0 && _node$root$startsWith.call(_node$root, '/files'));
    }) && nodes.every(node => node.permissions !== _nextcloud_files__WEBPACK_IMPORTED_MODULE_2__.Permission.NONE);
  },
  async exec(node, view) {
    const willFavorite = shouldFavorite([node]);
    return await favoriteNode(node, view, willFavorite);
  },
  async execBatch(nodes, view) {
    const willFavorite = shouldFavorite(nodes);
    return Promise.all(nodes.map(async node => await favoriteNode(node, view, willFavorite)));
  },
  order: -50
});

/***/ }),

/***/ "./apps/files/src/actions/moveOrCopyAction.ts":
/*!****************************************************!*\
  !*** ./apps/files/src/actions/moveOrCopyAction.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   action: () => (/* binding */ action),
/* harmony export */   handleCopyMoveNodeTo: () => (/* binding */ handleCopyMoveNodeTo)
/* harmony export */ });
/* harmony import */ var _nextcloud_dialogs_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/dialogs/style.css */ "./node_modules/@nextcloud/dialogs/dist/style.css");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "./node_modules/path/path.js");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/event-bus */ "./node_modules/@nextcloud/event-bus/dist/index.mjs");
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.mjs");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _nextcloud_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nextcloud/upload */ "./node_modules/@nextcloud/upload/dist/index.mjs");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js");
/* harmony import */ var _mdi_svg_svg_folder_multiple_svg_raw__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @mdi/svg/svg/folder-multiple.svg?raw */ "./node_modules/@mdi/svg/svg/folder-multiple.svg?raw");
/* harmony import */ var _mdi_svg_svg_folder_move_svg_raw__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @mdi/svg/svg/folder-move.svg?raw */ "./node_modules/@mdi/svg/svg/folder-move.svg?raw");
/* harmony import */ var _moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./moveOrCopyActionUtils */ "./apps/files/src/actions/moveOrCopyActionUtils.ts");
/* harmony import */ var _services_Files__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../services/Files */ "./apps/files/src/services/Files.ts");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../logger */ "./apps/files/src/logger.js");
/* harmony import */ var _utils_fileUtils__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../utils/fileUtils */ "./apps/files/src/utils/fileUtils.ts");
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

// eslint-disable-next-line n/no-extraneous-import














/**
 * Return the action that is possible for the given nodes
 * @param {Node[]} nodes The nodes to check against
 * @return {MoveCopyAction} The action that is possible for the given nodes
 */
const getActionForNodes = nodes => {
  if ((0,_moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.canMove)(nodes)) {
    if ((0,_moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.canCopy)(nodes)) {
      return _moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.MoveCopyAction.MOVE_OR_COPY;
    }
    return _moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.MoveCopyAction.MOVE;
  }
  // Assuming we can copy as the enabled checks for copy permissions
  return _moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.MoveCopyAction.COPY;
};
/**
 * Handle the copy/move of a node to a destination
 * This can be imported and used by other scripts/components on server
 * @param {Node} node The node to copy/move
 * @param {Folder} destination The destination to copy/move the node to
 * @param {MoveCopyAction} method The method to use for the copy/move
 * @param {boolean} overwrite Whether to overwrite the destination if it exists
 * @return {Promise<void>} A promise that resolves when the copy/move is done
 */
const handleCopyMoveNodeTo = async function (node, destination, method) {
  let overwrite = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (!destination) {
    return;
  }
  if (destination.type !== _nextcloud_files__WEBPACK_IMPORTED_MODULE_4__.FileType.Folder) {
    throw new Error((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'Destination is not a folder'));
  }
  // Do not allow to MOVE a node to the same folder it is already located
  if (method === _moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.MoveCopyAction.MOVE && node.dirname === destination.path) {
    throw new Error((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'This file/folder is already in that directory'));
  }
  /**
   * Example:
   * - node: /foo/bar/file.txt -> path = /foo/bar/file.txt, destination: /foo
   *   Allow move of /foo does not start with /foo/bar/file.txt so allow
   * - node: /foo , destination: /foo/bar
   *   Do not allow as it would copy foo within itself
   * - node: /foo/bar.txt, destination: /foo
   *   Allow copy a file to the same directory
   * - node: "/foo/bar", destination: "/foo/bar 1"
   *   Allow to move or copy but we need to check with trailing / otherwise it would report false positive
   */
  if ("".concat(destination.path, "/").startsWith("".concat(node.path, "/"))) {
    throw new Error((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'You cannot move a file/folder onto itself or into a subfolder of itself'));
  }
  // Set loading state
  vue__WEBPACK_IMPORTED_MODULE_13__["default"].set(node, 'status', _nextcloud_files__WEBPACK_IMPORTED_MODULE_4__.NodeStatus.LOADING);
  const queue = (0,_moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.getQueue)();
  return await queue.add(async () => {
    const copySuffix = index => {
      if (index === 1) {
        return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', '(copy)'); // TRANSLATORS: Mark a file as a copy of another file
      }
      return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', '(copy %n)', undefined, index); // TRANSLATORS: Meaning it is the n'th copy of a file
    };
    try {
      const client = (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_4__.davGetClient)();
      const currentPath = (0,path__WEBPACK_IMPORTED_MODULE_1__.join)(_nextcloud_files__WEBPACK_IMPORTED_MODULE_4__.davRootPath, node.path);
      const destinationPath = (0,path__WEBPACK_IMPORTED_MODULE_1__.join)(_nextcloud_files__WEBPACK_IMPORTED_MODULE_4__.davRootPath, destination.path);
      if (method === _moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.MoveCopyAction.COPY) {
        let target = node.basename;
        // If we do not allow overwriting then find an unique name
        if (!overwrite) {
          const otherNodes = await client.getDirectoryContents(destinationPath);
          target = (0,_utils_fileUtils__WEBPACK_IMPORTED_MODULE_12__.getUniqueName)(node.basename, otherNodes.map(n => n.basename), {
            suffix: copySuffix,
            ignoreFileExtension: node.type === _nextcloud_files__WEBPACK_IMPORTED_MODULE_4__.FileType.Folder
          });
        }
        await client.copyFile(currentPath, (0,path__WEBPACK_IMPORTED_MODULE_1__.join)(destinationPath, target));
        // If the node is copied into current directory the view needs to be updated
        if (node.dirname === destination.path) {
          const {
            data
          } = await client.stat((0,path__WEBPACK_IMPORTED_MODULE_1__.join)(destinationPath, target), {
            details: true,
            data: (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_4__.davGetDefaultPropfind)()
          });
          (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_2__.emit)('files:node:created', (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_4__.davResultToNode)(data));
        }
      } else {
        // show conflict file popup if we do not allow overwriting
        const otherNodes = await (0,_services_Files__WEBPACK_IMPORTED_MODULE_10__.getContents)(destination.path);
        if ((0,_nextcloud_upload__WEBPACK_IMPORTED_MODULE_6__.hasConflict)([node], otherNodes.contents)) {
          try {
            // Let the user choose what to do with the conflicting files
            const {
              selected,
              renamed
            } = await (0,_nextcloud_upload__WEBPACK_IMPORTED_MODULE_6__.openConflictPicker)(destination.path, [node], otherNodes.contents);
            // if the user selected to keep the old file, and did not select the new file
            // that means they opted to delete the current node
            if (!selected.length && !renamed.length) {
              await client.deleteFile(currentPath);
              (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_2__.emit)('files:node:deleted', node);
              return;
            }
          } catch (error) {
            // User cancelled
            (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_3__.showError)((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'Move cancelled'));
            return;
          }
        }
        // getting here means either no conflict, file was renamed to keep both files
        // in a conflict, or the selected file was chosen to be kept during the conflict
        await client.moveFile(currentPath, (0,path__WEBPACK_IMPORTED_MODULE_1__.join)(destinationPath, node.basename));
        // Delete the node as it will be fetched again
        // when navigating to the destination folder
        (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_2__.emit)('files:node:deleted', node);
      }
    } catch (error) {
      if (error instanceof axios__WEBPACK_IMPORTED_MODULE_14__.AxiosError) {
        var _error$response, _error$response2, _error$response3;
        if ((error === null || error === void 0 || (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 412) {
          throw new Error((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'A file or folder with that name already exists in this folder'));
        } else if ((error === null || error === void 0 || (_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.status) === 423) {
          throw new Error((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'The files are locked'));
        } else if ((error === null || error === void 0 || (_error$response3 = error.response) === null || _error$response3 === void 0 ? void 0 : _error$response3.status) === 404) {
          throw new Error((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'The file does not exist anymore'));
        } else if (error.message) {
          throw new Error(error.message);
        }
      }
      _logger__WEBPACK_IMPORTED_MODULE_11__["default"].debug(error);
      throw new Error();
    } finally {
      vue__WEBPACK_IMPORTED_MODULE_13__["default"].set(node, 'status', undefined);
    }
  });
};
/**
 * Open a file picker for the given action
 * @param {MoveCopyAction} action The action to open the file picker for
 * @param {string} dir The directory to start the file picker in
 * @param {Node[]} nodes The nodes to move/copy
 * @return {Promise<MoveCopyResult>} The picked destination
 */
const openFilePickerForAction = async function (action) {
  let dir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
  let nodes = arguments.length > 2 ? arguments[2] : undefined;
  const fileIDs = nodes.map(node => node.fileid).filter(Boolean);
  const filePicker = (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_3__.getFilePickerBuilder)((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'Choose destination')).allowDirectories(true).setFilter(n => {
    // We don't want to show the current nodes in the file picker
    return !fileIDs.includes(n.fileid);
  }).setMimeTypeFilter([]).setMultiSelect(false).startAt(dir);
  return new Promise((resolve, reject) => {
    filePicker.setButtonFactory((selection, path) => {
      const buttons = [];
      const target = (0,path__WEBPACK_IMPORTED_MODULE_1__.basename)(path);
      const dirnames = nodes.map(node => node.dirname);
      const paths = nodes.map(node => node.path);
      if (action === _moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.MoveCopyAction.COPY || action === _moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.MoveCopyAction.MOVE_OR_COPY) {
        buttons.push({
          label: target ? (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'Copy to {target}', {
            target
          }, undefined, {
            escape: false,
            sanitize: false
          }) : (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'Copy'),
          type: 'primary',
          icon: _mdi_svg_svg_folder_multiple_svg_raw__WEBPACK_IMPORTED_MODULE_7__,
          async callback(destination) {
            resolve({
              destination: destination[0],
              action: _moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.MoveCopyAction.COPY
            });
          }
        });
      }
      // Invalid MOVE targets (but valid copy targets)
      if (dirnames.includes(path)) {
        // This file/folder is already in that directory
        return buttons;
      }
      if (paths.includes(path)) {
        // You cannot move a file/folder onto itself
        return buttons;
      }
      if (action === _moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.MoveCopyAction.MOVE || action === _moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.MoveCopyAction.MOVE_OR_COPY) {
        buttons.push({
          label: target ? (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'Move to {target}', {
            target
          }, undefined, {
            escape: false,
            sanitize: false
          }) : (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'Move'),
          type: action === _moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.MoveCopyAction.MOVE ? 'primary' : 'secondary',
          icon: _mdi_svg_svg_folder_move_svg_raw__WEBPACK_IMPORTED_MODULE_8__,
          async callback(destination) {
            resolve({
              destination: destination[0],
              action: _moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.MoveCopyAction.MOVE
            });
          }
        });
      }
      return buttons;
    });
    const picker = filePicker.build();
    picker.pick().catch(error => {
      _logger__WEBPACK_IMPORTED_MODULE_11__["default"].debug(error);
      if (error instanceof _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_3__.FilePickerClosed) {
        reject(new Error((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'Cancelled move or copy operation')));
      } else {
        reject(new Error((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'Move or copy operation failed')));
      }
    });
  });
};
const action = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_4__.FileAction({
  id: 'move-copy',
  displayName(nodes) {
    switch (getActionForNodes(nodes)) {
      case _moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.MoveCopyAction.MOVE:
        return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'Move');
      case _moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.MoveCopyAction.COPY:
        return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'Copy');
      case _moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.MoveCopyAction.MOVE_OR_COPY:
        return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'Move or copy');
    }
  },
  iconSvgInline: () => _mdi_svg_svg_folder_move_svg_raw__WEBPACK_IMPORTED_MODULE_8__,
  enabled(nodes) {
    // We only support moving/copying files within the user folder
    if (!nodes.every(node => {
      var _node$root;
      return (_node$root = node.root) === null || _node$root === void 0 ? void 0 : _node$root.startsWith('/files/');
    })) {
      return false;
    }
    return nodes.length > 0 && ((0,_moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.canMove)(nodes) || (0,_moveOrCopyActionUtils__WEBPACK_IMPORTED_MODULE_9__.canCopy)(nodes));
  },
  async exec(node, view, dir) {
    const action = getActionForNodes([node]);
    let result;
    try {
      result = await openFilePickerForAction(action, dir, [node]);
    } catch (e) {
      _logger__WEBPACK_IMPORTED_MODULE_11__["default"].error(e);
      return false;
    }
    try {
      await handleCopyMoveNodeTo(node, result.destination, result.action);
      return true;
    } catch (error) {
      if (error instanceof Error && !!error.message) {
        (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_3__.showError)(error.message);
        // Silent action as we handle the toast
        return null;
      }
      return false;
    }
  },
  async execBatch(nodes, view, dir) {
    const action = getActionForNodes(nodes);
    const result = await openFilePickerForAction(action, dir, nodes);
    const promises = nodes.map(async node => {
      try {
        await handleCopyMoveNodeTo(node, result.destination, result.action);
        return true;
      } catch (error) {
        _logger__WEBPACK_IMPORTED_MODULE_11__["default"].error("Failed to ".concat(result.action, " node"), {
          node,
          error
        });
        return false;
      }
    });
    // We need to keep the selection on error!
    // So we do not return null, and for batch action
    // we let the front handle the error.
    return await Promise.all(promises);
  },
  order: 15
});

/***/ }),

/***/ "./apps/files/src/actions/moveOrCopyActionUtils.ts":
/*!*********************************************************!*\
  !*** ./apps/files/src/actions/moveOrCopyActionUtils.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MoveCopyAction: () => (/* binding */ MoveCopyAction),
/* harmony export */   canCopy: () => (/* binding */ canCopy),
/* harmony export */   canDownload: () => (/* binding */ canDownload),
/* harmony export */   canMove: () => (/* binding */ canMove),
/* harmony export */   getQueue: () => (/* binding */ getQueue)
/* harmony export */ });
/* harmony import */ var _nextcloud_dialogs_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/dialogs/style.css */ "./node_modules/@nextcloud/dialogs/dist/style.css");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var p_queue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! p-queue */ "./node_modules/p-queue/dist/index.js");
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



// This is the processing queue. We only want to allow 3 concurrent requests
let queue;
// Maximum number of concurrent operations
const MAX_CONCURRENCY = 5;
/**
 * Get the processing queue
 */
const getQueue = () => {
  if (!queue) {
    queue = new p_queue__WEBPACK_IMPORTED_MODULE_2__["default"]({
      concurrency: MAX_CONCURRENCY
    });
  }
  return queue;
};
var MoveCopyAction;
(function (MoveCopyAction) {
  MoveCopyAction["MOVE"] = "Move";
  MoveCopyAction["COPY"] = "Copy";
  MoveCopyAction["MOVE_OR_COPY"] = "move-or-copy";
})(MoveCopyAction || (MoveCopyAction = {}));
const canMove = nodes => {
  const minPermission = nodes.reduce((min, node) => Math.min(min, node.permissions), _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.Permission.ALL);
  return (minPermission & _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.Permission.UPDATE) !== 0;
};
const canDownload = nodes => {
  return nodes.every(node => {
    var _node$attributes$shar, _node$attributes;
    const shareAttributes = JSON.parse((_node$attributes$shar = (_node$attributes = node.attributes) === null || _node$attributes === void 0 ? void 0 : _node$attributes['share-attributes']) !== null && _node$attributes$shar !== void 0 ? _node$attributes$shar : '[]');
    return !shareAttributes.some(attribute => attribute.scope === 'permissions' && attribute.enabled === false && attribute.key === 'download');
  });
};
const canCopy = nodes => {
  // a shared file cannot be copied if the download is disabled
  // it can be copied if the user has at least read permissions
  return canDownload(nodes) && !nodes.some(node => node.permissions === _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.Permission.NONE);
};

/***/ }),

/***/ "./apps/files/src/actions/openFolderAction.ts":
/*!****************************************************!*\
  !*** ./apps/files/src/actions/openFolderAction.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   action: () => (/* binding */ action)
/* harmony export */ });
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _mdi_svg_svg_folder_svg_raw__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mdi/svg/svg/folder.svg?raw */ "./node_modules/@mdi/svg/svg/folder.svg?raw");
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



const action = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.FileAction({
  id: 'open-folder',
  displayName(files) {
    // Only works on single node
    const displayName = files[0].attributes.displayName || files[0].basename;
    return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__.translate)('files', 'Open folder {displayName}', {
      displayName
    });
  },
  iconSvgInline: () => _mdi_svg_svg_folder_svg_raw__WEBPACK_IMPORTED_MODULE_2__,
  enabled(nodes) {
    // Only works on single node
    if (nodes.length !== 1) {
      return false;
    }
    const node = nodes[0];
    if (!node.isDavRessource) {
      return false;
    }
    return node.type === _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.FileType.Folder && (node.permissions & _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.Permission.READ) !== 0;
  },
  async exec(node, view) {
    if (!node || node.type !== _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.FileType.Folder) {
      return false;
    }
    window.OCP.Files.Router.goToRoute(null, {
      view: view.id,
      fileid: node.fileid
    }, {
      dir: node.path
    });
    return null;
  },
  // Main action if enabled, meaning folders only
  default: _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.DefaultType.HIDDEN,
  order: -100
});

/***/ }),

/***/ "./apps/files/src/actions/openInFilesAction.ts":
/*!*****************************************************!*\
  !*** ./apps/files/src/actions/openInFilesAction.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   action: () => (/* binding */ action)
/* harmony export */ });
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
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


/**
 * TODO: Move away from a redirect and handle
 * navigation straight out of the recent view
 */
const action = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.FileAction({
  id: 'open-in-files-recent',
  displayName: () => (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files', 'Open in Files'),
  iconSvgInline: () => '',
  enabled: (nodes, view) => view.id === 'recent',
  async exec(node) {
    let dir = node.dirname;
    if (node.type === _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.FileType.Folder) {
      dir = dir + '/' + node.basename;
    }
    window.OCP.Files.Router.goToRoute(null,
    // use default route
    {
      view: 'files',
      fileid: node.fileid
    }, {
      dir,
      openfile: 'true'
    });
    return null;
  },
  // Before openFolderAction
  order: -1000,
  default: _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.DefaultType.HIDDEN
});

/***/ }),

/***/ "./apps/files/src/actions/renameAction.ts":
/*!************************************************!*\
  !*** ./apps/files/src/actions/renameAction.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTION_DETAILS: () => (/* binding */ ACTION_DETAILS),
/* harmony export */   action: () => (/* binding */ action)
/* harmony export */ });
/* harmony import */ var _nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/event-bus */ "./node_modules/@nextcloud/event-bus/dist/index.mjs");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _mdi_svg_svg_pencil_svg_raw__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @mdi/svg/svg/pencil.svg?raw */ "./node_modules/@mdi/svg/svg/pencil.svg?raw");
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
const action = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.FileAction({
  id: 'rename',
  displayName: () => (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_2__.translate)('files', 'Rename'),
  iconSvgInline: () => _mdi_svg_svg_pencil_svg_raw__WEBPACK_IMPORTED_MODULE_3__,
  enabled: nodes => {
    return nodes.length > 0 && nodes.map(node => node.permissions).every(permission => (permission & _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.Permission.UPDATE) !== 0);
  },
  async exec(node) {
    // Renaming is a built-in feature of the files app
    (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__.emit)('files:node:rename', node);
    return null;
  },
  order: 10
});

/***/ }),

/***/ "./apps/files/src/actions/sidebarAction.ts":
/*!*************************************************!*\
  !*** ./apps/files/src/actions/sidebarAction.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./apps/files/src/actions/viewInFolderAction.ts":
/*!******************************************************!*\
  !*** ./apps/files/src/actions/viewInFolderAction.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   action: () => (/* binding */ action)
/* harmony export */ });
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _mdi_svg_svg_folder_move_svg_raw__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mdi/svg/svg/folder-move.svg?raw */ "./node_modules/@mdi/svg/svg/folder-move.svg?raw");
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



const action = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.FileAction({
  id: 'view-in-folder',
  displayName() {
    return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__.translate)('files', 'View in folder');
  },
  iconSvgInline: () => _mdi_svg_svg_folder_move_svg_raw__WEBPACK_IMPORTED_MODULE_2__,
  enabled(nodes, view) {
    // Only works outside of the main files view
    if (view.id === 'files') {
      return false;
    }
    // Only works on single node
    if (nodes.length !== 1) {
      return false;
    }
    const node = nodes[0];
    if (!node.isDavRessource) {
      return false;
    }
    if (node.permissions === _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.Permission.NONE) {
      return false;
    }
    return node.type === _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.FileType.File;
  },
  async exec(node) {
    if (!node || node.type !== _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.FileType.File) {
      return false;
    }
    window.OCP.Files.Router.goToRoute(null, {
      view: 'files',
      fileid: node.fileid
    }, {
      dir: node.dirname
    });
    return null;
  },
  order: 80
});

/***/ }),

/***/ "./apps/files/src/init.ts":
/*!********************************!*\
  !*** ./apps/files/src/init.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _actions_deleteAction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions/deleteAction */ "./apps/files/src/actions/deleteAction.ts");
/* harmony import */ var _actions_downloadAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./actions/downloadAction */ "./apps/files/src/actions/downloadAction.ts");
/* harmony import */ var _actions_editLocallyAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actions/editLocallyAction */ "./apps/files/src/actions/editLocallyAction.ts");
/* harmony import */ var _actions_favoriteAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./actions/favoriteAction */ "./apps/files/src/actions/favoriteAction.ts");
/* harmony import */ var _actions_moveOrCopyAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./actions/moveOrCopyAction */ "./apps/files/src/actions/moveOrCopyAction.ts");
/* harmony import */ var _actions_openFolderAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./actions/openFolderAction */ "./apps/files/src/actions/openFolderAction.ts");
/* harmony import */ var _actions_openInFilesAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./actions/openInFilesAction */ "./apps/files/src/actions/openInFilesAction.ts");
/* harmony import */ var _actions_renameAction__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./actions/renameAction */ "./apps/files/src/actions/renameAction.ts");
/* harmony import */ var _actions_sidebarAction__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./actions/sidebarAction */ "./apps/files/src/actions/sidebarAction.ts");
/* harmony import */ var _actions_viewInFolderAction__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./actions/viewInFolderAction */ "./apps/files/src/actions/viewInFolderAction.ts");
/* harmony import */ var _newMenu_newFolder_ts__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./newMenu/newFolder.ts */ "./apps/files/src/newMenu/newFolder.ts");
/* harmony import */ var _newMenu_newTemplatesFolder_ts__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./newMenu/newTemplatesFolder.ts */ "./apps/files/src/newMenu/newTemplatesFolder.ts");
/* harmony import */ var _newMenu_newFromTemplate_ts__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./newMenu/newFromTemplate.ts */ "./apps/files/src/newMenu/newFromTemplate.ts");
/* harmony import */ var _views_favorites__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./views/favorites */ "./apps/files/src/views/favorites.ts");
/* harmony import */ var _views_recent__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./views/recent */ "./apps/files/src/views/recent.ts");
/* harmony import */ var _views_personal_files__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./views/personal-files */ "./apps/files/src/views/personal-files.ts");
/* harmony import */ var _views_files__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./views/files */ "./apps/files/src/views/files.ts");
/* harmony import */ var _services_ServiceWorker_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./services/ServiceWorker.js */ "./apps/files/src/services/ServiceWorker.js");
/* harmony import */ var _services_LivePhotos__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./services/LivePhotos */ "./apps/files/src/services/LivePhotos.ts");
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




















// Register file actions
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerFileAction)(_actions_deleteAction__WEBPACK_IMPORTED_MODULE_1__.action);
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerFileAction)(_actions_downloadAction__WEBPACK_IMPORTED_MODULE_2__.action);
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerFileAction)(_actions_editLocallyAction__WEBPACK_IMPORTED_MODULE_3__.action);
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerFileAction)(_actions_favoriteAction__WEBPACK_IMPORTED_MODULE_4__.action);
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerFileAction)(_actions_moveOrCopyAction__WEBPACK_IMPORTED_MODULE_5__.action);
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerFileAction)(_actions_openFolderAction__WEBPACK_IMPORTED_MODULE_6__.action);
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerFileAction)(_actions_openInFilesAction__WEBPACK_IMPORTED_MODULE_7__.action);
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerFileAction)(_actions_renameAction__WEBPACK_IMPORTED_MODULE_8__.action);
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerFileAction)(_actions_sidebarAction__WEBPACK_IMPORTED_MODULE_9__.action);
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerFileAction)(_actions_viewInFolderAction__WEBPACK_IMPORTED_MODULE_10__.action);
// Register new menu entry
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.addNewFileMenuEntry)(_newMenu_newFolder_ts__WEBPACK_IMPORTED_MODULE_11__.entry);
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.addNewFileMenuEntry)(_newMenu_newTemplatesFolder_ts__WEBPACK_IMPORTED_MODULE_12__.entry);
(0,_newMenu_newFromTemplate_ts__WEBPACK_IMPORTED_MODULE_13__.registerTemplateEntries)();
// Register files views
(0,_views_favorites__WEBPACK_IMPORTED_MODULE_14__["default"])();
(0,_views_files__WEBPACK_IMPORTED_MODULE_17__["default"])();
(0,_views_recent__WEBPACK_IMPORTED_MODULE_15__["default"])();
(0,_views_personal_files__WEBPACK_IMPORTED_MODULE_16__["default"])();
// Register preview service worker
(0,_services_ServiceWorker_js__WEBPACK_IMPORTED_MODULE_18__["default"])();
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerDavProperty)('nc:hidden', {
  nc: 'http://nextcloud.org/ns'
});
(0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerDavProperty)('nc:is-mount-root', {
  nc: 'http://nextcloud.org/ns'
});
(0,_services_LivePhotos__WEBPACK_IMPORTED_MODULE_19__.initLivePhotos)();

/***/ }),

/***/ "./apps/files/src/newMenu/newFolder.ts":
/*!*********************************************!*\
  !*** ./apps/files/src/newMenu/newFolder.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   entry: () => (/* binding */ entry)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "./node_modules/path/path.js");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/event-bus */ "./node_modules/@nextcloud/event-bus/dist/index.mjs");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.mjs");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.es.mjs");
/* harmony import */ var _mdi_svg_svg_folder_plus_svg_raw__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @mdi/svg/svg/folder-plus.svg?raw */ "./node_modules/@mdi/svg/svg/folder-plus.svg?raw");
/* harmony import */ var _utils_newNodeDialog__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/newNodeDialog */ "./apps/files/src/utils/newNodeDialog.ts");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../logger */ "./apps/files/src/logger.js");










const createNewFolder = async (root, name) => {
  const source = root.source + '/' + name;
  const encodedSource = root.encodedSource + '/' + encodeURIComponent(name);
  const response = await (0,_nextcloud_axios__WEBPACK_IMPORTED_MODULE_6__["default"])({
    method: 'MKCOL',
    url: encodedSource,
    headers: {
      Overwrite: 'F'
    }
  });
  return {
    fileid: parseInt(response.headers['oc-fileid']),
    source
  };
};
const entry = {
  id: 'newFolder',
  displayName: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'New folder'),
  enabled: context => (context.permissions & _nextcloud_files__WEBPACK_IMPORTED_MODULE_3__.Permission.CREATE) !== 0,
  iconSvgInline: _mdi_svg_svg_folder_plus_svg_raw__WEBPACK_IMPORTED_MODULE_7__,
  order: 0,
  async handler(context, content) {
    const name = await (0,_utils_newNodeDialog__WEBPACK_IMPORTED_MODULE_8__.newNodeName)((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'New folder'), content);
    if (name !== null) {
      var _getCurrentUser, _getCurrentUser2, _context$attributes, _context$attributes2, _context$attributes3;
      const {
        fileid,
        source
      } = await createNewFolder(context, name);
      // Create the folder in the store
      const folder = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_3__.Folder({
        source,
        id: fileid,
        mtime: new Date(),
        owner: ((_getCurrentUser = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__.getCurrentUser)()) === null || _getCurrentUser === void 0 ? void 0 : _getCurrentUser.uid) || null,
        permissions: _nextcloud_files__WEBPACK_IMPORTED_MODULE_3__.Permission.ALL,
        root: (context === null || context === void 0 ? void 0 : context.root) || '/files/' + ((_getCurrentUser2 = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__.getCurrentUser)()) === null || _getCurrentUser2 === void 0 ? void 0 : _getCurrentUser2.uid),
        // Include mount-type from parent folder as this is inherited
        attributes: {
          'mount-type': (_context$attributes = context.attributes) === null || _context$attributes === void 0 ? void 0 : _context$attributes['mount-type'],
          'owner-id': (_context$attributes2 = context.attributes) === null || _context$attributes2 === void 0 ? void 0 : _context$attributes2['owner-id'],
          'owner-display-name': (_context$attributes3 = context.attributes) === null || _context$attributes3 === void 0 ? void 0 : _context$attributes3['owner-display-name']
        }
      });
      (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_4__.showSuccess)((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate)('files', 'Created new folder "{name}"', {
        name: (0,path__WEBPACK_IMPORTED_MODULE_0__.basename)(source)
      }));
      _logger__WEBPACK_IMPORTED_MODULE_9__["default"].debug('Created new folder', {
        folder,
        source
      });
      (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_1__.emit)('files:node:created', folder);
      window.OCP.Files.Router.goToRoute(null,
      // use default route
      {
        view: 'files',
        fileid: folder.fileid
      }, {
        dir: context.path
      });
    }
  }
};

/***/ }),

/***/ "./apps/files/src/newMenu/newFromTemplate.ts":
/*!***************************************************!*\
  !*** ./apps/files/src/newMenu/newFromTemplate.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registerTemplateEntries: () => (/* binding */ registerTemplateEntries)
/* harmony export */ });
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_initial_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/initial-state */ "./node_modules/@nextcloud/initial-state/dist/index.es.mjs");
/* harmony import */ var _utils_newNodeDialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/newNodeDialog */ "./apps/files/src/utils/newNodeDialog.ts");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js");
/**
 * @copyright Copyright (c) 2020 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 * @author Julius Härtl <jus@bitgrid.net>
 * @author Ferdinand Thiessen <opensource@fthiessen.de>
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





// async to reduce bundle size
const TemplatePickerVue = (0,vue__WEBPACK_IMPORTED_MODULE_4__.defineAsyncComponent)(() => Promise.all(/*! import() */[__webpack_require__.e("core-common"), __webpack_require__.e("apps_files_src_views_TemplatePicker_vue")]).then(__webpack_require__.bind(__webpack_require__, /*! ../views/TemplatePicker.vue */ "./apps/files/src/views/TemplatePicker.vue")));
let TemplatePicker = null;
const getTemplatePicker = async context => {
  if (TemplatePicker === null) {
    // Create document root
    const mountingPoint = document.createElement('div');
    mountingPoint.id = 'template-picker';
    document.body.appendChild(mountingPoint);
    // Init vue app
    TemplatePicker = new vue__WEBPACK_IMPORTED_MODULE_4__["default"]({
      render: h => h(TemplatePickerVue, {
        ref: 'picker',
        props: {
          parent: context
        }
      }),
      methods: {
        open() {
          this.$refs.picker.open(...arguments);
        }
      },
      el: mountingPoint
    });
  }
  return TemplatePicker;
};
/**
 * Register all new-file-menu entries for all template providers
 */
function registerTemplateEntries() {
  const templates = (0,_nextcloud_initial_state__WEBPACK_IMPORTED_MODULE_1__.loadState)('files', 'templates', []);
  // Init template files menu
  templates.forEach((provider, index) => {
    (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.addNewFileMenuEntry)({
      id: "template-new-".concat(provider.app, "-").concat(index),
      displayName: provider.label,
      iconClass: provider.iconClass || 'icon-file',
      iconSvgInline: provider.iconSvgInline,
      enabled(context) {
        return (context.permissions & _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.Permission.CREATE) !== 0;
      },
      order: 11,
      async handler(context, content) {
        const templatePicker = getTemplatePicker(context);
        const name = await (0,_utils_newNodeDialog__WEBPACK_IMPORTED_MODULE_2__.newNodeName)("".concat(provider.label).concat(provider.extension), content, {
          label: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Filename'),
          name: provider.label
        });
        if (name !== null) {
          // Create the file
          const picker = await templatePicker;
          picker.open(name, provider);
        }
      }
    });
  });
}

/***/ }),

/***/ "./apps/files/src/newMenu/newTemplatesFolder.ts":
/*!******************************************************!*\
  !*** ./apps/files/src/newMenu/newTemplatesFolder.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   entry: () => (/* binding */ entry)
/* harmony export */ });
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.mjs");
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.mjs");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_initial_state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/initial-state */ "./node_modules/@nextcloud/initial-state/dist/index.es.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.mjs");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! path */ "./node_modules/path/path.js");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _utils_newNodeDialog__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/newNodeDialog */ "./apps/files/src/utils/newNodeDialog.ts");
/* harmony import */ var _mdi_svg_svg_plus_svg_raw__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @mdi/svg/svg/plus.svg?raw */ "./node_modules/@mdi/svg/svg/plus.svg?raw");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.es.mjs");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../logger.js */ "./apps/files/src/logger.js");











let templatesPath = (0,_nextcloud_initial_state__WEBPACK_IMPORTED_MODULE_3__.loadState)('files', 'templates_path', false);
_logger_js__WEBPACK_IMPORTED_MODULE_10__["default"].debug('Initial templates folder', {
  templatesPath
});
/**
 * Init template folder
 * @param directory Folder where to create the templates folder
 * @param name Name to use or the templates folder
 */
const initTemplatesFolder = async function (directory, name) {
  const templatePath = (0,path__WEBPACK_IMPORTED_MODULE_6__.join)(directory.path, name);
  try {
    _logger_js__WEBPACK_IMPORTED_MODULE_10__["default"].debug('Initializing the templates directory', {
      templatePath
    });
    const {
      data
    } = await _nextcloud_axios__WEBPACK_IMPORTED_MODULE_9__["default"].post((0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_5__.generateOcsUrl)('apps/files/api/v1/templates/path'), {
      templatePath,
      copySystemTemplates: true
    });
    // Go to template directory
    window.OCP.Files.Router.goToRoute(null,
    // use default route
    {
      view: 'files',
      fileid: undefined
    }, {
      dir: templatePath
    });
    _logger_js__WEBPACK_IMPORTED_MODULE_10__["default"].info('Created new templates folder', {
      ...data.ocs.data
    });
    templatesPath = data.ocs.data.templates_path;
  } catch (error) {
    _logger_js__WEBPACK_IMPORTED_MODULE_10__["default"].error('Unable to initialize the templates directory');
    (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__.showError)((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_4__.translate)('files', 'Unable to initialize the templates directory'));
  }
};
const entry = {
  id: 'template-picker',
  displayName: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_4__.translate)('files', 'Create new templates folder'),
  iconSvgInline: _mdi_svg_svg_plus_svg_raw__WEBPACK_IMPORTED_MODULE_8__,
  order: 10,
  enabled(context) {
    var _getCurrentUser;
    // Templates folder already initialized
    if (templatesPath) {
      return false;
    }
    // Allow creation on your own folders only
    if (context.owner !== ((_getCurrentUser = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_0__.getCurrentUser)()) === null || _getCurrentUser === void 0 ? void 0 : _getCurrentUser.uid)) {
      return false;
    }
    return (context.permissions & _nextcloud_files__WEBPACK_IMPORTED_MODULE_2__.Permission.CREATE) !== 0;
  },
  async handler(context, content) {
    const name = await (0,_utils_newNodeDialog__WEBPACK_IMPORTED_MODULE_7__.newNodeName)((0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_4__.translate)('files', 'Templates'), content, {
      name: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_4__.translate)('files', 'New template folder')
    });
    if (name !== null) {
      // Create the template folder
      initTemplatesFolder(context, name);
      // Remove the menu entry
      (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_2__.removeNewFileMenuEntry)('template-picker');
    }
  }
};

/***/ }),

/***/ "./apps/files/src/services/Favorites.ts":
/*!**********************************************!*\
  !*** ./apps/files/src/services/Favorites.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getContents: () => (/* binding */ getContents)
/* harmony export */ });
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _WebdavClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WebdavClient */ "./apps/files/src/services/WebdavClient.ts");
/* harmony import */ var _Files__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Files */ "./apps/files/src/services/Files.ts");



const client = (0,_WebdavClient__WEBPACK_IMPORTED_MODULE_1__.getClient)();
const getContents = async function () {
  var _rootResponse;
  let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
  const propfindPayload = (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.davGetDefaultPropfind)();
  const reportPayload = (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.davGetFavoritesReport)();
  // Get root folder
  let rootResponse;
  if (path === '/') {
    rootResponse = await client.stat(path, {
      details: true,
      data: propfindPayload
    });
  }
  const contentsResponse = await client.getDirectoryContents(path, {
    details: true,
    // Only filter favorites if we're at the root
    data: path === '/' ? reportPayload : propfindPayload,
    headers: {
      // Patched in WebdavClient.ts
      method: path === '/' ? 'REPORT' : 'PROPFIND'
    },
    includeSelf: true
  });
  const root = ((_rootResponse = rootResponse) === null || _rootResponse === void 0 ? void 0 : _rootResponse.data) || contentsResponse.data[0];
  const contents = contentsResponse.data.filter(node => node.filename !== path);
  return {
    folder: (0,_Files__WEBPACK_IMPORTED_MODULE_2__.resultToNode)(root),
    contents: contents.map(_Files__WEBPACK_IMPORTED_MODULE_2__.resultToNode)
  };
};

/***/ }),

/***/ "./apps/files/src/services/Files.ts":
/*!******************************************!*\
  !*** ./apps/files/src/services/Files.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getContents: () => (/* binding */ getContents),
/* harmony export */   resultToNode: () => (/* binding */ resultToNode)
/* harmony export */ });
/* harmony import */ var cancelable_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cancelable-promise */ "./node_modules/cancelable-promise/umd/CancelablePromise.js");
/* harmony import */ var cancelable_promise__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cancelable_promise__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.mjs");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.mjs");
/* harmony import */ var _WebdavClient__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./WebdavClient */ "./apps/files/src/services/WebdavClient.ts");
/* harmony import */ var _utils_hashUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/hashUtils */ "./apps/files/src/utils/hashUtils.ts");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../logger */ "./apps/files/src/logger.js");







const client = (0,_WebdavClient__WEBPACK_IMPORTED_MODULE_4__.getClient)();
const resultToNode = function (node) {
  var _getCurrentUser;
  const userId = (_getCurrentUser = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_3__.getCurrentUser)()) === null || _getCurrentUser === void 0 ? void 0 : _getCurrentUser.uid;
  if (!userId) {
    throw new Error('No user id found');
  }
  const props = node.props;
  const permissions = (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.davParsePermissions)(props === null || props === void 0 ? void 0 : props.permissions);
  const owner = String(props['owner-id'] || userId);
  const source = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_2__.generateRemoteUrl)('dav' + _WebdavClient__WEBPACK_IMPORTED_MODULE_4__.rootPath + node.filename);
  const id = (props === null || props === void 0 ? void 0 : props.fileid) < 0 ? (0,_utils_hashUtils__WEBPACK_IMPORTED_MODULE_5__.hashCode)(source) : (props === null || props === void 0 ? void 0 : props.fileid) || 0;
  const nodeData = {
    id,
    source,
    mtime: new Date(node.lastmod),
    mime: node.mime || 'application/octet-stream',
    size: (props === null || props === void 0 ? void 0 : props.size) || 0,
    permissions,
    owner,
    root: _WebdavClient__WEBPACK_IMPORTED_MODULE_4__.rootPath,
    attributes: {
      ...node,
      ...props,
      'owner-id': owner,
      'owner-display-name': String(props['owner-display-name']),
      hasPreview: !!(props !== null && props !== void 0 && props['has-preview']),
      failed: (props === null || props === void 0 ? void 0 : props.fileid) < 0
    }
  };
  delete nodeData.attributes.props;
  return node.type === 'file' ? new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.File(nodeData) : new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.Folder(nodeData);
};
const getContents = function () {
  let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
  const controller = new AbortController();
  const propfindPayload = (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.davGetDefaultPropfind)();
  return new cancelable_promise__WEBPACK_IMPORTED_MODULE_0__.CancelablePromise(async (resolve, reject, onCancel) => {
    onCancel(() => controller.abort());
    try {
      const contentsResponse = await client.getDirectoryContents(path, {
        details: true,
        data: propfindPayload,
        includeSelf: true,
        signal: controller.signal
      });
      const root = contentsResponse.data[0];
      const contents = contentsResponse.data.slice(1);
      if (root.filename !== path) {
        throw new Error('Root node does not match requested path');
      }
      resolve({
        folder: resultToNode(root),
        contents: contents.map(result => {
          try {
            return resultToNode(result);
          } catch (error) {
            _logger__WEBPACK_IMPORTED_MODULE_6__["default"].error("Invalid node detected '".concat(result.basename, "'"), {
              error
            });
            return null;
          }
        }).filter(Boolean)
      });
    } catch (error) {
      reject(error);
    }
  });
};

/***/ }),

/***/ "./apps/files/src/services/LivePhotos.ts":
/*!***********************************************!*\
  !*** ./apps/files/src/services/LivePhotos.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initLivePhotos: () => (/* binding */ initLivePhotos),
/* harmony export */   isLivePhoto: () => (/* binding */ isLivePhoto)
/* harmony export */ });
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/**
 * @copyright Copyright (c) 2023 Louis Chmn <louis@chmn.me>
 *
 * @author Louis Chmn <louis@chmn.me>
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

function initLivePhotos() {
  (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.registerDavProperty)('nc:metadata-files-live-photo', {
    nc: 'http://nextcloud.org/ns'
  });
}
/**
 * @param {Node} node - The node
 */
function isLivePhoto(node) {
  return node.attributes['metadata-files-live-photo'] !== undefined;
}

/***/ }),

/***/ "./apps/files/src/services/PersonalFiles.ts":
/*!**************************************************!*\
  !*** ./apps/files/src/services/PersonalFiles.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getContents: () => (/* binding */ getContents),
/* harmony export */   isPersonalFile: () => (/* binding */ isPersonalFile)
/* harmony export */ });
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.mjs");
/* harmony import */ var _Files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Files */ "./apps/files/src/services/Files.ts");
var _getCurrentUser;
/**
 * @copyright Copyright (c) 2024 Eduardo Morales <emoral435@gmail.com>
 *
 * @author Eduardo Morales <emoral435@gmail.com>
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



const currUserID = (_getCurrentUser = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_0__.getCurrentUser)()) === null || _getCurrentUser === void 0 ? void 0 : _getCurrentUser.uid;
/**
 * NOTE MOVE TO @nextcloud/files
 * @brief filters each file/folder on its shared status
 * 	A personal file is considered a file that has all of the following properties:
 * 		a.) the current user owns
 * 		b.) the file is not shared with anyone
 * 		c.) the file is not a group folder
 * @param {FileStat} node that contains
 * @return {Boolean}
 */
const isPersonalFile = function (node) {
  // the type of mounts that determine whether the file is shared
  const sharedMountTypes = ["group", "shared"];
  const mountType = node.attributes['mount-type'];
  // the check to determine whether the current logged in user is the owner / creator of the node
  const currUserCreated = currUserID ? node.owner === currUserID : true;
  return currUserCreated && !sharedMountTypes.includes(mountType);
};
const getContents = function () {
  let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "/";
  // get all the files from the current path as a cancellable promise
  // then filter the files that the user does not own, or has shared / is a group folder
  return (0,_Files__WEBPACK_IMPORTED_MODULE_1__.getContents)(path).then(c => {
    c.contents = c.contents.filter(isPersonalFile);
    return c;
  });
};

/***/ }),

/***/ "./apps/files/src/services/Recent.ts":
/*!*******************************************!*\
  !*** ./apps/files/src/services/Recent.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getContents: () => (/* binding */ getContents)
/* harmony export */ });
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.mjs");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _store_userconfig_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../store/userconfig.ts */ "./apps/files/src/store/userconfig.ts");
/* harmony import */ var _store_index_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../store/index.ts */ "./apps/files/src/store/index.ts");




const client = (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.davGetClient)();
const lastTwoWeeksTimestamp = Math.round(Date.now() / 1000 - 60 * 60 * 24 * 14);
/**
 * Get recently changed nodes
 *
 * This takes the users preference about hidden files into account.
 * If hidden files are not shown, then also recently changed files *in* hidden directories are filtered.
 *
 * @param path Path to search for recent changes
 */
const getContents = async function () {
  var _getCurrentUser;
  let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
  const store = (0,_store_userconfig_ts__WEBPACK_IMPORTED_MODULE_2__.useUserConfigStore)(_store_index_ts__WEBPACK_IMPORTED_MODULE_3__.pinia);
  /**
   * Filter function that returns only the visible nodes - or hidden if explicitly configured
   * @param node The node to check
   */
  const filterHidden = node => path !== '/' // We need to hide files from hidden directories in the root if not configured to show
  || store.userConfig.show_hidden // If configured to show hidden files we can early return
  || !node.dirname.split('/').some(dir => dir.startsWith('.')); // otherwise only include the file if non of the parent directories is hidden
  const contentsResponse = await client.getDirectoryContents(path, {
    details: true,
    data: (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.davGetRecentSearch)(lastTwoWeeksTimestamp),
    headers: {
      // Patched in WebdavClient.ts
      method: 'SEARCH',
      // Somehow it's needed to get the correct response
      'Content-Type': 'application/xml; charset=utf-8'
    },
    deep: true
  });
  const contents = contentsResponse.data;
  return {
    folder: new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.Folder({
      id: 0,
      source: "".concat(_nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.davRemoteURL).concat(_nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.davRootPath),
      root: _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.davRootPath,
      owner: ((_getCurrentUser = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_0__.getCurrentUser)()) === null || _getCurrentUser === void 0 ? void 0 : _getCurrentUser.uid) || null,
      permissions: _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.Permission.READ
    }),
    contents: contents.map(r => (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.davResultToNode)(r)).filter(filterHidden)
  };
};

/***/ }),

/***/ "./apps/files/src/services/WebdavClient.ts":
/*!*************************************************!*\
  !*** ./apps/files/src/services/WebdavClient.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   defaultRootUrl: () => (/* binding */ defaultRootUrl),
/* harmony export */   getClient: () => (/* binding */ getClient),
/* harmony export */   rootPath: () => (/* binding */ rootPath)
/* harmony export */ });
/* harmony import */ var webdav__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webdav */ "./node_modules/webdav/dist/web/index.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.mjs");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.mjs");
var _getCurrentUser;
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



const rootPath = "/files/".concat((_getCurrentUser = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__.getCurrentUser)()) === null || _getCurrentUser === void 0 ? void 0 : _getCurrentUser.uid);
const defaultRootUrl = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateRemoteUrl)('dav' + rootPath);
const getClient = function () {
  let rootUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultRootUrl;
  const client = (0,webdav__WEBPACK_IMPORTED_MODULE_0__.createClient)(rootUrl);
  // set CSRF token header
  const setHeaders = token => {
    client === null || client === void 0 || client.setHeaders({
      // Add this so the server knows it is an request from the browser
      'X-Requested-With': 'XMLHttpRequest',
      // Inject user auth
      requesttoken: token !== null && token !== void 0 ? token : ''
    });
  };
  // refresh headers when request token changes
  (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__.onRequestTokenUpdate)(setHeaders);
  setHeaders((0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__.getRequestToken)());
  /**
   * Allow to override the METHOD to support dav REPORT
   *
   * @see https://github.com/perry-mitchell/webdav-client/blob/8d9694613c978ce7404e26a401c39a41f125f87f/source/request.ts
   */
  const patcher = (0,webdav__WEBPACK_IMPORTED_MODULE_0__.getPatcher)();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // https://github.com/perry-mitchell/hot-patcher/issues/6
  patcher.patch('fetch', (url, options) => {
    const headers = options.headers;
    if (headers !== null && headers !== void 0 && headers.method) {
      options.method = headers.method;
      delete headers.method;
    }
    return fetch(url, options);
  });
  return client;
};

/***/ }),

/***/ "./apps/files/src/store/index.ts":
/*!***************************************!*\
  !*** ./apps/files/src/store/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   pinia: () => (/* binding */ pinia)
/* harmony export */ });
/* harmony import */ var pinia__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pinia */ "./node_modules/pinia/dist/pinia.mjs");
/**
 * @copyright Copyright (c) 2024 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * @author Ferdinand Thiessen <opensource@fthiessen.de>
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

const pinia = (0,pinia__WEBPACK_IMPORTED_MODULE_0__.createPinia)();

/***/ }),

/***/ "./apps/files/src/store/userconfig.ts":
/*!********************************************!*\
  !*** ./apps/files/src/store/userconfig.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useUserConfigStore: () => (/* binding */ useUserConfigStore)
/* harmony export */ });
/* harmony import */ var pinia__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! pinia */ "./node_modules/pinia/dist/pinia.mjs");
/* harmony import */ var _nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/event-bus */ "./node_modules/@nextcloud/event-bus/dist/index.mjs");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.mjs");
/* harmony import */ var _nextcloud_initial_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/initial-state */ "./node_modules/@nextcloud/initial-state/dist/index.es.mjs");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.es.mjs");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js");






const userConfig = (0,_nextcloud_initial_state__WEBPACK_IMPORTED_MODULE_2__.loadState)('files', 'config', {
  show_hidden: false,
  crop_image_previews: true,
  sort_favorites_first: true,
  sort_folders_first: true,
  grid_view: false
});
const useUserConfigStore = function () {
  const store = (0,pinia__WEBPACK_IMPORTED_MODULE_4__.defineStore)('userconfig', {
    state: () => ({
      userConfig
    }),
    actions: {
      /**
       * Update the user config local store
       */
      onUpdate(key, value) {
        vue__WEBPACK_IMPORTED_MODULE_5__["default"].set(this.userConfig, key, value);
      },
      /**
       * Update the user config local store AND on server side
       */
      async update(key, value) {
        await _nextcloud_axios__WEBPACK_IMPORTED_MODULE_3__["default"].put((0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateUrl)('/apps/files/api/v1/config/' + key), {
          value
        });
        (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__.emit)('files:config:updated', {
          key,
          value
        });
      }
    }
  });
  const userConfigStore = store(...arguments);
  // Make sure we only register the listeners once
  if (!userConfigStore._initialized) {
    (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__.subscribe)('files:config:updated', function (_ref) {
      let {
        key,
        value
      } = _ref;
      userConfigStore.onUpdate(key, value);
    });
    userConfigStore._initialized = true;
  }
  return userConfigStore;
};

/***/ }),

/***/ "./apps/files/src/utils/fileUtils.ts":
/*!*******************************************!*\
  !*** ./apps/files/src/utils/fileUtils.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   extractFilePaths: () => (/* binding */ extractFilePaths),
/* harmony export */   getSummaryFor: () => (/* binding */ getSummaryFor),
/* harmony export */   getUniqueName: () => (/* binding */ getUniqueName)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "./node_modules/path/path.js");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/**
 * @copyright Copyright (c) 2021 John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */



// TODO: move to @nextcloud/files
/**
 * Create an unique file name
 * @param name The initial name to use
 * @param otherNames Other names that are already used
 * @param options Optional parameters for tuning the behavior
 * @param options.suffix A function that takes an index and returns a suffix to add to the file name, defaults to '(index)'
 * @param options.ignoreFileExtension Set to true to ignore the file extension when adding the suffix (when getting a unique directory name)
 * @return Either the initial name, if unique, or the name with the suffix so that the name is unique
 */
const getUniqueName = function (name, otherNames) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const opts = {
    suffix: n => "(".concat(n, ")"),
    ignoreFileExtension: false,
    ...options
  };
  let newName = name;
  let i = 1;
  while (otherNames.includes(newName)) {
    const ext = opts.ignoreFileExtension ? '' : (0,path__WEBPACK_IMPORTED_MODULE_0__.extname)(name);
    const base = (0,path__WEBPACK_IMPORTED_MODULE_0__.basename)(name, ext);
    newName = "".concat(base, " ").concat(opts.suffix(i++)).concat(ext);
  }
  return newName;
};
/**
 * Extract dir and name from file path
 *
 * @param {string} path the full path
 * @return {string[]} [dirPath, fileName]
 */
const extractFilePaths = function (path) {
  const pathSections = path.split('/');
  const fileName = pathSections[pathSections.length - 1];
  const dirPath = pathSections.slice(0, pathSections.length - 1).join('/');
  return [dirPath, fileName];
};
/**
 * Generate a translated summary of an array of nodes
 * @param {Node[]} nodes the nodes to summarize
 * @return {string}
 */
const getSummaryFor = nodes => {
  const fileCount = nodes.filter(node => node.type === _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.FileType.File).length;
  const folderCount = nodes.filter(node => node.type === _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.FileType.Folder).length;
  if (fileCount === 0) {
    return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_2__.translatePlural)('files', '{folderCount} folder', '{folderCount} folders', folderCount, {
      folderCount
    });
  } else if (folderCount === 0) {
    return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_2__.translatePlural)('files', '{fileCount} file', '{fileCount} files', fileCount, {
      fileCount
    });
  }
  if (fileCount === 1) {
    return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_2__.translatePlural)('files', '1 file and {folderCount} folder', '1 file and {folderCount} folders', folderCount, {
      folderCount
    });
  }
  if (folderCount === 1) {
    return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_2__.translatePlural)('files', '{fileCount} file and 1 folder', '{fileCount} files and 1 folder', fileCount, {
      fileCount
    });
  }
  return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_2__.translate)('files', '{fileCount} files and {folderCount} folders', {
    fileCount,
    folderCount
  });
};

/***/ }),

/***/ "./apps/files/src/utils/hashUtils.ts":
/*!*******************************************!*\
  !*** ./apps/files/src/utils/hashUtils.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hashCode: () => (/* binding */ hashCode)
/* harmony export */ });
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
const hashCode = function (str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i) | 0;
  }
  return hash >>> 0;
};

/***/ }),

/***/ "./apps/files/src/utils/newNodeDialog.ts":
/*!***********************************************!*\
  !*** ./apps/files/src/utils/newNodeDialog.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   newNodeName: () => (/* binding */ newNodeName)
/* harmony export */ });
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.mjs");
/* harmony import */ var _components_NewNodeDialog_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/NewNodeDialog.vue */ "./apps/files/src/components/NewNodeDialog.vue");
/**
 * @copyright Copyright (c) 2024 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * @author Ferdinand Thiessen <opensource@fthiessen.de>
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


/**
 * Ask user for file or folder name
 * @param defaultName Default name to use
 * @param folderContent Nodes with in the current folder to check for unique name
 * @param labels Labels to set on the dialog
 * @return string if successfull otherwise null if aborted
 */
function newNodeName(defaultName, folderContent) {
  let labels = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const contentNames = folderContent.map(node => node.basename);
  return new Promise(resolve => {
    (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_0__.spawnDialog)(_components_NewNodeDialog_vue__WEBPACK_IMPORTED_MODULE_1__["default"], {
      ...labels,
      defaultName,
      otherNames: contentNames
    }, folderName => {
      resolve(folderName);
    });
  });
}

/***/ }),

/***/ "./apps/files/src/views/favorites.ts":
/*!*******************************************!*\
  !*** ./apps/files/src/views/favorites.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   generateFavoriteFolderView: () => (/* binding */ generateFavoriteFolderView),
/* harmony export */   generateIdFromPath: () => (/* binding */ generateIdFromPath)
/* harmony export */ });
/* harmony import */ var _nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/event-bus */ "./node_modules/@nextcloud/event-bus/dist/index.mjs");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_initial_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/initial-state */ "./node_modules/@nextcloud/initial-state/dist/index.es.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! path */ "./node_modules/path/path.js");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _mdi_svg_svg_folder_svg_raw__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mdi/svg/svg/folder.svg?raw */ "./node_modules/@mdi/svg/svg/folder.svg?raw");
/* harmony import */ var _mdi_svg_svg_star_svg_raw__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mdi/svg/svg/star.svg?raw */ "./node_modules/@mdi/svg/svg/star.svg?raw");
/* harmony import */ var _services_Favorites__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/Favorites */ "./apps/files/src/services/Favorites.ts");
/* harmony import */ var _utils_hashUtils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/hashUtils */ "./apps/files/src/utils/hashUtils.ts");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../logger */ "./apps/files/src/logger.js");










const generateFavoriteFolderView = function (folder) {
  let index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.View({
    id: generateIdFromPath(folder.path),
    name: (0,path__WEBPACK_IMPORTED_MODULE_4__.basename)(folder.path),
    icon: _mdi_svg_svg_folder_svg_raw__WEBPACK_IMPORTED_MODULE_5__,
    order: index,
    params: {
      dir: folder.path,
      fileid: folder.fileid.toString(),
      view: 'favorites'
    },
    parent: 'favorites',
    columns: [],
    getContents: _services_Favorites__WEBPACK_IMPORTED_MODULE_7__.getContents
  });
};
const generateIdFromPath = function (path) {
  return "favorite-".concat((0,_utils_hashUtils__WEBPACK_IMPORTED_MODULE_8__.hashCode)(path));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  // Load state in function for mock testing purposes
  const favoriteFolders = (0,_nextcloud_initial_state__WEBPACK_IMPORTED_MODULE_2__.loadState)('files', 'favoriteFolders', []);
  const favoriteFoldersViews = favoriteFolders.map((folder, index) => generateFavoriteFolderView(folder, index));
  _logger__WEBPACK_IMPORTED_MODULE_9__["default"].debug('Generating favorites view', {
    favoriteFolders
  });
  const Navigation = (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.getNavigation)();
  Navigation.register(new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.View({
    id: 'favorites',
    name: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Favorites'),
    caption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'List of favorites files and folders.'),
    emptyTitle: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'No favorites yet'),
    emptyCaption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate)('files', 'Files and folders you mark as favorite will show up here'),
    icon: _mdi_svg_svg_star_svg_raw__WEBPACK_IMPORTED_MODULE_6__,
    order: 15,
    columns: [],
    getContents: _services_Favorites__WEBPACK_IMPORTED_MODULE_7__.getContents
  }));
  favoriteFoldersViews.forEach(view => Navigation.register(view));
  /**
   * Update favourites navigation when a new folder is added
   */
  (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__.subscribe)('files:favorites:added', node => {
    var _node$root;
    if (node.type !== _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.FileType.Folder) {
      return;
    }
    // Sanity check
    if (node.path === null || !((_node$root = node.root) !== null && _node$root !== void 0 && _node$root.startsWith('/files'))) {
      _logger__WEBPACK_IMPORTED_MODULE_9__["default"].error('Favorite folder is not within user files root', {
        node
      });
      return;
    }
    addToFavorites(node);
  });
  /**
   * Remove favourites navigation when a folder is removed
   */
  (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__.subscribe)('files:favorites:removed', node => {
    var _node$root2;
    if (node.type !== _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.FileType.Folder) {
      return;
    }
    // Sanity check
    if (node.path === null || !((_node$root2 = node.root) !== null && _node$root2 !== void 0 && _node$root2.startsWith('/files'))) {
      _logger__WEBPACK_IMPORTED_MODULE_9__["default"].error('Favorite folder is not within user files root', {
        node
      });
      return;
    }
    removePathFromFavorites(node.path);
  });
  /**
   * Update favourites navigation when a folder is renamed
   */
  (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__.subscribe)('files:node:renamed', node => {
    if (node.type !== _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.FileType.Folder) {
      return;
    }
    if (node.attributes.favorite !== 1) {
      return;
    }
    updateNodeFromFavorites(node);
  });
  /**
   * Sort the favorites paths array and
   * update the order property of the existing views
   */
  const updateAndSortViews = function () {
    favoriteFolders.sort((a, b) => a.path.localeCompare(b.path, (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.getLanguage)(), {
      ignorePunctuation: true
    }));
    favoriteFolders.forEach((folder, index) => {
      const view = favoriteFoldersViews.find(view => view.id === generateIdFromPath(folder.path));
      if (view) {
        view.order = index;
      }
    });
  };
  // Add a folder to the favorites paths array and update the views
  const addToFavorites = function (node) {
    const newFavoriteFolder = {
      path: node.path,
      fileid: node.fileid
    };
    const view = generateFavoriteFolderView(newFavoriteFolder);
    // Skip if already exists
    if (favoriteFolders.find(folder => folder.path === node.path)) {
      return;
    }
    // Update arrays
    favoriteFolders.push(newFavoriteFolder);
    favoriteFoldersViews.push(view);
    // Update and sort views
    updateAndSortViews();
    Navigation.register(view);
  };
  // Remove a folder from the favorites paths array and update the views
  const removePathFromFavorites = function (path) {
    const id = generateIdFromPath(path);
    const index = favoriteFolders.findIndex(folder => folder.path === path);
    // Skip if not exists
    if (index === -1) {
      return;
    }
    // Update arrays
    favoriteFolders.splice(index, 1);
    favoriteFoldersViews.splice(index, 1);
    // Update and sort views
    Navigation.remove(id);
    updateAndSortViews();
  };
  // Update a folder from the favorites paths array and update the views
  const updateNodeFromFavorites = function (node) {
    const favoriteFolder = favoriteFolders.find(folder => folder.fileid === node.fileid);
    // Skip if it does not exists
    if (favoriteFolder === undefined) {
      return;
    }
    removePathFromFavorites(favoriteFolder.path);
    addToFavorites(node);
  };
});

/***/ }),

/***/ "./apps/files/src/views/files.ts":
/*!***************************************!*\
  !*** ./apps/files/src/views/files.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _mdi_svg_svg_folder_svg_raw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mdi/svg/svg/folder.svg?raw */ "./node_modules/@mdi/svg/svg/folder.svg?raw");
/* harmony import */ var _services_Files__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/Files */ "./apps/files/src/services/Files.ts");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
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




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  const Navigation = (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_3__.getNavigation)();
  Navigation.register(new _nextcloud_files__WEBPACK_IMPORTED_MODULE_3__.View({
    id: 'files',
    name: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files', 'All files'),
    caption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files', 'List of your files and folders.'),
    icon: _mdi_svg_svg_folder_svg_raw__WEBPACK_IMPORTED_MODULE_1__,
    order: 0,
    getContents: _services_Files__WEBPACK_IMPORTED_MODULE_2__.getContents
  }));
});

/***/ }),

/***/ "./apps/files/src/views/personal-files.ts":
/*!************************************************!*\
  !*** ./apps/files/src/views/personal-files.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _services_PersonalFiles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/PersonalFiles */ "./apps/files/src/services/PersonalFiles.ts");
/* harmony import */ var _mdi_svg_svg_account_svg_raw__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @mdi/svg/svg/account.svg?raw */ "./node_modules/@mdi/svg/svg/account.svg?raw");
/**
 * @copyright Copyright (c) 2024 Eduardo Morales <emoral435@gmail.com>
 *
 * @author Eduardo Morales <emoral435@gmail.com>
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




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  const Navigation = (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.getNavigation)();
  Navigation.register(new _nextcloud_files__WEBPACK_IMPORTED_MODULE_1__.View({
    id: 'personal',
    name: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files', 'Personal Files'),
    caption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files', 'List of your files and folders that are not shared.'),
    emptyTitle: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files', 'No personal files found'),
    emptyCaption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files', 'Files that are not shared will show up here.'),
    icon: _mdi_svg_svg_account_svg_raw__WEBPACK_IMPORTED_MODULE_3__,
    order: 5,
    getContents: _services_PersonalFiles__WEBPACK_IMPORTED_MODULE_2__.getContents
  }));
});

/***/ }),

/***/ "./apps/files/src/views/recent.ts":
/*!****************************************!*\
  !*** ./apps/files/src/views/recent.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _mdi_svg_svg_history_svg_raw__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mdi/svg/svg/history.svg?raw */ "./node_modules/@mdi/svg/svg/history.svg?raw");
/* harmony import */ var _services_Recent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/Recent */ "./apps/files/src/services/Recent.ts");
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




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  const Navigation = (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.getNavigation)();
  Navigation.register(new _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.View({
    id: 'recent',
    name: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__.translate)('files', 'Recent'),
    caption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__.translate)('files', 'List of recently modified files and folders.'),
    emptyTitle: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__.translate)('files', 'No recently modified files'),
    emptyCaption: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__.translate)('files', 'Files and folders you recently modified will show up here.'),
    icon: _mdi_svg_svg_history_svg_raw__WEBPACK_IMPORTED_MODULE_2__,
    order: 10,
    defaultSortKey: 'mtime',
    getContents: _services_Recent__WEBPACK_IMPORTED_MODULE_3__.getContents
  }));
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-4.use[1]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./apps/files/src/components/NewNodeDialog.vue?vue&type=script&lang=ts":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-4.use[1]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./apps/files/src/components/NewNodeDialog.vue?vue&type=script&lang=ts ***!
  \*******************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _utils_fileUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/fileUtils */ "./apps/files/src/utils/fileUtils.ts");
/* harmony import */ var _nextcloud_vue_dist_Components_NcButton_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/vue/dist/Components/NcButton.js */ "./node_modules/@nextcloud/vue/dist/Components/NcButton.mjs");
/* harmony import */ var _nextcloud_vue_dist_Components_NcDialog_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/vue/dist/Components/NcDialog.js */ "./node_modules/@nextcloud/vue/dist/Components/NcDialog.mjs");
/* harmony import */ var _nextcloud_vue_dist_Components_NcTextField_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/vue/dist/Components/NcTextField.js */ "./node_modules/@nextcloud/vue/dist/Components/NcTextField.mjs");






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,vue__WEBPACK_IMPORTED_MODULE_5__.defineComponent)({
  name: 'NewNodeDialog',
  components: {
    NcButton: _nextcloud_vue_dist_Components_NcButton_js__WEBPACK_IMPORTED_MODULE_2__["default"],
    NcDialog: _nextcloud_vue_dist_Components_NcDialog_js__WEBPACK_IMPORTED_MODULE_3__["default"],
    NcTextField: _nextcloud_vue_dist_Components_NcTextField_js__WEBPACK_IMPORTED_MODULE_4__["default"]
  },
  props: {
    /**
     * The name to be used by default
     */
    defaultName: {
      type: String,
      default: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files', 'New folder')
    },
    /**
     * Other files that are in the current directory
     */
    otherNames: {
      type: Array,
      default: () => []
    },
    /**
     * Open state of the dialog
     */
    open: {
      type: Boolean,
      default: true
    },
    /**
     * Dialog name
     */
    name: {
      type: String,
      default: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files', 'Create new folder')
    },
    /**
     * Input label
     */
    label: {
      type: String,
      default: (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files', 'Folder name')
    }
  },
  emits: {
    close: name => name === null || name
  },
  data() {
    return {
      localDefaultName: this.defaultName || (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files', 'New folder')
    };
  },
  computed: {
    errorMessage() {
      if (this.isUniqueName) {
        return '';
      } else {
        return (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files', 'A file or folder with that name already exists.');
      }
    },
    uniqueName() {
      return (0,_utils_fileUtils__WEBPACK_IMPORTED_MODULE_1__.getUniqueName)(this.localDefaultName, this.otherNames);
    },
    isUniqueName() {
      return this.localDefaultName === this.uniqueName;
    }
  },
  watch: {
    defaultName() {
      this.localDefaultName = this.defaultName || (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate)('files', 'New folder');
    },
    /**
     * Ensure the input is focussed even if the dialog is already mounted but not open
     */
    open() {
      this.$nextTick(() => this.focusInput());
    }
  },
  mounted() {
    // on mounted lets use the unique name
    this.localDefaultName = this.uniqueName;
    this.$nextTick(() => this.focusInput());
  },
  methods: {
    t: _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_0__.translate,
    /**
     * Focus the filename input field
     */
    focusInput() {
      if (this.open) {
        this.$nextTick(() => {
          var _this$$refs$input, _this$$refs$input$foc;
          return (_this$$refs$input = this.$refs.input) === null || _this$$refs$input === void 0 || (_this$$refs$input$foc = _this$$refs$input.focus) === null || _this$$refs$input$foc === void 0 ? void 0 : _this$$refs$input$foc.call(_this$$refs$input);
        });
      }
    },
    onCreate() {
      this.$emit('close', this.localDefaultName);
    },
    onClose(state) {
      if (!state) {
        this.$emit('close', null);
      }
    }
  }
}));

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./apps/files/src/components/NewNodeDialog.vue?vue&type=template&id=e6b9c05a":
/*!********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./apps/files/src/components/NewNodeDialog.vue?vue&type=template&id=e6b9c05a ***!
  \********************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* binding */ render),
/* harmony export */   staticRenderFns: () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c,
    _setup = _vm._self._setupProxy;
  return _c("NcDialog", {
    attrs: {
      name: _vm.name,
      open: _vm.open,
      "close-on-click-outside": "",
      "out-transition": ""
    },
    on: {
      "update:open": _vm.onClose
    },
    scopedSlots: _vm._u([{
      key: "actions",
      fn: function () {
        return [_c("NcButton", {
          attrs: {
            type: "primary",
            disabled: !_vm.isUniqueName
          },
          on: {
            click: _vm.onCreate
          }
        }, [_vm._v("\n\t\t\t" + _vm._s(_vm.t("files", "Create")) + "\n\t\t")])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("form", {
    on: {
      submit: function ($event) {
        $event.preventDefault();
        return _vm.onCreate.apply(null, arguments);
      }
    }
  }, [_c("NcTextField", {
    ref: "input",
    attrs: {
      error: !_vm.isUniqueName,
      "helper-text": _vm.errorMessage,
      label: _vm.label,
      value: _vm.localDefaultName
    },
    on: {
      "update:value": function ($event) {
        _vm.localDefaultName = $event;
      }
    }
  })], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/@nextcloud/upload/dist/assets/index-Ussc_ol3.css":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/@nextcloud/upload/dist/assets/index-Ussc_ol3.css ***!
  \*************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../css-loader/dist/runtime/noSourceMaps.js */ "./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.upload-picker[data-v-eca9500a] {
  display: inline-flex;
  align-items: center;
  height: 44px;
}
.upload-picker__progress[data-v-eca9500a] {
  width: 200px;
  max-width: 0;
  transition: max-width var(--animation-quick) ease-in-out;
  margin-top: 8px;
}
.upload-picker__progress p[data-v-eca9500a] {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.upload-picker--uploading .upload-picker__progress[data-v-eca9500a] {
  max-width: 200px;
  margin-right: 20px;
  margin-left: 8px;
}
.upload-picker--paused .upload-picker__progress[data-v-eca9500a] {
  animation: breathing-eca9500a 3s ease-out infinite normal;
}
@keyframes breathing-eca9500a {
  0% {
    opacity: .5;
  }
  25% {
    opacity: 1;
  }
  60% {
    opacity: .5;
  }
  to {
    opacity: .5;
  }
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/simple-eta/index.js":
/*!******************************************!*\
  !*** ./node_modules/simple-eta/index.js ***!
  \******************************************/
/***/ ((module) => {

// @flow

/*::
type Options = {
  max?: number,
  min?: number,
  historyTimeConstant?: number,
  autostart?: boolean,
  ignoreSameProgress?: boolean,
}
*/

function makeLowPassFilter(RC/*: number*/) {
  return function (previousOutput, input, dt) {
    const alpha = dt / (dt + RC);
    return previousOutput + alpha * (input - previousOutput);
  }
}

function def/*:: <T>*/(x/*: ?T*/, d/*: T*/)/*: T*/ {
  return (x === undefined || x === null) ? d : x;
}

function makeEta(options/*::?: Options */) {
  options = options || {};
  var max = def(options.max, 1);
  var min = def(options.min, 0);
  var autostart = def(options.autostart, true);
  var ignoreSameProgress = def(options.ignoreSameProgress, false);

  var rate/*: number | null */ = null;
  var lastTimestamp/*: number | null */ = null;
  var lastProgress/*: number | null */ = null;

  var filter = makeLowPassFilter(def(options.historyTimeConstant, 2.5));

  function start() {
    report(min);
  }

  function reset() {
    rate = null;
    lastTimestamp = null;
    lastProgress = null;
    if (autostart) {
      start();
    }
  }

  function report(progress /*: number */, timestamp/*::?: number */) {
    if (typeof timestamp !== 'number') {
      timestamp = Date.now();
    }

    if (lastTimestamp === timestamp) { return; }
    if (ignoreSameProgress && lastProgress === progress) { return; }

    if (lastTimestamp === null || lastProgress === null) {
      lastProgress = progress;
      lastTimestamp = timestamp;
      return;
    }

    var deltaProgress = progress - lastProgress;
    var deltaTimestamp = 0.001 * (timestamp - lastTimestamp);
    var currentRate = deltaProgress / deltaTimestamp;

    rate = rate === null
      ? currentRate
      : filter(rate, currentRate, deltaTimestamp);
    lastProgress = progress;
    lastTimestamp = timestamp;
  }

  function estimate(timestamp/*::?: number*/) {
    if (lastProgress === null) { return Infinity; }
    if (lastProgress >= max) { return 0; }
    if (rate === null) { return Infinity; }

    var estimatedTime = (max - lastProgress) / rate;
    if (typeof timestamp === 'number' && typeof lastTimestamp === 'number') {
      estimatedTime -= (timestamp - lastTimestamp) * 0.001;
    }
    return Math.max(0, estimatedTime);
  }

  function getRate() {
    return rate === null ? 0 : rate;
  }

  return {
    start: start,
    reset: reset,
    report: report,
    estimate: estimate,
    rate: getRate,
  }
}

module.exports = makeEta;


/***/ }),

/***/ "./node_modules/@nextcloud/upload/dist/assets/index-Ussc_ol3.css":
/*!***********************************************************************!*\
  !*** ./node_modules/@nextcloud/upload/dist/assets/index-Ussc_ol3.css ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _css_loader_dist_cjs_js_index_Ussc_ol3_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../css-loader/dist/cjs.js!./index-Ussc_ol3.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/@nextcloud/upload/dist/assets/index-Ussc_ol3.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_index_Ussc_ol3_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_index_Ussc_ol3_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _css_loader_dist_cjs_js_index_Ussc_ol3_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _css_loader_dist_cjs_js_index_Ussc_ol3_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./apps/files/src/components/NewNodeDialog.vue":
/*!*****************************************************!*\
  !*** ./apps/files/src/components/NewNodeDialog.vue ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _NewNodeDialog_vue_vue_type_template_id_e6b9c05a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NewNodeDialog.vue?vue&type=template&id=e6b9c05a */ "./apps/files/src/components/NewNodeDialog.vue?vue&type=template&id=e6b9c05a");
/* harmony import */ var _NewNodeDialog_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NewNodeDialog.vue?vue&type=script&lang=ts */ "./apps/files/src/components/NewNodeDialog.vue?vue&type=script&lang=ts");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _NewNodeDialog_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"],
  _NewNodeDialog_vue_vue_type_template_id_e6b9c05a__WEBPACK_IMPORTED_MODULE_0__.render,
  _NewNodeDialog_vue_vue_type_template_id_e6b9c05a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "apps/files/src/components/NewNodeDialog.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./apps/files/src/components/NewNodeDialog.vue?vue&type=script&lang=ts":
/*!*****************************************************************************!*\
  !*** ./apps/files/src/components/NewNodeDialog.vue?vue&type=script&lang=ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_ts_loader_index_js_clonedRuleSet_4_use_1_node_modules_vue_loader_lib_index_js_vue_loader_options_NewNodeDialog_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js!../../../../node_modules/ts-loader/index.js??clonedRuleSet-4.use[1]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NewNodeDialog.vue?vue&type=script&lang=ts */ "./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-4.use[1]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./apps/files/src/components/NewNodeDialog.vue?vue&type=script&lang=ts");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_ts_loader_index_js_clonedRuleSet_4_use_1_node_modules_vue_loader_lib_index_js_vue_loader_options_NewNodeDialog_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./apps/files/src/components/NewNodeDialog.vue?vue&type=template&id=e6b9c05a":
/*!***********************************************************************************!*\
  !*** ./apps/files/src/components/NewNodeDialog.vue?vue&type=template&id=e6b9c05a ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_NewNodeDialog_vue_vue_type_template_id_e6b9c05a__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_NewNodeDialog_vue_vue_type_template_id_e6b9c05a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_NewNodeDialog_vue_vue_type_template_id_e6b9c05a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NewNodeDialog.vue?vue&type=template&id=e6b9c05a */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./apps/files/src/components/NewNodeDialog.vue?vue&type=template&id=e6b9c05a");


/***/ }),

/***/ "data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20height=%2716%27%20width=%2716%27%3e%3cpath%20d=%27M14%2012.3L12.3%2014%208%209.7%203.7%2014%202%2012.3%206.3%208%202%203.7%203.7%202%208%206.3%2012.3%202%2014%203.7%209.7%208z%27%20style=%27fill-opacity:1;fill:%23ffffff%27/%3e%3c/svg%3e":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20height=%2716%27%20width=%2716%27%3e%3cpath%20d=%27M14%2012.3L12.3%2014%208%209.7%203.7%2014%202%2012.3%206.3%208%202%203.7%203.7%202%208%206.3%2012.3%202%2014%203.7%209.7%208z%27%20style=%27fill-opacity:1;fill:%23ffffff%27/%3e%3c/svg%3e ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20height=%2716%27%20width=%2716%27%3e%3cpath%20d=%27M14%2012.3L12.3%2014%208%209.7%203.7%2014%202%2012.3%206.3%208%202%203.7%203.7%202%208%206.3%2012.3%202%2014%203.7%209.7%208z%27%20style=%27fill-opacity:1;fill:%23ffffff%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20height=%2716%27%20width=%2716%27%3e%3cpath%20d=%27M14%2012.3L12.3%2014%208%209.7%203.7%2014%202%2012.3%206.3%208%202%203.7%203.7%202%208%206.3%2012.3%202%2014%203.7%209.7%208z%27/%3e%3c/svg%3e":
/*!*****************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20height=%2716%27%20width=%2716%27%3e%3cpath%20d=%27M14%2012.3L12.3%2014%208%209.7%203.7%2014%202%2012.3%206.3%208%202%203.7%203.7%202%208%206.3%2012.3%202%2014%203.7%209.7%208z%27/%3e%3c/svg%3e ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20height=%2716%27%20width=%2716%27%3e%3cpath%20d=%27M14%2012.3L12.3%2014%208%209.7%203.7%2014%202%2012.3%206.3%208%202%203.7%203.7%202%208%206.3%2012.3%202%2014%203.7%209.7%208z%27/%3e%3c/svg%3e";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/account.svg?raw":
/*!***************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/account.svg?raw ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-account\" viewBox=\"0 0 24 24\"><path d=\"M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/arrow-down.svg?raw":
/*!******************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/arrow-down.svg?raw ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-arrow-down\" viewBox=\"0 0 24 24\"><path d=\"M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/close.svg?raw":
/*!*************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/close.svg?raw ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-close\" viewBox=\"0 0 24 24\"><path d=\"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/folder-plus.svg?raw":
/*!*******************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/folder-plus.svg?raw ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-folder-plus\" viewBox=\"0 0 24 24\"><path d=\"M13 19C13 19.34 13.04 19.67 13.09 20H4C2.9 20 2 19.11 2 18V6C2 4.89 2.89 4 4 4H10L12 6H20C21.1 6 22 6.89 22 8V13.81C21.12 13.3 20.1 13 19 13C15.69 13 13 15.69 13 19M20 18V15H18V18H15V20H18V23H20V20H23V18H20Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/folder.svg?raw":
/*!**************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/folder.svg?raw ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-folder\" viewBox=\"0 0 24 24\"><path d=\"M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/history.svg?raw":
/*!***************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/history.svg?raw ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-history\" viewBox=\"0 0 24 24\"><path d=\"M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/laptop.svg?raw":
/*!**************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/laptop.svg?raw ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-laptop\" viewBox=\"0 0 24 24\"><path d=\"M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/network-off.svg?raw":
/*!*******************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/network-off.svg?raw ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-network-off\" viewBox=\"0 0 24 24\"><path d=\"M1,5.27L5,9.27V15A2,2 0 0,0 7,17H11V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H17.73L19.73,24L21,22.72L2.28,4L1,5.27M15,20A1,1 0 0,0 14,19H13V17.27L15.73,20H15M17.69,16.87L5.13,4.31C5.41,3.55 6.14,3 7,3H17A2,2 0 0,1 19,5V15C19,15.86 18.45,16.59 17.69,16.87M22,20V21.18L20.82,20H22Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/pencil.svg?raw":
/*!**************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/pencil.svg?raw ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-pencil\" viewBox=\"0 0 24 24\"><path d=\"M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/plus.svg?raw":
/*!************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/plus.svg?raw ***!
  \************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-plus\" viewBox=\"0 0 24 24\"><path d=\"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/star-outline.svg?raw":
/*!********************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/star-outline.svg?raw ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-star-outline\" viewBox=\"0 0 24 24\"><path d=\"M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/star.svg?raw":
/*!************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/star.svg?raw ***!
  \************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-star\" viewBox=\"0 0 24 24\"><path d=\"M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@mdi/svg/svg/trash-can.svg?raw":
/*!*****************************************************!*\
  !*** ./node_modules/@mdi/svg/svg/trash-can.svg?raw ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"mdi-trash-can\" viewBox=\"0 0 24 24\"><path d=\"M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M9,8H11V17H9V8M13,8H15V17H13V8Z\" /></svg>";

/***/ }),

/***/ "./node_modules/@nextcloud/upload/dist/chunks/index-DM2X1kc6.mjs":
/*!***********************************************************************!*\
  !*** ./node_modules/@nextcloud/upload/dist/chunks/index-DM2X1kc6.mjs ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ I),
/* harmony export */   U: () => (/* binding */ Ys),
/* harmony export */   a: () => (/* binding */ Gs),
/* harmony export */   b: () => (/* binding */ ns),
/* harmony export */   c: () => (/* binding */ c),
/* harmony export */   g: () => (/* binding */ M),
/* harmony export */   h: () => (/* binding */ Us),
/* harmony export */   l: () => (/* binding */ g),
/* harmony export */   n: () => (/* binding */ y),
/* harmony export */   o: () => (/* binding */ ys),
/* harmony export */   t: () => (/* binding */ u),
/* harmony export */   u: () => (/* binding */ Vs)
/* harmony export */ });
/* harmony import */ var _assets_index_Ussc_ol3_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/index-Ussc_ol3.css */ "./node_modules/@nextcloud/upload/dist/assets/index-Ussc_ol3.css");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var _nextcloud_paths__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/paths */ "./node_modules/@nextcloud/paths/dist/index.js");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.mjs");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.mjs");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.es.mjs");
/* harmony import */ var p_cancelable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! p-cancelable */ "./node_modules/p-cancelable/index.js");
/* harmony import */ var p_queue__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! p-queue */ "./node_modules/@nextcloud/upload/node_modules/p-queue/dist/index.js");
/* harmony import */ var _nextcloud_logger__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @nextcloud/logger */ "./node_modules/@nextcloud/logger/dist/index.js");
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.mjs");
/* harmony import */ var simple_eta__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! simple-eta */ "./node_modules/simple-eta/index.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js");
/* harmony import */ var _nextcloud_vue_dist_Components_NcActionButton_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @nextcloud/vue/dist/Components/NcActionButton.js */ "./node_modules/@nextcloud/vue/dist/Components/NcActionButton.mjs");
/* harmony import */ var _nextcloud_vue_dist_Components_NcActions_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @nextcloud/vue/dist/Components/NcActions.js */ "./node_modules/@nextcloud/vue/dist/Components/NcActions.mjs");
/* harmony import */ var _nextcloud_vue_dist_Components_NcButton_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @nextcloud/vue/dist/Components/NcButton.js */ "./node_modules/@nextcloud/vue/dist/Components/NcButton.mjs");
/* harmony import */ var _nextcloud_vue_dist_Components_NcIconSvgWrapper_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @nextcloud/vue/dist/Components/NcIconSvgWrapper.js */ "./node_modules/@nextcloud/vue/dist/Components/NcIconSvgWrapper.mjs");
/* harmony import */ var _nextcloud_vue_dist_Components_NcProgressBar_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @nextcloud/vue/dist/Components/NcProgressBar.js */ "./node_modules/@nextcloud/vue/dist/Components/NcProgressBar.mjs");
/* harmony import */ var _nextcloud_l10n_gettext__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @nextcloud/l10n/gettext */ "./node_modules/@nextcloud/l10n/dist/gettext.mjs");



















const A = async function(e, s, t, n = () => {
}, i = void 0, o = {}) {
  let l;
  return s instanceof Blob ? l = s : l = await s(), i && (o.Destination = i), o["Content-Type"] || (o["Content-Type"] = "application/octet-stream"), await _nextcloud_axios__WEBPACK_IMPORTED_MODULE_5__["default"].request({
    method: "PUT",
    url: e,
    data: l,
    signal: t,
    onUploadProgress: n,
    headers: o
  });
}, B = function(e, s, t) {
  return s === 0 && e.size <= t ? Promise.resolve(new Blob([e], { type: e.type || "application/octet-stream" })) : Promise.resolve(new Blob([e.slice(s, s + t)], { type: "application/octet-stream" }));
}, ts = async function(e = void 0) {
  const s = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_3__.generateRemoteUrl)(`dav/uploads/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_4__.getCurrentUser)()?.uid}`), n = `web-file-upload-${[...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join("")}`, i = `${s}/${n}`, o = e ? { Destination: e } : void 0;
  return await _nextcloud_axios__WEBPACK_IMPORTED_MODULE_5__["default"].request({
    method: "MKCOL",
    url: i,
    headers: o
  }), i;
}, x = function(e = void 0) {
  const s = window.OC?.appConfig?.files?.max_chunk_size;
  if (s <= 0)
    return 0;
  if (!Number(s))
    return 10 * 1024 * 1024;
  const t = Math.max(Number(s), 5 * 1024 * 1024);
  return e === void 0 ? t : Math.max(t, Math.ceil(e / 1e4));
};
var c = /* @__PURE__ */ ((e) => (e[e.INITIALIZED = 0] = "INITIALIZED", e[e.UPLOADING = 1] = "UPLOADING", e[e.ASSEMBLING = 2] = "ASSEMBLING", e[e.FINISHED = 3] = "FINISHED", e[e.CANCELLED = 4] = "CANCELLED", e[e.FAILED = 5] = "FAILED", e))(c || {});
let ns = class {
  _source;
  _file;
  _isChunked;
  _chunks;
  _size;
  _uploaded = 0;
  _startTime = 0;
  _status = 0;
  _controller;
  _response = null;
  constructor(s, t = !1, n, i) {
    const o = Math.min(x() > 0 ? Math.ceil(n / x()) : 1, 1e4);
    this._source = s, this._isChunked = t && x() > 0 && o > 1, this._chunks = this._isChunked ? o : 1, this._size = n, this._file = i, this._controller = new AbortController();
  }
  get source() {
    return this._source;
  }
  get file() {
    return this._file;
  }
  get isChunked() {
    return this._isChunked;
  }
  get chunks() {
    return this._chunks;
  }
  get size() {
    return this._size;
  }
  get startTime() {
    return this._startTime;
  }
  set response(s) {
    this._response = s;
  }
  get response() {
    return this._response;
  }
  get uploaded() {
    return this._uploaded;
  }
  /**
   * Update the uploaded bytes of this upload
   */
  set uploaded(s) {
    if (s >= this._size) {
      this._status = this._isChunked ? 2 : 3, this._uploaded = this._size;
      return;
    }
    this._status = 1, this._uploaded = s, this._startTime === 0 && (this._startTime = (/* @__PURE__ */ new Date()).getTime());
  }
  get status() {
    return this._status;
  }
  /**
   * Update this upload status
   */
  set status(s) {
    this._status = s;
  }
  /**
   * Returns the axios cancel token source
   */
  get signal() {
    return this._controller.signal;
  }
  /**
   * Cancel any ongoing requests linked to this upload
   */
  cancel() {
    this._controller.abort(), this._status = 4;
  }
};
/**
 * @copyright 2019 Christoph Wurst <christoph@winzerhof-wurst.at>
 *
 * @author Christoph Wurst <christoph@winzerhof-wurst.at>
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
const as = (e) => e === null ? (0,_nextcloud_logger__WEBPACK_IMPORTED_MODULE_7__.getLoggerBuilder)().setApp("uploader").build() : (0,_nextcloud_logger__WEBPACK_IMPORTED_MODULE_7__.getLoggerBuilder)().setApp("uploader").setUid(e.uid).build(), g = as((0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_4__.getCurrentUser)());
var I = /* @__PURE__ */ ((e) => (e[e.IDLE = 0] = "IDLE", e[e.UPLOADING = 1] = "UPLOADING", e[e.PAUSED = 2] = "PAUSED", e))(I || {});
class N {
  // Initialized via setter in the constructor
  _destinationFolder;
  _isPublic;
  // Global upload queue
  _uploadQueue = [];
  _jobQueue = new p_queue__WEBPACK_IMPORTED_MODULE_16__["default"]({ concurrency: 3 });
  _queueSize = 0;
  _queueProgress = 0;
  _queueStatus = 0;
  _notifiers = [];
  /**
   * Initialize uploader
   *
   * @param {boolean} isPublic are we in public mode ?
   * @param {Folder} destinationFolder the context folder to operate, relative to the root folder
   */
  constructor(s = !1, t) {
    if (this._isPublic = s, !t) {
      const n = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_4__.getCurrentUser)()?.uid, i = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_3__.generateRemoteUrl)(`dav/files/${n}`);
      if (!n)
        throw new Error("User is not logged in");
      t = new _nextcloud_files__WEBPACK_IMPORTED_MODULE_2__.Folder({
        id: 0,
        owner: n,
        permissions: _nextcloud_files__WEBPACK_IMPORTED_MODULE_2__.Permission.ALL,
        root: `/files/${n}`,
        source: i
      });
    }
    this.destination = t, g.debug("Upload workspace initialized", {
      destination: this.destination,
      root: this.root,
      isPublic: s,
      maxChunksSize: x()
    });
  }
  /**
   * Get the upload destination path relative to the root folder
   */
  get destination() {
    return this._destinationFolder;
  }
  /**
   * Set the upload destination path relative to the root folder
   */
  set destination(s) {
    if (!s)
      throw new Error("Invalid destination folder");
    g.debug("Destination set", { folder: s }), this._destinationFolder = s;
  }
  /**
   * Get the root folder
   */
  get root() {
    return this._destinationFolder.source;
  }
  /**
   * Get the upload queue
   */
  get queue() {
    return this._uploadQueue;
  }
  reset() {
    this._uploadQueue.splice(0, this._uploadQueue.length), this._jobQueue.clear(), this._queueSize = 0, this._queueProgress = 0, this._queueStatus = 0;
  }
  /**
   * Pause any ongoing upload(s)
   */
  pause() {
    this._jobQueue.pause(), this._queueStatus = 2;
  }
  /**
   * Resume any pending upload(s)
   */
  start() {
    this._jobQueue.start(), this._queueStatus = 1, this.updateStats();
  }
  /**
   * Get the upload queue stats
   */
  get info() {
    return {
      size: this._queueSize,
      progress: this._queueProgress,
      status: this._queueStatus
    };
  }
  updateStats() {
    const s = this._uploadQueue.map((n) => n.size).reduce((n, i) => n + i, 0), t = this._uploadQueue.map((n) => n.uploaded).reduce((n, i) => n + i, 0);
    this._queueSize = s, this._queueProgress = t, this._queueStatus !== 2 && (this._queueStatus = this._jobQueue.size > 0 ? 1 : 0);
  }
  addNotifier(s) {
    this._notifiers.push(s);
  }
  /**
   * Upload a file to the given path
   * @param {string} destinationPath the destination path relative to the root folder. e.g. /foo/bar.txt
   * @param {File} file the file to upload
   * @param {string} root the root folder to upload to
   */
  upload(s, t, n) {
    const i = `${n || this.root}/${s.replace(/^\//, "")}`, { origin: o } = new URL(i), l = o + (0,_nextcloud_paths__WEBPACK_IMPORTED_MODULE_1__.encodePath)(i.slice(o.length));
    g.debug(`Uploading ${t.name} to ${l}`);
    const f = x(t.size), r = f === 0 || t.size < f || this._isPublic, a = new ns(i, !r, t.size, t);
    return this._uploadQueue.push(a), this.updateStats(), new p_cancelable__WEBPACK_IMPORTED_MODULE_6__["default"](async (T, d, U) => {
      if (U(a.cancel), r) {
        g.debug("Initializing regular upload", { file: t, upload: a });
        const p = await B(t, 0, a.size), L = async () => {
          try {
            a.response = await A(
              l,
              p,
              a.signal,
              (m) => {
                a.uploaded = a.uploaded + m.bytes, this.updateStats();
              },
              void 0,
              {
                "X-OC-Mtime": t.lastModified / 1e3,
                "Content-Type": t.type
              }
            ), a.uploaded = a.size, this.updateStats(), g.debug(`Successfully uploaded ${t.name}`, { file: t, upload: a }), T(a);
          } catch (m) {
            if (m instanceof axios__WEBPACK_IMPORTED_MODULE_17__.CanceledError) {
              a.status = c.FAILED, d("Upload has been cancelled");
              return;
            }
            m?.response && (a.response = m.response), a.status = c.FAILED, g.error(`Failed uploading ${t.name}`, { error: m, file: t, upload: a }), d("Failed uploading the file");
          }
          this._notifiers.forEach((m) => {
            try {
              m(a);
            } catch {
            }
          });
        };
        this._jobQueue.add(L), this.updateStats();
      } else {
        g.debug("Initializing chunked upload", { file: t, upload: a });
        const p = await ts(l), L = [];
        for (let m = 0; m < a.chunks; m++) {
          const w = m * f, D = Math.min(w + f, a.size), W = () => B(t, w, f), O = () => A(
            `${p}/${m + 1}`,
            W,
            a.signal,
            () => this.updateStats(),
            l,
            {
              "X-OC-Mtime": t.lastModified / 1e3,
              "OC-Total-Length": t.size,
              "Content-Type": "application/octet-stream"
            }
          ).then(() => {
            a.uploaded = a.uploaded + f;
          }).catch((h) => {
            throw h?.response?.status === 507 ? (g.error("Upload failed, not enough space on the server or quota exceeded. Cancelling the remaining chunks", { error: h, upload: a }), a.cancel(), a.status = c.FAILED, h) : (h instanceof axios__WEBPACK_IMPORTED_MODULE_17__.CanceledError || (g.error(`Chunk ${m + 1} ${w} - ${D} uploading failed`, { error: h, upload: a }), a.cancel(), a.status = c.FAILED), h);
          });
          L.push(this._jobQueue.add(O));
        }
        try {
          await Promise.all(L), this.updateStats(), a.response = await _nextcloud_axios__WEBPACK_IMPORTED_MODULE_5__["default"].request({
            method: "MOVE",
            url: `${p}/.file`,
            headers: {
              "X-OC-Mtime": t.lastModified / 1e3,
              "OC-Total-Length": t.size,
              Destination: l
            }
          }), this.updateStats(), a.status = c.FINISHED, g.debug(`Successfully uploaded ${t.name}`, { file: t, upload: a }), T(a);
        } catch (m) {
          m instanceof axios__WEBPACK_IMPORTED_MODULE_17__.CanceledError ? (a.status = c.FAILED, d("Upload has been cancelled")) : (a.status = c.FAILED, d("Failed assembling the chunks together")), _nextcloud_axios__WEBPACK_IMPORTED_MODULE_5__["default"].request({
            method: "DELETE",
            url: `${p}`
          });
        }
        this._notifiers.forEach((m) => {
          try {
            m(a);
          } catch {
          }
        });
      }
      return this._jobQueue.onIdle().then(() => this.reset()), a;
    });
  }
}
function y(e, s, t, n, i, o, l, f) {
  var r = typeof e == "function" ? e.options : e;
  s && (r.render = s, r.staticRenderFns = t, r._compiled = !0), n && (r.functional = !0), o && (r._scopeId = "data-v-" + o);
  var a;
  if (l ? (a = function(d) {
    d = d || // cached call
    this.$vnode && this.$vnode.ssrContext || // stateful
    this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext, !d && typeof __VUE_SSR_CONTEXT__ < "u" && (d = __VUE_SSR_CONTEXT__), i && i.call(this, d), d && d._registeredComponents && d._registeredComponents.add(l);
  }, r._ssrRegister = a) : i && (a = f ? function() {
    i.call(
      this,
      (r.functional ? this.parent : this).$root.$options.shadowRoot
    );
  } : i), a)
    if (r.functional) {
      r._injectStyles = a;
      var S = r.render;
      r.render = function(U, p) {
        return a.call(p), S(U, p);
      };
    } else {
      var T = r.beforeCreate;
      r.beforeCreate = T ? [].concat(T, a) : [a];
    }
  return {
    exports: e,
    options: r
  };
}
const is = {
  name: "CancelIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
var ls = function() {
  var s = this, t = s._self._c;
  return t("span", s._b({ staticClass: "material-design-icon cancel-icon", attrs: { "aria-hidden": s.title ? null : !0, "aria-label": s.title, role: "img" }, on: { click: function(n) {
    return s.$emit("click", n);
  } } }, "span", s.$attrs, !1), [t("svg", { staticClass: "material-design-icon__svg", attrs: { fill: s.fillColor, width: s.size, height: s.size, viewBox: "0 0 24 24" } }, [t("path", { attrs: { d: "M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12 4C10.1 4 8.4 4.6 7.1 5.7L18.3 16.9C19.3 15.5 20 13.8 20 12C20 7.6 16.4 4 12 4M16.9 18.3L5.7 7.1C4.6 8.4 4 10.1 4 12C4 16.4 7.6 20 12 20C13.9 20 15.6 19.4 16.9 18.3Z" } }, [s.title ? t("title", [s._v(s._s(s.title))]) : s._e()])])]);
}, rs = [], os = /* @__PURE__ */ y(
  is,
  ls,
  rs,
  !1,
  null,
  null,
  null,
  null
);
const ms = os.exports, ds = {
  name: "PlusIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
var gs = function() {
  var s = this, t = s._self._c;
  return t("span", s._b({ staticClass: "material-design-icon plus-icon", attrs: { "aria-hidden": s.title ? null : !0, "aria-label": s.title, role: "img" }, on: { click: function(n) {
    return s.$emit("click", n);
  } } }, "span", s.$attrs, !1), [t("svg", { staticClass: "material-design-icon__svg", attrs: { fill: s.fillColor, width: s.size, height: s.size, viewBox: "0 0 24 24" } }, [t("path", { attrs: { d: "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" } }, [s.title ? t("title", [s._v(s._s(s.title))]) : s._e()])])]);
}, us = [], cs = /* @__PURE__ */ y(
  ds,
  gs,
  us,
  !1,
  null,
  null,
  null,
  null
);
const fs = cs.exports, ps = {
  name: "UploadIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
var hs = function() {
  var s = this, t = s._self._c;
  return t("span", s._b({ staticClass: "material-design-icon upload-icon", attrs: { "aria-hidden": s.title ? null : !0, "aria-label": s.title, role: "img" }, on: { click: function(n) {
    return s.$emit("click", n);
  } } }, "span", s.$attrs, !1), [t("svg", { staticClass: "material-design-icon__svg", attrs: { fill: s.fillColor, width: s.size, height: s.size, viewBox: "0 0 24 24" } }, [t("path", { attrs: { d: "M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" } }, [s.title ? t("title", [s._v(s._s(s.title))]) : s._e()])])]);
}, Ts = [], ws = /* @__PURE__ */ y(
  ps,
  hs,
  Ts,
  !1,
  null,
  null,
  null,
  null
);
const xs = ws.exports;
/**
 * @copyright Copyright (c) 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * @author Ferdinand Thiessen <opensource@fthiessen.de>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
const R = (0,_nextcloud_l10n_gettext__WEBPACK_IMPORTED_MODULE_15__.getGettextBuilder)().detectLocale();
[{ locale: "af", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Afrikaans (https://www.transifex.com/nextcloud/teams/64236/af/)", "Content-Type": "text/plain; charset=UTF-8", Language: "af", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Afrikaans (https://www.transifex.com/nextcloud/teams/64236/af/)
Content-Type: text/plain; charset=UTF-8
Language: af
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "ar", json: { charset: "utf-8", headers: { "Last-Translator": "Ali <alimahwer@yahoo.com>, 2024", "Language-Team": "Arabic (https://app.transifex.com/nextcloud/teams/64236/ar/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ar", "Plural-Forms": "nplurals=6; plural=n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 && n%100<=99 ? 4 : 5;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Joas Schilling, 2024
Ali <alimahwer@yahoo.com>, 2024
` }, msgstr: [`Last-Translator: Ali <alimahwer@yahoo.com>, 2024
Language-Team: Arabic (https://app.transifex.com/nextcloud/teams/64236/ar/)
Content-Type: text/plain; charset=UTF-8
Language: ar
Plural-Forms: nplurals=6; plural=n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 && n%100<=99 ? 4 : 5;
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} ملف متعارض", "{count} ملف متعارض", "{count} ملفان متعارضان", "{count} ملف متعارض", "{count} ملفات متعارضة", "{count} ملفات متعارضة"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} ملف متعارض في n {dirname}", "{count} ملف متعارض في n {dirname}", "{count} ملفان متعارضان في n {dirname}", "{count} ملف متعارض في n {dirname}", "{count} ملفات متعارضة في n {dirname}", "{count} ملفات متعارضة في n {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} ثانية متبقية"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["{time} متبقية"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["باقٍ بضعُ ثوانٍ"] }, Cancel: { msgid: "Cancel", msgstr: ["إلغاء"] }, "Cancel the entire operation": { msgid: "Cancel the entire operation", msgstr: ["إلغِ العملية بالكامل"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["إلغاء عمليات رفع الملفات"] }, Continue: { msgid: "Continue", msgstr: ["إستمر"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["تقدير الوقت المتبقي"] }, "Existing version": { msgid: "Existing version", msgstr: ["الإصدار الحالي"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["إذا اخترت الإبقاء على النسختين معاً، فإن الملف المنسوخ سيتم إلحاق رقم تسلسلي في نهاية اسمه."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["تاريخ آخر تعديل غير معلوم"] }, New: { msgid: "New", msgstr: ["جديد"] }, "New version": { msgid: "New version", msgstr: ["نسخة جديدة"] }, paused: { msgid: "paused", msgstr: ["مُجمَّد"] }, "Preview image": { msgid: "Preview image", msgstr: ["معاينة الصورة"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["حدِّد كل صناديق الخيارات"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["حدِّد كل الملفات الموجودة"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["حدِّد كل الملفات الجديدة"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["تخطَّ {count} ملف", "تخطَّ {count} ملف", "تخطَّ {count} ملف", "تخطَّ {count} ملف", "تخطَّ {count} ملف", "تخطَّ {count} ملف"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["حجم غير معلوم"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["تمَّ إلغاء الرفع"] }, "Upload files": { msgid: "Upload files", msgstr: ["رفع ملفات"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["تقدُّم الرفع "] }, "When an incoming folder is selected, any conflicting files within it will also be overwritten.": { msgid: "When an incoming folder is selected, any conflicting files within it will also be overwritten.", msgstr: ["عند تحديد مجلد وارد، أي ملفات متعارضة بداخله ستتم الكتابة فوقها."] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["أيُّ الملفات ترغب في الإبقاء عليها؟"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["يجب أن تختار نسخة واحدة على الأقل من كل ملف للاستمرار."] } } } } }, { locale: "ar_SA", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Arabic (Saudi Arabia) (https://www.transifex.com/nextcloud/teams/64236/ar_SA/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ar_SA", "Plural-Forms": "nplurals=6; plural=(n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 && n%100<=99 ? 4 : 5);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Arabic (Saudi Arabia) (https://www.transifex.com/nextcloud/teams/64236/ar_SA/)
Content-Type: text/plain; charset=UTF-8
Language: ar_SA
Plural-Forms: nplurals=6; plural=(n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 && n%100<=99 ? 4 : 5);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "ast", json: { charset: "utf-8", headers: { "Last-Translator": "enolp <enolp@softastur.org>, 2023", "Language-Team": "Asturian (https://app.transifex.com/nextcloud/teams/64236/ast/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ast", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
enolp <enolp@softastur.org>, 2023
` }, msgstr: [`Last-Translator: enolp <enolp@softastur.org>, 2023
Language-Team: Asturian (https://app.transifex.com/nextcloud/teams/64236/ast/)
Content-Type: text/plain; charset=UTF-8
Language: ast
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} ficheru en coflictu", "{count} ficheros en coflictu"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} ficheru en coflictu en {dirname}", "{count} ficheros en coflictu en {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["Queden {seconds} segundos"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["Tiempu que queda: {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["queden unos segundos"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Encaboxar les xubes"] }, Continue: { msgid: "Continue", msgstr: ["Siguir"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["estimando'l tiempu que falta"] }, "Existing version": { msgid: "Existing version", msgstr: ["Versión esistente"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Si seleiciones dambes versiones, el ficheru copiáu va tener un númberu amestáu al so nome."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["La data de la última modificación ye desconocida"] }, New: { msgid: "New", msgstr: ["Nuevu"] }, "New version": { msgid: "New version", msgstr: ["Versión nueva"] }, paused: { msgid: "paused", msgstr: ["en posa"] }, "Preview image": { msgid: "Preview image", msgstr: ["Previsualizar la imaxe"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Marcar toles caxelles"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Seleicionar tolos ficheros esistentes"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Seleicionar tolos ficheros nuevos"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Saltar esti ficheru", "Saltar {count} ficheros"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Tamañu desconocíu"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Encaboxóse la xuba"] }, "Upload files": { msgid: "Upload files", msgstr: ["Xubir ficheros"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["Xuba en cursu"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["¿Qué ficheros quies caltener?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Tienes de seleicionar polo menos una versión de cada ficheru pa siguir."] } } } } }, { locale: "az", json: { charset: "utf-8", headers: { "Last-Translator": "Rashad Aliyev <microphprashad@gmail.com>, 2023", "Language-Team": "Azerbaijani (https://app.transifex.com/nextcloud/teams/64236/az/)", "Content-Type": "text/plain; charset=UTF-8", Language: "az", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Rashad Aliyev <microphprashad@gmail.com>, 2023
` }, msgstr: [`Last-Translator: Rashad Aliyev <microphprashad@gmail.com>, 2023
Language-Team: Azerbaijani (https://app.transifex.com/nextcloud/teams/64236/az/)
Content-Type: text/plain; charset=UTF-8
Language: az
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} saniyə qalıb"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["{time} qalıb"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["bir neçə saniyə qalıb"] }, Add: { msgid: "Add", msgstr: ["Əlavə et"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Yükləməni imtina et"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["Təxmini qalan vaxt"] }, paused: { msgid: "paused", msgstr: ["pauzadadır"] }, "Upload files": { msgid: "Upload files", msgstr: ["Faylları yüklə"] } } } } }, { locale: "be", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Belarusian (https://www.transifex.com/nextcloud/teams/64236/be/)", "Content-Type": "text/plain; charset=UTF-8", Language: "be", "Plural-Forms": "nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Belarusian (https://www.transifex.com/nextcloud/teams/64236/be/)
Content-Type: text/plain; charset=UTF-8
Language: be
Plural-Forms: nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "bg_BG", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Bulgarian (Bulgaria) (https://www.transifex.com/nextcloud/teams/64236/bg_BG/)", "Content-Type": "text/plain; charset=UTF-8", Language: "bg_BG", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Bulgarian (Bulgaria) (https://www.transifex.com/nextcloud/teams/64236/bg_BG/)
Content-Type: text/plain; charset=UTF-8
Language: bg_BG
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "bn_BD", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Bengali (Bangladesh) (https://www.transifex.com/nextcloud/teams/64236/bn_BD/)", "Content-Type": "text/plain; charset=UTF-8", Language: "bn_BD", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Bengali (Bangladesh) (https://www.transifex.com/nextcloud/teams/64236/bn_BD/)
Content-Type: text/plain; charset=UTF-8
Language: bn_BD
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "br", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Breton (https://www.transifex.com/nextcloud/teams/64236/br/)", "Content-Type": "text/plain; charset=UTF-8", Language: "br", "Plural-Forms": "nplurals=5; plural=((n%10 == 1) && (n%100 != 11) && (n%100 !=71) && (n%100 !=91) ? 0 :(n%10 == 2) && (n%100 != 12) && (n%100 !=72) && (n%100 !=92) ? 1 :(n%10 ==3 || n%10==4 || n%10==9) && (n%100 < 10 || n% 100 > 19) && (n%100 < 70 || n%100 > 79) && (n%100 < 90 || n%100 > 99) ? 2 :(n != 0 && n % 1000000 == 0) ? 3 : 4);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Breton (https://www.transifex.com/nextcloud/teams/64236/br/)
Content-Type: text/plain; charset=UTF-8
Language: br
Plural-Forms: nplurals=5; plural=((n%10 == 1) && (n%100 != 11) && (n%100 !=71) && (n%100 !=91) ? 0 :(n%10 == 2) && (n%100 != 12) && (n%100 !=72) && (n%100 !=92) ? 1 :(n%10 ==3 || n%10==4 || n%10==9) && (n%100 < 10 || n% 100 > 19) && (n%100 < 70 || n%100 > 79) && (n%100 < 90 || n%100 > 99) ? 2 :(n != 0 && n % 1000000 == 0) ? 3 : 4);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "bs", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Bosnian (https://www.transifex.com/nextcloud/teams/64236/bs/)", "Content-Type": "text/plain; charset=UTF-8", Language: "bs", "Plural-Forms": "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Bosnian (https://www.transifex.com/nextcloud/teams/64236/bs/)
Content-Type: text/plain; charset=UTF-8
Language: bs
Plural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "ca", json: { charset: "utf-8", headers: { "Last-Translator": "Toni Hermoso Pulido <toniher@softcatala.cat>, 2022", "Language-Team": "Catalan (https://www.transifex.com/nextcloud/teams/64236/ca/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ca", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Marc Riera <marcriera@softcatala.org>, 2022
Toni Hermoso Pulido <toniher@softcatala.cat>, 2022
` }, msgstr: [`Last-Translator: Toni Hermoso Pulido <toniher@softcatala.cat>, 2022
Language-Team: Catalan (https://www.transifex.com/nextcloud/teams/64236/ca/)
Content-Type: text/plain; charset=UTF-8
Language: ca
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["Queden {seconds} segons"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["Queden {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["Queden uns segons"] }, Add: { msgid: "Add", msgstr: ["Afegeix"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Cancel·la les pujades"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["S'està estimant el temps restant"] }, paused: { msgid: "paused", msgstr: ["En pausa"] }, "Upload files": { msgid: "Upload files", msgstr: ["Puja els fitxers"] } } } } }, { locale: "cs", json: { charset: "utf-8", headers: { "Last-Translator": "Pavel Borecki <pavel.borecki@gmail.com>, 2022", "Language-Team": "Czech (https://www.transifex.com/nextcloud/teams/64236/cs/)", "Content-Type": "text/plain; charset=UTF-8", Language: "cs", "Plural-Forms": "nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n >= 2 && n <= 4 && n % 1 == 0) ? 1: (n % 1 != 0 ) ? 2 : 3;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Pavel Borecki <pavel.borecki@gmail.com>, 2022
` }, msgstr: [`Last-Translator: Pavel Borecki <pavel.borecki@gmail.com>, 2022
Language-Team: Czech (https://www.transifex.com/nextcloud/teams/64236/cs/)
Content-Type: text/plain; charset=UTF-8
Language: cs
Plural-Forms: nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n >= 2 && n <= 4 && n % 1 == 0) ? 1: (n % 1 != 0 ) ? 2 : 3;
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["zbývá {seconds}"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["zbývá {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["zbývá několik sekund"] }, Add: { msgid: "Add", msgstr: ["Přidat"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Zrušit nahrávání"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["odhadovaný zbývající čas"] }, paused: { msgid: "paused", msgstr: ["pozastaveno"] } } } } }, { locale: "cs_CZ", json: { charset: "utf-8", headers: { "Last-Translator": "Michal Šmahel <ceskyDJ@seznam.cz>, 2024", "Language-Team": "Czech (Czech Republic) (https://app.transifex.com/nextcloud/teams/64236/cs_CZ/)", "Content-Type": "text/plain; charset=UTF-8", Language: "cs_CZ", "Plural-Forms": "nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n >= 2 && n <= 4 && n % 1 == 0) ? 1: (n % 1 != 0 ) ? 2 : 3;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Joas Schilling, 2024
Michal Šmahel <ceskyDJ@seznam.cz>, 2024
` }, msgstr: [`Last-Translator: Michal Šmahel <ceskyDJ@seznam.cz>, 2024
Language-Team: Czech (Czech Republic) (https://app.transifex.com/nextcloud/teams/64236/cs_CZ/)
Content-Type: text/plain; charset=UTF-8
Language: cs_CZ
Plural-Forms: nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n >= 2 && n <= 4 && n % 1 == 0) ? 1: (n % 1 != 0 ) ? 2 : 3;
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} kolize souborů", "{count} kolize souborů", "{count} kolizí souborů", "{count} kolize souborů"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} kolize souboru v {dirname}", "{count} kolize souboru v {dirname}", "{count} kolizí souborů v {dirname}", "{count} kolize souboru v {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["zbývá {seconds}"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["zbývá {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["zbývá několik sekund"] }, Cancel: { msgid: "Cancel", msgstr: ["Zrušit"] }, "Cancel the entire operation": { msgid: "Cancel the entire operation", msgstr: ["Zrušit celou operaci"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Zrušit nahrávání"] }, Continue: { msgid: "Continue", msgstr: ["Pokračovat"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["odhaduje se zbývající čas"] }, "Existing version": { msgid: "Existing version", msgstr: ["Existující verze"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Pokud vyberete obě verze, zkopírovaný soubor bude mít k názvu přidáno číslo."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Neznámé datum poslední úpravy"] }, New: { msgid: "New", msgstr: ["Nové"] }, "New version": { msgid: "New version", msgstr: ["Nová verze"] }, paused: { msgid: "paused", msgstr: ["pozastaveno"] }, "Preview image": { msgid: "Preview image", msgstr: ["Náhled obrázku"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Označit všechny zaškrtávací kolonky"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Vybrat veškeré stávající soubory"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Vybrat veškeré nové soubory"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Přeskočit tento soubor", "Přeskočit {count} soubory", "Přeskočit {count} souborů", "Přeskočit {count} soubory"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Neznámá velikost"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Nahrávání zrušeno"] }, "Upload files": { msgid: "Upload files", msgstr: ["Nahrát soubory"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["Postup v nahrávání"] }, "When an incoming folder is selected, any conflicting files within it will also be overwritten.": { msgid: "When an incoming folder is selected, any conflicting files within it will also be overwritten.", msgstr: ["Po výběru příchozí složky budou rovněž přepsány všechny v ní obsažené konfliktní soubory"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Které soubory si přejete ponechat?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Aby bylo možné pokračovat, je třeba vybrat alespoň jednu verzi od každého souboru."] } } } } }, { locale: "cy_GB", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Welsh (United Kingdom) (https://www.transifex.com/nextcloud/teams/64236/cy_GB/)", "Content-Type": "text/plain; charset=UTF-8", Language: "cy_GB", "Plural-Forms": "nplurals=4; plural=(n==1) ? 0 : (n==2) ? 1 : (n != 8 && n != 11) ? 2 : 3;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Welsh (United Kingdom) (https://www.transifex.com/nextcloud/teams/64236/cy_GB/)
Content-Type: text/plain; charset=UTF-8
Language: cy_GB
Plural-Forms: nplurals=4; plural=(n==1) ? 0 : (n==2) ? 1 : (n != 8 && n != 11) ? 2 : 3;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "da", json: { charset: "utf-8", headers: { "Last-Translator": "Martin Bonde <Martin@maboni.dk>, 2024", "Language-Team": "Danish (https://app.transifex.com/nextcloud/teams/64236/da/)", "Content-Type": "text/plain; charset=UTF-8", Language: "da", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Joas Schilling, 2024
Martin Bonde <Martin@maboni.dk>, 2024
` }, msgstr: [`Last-Translator: Martin Bonde <Martin@maboni.dk>, 2024
Language-Team: Danish (https://app.transifex.com/nextcloud/teams/64236/da/)
Content-Type: text/plain; charset=UTF-8
Language: da
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} fil konflikt", "{count} filer i konflikt"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} fil konflikt i {dirname}", "{count} filer i konflikt i {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{sekunder} sekunder tilbage"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["{tid} tilbage"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["et par sekunder tilbage"] }, Cancel: { msgid: "Cancel", msgstr: ["Annuller"] }, "Cancel the entire operation": { msgid: "Cancel the entire operation", msgstr: ["Annuller hele handlingen"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Annuller uploads"] }, Continue: { msgid: "Continue", msgstr: ["Fortsæt"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["estimering af resterende tid"] }, "Existing version": { msgid: "Existing version", msgstr: ["Eksisterende version"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Hvis du vælger begge versioner vil den kopierede fil få et nummer tilføjet til sit navn."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Sidste modifikationsdato ukendt"] }, New: { msgid: "New", msgstr: ["Ny"] }, "New version": { msgid: "New version", msgstr: ["Ny version"] }, paused: { msgid: "paused", msgstr: ["pauset"] }, "Preview image": { msgid: "Preview image", msgstr: ["Forhåndsvisning af billede"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Vælg alle felter"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Vælg alle eksisterende filer"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Vælg alle nye filer"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Spring denne fil over", "Spring {count} filer over"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Ukendt størrelse"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Upload annulleret"] }, "Upload files": { msgid: "Upload files", msgstr: ["Upload filer"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["Upload fremskridt"] }, "When an incoming folder is selected, any conflicting files within it will also be overwritten.": { msgid: "When an incoming folder is selected, any conflicting files within it will also be overwritten.", msgstr: ["Når en indgående mappe er valgt, vil alle modstridende filer i den også blive overskrevet."] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Hvilke filer ønsker du at beholde?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Du skal vælge mindst én version af hver fil for at fortsætte."] } } } } }, { locale: "de", json: { charset: "utf-8", headers: { "Last-Translator": "Mario Siegmann <mario_siegmann@web.de>, 2024", "Language-Team": "German (https://app.transifex.com/nextcloud/teams/64236/de/)", "Content-Type": "text/plain; charset=UTF-8", Language: "de", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Joas Schilling, 2024
Mario Siegmann <mario_siegmann@web.de>, 2024
` }, msgstr: [`Last-Translator: Mario Siegmann <mario_siegmann@web.de>, 2024
Language-Team: German (https://app.transifex.com/nextcloud/teams/64236/de/)
Content-Type: text/plain; charset=UTF-8
Language: de
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} Datei-Konflikt", "{count} Datei-Konflikte"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} Datei-Konflikt in {dirname}", "{count} Datei-Konflikte in {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} Sekunden verbleibend"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["{time} verbleibend"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["noch ein paar Sekunden"] }, Cancel: { msgid: "Cancel", msgstr: ["Abbrechen"] }, "Cancel the entire operation": { msgid: "Cancel the entire operation", msgstr: ["Den gesamten Vorgang abbrechen"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Hochladen abbrechen"] }, Continue: { msgid: "Continue", msgstr: ["Fortsetzen"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["Geschätzte verbleibende Zeit"] }, "Existing version": { msgid: "Existing version", msgstr: ["Vorhandene Version"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Wenn du beide Versionen auswählst, wird der kopierten Datei eine Nummer zum Namen hinzugefügt."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Datum der letzten Änderung unbekannt"] }, New: { msgid: "New", msgstr: ["Neu"] }, "New version": { msgid: "New version", msgstr: ["Neue Version"] }, paused: { msgid: "paused", msgstr: ["Pausiert"] }, "Preview image": { msgid: "Preview image", msgstr: ["Vorschaubild"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Alle Kontrollkästchen aktivieren"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Alle vorhandenen Dateien auswählen"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Alle neuen Dateien auswählen"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Diese Datei überspringen", "{count} Dateien überspringen"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Unbekannte Größe"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Hochladen abgebrochen"] }, "Upload files": { msgid: "Upload files", msgstr: ["Dateien hochladen"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["Fortschritt beim Hochladen"] }, "When an incoming folder is selected, any conflicting files within it will also be overwritten.": { msgid: "When an incoming folder is selected, any conflicting files within it will also be overwritten.", msgstr: ["Wenn ein eingehender Ordner ausgewählt wird, werden alle darin enthaltenen Konfliktdateien ebenfalls überschrieben."] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Welche Dateien möchtest du behalten?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Du musst mindestens eine Version jeder Datei auswählen, um fortzufahren."] } } } } }, { locale: "de_DE", json: { charset: "utf-8", headers: { "Last-Translator": "Mario Siegmann <mario_siegmann@web.de>, 2024", "Language-Team": "German (Germany) (https://app.transifex.com/nextcloud/teams/64236/de_DE/)", "Content-Type": "text/plain; charset=UTF-8", Language: "de_DE", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Joas Schilling, 2024
Mario Siegmann <mario_siegmann@web.de>, 2024
` }, msgstr: [`Last-Translator: Mario Siegmann <mario_siegmann@web.de>, 2024
Language-Team: German (Germany) (https://app.transifex.com/nextcloud/teams/64236/de_DE/)
Content-Type: text/plain; charset=UTF-8
Language: de_DE
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} Datei-Konflikt", "{count} Datei-Konflikte"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} Datei-Konflikt in {dirname}", "{count} Datei-Konflikte in {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} Sekunden verbleiben"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["{time} verbleibend"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["ein paar Sekunden verbleiben"] }, Cancel: { msgid: "Cancel", msgstr: ["Abbrechen"] }, "Cancel the entire operation": { msgid: "Cancel the entire operation", msgstr: ["Den gesamten Vorgang abbrechen"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Hochladen abbrechen"] }, Continue: { msgid: "Continue", msgstr: ["Fortsetzen"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["Geschätzte verbleibende Zeit"] }, "Existing version": { msgid: "Existing version", msgstr: ["Vorhandene Version"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Wenn Sie beide Versionen auswählen, wird der kopierten Datei eine Nummer zum Namen hinzugefügt."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Datum der letzten Änderung unbekannt"] }, New: { msgid: "New", msgstr: ["Neu"] }, "New version": { msgid: "New version", msgstr: ["Neue Version"] }, paused: { msgid: "paused", msgstr: ["Pausiert"] }, "Preview image": { msgid: "Preview image", msgstr: ["Vorschaubild"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Alle Kontrollkästchen aktivieren"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Alle vorhandenen Dateien auswählen"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Alle neuen Dateien auswählen"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["{count} Datei überspringen", "{count} Dateien überspringen"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Unbekannte Größe"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Hochladen abgebrochen"] }, "Upload files": { msgid: "Upload files", msgstr: ["Dateien hochladen"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["Fortschritt beim Hochladen"] }, "When an incoming folder is selected, any conflicting files within it will also be overwritten.": { msgid: "When an incoming folder is selected, any conflicting files within it will also be overwritten.", msgstr: ["Wenn ein eingehender Ordner ausgewählt wird, werden alle darin enthaltenen Konfliktdateien ebenfalls überschrieben."] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Welche Dateien möchten Sie behalten?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Sie müssen mindestens eine Version jeder Datei auswählen, um fortzufahren."] } } } } }, { locale: "el", json: { charset: "utf-8", headers: { "Last-Translator": "Nik Pap, 2022", "Language-Team": "Greek (https://www.transifex.com/nextcloud/teams/64236/el/)", "Content-Type": "text/plain; charset=UTF-8", Language: "el", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Nik Pap, 2022
` }, msgstr: [`Last-Translator: Nik Pap, 2022
Language-Team: Greek (https://www.transifex.com/nextcloud/teams/64236/el/)
Content-Type: text/plain; charset=UTF-8
Language: el
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["απομένουν {seconds} δευτερόλεπτα"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["απομένουν {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["απομένουν λίγα δευτερόλεπτα"] }, Add: { msgid: "Add", msgstr: ["Προσθήκη"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Ακύρωση μεταφορτώσεων"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["εκτίμηση του χρόνου που απομένει"] }, paused: { msgid: "paused", msgstr: ["σε παύση"] }, "Upload files": { msgid: "Upload files", msgstr: ["Μεταφόρτωση αρχείων"] } } } } }, { locale: "el_GR", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Greek (Greece) (https://www.transifex.com/nextcloud/teams/64236/el_GR/)", "Content-Type": "text/plain; charset=UTF-8", Language: "el_GR", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Greek (Greece) (https://www.transifex.com/nextcloud/teams/64236/el_GR/)
Content-Type: text/plain; charset=UTF-8
Language: el_GR
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "en_GB", json: { charset: "utf-8", headers: { "Last-Translator": "Andi Chandler <andi@gowling.com>, 2023", "Language-Team": "English (United Kingdom) (https://app.transifex.com/nextcloud/teams/64236/en_GB/)", "Content-Type": "text/plain; charset=UTF-8", Language: "en_GB", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
John Molakvoæ <skjnldsv@protonmail.com>, 2023
Andi Chandler <andi@gowling.com>, 2023
` }, msgstr: [`Last-Translator: Andi Chandler <andi@gowling.com>, 2023
Language-Team: English (United Kingdom) (https://app.transifex.com/nextcloud/teams/64236/en_GB/)
Content-Type: text/plain; charset=UTF-8
Language: en_GB
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} file conflict", "{count} files conflict"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} file conflict in {dirname}", "{count} file conflicts in {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} seconds left"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["{time} left"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["a few seconds left"] }, Add: { msgid: "Add", msgstr: ["Add"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Cancel uploads"] }, Continue: { msgid: "Continue", msgstr: ["Continue"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["estimating time left"] }, "Existing version": { msgid: "Existing version", msgstr: ["Existing version"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["If you select both versions, the copied file will have a number added to its name."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Last modified date unknown"] }, "New version": { msgid: "New version", msgstr: ["New version"] }, paused: { msgid: "paused", msgstr: ["paused"] }, "Preview image": { msgid: "Preview image", msgstr: ["Preview image"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Select all checkboxes"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Select all existing files"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Select all new files"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Skip this file", "Skip {count} files"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Unknown size"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Upload cancelled"] }, "Upload files": { msgid: "Upload files", msgstr: ["Upload files"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Which files do you want to keep?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["You need to select at least one version of each file to continue."] } } } } }, { locale: "eo", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Esperanto (https://www.transifex.com/nextcloud/teams/64236/eo/)", "Content-Type": "text/plain; charset=UTF-8", Language: "eo", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Esperanto (https://www.transifex.com/nextcloud/teams/64236/eo/)
Content-Type: text/plain; charset=UTF-8
Language: eo
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "es", json: { charset: "utf-8", headers: { "Last-Translator": "Julio C. Ortega, 2024", "Language-Team": "Spanish (https://app.transifex.com/nextcloud/teams/64236/es/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
John Molakvoæ <skjnldsv@protonmail.com>, 2023
FranciscoFJ <dev-ooo@satel-sa.com>, 2023
Next Cloud <nextcloud.translator.es@cgj.es>, 2023
Julio C. Ortega, 2024
` }, msgstr: [`Last-Translator: Julio C. Ortega, 2024
Language-Team: Spanish (https://app.transifex.com/nextcloud/teams/64236/es/)
Content-Type: text/plain; charset=UTF-8
Language: es
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} archivo en conflicto", "{count} archivos en conflicto", "{count} archivos en conflicto"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} archivo en conflicto en {dirname}", "{count} archivos en conflicto en {dirname}", "{count} archivos en conflicto en {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} segundos restantes"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["{time} restante"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["quedan unos segundos"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Cancelar subidas"] }, Continue: { msgid: "Continue", msgstr: ["Continuar"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["estimando tiempo restante"] }, "Existing version": { msgid: "Existing version", msgstr: ["Versión existente"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Si selecciona ambas versiones, al archivo copiado se le añadirá un número en el nombre."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Última fecha de modificación desconocida"] }, New: { msgid: "New", msgstr: ["Nuevo"] }, "New version": { msgid: "New version", msgstr: ["Nueva versión"] }, paused: { msgid: "paused", msgstr: ["pausado"] }, "Preview image": { msgid: "Preview image", msgstr: ["Previsualizar imagen"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Seleccionar todas las casillas de verificación"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Seleccionar todos los archivos existentes"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Seleccionar todos los archivos nuevos"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Saltar este archivo", "Saltar {count} archivos", "Saltar {count} archivos"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Tamaño desconocido"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Subida cancelada"] }, "Upload files": { msgid: "Upload files", msgstr: ["Subir archivos"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["Progreso de la subida"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["¿Qué archivos desea conservar?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Debe seleccionar al menos una versión de cada archivo para continuar."] } } } } }, { locale: "es_419", json: { charset: "utf-8", headers: { "Last-Translator": "ALEJANDRO CASTRO, 2022", "Language-Team": "Spanish (Latin America) (https://www.transifex.com/nextcloud/teams/64236/es_419/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_419", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
ALEJANDRO CASTRO, 2022
` }, msgstr: [`Last-Translator: ALEJANDRO CASTRO, 2022
Language-Team: Spanish (Latin America) (https://www.transifex.com/nextcloud/teams/64236/es_419/)
Content-Type: text/plain; charset=UTF-8
Language: es_419
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} segundos restantes"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["{tiempo} restante"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["quedan pocos segundos"] }, Add: { msgid: "Add", msgstr: ["agregar"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Cancelar subidas"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["estimando tiempo restante"] }, paused: { msgid: "paused", msgstr: ["pausado"] }, "Upload files": { msgid: "Upload files", msgstr: ["Subir archivos"] } } } } }, { locale: "es_AR", json: { charset: "utf-8", headers: { "Last-Translator": "Matias Iglesias, 2022", "Language-Team": "Spanish (Argentina) (https://www.transifex.com/nextcloud/teams/64236/es_AR/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_AR", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Matias Iglesias, 2022
` }, msgstr: [`Last-Translator: Matias Iglesias, 2022
Language-Team: Spanish (Argentina) (https://www.transifex.com/nextcloud/teams/64236/es_AR/)
Content-Type: text/plain; charset=UTF-8
Language: es_AR
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} segundos restantes"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["{time} restante"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["quedan unos segundos"] }, Add: { msgid: "Add", msgstr: ["Añadir"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Cancelar subidas"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["estimando tiempo restante"] }, paused: { msgid: "paused", msgstr: ["pausado"] }, "Upload files": { msgid: "Upload files", msgstr: ["Subir archivos"] } } } } }, { locale: "es_CL", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Spanish (Chile) (https://www.transifex.com/nextcloud/teams/64236/es_CL/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_CL", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Spanish (Chile) (https://www.transifex.com/nextcloud/teams/64236/es_CL/)
Content-Type: text/plain; charset=UTF-8
Language: es_CL
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "es_CO", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Spanish (Colombia) (https://www.transifex.com/nextcloud/teams/64236/es_CO/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_CO", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Spanish (Colombia) (https://www.transifex.com/nextcloud/teams/64236/es_CO/)
Content-Type: text/plain; charset=UTF-8
Language: es_CO
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "es_CR", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Spanish (Costa Rica) (https://www.transifex.com/nextcloud/teams/64236/es_CR/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_CR", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Spanish (Costa Rica) (https://www.transifex.com/nextcloud/teams/64236/es_CR/)
Content-Type: text/plain; charset=UTF-8
Language: es_CR
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "es_DO", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Spanish (Dominican Republic) (https://www.transifex.com/nextcloud/teams/64236/es_DO/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_DO", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Spanish (Dominican Republic) (https://www.transifex.com/nextcloud/teams/64236/es_DO/)
Content-Type: text/plain; charset=UTF-8
Language: es_DO
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "es_EC", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Spanish (Ecuador) (https://www.transifex.com/nextcloud/teams/64236/es_EC/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_EC", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Spanish (Ecuador) (https://www.transifex.com/nextcloud/teams/64236/es_EC/)
Content-Type: text/plain; charset=UTF-8
Language: es_EC
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "es_GT", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Spanish (Guatemala) (https://www.transifex.com/nextcloud/teams/64236/es_GT/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_GT", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Spanish (Guatemala) (https://www.transifex.com/nextcloud/teams/64236/es_GT/)
Content-Type: text/plain; charset=UTF-8
Language: es_GT
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "es_HN", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Spanish (Honduras) (https://www.transifex.com/nextcloud/teams/64236/es_HN/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_HN", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Spanish (Honduras) (https://www.transifex.com/nextcloud/teams/64236/es_HN/)
Content-Type: text/plain; charset=UTF-8
Language: es_HN
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "es_MX", json: { charset: "utf-8", headers: { "Last-Translator": "ALEJANDRO CASTRO, 2022", "Language-Team": "Spanish (Mexico) (https://www.transifex.com/nextcloud/teams/64236/es_MX/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_MX", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Luis Francisco Castro, 2022
ALEJANDRO CASTRO, 2022
` }, msgstr: [`Last-Translator: ALEJANDRO CASTRO, 2022
Language-Team: Spanish (Mexico) (https://www.transifex.com/nextcloud/teams/64236/es_MX/)
Content-Type: text/plain; charset=UTF-8
Language: es_MX
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} segundos restantes"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["{tiempo} restante"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["quedan pocos segundos"] }, Add: { msgid: "Add", msgstr: ["agregar"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["cancelar las cargas"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["estimando tiempo restante"] }, paused: { msgid: "paused", msgstr: ["en pausa"] }, "Upload files": { msgid: "Upload files", msgstr: ["cargar archivos"] } } } } }, { locale: "es_NI", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Spanish (Nicaragua) (https://www.transifex.com/nextcloud/teams/64236/es_NI/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_NI", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Spanish (Nicaragua) (https://www.transifex.com/nextcloud/teams/64236/es_NI/)
Content-Type: text/plain; charset=UTF-8
Language: es_NI
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "es_PA", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Spanish (Panama) (https://www.transifex.com/nextcloud/teams/64236/es_PA/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_PA", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Spanish (Panama) (https://www.transifex.com/nextcloud/teams/64236/es_PA/)
Content-Type: text/plain; charset=UTF-8
Language: es_PA
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "es_PE", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Spanish (Peru) (https://www.transifex.com/nextcloud/teams/64236/es_PE/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_PE", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Spanish (Peru) (https://www.transifex.com/nextcloud/teams/64236/es_PE/)
Content-Type: text/plain; charset=UTF-8
Language: es_PE
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "es_PR", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Spanish (Puerto Rico) (https://www.transifex.com/nextcloud/teams/64236/es_PR/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_PR", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Spanish (Puerto Rico) (https://www.transifex.com/nextcloud/teams/64236/es_PR/)
Content-Type: text/plain; charset=UTF-8
Language: es_PR
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "es_PY", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Spanish (Paraguay) (https://www.transifex.com/nextcloud/teams/64236/es_PY/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_PY", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Spanish (Paraguay) (https://www.transifex.com/nextcloud/teams/64236/es_PY/)
Content-Type: text/plain; charset=UTF-8
Language: es_PY
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "es_SV", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Spanish (El Salvador) (https://www.transifex.com/nextcloud/teams/64236/es_SV/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_SV", "Plural-Forms": "nplurals=2; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Spanish (El Salvador) (https://www.transifex.com/nextcloud/teams/64236/es_SV/)
Content-Type: text/plain; charset=UTF-8
Language: es_SV
Plural-Forms: nplurals=2; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "es_UY", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Spanish (Uruguay) (https://www.transifex.com/nextcloud/teams/64236/es_UY/)", "Content-Type": "text/plain; charset=UTF-8", Language: "es_UY", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Spanish (Uruguay) (https://www.transifex.com/nextcloud/teams/64236/es_UY/)
Content-Type: text/plain; charset=UTF-8
Language: es_UY
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "et_EE", json: { charset: "utf-8", headers: { "Last-Translator": "Taavo Roos, 2023", "Language-Team": "Estonian (Estonia) (https://app.transifex.com/nextcloud/teams/64236/et_EE/)", "Content-Type": "text/plain; charset=UTF-8", Language: "et_EE", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Mait R, 2022
Taavo Roos, 2023
` }, msgstr: [`Last-Translator: Taavo Roos, 2023
Language-Team: Estonian (Estonia) (https://app.transifex.com/nextcloud/teams/64236/et_EE/)
Content-Type: text/plain; charset=UTF-8
Language: et_EE
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} jäänud sekundid"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["{time} aega jäänud"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["jäänud mõni sekund"] }, Add: { msgid: "Add", msgstr: ["Lisa"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Tühista üleslaadimine"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["hinnanguline järelejäänud aeg"] }, paused: { msgid: "paused", msgstr: ["pausil"] }, "Upload files": { msgid: "Upload files", msgstr: ["Lae failid üles"] } } } } }, { locale: "eu", json: { charset: "utf-8", headers: { "Last-Translator": "Unai Tolosa Pontesta <utolosa002@gmail.com>, 2022", "Language-Team": "Basque (https://www.transifex.com/nextcloud/teams/64236/eu/)", "Content-Type": "text/plain; charset=UTF-8", Language: "eu", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Unai Tolosa Pontesta <utolosa002@gmail.com>, 2022
` }, msgstr: [`Last-Translator: Unai Tolosa Pontesta <utolosa002@gmail.com>, 2022
Language-Team: Basque (https://www.transifex.com/nextcloud/teams/64236/eu/)
Content-Type: text/plain; charset=UTF-8
Language: eu
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} segundo geratzen dira"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["{time} geratzen da"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["segundo batzuk geratzen dira"] }, Add: { msgid: "Add", msgstr: ["Gehitu"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Ezeztatu igoerak"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["kalkulatutako geratzen den denbora"] }, paused: { msgid: "paused", msgstr: ["geldituta"] }, "Upload files": { msgid: "Upload files", msgstr: ["Igo fitxategiak"] } } } } }, { locale: "fa", json: { charset: "utf-8", headers: { "Last-Translator": "Fatemeh Komeily, 2023", "Language-Team": "Persian (https://app.transifex.com/nextcloud/teams/64236/fa/)", "Content-Type": "text/plain; charset=UTF-8", Language: "fa", "Plural-Forms": "nplurals=2; plural=(n > 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Fatemeh Komeily, 2023
` }, msgstr: [`Last-Translator: Fatemeh Komeily, 2023
Language-Team: Persian (https://app.transifex.com/nextcloud/teams/64236/fa/)
Content-Type: text/plain; charset=UTF-8
Language: fa
Plural-Forms: nplurals=2; plural=(n > 1);
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["ثانیه های باقی مانده"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["باقی مانده"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["چند ثانیه مانده"] }, Add: { msgid: "Add", msgstr: ["اضافه کردن"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["کنسل کردن فایل های اپلود شده"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["تخمین زمان باقی مانده"] }, paused: { msgid: "paused", msgstr: ["مکث کردن"] }, "Upload files": { msgid: "Upload files", msgstr: ["بارگذاری فایل ها"] } } } } }, { locale: "fi_FI", json: { charset: "utf-8", headers: { "Last-Translator": "Jiri Grönroos <jiri.gronroos@iki.fi>, 2022", "Language-Team": "Finnish (Finland) (https://www.transifex.com/nextcloud/teams/64236/fi_FI/)", "Content-Type": "text/plain; charset=UTF-8", Language: "fi_FI", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Jiri Grönroos <jiri.gronroos@iki.fi>, 2022
` }, msgstr: [`Last-Translator: Jiri Grönroos <jiri.gronroos@iki.fi>, 2022
Language-Team: Finnish (Finland) (https://www.transifex.com/nextcloud/teams/64236/fi_FI/)
Content-Type: text/plain; charset=UTF-8
Language: fi_FI
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} sekuntia jäljellä"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["{time} jäljellä"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["muutama sekunti jäljellä"] }, Add: { msgid: "Add", msgstr: ["Lisää"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Peruuta lähetykset"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["arvioidaan jäljellä olevaa aikaa"] }, paused: { msgid: "paused", msgstr: ["keskeytetty"] }, "Upload files": { msgid: "Upload files", msgstr: ["Lähetä tiedostoja"] } } } } }, { locale: "fo", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Faroese (https://www.transifex.com/nextcloud/teams/64236/fo/)", "Content-Type": "text/plain; charset=UTF-8", Language: "fo", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Faroese (https://www.transifex.com/nextcloud/teams/64236/fo/)
Content-Type: text/plain; charset=UTF-8
Language: fo
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "fr", json: { charset: "utf-8", headers: { "Last-Translator": "jed boulahya, 2024", "Language-Team": "French (https://app.transifex.com/nextcloud/teams/64236/fr/)", "Content-Type": "text/plain; charset=UTF-8", Language: "fr", "Plural-Forms": "nplurals=3; plural=(n == 0 || n == 1) ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Joas Schilling, 2024
Benoit Pruneau, 2024
jed boulahya, 2024
` }, msgstr: [`Last-Translator: jed boulahya, 2024
Language-Team: French (https://app.transifex.com/nextcloud/teams/64236/fr/)
Content-Type: text/plain; charset=UTF-8
Language: fr
Plural-Forms: nplurals=3; plural=(n == 0 || n == 1) ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} fichier en conflit", "{count} fichiers en conflit", "{count} fichiers en conflit"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} fichier en conflit dans {dirname}", "{count} fichiers en conflit dans {dirname}", "{count} fichiers en conflit dans {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} secondes restantes"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["{time} restant"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["quelques secondes restantes"] }, Cancel: { msgid: "Cancel", msgstr: ["Annuler"] }, "Cancel the entire operation": { msgid: "Cancel the entire operation", msgstr: ["Annuler l'opération entière"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Annuler les envois"] }, Continue: { msgid: "Continue", msgstr: ["Continuer"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["estimation du temps restant"] }, "Existing version": { msgid: "Existing version", msgstr: ["Version existante"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Si vous sélectionnez les deux versions, le fichier copié aura un numéro ajouté àname."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Date de la dernière modification est inconnue"] }, New: { msgid: "New", msgstr: ["Nouveau"] }, "New version": { msgid: "New version", msgstr: ["Nouvelle version"] }, paused: { msgid: "paused", msgstr: ["en pause"] }, "Preview image": { msgid: "Preview image", msgstr: ["Aperçu de l'image"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Sélectionner toutes les cases à cocher"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Sélectionner tous les fichiers existants"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Sélectionner tous les nouveaux fichiers"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Ignorer ce fichier", "Ignorer {count} fichiers", "Ignorer {count} fichiers"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Taille inconnue"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: [" annulé"] }, "Upload files": { msgid: "Upload files", msgstr: ["Téléchargement des fichiers"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["Progression du téléchargement"] }, "When an incoming folder is selected, any conflicting files within it will also be overwritten.": { msgid: "When an incoming folder is selected, any conflicting files within it will also be overwritten.", msgstr: ["Lorsqu'un dossier entrant est sélectionné, tous les fichiers en conflit qu'il contient seront également écrasés."] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Quels fichiers souhaitez-vous conserver ?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Vous devez sélectionner au moins une version de chaque fichier pour continuer."] } } } } }, { locale: "gd", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Gaelic, Scottish (https://www.transifex.com/nextcloud/teams/64236/gd/)", "Content-Type": "text/plain; charset=UTF-8", Language: "gd", "Plural-Forms": "nplurals=4; plural=(n==1 || n==11) ? 0 : (n==2 || n==12) ? 1 : (n > 2 && n < 20) ? 2 : 3;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Gaelic, Scottish (https://www.transifex.com/nextcloud/teams/64236/gd/)
Content-Type: text/plain; charset=UTF-8
Language: gd
Plural-Forms: nplurals=4; plural=(n==1 || n==11) ? 0 : (n==2 || n==12) ? 1 : (n > 2 && n < 20) ? 2 : 3;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "gl", json: { charset: "utf-8", headers: { "Last-Translator": "Miguel Anxo Bouzada <mbouzada@gmail.com>, 2023", "Language-Team": "Galician (https://app.transifex.com/nextcloud/teams/64236/gl/)", "Content-Type": "text/plain; charset=UTF-8", Language: "gl", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
John Molakvoæ <skjnldsv@protonmail.com>, 2023
Nacho <nacho.vfranco@gmail.com>, 2023
Miguel Anxo Bouzada <mbouzada@gmail.com>, 2023
` }, msgstr: [`Last-Translator: Miguel Anxo Bouzada <mbouzada@gmail.com>, 2023
Language-Team: Galician (https://app.transifex.com/nextcloud/teams/64236/gl/)
Content-Type: text/plain; charset=UTF-8
Language: gl
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} conflito de ficheiros", "{count} conflitos de ficheiros"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} conflito de ficheiros en {dirname}", "{count} conflitos de ficheiros en {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["faltan {seconds} segundos"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["falta {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["faltan uns segundos"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Cancelar envíos"] }, Continue: { msgid: "Continue", msgstr: ["Continuar"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["calculando canto tempo falta"] }, "Existing version": { msgid: "Existing version", msgstr: ["Versión existente"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Se selecciona ambas as versións, o ficheiro copiado terá un número engadido ao seu nome."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Data da última modificación descoñecida"] }, New: { msgid: "New", msgstr: ["Nova"] }, "New version": { msgid: "New version", msgstr: ["Nova versión"] }, paused: { msgid: "paused", msgstr: ["detido"] }, "Preview image": { msgid: "Preview image", msgstr: ["Vista previa da imaxe"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Marcar todas as caixas de selección"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Seleccionar todos os ficheiros existentes"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Seleccionar todos os ficheiros novos"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Omita este ficheiro", "Omitir {count} ficheiros"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Tamaño descoñecido"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Envío cancelado"] }, "Upload files": { msgid: "Upload files", msgstr: ["Enviar ficheiros"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["Progreso do envío"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Que ficheiros quere conservar?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Debe seleccionar polo menos unha versión de cada ficheiro para continuar."] } } } } }, { locale: "he", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Hebrew (https://www.transifex.com/nextcloud/teams/64236/he/)", "Content-Type": "text/plain; charset=UTF-8", Language: "he", "Plural-Forms": "nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n == 2 && n % 1 == 0) ? 1: (n % 10 == 0 && n % 1 == 0 && n > 10) ? 2 : 3;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Hebrew (https://www.transifex.com/nextcloud/teams/64236/he/)
Content-Type: text/plain; charset=UTF-8
Language: he
Plural-Forms: nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n == 2 && n % 1 == 0) ? 1: (n % 10 == 0 && n % 1 == 0 && n > 10) ? 2 : 3;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "hi_IN", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Hindi (India) (https://www.transifex.com/nextcloud/teams/64236/hi_IN/)", "Content-Type": "text/plain; charset=UTF-8", Language: "hi_IN", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Hindi (India) (https://www.transifex.com/nextcloud/teams/64236/hi_IN/)
Content-Type: text/plain; charset=UTF-8
Language: hi_IN
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "hr", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Croatian (https://www.transifex.com/nextcloud/teams/64236/hr/)", "Content-Type": "text/plain; charset=UTF-8", Language: "hr", "Plural-Forms": "nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Croatian (https://www.transifex.com/nextcloud/teams/64236/hr/)
Content-Type: text/plain; charset=UTF-8
Language: hr
Plural-Forms: nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "hsb", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Upper Sorbian (https://www.transifex.com/nextcloud/teams/64236/hsb/)", "Content-Type": "text/plain; charset=UTF-8", Language: "hsb", "Plural-Forms": "nplurals=4; plural=(n%100==1 ? 0 : n%100==2 ? 1 : n%100==3 || n%100==4 ? 2 : 3);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Upper Sorbian (https://www.transifex.com/nextcloud/teams/64236/hsb/)
Content-Type: text/plain; charset=UTF-8
Language: hsb
Plural-Forms: nplurals=4; plural=(n%100==1 ? 0 : n%100==2 ? 1 : n%100==3 || n%100==4 ? 2 : 3);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "hu", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Hungarian (https://www.transifex.com/nextcloud/teams/64236/hu/)", "Content-Type": "text/plain; charset=UTF-8", Language: "hu", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Hungarian (https://www.transifex.com/nextcloud/teams/64236/hu/)
Content-Type: text/plain; charset=UTF-8
Language: hu
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "hu_HU", json: { charset: "utf-8", headers: { "Last-Translator": "Balázs Úr, 2022", "Language-Team": "Hungarian (Hungary) (https://www.transifex.com/nextcloud/teams/64236/hu_HU/)", "Content-Type": "text/plain; charset=UTF-8", Language: "hu_HU", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Balázs Meskó <meskobalazs@mailbox.org>, 2022
Balázs Úr, 2022
` }, msgstr: [`Last-Translator: Balázs Úr, 2022
Language-Team: Hungarian (Hungary) (https://www.transifex.com/nextcloud/teams/64236/hu_HU/)
Content-Type: text/plain; charset=UTF-8
Language: hu_HU
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{} másodperc van hátra"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["{time} van hátra"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["pár másodperc van hátra"] }, Add: { msgid: "Add", msgstr: ["Hozzáadás"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Feltöltések megszakítása"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["hátralévő idő becslése"] }, paused: { msgid: "paused", msgstr: ["szüneteltetve"] }, "Upload files": { msgid: "Upload files", msgstr: ["Fájlok feltöltése"] } } } } }, { locale: "hy", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Armenian (https://www.transifex.com/nextcloud/teams/64236/hy/)", "Content-Type": "text/plain; charset=UTF-8", Language: "hy", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Armenian (https://www.transifex.com/nextcloud/teams/64236/hy/)
Content-Type: text/plain; charset=UTF-8
Language: hy
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "ia", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Interlingua (https://www.transifex.com/nextcloud/teams/64236/ia/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ia", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Interlingua (https://www.transifex.com/nextcloud/teams/64236/ia/)
Content-Type: text/plain; charset=UTF-8
Language: ia
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "id", json: { charset: "utf-8", headers: { "Last-Translator": "Linerly <linerly@proton.me>, 2023", "Language-Team": "Indonesian (https://app.transifex.com/nextcloud/teams/64236/id/)", "Content-Type": "text/plain; charset=UTF-8", Language: "id", "Plural-Forms": "nplurals=1; plural=0;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
John Molakvoæ <skjnldsv@protonmail.com>, 2023
Empty Slot Filler, 2023
Linerly <linerly@proton.me>, 2023
` }, msgstr: [`Last-Translator: Linerly <linerly@proton.me>, 2023
Language-Team: Indonesian (https://app.transifex.com/nextcloud/teams/64236/id/)
Content-Type: text/plain; charset=UTF-8
Language: id
Plural-Forms: nplurals=1; plural=0;
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} berkas berkonflik"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} berkas berkonflik dalam {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} detik tersisa"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["{time} tersisa"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["tinggal sebentar lagi"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Batalkan unggahan"] }, Continue: { msgid: "Continue", msgstr: ["Lanjutkan"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["memperkirakan waktu yang tersisa"] }, "Existing version": { msgid: "Existing version", msgstr: ["Versi yang ada"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Jika Anda memilih kedua versi, nama berkas yang disalin akan ditambahi angka."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Tanggal perubahan terakhir tidak diketahui"] }, New: { msgid: "New", msgstr: ["Baru"] }, "New version": { msgid: "New version", msgstr: ["Versi baru"] }, paused: { msgid: "paused", msgstr: ["dijeda"] }, "Preview image": { msgid: "Preview image", msgstr: ["Gambar pratinjau"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Pilih semua kotak centang"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Pilih semua berkas yang ada"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Pilih semua berkas baru"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Lewati {count} berkas"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Ukuran tidak diketahui"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Unggahan dibatalkan"] }, "Upload files": { msgid: "Upload files", msgstr: ["Unggah berkas"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Berkas mana yang Anda ingin tetap simpan?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Anda harus memilih setidaknya satu versi dari masing-masing berkas untuk melanjutkan."] } } } } }, { locale: "ig", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Igbo (https://www.transifex.com/nextcloud/teams/64236/ig/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ig", "Plural-Forms": "nplurals=1; plural=0;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Igbo (https://www.transifex.com/nextcloud/teams/64236/ig/)
Content-Type: text/plain; charset=UTF-8
Language: ig
Plural-Forms: nplurals=1; plural=0;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "is", json: { charset: "utf-8", headers: { "Last-Translator": "Sveinn í Felli <sv1@fellsnet.is>, 2023", "Language-Team": "Icelandic (https://app.transifex.com/nextcloud/teams/64236/is/)", "Content-Type": "text/plain; charset=UTF-8", Language: "is", "Plural-Forms": "nplurals=2; plural=(n % 10 != 1 || n % 100 == 11);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Sveinn í Felli <sv1@fellsnet.is>, 2023
` }, msgstr: [`Last-Translator: Sveinn í Felli <sv1@fellsnet.is>, 2023
Language-Team: Icelandic (https://app.transifex.com/nextcloud/teams/64236/is/)
Content-Type: text/plain; charset=UTF-8
Language: is
Plural-Forms: nplurals=2; plural=(n % 10 != 1 || n % 100 == 11);
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} árekstur skráa", "{count} árekstrar skráa"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} árekstur skráa í {dirname}", "{count} árekstrar skráa í {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} sekúndur eftir"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["{time} eftir"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["nokkrar sekúndur eftir"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Hætta við innsendingar"] }, Continue: { msgid: "Continue", msgstr: ["Halda áfram"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["áætla tíma sem eftir er"] }, "Existing version": { msgid: "Existing version", msgstr: ["Fyrirliggjandi útgáfa"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Ef þú velur báðar útgáfur, þá mun verða bætt tölustaf aftan við heiti afrituðu skrárinnar."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Síðasta breytingadagsetning er óþekkt"] }, New: { msgid: "New", msgstr: ["Nýtt"] }, "New version": { msgid: "New version", msgstr: ["Ný útgáfa"] }, paused: { msgid: "paused", msgstr: ["í bið"] }, "Preview image": { msgid: "Preview image", msgstr: ["Forskoðun myndar"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Velja gátreiti"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Velja allar fyrirliggjandi skrár"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Velja allar nýjar skrár"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Sleppa þessari skrá", "Sleppa {count} skrám"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Óþekkt stærð"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Hætt við innsendingu"] }, "Upload files": { msgid: "Upload files", msgstr: ["Senda inn skrár"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Hvaða skrám vilt þú vilt halda eftir?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Þú verður að velja að minnsta kosti eina útgáfu af hverri skrá til að halda áfram."] } } } } }, { locale: "it", json: { charset: "utf-8", headers: { "Last-Translator": "Random_R, 2023", "Language-Team": "Italian (https://app.transifex.com/nextcloud/teams/64236/it/)", "Content-Type": "text/plain; charset=UTF-8", Language: "it", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
John Molakvoæ <skjnldsv@protonmail.com>, 2023
Lep Lep, 2023
Random_R, 2023
` }, msgstr: [`Last-Translator: Random_R, 2023
Language-Team: Italian (https://app.transifex.com/nextcloud/teams/64236/it/)
Content-Type: text/plain; charset=UTF-8
Language: it
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} file in conflitto", "{count} file in conflitto", "{count} file in conflitto"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} file in conflitto in {dirname}", "{count} file in conflitto in {dirname}", "{count} file in conflitto in {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} secondi rimanenti "] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["{time} rimanente"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["alcuni secondi rimanenti"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Annulla i caricamenti"] }, Continue: { msgid: "Continue", msgstr: ["Continua"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["calcolo il tempo rimanente"] }, "Existing version": { msgid: "Existing version", msgstr: ["Versione esistente"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Se selezioni entrambe le versioni, nel nome del file copiato verrà aggiunto un numero "] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Ultima modifica sconosciuta"] }, New: { msgid: "New", msgstr: ["Nuovo"] }, "New version": { msgid: "New version", msgstr: ["Nuova versione"] }, paused: { msgid: "paused", msgstr: ["pausa"] }, "Preview image": { msgid: "Preview image", msgstr: ["Anteprima immagine"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Seleziona tutte le caselle"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Seleziona tutti i file esistenti"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Seleziona tutti i nuovi file"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Salta questo file", "Salta {count} file", "Salta {count} file"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Dimensione sconosciuta"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Caricamento cancellato"] }, "Upload files": { msgid: "Upload files", msgstr: ["Carica i file"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Quali file vuoi mantenere?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Devi selezionare almeno una versione di ogni file per continuare"] } } } } }, { locale: "it_IT", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Italian (Italy) (https://www.transifex.com/nextcloud/teams/64236/it_IT/)", "Content-Type": "text/plain; charset=UTF-8", Language: "it_IT", "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Italian (Italy) (https://www.transifex.com/nextcloud/teams/64236/it_IT/)
Content-Type: text/plain; charset=UTF-8
Language: it_IT
Plural-Forms: nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "ja_JP", json: { charset: "utf-8", headers: { "Last-Translator": "かたかめ, 2022", "Language-Team": "Japanese (Japan) (https://www.transifex.com/nextcloud/teams/64236/ja_JP/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ja_JP", "Plural-Forms": "nplurals=1; plural=0;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
T.S, 2022
かたかめ, 2022
` }, msgstr: [`Last-Translator: かたかめ, 2022
Language-Team: Japanese (Japan) (https://www.transifex.com/nextcloud/teams/64236/ja_JP/)
Content-Type: text/plain; charset=UTF-8
Language: ja_JP
Plural-Forms: nplurals=1; plural=0;
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["残り {seconds} 秒"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["残り {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["残り数秒"] }, Add: { msgid: "Add", msgstr: ["追加"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["アップロードをキャンセル"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["概算残り時間"] }, paused: { msgid: "paused", msgstr: ["一時停止中"] }, "Upload files": { msgid: "Upload files", msgstr: ["ファイルをアップデート"] } } } } }, { locale: "ka", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Georgian (https://www.transifex.com/nextcloud/teams/64236/ka/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ka", "Plural-Forms": "nplurals=2; plural=(n!=1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Georgian (https://www.transifex.com/nextcloud/teams/64236/ka/)
Content-Type: text/plain; charset=UTF-8
Language: ka
Plural-Forms: nplurals=2; plural=(n!=1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "ka_GE", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Georgian (Georgia) (https://www.transifex.com/nextcloud/teams/64236/ka_GE/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ka_GE", "Plural-Forms": "nplurals=2; plural=(n!=1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Georgian (Georgia) (https://www.transifex.com/nextcloud/teams/64236/ka_GE/)
Content-Type: text/plain; charset=UTF-8
Language: ka_GE
Plural-Forms: nplurals=2; plural=(n!=1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "kab", json: { charset: "utf-8", headers: { "Last-Translator": "ZiriSut, 2023", "Language-Team": "Kabyle (https://app.transifex.com/nextcloud/teams/64236/kab/)", "Content-Type": "text/plain; charset=UTF-8", Language: "kab", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
ZiriSut, 2023
` }, msgstr: [`Last-Translator: ZiriSut, 2023
Language-Team: Kabyle (https://app.transifex.com/nextcloud/teams/64236/kab/)
Content-Type: text/plain; charset=UTF-8
Language: kab
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} tesdatin i d-yeqqimen"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["{time} i d-yeqqimen"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["qqiment-d kra n tesdatin kan"] }, Add: { msgid: "Add", msgstr: ["Rnu"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Sefsex asali"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["asizel n wakud i d-yeqqimen"] }, paused: { msgid: "paused", msgstr: ["yeḥbes"] }, "Upload files": { msgid: "Upload files", msgstr: ["Sali-d ifuyla"] } } } } }, { locale: "kk", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Kazakh (https://www.transifex.com/nextcloud/teams/64236/kk/)", "Content-Type": "text/plain; charset=UTF-8", Language: "kk", "Plural-Forms": "nplurals=2; plural=(n!=1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Kazakh (https://www.transifex.com/nextcloud/teams/64236/kk/)
Content-Type: text/plain; charset=UTF-8
Language: kk
Plural-Forms: nplurals=2; plural=(n!=1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "km", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Khmer (https://www.transifex.com/nextcloud/teams/64236/km/)", "Content-Type": "text/plain; charset=UTF-8", Language: "km", "Plural-Forms": "nplurals=1; plural=0;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Khmer (https://www.transifex.com/nextcloud/teams/64236/km/)
Content-Type: text/plain; charset=UTF-8
Language: km
Plural-Forms: nplurals=1; plural=0;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "kn", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Kannada (https://www.transifex.com/nextcloud/teams/64236/kn/)", "Content-Type": "text/plain; charset=UTF-8", Language: "kn", "Plural-Forms": "nplurals=2; plural=(n > 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Kannada (https://www.transifex.com/nextcloud/teams/64236/kn/)
Content-Type: text/plain; charset=UTF-8
Language: kn
Plural-Forms: nplurals=2; plural=(n > 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "ko", json: { charset: "utf-8", headers: { "Last-Translator": "Brandon Han, 2024", "Language-Team": "Korean (https://app.transifex.com/nextcloud/teams/64236/ko/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ko", "Plural-Forms": "nplurals=1; plural=0;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
John Molakvoæ <skjnldsv@protonmail.com>, 2023
hosun Lee, 2023
Brandon Han, 2024
` }, msgstr: [`Last-Translator: Brandon Han, 2024
Language-Team: Korean (https://app.transifex.com/nextcloud/teams/64236/ko/)
Content-Type: text/plain; charset=UTF-8
Language: ko
Plural-Forms: nplurals=1; plural=0;
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count}개의 파일이 충돌함"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{dirname}에서 {count}개의 파일이 충돌함"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} 남음"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["{time} 남음"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["곧 완료"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["업로드 취소"] }, Continue: { msgid: "Continue", msgstr: ["확인"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["남은 시간 계산"] }, "Existing version": { msgid: "Existing version", msgstr: ["현재 버전"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["두 버전을 모두 선택할 경우, 복제된 파일 이름에 숫자가 추가됩니다."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["최근 수정일 알 수 없음"] }, New: { msgid: "New", msgstr: ["새로 만들기"] }, "New version": { msgid: "New version", msgstr: ["새 버전"] }, paused: { msgid: "paused", msgstr: ["일시정지됨"] }, "Preview image": { msgid: "Preview image", msgstr: ["미리보기 이미지"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["모든 체크박스 선택"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["모든 파일 선택"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["모든 새 파일 선택"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["{count}개의 파일 넘기기"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["크기를 알 수 없음"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["업로드 취소됨"] }, "Upload files": { msgid: "Upload files", msgstr: ["파일 업로드"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["업로드 진행도"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["어떤 파일을 보존하시겠습니까?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["계속하기 위해서는 한 파일에 최소 하나의 버전을 선택해야 합니다."] } } } } }, { locale: "la", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Latin (https://www.transifex.com/nextcloud/teams/64236/la/)", "Content-Type": "text/plain; charset=UTF-8", Language: "la", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Latin (https://www.transifex.com/nextcloud/teams/64236/la/)
Content-Type: text/plain; charset=UTF-8
Language: la
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "lb", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Luxembourgish (https://www.transifex.com/nextcloud/teams/64236/lb/)", "Content-Type": "text/plain; charset=UTF-8", Language: "lb", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Luxembourgish (https://www.transifex.com/nextcloud/teams/64236/lb/)
Content-Type: text/plain; charset=UTF-8
Language: lb
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "lo", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Lao (https://www.transifex.com/nextcloud/teams/64236/lo/)", "Content-Type": "text/plain; charset=UTF-8", Language: "lo", "Plural-Forms": "nplurals=1; plural=0;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Lao (https://www.transifex.com/nextcloud/teams/64236/lo/)
Content-Type: text/plain; charset=UTF-8
Language: lo
Plural-Forms: nplurals=1; plural=0;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "lt_LT", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Lithuanian (Lithuania) (https://www.transifex.com/nextcloud/teams/64236/lt_LT/)", "Content-Type": "text/plain; charset=UTF-8", Language: "lt_LT", "Plural-Forms": "nplurals=4; plural=(n % 10 == 1 && (n % 100 > 19 || n % 100 < 11) ? 0 : (n % 10 >= 2 && n % 10 <=9) && (n % 100 > 19 || n % 100 < 11) ? 1 : n % 1 != 0 ? 2: 3);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Lithuanian (Lithuania) (https://www.transifex.com/nextcloud/teams/64236/lt_LT/)
Content-Type: text/plain; charset=UTF-8
Language: lt_LT
Plural-Forms: nplurals=4; plural=(n % 10 == 1 && (n % 100 > 19 || n % 100 < 11) ? 0 : (n % 10 >= 2 && n % 10 <=9) && (n % 100 > 19 || n % 100 < 11) ? 1 : n % 1 != 0 ? 2: 3);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "lv", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Latvian (https://www.transifex.com/nextcloud/teams/64236/lv/)", "Content-Type": "text/plain; charset=UTF-8", Language: "lv", "Plural-Forms": "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Latvian (https://www.transifex.com/nextcloud/teams/64236/lv/)
Content-Type: text/plain; charset=UTF-8
Language: lv
Plural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "mk", json: { charset: "utf-8", headers: { "Last-Translator": "Сашко Тодоров <sasetodorov@gmail.com>, 2022", "Language-Team": "Macedonian (https://www.transifex.com/nextcloud/teams/64236/mk/)", "Content-Type": "text/plain; charset=UTF-8", Language: "mk", "Plural-Forms": "nplurals=2; plural=(n % 10 == 1 && n % 100 != 11) ? 0 : 1;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Сашко Тодоров <sasetodorov@gmail.com>, 2022
` }, msgstr: [`Last-Translator: Сашко Тодоров <sasetodorov@gmail.com>, 2022
Language-Team: Macedonian (https://www.transifex.com/nextcloud/teams/64236/mk/)
Content-Type: text/plain; charset=UTF-8
Language: mk
Plural-Forms: nplurals=2; plural=(n % 10 == 1 && n % 100 != 11) ? 0 : 1;
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["преостануваат {seconds} секунди"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["преостанува {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["уште неколку секунди"] }, Add: { msgid: "Add", msgstr: ["Додади"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Прекини прикачување"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["приближно преостанато време"] }, paused: { msgid: "paused", msgstr: ["паузирано"] }, "Upload files": { msgid: "Upload files", msgstr: ["Прикачување датотеки"] } } } } }, { locale: "mn", json: { charset: "utf-8", headers: { "Last-Translator": "BATKHUYAG Ganbold, 2023", "Language-Team": "Mongolian (https://app.transifex.com/nextcloud/teams/64236/mn/)", "Content-Type": "text/plain; charset=UTF-8", Language: "mn", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
BATKHUYAG Ganbold, 2023
` }, msgstr: [`Last-Translator: BATKHUYAG Ganbold, 2023
Language-Team: Mongolian (https://app.transifex.com/nextcloud/teams/64236/mn/)
Content-Type: text/plain; charset=UTF-8
Language: mn
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} секунд үлдсэн"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["{time} үлдсэн"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["хэдхэн секунд үлдсэн"] }, Add: { msgid: "Add", msgstr: ["Нэмэх"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Илгээлтийг цуцлах"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["Үлдсэн хугацааг тооцоолж байна"] }, paused: { msgid: "paused", msgstr: ["түр зогсоосон"] }, "Upload files": { msgid: "Upload files", msgstr: ["Файл илгээх"] } } } } }, { locale: "mr", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Marathi (https://www.transifex.com/nextcloud/teams/64236/mr/)", "Content-Type": "text/plain; charset=UTF-8", Language: "mr", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Marathi (https://www.transifex.com/nextcloud/teams/64236/mr/)
Content-Type: text/plain; charset=UTF-8
Language: mr
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "ms_MY", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Malay (Malaysia) (https://www.transifex.com/nextcloud/teams/64236/ms_MY/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ms_MY", "Plural-Forms": "nplurals=1; plural=0;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Malay (Malaysia) (https://www.transifex.com/nextcloud/teams/64236/ms_MY/)
Content-Type: text/plain; charset=UTF-8
Language: ms_MY
Plural-Forms: nplurals=1; plural=0;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "my", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Burmese (https://www.transifex.com/nextcloud/teams/64236/my/)", "Content-Type": "text/plain; charset=UTF-8", Language: "my", "Plural-Forms": "nplurals=1; plural=0;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Burmese (https://www.transifex.com/nextcloud/teams/64236/my/)
Content-Type: text/plain; charset=UTF-8
Language: my
Plural-Forms: nplurals=1; plural=0;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "nb_NO", json: { charset: "utf-8", headers: { "Last-Translator": "Syvert Fossdal, 2024", "Language-Team": "Norwegian Bokmål (Norway) (https://app.transifex.com/nextcloud/teams/64236/nb_NO/)", "Content-Type": "text/plain; charset=UTF-8", Language: "nb_NO", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
John Molakvoæ <skjnldsv@protonmail.com>, 2023
Syvert Fossdal, 2024
` }, msgstr: [`Last-Translator: Syvert Fossdal, 2024
Language-Team: Norwegian Bokmål (Norway) (https://app.transifex.com/nextcloud/teams/64236/nb_NO/)
Content-Type: text/plain; charset=UTF-8
Language: nb_NO
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} file conflict", "{count} filkonflikter"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} file conflict in {dirname}", "{count} filkonflikter i {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} sekunder igjen"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["{time} igjen"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["noen få sekunder igjen"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Avbryt opplastninger"] }, Continue: { msgid: "Continue", msgstr: ["Fortsett"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["Estimerer tid igjen"] }, "Existing version": { msgid: "Existing version", msgstr: ["Gjeldende versjon"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Hvis du velger begge versjoner, vil den kopierte filen få et tall lagt til navnet."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Siste gang redigert ukjent"] }, New: { msgid: "New", msgstr: ["Ny"] }, "New version": { msgid: "New version", msgstr: ["Ny versjon"] }, paused: { msgid: "paused", msgstr: ["pauset"] }, "Preview image": { msgid: "Preview image", msgstr: ["Forhåndsvis bilde"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Velg alle"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Velg alle eksisterende filer"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Velg alle nye filer"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Skip this file", "Hopp over {count} filer"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Ukjent størrelse"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Opplasting avbrutt"] }, "Upload files": { msgid: "Upload files", msgstr: ["Last opp filer"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["Fremdrift, opplasting"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Hvilke filer vil du beholde?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Du må velge minst en versjon av hver fil for å fortsette."] } } } } }, { locale: "ne", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Nepali (https://www.transifex.com/nextcloud/teams/64236/ne/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ne", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Nepali (https://www.transifex.com/nextcloud/teams/64236/ne/)
Content-Type: text/plain; charset=UTF-8
Language: ne
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "nl", json: { charset: "utf-8", headers: { "Last-Translator": "Rico <rico-schwab@hotmail.com>, 2023", "Language-Team": "Dutch (https://app.transifex.com/nextcloud/teams/64236/nl/)", "Content-Type": "text/plain; charset=UTF-8", Language: "nl", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Rico <rico-schwab@hotmail.com>, 2023
` }, msgstr: [`Last-Translator: Rico <rico-schwab@hotmail.com>, 2023
Language-Team: Dutch (https://app.transifex.com/nextcloud/teams/64236/nl/)
Content-Type: text/plain; charset=UTF-8
Language: nl
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["Nog {seconds} seconden"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["{seconds} over"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["Nog een paar seconden"] }, Add: { msgid: "Add", msgstr: ["Voeg toe"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Uploads annuleren"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["Schatting van de resterende tijd"] }, paused: { msgid: "paused", msgstr: ["Gepauzeerd"] }, "Upload files": { msgid: "Upload files", msgstr: ["Upload bestanden"] } } } } }, { locale: "nn", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Norwegian Nynorsk (https://www.transifex.com/nextcloud/teams/64236/nn/)", "Content-Type": "text/plain; charset=UTF-8", Language: "nn", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Norwegian Nynorsk (https://www.transifex.com/nextcloud/teams/64236/nn/)
Content-Type: text/plain; charset=UTF-8
Language: nn
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "nn_NO", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Norwegian Nynorsk (Norway) (https://www.transifex.com/nextcloud/teams/64236/nn_NO/)", "Content-Type": "text/plain; charset=UTF-8", Language: "nn_NO", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Norwegian Nynorsk (Norway) (https://www.transifex.com/nextcloud/teams/64236/nn_NO/)
Content-Type: text/plain; charset=UTF-8
Language: nn_NO
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "oc", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Occitan (post 1500) (https://www.transifex.com/nextcloud/teams/64236/oc/)", "Content-Type": "text/plain; charset=UTF-8", Language: "oc", "Plural-Forms": "nplurals=2; plural=(n > 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Occitan (post 1500) (https://www.transifex.com/nextcloud/teams/64236/oc/)
Content-Type: text/plain; charset=UTF-8
Language: oc
Plural-Forms: nplurals=2; plural=(n > 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "pl", json: { charset: "utf-8", headers: { "Last-Translator": "Valdnet, 2024", "Language-Team": "Polish (https://app.transifex.com/nextcloud/teams/64236/pl/)", "Content-Type": "text/plain; charset=UTF-8", Language: "pl", "Plural-Forms": "nplurals=4; plural=(n==1 ? 0 : (n%10>=2 && n%10<=4) && (n%100<12 || n%100>14) ? 1 : n!=1 && (n%10>=0 && n%10<=1) || (n%10>=5 && n%10<=9) || (n%100>=12 && n%100<=14) ? 2 : 3);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
John Molakvoæ <skjnldsv@protonmail.com>, 2023
M H <haincu@o2.pl>, 2023
Valdnet, 2024
` }, msgstr: [`Last-Translator: Valdnet, 2024
Language-Team: Polish (https://app.transifex.com/nextcloud/teams/64236/pl/)
Content-Type: text/plain; charset=UTF-8
Language: pl
Plural-Forms: nplurals=4; plural=(n==1 ? 0 : (n%10>=2 && n%10<=4) && (n%100<12 || n%100>14) ? 1 : n!=1 && (n%10>=0 && n%10<=1) || (n%10>=5 && n%10<=9) || (n%100>=12 && n%100<=14) ? 2 : 3);
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["konflikt 1 pliku", "{count} konfliktów plików", "{count} konfliktów plików", "{count} konfliktów plików"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} konfliktowy plik w {dirname}", "{count} konfliktowych plików w {dirname}", "{count} konfliktowych plików w {dirname}", "{count} konfliktowych plików w {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["Pozostało {seconds} sekund"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["Pozostało {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["Pozostało kilka sekund"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Anuluj wysyłanie"] }, Continue: { msgid: "Continue", msgstr: ["Kontynuuj"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["Szacowanie pozostałego czasu"] }, "Existing version": { msgid: "Existing version", msgstr: ["Istniejąca wersja"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Jeżeli wybierzesz obie wersje to do nazw skopiowanych plików zostanie dodany numer"] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Nieznana data ostatniej modyfikacji"] }, New: { msgid: "New", msgstr: ["Nowy"] }, "New version": { msgid: "New version", msgstr: ["Nowa wersja"] }, paused: { msgid: "paused", msgstr: ["Wstrzymane"] }, "Preview image": { msgid: "Preview image", msgstr: ["Podgląd obrazu"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Zaznacz wszystkie boxy"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Zaznacz wszystkie istniejące pliki"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Zaznacz wszystkie nowe pliki"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Pomiń 1 plik", "Pomiń {count} plików", "Pomiń {count} plików", "Pomiń {count} plików"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Nieznany rozmiar"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Anulowano wysyłanie"] }, "Upload files": { msgid: "Upload files", msgstr: ["Wyślij pliki"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["Postęp wysyłania"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Które pliki chcesz zachować"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Aby kontynuować, musisz wybrać co najmniej jedną wersję każdego pliku."] } } } } }, { locale: "ps", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Pashto (https://www.transifex.com/nextcloud/teams/64236/ps/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ps", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Pashto (https://www.transifex.com/nextcloud/teams/64236/ps/)
Content-Type: text/plain; charset=UTF-8
Language: ps
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "pt_BR", json: { charset: "utf-8", headers: { "Last-Translator": "Leonardo Colman Lopes <leonardo.dev@colman.com.br>, 2024", "Language-Team": "Portuguese (Brazil) (https://app.transifex.com/nextcloud/teams/64236/pt_BR/)", "Content-Type": "text/plain; charset=UTF-8", Language: "pt_BR", "Plural-Forms": "nplurals=3; plural=(n == 0 || n == 1) ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Joas Schilling, 2024
Leonardo Colman Lopes <leonardo.dev@colman.com.br>, 2024
` }, msgstr: [`Last-Translator: Leonardo Colman Lopes <leonardo.dev@colman.com.br>, 2024
Language-Team: Portuguese (Brazil) (https://app.transifex.com/nextcloud/teams/64236/pt_BR/)
Content-Type: text/plain; charset=UTF-8
Language: pt_BR
Plural-Forms: nplurals=3; plural=(n == 0 || n == 1) ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} arquivos em conflito", "{count} arquivos em conflito", "{count} arquivos em conflito"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} conflitos de arquivo em {dirname}", "{count} conflitos de arquivo em {dirname}", "{count} conflitos de arquivo em {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} segundos restantes"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["{time} restante"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["alguns segundos restantes"] }, Cancel: { msgid: "Cancel", msgstr: ["Cancelar"] }, "Cancel the entire operation": { msgid: "Cancel the entire operation", msgstr: ["Cancelar a operação inteira"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Cancelar uploads"] }, Continue: { msgid: "Continue", msgstr: ["Continuar"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["estimando tempo restante"] }, "Existing version": { msgid: "Existing version", msgstr: ["Versão existente"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Se você selecionar ambas as versões, o arquivo copiado terá um número adicionado ao seu nome."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Data da última modificação desconhecida"] }, New: { msgid: "New", msgstr: ["Novo"] }, "New version": { msgid: "New version", msgstr: ["Nova versão"] }, paused: { msgid: "paused", msgstr: ["pausado"] }, "Preview image": { msgid: "Preview image", msgstr: ["Visualizar imagem"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Marque todas as caixas de seleção"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Selecione todos os arquivos existentes"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Selecione todos os novos arquivos"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Ignorar {count} arquivos", "Ignorar {count} arquivos", "Ignorar {count} arquivos"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Tamanho desconhecido"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Envio cancelado"] }, "Upload files": { msgid: "Upload files", msgstr: ["Enviar arquivos"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["Envio em progresso"] }, "When an incoming folder is selected, any conflicting files within it will also be overwritten.": { msgid: "When an incoming folder is selected, any conflicting files within it will also be overwritten.", msgstr: ["Quando uma pasta é selecionada, quaisquer arquivos dentro dela também serão sobrescritos."] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Quais arquivos você deseja manter?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Você precisa selecionar pelo menos uma versão de cada arquivo para continuar."] } } } } }, { locale: "pt_PT", json: { charset: "utf-8", headers: { "Last-Translator": "Manuela Silva <mmsrs@sky.com>, 2022", "Language-Team": "Portuguese (Portugal) (https://www.transifex.com/nextcloud/teams/64236/pt_PT/)", "Content-Type": "text/plain; charset=UTF-8", Language: "pt_PT", "Plural-Forms": "nplurals=3; plural=(n == 0 || n == 1) ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Manuela Silva <mmsrs@sky.com>, 2022
` }, msgstr: [`Last-Translator: Manuela Silva <mmsrs@sky.com>, 2022
Language-Team: Portuguese (Portugal) (https://www.transifex.com/nextcloud/teams/64236/pt_PT/)
Content-Type: text/plain; charset=UTF-8
Language: pt_PT
Plural-Forms: nplurals=3; plural=(n == 0 || n == 1) ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["faltam {seconds} segundo(s)"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["faltam {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["faltam uns segundos"] }, Add: { msgid: "Add", msgstr: ["Adicionar"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Cancelar envios"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["tempo em falta estimado"] }, paused: { msgid: "paused", msgstr: ["pausado"] }, "Upload files": { msgid: "Upload files", msgstr: ["Enviar ficheiros"] } } } } }, { locale: "ro", json: { charset: "utf-8", headers: { "Last-Translator": "Mădălin Vasiliu <contact@madalinvasiliu.com>, 2022", "Language-Team": "Romanian (https://www.transifex.com/nextcloud/teams/64236/ro/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ro", "Plural-Forms": "nplurals=3; plural=(n==1?0:(((n%100>19)||((n%100==0)&&(n!=0)))?2:1));" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Mădălin Vasiliu <contact@madalinvasiliu.com>, 2022
` }, msgstr: [`Last-Translator: Mădălin Vasiliu <contact@madalinvasiliu.com>, 2022
Language-Team: Romanian (https://www.transifex.com/nextcloud/teams/64236/ro/)
Content-Type: text/plain; charset=UTF-8
Language: ro
Plural-Forms: nplurals=3; plural=(n==1?0:(((n%100>19)||((n%100==0)&&(n!=0)))?2:1));
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} secunde rămase"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["{time} rămas"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["câteva secunde rămase"] }, Add: { msgid: "Add", msgstr: ["Adaugă"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Anulați încărcările"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["estimarea timpului rămas"] }, paused: { msgid: "paused", msgstr: ["pus pe pauză"] }, "Upload files": { msgid: "Upload files", msgstr: ["Încarcă fișiere"] } } } } }, { locale: "ru", json: { charset: "utf-8", headers: { "Last-Translator": "Александр, 2023", "Language-Team": "Russian (https://app.transifex.com/nextcloud/teams/64236/ru/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ru", "Plural-Forms": "nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
John Molakvoæ <skjnldsv@protonmail.com>, 2023
Max Smith <sevinfolds@gmail.com>, 2023
Александр, 2023
` }, msgstr: [`Last-Translator: Александр, 2023
Language-Team: Russian (https://app.transifex.com/nextcloud/teams/64236/ru/)
Content-Type: text/plain; charset=UTF-8
Language: ru
Plural-Forms: nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["конфликт {count} файла", "конфликт {count} файлов", "конфликт {count} файлов", "конфликт {count} файлов"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["конфликт {count} файла в {dirname}", "конфликт {count} файлов в {dirname}", "конфликт {count} файлов в {dirname}", "конфликт {count} файлов в {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["осталось {seconds} секунд"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["осталось {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["осталось несколько секунд"] }, Add: { msgid: "Add", msgstr: ["Добавить"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Отменить загрузки"] }, Continue: { msgid: "Continue", msgstr: ["Продолжить"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["оценка оставшегося времени"] }, "Existing version": { msgid: "Existing version", msgstr: ["Текущая версия"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Если вы выберете обе версии, к имени скопированного файла будет добавлен номер."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Дата последнего изменения неизвестна"] }, "New version": { msgid: "New version", msgstr: ["Новая версия"] }, paused: { msgid: "paused", msgstr: ["приостановлено"] }, "Preview image": { msgid: "Preview image", msgstr: ["Предварительный просмотр"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Установить все флажки"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Выбрать все существующие файлы"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Выбрать все новые файлы"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Пропустить файл", "Пропустить {count} файла", "Пропустить {count} файлов", "Пропустить {count} файлов"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Неизвестный размер"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Загрузка отменена"] }, "Upload files": { msgid: "Upload files", msgstr: ["Загрузка файлов"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Какие файлы вы хотите сохранить?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Для продолжения вам нужно выбрать по крайней мере одну версию каждого файла."] } } } } }, { locale: "ru_RU", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Russian (Russia) (https://www.transifex.com/nextcloud/teams/64236/ru_RU/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ru_RU", "Plural-Forms": "nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Russian (Russia) (https://www.transifex.com/nextcloud/teams/64236/ru_RU/)
Content-Type: text/plain; charset=UTF-8
Language: ru_RU
Plural-Forms: nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "sc", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Sardinian (https://www.transifex.com/nextcloud/teams/64236/sc/)", "Content-Type": "text/plain; charset=UTF-8", Language: "sc", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Sardinian (https://www.transifex.com/nextcloud/teams/64236/sc/)
Content-Type: text/plain; charset=UTF-8
Language: sc
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "si", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Sinhala (https://www.transifex.com/nextcloud/teams/64236/si/)", "Content-Type": "text/plain; charset=UTF-8", Language: "si", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Sinhala (https://www.transifex.com/nextcloud/teams/64236/si/)
Content-Type: text/plain; charset=UTF-8
Language: si
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "si_LK", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Sinhala (Sri Lanka) (https://www.transifex.com/nextcloud/teams/64236/si_LK/)", "Content-Type": "text/plain; charset=UTF-8", Language: "si_LK", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Sinhala (Sri Lanka) (https://www.transifex.com/nextcloud/teams/64236/si_LK/)
Content-Type: text/plain; charset=UTF-8
Language: si_LK
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "sk_SK", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Slovak (Slovakia) (https://www.transifex.com/nextcloud/teams/64236/sk_SK/)", "Content-Type": "text/plain; charset=UTF-8", Language: "sk_SK", "Plural-Forms": "nplurals=4; plural=(n % 1 == 0 && n == 1 ? 0 : n % 1 == 0 && n >= 2 && n <= 4 ? 1 : n % 1 != 0 ? 2: 3);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Slovak (Slovakia) (https://www.transifex.com/nextcloud/teams/64236/sk_SK/)
Content-Type: text/plain; charset=UTF-8
Language: sk_SK
Plural-Forms: nplurals=4; plural=(n % 1 == 0 && n == 1 ? 0 : n % 1 == 0 && n >= 2 && n <= 4 ? 1 : n % 1 != 0 ? 2: 3);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "sl", json: { charset: "utf-8", headers: { "Last-Translator": "Matej Urbančič <>, 2022", "Language-Team": "Slovenian (https://www.transifex.com/nextcloud/teams/64236/sl/)", "Content-Type": "text/plain; charset=UTF-8", Language: "sl", "Plural-Forms": "nplurals=4; plural=(n%100==1 ? 0 : n%100==2 ? 1 : n%100==3 || n%100==4 ? 2 : 3);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Matej Urbančič <>, 2022
` }, msgstr: [`Last-Translator: Matej Urbančič <>, 2022
Language-Team: Slovenian (https://www.transifex.com/nextcloud/teams/64236/sl/)
Content-Type: text/plain; charset=UTF-8
Language: sl
Plural-Forms: nplurals=4; plural=(n%100==1 ? 0 : n%100==2 ? 1 : n%100==3 || n%100==4 ? 2 : 3);
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["še {seconds} sekund"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["še {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["še nekaj sekund"] }, Add: { msgid: "Add", msgstr: ["Dodaj"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Prekliči pošiljanje"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["ocenjen čas do konca"] }, paused: { msgid: "paused", msgstr: ["v premoru"] }, "Upload files": { msgid: "Upload files", msgstr: ["Pošlji datoteke"] } } } } }, { locale: "sl_SI", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Slovenian (Slovenia) (https://www.transifex.com/nextcloud/teams/64236/sl_SI/)", "Content-Type": "text/plain; charset=UTF-8", Language: "sl_SI", "Plural-Forms": "nplurals=4; plural=(n%100==1 ? 0 : n%100==2 ? 1 : n%100==3 || n%100==4 ? 2 : 3);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Slovenian (Slovenia) (https://www.transifex.com/nextcloud/teams/64236/sl_SI/)
Content-Type: text/plain; charset=UTF-8
Language: sl_SI
Plural-Forms: nplurals=4; plural=(n%100==1 ? 0 : n%100==2 ? 1 : n%100==3 || n%100==4 ? 2 : 3);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "sq", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Albanian (https://www.transifex.com/nextcloud/teams/64236/sq/)", "Content-Type": "text/plain; charset=UTF-8", Language: "sq", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Albanian (https://www.transifex.com/nextcloud/teams/64236/sq/)
Content-Type: text/plain; charset=UTF-8
Language: sq
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "sr", json: { charset: "utf-8", headers: { "Last-Translator": "Иван Пешић, 2023", "Language-Team": "Serbian (https://app.transifex.com/nextcloud/teams/64236/sr/)", "Content-Type": "text/plain; charset=UTF-8", Language: "sr", "Plural-Forms": "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
John Molakvoæ <skjnldsv@protonmail.com>, 2023
Иван Пешић, 2023
` }, msgstr: [`Last-Translator: Иван Пешић, 2023
Language-Team: Serbian (https://app.transifex.com/nextcloud/teams/64236/sr/)
Content-Type: text/plain; charset=UTF-8
Language: sr
Plural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} фајл конфликт", "{count} фајл конфликта", "{count} фајл конфликта"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} фајл конфликт у {dirname}", "{count} фајл конфликта у {dirname}", "{count} фајл конфликта у {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["преостало је {seconds} секунди"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["{time} преостало"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["преостало је неколико секунди"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Обустави отпремања"] }, Continue: { msgid: "Continue", msgstr: ["Настави"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["процена преосталог времена"] }, "Existing version": { msgid: "Existing version", msgstr: ["Постојећа верзија"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Ако изаберете обе верзије, на име копираног фајла ће се додати број."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Није познат датум последње измене"] }, New: { msgid: "New", msgstr: ["Ново"] }, "New version": { msgid: "New version", msgstr: ["Нова верзија"] }, paused: { msgid: "paused", msgstr: ["паузирано"] }, "Preview image": { msgid: "Preview image", msgstr: ["Слика прегледа"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Штиклирај сва поља за штиклирање"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Изабери све постојеће фајлове"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Изабери све нове фајлове"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Прескочи овај фајл", "Прескочи {count} фајла", "Прескочи {count} фајлова"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Непозната величина"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Отпремање је отказано"] }, "Upload files": { msgid: "Upload files", msgstr: ["Отпреми фајлове"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["Напредак отпремања"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Које фајлове желите да задржите?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Морате да изаберете барем једну верзију сваког фајла да наставите."] } } } } }, { locale: "sr@latin", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Serbian (Latin) (https://www.transifex.com/nextcloud/teams/64236/sr@latin/)", "Content-Type": "text/plain; charset=UTF-8", Language: "sr@latin", "Plural-Forms": "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Serbian (Latin) (https://www.transifex.com/nextcloud/teams/64236/sr@latin/)
Content-Type: text/plain; charset=UTF-8
Language: sr@latin
Plural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "sv", json: { charset: "utf-8", headers: { "Last-Translator": "Magnus Höglund, 2024", "Language-Team": "Swedish (https://app.transifex.com/nextcloud/teams/64236/sv/)", "Content-Type": "text/plain; charset=UTF-8", Language: "sv", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Joas Schilling, 2024
Magnus Höglund, 2024
` }, msgstr: [`Last-Translator: Magnus Höglund, 2024
Language-Team: Swedish (https://app.transifex.com/nextcloud/teams/64236/sv/)
Content-Type: text/plain; charset=UTF-8
Language: sv
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} filkonflikt", "{count} filkonflikter"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} filkonflikt i {dirname}", "{count} filkonflikter i {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} sekunder kvarstår"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["{time} kvarstår"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["några sekunder kvar"] }, Cancel: { msgid: "Cancel", msgstr: ["Avbryt"] }, "Cancel the entire operation": { msgid: "Cancel the entire operation", msgstr: ["Avbryt hela operationen"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Avbryt uppladdningar"] }, Continue: { msgid: "Continue", msgstr: ["Fortsätt"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["uppskattar kvarstående tid"] }, "Existing version": { msgid: "Existing version", msgstr: ["Nuvarande version"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Om du väljer båda versionerna kommer den kopierade filen att få ett nummer tillagt  i namnet."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Senaste ändringsdatum okänt"] }, New: { msgid: "New", msgstr: ["Ny"] }, "New version": { msgid: "New version", msgstr: ["Ny version"] }, paused: { msgid: "paused", msgstr: ["pausad"] }, "Preview image": { msgid: "Preview image", msgstr: ["Förhandsgranska bild"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Markera alla kryssrutor"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Välj alla befintliga filer"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Välj alla nya filer"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Hoppa över denna fil", "Hoppa över {count} filer"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Okänd storlek"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Uppladdningen avbröts"] }, "Upload files": { msgid: "Upload files", msgstr: ["Ladda upp filer"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["Uppladdningsförlopp"] }, "When an incoming folder is selected, any conflicting files within it will also be overwritten.": { msgid: "When an incoming folder is selected, any conflicting files within it will also be overwritten.", msgstr: ["När en inkommande mapp väljs skrivs även alla konfliktande filer i den över."] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Vilka filer vill du behålla?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Du måste välja minst en version av varje fil för att fortsätta."] } } } } }, { locale: "sw", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Swahili (https://www.transifex.com/nextcloud/teams/64236/sw/)", "Content-Type": "text/plain; charset=UTF-8", Language: "sw", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Swahili (https://www.transifex.com/nextcloud/teams/64236/sw/)
Content-Type: text/plain; charset=UTF-8
Language: sw
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "ta", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Tamil (https://www.transifex.com/nextcloud/teams/64236/ta/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ta", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Tamil (https://www.transifex.com/nextcloud/teams/64236/ta/)
Content-Type: text/plain; charset=UTF-8
Language: ta
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "ta_LK", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Tamil (Sri-Lanka) (https://www.transifex.com/nextcloud/teams/64236/ta_LK/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ta_LK", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Tamil (Sri-Lanka) (https://www.transifex.com/nextcloud/teams/64236/ta_LK/)
Content-Type: text/plain; charset=UTF-8
Language: ta_LK
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "th", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Thai (https://www.transifex.com/nextcloud/teams/64236/th/)", "Content-Type": "text/plain; charset=UTF-8", Language: "th", "Plural-Forms": "nplurals=1; plural=0;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Thai (https://www.transifex.com/nextcloud/teams/64236/th/)
Content-Type: text/plain; charset=UTF-8
Language: th
Plural-Forms: nplurals=1; plural=0;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "th_TH", json: { charset: "utf-8", headers: { "Last-Translator": "Phongpanot Phairat <ppnplus@protonmail.com>, 2022", "Language-Team": "Thai (Thailand) (https://www.transifex.com/nextcloud/teams/64236/th_TH/)", "Content-Type": "text/plain; charset=UTF-8", Language: "th_TH", "Plural-Forms": "nplurals=1; plural=0;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Phongpanot Phairat <ppnplus@protonmail.com>, 2022
` }, msgstr: [`Last-Translator: Phongpanot Phairat <ppnplus@protonmail.com>, 2022
Language-Team: Thai (Thailand) (https://www.transifex.com/nextcloud/teams/64236/th_TH/)
Content-Type: text/plain; charset=UTF-8
Language: th_TH
Plural-Forms: nplurals=1; plural=0;
`] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["เหลืออีก {seconds} วินาที"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "time has the format 00:00:00" }, msgstr: ["เหลืออีก {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["เหลืออีกไม่กี่วินาที"] }, Add: { msgid: "Add", msgstr: ["เพิ่ม"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["ยกเลิกการอัปโหลด"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["กำลังคำนวณเวลาที่เหลือ"] }, paused: { msgid: "paused", msgstr: ["หยุดชั่วคราว"] }, "Upload files": { msgid: "Upload files", msgstr: ["อัปโหลดไฟล์"] } } } } }, { locale: "tk", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Turkmen (https://www.transifex.com/nextcloud/teams/64236/tk/)", "Content-Type": "text/plain; charset=UTF-8", Language: "tk", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Turkmen (https://www.transifex.com/nextcloud/teams/64236/tk/)
Content-Type: text/plain; charset=UTF-8
Language: tk
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "tr", json: { charset: "utf-8", headers: { "Last-Translator": "Kaya Zeren <kayazeren@gmail.com>, 2024", "Language-Team": "Turkish (https://app.transifex.com/nextcloud/teams/64236/tr/)", "Content-Type": "text/plain; charset=UTF-8", Language: "tr", "Plural-Forms": "nplurals=2; plural=(n > 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Joas Schilling, 2024
Kaya Zeren <kayazeren@gmail.com>, 2024
` }, msgstr: [`Last-Translator: Kaya Zeren <kayazeren@gmail.com>, 2024
Language-Team: Turkish (https://app.transifex.com/nextcloud/teams/64236/tr/)
Content-Type: text/plain; charset=UTF-8
Language: tr
Plural-Forms: nplurals=2; plural=(n > 1);
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} dosya çakışması var", "{count} dosya çakışması var"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{dirname} klasöründe {count} dosya çakışması var", "{dirname} klasöründe {count} dosya çakışması var"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["{seconds} saniye kaldı"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["{time} kaldı"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["bir kaç saniye kaldı"] }, Cancel: { msgid: "Cancel", msgstr: ["İptal"] }, "Cancel the entire operation": { msgid: "Cancel the entire operation", msgstr: ["Tüm işlemi iptal et"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Yüklemeleri iptal et"] }, Continue: { msgid: "Continue", msgstr: ["İlerle"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["öngörülen kalan süre"] }, "Existing version": { msgid: "Existing version", msgstr: ["Var olan sürüm"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["İki sürümü de seçerseniz, kopyalanan dosyanın adına bir sayı eklenir."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Son değiştirilme tarihi bilinmiyor"] }, New: { msgid: "New", msgstr: ["Yeni"] }, "New version": { msgid: "New version", msgstr: ["Yeni sürüm"] }, paused: { msgid: "paused", msgstr: ["duraklatıldı"] }, "Preview image": { msgid: "Preview image", msgstr: ["Görsel ön izlemesi"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Tüm kutuları işaretle"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Tüm var olan dosyaları seç"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Tüm yeni dosyaları seç"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Bu dosyayı atla", "{count} dosyayı atla"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Boyut bilinmiyor"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Yükleme iptal edildi"] }, "Upload files": { msgid: "Upload files", msgstr: ["Dosyaları yükle"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["Yükleme ilerlemesi"] }, "When an incoming folder is selected, any conflicting files within it will also be overwritten.": { msgid: "When an incoming folder is selected, any conflicting files within it will also be overwritten.", msgstr: ["Bir gelen klasör seçildiğinde, içindeki çakışan dosyaların da üzerine yazılır."] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Hangi dosyaları tutmak istiyorsunuz?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["İlerlemek için her dosyanın en az bir sürümünü seçmelisiniz."] } } } } }, { locale: "ug", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Uyghur (https://www.transifex.com/nextcloud/teams/64236/ug/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ug", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Uyghur (https://www.transifex.com/nextcloud/teams/64236/ug/)
Content-Type: text/plain; charset=UTF-8
Language: ug
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "uk", json: { charset: "utf-8", headers: { "Last-Translator": "O St <oleksiy.stasevych@gmail.com>, 2024", "Language-Team": "Ukrainian (https://app.transifex.com/nextcloud/teams/64236/uk/)", "Content-Type": "text/plain; charset=UTF-8", Language: "uk", "Plural-Forms": "nplurals=4; plural=(n % 1 == 0 && n % 10 == 1 && n % 100 != 11 ? 0 : n % 1 == 0 && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 1 : n % 1 == 0 && (n % 10 ==0 || (n % 10 >=5 && n % 10 <=9) || (n % 100 >=11 && n % 100 <=14 )) ? 2: 3);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Joas Schilling, 2024
O St <oleksiy.stasevych@gmail.com>, 2024
` }, msgstr: [`Last-Translator: O St <oleksiy.stasevych@gmail.com>, 2024
Language-Team: Ukrainian (https://app.transifex.com/nextcloud/teams/64236/uk/)
Content-Type: text/plain; charset=UTF-8
Language: uk
Plural-Forms: nplurals=4; plural=(n % 1 == 0 && n % 10 == 1 && n % 100 != 11 ? 0 : n % 1 == 0 && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 1 : n % 1 == 0 && (n % 10 ==0 || (n % 10 >=5 && n % 10 <=9) || (n % 100 >=11 && n % 100 <=14 )) ? 2: 3);
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} конфліктний файл", "{count} конфліктних файли", "{count} конфліктних файлів", "{count} конфліктних файлів"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} конфліктний файл у каталозі {dirname}", "{count} конфліктних файли у каталозі {dirname}", "{count} конфліктних файлів у каталозі {dirname}", "{count} конфліктних файлів у каталозі {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["Залишилося {seconds} секунд"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["Залишилося {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["залишилося кілька секунд"] }, Cancel: { msgid: "Cancel", msgstr: ["Скасувати"] }, "Cancel the entire operation": { msgid: "Cancel the entire operation", msgstr: ["Скасувати операцію повністю"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Скасувати завантаження"] }, Continue: { msgid: "Continue", msgstr: ["Продовжити"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["оцінка часу, що залишився"] }, "Existing version": { msgid: "Existing version", msgstr: ["Присутня версія"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Якщо ви виберете обидві версії, то буде створено копію файлу, до назви якої буде додано цифру."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Дата останньої зміни невідома"] }, New: { msgid: "New", msgstr: ["Нове"] }, "New version": { msgid: "New version", msgstr: ["Нова версія"] }, paused: { msgid: "paused", msgstr: ["призупинено"] }, "Preview image": { msgid: "Preview image", msgstr: ["Попередній перегляд"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Вибрати все"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Вибрати усі присутні файли"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Вибрати усі нові файли"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Пропустити файл", "Пропустити {count} файли", "Пропустити {count} файлів", "Пропустити {count} файлів"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Невідомий розмір"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Завантаження скасовано"] }, "Upload files": { msgid: "Upload files", msgstr: ["Завантажити файли"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["Поступ завантаження"] }, "When an incoming folder is selected, any conflicting files within it will also be overwritten.": { msgid: "When an incoming folder is selected, any conflicting files within it will also be overwritten.", msgstr: ["Усі конфліктні файли у вибраному каталозі призначення буде перезаписано поверх."] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Які файли залишити?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Для продовження потрібно вибрати принаймні одну версію для кожного файлу."] } } } } }, { locale: "ur_PK", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Urdu (Pakistan) (https://www.transifex.com/nextcloud/teams/64236/ur_PK/)", "Content-Type": "text/plain; charset=UTF-8", Language: "ur_PK", "Plural-Forms": "nplurals=2; plural=(n != 1);" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Urdu (Pakistan) (https://www.transifex.com/nextcloud/teams/64236/ur_PK/)
Content-Type: text/plain; charset=UTF-8
Language: ur_PK
Plural-Forms: nplurals=2; plural=(n != 1);
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "uz", json: { charset: "utf-8", headers: { "Last-Translator": "Transifex Bot <>, 2022", "Language-Team": "Uzbek (https://www.transifex.com/nextcloud/teams/64236/uz/)", "Content-Type": "text/plain; charset=UTF-8", Language: "uz", "Plural-Forms": "nplurals=1; plural=0;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Transifex Bot <>, 2022
` }, msgstr: [`Last-Translator: Transifex Bot <>, 2022
Language-Team: Uzbek (https://www.transifex.com/nextcloud/teams/64236/uz/)
Content-Type: text/plain; charset=UTF-8
Language: uz
Plural-Forms: nplurals=1; plural=0;
`] }, "{estimate} seconds left": { msgid: "{estimate} seconds left", msgstr: [""] }, "{hours} hours and {minutes} minutes left": { msgid: "{hours} hours and {minutes} minutes left", msgstr: [""] }, "{minutes} minutes left": { msgid: "{minutes} minutes left", msgstr: [""] }, "a few seconds left": { msgid: "a few seconds left", msgstr: [""] }, Add: { msgid: "Add", msgstr: [""] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: [""] }, "estimating time left": { msgid: "estimating time left", msgstr: [""] }, paused: { msgid: "paused", msgstr: [""] } } } } }, { locale: "vi", json: { charset: "utf-8", headers: { "Last-Translator": "Tung DangQuang, 2023", "Language-Team": "Vietnamese (https://app.transifex.com/nextcloud/teams/64236/vi/)", "Content-Type": "text/plain; charset=UTF-8", Language: "vi", "Plural-Forms": "nplurals=1; plural=0;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
John Molakvoæ <skjnldsv@protonmail.com>, 2023
Tung DangQuang, 2023
` }, msgstr: [`Last-Translator: Tung DangQuang, 2023
Language-Team: Vietnamese (https://app.transifex.com/nextcloud/teams/64236/vi/)
Content-Type: text/plain; charset=UTF-8
Language: vi
Plural-Forms: nplurals=1; plural=0;
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} Tập tin xung đột"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{count} tập tin lỗi trong {dirname}"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["Còn {second} giây"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["Còn lại {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["Còn lại một vài giây"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["Huỷ tải lên"] }, Continue: { msgid: "Continue", msgstr: ["Tiếp Tục"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["Thời gian còn lại dự kiến"] }, "Existing version": { msgid: "Existing version", msgstr: ["Phiên Bản Hiện Tại"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["Nếu bạn chọn cả hai phiên bản, tệp được sao chép sẽ có thêm một số vào tên của nó."] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["Ngày sửa dổi lần cuối không xác định"] }, New: { msgid: "New", msgstr: ["Tạo Mới"] }, "New version": { msgid: "New version", msgstr: ["Phiên Bản Mới"] }, paused: { msgid: "paused", msgstr: ["đã tạm dừng"] }, "Preview image": { msgid: "Preview image", msgstr: ["Xem Trước Ảnh"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["Chọn tất cả hộp checkbox"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["Chọn tất cả các tập tin có sẵn"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["Chọn tất cả các tập tin mới"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["Bỏ Qua {count} tập tin"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["Không rõ dung lượng"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["Dừng Tải Lên"] }, "Upload files": { msgid: "Upload files", msgstr: ["Tập tin tải lên"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["Đang Tải Lên"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["Bạn muốn giữ tập tin nào?"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["Bạn cần chọn ít nhất một phiên bản tập tin mới có thể tiếp tục"] } } } } }, { locale: "zh_CN", json: { charset: "utf-8", headers: { "Last-Translator": "Hongbo Chen, 2023", "Language-Team": "Chinese (China) (https://app.transifex.com/nextcloud/teams/64236/zh_CN/)", "Content-Type": "text/plain; charset=UTF-8", Language: "zh_CN", "Plural-Forms": "nplurals=1; plural=0;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
John Molakvoæ <skjnldsv@protonmail.com>, 2023
Hongbo Chen, 2023
` }, msgstr: [`Last-Translator: Hongbo Chen, 2023
Language-Team: Chinese (China) (https://app.transifex.com/nextcloud/teams/64236/zh_CN/)
Content-Type: text/plain; charset=UTF-8
Language: zh_CN
Plural-Forms: nplurals=1; plural=0;
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count}文件冲突"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["在{dirname}目录下有{count}个文件冲突"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["剩余 {seconds} 秒"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["剩余 {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["还剩几秒"] }, Add: { msgid: "Add", msgstr: ["添加"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["取消上传"] }, Continue: { msgid: "Continue", msgstr: ["继续"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["估计剩余时间"] }, "Existing version": { msgid: "Existing version", msgstr: ["版本已存在"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["如果选择所有的版本，新增版本的文件名为原文件名加数字"] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["文件最后修改日期未知"] }, "New version": { msgid: "New version", msgstr: ["新版本"] }, paused: { msgid: "paused", msgstr: ["已暂停"] }, "Preview image": { msgid: "Preview image", msgstr: ["图片预览"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["选择所有的选择框"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["选择所有存在的文件"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["选择所有的新文件"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["跳过{count}个文件"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["文件大小未知"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["取消上传"] }, "Upload files": { msgid: "Upload files", msgstr: ["上传文件"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["你要保留哪些文件？"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["每个文件至少选择一个版本"] } } } } }, { locale: "zh_HK", json: { charset: "utf-8", headers: { "Last-Translator": "Café Tango, 2023", "Language-Team": "Chinese (Hong Kong) (https://app.transifex.com/nextcloud/teams/64236/zh_HK/)", "Content-Type": "text/plain; charset=UTF-8", Language: "zh_HK", "Plural-Forms": "nplurals=1; plural=0;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
John Molakvoæ <skjnldsv@protonmail.com>, 2023
Café Tango, 2023
` }, msgstr: [`Last-Translator: Café Tango, 2023
Language-Team: Chinese (Hong Kong) (https://app.transifex.com/nextcloud/teams/64236/zh_HK/)
Content-Type: text/plain; charset=UTF-8
Language: zh_HK
Plural-Forms: nplurals=1; plural=0;
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} 個檔案衝突"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{dirname} 中有 {count} 個檔案衝突"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["剩餘 {seconds} 秒"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["剩餘 {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["還剩幾秒"] }, Add: { msgid: "Add", msgstr: ["添加"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["取消上傳"] }, Continue: { msgid: "Continue", msgstr: ["繼續"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["估計剩餘時間"] }, "Existing version": { msgid: "Existing version", msgstr: ["既有版本"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["若您選取兩個版本，複製的檔案的名稱將會新增編號。"] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["最後修改日期不詳"] }, "New version": { msgid: "New version", msgstr: ["新版本 "] }, paused: { msgid: "paused", msgstr: ["已暫停"] }, "Preview image": { msgid: "Preview image", msgstr: ["預覽圖片"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["選取所有核取方塊"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["選取所有既有檔案"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["選取所有新檔案"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["略過 {count} 個檔案"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["大小不詳"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["已取消上傳"] }, "Upload files": { msgid: "Upload files", msgstr: ["上傳檔案"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["您想保留哪些檔案？"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["您必須為每個檔案都至少選取一個版本以繼續。"] } } } } }, { locale: "zh_TW", json: { charset: "utf-8", headers: { "Last-Translator": "黃柏諺 <s8321414@gmail.com>, 2024", "Language-Team": "Chinese (Taiwan) (https://app.transifex.com/nextcloud/teams/64236/zh_TW/)", "Content-Type": "text/plain; charset=UTF-8", Language: "zh_TW", "Plural-Forms": "nplurals=1; plural=0;" }, translations: { "": { "": { msgid: "", comments: { translator: `
Translators:
Joas Schilling, 2024
黃柏諺 <s8321414@gmail.com>, 2024
` }, msgstr: [`Last-Translator: 黃柏諺 <s8321414@gmail.com>, 2024
Language-Team: Chinese (Taiwan) (https://app.transifex.com/nextcloud/teams/64236/zh_TW/)
Content-Type: text/plain; charset=UTF-8
Language: zh_TW
Plural-Forms: nplurals=1; plural=0;
`] }, "{count} file conflict": { msgid: "{count} file conflict", msgid_plural: "{count} files conflict", msgstr: ["{count} 個檔案衝突"] }, "{count} file conflict in {dirname}": { msgid: "{count} file conflict in {dirname}", msgid_plural: "{count} file conflicts in {dirname}", msgstr: ["{dirname} 中有 {count} 個檔案衝突"] }, "{seconds} seconds left": { msgid: "{seconds} seconds left", msgstr: ["剩餘 {seconds} 秒"] }, "{time} left": { msgid: "{time} left", comments: { extracted: "TRANSLATORS time has the format 00:00:00" }, msgstr: ["剩餘 {time}"] }, "a few seconds left": { msgid: "a few seconds left", msgstr: ["還剩幾秒"] }, Cancel: { msgid: "Cancel", msgstr: ["取消"] }, "Cancel the entire operation": { msgid: "Cancel the entire operation", msgstr: ["取消整個操作"] }, "Cancel uploads": { msgid: "Cancel uploads", msgstr: ["取消上傳"] }, Continue: { msgid: "Continue", msgstr: ["繼續"] }, "estimating time left": { msgid: "estimating time left", msgstr: ["估計剩餘時間"] }, "Existing version": { msgid: "Existing version", msgstr: ["既有版本"] }, "If you select both versions, the copied file will have a number added to its name.": { msgid: "If you select both versions, the copied file will have a number added to its name.", msgstr: ["若您選取兩個版本，複製的檔案的名稱將會新增編號。"] }, "Last modified date unknown": { msgid: "Last modified date unknown", msgstr: ["最後修改日期未知"] }, New: { msgid: "New", msgstr: ["新增"] }, "New version": { msgid: "New version", msgstr: ["新版本"] }, paused: { msgid: "paused", msgstr: ["已暫停"] }, "Preview image": { msgid: "Preview image", msgstr: ["預覽圖片"] }, "Select all checkboxes": { msgid: "Select all checkboxes", msgstr: ["選取所有核取方塊"] }, "Select all existing files": { msgid: "Select all existing files", msgstr: ["選取所有既有檔案"] }, "Select all new files": { msgid: "Select all new files", msgstr: ["選取所有新檔案"] }, "Skip this file": { msgid: "Skip this file", msgid_plural: "Skip {count} files", msgstr: ["略過 {count} 檔案"] }, "Unknown size": { msgid: "Unknown size", msgstr: ["未知大小"] }, "Upload cancelled": { msgid: "Upload cancelled", msgstr: ["已取消上傳"] }, "Upload files": { msgid: "Upload files", msgstr: ["上傳檔案"] }, "Upload progress": { msgid: "Upload progress", msgstr: ["上傳進度"] }, "When an incoming folder is selected, any conflicting files within it will also be overwritten.": { msgid: "When an incoming folder is selected, any conflicting files within it will also be overwritten.", msgstr: ["選取傳入資料夾後，其中任何的衝突檔案都會被覆寫。"] }, "Which files do you want to keep?": { msgid: "Which files do you want to keep?", msgstr: ["您想保留哪些檔案？"] }, "You need to select at least one version of each file to continue.": { msgid: "You need to select at least one version of each file to continue.", msgstr: ["您必須為每個檔案都至少選取一個版本以繼續。"] } } } } }].map((e) => R.addTranslation(e.locale, e.json));
const C = R.build(), Gs = C.ngettext.bind(C), u = C.gettext.bind(C), Ls = vue__WEBPACK_IMPORTED_MODULE_18__["default"].extend({
  name: "UploadPicker",
  components: {
    Cancel: ms,
    NcActionButton: _nextcloud_vue_dist_Components_NcActionButton_js__WEBPACK_IMPORTED_MODULE_10__["default"],
    NcActions: _nextcloud_vue_dist_Components_NcActions_js__WEBPACK_IMPORTED_MODULE_11__["default"],
    NcButton: _nextcloud_vue_dist_Components_NcButton_js__WEBPACK_IMPORTED_MODULE_12__["default"],
    NcIconSvgWrapper: _nextcloud_vue_dist_Components_NcIconSvgWrapper_js__WEBPACK_IMPORTED_MODULE_13__["default"],
    NcProgressBar: _nextcloud_vue_dist_Components_NcProgressBar_js__WEBPACK_IMPORTED_MODULE_14__["default"],
    Plus: fs,
    Upload: xs
  },
  props: {
    accept: {
      type: Array,
      default: null
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    multiple: {
      type: Boolean,
      default: !1
    },
    destination: {
      type: _nextcloud_files__WEBPACK_IMPORTED_MODULE_2__.Folder,
      default: void 0
    },
    /**
     * List of file present in the destination folder
     */
    content: {
      type: Array,
      default: () => []
    },
    forbiddenCharacters: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      addLabel: u("New"),
      cancelLabel: u("Cancel uploads"),
      uploadLabel: u("Upload files"),
      progressLabel: u("Upload progress"),
      progressTimeId: `nc-uploader-progress-${Math.random().toString(36).slice(7)}`,
      eta: null,
      timeLeft: "",
      newFileMenuEntries: [],
      uploadManager: M()
    };
  },
  computed: {
    totalQueueSize() {
      return this.uploadManager.info?.size || 0;
    },
    uploadedQueueSize() {
      return this.uploadManager.info?.progress || 0;
    },
    progress() {
      return Math.round(this.uploadedQueueSize / this.totalQueueSize * 100) || 0;
    },
    queue() {
      return this.uploadManager.queue;
    },
    hasFailure() {
      return this.queue?.filter((e) => e.status === c.FAILED).length !== 0;
    },
    isUploading() {
      return this.queue?.length > 0;
    },
    isAssembling() {
      return this.queue?.filter((e) => e.status === c.ASSEMBLING).length !== 0;
    },
    isPaused() {
      return this.uploadManager.info?.status === I.PAUSED;
    },
    // Hide the button text if we're uploading
    buttonName() {
      if (!this.isUploading)
        return this.addLabel;
    }
  },
  watch: {
    destination(e) {
      this.setDestination(e);
    },
    totalQueueSize(e) {
      this.eta = simple_eta__WEBPACK_IMPORTED_MODULE_9__({ min: 0, max: e }), this.updateStatus();
    },
    uploadedQueueSize(e) {
      this.eta?.report?.(e), this.updateStatus();
    },
    isPaused(e) {
      e ? this.$emit("paused", this.queue) : this.$emit("resumed", this.queue);
    }
  },
  beforeMount() {
    this.destination && this.setDestination(this.destination), this.uploadManager.addNotifier(this.onUploadCompletion), g.debug("UploadPicker initialised");
  },
  methods: {
    /**
     * Trigger file picker
     */
    onClick() {
      this.$refs.input.click();
    },
    /**
     * Start uploading
     */
    async onPick() {
      let e = [...this.$refs.input.files];
      if (Us(e, this.content)) {
        const s = e.filter((n) => this.content.find((i) => i.basename === n.name)).filter(Boolean), t = e.filter((n) => !s.includes(n));
        try {
          const { selected: n, renamed: i } = await ys(this.destination.basename, s, this.content);
          e = [...t, ...n, ...i];
        } catch {
          (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_8__.showError)(u("Upload cancelled"));
          return;
        }
      }
      e.forEach((s) => {
        const n = (this.forbiddenCharacters || []).find((i) => s.name.includes(i));
        n ? (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_8__.showError)(u(`"${n}" is not allowed inside a file name.`)) : this.uploadManager.upload(s.name, s).catch(() => {
        });
      }), this.$refs.form.reset();
    },
    /**
     * Cancel ongoing queue
     */
    onCancel() {
      this.uploadManager.queue.forEach((e) => {
        e.cancel();
      }), this.$refs.form.reset();
    },
    updateStatus() {
      if (this.isPaused) {
        this.timeLeft = u("paused");
        return;
      }
      const e = Math.round(this.eta.estimate());
      if (e === 1 / 0) {
        this.timeLeft = u("estimating time left");
        return;
      }
      if (e < 10) {
        this.timeLeft = u("a few seconds left");
        return;
      }
      if (e > 60) {
        const s = /* @__PURE__ */ new Date(0);
        s.setSeconds(e);
        const t = s.toISOString().slice(11, 19);
        this.timeLeft = u("{time} left", { time: t });
        return;
      }
      this.timeLeft = u("{seconds} seconds left", { seconds: e });
    },
    setDestination(e) {
      if (!this.destination) {
        g.debug("Invalid destination");
        return;
      }
      this.uploadManager.destination = e, this.newFileMenuEntries = (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_2__.getNewFileMenuEntries)(e);
    },
    onUploadCompletion(e) {
      e.status === c.FAILED ? this.$emit("failed", e) : this.$emit("uploaded", e);
    }
  }
});
var ks = function() {
  var s = this, t = s._self._c;
  return s._self._setupProxy, s.destination ? t("form", { ref: "form", staticClass: "upload-picker", class: { "upload-picker--uploading": s.isUploading, "upload-picker--paused": s.isPaused }, attrs: { "data-cy-upload-picker": "" } }, [s.newFileMenuEntries && s.newFileMenuEntries.length === 0 ? t("NcButton", { attrs: { disabled: s.disabled, "data-cy-upload-picker-add": "", type: "secondary" }, on: { click: s.onClick }, scopedSlots: s._u([{ key: "icon", fn: function() {
    return [t("Plus", { attrs: { title: "", size: 20, decorative: "" } })];
  }, proxy: !0 }], null, !1, 2954875042) }, [s._v(" " + s._s(s.buttonName) + " ")]) : t("NcActions", { attrs: { "menu-name": s.buttonName, "menu-title": s.addLabel, type: "secondary" }, scopedSlots: s._u([{ key: "icon", fn: function() {
    return [t("Plus", { attrs: { title: "", size: 20, decorative: "" } })];
  }, proxy: !0 }], null, !1, 2954875042) }, [t("NcActionButton", { attrs: { "data-cy-upload-picker-add": "", "close-after-click": !0 }, on: { click: s.onClick }, scopedSlots: s._u([{ key: "icon", fn: function() {
    return [t("Upload", { attrs: { title: "", size: 20, decorative: "" } })];
  }, proxy: !0 }], null, !1, 3606034491) }, [s._v(" " + s._s(s.uploadLabel) + " ")]), s._l(s.newFileMenuEntries, function(n) {
    return t("NcActionButton", { key: n.id, staticClass: "upload-picker__menu-entry", attrs: { icon: n.iconClass, "close-after-click": !0 }, on: { click: function(i) {
      return n.handler(s.destination, s.content);
    } }, scopedSlots: s._u([n.iconSvgInline ? { key: "icon", fn: function() {
      return [t("NcIconSvgWrapper", { attrs: { svg: n.iconSvgInline } })];
    }, proxy: !0 } : null], null, !0) }, [s._v(" " + s._s(n.displayName) + " ")]);
  })], 2), t("div", { directives: [{ name: "show", rawName: "v-show", value: s.isUploading, expression: "isUploading" }], staticClass: "upload-picker__progress" }, [t("NcProgressBar", { attrs: { "aria-label": s.progressLabel, "aria-describedby": s.progressTimeId, error: s.hasFailure, value: s.progress, size: "medium" } }), t("p", { attrs: { id: s.progressTimeId } }, [s._v(" " + s._s(s.timeLeft) + " ")])], 1), s.isUploading ? t("NcButton", { staticClass: "upload-picker__cancel", attrs: { type: "tertiary", "aria-label": s.cancelLabel, "data-cy-upload-picker-cancel": "" }, on: { click: s.onCancel }, scopedSlots: s._u([{ key: "icon", fn: function() {
    return [t("Cancel", { attrs: { title: "", size: 20 } })];
  }, proxy: !0 }], null, !1, 4076886712) }) : s._e(), t("input", { directives: [{ name: "show", rawName: "v-show", value: !1, expression: "false" }], ref: "input", attrs: { type: "file", accept: s.accept?.join?.(", "), multiple: s.multiple, "data-cy-upload-picker-input": "" }, on: { change: s.onPick } })], 1) : s._e();
}, vs = [], Cs = /* @__PURE__ */ y(
  Ls,
  ks,
  vs,
  !1,
  null,
  "eca9500a",
  null,
  null
);
const Ys = Cs.exports;
let k = null;
function M() {
  const e = document.querySelector('input[name="isPublic"][value="1"]') !== null;
  return k instanceof N || (k = new N(e)), k;
}
function Vs(e, s) {
  const t = M();
  return t.upload(e, s), t;
}
async function ys(e, s, t) {
  const n = (0,vue__WEBPACK_IMPORTED_MODULE_18__.defineAsyncComponent)(() => Promise.all(/*! import() */[__webpack_require__.e("core-common"), __webpack_require__.e("node_modules_nextcloud_upload_dist_chunks_ConflictPicker-Bif6rCp6_mjs")]).then(__webpack_require__.bind(__webpack_require__, /*! ./ConflictPicker-Bif6rCp6.mjs */ "./node_modules/@nextcloud/upload/dist/chunks/ConflictPicker-Bif6rCp6.mjs")));
  return new Promise((i, o) => {
    const l = new vue__WEBPACK_IMPORTED_MODULE_18__["default"]({
      name: "ConflictPickerRoot",
      render: (f) => f(n, {
        props: {
          dirname: e,
          conflicts: s,
          content: t
        },
        on: {
          submit(r) {
            i(r), l.$destroy(), l.$el?.parentNode?.removeChild(l.$el);
          },
          cancel(r) {
            o(r ?? new Error("Canceled")), l.$destroy(), l.$el?.parentNode?.removeChild(l.$el);
          }
        }
      })
    });
    l.$mount(), document.body.appendChild(l.$el);
  });
}
function Us(e, s) {
  const t = s.map((i) => i.basename);
  return e.filter((i) => {
    const o = i instanceof File ? i.name : i.basename;
    return t.indexOf(o) !== -1;
  }).length > 0;
}



/***/ }),

/***/ "./node_modules/@nextcloud/upload/dist/index.mjs":
/*!*******************************************************!*\
  !*** ./node_modules/@nextcloud/upload/dist/index.mjs ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Upload: () => (/* reexport safe */ _chunks_index_DM2X1kc6_mjs__WEBPACK_IMPORTED_MODULE_0__.b),
/* harmony export */   UploadPicker: () => (/* reexport safe */ _chunks_index_DM2X1kc6_mjs__WEBPACK_IMPORTED_MODULE_0__.U),
/* harmony export */   UploadStatus: () => (/* reexport safe */ _chunks_index_DM2X1kc6_mjs__WEBPACK_IMPORTED_MODULE_0__.c),
/* harmony export */   UploaderStatus: () => (/* reexport safe */ _chunks_index_DM2X1kc6_mjs__WEBPACK_IMPORTED_MODULE_0__.S),
/* harmony export */   getUploader: () => (/* reexport safe */ _chunks_index_DM2X1kc6_mjs__WEBPACK_IMPORTED_MODULE_0__.g),
/* harmony export */   hasConflict: () => (/* reexport safe */ _chunks_index_DM2X1kc6_mjs__WEBPACK_IMPORTED_MODULE_0__.h),
/* harmony export */   openConflictPicker: () => (/* reexport safe */ _chunks_index_DM2X1kc6_mjs__WEBPACK_IMPORTED_MODULE_0__.o),
/* harmony export */   upload: () => (/* reexport safe */ _chunks_index_DM2X1kc6_mjs__WEBPACK_IMPORTED_MODULE_0__.u)
/* harmony export */ });
/* harmony import */ var _chunks_index_DM2X1kc6_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chunks/index-DM2X1kc6.mjs */ "./node_modules/@nextcloud/upload/dist/chunks/index-DM2X1kc6.mjs");





/***/ }),

/***/ "./node_modules/@nextcloud/upload/node_modules/eventemitter3/index.mjs":
/*!*****************************************************************************!*\
  !*** ./node_modules/@nextcloud/upload/node_modules/eventemitter3/index.mjs ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventEmitter: () => (/* reexport default export from named module */ _index_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./node_modules/@nextcloud/upload/node_modules/eventemitter3/index.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_index_js__WEBPACK_IMPORTED_MODULE_0__);


/***/ }),

/***/ "./node_modules/@nextcloud/upload/node_modules/p-queue/dist/index.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@nextcloud/upload/node_modules/p-queue/dist/index.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PQueue)
/* harmony export */ });
/* harmony import */ var eventemitter3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! eventemitter3 */ "./node_modules/@nextcloud/upload/node_modules/eventemitter3/index.mjs");
/* harmony import */ var p_timeout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! p-timeout */ "./node_modules/@nextcloud/upload/node_modules/p-timeout/index.js");
/* harmony import */ var _priority_queue_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./priority-queue.js */ "./node_modules/@nextcloud/upload/node_modules/p-queue/dist/priority-queue.js");



/**
Promise queue with concurrency control.
*/
class PQueue extends eventemitter3__WEBPACK_IMPORTED_MODULE_0__.EventEmitter {
    #carryoverConcurrencyCount;
    #isIntervalIgnored;
    #intervalCount = 0;
    #intervalCap;
    #interval;
    #intervalEnd = 0;
    #intervalId;
    #timeoutId;
    #queue;
    #queueClass;
    #pending = 0;
    // The `!` is needed because of https://github.com/microsoft/TypeScript/issues/32194
    #concurrency;
    #isPaused;
    #throwOnTimeout;
    /**
    Per-operation timeout in milliseconds. Operations fulfill once `timeout` elapses if they haven't already.

    Applies to each future operation.
    */
    timeout;
    // TODO: The `throwOnTimeout` option should affect the return types of `add()` and `addAll()`
    constructor(options) {
        super();
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        options = {
            carryoverConcurrencyCount: false,
            intervalCap: Number.POSITIVE_INFINITY,
            interval: 0,
            concurrency: Number.POSITIVE_INFINITY,
            autoStart: true,
            queueClass: _priority_queue_js__WEBPACK_IMPORTED_MODULE_2__["default"],
            ...options,
        };
        if (!(typeof options.intervalCap === 'number' && options.intervalCap >= 1)) {
            throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${options.intervalCap?.toString() ?? ''}\` (${typeof options.intervalCap})`);
        }
        if (options.interval === undefined || !(Number.isFinite(options.interval) && options.interval >= 0)) {
            throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${options.interval?.toString() ?? ''}\` (${typeof options.interval})`);
        }
        this.#carryoverConcurrencyCount = options.carryoverConcurrencyCount;
        this.#isIntervalIgnored = options.intervalCap === Number.POSITIVE_INFINITY || options.interval === 0;
        this.#intervalCap = options.intervalCap;
        this.#interval = options.interval;
        this.#queue = new options.queueClass();
        this.#queueClass = options.queueClass;
        this.concurrency = options.concurrency;
        this.timeout = options.timeout;
        this.#throwOnTimeout = options.throwOnTimeout === true;
        this.#isPaused = options.autoStart === false;
    }
    get #doesIntervalAllowAnother() {
        return this.#isIntervalIgnored || this.#intervalCount < this.#intervalCap;
    }
    get #doesConcurrentAllowAnother() {
        return this.#pending < this.#concurrency;
    }
    #next() {
        this.#pending--;
        this.#tryToStartAnother();
        this.emit('next');
    }
    #onResumeInterval() {
        this.#onInterval();
        this.#initializeIntervalIfNeeded();
        this.#timeoutId = undefined;
    }
    get #isIntervalPaused() {
        const now = Date.now();
        if (this.#intervalId === undefined) {
            const delay = this.#intervalEnd - now;
            if (delay < 0) {
                // Act as the interval was done
                // We don't need to resume it here because it will be resumed on line 160
                this.#intervalCount = (this.#carryoverConcurrencyCount) ? this.#pending : 0;
            }
            else {
                // Act as the interval is pending
                if (this.#timeoutId === undefined) {
                    this.#timeoutId = setTimeout(() => {
                        this.#onResumeInterval();
                    }, delay);
                }
                return true;
            }
        }
        return false;
    }
    #tryToStartAnother() {
        if (this.#queue.size === 0) {
            // We can clear the interval ("pause")
            // Because we can redo it later ("resume")
            if (this.#intervalId) {
                clearInterval(this.#intervalId);
            }
            this.#intervalId = undefined;
            this.emit('empty');
            if (this.#pending === 0) {
                this.emit('idle');
            }
            return false;
        }
        if (!this.#isPaused) {
            const canInitializeInterval = !this.#isIntervalPaused;
            if (this.#doesIntervalAllowAnother && this.#doesConcurrentAllowAnother) {
                const job = this.#queue.dequeue();
                if (!job) {
                    return false;
                }
                this.emit('active');
                job();
                if (canInitializeInterval) {
                    this.#initializeIntervalIfNeeded();
                }
                return true;
            }
        }
        return false;
    }
    #initializeIntervalIfNeeded() {
        if (this.#isIntervalIgnored || this.#intervalId !== undefined) {
            return;
        }
        this.#intervalId = setInterval(() => {
            this.#onInterval();
        }, this.#interval);
        this.#intervalEnd = Date.now() + this.#interval;
    }
    #onInterval() {
        if (this.#intervalCount === 0 && this.#pending === 0 && this.#intervalId) {
            clearInterval(this.#intervalId);
            this.#intervalId = undefined;
        }
        this.#intervalCount = this.#carryoverConcurrencyCount ? this.#pending : 0;
        this.#processQueue();
    }
    /**
    Executes all queued functions until it reaches the limit.
    */
    #processQueue() {
        // eslint-disable-next-line no-empty
        while (this.#tryToStartAnother()) { }
    }
    get concurrency() {
        return this.#concurrency;
    }
    set concurrency(newConcurrency) {
        if (!(typeof newConcurrency === 'number' && newConcurrency >= 1)) {
            throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
        }
        this.#concurrency = newConcurrency;
        this.#processQueue();
    }
    async #throwOnAbort(signal) {
        return new Promise((_resolve, reject) => {
            signal.addEventListener('abort', () => {
                reject(signal.reason);
            }, { once: true });
        });
    }
    async add(function_, options = {}) {
        options = {
            timeout: this.timeout,
            throwOnTimeout: this.#throwOnTimeout,
            ...options,
        };
        return new Promise((resolve, reject) => {
            this.#queue.enqueue(async () => {
                this.#pending++;
                this.#intervalCount++;
                try {
                    options.signal?.throwIfAborted();
                    let operation = function_({ signal: options.signal });
                    if (options.timeout) {
                        operation = (0,p_timeout__WEBPACK_IMPORTED_MODULE_1__["default"])(Promise.resolve(operation), { milliseconds: options.timeout });
                    }
                    if (options.signal) {
                        operation = Promise.race([operation, this.#throwOnAbort(options.signal)]);
                    }
                    const result = await operation;
                    resolve(result);
                    this.emit('completed', result);
                }
                catch (error) {
                    if (error instanceof p_timeout__WEBPACK_IMPORTED_MODULE_1__.TimeoutError && !options.throwOnTimeout) {
                        resolve();
                        return;
                    }
                    reject(error);
                    this.emit('error', error);
                }
                finally {
                    this.#next();
                }
            }, options);
            this.emit('add');
            this.#tryToStartAnother();
        });
    }
    async addAll(functions, options) {
        return Promise.all(functions.map(async (function_) => this.add(function_, options)));
    }
    /**
    Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
    */
    start() {
        if (!this.#isPaused) {
            return this;
        }
        this.#isPaused = false;
        this.#processQueue();
        return this;
    }
    /**
    Put queue execution on hold.
    */
    pause() {
        this.#isPaused = true;
    }
    /**
    Clear the queue.
    */
    clear() {
        this.#queue = new this.#queueClass();
    }
    /**
    Can be called multiple times. Useful if you for example add additional items at a later time.

    @returns A promise that settles when the queue becomes empty.
    */
    async onEmpty() {
        // Instantly resolve if the queue is empty
        if (this.#queue.size === 0) {
            return;
        }
        await this.#onEvent('empty');
    }
    /**
    @returns A promise that settles when the queue size is less than the given limit: `queue.size < limit`.

    If you want to avoid having the queue grow beyond a certain size you can `await queue.onSizeLessThan()` before adding a new item.

    Note that this only limits the number of items waiting to start. There could still be up to `concurrency` jobs already running that this call does not include in its calculation.
    */
    async onSizeLessThan(limit) {
        // Instantly resolve if the queue is empty.
        if (this.#queue.size < limit) {
            return;
        }
        await this.#onEvent('next', () => this.#queue.size < limit);
    }
    /**
    The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.

    @returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
    */
    async onIdle() {
        // Instantly resolve if none pending and if nothing else is queued
        if (this.#pending === 0 && this.#queue.size === 0) {
            return;
        }
        await this.#onEvent('idle');
    }
    async #onEvent(event, filter) {
        return new Promise(resolve => {
            const listener = () => {
                if (filter && !filter()) {
                    return;
                }
                this.off(event, listener);
                resolve();
            };
            this.on(event, listener);
        });
    }
    /**
    Size of the queue, the number of queued items waiting to run.
    */
    get size() {
        return this.#queue.size;
    }
    /**
    Size of the queue, filtered by the given options.

    For example, this can be used to find the number of items remaining in the queue with a specific priority level.
    */
    sizeBy(options) {
        // eslint-disable-next-line unicorn/no-array-callback-reference
        return this.#queue.filter(options).length;
    }
    /**
    Number of running items (no longer in the queue).
    */
    get pending() {
        return this.#pending;
    }
    /**
    Whether the queue is currently paused.
    */
    get isPaused() {
        return this.#isPaused;
    }
}


/***/ }),

/***/ "./node_modules/@nextcloud/upload/node_modules/p-queue/dist/lower-bound.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@nextcloud/upload/node_modules/p-queue/dist/lower-bound.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ lowerBound)
/* harmony export */ });
// Port of lower_bound from https://en.cppreference.com/w/cpp/algorithm/lower_bound
// Used to compute insertion index to keep queue sorted after insertion
function lowerBound(array, value, comparator) {
    let first = 0;
    let count = array.length;
    while (count > 0) {
        const step = Math.trunc(count / 2);
        let it = first + step;
        if (comparator(array[it], value) <= 0) {
            first = ++it;
            count -= step + 1;
        }
        else {
            count = step;
        }
    }
    return first;
}


/***/ }),

/***/ "./node_modules/@nextcloud/upload/node_modules/p-queue/dist/priority-queue.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@nextcloud/upload/node_modules/p-queue/dist/priority-queue.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PriorityQueue)
/* harmony export */ });
/* harmony import */ var _lower_bound_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lower-bound.js */ "./node_modules/@nextcloud/upload/node_modules/p-queue/dist/lower-bound.js");

class PriorityQueue {
    #queue = [];
    enqueue(run, options) {
        options = {
            priority: 0,
            ...options,
        };
        const element = {
            priority: options.priority,
            run,
        };
        if (this.size && this.#queue[this.size - 1].priority >= options.priority) {
            this.#queue.push(element);
            return;
        }
        const index = (0,_lower_bound_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this.#queue, element, (a, b) => b.priority - a.priority);
        this.#queue.splice(index, 0, element);
    }
    dequeue() {
        const item = this.#queue.shift();
        return item?.run;
    }
    filter(options) {
        return this.#queue.filter((element) => element.priority === options.priority).map((element) => element.run);
    }
    get size() {
        return this.#queue.length;
    }
}


/***/ }),

/***/ "./node_modules/@nextcloud/upload/node_modules/p-timeout/index.js":
/*!************************************************************************!*\
  !*** ./node_modules/@nextcloud/upload/node_modules/p-timeout/index.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortError: () => (/* binding */ AbortError),
/* harmony export */   TimeoutError: () => (/* binding */ TimeoutError),
/* harmony export */   "default": () => (/* binding */ pTimeout)
/* harmony export */ });
class TimeoutError extends Error {
	constructor(message) {
		super(message);
		this.name = 'TimeoutError';
	}
}

/**
An error to be thrown when the request is aborted by AbortController.
DOMException is thrown instead of this Error when DOMException is available.
*/
class AbortError extends Error {
	constructor(message) {
		super();
		this.name = 'AbortError';
		this.message = message;
	}
}

/**
TODO: Remove AbortError and just throw DOMException when targeting Node 18.
*/
const getDOMException = errorMessage => globalThis.DOMException === undefined
	? new AbortError(errorMessage)
	: new DOMException(errorMessage);

/**
TODO: Remove below function and just 'reject(signal.reason)' when targeting Node 18.
*/
const getAbortedReason = signal => {
	const reason = signal.reason === undefined
		? getDOMException('This operation was aborted.')
		: signal.reason;

	return reason instanceof Error ? reason : getDOMException(reason);
};

function pTimeout(promise, options) {
	const {
		milliseconds,
		fallback,
		message,
		customTimers = {setTimeout, clearTimeout},
	} = options;

	let timer;

	const wrappedPromise = new Promise((resolve, reject) => {
		if (typeof milliseconds !== 'number' || Math.sign(milliseconds) !== 1) {
			throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
		}

		if (options.signal) {
			const {signal} = options;
			if (signal.aborted) {
				reject(getAbortedReason(signal));
			}

			signal.addEventListener('abort', () => {
				reject(getAbortedReason(signal));
			});
		}

		if (milliseconds === Number.POSITIVE_INFINITY) {
			promise.then(resolve, reject);
			return;
		}

		// We create the error outside of `setTimeout` to preserve the stack trace.
		const timeoutError = new TimeoutError();

		timer = customTimers.setTimeout.call(undefined, () => {
			if (fallback) {
				try {
					resolve(fallback());
				} catch (error) {
					reject(error);
				}

				return;
			}

			if (typeof promise.cancel === 'function') {
				promise.cancel();
			}

			if (message === false) {
				resolve();
			} else if (message instanceof Error) {
				reject(message);
			} else {
				timeoutError.message = message ?? `Promise timed out after ${milliseconds} milliseconds`;
				reject(timeoutError);
			}
		}, milliseconds);

		(async () => {
			try {
				resolve(await promise);
			} catch (error) {
				reject(error);
			}
		})();
	});

	const cancelablePromise = wrappedPromise.finally(() => {
		cancelablePromise.clear();
	});

	cancelablePromise.clear = () => {
		customTimers.clearTimeout.call(undefined, timer);
		timer = undefined;
	};

	return cancelablePromise;
}


/***/ }),

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Axios: () => (/* binding */ Axios),
/* harmony export */   AxiosError: () => (/* binding */ AxiosError),
/* harmony export */   AxiosHeaders: () => (/* binding */ AxiosHeaders),
/* harmony export */   Cancel: () => (/* binding */ Cancel),
/* harmony export */   CancelToken: () => (/* binding */ CancelToken),
/* harmony export */   CanceledError: () => (/* binding */ CanceledError),
/* harmony export */   HttpStatusCode: () => (/* binding */ HttpStatusCode),
/* harmony export */   VERSION: () => (/* binding */ VERSION),
/* harmony export */   all: () => (/* binding */ all),
/* harmony export */   "default": () => (/* reexport safe */ _lib_axios_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   formToJSON: () => (/* binding */ formToJSON),
/* harmony export */   getAdapter: () => (/* binding */ getAdapter),
/* harmony export */   isAxiosError: () => (/* binding */ isAxiosError),
/* harmony export */   isCancel: () => (/* binding */ isCancel),
/* harmony export */   mergeConfig: () => (/* binding */ mergeConfig),
/* harmony export */   spread: () => (/* binding */ spread),
/* harmony export */   toFormData: () => (/* binding */ toFormData)
/* harmony export */ });
/* harmony import */ var _lib_axios_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/axios.js */ "./node_modules/axios/lib/axios.js");


// This module is intended to unwrap Axios default export as named.
// Keep top-level export same with static properties
// so that it can keep same with es module or cjs
const {
  Axios,
  AxiosError,
  CanceledError,
  isCancel,
  CancelToken,
  VERSION,
  all,
  Cancel,
  isAxiosError,
  spread,
  toFormData,
  AxiosHeaders,
  HttpStatusCode,
  formToJSON,
  getAdapter,
  mergeConfig
} = _lib_axios_js__WEBPACK_IMPORTED_MODULE_0__["default"];




/***/ }),

/***/ "./node_modules/p-cancelable/index.js":
/*!********************************************!*\
  !*** ./node_modules/p-cancelable/index.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CancelError: () => (/* binding */ CancelError),
/* harmony export */   "default": () => (/* binding */ PCancelable)
/* harmony export */ });
class CancelError extends Error {
	constructor(reason) {
		super(reason || 'Promise was canceled');
		this.name = 'CancelError';
	}

	get isCanceled() {
		return true;
	}
}

const promiseState = Object.freeze({
	pending: Symbol('pending'),
	canceled: Symbol('canceled'),
	resolved: Symbol('resolved'),
	rejected: Symbol('rejected'),
});

class PCancelable {
	static fn(userFunction) {
		return (...arguments_) => new PCancelable((resolve, reject, onCancel) => {
			arguments_.push(onCancel);
			userFunction(...arguments_).then(resolve, reject);
		});
	}

	#cancelHandlers = [];
	#rejectOnCancel = true;
	#state = promiseState.pending;
	#promise;
	#reject;

	constructor(executor) {
		this.#promise = new Promise((resolve, reject) => {
			this.#reject = reject;

			const onResolve = value => {
				if (this.#state !== promiseState.canceled || !onCancel.shouldReject) {
					resolve(value);
					this.#setState(promiseState.resolved);
				}
			};

			const onReject = error => {
				if (this.#state !== promiseState.canceled || !onCancel.shouldReject) {
					reject(error);
					this.#setState(promiseState.rejected);
				}
			};

			const onCancel = handler => {
				if (this.#state !== promiseState.pending) {
					throw new Error(`The \`onCancel\` handler was attached after the promise ${this.#state.description}.`);
				}

				this.#cancelHandlers.push(handler);
			};

			Object.defineProperties(onCancel, {
				shouldReject: {
					get: () => this.#rejectOnCancel,
					set: boolean => {
						this.#rejectOnCancel = boolean;
					},
				},
			});

			executor(onResolve, onReject, onCancel);
		});
	}

	// eslint-disable-next-line unicorn/no-thenable
	then(onFulfilled, onRejected) {
		return this.#promise.then(onFulfilled, onRejected);
	}

	catch(onRejected) {
		return this.#promise.catch(onRejected);
	}

	finally(onFinally) {
		return this.#promise.finally(onFinally);
	}

	cancel(reason) {
		if (this.#state !== promiseState.pending) {
			return;
		}

		this.#setState(promiseState.canceled);

		if (this.#cancelHandlers.length > 0) {
			try {
				for (const handler of this.#cancelHandlers) {
					handler();
				}
			} catch (error) {
				this.#reject(error);
				return;
			}
		}

		if (this.#rejectOnCancel) {
			this.#reject(new CancelError(reason));
		}
	}

	get isCanceled() {
		return this.#state === promiseState.canceled;
	}

	#setState(state) {
		if (this.#state === promiseState.pending) {
			this.#state = state;
		}
	}
}

Object.setPrototypeOf(PCancelable.prototype, Promise.prototype);


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
/******/ 			return "" + chunkId + "-" + chunkId + ".js?v=" + {"node_modules_nextcloud_dialogs_dist_chunks_index-RkOaxczZ_mjs":"bd4543eedef900694c93","node_modules_nextcloud_upload_dist_chunks_ConflictPicker-Bif6rCp6_mjs":"6fe2b9cfc0c2ecea9a81","apps_files_src_views_TemplatePicker_vue":"cba563890c0d8ced48db","data_image_svg_xml_3csvg_20xmlns_27http_www_w3_org_2000_svg_27_20width_2724_27_20height_2724_-28884d":"5e4ceb7fd9d03ea20c8b"}[chunkId] + "";
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
/******/ 			"files-init": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["core-common"], () => (__webpack_require__("./apps/files/src/init.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=files-init.js.map?v=7a39bd81964076b798ac