import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../renderer/types/types'
const ipc: IPC = {
  closeApp: () => ipcRenderer.invoke('close'),
  openSettings: () => ipcRenderer.invoke('open-settings'),
  closeSettings: () => ipcRenderer.invoke('close-settings'),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setSettings: (settings: string) => ipcRenderer.invoke('set-settings', settings)
}
contextBridge.exposeInMainWorld('ipc', ipc)
contextBridge.exposeInMainWorld('data', {})
