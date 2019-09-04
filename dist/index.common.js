"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.VXETablePluginShortcutKey = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils/methods/xe-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var keyMap = {};
var VXETablePluginShortcutKey = {
  install: function install(VXETable) {
    VXETable.renderer.mixin(keyMap);
  }
};
exports.VXETablePluginShortcutKey = VXETablePluginShortcutKey;

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginShortcutKey);
}

var _default = VXETablePluginShortcutKey;
exports["default"] = _default;