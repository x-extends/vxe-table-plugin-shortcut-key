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

  var arrowKeys = 'right,up,left,down'.split(',');
  var specialKeys = 'alt,ctrl,shift,meta'.split(',');
  var shortcutMap = new Map();
  var keyboardCode = {
    37: 'ArrowRight',
    38: 'ArrowUp',
    39: 'ArrowLeft',
    40: 'ArrowDown'
  };

  function getEventKey(key) {
    if (arrowKeys.indexOf(key.toLowerCase()) > -1) {
      return "Arrow".concat(key);
    }

    return key;
  }

  function isTriggerPage(params) {
    var $table = params.$table;
    return !$table.getActiveRow();
  }

  function handleChangePage(func) {
    return function (params, evnt) {
      var $table = params.$table;
      var $grid = $table.$grid;

      if ($grid && isTriggerPage(params)) {
        var pager = $grid.$refs.pager;

        if (pager) {
          pager[func](evnt);
        }
      }
    };
  }

  var handleFuncs = {
    'pager.prevPage': handleChangePage('prevPage'),
    'pager.nextPage': handleChangePage('nextPage')
  };

  function matchFunc(key, evnt) {
    var conf = shortcutMap.get(key);

    if (conf ? !conf.specialKey || evnt["".concat(conf.specialKey, "Key")] : false) {
      return handleFuncs[conf.funcName];
    }
  }

  function handleShortcutKeyEvent(params, evnt) {
    if (['input', 'textarea'].indexOf(evnt.target.tagName.toLowerCase()) === -1) {
      var key = getEventKey(evnt.key) || keyboardCode[evnt.keyCode];
      var func = matchFunc(key.toLowerCase(), evnt);

      if (func) {
        evnt.preventDefault();
        func(params, evnt);
      }
    }
  }

  var VXETablePluginShortcutKey = {
    install: function install(VXETable, options) {
      _xeUtils["default"].each(options, function (key, funcName) {
        var specialKey;
        var realKey;
        key.split('+').forEach(function (key) {
          key = key.toLowerCase();

          if (specialKeys.indexOf(key) > -1) {
            specialKey = key;
          } else {
            realKey = key;
          }
        });

        if (!realKey) {
          throw new Error("[vxe-table-plugin-shortcut-key] Invalid shortcut key configuration '".concat(key, "'."));
        }

        shortcutMap.set(realKey, {
          realKey: realKey,
          specialKey: specialKey,
          funcName: funcName
        });
      });

      VXETable.interceptor.add('event.keydown', handleShortcutKeyEvent);
    }
  };
  _exports.VXETablePluginShortcutKey = VXETablePluginShortcutKey;

  if (typeof window !== 'undefined' && window.VXETable) {
    window.VXETable.use(VXETablePluginShortcutKey);
  }

  var _default = VXETablePluginShortcutKey;
  _exports["default"] = _default;
});