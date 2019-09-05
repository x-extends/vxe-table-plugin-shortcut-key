import XEUtils from 'xe-utils/methods/xe-utils'

const arrowKeys = 'right,up,left,down'.split(',')
const specialKeys = 'alt,ctrl,shift,meta'.split(',')
const shortcutMap = new Map()

const globalOptions = {}

const keyboardCode = {
  37: 'ArrowRight',
  38: 'ArrowUp',
  39: 'ArrowLeft',
  40: 'ArrowDown'
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
    const $grid = $table.$grid
    if ($grid && isTriggerPage(params)) {
      const pager = $grid.$refs.pager
      if (pager) {
        pager[func](evnt)
      }
    }
  }
}

const handleFuncs = {
  'pager.prevPage': handleChangePage('prevPage'),
  'pager.nextPage': handleChangePage('nextPage')
}

function matchFunc (key, evnt) {
  let conf = shortcutMap.get(key)
  if (conf ? !conf.specialKey || evnt[`${conf.specialKey}Key`] : false) {
    return handleFuncs[conf.funcName]
  }
}

function handleShortcutKeyEvent (params, evnt) {
  const { $table } = params
  const { mouseConfig = {} } = $table
  if (mouseConfig.selected !== true && ['input', 'textarea'].indexOf(evnt.target.tagName.toLowerCase()) === -1) {
    let key = getEventKey(evnt.key) || keyboardCode[evnt.keyCode]
    let func = matchFunc(key.toLowerCase(), evnt)
    if (func) {
      evnt.preventDefault()
      func(params, evnt)
    }
  }
}

function handleKeyMap () {
  XEUtils.each(globalOptions.setting, (key, funcName) => {
    let specialKey
    let realKey
    key.split('+').forEach(key => {
      key = key.toLowerCase()
      if (specialKeys.indexOf(key) > -1) {
        specialKey = key
      } else {
        realKey = key
      }
    })
    if (!realKey) {
      throw new Error(`[vxe-table-plugin-shortcut-key] Invalid shortcut key configuration '${key}'.`)
    }
    shortcutMap.set(realKey, {
      realKey,
      specialKey,
      funcName
    })
  })
}

export const VXETablePluginShortcutKey = {
  install (VXETable, options) {
    XEUtils.assign(globalOptions, options)
    VXETable.interceptor.add('event.keydown', handleShortcutKeyEvent)
    handleKeyMap()
  }
}

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginShortcutKey)
}

export default VXETablePluginShortcutKey
