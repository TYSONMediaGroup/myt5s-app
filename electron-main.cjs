const { app, BrowserWindow, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;
let tray = null;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0a0a',
    icon: path.join(__dirname, 'public', 'T5S logo official.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Set up the menu bar tray
  const trayIconPath = path.join(__dirname, 'public', 'tray-icon.png');
  let trayImage = nativeImage.createFromPath(trayIconPath);
  trayImage = trayImage.resize({ width: 22, height: 22 });
  trayImage.setTemplateImage(true);
  
  tray = new Tray(trayImage);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'myT5S', enabled: false },
    { type: 'separator' },
    { 
      label: 'Show myT5S', 
      click: () => {
        if (mainWindow) {
          if (mainWindow.isMinimized()) mainWindow.restore();
          mainWindow.focus();
        } else {
          // Re-create window if closed
          app.emit('activate');
        }
      }
    },
    { 
      label: 'Launch Vizlantis', 
      click: () => exec('open /Users/ty/Desktop/Vizlantis.app')
    },
    { type: 'separator' },
    { label: 'Quit myT5S', role: 'quit' }
  ]);
  
  tray.setToolTip('myT5S Command Center');
  tray.setContextMenu(contextMenu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', () => {
  // Keep the app alive in the background on Mac for the Tray
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    // Re-create window
    mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      titleBarStyle: 'hiddenInset',
      backgroundColor: '#0a0a0a',
      icon: path.join(__dirname, 'public', 'T5S logo official.png'),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    const isDev = !app.isPackaged;
    if (isDev) mainWindow.loadURL('http://localhost:5173');
    else mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
});
