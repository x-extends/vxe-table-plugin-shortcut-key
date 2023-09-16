import XEUtils from 'xe-utils'
import { VXETable, InterceptorKeydownParams } from 'vxe-table'

/**
 * 功能键
 */
export const enum FUNC_NANE {
  /**
   * 只对 edit-config 启用后有效，当单元格处于选中状态时，则进入编辑
   */
  TABLE_EDIT_ACTIVED = 'table.edit.actived',
  /**
   * 只对 edit-config 启用后有效，当单元格处于激活状态时，则退出编辑
   */
  TABLE_EDIT_CLOSED = 'table.edit.closed',
  /**
   * 只对 edit-config / mouse-config 启用后有效，当单元格处于激活状态或者选中状态，则移动到左侧单元格
   */
  TABLE_EDIT_TAB_LEFT_MOVE = 'table.edit.tab.leftMove',
  /**
   * 只对 edit-config / mouse-config 启用后有效，当单元格处于激活状态或者选中状态，则移动到右侧单元格
   */
  TABLE_EDIT_TAB_RIGHT_MOVE = 'table.edit.tab.rightMove',
  /**
   * 只对 edit-config / mouse-config 启用后有效，当单元格处于激活状态或者选中状态，则移动到上面单元格
   */
  TABLE_EDIT_ENTER_UP_MOVE = 'table.edit.enter.upMove',
  /**
   * 只对 edit-config / mouse-config 启用后有效，当单元格处于激活状态或者选中状态，则移动到下面单元格
   */
  TABLE_EDIT_ENTER_DOWN_MOVE = 'table.edit.enter.downMove',
  /**
   * 只对 mouse-config 启用后有效，当单元格处于选中状态，则移动到左边的单元格
   */
  TABLE_CELL_LEFT_MOVE = 'table.cell.leftMove',
  /**
   * 只对 mouse-config 启用后有效，当单元格处于选中状态，则移动到上面的单元格
   */
  TABLE_CELL_UP_MOVE = 'table.cell.upMove',
  /**
   * 只对 mouse-config 启用后有效，当单元格处于选中状态，则移动到右边的单元格
   */
  TABLE_CELL_RIGHT_MOVE = 'table.cell.rightMove',
  /**
   * 只对 mouse-config 启用后有效，当单元格处于选中状态，则移动到下面的单元格
   */
  TABLE_CELL_DOWN_MOVE = 'table.cell.downMove',
  /**
   * 只对 highlight-current-row 启用后有效，高亮行向上移动
   */
  TABLE_ROW_CURRENT_TOP_MOVE = 'table.row.current.topMove',
  /**
   * 只对 highlight-current-row 启用后有效，高亮行向上移动
   */
  TABLE_ROW_CURRENT_DOWN_MOVE = 'table.row.current.downMove',
  /**
   * 只对 pager-config 启用后有效，则进入上一页
   */
  PAGER_PREV_PAGE = 'pager.prevPage',
  /**
   * 只对 pager-config 启用后有效，则进入下一页
   */
  PAGER_NEXT_PAGE = 'pager.nextPage',
  /**
   * 只对 pager-config 启用后有效，则向上翻页
   */
  PAGER_PREV_JUMP = 'pager.prevJump',
  /**
   * 只对 pager-config 启用后有效，则向下翻页
   */
  PAGER_NEXT_JUMP = 'pager.nextJump'
}

export const enum SKEY_NANE {
  TRIGGER = 'trigger',
  EMIT = 'emit'
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
      if (this.funcName && handleFuncs[this.funcName]) {
        return handleFuncs[this.funcName](params, evnt)
      }
    }
  }

  [SKEY_NANE.EMIT] (params: InterceptorKeydownParams, evnt: any) {
    if (!this.specialKey || evnt[`${this.specialKey}Key`]) {
      if (this.kConf && this.kConf.callback) {
        return this.kConf.callback(params, evnt)
      }
    }
  }
}

interface KeyStoreMaps {
  [propName: string]: SKey[];
}

const arrowKeys = 'right,up,left,down'.split(',')
const specialKeys = 'alt,ctrl,shift,meta'.split(',')
const settingMaps: KeyStoreMaps = {}
const listenerMaps: KeyStoreMaps = {}
const disabledMaps: KeyStoreMaps = {}

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

function handleCellTabMove (isLeft: boolean) {
  return function (params: any, evnt: any): any {
    const { $table } = params
    const targetParams = $table.getActiveRecord() || $table.getSelectedCell()
    if (targetParams) {
      $table.moveTabSelected(targetParams, isLeft, evnt)
    }
    return false
  }
}

function handleCellEnterMove (isTop: boolean) {
  return function (params: any, evnt: any): any {
    const { $table } = params
    const targetParams = $table.getActiveRecord() || $table.getSelectedCell()
    if (targetParams) {
      $table.moveSelected(targetParams, false, !isTop, false, isTop, evnt)
    }
    return false
  }
}

function handleCellMove (arrowIndex: number) {
  return function (params: InterceptorKeydownParams, evnt: any) {
    const $table: any = params.$table
    const selecteParams = $table.getSelectedCell()
    const arrows: number[] = [0, 0, 0, 0]
    arrows[arrowIndex] = 1
    if (selecteParams) {
      $table.moveSelected(selecteParams, arrows[0], arrows[1], arrows[2], arrows[3], evnt)
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
  [FUNC_NANE.TABLE_EDIT_TAB_RIGHT_MOVE]: handleCellTabMove(false),
  [FUNC_NANE.TABLE_EDIT_TAB_LEFT_MOVE]: handleCellTabMove(true),
  [FUNC_NANE.TABLE_EDIT_ENTER_UP_MOVE]: handleCellEnterMove(false),
  [FUNC_NANE.TABLE_EDIT_ENTER_DOWN_MOVE]: handleCellEnterMove(true),
  [FUNC_NANE.TABLE_CELL_LEFT_MOVE]: handleCellMove(0),
  [FUNC_NANE.TABLE_CELL_UP_MOVE]: handleCellMove(1),
  [FUNC_NANE.TABLE_CELL_RIGHT_MOVE]: handleCellMove(2),
  [FUNC_NANE.TABLE_CELL_DOWN_MOVE]: handleCellMove(3),
  [FUNC_NANE.TABLE_ROW_CURRENT_TOP_MOVE]: handleCurrentRowMove(false),
  [FUNC_NANE.TABLE_ROW_CURRENT_DOWN_MOVE]: handleCurrentRowMove(true),
  [FUNC_NANE.PAGER_PREV_PAGE]: handleChangePage('prevPage'),
  [FUNC_NANE.PAGER_NEXT_PAGE]: handleChangePage('nextPage'),
  [FUNC_NANE.PAGER_PREV_JUMP]: handleChangePage('prevJump'),
  [FUNC_NANE.PAGER_NEXT_JUMP]: handleChangePage('nextJump')
}

function runEvent (key: string, maps: any, prop: SKEY_NANE, params: InterceptorKeydownParams, evnt: any) {
  const skeyList: SKey[] = maps[key.toLowerCase()]
  if (skeyList) {
    return !skeyList.some((skey: SKey) => skey[prop](params, evnt) === false)
  }
}

function handleShortcutKeyEvent (params: InterceptorKeydownParams, e: any) {
  const evnt = params.$event || e
  const key: string = getEventKey(evnt.key)
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
  const keys = key.split('+')
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
  const { realKey, specialKey } = parseKeys(kConf.key)
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
    const opts: any = XEUtils.isString(conf) ? { key: conf } : conf
    setKeyQueue(disabledMaps, XEUtils.assign({ callback: () => false }, opts))
  })
}

function parseSettingKey (options: ShortcutKeyOptions) {
  XEUtils.each(options.setting, (opts: string | ShortcutKeySettingConfig, funcName: any) => {
    const kConf: any = XEUtils.isString(opts) ? { key: opts } : opts
    if (!handleFuncs[funcName as FUNC_NANE]) {
      console.error(`[vxe-table-plugin-shortcut-key] '${funcName}' not exist.`)
    }
    setKeyQueue(settingMaps, kConf, funcName)
  })
}

function parseListenerKey (options: ShortcutKeyOptions) {
  XEUtils.each(options.listener, (callback: Function, key: string) => {
    if (!XEUtils.isFunction(callback)) {
      console.error(`[vxe-table-plugin-shortcut-key] '${key}' requires the callback function to be set.`)
    }
    setKeyQueue(listenerMaps, { key, callback })
  })
}

/**
 * 设置参数
 * @param options 参数
 */
function pluginSetup (options: ShortcutKeyOptions) {
  if (options) {
    parseDisabledKey(options)
    parseSettingKey(options)
    parseListenerKey(options)
  }
}

/**
 * 基于 vxe-table 表格的增强插件，为键盘操作提供快捷键设置
 */
export const VXETablePluginShortcutKey = {
  setup: pluginSetup,
  install (vxetable: typeof VXETable, options?: ShortcutKeyOptions) {
    // 检查版本
    if (!/^(2|3)\./.test(vxetable.version)) {
      console.error('[vxe-table-plugin-shortcut-key] Version vxe-table 3.x is required')
    }

    if (options) {
      pluginSetup(options)
    }
    vxetable.interceptor.add('event.keydown', handleShortcutKeyEvent)
  }
}

if (typeof window !== 'undefined' && window.VXETable && window.VXETable.use) {
  window.VXETable.use(VXETablePluginShortcutKey)
}

export default VXETablePluginShortcutKey
