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

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var arrowKeys = 'right,up,left,down'.split(',');
  var specialKeys = 'alt,ctrl,shift,meta'.split(',');
  var shortcutMap = {};
  var globalOptions = {};
  var keyboardCode = {
    37: 'ArrowRight',
    38: 'ArrowUp',
    39: 'ArrowLeft',
    40: 'ArrowDown'
  };

  var SKey =
  /*#__PURE__*/
  function () {
    function SKey(realKey, specialKey, funcName) {
      _classCallCheck(this, SKey);

      this.realKey = realKey;
      this.specialKey = specialKey;
      this.funcName = funcName;
    }

    _createClass(SKey, [{
      key: "trigger",
      value: function trigger(params, evnt) {
        if (!this.specialKey || evnt["".concat(this.specialKey, "Key")]) {
          return handleFuncs[this.funcName](params, evnt);
        }
      }
    }]);

    return SKey;
  }();

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
      var _$table$mouseConfig = $table.mouseConfig,
          mouseConfig = _$table$mouseConfig === void 0 ? {} : _$table$mouseConfig;
      var $grid = $table.$grid;

      if ($grid && mouseConfig.selected !== true && ['input', 'textarea'].indexOf(evnt.target.tagName.toLowerCase()) === -1 && isTriggerPage(params)) {
        var pager = $grid.$refs.pager;

        if (pager) {
          evnt.preventDefault();
          pager[func](evnt);
        }
      }
    };
  }

  var handleFuncs = {
    'table.edit.actived': function tableEditActived(params, evnt) {
      var $table = params.$table;

      var _$table$getMouseSelec = $table.getMouseSelecteds(),
          row = _$table$getMouseSelec.row,
          column = _$table$getMouseSelec.column;

      if (row && column) {
        evnt.preventDefault();
        $table.setActiveCell(row, column.property);
        return false;
      }
    },
    'table.edit.closed': function tableEditClosed(params, evnt) {
      var $table = params.$table;
      var _$table$mouseConfig2 = $table.mouseConfig,
          mouseConfig = _$table$mouseConfig2 === void 0 ? {} : _$table$mouseConfig2;
      var actived = $table.getActiveRow();

      if (actived) {
        evnt.preventDefault();
        $table.clearActived(evnt);

        if (mouseConfig.selected) {
          $table.$nextTick(function () {
            return $table.setSelectCell(actived.row, actived.column.property);
          });
        }

        return false;
      }
    },
    'pager.prevPage': handleChangePage('prevPage'),
    'pager.nextPage': handleChangePage('nextPage'),
    'pager.prevJump': handleChangePage('prevJump'),
    'pager.nextJump': handleChangePage('nextJump')
  };

  function handleShortcutKeyEvent(params, evnt) {
    var key = getEventKey(evnt.key) || keyboardCode[evnt.keyCode];
    var skeyList = shortcutMap[key.toLowerCase()];

    if (skeyList) {
      if (skeyList.map(function (skey) {
        return skey.trigger(params, evnt);
      }).some(function (rest) {
        return rest === false;
      })) {
        return false;
      }
    }
  }

  function handleKeyMap() {
    _xeUtils["default"].each(globalOptions, function (key, funcName) {
      var specialKey;
      var realKey;
      key.split('+').forEach(function (key) {
        key = key.toLowerCase().trim();

        if (specialKeys.indexOf(key) > -1) {
          specialKey = key;
        } else {
          realKey = key;
        }
      });

      if (!realKey) {
        throw new Error("[vxe-table-plugin-shortcut-key] Invalid shortcut key configuration '".concat(key, "'."));
      }

      var skeyList = shortcutMap[realKey];

      if (!skeyList) {
        skeyList = shortcutMap[realKey] = [];
      }

      if (skeyList.some(function (skey) {
        return skey.realKey === realKey && skey.specialKey === specialKey;
      })) {
        throw new Error("[vxe-table-plugin-shortcut-key] Shortcut keys conflict '".concat(key, "'."));
      }

      skeyList.push(new SKey(realKey, specialKey, funcName));
    });
  }

  var VXETablePluginShortcutKey = {
    install: function install(VXETable, options) {
      if (options) {
        _xeUtils["default"].each(options.setting, function (key, funcName) {
          if (handleFuncs[funcName]) {
            globalOptions[funcName] = key;
          } else {
            console.warn("[vxe-table-plugin-shortcut-key] The ".concat(funcName, " doesn't exist."));
          }
        });

        VXETable.interceptor.add('event.keydown', handleShortcutKeyEvent);
        handleKeyMap();
      }
    }
  };
  _exports.VXETablePluginShortcutKey = VXETablePluginShortcutKey;

  if (typeof window !== 'undefined' && window.VXETable) {
    window.VXETable.use(VXETablePluginShortcutKey);
  }

  var _default = VXETablePluginShortcutKey;
  _exports["default"] = _default;
});