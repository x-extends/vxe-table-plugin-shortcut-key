(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("vxe-table-plugin-shortcut-key", [], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.VXETablePluginShortcutKey = mod.exports.default;
  }
})(this, function () {
  "use strict";

  var _a;

  exports.__esModule = true;

  var xe_utils_1 = require("xe-utils");

  var arrowKeys = 'right,up,left,down'.split(',');
  var specialKeys = 'alt,ctrl,shift,meta'.split(',');
  var settingMaps = {};
  var listenerMaps = {};
  var disabledMaps = {};

  var SKey =
  /** @class */
  function () {
    function SKey(realKey, specialKey, funcName, kConf) {
      this.realKey = realKey;
      this.specialKey = specialKey;
      this.funcName = funcName;
      this.kConf = kConf;
    }

    SKey.prototype["trigger"
    /* TRIGGER */
    ] = function (params, evnt) {
      if (!this.specialKey || evnt[this.specialKey + "Key"]) {
        return exports.handleFuncs[this.funcName](params, evnt);
      }
    };

    SKey.prototype["emit"
    /* EMIT */
    ] = function (params, evnt) {
      if (!this.specialKey || evnt[this.specialKey + "Key"]) {
        return this.kConf.callback(params, evnt);
      }
    };

    return SKey;
  }();

  exports.SKey = SKey;

  function getEventKey(key) {
    if (arrowKeys.indexOf(key.toLowerCase()) > -1) {
      return "Arrow" + key;
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
      var _a = $table.mouseConfig,
          mouseConfig = _a === void 0 ? {} : _a;
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
  /**
   * 快捷键处理方法
   */


  exports.handleFuncs = (_a = {}, _a["table.edit.actived"
  /* TABLE_EDIT_ACTIVED */
  ] = function (params, evnt) {
    var $table = params.$table;
    var selected = $table.getMouseSelecteds();

    if (selected) {
      evnt.preventDefault();
      $table.setActiveCell(selected.row, selected.column.property);
      return false;
    }
  }, _a["table.edit.closed"
  /* TABLE_EDIT_CLOSED */
  ] = function (params, evnt) {
    var $table = params.$table;
    var _a = $table.mouseConfig,
        mouseConfig = _a === void 0 ? {} : _a;
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
  }, _a["table.edit.rightTabMove"
  /* TABLE_EDIT_RIGHTTABMOVE */
  ] = handleTabMove(false), _a["table.edit.leftTabMove"
  /* TABLE_EDIT_LEFTTABMOVE */
  ] = handleTabMove(true), _a["table.cell.leftMove"
  /* TABLE_CELL_LEFTMOVE */
  ] = handleArrowMove(0), _a["table.cell.upMove"
  /* TABLE_CELL_UPMOVE */
  ] = handleArrowMove(1), _a["table.cell.rightMove"
  /* TABLE_CELL_RIGHTMOVE */
  ] = handleArrowMove(2), _a["table.cell.downMove"
  /* TABLE_CELL_DOWNMOVE */
  ] = handleArrowMove(3), _a["pager.prevPage"
  /* PAGER_PREVPAGE */
  ] = handleChangePage('prevPage'), _a["pager.nextPage"
  /* PAGER_NEXTPAGE */
  ] = handleChangePage('nextPage'), _a["pager.prevJump"
  /* PAGER_PREVJUMP */
  ] = handleChangePage('prevJump'), _a["pager.nextJump"
  /* PAGER_NEXTJUMP */
  ] = handleChangePage('nextJump'), _a);

  function runEvent(key, maps, prop, params, evnt) {
    var skeyList = maps[key.toLowerCase()];

    if (skeyList) {
      return skeyList.some(function (skey) {
        return skey[prop](params, evnt) === false;
      });
    }
  }

  function handleShortcutKeyEvent(params, evnt) {
    var key = getEventKey(evnt.key);

    if (!runEvent(key, disabledMaps, "emit"
    /* EMIT */
    , params, evnt)) {
      runEvent(key, settingMaps, "trigger"
      /* TRIGGER */
      , params, evnt);
      runEvent(key, listenerMaps, "emit"
      /* EMIT */
      , params, evnt);
    }
  }

  function parseKeys(key) {
    var specialKey;
    var realKey;
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
      throw new Error("[vxe-table-plugin-shortcut-key] Invalid shortcut key configuration '" + key + "'.");
    }

    return {
      specialKey: specialKey,
      realKey: realKey
    };
  }

  function setKeyQueue(maps, kConf, funcName) {
    var _a = parseKeys(kConf.key),
        specialKey = _a.specialKey,
        realKey = _a.realKey;

    var skeyList = maps[realKey];

    if (!skeyList) {
      skeyList = maps[realKey] = [];
    }

    if (skeyList.some(function (skey) {
      return skey.realKey === realKey && skey.specialKey === specialKey;
    })) {
      throw new Error("[vxe-table-plugin-shortcut-key] Shortcut key conflict '" + kConf.key + "'.");
    }

    skeyList.push(new SKey(realKey, specialKey, funcName, kConf));
  }

  function parseDisabledKey(options) {
    xe_utils_1["default"].each(options.disabled, function (conf) {
      var opts = xe_utils_1["default"].isString(conf) ? {
        key: conf
      } : conf;
      setKeyQueue(disabledMaps, xe_utils_1["default"].assign({
        callback: function callback() {
          return false;
        }
      }, opts));
    });
  }

  function parseSettingKey(options) {
    xe_utils_1["default"].each(options.setting, function (opts, funcName) {
      var kConf = xe_utils_1["default"].isString(opts) ? {
        key: opts
      } : opts;

      if (!exports.handleFuncs[funcName]) {
        console.warn("[vxe-table-plugin-shortcut-key] '" + funcName + "' not exist.");
      }

      setKeyQueue(settingMaps, kConf, funcName);
    });
  }

  function parseListenerKey(options) {
    xe_utils_1["default"].each(options.listener, function (callback, key) {
      if (!xe_utils_1["default"].isFunction(callback)) {
        console.warn("[vxe-table-plugin-shortcut-key] '" + key + "' requires the callback function to be set.");
      }

      setKeyQueue(listenerMaps, {
        key: key,
        callback: callback
      });
    });
  }
  /**
   * 基于 vxe-table 表格的增强插件，为键盘操作提供快捷键的设置
   */


  exports.VXETablePluginShortcutKey = {
    install: function install(xtable, options) {
      if (options) {
        parseDisabledKey(options);
        parseSettingKey(options);
        parseListenerKey(options);
        xtable.interceptor.add('event.keydown', handleShortcutKeyEvent);
      }
    }
  };

  if (typeof window !== 'undefined' && window.VXETable) {
    window.VXETable.use(exports.VXETablePluginShortcutKey);
  }

  exports["default"] = exports.VXETablePluginShortcutKey;
});