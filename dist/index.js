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
  var settingMaps = {};
  var listenerMaps = {};
  var disabledMaps = {};
  var keyboardCode = {
    37: 'ArrowRight',
    38: 'ArrowUp',
    39: 'ArrowLeft',
    40: 'ArrowDown'
  };

  var SKey =
  /*#__PURE__*/
  function () {
    function SKey(realKey, specialKey, funcName, options) {
      _classCallCheck(this, SKey);

      this.realKey = realKey;
      this.specialKey = specialKey;
      this.funcName = funcName;
      this.options = options;
    }

    _createClass(SKey, [{
      key: "trigger",
      value: function trigger(params, evnt) {
        if (!this.specialKey || evnt["".concat(this.specialKey, "Key")]) {
          return handleFuncs[this.funcName](params, evnt);
        }
      }
    }, {
      key: "emit",
      value: function emit(params, evnt) {
        if (!this.specialKey || evnt["".concat(this.specialKey, "Key")]) {
          return this.options.callback(params, evnt);
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

  function handleTabMove(isLeft) {
    return function (params, evnt) {
      var $table = params.$table;
      var actived = $table.getActiveRow();
      var selected = $table.getMouseSelecteds();

      if (selected) {
        $table.moveTabSelected(selected, isLeft, evnt);
      } else if (actived) {
        $table.moveTabSelected(actived, isLeft, evnt);
      }

      return false;
    };
  }

  function handleArrowMove(arrowIndex) {
    return function (params, evnt) {
      var $table = params.$table;
      var selected = $table.getMouseSelecteds();
      var arrows = [0, 0, 0, 0];
      arrows[arrowIndex] = 1;

      if (selected) {
        $table.moveSelected(selected, arrows[0], arrows[1], arrows[2], arrows[3], evnt);
        return false;
      }
    };
  }

  var handleFuncs = {
    'table.edit.actived': function tableEditActived(params, evnt) {
      var $table = params.$table;
      var selected = $table.getMouseSelecteds();

      if (selected) {
        evnt.preventDefault();
        $table.setActiveCell(selected.row, selected.column.property);
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
    'table.edit.rightTabMove': handleTabMove(0),
    'table.edit.leftTabMove': handleTabMove(1),
    'table.cell.leftMove': handleArrowMove(0),
    'table.cell.upMove': handleArrowMove(1),
    'table.cell.rightMove': handleArrowMove(2),
    'table.cell.downMove': handleArrowMove(3),
    'pager.prevPage': handleChangePage('prevPage'),
    'pager.nextPage': handleChangePage('nextPage'),
    'pager.prevJump': handleChangePage('prevJump'),
    'pager.nextJump': handleChangePage('nextJump')
  };

  function runEvent(key, maps, prop, params, evnt) {
    var skeyList = maps[key.toLowerCase()];

    if (skeyList) {
      return skeyList.some(function (skey) {
        return skey[prop](params, evnt) === false;
      });
    }
  }

  function handleShortcutKeyEvent(params, evnt) {
    var key = getEventKey(evnt.key) || keyboardCode[evnt.keyCode];

    if (!runEvent(key, disabledMaps, 'emit', params, evnt)) {
      runEvent(key, settingMaps, 'trigger', params, evnt);
      runEvent(key, listenerMaps, 'emit', params, evnt);
    }
  }

  function parseKeys(keyMap) {
    var specialKey;
    var realKey;
    var keys = keyMap.split('+');
    keys.forEach(function (key) {
      key = key.toLowerCase().trim();

      if (specialKeys.indexOf(key) > -1) {
        specialKey = key;
      } else {
        realKey = key;
      }
    });

    if (!realKey || keys.length > 2 || keys.length === 2 && !specialKey) {
      throw new Error("[vxe-table-plugin-shortcut-key] Invalid shortcut key configuration '".concat(keyMap, "'."));
    }

    return {
      specialKey: specialKey,
      realKey: realKey
    };
  }

  function setKeyQueue(maps, opts, funcName) {
    var _parseKeys = parseKeys(opts.keyMap),
        specialKey = _parseKeys.specialKey,
        realKey = _parseKeys.realKey;

    var skeyList = maps[realKey];

    if (!skeyList) {
      skeyList = maps[realKey] = [];
    }

    if (skeyList.some(function (skey) {
      return skey.realKey === realKey && skey.specialKey === specialKey;
    })) {
      throw new Error("[vxe-table-plugin-shortcut-key] Shortcut key conflict '".concat(opts.keyMap, "'."));
    }

    skeyList.push(new SKey(realKey, specialKey, funcName, opts));
  }

  function getOpts(conf) {
    return _xeUtils["default"].isString(conf) ? {
      keyMap: conf
    } : _xeUtils["default"].assign({
      keyMap: conf.key
    }, conf);
  }

  function parseDisabledKey(options) {
    _xeUtils["default"].each(options.disabled, function (conf) {
      var callback = function callback() {
        return false;
      };

      var opts = _xeUtils["default"].isString(conf) ? {
        keyMap: conf,
        callback: callback
      } : _xeUtils["default"].assign({
        keyMap: conf.key,
        callback: callback
      }, conf);

      if (!_xeUtils["default"].isFunction(opts.callback)) {
        console.warn("[vxe-table-plugin-shortcut-key] The '".concat(opts.keyMap, "' must be a function."));
      }

      setKeyQueue(disabledMaps, opts);
    });
  }

  function parseSettingKey(options) {
    _xeUtils["default"].each(options.setting, function (conf, funcName) {
      if (!handleFuncs[funcName]) {
        console.warn("[vxe-table-plugin-shortcut-key] The '".concat(funcName, "' not exist."));
      }

      setKeyQueue(settingMaps, getOpts(conf), funcName);
    });
  }

  function parseListenerKey(options) {
    _xeUtils["default"].each(options.listener, function (callback, keyMap) {
      if (!_xeUtils["default"].isFunction(callback)) {
        console.warn("[vxe-table-plugin-shortcut-key] The '".concat(keyMap, "' must be a function."));
      }

      setKeyQueue(listenerMaps, getOpts({
        key: keyMap,
        callback: callback
      }));
    });
  }

  var VXETablePluginShortcutKey = {
    install: function install(VXETable, options) {
      if (options) {
        parseDisabledKey(options);
        parseSettingKey(options);
        parseListenerKey(options);
        VXETable.interceptor.add('event.keydown', handleShortcutKeyEvent);
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