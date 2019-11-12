const electron = require('electron');
require('../app');

const { app } = electron;
const { BrowserWindow } = electron;

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindwow = null;

function createWindow() {
  mainWindwow = new BrowserWindow({
    width: 1024,
    height: 768,
    darkTheme: false,

    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindwow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.resolve(__dirname, '..', 'build', 'index.html')}`
  );

  isDev && mainWindwow.webContents.openDevTools();

  mainWindwow.on('closed', () => {
    mainWindwow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindwow === null) {
    createWindow();
  }
});
