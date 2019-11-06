"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.VXETablePluginShortcutKey = exports.handleFuncs = exports.SKey = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils/methods/xe-utils"));

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

var SKey =
/*#__PURE__*/
function () {
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

exports.SKey = SKey;

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

function handleCellTabMove(isLeft) {
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

function handleCellMove(arrowIndex) {
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

function handleCurrentRowMove(isDown) {
  return function (params, evnt) {
    var $table = params.$table;

    if ($table.highlightCurrentRow) {
      var currentRow = $table.getCurrentRow();

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
  var selected = $table.getMouseSelecteds();

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
}), _defineProperty(_handleFuncs, "table.edit.rightTabMove"
/* TABLE_EDIT_RIGHTTABMOVE */
, handleCellTabMove(false)), _defineProperty(_handleFuncs, "table.edit.leftTabMove"
/* TABLE_EDIT_LEFTTABMOVE */
, handleCellTabMove(true)), _defineProperty(_handleFuncs, "table.cell.leftMove"
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
exports.handleFuncs = handleFuncs;

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
      xtable.interceptor.add('event.keydown', handleShortcutKeyEvent);
    }
  }
};
exports.VXETablePluginShortcutKey = VXETablePluginShortcutKey;

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginShortcutKey);
}

var _default = VXETablePluginShortcutKey;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImFycm93S2V5cyIsInNwbGl0Iiwic3BlY2lhbEtleXMiLCJzZXR0aW5nTWFwcyIsImxpc3RlbmVyTWFwcyIsImRpc2FibGVkTWFwcyIsIlNLZXkiLCJyZWFsS2V5Iiwic3BlY2lhbEtleSIsImZ1bmNOYW1lIiwia0NvbmYiLCJwYXJhbXMiLCJldm50IiwiaGFuZGxlRnVuY3MiLCJjYWxsYmFjayIsImdldEV2ZW50S2V5Iiwia2V5IiwiaW5kZXhPZiIsInRvTG93ZXJDYXNlIiwiaXNUcmlnZ2VyUGFnZSIsIiR0YWJsZSIsImdldEFjdGl2ZVJvdyIsImhhbmRsZUNoYW5nZVBhZ2UiLCJmdW5jIiwibW91c2VDb25maWciLCIkZ3JpZCIsInNlbGVjdGVkIiwidGFyZ2V0IiwidGFnTmFtZSIsInBhZ2VyIiwiJHJlZnMiLCJwcmV2ZW50RGVmYXVsdCIsImhhbmRsZUNlbGxUYWJNb3ZlIiwiaXNMZWZ0IiwiYWN0aXZlZCIsImdldE1vdXNlU2VsZWN0ZWRzIiwibW92ZVRhYlNlbGVjdGVkIiwiaGFuZGxlQ2VsbE1vdmUiLCJhcnJvd0luZGV4IiwiYXJyb3dzIiwibW92ZVNlbGVjdGVkIiwiaGFuZGxlQ3VycmVudFJvd01vdmUiLCJpc0Rvd24iLCJoaWdobGlnaHRDdXJyZW50Um93IiwiY3VycmVudFJvdyIsImdldEN1cnJlbnRSb3ciLCJtb3ZlQ3VycmVudFJvdyIsInNldEFjdGl2ZUNlbGwiLCJyb3ciLCJjb2x1bW4iLCJwcm9wZXJ0eSIsImNsZWFyQWN0aXZlZCIsIiRuZXh0VGljayIsInNldFNlbGVjdENlbGwiLCJydW5FdmVudCIsIm1hcHMiLCJwcm9wIiwic2tleUxpc3QiLCJzb21lIiwic2tleSIsImhhbmRsZVNob3J0Y3V0S2V5RXZlbnQiLCJwYXJzZUtleXMiLCJrZXlzIiwiZm9yRWFjaCIsIml0ZW0iLCJ0cmltIiwibGVuZ3RoIiwiRXJyb3IiLCJzZXRLZXlRdWV1ZSIsInB1c2giLCJwYXJzZURpc2FibGVkS2V5Iiwib3B0aW9ucyIsIlhFVXRpbHMiLCJlYWNoIiwiZGlzYWJsZWQiLCJjb25mIiwib3B0cyIsImlzU3RyaW5nIiwiYXNzaWduIiwicGFyc2VTZXR0aW5nS2V5Iiwic2V0dGluZyIsImNvbnNvbGUiLCJ3YXJuIiwicGFyc2VMaXN0ZW5lcktleSIsImxpc3RlbmVyIiwiaXNGdW5jdGlvbiIsInNldHVwIiwiVlhFVGFibGVQbHVnaW5TaG9ydGN1dEtleSIsImluc3RhbGwiLCJ4dGFibGUiLCJpbnRlcmNlcHRvciIsImFkZCIsIndpbmRvdyIsIlZYRVRhYmxlIiwidXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7O0FBT0EsSUFBTUEsU0FBUyxHQUFHLHFCQUFxQkMsS0FBckIsQ0FBMkIsR0FBM0IsQ0FBbEI7QUFDQSxJQUFNQyxXQUFXLEdBQUcsc0JBQXNCRCxLQUF0QixDQUE0QixHQUE1QixDQUFwQjtBQUNBLElBQU1FLFdBQVcsR0FBaUIsRUFBbEM7QUFDQSxJQUFNQyxZQUFZLEdBQWlCLEVBQW5DO0FBQ0EsSUFBTUMsWUFBWSxHQUFpQixFQUFuQzs7SUF3QmFDLEk7OztBQUtYLGdCQUFZQyxPQUFaLEVBQTZCQyxVQUE3QixFQUFpREMsUUFBakQsRUFBdUVDLEtBQXZFLEVBQThGO0FBQUE7O0FBQzVGLFNBQUtILE9BQUwsR0FBZUEsT0FBZjtBQUNBLFNBQUtDLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxTQUFLQyxLQUFMLEdBQWFBLEtBQWI7QUFDRDs7O1NBQ0Q7QUFBQTs7NEJBQW9CQyxNLEVBQWFDLEksRUFBUztBQUN4QyxVQUFJLENBQUMsS0FBS0osVUFBTixJQUFvQkksSUFBSSxXQUFJLEtBQUtKLFVBQVQsU0FBNUIsRUFBdUQ7QUFDckQsWUFBSSxLQUFLQyxRQUFULEVBQW1CO0FBQ2pCLGlCQUFPSSxXQUFXLENBQUMsS0FBS0osUUFBTixDQUFYLENBQTJCRSxNQUEzQixFQUFtQ0MsSUFBbkMsQ0FBUDtBQUNEO0FBQ0Y7QUFD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O0FBRXZDRSxFQUFBQSxPQUZ1QyxtQkFFL0JDLE1BRitCLEVBRU5sQixPQUZNLEVBRXNCO0FBQzNELFFBQUlBLE9BQUosRUFBYTtBQUNYZSxNQUFBQSxLQUFLLENBQUNmLE9BQUQsQ0FBTDtBQUNBa0IsTUFBQUEsTUFBTSxDQUFDQyxXQUFQLENBQW1CQyxHQUFuQixDQUF1QixlQUF2QixFQUF3Qy9CLHNCQUF4QztBQUNEO0FBQ0Y7QUFQc0MsQ0FBbEM7OztBQVVQLElBQUksT0FBT2dDLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE1BQU0sQ0FBQ0MsUUFBNUMsRUFBc0Q7QUFDcERELEVBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JQLHlCQUFwQjtBQUNEOztlQUVjQSx5QiIsImZpbGUiOiJpbmRleC5jb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgWEVVdGlscyBmcm9tICd4ZS11dGlscy9tZXRob2RzL3hlLXV0aWxzJ1xyXG5pbXBvcnQgVlhFVGFibGUgZnJvbSAndnhlLXRhYmxlL2xpYi92eGUtdGFibGUnXHJcblxyXG5pbnRlcmZhY2UgS2V5U3RvcmVNYXBzIHtcclxuICBbcHJvcE5hbWU6IHN0cmluZ106IGFueVtdO1xyXG59XHJcblxyXG5jb25zdCBhcnJvd0tleXMgPSAncmlnaHQsdXAsbGVmdCxkb3duJy5zcGxpdCgnLCcpXHJcbmNvbnN0IHNwZWNpYWxLZXlzID0gJ2FsdCxjdHJsLHNoaWZ0LG1ldGEnLnNwbGl0KCcsJylcclxuY29uc3Qgc2V0dGluZ01hcHM6IEtleVN0b3JlTWFwcyA9IHt9XHJcbmNvbnN0IGxpc3RlbmVyTWFwczogS2V5U3RvcmVNYXBzID0ge31cclxuY29uc3QgZGlzYWJsZWRNYXBzOiBLZXlTdG9yZU1hcHMgPSB7fVxyXG5cclxuZXhwb3J0IGNvbnN0IGVudW0gRlVOQ19OQU5FIHtcclxuICBUQUJMRV9FRElUX0FDVElWRUQgPSAndGFibGUuZWRpdC5hY3RpdmVkJyxcclxuICBUQUJMRV9FRElUX0NMT1NFRCA9ICd0YWJsZS5lZGl0LmNsb3NlZCcsXHJcbiAgVEFCTEVfRURJVF9SSUdIVFRBQk1PVkUgPSAndGFibGUuZWRpdC5yaWdodFRhYk1vdmUnLFxyXG4gIFRBQkxFX0VESVRfTEVGVFRBQk1PVkUgPSAndGFibGUuZWRpdC5sZWZ0VGFiTW92ZScsXHJcbiAgVEFCTEVfQ0VMTF9MRUZUTU9WRSA9ICd0YWJsZS5jZWxsLmxlZnRNb3ZlJyxcclxuICBUQUJMRV9DRUxMX1VQTU9WRSA9ICd0YWJsZS5jZWxsLnVwTW92ZScsXHJcbiAgVEFCTEVfQ0VMTF9SSUdIVE1PVkUgPSAndGFibGUuY2VsbC5yaWdodE1vdmUnLFxyXG4gIFRBQkxFX0NFTExfRE9XTk1PVkUgPSAndGFibGUuY2VsbC5kb3duTW92ZScsXHJcbiAgVEFCTEVfUk9XX0NVUlJFTlRfVE9QTU9WRSA9ICd0YWJsZS5yb3cuY3VycmVudC50b3BNb3ZlJyxcclxuICBUQUJMRV9ST1dfQ1VSUkVOVF9ET1dOTU9WRSA9ICd0YWJsZS5yb3cuY3VycmVudC5kb3duTW92ZScsXHJcbiAgUEFHRVJfUFJFVlBBR0UgPSAncGFnZXIucHJldlBhZ2UnLFxyXG4gIFBBR0VSX05FWFRQQUdFID0gJ3BhZ2VyLm5leHRQYWdlJyxcclxuICBQQUdFUl9QUkVWSlVNUCA9ICdwYWdlci5wcmV2SnVtcCcsXHJcbiAgUEFHRVJfTkVYVEpVTVAgPSAncGFnZXIubmV4dEp1bXAnXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBlbnVtIFNLRVlfTkFORSB7XHJcbiAgVFJJR0dFUiA9ICd0cmlnZ2VyJyxcclxuICBFTUlUID0gJ2VtaXQnXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTS2V5IHtcclxuICByZWFsS2V5OiBzdHJpbmc7XHJcbiAgc3BlY2lhbEtleTogc3RyaW5nO1xyXG4gIGZ1bmNOYW1lPzogRlVOQ19OQU5FO1xyXG4gIGtDb25mPzogU2hvcnRjdXRLZXlDb25mO1xyXG4gIGNvbnN0cnVjdG9yKHJlYWxLZXk6IHN0cmluZywgc3BlY2lhbEtleTogc3RyaW5nLCBmdW5jTmFtZT86IEZVTkNfTkFORSwga0NvbmY/OiBTaG9ydGN1dEtleUNvbmYpIHtcclxuICAgIHRoaXMucmVhbEtleSA9IHJlYWxLZXlcclxuICAgIHRoaXMuc3BlY2lhbEtleSA9IHNwZWNpYWxLZXlcclxuICAgIHRoaXMuZnVuY05hbWUgPSBmdW5jTmFtZVxyXG4gICAgdGhpcy5rQ29uZiA9IGtDb25mXHJcbiAgfVxyXG4gIFtTS0VZX05BTkUuVFJJR0dFUl0ocGFyYW1zOiBhbnksIGV2bnQ6IGFueSkge1xyXG4gICAgaWYgKCF0aGlzLnNwZWNpYWxLZXkgfHwgZXZudFtgJHt0aGlzLnNwZWNpYWxLZXl9S2V5YF0pIHtcclxuICAgICAgaWYgKHRoaXMuZnVuY05hbWUpIHtcclxuICAgICAgICByZXR1cm4gaGFuZGxlRnVuY3NbdGhpcy5mdW5jTmFtZV0ocGFyYW1zLCBldm50KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIFtTS0VZX05BTkUuRU1JVF0ocGFyYW1zOiBhbnksIGV2bnQ6IGFueSkge1xyXG4gICAgaWYgKCF0aGlzLnNwZWNpYWxLZXkgfHwgZXZudFtgJHt0aGlzLnNwZWNpYWxLZXl9S2V5YF0pIHtcclxuICAgICAgaWYgKHRoaXMua0NvbmYpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5rQ29uZi5jYWxsYmFjayhwYXJhbXMsIGV2bnQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEV2ZW50S2V5KGtleTogc3RyaW5nKTogc3RyaW5nIHtcclxuICBpZiAoYXJyb3dLZXlzLmluZGV4T2Yoa2V5LnRvTG93ZXJDYXNlKCkpID4gLTEpIHtcclxuICAgIHJldHVybiBgQXJyb3cke2tleX1gXHJcbiAgfVxyXG4gIHJldHVybiBrZXlcclxufVxyXG5cclxuZnVuY3Rpb24gaXNUcmlnZ2VyUGFnZShwYXJhbXM6IGFueSk6IGJvb2xlYW4ge1xyXG4gIGNvbnN0IHsgJHRhYmxlIH0gPSBwYXJhbXNcclxuICByZXR1cm4gISR0YWJsZS5nZXRBY3RpdmVSb3coKVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVDaGFuZ2VQYWdlKGZ1bmM6IHN0cmluZykge1xyXG4gIHJldHVybiBmdW5jdGlvbiAocGFyYW1zOiBhbnksIGV2bnQ6IGFueSk6IGFueSB7XHJcbiAgICBjb25zdCB7ICR0YWJsZSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IG1vdXNlQ29uZmlnID0ge30gfSA9ICR0YWJsZVxyXG4gICAgY29uc3QgJGdyaWQgPSAkdGFibGUuJGdyaWRcclxuICAgIGlmICgkZ3JpZCAmJiBtb3VzZUNvbmZpZy5zZWxlY3RlZCAhPT0gdHJ1ZSAmJiBbJ2lucHV0JywgJ3RleHRhcmVhJ10uaW5kZXhPZihldm50LnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpID09PSAtMSAmJiBpc1RyaWdnZXJQYWdlKHBhcmFtcykpIHtcclxuICAgICAgY29uc3QgcGFnZXIgPSAkZ3JpZC4kcmVmcy5wYWdlclxyXG4gICAgICBpZiAocGFnZXIpIHtcclxuICAgICAgICBldm50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBwYWdlcltmdW5jXShldm50KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVDZWxsVGFiTW92ZShpc0xlZnQ6IGJvb2xlYW4pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogYW55LCBldm50OiBhbnkpOiBhbnkge1xyXG4gICAgY29uc3QgeyAkdGFibGUgfSA9IHBhcmFtc1xyXG4gICAgY29uc3QgYWN0aXZlZCA9ICR0YWJsZS5nZXRBY3RpdmVSb3coKVxyXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSAkdGFibGUuZ2V0TW91c2VTZWxlY3RlZHMoKVxyXG4gICAgaWYgKHNlbGVjdGVkKSB7XHJcbiAgICAgICR0YWJsZS5tb3ZlVGFiU2VsZWN0ZWQoc2VsZWN0ZWQsIGlzTGVmdCwgZXZudClcclxuICAgIH0gZWxzZSBpZiAoYWN0aXZlZCkge1xyXG4gICAgICAkdGFibGUubW92ZVRhYlNlbGVjdGVkKGFjdGl2ZWQsIGlzTGVmdCwgZXZudClcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ2VsbE1vdmUoYXJyb3dJbmRleDogbnVtYmVyKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChwYXJhbXM6IGFueSwgZXZudDogYW55KTogYW55IHtcclxuICAgIGNvbnN0IHsgJHRhYmxlIH0gPSBwYXJhbXNcclxuICAgIGNvbnN0IHNlbGVjdGVkID0gJHRhYmxlLmdldE1vdXNlU2VsZWN0ZWRzKClcclxuICAgIGNvbnN0IGFycm93cyA9IFswLCAwLCAwLCAwXVxyXG4gICAgYXJyb3dzW2Fycm93SW5kZXhdID0gMVxyXG4gICAgaWYgKHNlbGVjdGVkKSB7XHJcbiAgICAgICR0YWJsZS5tb3ZlU2VsZWN0ZWQoc2VsZWN0ZWQsIGFycm93c1swXSwgYXJyb3dzWzFdLCBhcnJvd3NbMl0sIGFycm93c1szXSwgZXZudClcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVDdXJyZW50Um93TW92ZShpc0Rvd246IGJvb2xlYW4pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogYW55LCBldm50OiBhbnkpOiBhbnkge1xyXG4gICAgY29uc3QgeyAkdGFibGUgfSA9IHBhcmFtc1xyXG4gICAgaWYgKCR0YWJsZS5oaWdobGlnaHRDdXJyZW50Um93KSB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSAkdGFibGUuZ2V0Q3VycmVudFJvdygpXHJcbiAgICAgIGlmIChjdXJyZW50Um93KSB7XHJcbiAgICAgICAgJHRhYmxlLm1vdmVDdXJyZW50Um93KCFpc0Rvd24sIGlzRG93biwgZXZudClcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOW/q+aNt+mUruWkhOeQhuaWueazlVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGhhbmRsZUZ1bmNzID0ge1xyXG4gIFtGVU5DX05BTkUuVEFCTEVfRURJVF9BQ1RJVkVEXShwYXJhbXM6IGFueSwgZXZudDogYW55KTogYW55IHtcclxuICAgIGNvbnN0IHsgJHRhYmxlIH0gPSBwYXJhbXNcclxuICAgIGNvbnN0IHNlbGVjdGVkID0gJHRhYmxlLmdldE1vdXNlU2VsZWN0ZWRzKClcclxuICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICBldm50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgJHRhYmxlLnNldEFjdGl2ZUNlbGwoc2VsZWN0ZWQucm93LCBzZWxlY3RlZC5jb2x1bW4ucHJvcGVydHkpXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgW0ZVTkNfTkFORS5UQUJMRV9FRElUX0NMT1NFRF0ocGFyYW1zOiBhbnksIGV2bnQ6IGFueSk6IGFueSB7XHJcbiAgICBjb25zdCB7ICR0YWJsZSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IG1vdXNlQ29uZmlnID0ge30gfSA9ICR0YWJsZVxyXG4gICAgY29uc3QgYWN0aXZlZCA9ICR0YWJsZS5nZXRBY3RpdmVSb3coKVxyXG4gICAgaWYgKGFjdGl2ZWQpIHtcclxuICAgICAgZXZudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICR0YWJsZS5jbGVhckFjdGl2ZWQoZXZudClcclxuICAgICAgaWYgKG1vdXNlQ29uZmlnLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgJHRhYmxlLiRuZXh0VGljaygoKSA9PiAkdGFibGUuc2V0U2VsZWN0Q2VsbChhY3RpdmVkLnJvdywgYWN0aXZlZC5jb2x1bW4ucHJvcGVydHkpKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgW0ZVTkNfTkFORS5UQUJMRV9FRElUX1JJR0hUVEFCTU9WRV06IGhhbmRsZUNlbGxUYWJNb3ZlKGZhbHNlKSxcclxuICBbRlVOQ19OQU5FLlRBQkxFX0VESVRfTEVGVFRBQk1PVkVdOiBoYW5kbGVDZWxsVGFiTW92ZSh0cnVlKSxcclxuICBbRlVOQ19OQU5FLlRBQkxFX0NFTExfTEVGVE1PVkVdOiBoYW5kbGVDZWxsTW92ZSgwKSxcclxuICBbRlVOQ19OQU5FLlRBQkxFX0NFTExfVVBNT1ZFXTogaGFuZGxlQ2VsbE1vdmUoMSksXHJcbiAgW0ZVTkNfTkFORS5UQUJMRV9DRUxMX1JJR0hUTU9WRV06IGhhbmRsZUNlbGxNb3ZlKDIpLFxyXG4gIFtGVU5DX05BTkUuVEFCTEVfQ0VMTF9ET1dOTU9WRV06IGhhbmRsZUNlbGxNb3ZlKDMpLFxyXG4gIFtGVU5DX05BTkUuVEFCTEVfUk9XX0NVUlJFTlRfVE9QTU9WRV06IGhhbmRsZUN1cnJlbnRSb3dNb3ZlKGZhbHNlKSxcclxuICBbRlVOQ19OQU5FLlRBQkxFX1JPV19DVVJSRU5UX0RPV05NT1ZFXTogaGFuZGxlQ3VycmVudFJvd01vdmUodHJ1ZSksXHJcbiAgW0ZVTkNfTkFORS5QQUdFUl9QUkVWUEFHRV06IGhhbmRsZUNoYW5nZVBhZ2UoJ3ByZXZQYWdlJyksXHJcbiAgW0ZVTkNfTkFORS5QQUdFUl9ORVhUUEFHRV06IGhhbmRsZUNoYW5nZVBhZ2UoJ25leHRQYWdlJyksXHJcbiAgW0ZVTkNfTkFORS5QQUdFUl9QUkVWSlVNUF06IGhhbmRsZUNoYW5nZVBhZ2UoJ3ByZXZKdW1wJyksXHJcbiAgW0ZVTkNfTkFORS5QQUdFUl9ORVhUSlVNUF06IGhhbmRsZUNoYW5nZVBhZ2UoJ25leHRKdW1wJylcclxufVxyXG5cclxuZnVuY3Rpb24gcnVuRXZlbnQoa2V5OiBzdHJpbmcsIG1hcHM6IGFueSwgcHJvcDogU0tFWV9OQU5FLCBwYXJhbXM6IGFueSwgZXZudDogYW55KSB7XHJcbiAgbGV0IHNrZXlMaXN0ID0gbWFwc1trZXkudG9Mb3dlckNhc2UoKV1cclxuICBpZiAoc2tleUxpc3QpIHtcclxuICAgIHJldHVybiAhc2tleUxpc3Quc29tZSgoc2tleTogU0tleSkgPT4gc2tleVtwcm9wXShwYXJhbXMsIGV2bnQpID09PSBmYWxzZSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZVNob3J0Y3V0S2V5RXZlbnQocGFyYW1zOiBhbnksIGV2bnQ6IGFueSkge1xyXG4gIGxldCBrZXkgPSBnZXRFdmVudEtleShldm50LmtleSlcclxuICBpZiAoIXJ1bkV2ZW50KGtleSwgZGlzYWJsZWRNYXBzLCBTS0VZX05BTkUuRU1JVCwgcGFyYW1zLCBldm50KSkge1xyXG4gICAgaWYgKHJ1bkV2ZW50KGtleSwgc2V0dGluZ01hcHMsIFNLRVlfTkFORS5UUklHR0VSLCBwYXJhbXMsIGV2bnQpID09PSBmYWxzZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICAgIHJ1bkV2ZW50KGtleSwgbGlzdGVuZXJNYXBzLCBTS0VZX05BTkUuRU1JVCwgcGFyYW1zLCBldm50KVxyXG4gIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIHBhcnNlS2V5UmVzdCB7XHJcbiAgcmVhbEtleTogc3RyaW5nO1xyXG4gIHNwZWNpYWxLZXk6IHN0cmluZztcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VLZXlzKGtleTogc3RyaW5nKTogcGFyc2VLZXlSZXN0IHtcclxuICBsZXQgc3BlY2lhbEtleSA9ICcnXHJcbiAgbGV0IHJlYWxLZXkgPSAnJ1xyXG4gIGxldCBrZXlzID0ga2V5LnNwbGl0KCcrJylcclxuICBrZXlzLmZvckVhY2goKGl0ZW06IHN0cmluZykgPT4ge1xyXG4gICAgaXRlbSA9IGl0ZW0udG9Mb3dlckNhc2UoKS50cmltKClcclxuICAgIGlmIChzcGVjaWFsS2V5cy5pbmRleE9mKGl0ZW0pID4gLTEpIHtcclxuICAgICAgc3BlY2lhbEtleSA9IGl0ZW1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlYWxLZXkgPSBpdGVtXHJcbiAgICB9XHJcbiAgfSlcclxuICBpZiAoIXJlYWxLZXkgfHwga2V5cy5sZW5ndGggPiAyIHx8IChrZXlzLmxlbmd0aCA9PT0gMiAmJiAhc3BlY2lhbEtleSkpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgW3Z4ZS10YWJsZS1wbHVnaW4tc2hvcnRjdXQta2V5XSBJbnZhbGlkIHNob3J0Y3V0IGtleSBjb25maWd1cmF0aW9uICcke2tleX0nLmApXHJcbiAgfVxyXG4gIHJldHVybiB7IHJlYWxLZXksIHNwZWNpYWxLZXkgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRLZXlRdWV1ZShtYXBzOiBLZXlTdG9yZU1hcHMsIGtDb25mOiBTaG9ydGN1dEtleUNvbmYsIGZ1bmNOYW1lPzogRlVOQ19OQU5FKSB7XHJcbiAgbGV0IHsgcmVhbEtleSwgc3BlY2lhbEtleSB9ID0gcGFyc2VLZXlzKGtDb25mLmtleSlcclxuICBsZXQgc2tleUxpc3QgPSBtYXBzW3JlYWxLZXldXHJcbiAgaWYgKCFza2V5TGlzdCkge1xyXG4gICAgc2tleUxpc3QgPSBtYXBzW3JlYWxLZXldID0gW11cclxuICB9XHJcbiAgaWYgKHNrZXlMaXN0LnNvbWUoKHNrZXk6IFNLZXkpID0+IHNrZXkucmVhbEtleSA9PT0gcmVhbEtleSAmJiBza2V5LnNwZWNpYWxLZXkgPT09IHNwZWNpYWxLZXkpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFt2eGUtdGFibGUtcGx1Z2luLXNob3J0Y3V0LWtleV0gU2hvcnRjdXQga2V5IGNvbmZsaWN0ICcke2tDb25mLmtleX0nLmApXHJcbiAgfVxyXG4gIHNrZXlMaXN0LnB1c2gobmV3IFNLZXkocmVhbEtleSwgc3BlY2lhbEtleSwgZnVuY05hbWUsIGtDb25mKSlcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VEaXNhYmxlZEtleShvcHRpb25zOiBTaG9ydGN1dEtleU9wdGlvbnMpIHtcclxuICBYRVV0aWxzLmVhY2gob3B0aW9ucy5kaXNhYmxlZCwgKGNvbmY6IGFueSkgPT4ge1xyXG4gICAgbGV0IG9wdHMgPSBYRVV0aWxzLmlzU3RyaW5nKGNvbmYpID8geyBrZXk6IGNvbmYgfSA6IGNvbmZcclxuICAgIHNldEtleVF1ZXVlKGRpc2FibGVkTWFwcywgWEVVdGlscy5hc3NpZ24oeyBjYWxsYmFjazogKCkgPT4gZmFsc2UgfSwgb3B0cykpXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VTZXR0aW5nS2V5KG9wdGlvbnM6IFNob3J0Y3V0S2V5T3B0aW9ucykge1xyXG4gIFhFVXRpbHMuZWFjaChvcHRpb25zLnNldHRpbmcsIChvcHRzOiBhbnksIGZ1bmNOYW1lOiBGVU5DX05BTkUpID0+IHtcclxuICAgIGxldCBrQ29uZiA9IFhFVXRpbHMuaXNTdHJpbmcob3B0cykgPyB7IGtleTogb3B0cyB9IDogb3B0c1xyXG4gICAgaWYgKCFoYW5kbGVGdW5jc1tmdW5jTmFtZV0pIHtcclxuICAgICAgY29uc29sZS53YXJuKGBbdnhlLXRhYmxlLXBsdWdpbi1zaG9ydGN1dC1rZXldICcke2Z1bmNOYW1lfScgbm90IGV4aXN0LmApXHJcbiAgICB9XHJcbiAgICBzZXRLZXlRdWV1ZShzZXR0aW5nTWFwcywga0NvbmYsIGZ1bmNOYW1lKVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlTGlzdGVuZXJLZXkob3B0aW9uczogU2hvcnRjdXRLZXlPcHRpb25zKSB7XHJcbiAgWEVVdGlscy5lYWNoKG9wdGlvbnMubGlzdGVuZXIsIChjYWxsYmFjazogRnVuY3Rpb24sIGtleTogc3RyaW5nKSA9PiB7XHJcbiAgICBpZiAoIVhFVXRpbHMuaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcclxuICAgICAgY29uc29sZS53YXJuKGBbdnhlLXRhYmxlLXBsdWdpbi1zaG9ydGN1dC1rZXldICcke2tleX0nIHJlcXVpcmVzIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBzZXQuYClcclxuICAgIH1cclxuICAgIHNldEtleVF1ZXVlKGxpc3RlbmVyTWFwcywgeyBrZXksIGNhbGxiYWNrIH0pXHJcbiAgfSlcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTaG9ydGN1dEtleUNvbmYge1xyXG4gIGtleTogc3RyaW5nO1xyXG4gIGNhbGxiYWNrOiBGdW5jdGlvblxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNob3J0Y3V0S2V5T3B0aW9ucyB7XHJcbiAgZGlzYWJsZWQ6IHN0cmluZyB8IFNob3J0Y3V0S2V5Q29uZltdO1xyXG4gIGxpc3RlbmVyOiBvYmplY3Q7XHJcbiAgc2V0dGluZzogb2JqZWN0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cChvcHRpb25zOiBhbnkpIHtcclxuICBpZiAob3B0aW9ucykge1xyXG4gICAgcGFyc2VEaXNhYmxlZEtleShvcHRpb25zKVxyXG4gICAgcGFyc2VTZXR0aW5nS2V5KG9wdGlvbnMpXHJcbiAgICBwYXJzZUxpc3RlbmVyS2V5KG9wdGlvbnMpXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5Z+65LqOIHZ4ZS10YWJsZSDooajmoLznmoTlop7lvLrmj5Lku7bvvIzkuLrplK7nm5jmk43kvZzmj5Dkvpvlv6vmjbfplK7nmoTorr7nva5cclxuICovXHJcbmV4cG9ydCBjb25zdCBWWEVUYWJsZVBsdWdpblNob3J0Y3V0S2V5ID0ge1xyXG4gIHNldHVwLFxyXG4gIGluc3RhbGwoeHRhYmxlOiB0eXBlb2YgVlhFVGFibGUsIG9wdGlvbnM/OiBTaG9ydGN1dEtleU9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zKSB7XHJcbiAgICAgIHNldHVwKG9wdGlvbnMpXHJcbiAgICAgIHh0YWJsZS5pbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmtleWRvd24nLCBoYW5kbGVTaG9ydGN1dEtleUV2ZW50KVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5WWEVUYWJsZSkge1xyXG4gIHdpbmRvdy5WWEVUYWJsZS51c2UoVlhFVGFibGVQbHVnaW5TaG9ydGN1dEtleSlcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVlhFVGFibGVQbHVnaW5TaG9ydGN1dEtleVxyXG4iXX0=
