import XEUtils from 'xe-utils/methods/xe-utils'

const arrowKeys = 'right,up,left,down'.split(',')
const specialKeys = 'alt,ctrl,shift,meta'.split(',')
const settingMaps = {}
const listenerMaps = {}
const disabledMaps = {}

const keyboardCode = {
  37: 'ArrowRight',
  38: 'ArrowUp',
  39: 'ArrowLeft',
  40: 'ArrowDown'
}

class SKey {
  constructor (realKey, specialKey, funcName, options) {
    this.realKey = realKey
    this.specialKey = specialKey
    this.funcName = funcName
    this.options = options
  }
  trigger (params, evnt) {
    if (!this.specialKey || evnt[`${this.specialKey}Key`]) {
      return handleFuncs[this.funcName](params, evnt)
    }
  }
  emit (params, evnt) {
    if (!this.specialKey || evnt[`${this.specialKey}Key`]) {
      return this.options.callback(params, evnt)
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

function handleTabMove (isLeft) {
  return function (params, evnt) {
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

function handleArrowMove (arrowIndex) {
  return function (params, evnt) {
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

const handleFuncs = {
  'table.edit.actived' (params, evnt) {
    const { $table } = params
    const selected = $table.getMouseSelecteds()
    if (selected) {
      evnt.preventDefault()
      $table.setActiveCell(selected.row, selected.column.property)
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
}

function runEvent (key, maps, prop, params, evnt) {
  let skeyList = maps[key.toLowerCase()]
  if (skeyList) {
    return skeyList.some(skey => skey[prop](params, evnt) === false)
  }
}

function handleShortcutKeyEvent (params, evnt) {
  let key = getEventKey(evnt.key) || keyboardCode[evnt.keyCode]
  if (!runEvent(key, disabledMaps, 'emit', params, evnt)) {
    runEvent(key, settingMaps, 'trigger', params, evnt)
    runEvent(key, listenerMaps, 'emit', params, evnt)
  }
}

function parseKeys (keyMap) {
  let specialKey
  let realKey
  let keys = keyMap.split('+')
  keys.forEach(key => {
    key = key.toLowerCase().trim()
    if (specialKeys.indexOf(key) > -1) {
      specialKey = key
    } else {
      realKey = key
    }
  })
  if (!realKey || keys.length > 2 || (keys.length === 2 && !specialKey)) {
    throw new Error(`[vxe-table-plugin-shortcut-key] Invalid shortcut key configuration '${keyMap}'.`)
  }
  return { specialKey, realKey }
}

function setKeyQueue (maps, opts, funcName) {
  let { specialKey, realKey } = parseKeys(opts.keyMap)
  let skeyList = maps[realKey]
  if (!skeyList) {
    skeyList = maps[realKey] = []
  }
  if (skeyList.some(skey => skey.realKey === realKey && skey.specialKey === specialKey)) {
    throw new Error(`[vxe-table-plugin-shortcut-key] Shortcut key conflict '${opts.keyMap}'.`)
  }
  skeyList.push(new SKey(realKey, specialKey, funcName, opts))
}

function getOpts (conf) {
  return XEUtils.isString(conf) ? { keyMap: conf } : XEUtils.assign({ keyMap: conf.key }, conf)
}

function parseDisabledKey (options) {
  XEUtils.each(options.disabled, conf => {
    let callback = () => false
    let opts = XEUtils.isString(conf) ? { keyMap: conf, callback } : XEUtils.assign({ keyMap: conf.key, callback }, conf)
    if (!XEUtils.isFunction(opts.callback)) {
      console.warn(`[vxe-table-plugin-shortcut-key] The '${opts.keyMap}' must be a function.`)
    }
    setKeyQueue(disabledMaps, opts)
  })
}

function parseSettingKey (options) {
  XEUtils.each(options.setting, (conf, funcName) => {
    if (!handleFuncs[funcName]) {
      console.warn(`[vxe-table-plugin-shortcut-key] The '${funcName}' not exist.`)
    }
    setKeyQueue(settingMaps, getOpts(conf), funcName)
  })
}

function parseListenerKey (options) {
  XEUtils.each(options.listener, (callback, keyMap) => {
    if (!XEUtils.isFunction(callback)) {
      console.warn(`[vxe-table-plugin-shortcut-key] The '${keyMap}' must be a function.`)
    }
    setKeyQueue(listenerMaps, getOpts({ key: keyMap, callback }))
  })
}

export const VXETablePluginShortcutKey = {
  install (VXETable, options) {
    if (options) {
      parseDisabledKey(options)
      parseSettingKey(options)
      parseListenerKey(options)
      VXETable.interceptor.add('event.keydown', handleShortcutKeyEvent)
    }
  }
}

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginShortcutKey)
}

export default VXETablePluginShortcutKey
