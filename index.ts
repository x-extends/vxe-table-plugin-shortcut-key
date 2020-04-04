/* eslint-disable no-unused-vars */
import XEUtils from 'xe-utils/methods/xe-utils'
import { VXETable, InterceptorKeydownParams } from 'vxe-table/lib/vxe-table'

export const enum FUNC_NANE {
  TABLE_EDIT_ACTIVED = 'table.edit.actived',
  TABLE_EDIT_CLOSED = 'table.edit.closed',
  TABLE_CELL_LEFTMOVE = 'table.cell.leftMove',
  TABLE_CELL_UPMOVE = 'table.cell.upMove',
  TABLE_CELL_RIGHTMOVE = 'table.cell.rightMove',
  TABLE_CELL_DOWNMOVE = 'table.cell.downMove',
  TABLE_ROW_CURRENT_TOPMOVE = 'table.row.current.topMove',
  TABLE_ROW_CURRENT_DOWNMOVE = 'table.row.current.downMove',
  PAGER_PREVPAGE = 'pager.prevPage',
  PAGER_NEXTPAGE = 'pager.nextPage',
  PAGER_PREVJUMP = 'pager.prevJump',
  PAGER_NEXTJUMP = 'pager.nextJump'
}

export const enum SKEY_NANE {
  TRIGGER = 'trigger',
  EMIT = 'emit'
}
/* eslint-enable no-unused-vars */

interface KeyStoreMaps {
  [propName: string]: SKey[];
}

const arrowKeys = 'right,up,left,down'.split(',')
const specialKeys = 'alt,ctrl,shift,meta'.split(',')
const settingMaps: KeyStoreMaps = {}
const listenerMaps: KeyStoreMaps = {}
const disabledMaps: KeyStoreMaps = {}

export class SKey {
  realKey: string;
  specialKey: string;
  funcName?: FUNC_NANE;
  kConf?: ShortcutKeyConf;
  constructor (realKey: string, specialKey: string, funcName?: FUNC_NANE, kConf?: ShortcutKeyConf) {
    this.realKey = realKey
    this.specialKey = specialKey
    this.funcName = funcName
    this.kConf = kConf
  }
  [SKEY_NANE.TRIGGER] (params: InterceptorKeydownParams, evnt: any) {
    if (!this.specialKey || evnt[`${this.specialKey}Key`]) {
      if (this.funcName) {
        return handleFuncs[this.funcName](params, evnt)
      }
    }
  }
  [SKEY_NANE.EMIT] (params: InterceptorKeydownParams, evnt: any) {
    if (!this.specialKey || evnt[`${this.specialKey}Key`]) {
      if (this.kConf) {
        return this.kConf.callback(params, evnt)
      }
    }
  }
}

function getEventKey (key: string): string {
  if (arrowKeys.indexOf(key.toLowerCase()) > -1) {
    return `Arrow${key}`
  }
  return key
}

function isTriggerPage (params: InterceptorKeydownParams): boolean {
  return !params.$table.getActiveRecord()
}

function handleChangePage (func: string) {
  return function (params: InterceptorKeydownParams, evnt: any) {
    const { $grid, $table } = params
    const { mouseConfig = {} } = $table
    if ($grid && mouseConfig.selected !== true && ['input', 'textarea'].indexOf(evnt.target.tagName.toLowerCase()) === -1 && isTriggerPage(params)) {
      const pager: any = $grid.$refs.pager
      if (pager) {
        evnt.preventDefault()
        pager[func](evnt)
      }
    }
  }
}

function handleCellMove (arrowIndex: number) {
  return function (params: InterceptorKeydownParams, evnt: any) {
    const $table: any = params.$table
    const selected = $table.getSelectedCell()
    const actived = $table.getActiveRecord()
    const arrows: number[] = [0, 0, 0, 0]
    arrows[arrowIndex] = 1
    if (selected.row || actived.row) {
      $table.moveSelected(selected.row ? selected.args : actived.args, arrows[0], arrows[1], arrows[2], arrows[3], evnt)
      return false
    }
  }
}

function handleCurrentRowMove (isDown: boolean) {
  return function (params: InterceptorKeydownParams, evnt: any) {
    const $table: any = params.$table
    if ($table.highlightCurrentRow) {
      const currentRow = $table.getCurrentRecord()
      if (currentRow) {
        $table.moveCurrentRow(!isDown, isDown, evnt)
        return false
      }
    }
  }
}

/**
 * 快捷键处理方法
 */
export const handleFuncs = {
  [FUNC_NANE.TABLE_EDIT_ACTIVED] (params: InterceptorKeydownParams, evnt: any) {
    const { $table } = params
    const selected = $table.getSelectedCell()
    if (selected) {
      evnt.preventDefault()
      $table.setActiveCell(selected.row, selected.column.property)
      return false
    }
  },
  [FUNC_NANE.TABLE_EDIT_CLOSED] (params: InterceptorKeydownParams, evnt: any) {
    const { $table } = params
    const { mouseConfig = {} } = $table
    const actived = $table.getActiveRecord()
    if (actived) {
      evnt.preventDefault()
      $table.clearActived()
      if (mouseConfig.selected) {
        $table.$nextTick(() => $table.setSelectCell(actived.row, actived.column.property))
      }
      return false
    }
  },
  [FUNC_NANE.TABLE_CELL_LEFTMOVE]: handleCellMove(0),
  [FUNC_NANE.TABLE_CELL_UPMOVE]: handleCellMove(1),
  [FUNC_NANE.TABLE_CELL_RIGHTMOVE]: handleCellMove(2),
  [FUNC_NANE.TABLE_CELL_DOWNMOVE]: handleCellMove(3),
  [FUNC_NANE.TABLE_ROW_CURRENT_TOPMOVE]: handleCurrentRowMove(false),
  [FUNC_NANE.TABLE_ROW_CURRENT_DOWNMOVE]: handleCurrentRowMove(true),
  [FUNC_NANE.PAGER_PREVPAGE]: handleChangePage('prevPage'),
  [FUNC_NANE.PAGER_NEXTPAGE]: handleChangePage('nextPage'),
  [FUNC_NANE.PAGER_PREVJUMP]: handleChangePage('prevJump'),
  [FUNC_NANE.PAGER_NEXTJUMP]: handleChangePage('nextJump')
}

function runEvent (key: string, maps: any, prop: SKEY_NANE, params: InterceptorKeydownParams, evnt: any) {
  let skeyList: SKey[] = maps[key.toLowerCase()]
  if (skeyList) {
    return !skeyList.some((skey: SKey) => skey[prop](params, evnt) === false)
  }
}

function handleShortcutKeyEvent (params: InterceptorKeydownParams, evnt: any) {
  let key: string = getEventKey(evnt.key)
  if (!runEvent(key, disabledMaps, SKEY_NANE.EMIT, params, evnt)) {
    if (runEvent(key, settingMaps, SKEY_NANE.TRIGGER, params, evnt) === false) {
      return false
    }
    runEvent(key, listenerMaps, SKEY_NANE.EMIT, params, evnt)
  }
}

interface parseKeyRest {
  realKey: string;
  specialKey: string;
}

function parseKeys (key: string): parseKeyRest {
  let specialKey = ''
  let realKey = ''
  let keys = key.split('+')
  keys.forEach((item) => {
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
  return { realKey, specialKey }
}

function setKeyQueue (maps: KeyStoreMaps, kConf: ShortcutKeyConf, funcName?: FUNC_NANE) {
  let { realKey, specialKey } = parseKeys(kConf.key)
  let skeyList: SKey[] = maps[realKey]
  if (!skeyList) {
    skeyList = maps[realKey] = []
  }
  if (skeyList.some((skey) => skey.realKey === realKey && skey.specialKey === specialKey)) {
    throw new Error(`[vxe-table-plugin-shortcut-key] Shortcut key conflict '${kConf.key}'.`)
  }
  skeyList.push(new SKey(realKey, specialKey, funcName, kConf))
}

function parseDisabledKey (options: ShortcutKeyOptions) {
  XEUtils.each(options.disabled, (conf: string | ShortcutKeyConf) => {
    let opts: any = XEUtils.isString(conf) ? { key: conf } : conf
    setKeyQueue(disabledMaps, XEUtils.assign({ callback: () => false }, opts))
  })
}

function parseSettingKey (options: ShortcutKeyOptions) {
  XEUtils.each(options.setting, (opts: string | ShortcutKeySettingConfig, funcName: FUNC_NANE) => {
    let kConf: any = XEUtils.isString(opts) ? { key: opts } : opts
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
  key: string;
  callback: Function
}

export interface ShortcutKeyListenerConfig {
  [funcName: string]: (params: InterceptorKeydownParams, evnt: any) => any;
}

export interface ShortcutKeySettingConfig {
  [funcName: string]: string;
}

export interface ShortcutKeyOptions {
  disabled?: string[] | ShortcutKeyConf[];
  listener?: ShortcutKeyListenerConfig;
  setting?: ShortcutKeySettingConfig;
}

/**
 * 设置参数
 * @param options 参数
 */
function setup (options: ShortcutKeyOptions) {
  if (options) {
    parseDisabledKey(options)
    parseSettingKey(options)
    parseListenerKey(options)
  }
}

/**
 * 基于 vxe-table 表格的增强插件，为键盘操作提供快捷键的设置
 */
export const VXETablePluginShortcutKey = {
  setup,
  install (xtable: typeof VXETable, options?: ShortcutKeyOptions) {
    if (options) {
      setup(options)
    }
    xtable.interceptor.add('event.keydown', handleShortcutKeyEvent)
  }
}

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginShortcutKey)
}

export default VXETablePluginShortcutKey
