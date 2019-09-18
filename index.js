import XEUtils from 'xe-utils/methods/xe-utils'

const arrowKeys = 'right,up,left,down'.split(',')
const specialKeys = 'alt,ctrl,shift,meta'.split(',')
const shortcutMap = {}

const globalOptions = {}

const keyboardCode = {
  37: 'ArrowRight',
  38: 'ArrowUp',
  39: 'ArrowLeft',
  40: 'ArrowDown'
}

class SKey {
  constructor (realKey, specialKey, funcName) {
    this.realKey = realKey
    this.specialKey = specialKey
    this.funcName = funcName
  }
  trigger (params, evnt) {
    if (!this.specialKey || evnt[`${this.specialKey}Key`]) {
      return handleFuncs[this.funcName](params, evnt)
    }
  }
}

function getEventKey (key) {
  if (arrowKeys.indexOf(key.toLowerCase()) > -1) {
    return `Arrow${key}`
  }
  return key
}

function isTriggerPage (params) {
  const { $table } = params
  return !$table.getActiveRow()
}

function handleChangePage (func) {
  return function (params, evnt) {
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

const handleFuncs = {
  'table.edit.actived' (params, evnt) {
    const { $table } = params
    const { row, column } = $table.getMouseSelecteds()
    if (row && column) {
      evnt.preventDefault()
      $table.setActiveCell(row, column.property)
      return false
    }
  },
  'table.edit.closed' (params, evnt) {
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
  'pager.prevPage': handleChangePage('prevPage'),
  'pager.nextPage': handleChangePage('nextPage'),
  'pager.prevJump': handleChangePage('prevJump'),
  'pager.nextJump': handleChangePage('nextJump')
}

function handleShortcutKeyEvent (params, evnt) {
  let key = getEventKey(evnt.key) || keyboardCode[evnt.keyCode]
  let skeyList = shortcutMap[key.toLowerCase()]
  if (skeyList) {
    if (skeyList.map(skey => skey.trigger(params, evnt)).some(rest => rest === false)) {
      return false
    }
  }
}

function handleKeyMap () {
  XEUtils.each(globalOptions, (key, funcName) => {
    let specialKey
    let realKey
    key.split('+').forEach(key => {
      key = key.toLowerCase().trim()
      if (specialKeys.indexOf(key) > -1) {
        specialKey = key
      } else {
        realKey = key
      }
    })
    if (!realKey) {
      throw new Error(`[vxe-table-plugin-shortcut-key] Invalid shortcut key configuration '${key}'.`)
    }
    let skeyList = shortcutMap[realKey]
    if (!skeyList) {
      skeyList = shortcutMap[realKey] = []
    }
    if (skeyList.some(skey => skey.realKey === realKey && skey.specialKey === specialKey)) {
      throw new Error(`[vxe-table-plugin-shortcut-key] Shortcut keys conflict '${key}'.`)
    }
    skeyList.push(new SKey(realKey, specialKey, funcName))
  })
}

export const VXETablePluginShortcutKey = {
  install (VXETable, options) {
    if (options) {
      XEUtils.each(options.setting, (key, funcName) => {
        if (handleFuncs[funcName]) {
          globalOptions[funcName] = key
        } else {
          console.warn(`[vxe-table-plugin-shortcut-key] The ${funcName} doesn't exist.`)
        }
      })
      VXETable.interceptor.add('event.keydown', handleShortcutKeyEvent)
      handleKeyMap()
    }
  }
}

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginShortcutKey)
}

export default VXETablePluginShortcutKey
