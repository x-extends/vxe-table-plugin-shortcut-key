# vxe-table-plugin-shortcut-key

[![gitee star](https://gitee.com/xuliangzhan_admin/vxe-table-plugin-shortcut-key/badge/star.svg?theme=dark)](https://gitee.com/xuliangzhan_admin/vxe-table-plugin-shortcut-key/stargazers)
[![npm version](https://img.shields.io/npm/v/vxe-table-plugin-shortcut-key.svg?style=flat-square)](https://www.npmjs.com/package/vxe-table-plugin-shortcut-key)
[![npm downloads](https://img.shields.io/npm/dm/vxe-table-plugin-shortcut-key.svg?style=flat-square)](http://npm-stat.com/charts.html?package=vxe-table-plugin-shortcut-key)
[![gzip size: JS](http://img.badgesize.io/https://unpkg.com/vxe-table-plugin-shortcut-key/dist/index.min.js?compression=gzip&label=gzip%20size:%20JS)](https://unpkg.com/vxe-table-plugin-shortcut-key/dist/index.min.js)
[![npm license](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)

基于 [vxe-table](https://www.npmjs.com/package/vxe-table) 表格的增强插件，为键盘操作提供快捷键的设置

## Installing

```shell
npm install xe-utils vxe-table vxe-table-plugin-shortcut-key
```

```javascript
// ...
import VXETablePluginShortcutKey from 'vxe-table-plugin-shortcut-key'
// ...

VXETable.use(VXETablePluginShortcutKey, {
  // 快捷键监听
  listener: {
    'Ctrl + V' (params, evnt) {
      console.log('粘贴')
    }
  },
  // 功能键设置
  setting: {
    'pager.prevPage': 'ArrowLeft',
    'pager.nextPage': 'ArrowRight', // 单个按键
    'pager.prevJump': 'Shift + W',
    'pager.nextJump': 'Shift + S' // 组合键
  }
})
```

## API

### disabled 禁用快捷键

disabled: string[]

### listener 快捷键监听

listener: { key: Function(params, event) }

### setting 功能键设置

setting: { code: string }

| code 功能编码 | describe 描述 | default 参考键值 |
|------|------|------|
| table.edit.actived | 只对 edit-config 启用后有效，当单元格处于选中状态时，则进入编辑 | F2 |
| table.edit.closed | 只对 edit-config 启用后有效，当单元格处于激活状态时，则退出编辑 | Esc |
| table.edit.leftTabMove | 只对 edit-config / mouse-config 启用后有效，当单元格处于激活状态或者选中状态，则移动到左侧单元格 | Shift + Tab |
| table.edit.rightTabMove | 只对 edit-config / mouse-config 启用后有效，当单元格处于激活状态或者选中状态，则移动到右侧单元格 | Tab |
| table.cell.upMove | 只对 mouse-config 启用后有效，当单元格处于选中状态，则移动到上面的单元格 | ArrowUp |
| table.cell.downMove | 只对 mouse-config 启用后有效，当单元格处于选中状态，则移动到下面的单元格 | ArrowDown |
| table.cell.leftMove | 只对 mouse-config 启用后有效，当单元格处于选中状态，则移动到左边的单元格 | ArrowLeft |
| table.cell.rightMove | 只对 mouse-config 启用后有效，当单元格处于选中状态，则移动到右边的单元格 | ArrowRight |
| table.row.current.topMove | 只对 highlight-current-row 启用后有效，高亮行向上移动 |  |
| table.row.current.downMove | 只对 highlight-current-row 启用后有效，高亮行向上移动 |  |
| pager.prevPage | 只对 pager-config 启用后有效，则进入上一页 |  |
| pager.nextPage | 只对 pager-config 启用后有效，则进入下一页 |  |
| pager.prevJump | 只对 pager-config 启用后有效，则向上翻页 |  |
| pager.nextJump | 只对 pager-config 启用后有效，则向下翻页 |  |

## License

[MIT](LICENSE) © 2019-present, Xu Liangzhan
