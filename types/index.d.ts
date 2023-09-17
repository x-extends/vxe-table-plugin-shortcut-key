import { VXETableCore, VxeGlobalInterceptorHandles } from 'vxe-table'

export interface ShortcutKeyConf {
  key: string;
  callback: Function
}

export interface ShortcutKeySettingConfig {
  [funcName: string]: string;
}

export interface ShortcutKeyListenerConfig {
  [funcName: string]: (params: VxeGlobalInterceptorHandles.InterceptorKeydownParams, evnt: Event) => any;
}

export interface ShortcutKeyOptions {
  disabled?: string[] | ShortcutKeyConf[];
  listener?: ShortcutKeyListenerConfig;
  setting?: ShortcutKeySettingConfig;
}

/**
 * 基于 vxe-table 表格的扩展插件，为键盘操作提供快捷键设置
 */
export declare const VXETablePluginShortcutKey: {
  install (vxetable: VXETableCore, options?: ShortcutKeyOptions): void
}

export default VXETablePluginShortcutKey
