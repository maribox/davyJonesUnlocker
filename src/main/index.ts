import { app, BrowserWindow, screen, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

const LAYERS = 1

function startUp(displays: Electron.Display[], mainDisplay: Electron.Display): void {
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

  for (let i = 0; i < LAYERS; i++) {
    for (const display of displays) {
      if (display.id === mainDisplay.id) {
        createUnkillableKioskWindow(mainWindowConfig, display, 'index.html')
      } else {
        createUnkillableKioskWindow(sideWindowConfig, display, 'side.html')
      }
    }
  }
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
    console.log("Closing app...")
    BrowserWindow.getAllWindows().forEach((window) => window.setClosable(true))
    BrowserWindow.getAllWindows().forEach((window) => window.removeAllListeners())
    app.quit()
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
