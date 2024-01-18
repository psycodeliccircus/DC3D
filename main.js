const {app, BrowserWindow, nativeTheme, ipcMain,  Menu, dialog,  shell, clipboard, Tray} = require('electron')
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const path = require('path');
const MainMenuapp = require('./menu-config')
const RightMenuapp = require('./right-menu-config')
const PrintOptions = require('./right-menu-config')
const appConfig = require('./config')

let mainWindow;
let appTray = null;

// Menu
let mainMenu = Menu.buildFromTemplate(MainMenuapp)

let rightMenu = Menu.buildFromTemplate(RightMenuapp)

function createWindow () {
  mainWindow = new BrowserWindow({
    width: appConfig['width'],
    height: appConfig['height'],
    minWidth: appConfig['minWidth'],
    minHeight: appConfig['minHeight'],
    icon: "assets/icon.ico",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    }
  })

  //Load Appliaction Main Menu
  Menu.setApplicationMenu(mainMenu) 

  nativeTheme.themeSource = 'dark'

  //Load Right click menu
  mainWindow.webContents.on('context-menu', e => {
    rightMenu.popup(mainWindow)
  })

  mainWindow.maximize();

  //CreatWindow execute loding remote content
  loadWebContent();

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('https://dc3d.tech')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
  appTray = new Tray(__dirname + '/assets/icon.ico');
  appTray.setToolTip("DC3D Models")
  const nativeImage = require('electron').nativeImage
    const contextMenu = Menu.buildFromTemplate([
        { 
            label: 'DC3D Models v' + app.getVersion(),
            icon: nativeImage.createFromPath(__dirname + '/assets/icon.png').resize({ width: 16 }),
            enabled: false,
        },
        { type: 'separator' },
        {
          label : 'Home', 
          icon: nativeImage.createFromPath(__dirname + '/assets/icon.png').resize({ width: 16 }),
          click : () => { require('./main')("home") }
        },
        { 
            label: 'Sobre',
            icon: nativeImage.createFromPath(__dirname + '/assets/icon.png').resize({ width: 16 }),  
            click : () => { require('./main')("about") } 
        },
        { type: 'separator' },
        { 
            label: 'Discord',
            icon: nativeImage.createFromPath(__dirname + '/assets/discord.png').resize({ width: 16 }), 
            click() { shell.openExternal('https://dc3d.tech/discord'); } 
        },
        { type: 'separator' },
        { 
            label: 'Atualização',
            icon: nativeImage.createFromPath(__dirname + '/assets/reload.png').resize({ width: 16 }), 
            click() { autoUpdater.checkForUpdates() } 
        },
        { type: 'separator' },
        {
          label: 'Redes Sociais',
          icon: nativeImage.createFromPath(__dirname + '/assets/redesocial.png').resize({ width: 16 }),
          submenu: [
              { 
                  label: 'YouTube', 
                  icon: nativeImage.createFromPath(__dirname + '/assets/youtube.png').resize({ width: 16 }),
                  click() { shell.openExternal('https://youtube.com/renildomarcio'); } 
              },
              { type: 'separator' },
              { 
                  label: 'TikTok', 
                  icon: nativeImage.createFromPath(__dirname + '/assets/tiktok.png').resize({ width: 16 }),
                  click() { shell.openExternal('https://www.tiktok.com/@renildomarcio'); } 
              },
              { type: 'separator' },
              { 
                  label: 'Twitter', 
                  icon: nativeImage.createFromPath(__dirname + '/assets/twitter.png').resize({ width: 16 }),
                  click() { shell.openExternal('https://twitter.com/renildomarcio'); } 
              },
              { type: 'separator' },
              { 
                  label: 'FaceBook', 
                  icon: nativeImage.createFromPath(__dirname + '/assets/facebook.png').resize({ width: 16 }),
                  click() { shell.openExternal('https://facebook.com/esxbrasil'); } 
              },
          ]
      },
      { type: 'separator' },
      { 
          label: 'Sair',
          icon: nativeImage.createFromPath(__dirname + '/assets/sair.png').resize({ width: 16 }), 
          click() { app.quit() } 
      },
    ])
    appTray.setContextMenu(contextMenu)
    mainWindow.webContents.once('dom-ready', () => {
        mainWindow.show()
        //autoUpdater.checkForUpdates()
        //setActivity()
        appTray.on('click', () => {
            mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
        })
    })

}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
  if (mainWindow) {
          mainWindow.restore()
          mainWindow.show()
          mainWindow.focus()
  }
})
}

function loadWebContent() {
  //Loading spalsh screen
  mainWindow.loadFile(path.join(__dirname, 'public/loading.html'))

  //create webContants
  let wc = mainWindow.webContents

  //suessfull loding page afer dom created
  wc.once('did-finish-load'  ,  () => {
    mainWindow.loadURL(appConfig['websiteUrl'])
  })

  // if not loading page redirect error page
  wc.on('did-fail-provisional-load', (error, code)=> {
    mainWindow.loadFile(path.join(__dirname, 'public/offline.html'))
  })
}

// Check website loading error (offline, page not found or etc.)
ipcMain.on('online-status-changed', (event, status) => {
  if(status == true) { loadWebContent() }
})

// Print page option
ipcMain.on('printPage', () => {

  var options = PrintOptions;

  let win = BrowserWindow.getFocusedWindow();

  win.webContents.print(options, (success, failureReason) => {
      if (!success) dialog.showMessageBox(mainWindow, {
        message: failureReason.charAt(0).toUpperCase() + failureReason.slice(1),
        type: "error",
        buttons: ["Cancel"],
        defaultId: 0,
        title: "Print Error",
    });
  });
})

//Load menuItem local pages (About, Home page, etc)
module.exports = (pageId) => {
  if(pageId === 'home') {
    loadWebContent()
  } else {
    mainWindow.loadFile(path.join(__dirname, `public/${pageId}.html`))
  }
}

// Funções de tratamento de atualizações
function handleUpdateChecking() {
  log.log('Checking for updates.');
}

function handleUpdateAvailable(info) {
  log.log('Update available.');
}

function handleDownloadProgress(progressObj) {
  const message = `Downloading update. Speed: ${progressObj.bytesPerSecond} - ${~~progressObj.percent}% [${progressObj.transferred}/${progressObj.total}]`;
  log.log(message);

  const swalMessage = `Swal.fire({
    title: 'Baixando atualização',
    html: '${message}',
    allowOutsideClick: false,
    onBeforeOpen: () => {
        Swal.showLoading();
    }
  });`;

  mainWindow.webContents.executeJavaScript(swalMessage);
}

function handleUpdateError(err) {
  log.log(`Update check failed: ${err.toString()}`);
}

function handleUpdateNotAvailable(info) {
  const swalMessage = `Swal.fire({
    title: 'Atualizações',
    html: 'Não há atualizações disponíveis.',
    icon: 'error'
  });`;

  mainWindow.webContents.executeJavaScript(swalMessage);
}

function handleUpdateDownloaded(info) {
  const swalMessage = `Swal.fire({
    title: 'Reiniciando o aplicativo',
    html: 'Aguente firme, reiniciando o aplicativo para atualização!',
    allowOutsideClick: false,
    onBeforeOpen: () => {
        Swal.showLoading();
    }
  });`;

  mainWindow.webContents.executeJavaScript(swalMessage);
  autoUpdater.quitAndInstall();
}

autoUpdater.on('checking-for-update', handleUpdateChecking);
autoUpdater.on('update-available', handleUpdateAvailable);
autoUpdater.on('download-progress', handleDownloadProgress);
autoUpdater.on('error', handleUpdateError);
autoUpdater.on('update-not-available', handleUpdateNotAvailable);
autoUpdater.on('update-downloaded', handleUpdateDownloaded);

app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
