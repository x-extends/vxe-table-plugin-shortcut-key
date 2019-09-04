(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("vxe-table-plugin-shortcut-key", ["exports", "xe-utils"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("xe-utils"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.XEUtils);
    global.VXETablePluginShortcutKey = mod.exports.default;
  }
})(this, function (_exports, _xeUtils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = _exports.VXETablePluginShortcutKey = void 0;
  _xeUtils = _interopRequireDefault(_xeUtils);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var keyMap = {};
  var VXETablePluginShortcutKey = {
    install: function install(VXETable) {
      VXETable.renderer.mixin(keyMap);
    }
  };
  _exports.VXETablePluginShortcutKey = VXETablePluginShortcutKey;

  if (typeof window !== 'undefined' && window.VXETable) {
    window.VXETable.use(VXETablePluginShortcutKey);
  }

  var _default = VXETablePluginShortcutKey;
  _exports["default"] = _default;
});