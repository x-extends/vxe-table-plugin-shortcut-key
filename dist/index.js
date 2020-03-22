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
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _xeUtils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = _exports.VXETablePluginShortcutKey = _exports.handleFuncs = _exports.SKey = void 0;
  _xeUtils = _interopRequireDefault(_xeUtils);

  var _handleFuncs;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var arrowKeys = 'right,up,left,down'.split(',');
  var specialKeys = 'alt,ctrl,shift,meta'.split(',');
  var settingMaps = {};
  var listenerMaps = {};
  var disabledMaps = {};
  /* eslint-enable no-unused-vars */

  var SKey = /*#__PURE__*/function () {
    function SKey(realKey, specialKey, funcName, kConf) {
      _classCallCheck(this, SKey);

      this.realKey = realKey;
      this.specialKey = specialKey;
      this.funcName = funcName;
      this.kConf = kConf;
    }

    _createClass(SKey, [{
      key: "trigger"
      /* TRIGGER */
      ,
      value: function trigger(params, evnt) {
        if (!this.specialKey || evnt["".concat(this.specialKey, "Key")]) {
          if (this.funcName) {
            return handleFuncs[this.funcName](params, evnt);
          }
        }
      }
    }, {
      key: "emit"
      /* EMIT */
      ,
      value: function emit(params, evnt) {
        if (!this.specialKey || evnt["".concat(this.specialKey, "Key")]) {
          if (this.kConf) {
            return this.kConf.callback(params, evnt);
          }
        }
      }
    }]);

    return SKey;
  }();

  _exports.SKey = SKey;

  function getEventKey(key) {
    if (arrowKeys.indexOf(key.toLowerCase()) > -1) {
      return "Arrow".concat(key);
    }

    return key;
  }

  function isTriggerPage(params) {
    return !params.$table.getActiveRecord();
  }

  function handleChangePage(func) {
    return function (params, evnt) {
      var $grid = params.$grid,
          $table = params.$table;
      var _$table$mouseConfig = $table.mouseConfig,
          mouseConfig = _$table$mouseConfig === void 0 ? {} : _$table$mouseConfig;

      if ($grid && mouseConfig.selected !== true && ['input', 'textarea'].indexOf(evnt.target.tagName.toLowerCase()) === -1 && isTriggerPage(params)) {
        var pager = $grid.$refs.pager;

        if (pager) {
          evnt.preventDefault();
          pager[func](evnt);
        }
      }
    };
  }

  function handleCellMove(arrowIndex) {
    return function (params, evnt) {
      var $table = params.$table;
      var selected = $table.getSelectedCell();
      var arrows = [0, 0, 0, 0];
      arrows[arrowIndex] = 1;

      if (selected) {
        $table.moveSelected(selected.row, arrows[0], arrows[1], arrows[2], arrows[3], evnt);
        return false;
      }
    };
  }

  function handleCurrentRowMove(isDown) {
    return function (params, evnt) {
      var $table = params.$table;

      if ($table.highlightCurrentRow) {
        var currentRow = $table.getCurrentRecord();

        if (currentRow) {
          $table.moveCurrentRow(!isDown, isDown, evnt);
          return false;
        }
      }
    };
  }
  /**
   * 快捷键处理方法
   */


  var handleFuncs = (_handleFuncs = {}, _defineProperty(_handleFuncs, "table.edit.actived"
  /* TABLE_EDIT_ACTIVED */
  , function tableEditActived(params, evnt) {
    var $table = params.$table;
    var selected = $table.getSelectedCell();

    if (selected) {
      evnt.preventDefault();
      $table.setActiveCell(selected.row, selected.column.property);
      return false;
    }
  }), _defineProperty(_handleFuncs, "table.edit.closed"
  /* TABLE_EDIT_CLOSED */
  , function tableEditClosed(params, evnt) {
    var $table = params.$table;
    var _$table$mouseConfig2 = $table.mouseConfig,
        mouseConfig = _$table$mouseConfig2 === void 0 ? {} : _$table$mouseConfig2;
    var actived = $table.getActiveRecord();

    if (actived) {
      evnt.preventDefault();
      $table.clearActived();

      if (mouseConfig.selected) {
        $table.$nextTick(function () {
          return $table.setSelectCell(actived.row, actived.column.property);
        });
      }

      return false;
    }
  }), _defineProperty(_handleFuncs, "table.cell.leftMove"
  /* TABLE_CELL_LEFTMOVE */
  , handleCellMove(0)), _defineProperty(_handleFuncs, "table.cell.upMove"
  /* TABLE_CELL_UPMOVE */
  , handleCellMove(1)), _defineProperty(_handleFuncs, "table.cell.rightMove"
  /* TABLE_CELL_RIGHTMOVE */
  , handleCellMove(2)), _defineProperty(_handleFuncs, "table.cell.downMove"
  /* TABLE_CELL_DOWNMOVE */
  , handleCellMove(3)), _defineProperty(_handleFuncs, "table.row.current.topMove"
  /* TABLE_ROW_CURRENT_TOPMOVE */
  , handleCurrentRowMove(false)), _defineProperty(_handleFuncs, "table.row.current.downMove"
  /* TABLE_ROW_CURRENT_DOWNMOVE */
  , handleCurrentRowMove(true)), _defineProperty(_handleFuncs, "pager.prevPage"
  /* PAGER_PREVPAGE */
  , handleChangePage('prevPage')), _defineProperty(_handleFuncs, "pager.nextPage"
  /* PAGER_NEXTPAGE */
  , handleChangePage('nextPage')), _defineProperty(_handleFuncs, "pager.prevJump"
  /* PAGER_PREVJUMP */
  , handleChangePage('prevJump')), _defineProperty(_handleFuncs, "pager.nextJump"
  /* PAGER_NEXTJUMP */
  , handleChangePage('nextJump')), _handleFuncs);
  _exports.handleFuncs = handleFuncs;

  function runEvent(key, maps, prop, params, evnt) {
    var skeyList = maps[key.toLowerCase()];

    if (skeyList) {
      return !skeyList.some(function (skey) {
        return skey[prop](params, evnt) === false;
      });
    }
  }

  function handleShortcutKeyEvent(params, evnt) {
    var key = getEventKey(evnt.key);

    if (!runEvent(key, disabledMaps, "emit"
    /* EMIT */
    , params, evnt)) {
      if (runEvent(key, settingMaps, "trigger"
      /* TRIGGER */
      , params, evnt) === false) {
        return false;
      }

      runEvent(key, listenerMaps, "emit"
      /* EMIT */
      , params, evnt);
    }
  }

  function parseKeys(key) {
    var specialKey = '';
    var realKey = '';
    var keys = key.split('+');
    keys.forEach(function (item) {
      item = item.toLowerCase().trim();

      if (specialKeys.indexOf(item) > -1) {
        specialKey = item;
      } else {
        realKey = item;
      }
    });

    if (!realKey || keys.length > 2 || keys.length === 2 && !specialKey) {
      throw new Error("[vxe-table-plugin-shortcut-key] Invalid shortcut key configuration '".concat(key, "'."));
    }

    return {
      realKey: realKey,
      specialKey: specialKey
    };
  }

  function setKeyQueue(maps, kConf, funcName) {
    var _parseKeys = parseKeys(kConf.key),
        realKey = _parseKeys.realKey,
        specialKey = _parseKeys.specialKey;

    var skeyList = maps[realKey];

    if (!skeyList) {
      skeyList = maps[realKey] = [];
    }

    if (skeyList.some(function (skey) {
      return skey.realKey === realKey && skey.specialKey === specialKey;
    })) {
      throw new Error("[vxe-table-plugin-shortcut-key] Shortcut key conflict '".concat(kConf.key, "'."));
    }

    skeyList.push(new SKey(realKey, specialKey, funcName, kConf));
  }

  function parseDisabledKey(options) {
    _xeUtils["default"].each(options.disabled, function (conf) {
      var opts = _xeUtils["default"].isString(conf) ? {
        key: conf
      } : conf;
      setKeyQueue(disabledMaps, _xeUtils["default"].assign({
        callback: function callback() {
          return false;
        }
      }, opts));
    });
  }

  function parseSettingKey(options) {
    _xeUtils["default"].each(options.setting, function (opts, funcName) {
      var kConf = _xeUtils["default"].isString(opts) ? {
        key: opts
      } : opts;

      if (!handleFuncs[funcName]) {
        console.warn("[vxe-table-plugin-shortcut-key] '".concat(funcName, "' not exist."));
      }

      setKeyQueue(settingMaps, kConf, funcName);
    });
  }

  function parseListenerKey(options) {
    _xeUtils["default"].each(options.listener, function (callback, key) {
      if (!_xeUtils["default"].isFunction(callback)) {
        console.warn("[vxe-table-plugin-shortcut-key] '".concat(key, "' requires the callback function to be set."));
      }

      setKeyQueue(listenerMaps, {
        key: key,
        callback: callback
      });
    });
  }
  /**
   * 设置参数
   * @param options 参数
   */


  function setup(options) {
    if (options) {
      parseDisabledKey(options);
      parseSettingKey(options);
      parseListenerKey(options);
    }
  }
  /**
   * 基于 vxe-table 表格的增强插件，为键盘操作提供快捷键的设置
   */


  var VXETablePluginShortcutKey = {
    setup: setup,
    install: function install(xtable, options) {
      if (options) {
        setup(options);
      }

      xtable.interceptor.add('event.keydown', handleShortcutKeyEvent);
    }
  };
  _exports.VXETablePluginShortcutKey = VXETablePluginShortcutKey;

  if (typeof window !== 'undefined' && window.VXETable) {
    window.VXETable.use(VXETablePluginShortcutKey);
  }

  var _default = VXETablePluginShortcutKey;
  _exports["default"] = _default;
});