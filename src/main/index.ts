import { app, BrowserWindow, screen, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as storage from 'electron-json-storage'
import { Difficulty, TaskType, Settings } from '../renderer/types/types'
const ISO6391 = require('iso-639-1')

const LAYERS = 1
const mainWindowConfig = {
  kiosk: true,
  show: true,
  autoHideMenuBar: true,
  ...(process.platform === 'linux' ? { icon } : {}),
  webPreferences: {
    preload: join(__dirname, '../preload/index.js'),
    sandbox: is.dev,
    devTools: is.dev
  }
}

const sideWindowConfig = {
  kiosk: true,
  show: true,
  autoHideMenuBar: true,
  ...(process.platform === 'linux' ? { icon } : {}),
  webPreferences: {
    sandbox: is.dev,
    devTools: is.dev
  }
}

function startUp(displays: Electron.Display[], mainDisplay: Electron.Display): void {
  for (let i = 0; i < LAYERS; i++) {
    for (const display of displays) {
      if (display.id === mainDisplay.id) {
        createWindow(mainWindowConfig, display, 'index.html')
      } else {
        //createWindow(sideWindowConfig, display, 'side.html')
      }
    }
  }
}

function isValidSettings(settings: any): settings is Settings {
  return (
    settings &&
    Object.values(Difficulty).includes(settings.difficulty) &&
    Array.isArray(settings.allowedTasks) &&
    settings.allowedTasks.every((task) => Object.values(TaskType).includes(task)) &&
    typeof settings.numberOfTasks === 'number' &&
    typeof settings.locale === 'string' &&
    isValidLocale(settings.locale)
  )
}

function isValidLocale(locale: string): boolean {
  return ISO6391.validate(locale)
}

app.whenReady().then(() => {
  const mainDisplay = screen.getPrimaryDisplay()
  const displays = screen.getAllDisplays()
  electronApp.setAppUserModelId('it.bosler.davy-jones-unlocker')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  startUp(displays, mainDisplay)

  ipcMain.handle('close', () => {
    console.log('Closing app...')
    BrowserWindow.getAllWindows().forEach((window) => window.setClosable(true))
    BrowserWindow.getAllWindows().forEach((window) => window.removeAllListeners())
    app.quit()
  })

  ipcMain.handle('open-settings', () => {
    createWindow(mainWindowConfig, mainDisplay, 'settings.html')
  })

  ipcMain.handle('close-settings', () => {
    console.log('closing settings')
    BrowserWindow.getAllWindows()
      .filter((window) => window.webContents.getURL().includes('settings.html'))
      .forEach((window) => window.close())
    BrowserWindow.getAllWindows()
      .filter((window) => window.webContents.getURL().includes('index.html'))
      .forEach((window) => window.reload())
  })

  ipcMain.handle('get-settings', () => {
    console.log('getting settings')
    let settings = storage.getSync('settings')
    if (JSON.stringify(settings) === '{}' || !isValidSettings(settings)) {
      console.log('No valid settings found. Setting default settings')
      settings = {
        difficulty: Difficulty.medium,
        numberOfTasks: 3,
        allowedTasks: [TaskType.WeekdayCalculating],
        locale: 'en'
      }
      storage.set('settings', settings, (error) => {
        if (error) throw error
      })
    } else {
      console.log('settings found')
    }
    return settings
  })

  ipcMain.handle('set-settings', (_event, settings: string) => {
    const settingsObj = JSON.parse(settings)
    console.log('setting settings to:')
    console.log(settings)
    storage.set('settings', settingsObj, (error) => {
      if (error) throw error
    })
    return true
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) startUp(displays, mainDisplay)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// @ts-ignore - will be used later
function createUnkillableKioskWindow(
  windowConfig: {
    webPreferences: { sandbox: boolean; devTools: boolean }
    icon?: string | undefined
    kiosk: boolean
    show: boolean
    autoHideMenuBar: boolean
  },
  display: Electron.Display,
  filePathRelativeToRenderer: string
): BrowserWindow {
  const window = createWindow(windowConfig, display, filePathRelativeToRenderer)
  window.setAlwaysOnTop(true, 'normal')
  window.setMinimizable(false)
  window.setClosable(false)
  window.setResizable(false)
  window.setMenuBarVisibility(false)
  window.removeMenu()
  window.setSkipTaskbar(true)
  window.focus()
  window.setKiosk(true)

  window.on('closed', () => {
    createUnkillableKioskWindow(windowConfig, display, filePathRelativeToRenderer)
  })
  return window
}

function createWindow(
  windowConfig: {
    webPreferences: { sandbox: boolean; devTools: boolean }
    icon?: string | undefined
    kiosk: boolean
    show: boolean
    autoHideMenuBar: boolean
  },
  display: Electron.Display,
  filePathRelativeToRenderer: string
): BrowserWindow {
  const window = new BrowserWindow({
    ...windowConfig,
    x: display.bounds.x,
    y: display.bounds.y
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/${filePathRelativeToRenderer}`)
  } else {
    window.loadFile(join(__dirname, `../renderer/${filePathRelativeToRenderer}`))
  }
  return window
}
