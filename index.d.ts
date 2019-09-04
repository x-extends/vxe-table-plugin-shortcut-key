import VXETable from 'vxe-table'

export interface VXETablePluginStatic {
  install(xTable: typeof VXETable): void;
}

/**
 * 基于 vxe-table 表格的增强插件，为键盘操作提供快捷键的设置
 */
declare var VXETablePluginShortcutKey: VXETablePluginStatic;

export default VXETablePluginShortcutKey;