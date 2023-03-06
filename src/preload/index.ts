import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('ipc', {
  closeApp: () => ipcRenderer.invoke('close')
})
