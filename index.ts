import XEUtils from 'xe-utils/methods/xe-utils'
import { VXETable } from 'vxe-table'

const arrowKeys = 'right,up,left,down'.split(',')
const specialKeys = 'alt,ctrl,shift,meta'.split(',')
const settingMaps = {}
const listenerMaps = {}
const disabledMaps = {}

export const enum FUNC_NANE {
  TABLE_EDIT_ACTIVED = 'table.edit.actived',
  TABLE_EDIT_CLOSED = 'table.edit.closed',
  TABLE_EDIT_RIGHTTABMOVE = 'table.edit.rightTabMove',
  TABLE_EDIT_LEFTTABMOVE = 'table.edit.leftTabMove',
  TABLE_CELL_LEFTMOVE = 'table.cell.leftMove',
  TABLE_CELL_UPMOVE = 'table.cell.upMove',
  TABLE_CELL_RIGHTMOVE = 'table.cell.rightMove',
  TABLE_CELL_DOWNMOVE = 'table.cell.downMove',
  PAGER_PREVPAGE = 'pager.prevPage',
  PAGER_NEXTPAGE = 'pager.nextPage',
  PAGER_PREVJUMP = 'pager.prevJump',
  PAGER_NEXTJUMP = 'pager.nextJump'
}

export const enum SKEY_NANE {
  TRIGGER = 'trigger',
  EMIT = 'emit'
}

export class SKey {
  realKey: string;
  specialKey: string;
  funcName: FUNC_NANE;
  kConf: ShortcutKeyConf;
  constructor (realKey: string, specialKey: string, funcName: FUNC_NANE, kConf: ShortcutKeyConf) {
    this.realKey = realKey
    this.specialKey = specialKey
    this.funcName = funcName
    this.kConf = kConf
  }
  [SKEY_NANE.TRIGGER] (params: any, evnt: any) {
    if (!this.specialKey || evnt[`${this.specialKey}Key`]) {
      return handleFuncs[this.funcName](params, evnt)
    }
  }
  [SKEY_NANE.EMIT] (params: any, evnt: any) {
    if (!this.specialKey || evnt[`${this.specialKey}Key`]) {
      return this.kConf.callback(params, evnt)
    }
  }
}

function getEventKey (key: string) {
  if (arrowKeys.indexOf(key.toLowerCase()) > -1) {
    return `Arrow${key}`
  }
  return key
}

function isTriggerPage (params: any) {
  const { $table } = params
  return !$table.getActiveRow()
}

function handleChangePage (func: string) {
  return function (params: any, evnt: any) {
    const { $table } = params
    const { mouseConfig = {} } = $table
    const $grid = $table.$grid
    if ($grid && mouseConfig.selected !== true && ['input', 'textarea'].indexOf(evnt.target.tagName.toLowerCase()) === -1 && isTriggerPage(params)) {
      const pager = $grid.$refs.pager
      if (pager) {
        evnt.preventDefault()
        pager[func](evnt)
      }
    }
  }
}

function handleTabMove (isLeft: boolean) {
  return function (params: any, evnt: any) {
    const { $table } = params
    const actived = $table.getActiveRow()
    const selected = $table.getMouseSelecteds()
    if (selected) {
      $table.moveTabSelected(selected, isLeft, evnt)
    } else if (actived) {
      $table.moveTabSelected(actived, isLeft, evnt)
    }
    return false
  }
}

function handleArrowMove (arrowIndex: number) {
  return function (params: any, evnt: any) {
    const { $table } = params
    const selected = $table.getMouseSelecteds()
    const arrows = [0, 0, 0, 0]
    arrows[arrowIndex] = 1
    if (selected) {
      $table.moveSelected(selected, arrows[0], arrows[1], arrows[2], arrows[3], evnt)
      return false
    }
  }
}

/**
 * 快捷键处理方法
 */
export const handleFuncs = {
  [FUNC_NANE.TABLE_EDIT_ACTIVED] (params: any, evnt: any) {
    const { $table } = params
    const selected = $table.getMouseSelecteds()
    if (selected) {
      evnt.preventDefault()
      $table.setActiveCell(selected.row, selected.column.property)
      return false
    }
  },
  [FUNC_NANE.TABLE_EDIT_CLOSED] (params: any, evnt: any) {
    const { $table } = params
    const { mouseConfig = {} } = $table
    const actived = $table.getActiveRow()
    if (actived) {
      evnt.preventDefault()
      $table.clearActived(evnt)
      if (mouseConfig.selected) {
        $table.$nextTick(() => $table.setSelectCell(actived.row, actived.column.property))
      }
      return false
    }
  },
  [FUNC_NANE.TABLE_EDIT_RIGHTTABMOVE]: handleTabMove(false),
  [FUNC_NANE.TABLE_EDIT_LEFTTABMOVE]: handleTabMove(true),
  [FUNC_NANE.TABLE_CELL_LEFTMOVE]: handleArrowMove(0),
  [FUNC_NANE.TABLE_CELL_UPMOVE]: handleArrowMove(1),
  [FUNC_NANE.TABLE_CELL_RIGHTMOVE]: handleArrowMove(2),
  [FUNC_NANE.TABLE_CELL_DOWNMOVE]: handleArrowMove(3),
  [FUNC_NANE.PAGER_PREVPAGE]: handleChangePage('prevPage'),
  [FUNC_NANE.PAGER_NEXTPAGE]: handleChangePage('nextPage'),
  [FUNC_NANE.PAGER_PREVJUMP]: handleChangePage('prevJump'),
  [FUNC_NANE.PAGER_NEXTJUMP]: handleChangePage('nextJump')
}

function runEvent (key: string, maps: any, prop: SKEY_NANE, params: any, evnt: any) {
  let skeyList = maps[key.toLowerCase()]
  if (skeyList) {
    return skeyList.some((skey: SKey) => skey[prop](params, evnt) === false)
  }
}

function handleShortcutKeyEvent (params: any, evnt: any) {
  let key = getEventKey(evnt.key)
  if (!runEvent(key, disabledMaps, SKEY_NANE.EMIT, params, evnt)) {
    runEvent(key, settingMaps, SKEY_NANE.TRIGGER, params, evnt)
    runEvent(key, listenerMaps, SKEY_NANE.EMIT, params, evnt)
  }
}

function parseKeys (key: string) {
  let specialKey
  let realKey
  let keys = key.split('+')
  keys.forEach((item: string) => {
    item = item.toLowerCase().trim()
    if (specialKeys.indexOf(item) > -1) {
      specialKey = item
    } else {
      realKey = item
    }
  })
  if (!realKey || keys.length > 2 || (keys.length === 2 && !specialKey)) {
    throw new Error(`[vxe-table-plugin-shortcut-key] Invalid shortcut key configuration '${key}'.`)
  }
  return { specialKey, realKey }
}

function setKeyQueue (maps: any, kConf: ShortcutKeyConf, funcName?: FUNC_NANE) {
  let { specialKey, realKey } = parseKeys(kConf.key)
  let skeyList = maps[realKey]
  if (!skeyList) {
    skeyList = maps[realKey] = []
  }
  if (skeyList.some((skey: SKey) => skey.realKey === realKey && skey.specialKey === specialKey)) {
    throw new Error(`[vxe-table-plugin-shortcut-key] Shortcut key conflict '${kConf.key}'.`)
  }
  skeyList.push(new SKey(realKey, specialKey, funcName, kConf))
}

function parseDisabledKey (options: ShortcutKeyOptions) {
  XEUtils.each(options.disabled, (conf: any) => {
    let opts = XEUtils.isString(conf) ? { key: conf } : conf
    setKeyQueue(disabledMaps, XEUtils.assign({ callback: () => false }, opts))
  })
}

function parseSettingKey (options: ShortcutKeyOptions) {
  XEUtils.each(options.setting, (opts: any, funcName: FUNC_NANE) => {
    let kConf = XEUtils.isString(opts) ? { key: opts } : opts
    if (!handleFuncs[funcName]) {
      console.warn(`[vxe-table-plugin-shortcut-key] '${funcName}' not exist.`)
    }
    setKeyQueue(settingMaps, kConf, funcName)
  })
}

function parseListenerKey (options: ShortcutKeyOptions) {
  XEUtils.each(options.listener, (callback: Function, key: string) => {
    if (!XEUtils.isFunction(callback)) {
      console.warn(`[vxe-table-plugin-shortcut-key] '${key}' requires the callback function to be set.`)
    }
    setKeyQueue(listenerMaps, { key, callback })
  })
}

export interface ShortcutKeyConf {
  key?: string;
  callback?: Function
}

export interface ShortcutKeyOptions {
  disabled: string | Array<ShortcutKeyConf>;
  listener: object;
  setting: object;
}

/**
 * 基于 vxe-table 表格的增强插件，为键盘操作提供快捷键的设置
 */
export const VXETablePluginShortcutKey = {
  install (xtable: typeof VXETable, options?: ShortcutKeyOptions) {
    if (options) {
      parseDisabledKey(options)
      parseSettingKey(options)
      parseListenerKey(options)
      xtable.interceptor.add('event.keydown', handleShortcutKeyEvent)
    }
  }
}

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginShortcutKey)
}

export default VXETablePluginShortcutKey
