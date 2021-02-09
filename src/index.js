const { app, BrowserWindow, ipcMain, Tray, shell, Menu } = require('electron');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

let tray = undefined;
let window = undefined;

// This method is called once Electron is ready to run our code
// It is effectively the main method of our Electron app
app.on('ready', () => {
  // Setup the menubar with an icon
  tray = new Tray(__dirname + '/images/joker.png');

  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  tray.on('click', function(event) {
    toggleWindow();

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({ mode: 'detach' });
    }
  });

  // Make the popup window for the menubar
  window = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true, // hide app icon from task bar
  });

  app.dock.hide(); // hide app icon from dock bar

  // Tell the popup window to load our index.html file
  window.loadURL(`file://${path.join(__dirname, '/index.html')}`);
  // window.loadURL('https://tasks.upforcetech.com/');

  // Only close the window on blur if dev tools isn't opened
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });

  // App menu
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        { label: 'Adjust Notification Value' },
        {
          label: 'Google',
          click() {
            shell.openExternal('https://www.google.com');
          },
          accelerator: 'CmdOrCtrl+Shift+G',
        },
        { type: 'separator' },
        {
          label: 'Exit',
          click() {
            app.quit();
          },
          accelerator: 'CmdOrCtrl+Q',
        },
      ],
    },
    {
      label: 'Debug',
      submenu: [
        {
          label: 'Inspect Element',
          click: () => {
            window.inspectElement(0, 0);
          },
        },
      ],
    },
  ]);
  tray.on('right-click', function(event) {
    tray.popUpContextMenu(contextMenu);
  });
});

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const trayPos = tray.getBounds();
  const windowPos = window.getBounds();
  let x,
    y = 0;
  if (process.platform == 'darwin') {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
    y = Math.round(trayPos.y + trayPos.height);
  } else {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
    y = Math.round(trayPos.y + trayPos.height * 10);
  }

  window.setPosition(x, y, false);
  window.show();
  window.focus();
};

ipcMain.on('show-window', () => {
  showWindow();
});

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
