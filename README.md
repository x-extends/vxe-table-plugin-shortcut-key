# vxe-table-plugin-shortcut-key

[![gitee star](https://gitee.com/xuliangzhan_admin/vxe-table-plugin-shortcut-key/badge/star.svg?theme=dark)](https://gitee.com/xuliangzhan_admin/vxe-table-plugin-shortcut-key/stargazers)
[![npm version](https://img.shields.io/npm/v/vxe-table-plugin-shortcut-key.svg?style=flat-square)](https://www.npmjs.org/package/vxe-table-plugin-shortcut-key)
[![npm downloads](https://img.shields.io/npm/dm/vxe-table-plugin-shortcut-key.svg?style=flat-square)](http://npm-stat.com/charts.html?package=vxe-table-plugin-shortcut-key)
[![gzip size: JS](http://img.badgesize.io/https://unpkg.com/vxe-table-plugin-shortcut-key/dist/index.min.js?compression=gzip&label=gzip%20size:%20JS)](https://unpkg.com/vxe-table-plugin-shortcut-key/dist/index.min.js)
[![npm license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/xuliangzhan/vxe-table-plugin-shortcut-key/blob/master/LICENSE)

基于 [vxe-table](https://github.com/xuliangzhan/vxe-table) 表格的增强插件，为键盘操作提供快捷键的设置

## Installing

```shell
npm install xe-utils vxe-table vxe-table-plugin-shortcut-key
```

```javascript
import Vue from 'vue'
import VXETable from 'vxe-table'
import VXETablePluginShortcutKey from 'vxe-table-plugin-shortcut-key'

Vue.use(VXETable)
VXETable.use(VXETablePluginShortcutKey, {
  // 'pager.prevPage': 'Shift+W', 支持普通的功能键或者组合键
  'pager.prevPage': 'ArrowLeft',
  'pager.nextPage': 'ArrowRight'
})
```

## API

### Shortcut key

| code 功能编码 | describe 描述 |
|------|------|
| pager.prevPage | 如果存在分页，则进入上一页 |
| pager.nextPage  | 如果存在分页，则进入下一页 |

## License

MIT License, 2019-present, Xu Liangzhan
