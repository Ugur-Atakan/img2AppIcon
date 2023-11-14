const path = require('path');
const os = require('os');
const fs = require('fs');
const resizeImg = require('resize-img');
const { app, BrowserWindow, ipcMain, shell } = require('electron');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

let mainWindow;
let aboutWindow;

// Main Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: isDev ? 1000 : 500,
    height: 900,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

// When the app is ready, create the window
app.on('ready', () => {
  createMainWindow();

  // Remove variable from memory
  mainWindow.on('closed', () => (mainWindow = null));
});


ipcMain.on('image:resize', async (e, options) => {
  const dest = path.join(os.homedir(), 'imageresizer');
  const selectedItems = options?.selectedOptions;
  const imgPath = options?.imgPath;

  await imageresizer(selectedItems, imgPath, dest).then(() => {
    mainWindow.webContents.send('image:done', 'İşlem Tamamlandı');
    shell.openPath(dest);
  }).catch((err) => {
    console.error('error:', err);
  }
  );
});

async function imageresizer(selectedItems, imgPath, dest) {
  for (const item of selectedItems) {
    const { height, width, fileName, dirName } = getDimensionsForItem(item);

    if (imgPath && height && width && fileName) {
      const options = { imgPath, height, width, dest: path.join(dest, dirName) };

      try {
        const newPath = await resizeImg(fs.readFileSync(imgPath), {
          width: +width,
          height: +height,
        });
        if (!fs.existsSync(options.dest)) {
          fs.mkdirSync(options.dest, { recursive: true });
        }
        fs.writeFileSync(path.join(options.dest, fileName + '.png'), newPath);
      } catch (err) {
        console.error('Resizing error:', err);
      }
    }
  }
}

function getDimensionsForItem(item) {
  switch (item) {
    case 'mdpi-normal':
      return { dirName: 'mipmap-mdpi', height: 48, width: 48, fileName: 'ic_launcher' };
    case 'mdpi-rounded':
      return { dirName: 'mipmap-mdpi', height: 48, width: 48, fileName: 'ic_launcher_round' };
    case 'hdpi-normal':
      return { dirName: 'mipmap-hdpi', height: 72, width: 72, fileName: 'ic_launcher' };
    case 'hdpi-rounded':
      return { dirName: 'mipmap-hdpi', height: 72, width: 72, fileName: 'ic_launcher_round' };
    case 'xhdpi-normal':
      return { dirName: 'mipmap-xhdpi', height: 96, width: 96, fileName: 'ic_launcher' };
    case 'xhdpi-rounded':
      return { dirName: 'mipmap-xhdpi', height: 96, width: 96, fileName: 'ic_launcher_round' };
    case 'xxhdpi-normal':
      return { dirName: 'mipmap-xxhdpi', height: 144, width: 144, fileName: 'ic_launcher' };
    case 'xxhdpi-rounded':
      return { dirName: 'mipmap-xxhdpi', height: 144, width: 144, fileName: 'ic_launcher_round' };
    case 'xxxhdpi-normal':
      return { dirName: 'mipmap-xxxhdpi', height: 192, width: 192, fileName: 'ic_launcher' };
    case 'xxxhdpi-rounded':
      return { dirName: 'mipmap-xxxhdpi', height: 192, width: 192, fileName: 'ic_launcher_round' };
    case 'appstore-icon':
      return { dirName: 'ios-icon', height: 1024, width: 1024, fileName: 'appstore-icon' };
    case 'iphone-notification-2x':
      return { dirName: 'ios-icon', height: 40, width: 40, fileName: 'iphone-notification-2x' };
    case 'iphone-notification-3x':
      return { dirName: 'ios-icon', height: 60, width: 60, fileName: 'iphone-notification-3x' };
    case 'iphone-settings-2x':
      return { dirName: 'ios-icon', height: 58, width: 58, fileName: 'iphone-settings-2x' };
    case 'iphone-settings-3x':
      return { dirName: 'ios-icon', height: 87, width: 87, fileName: 'iphone-settings-3x' };
    case 'iphone-spotlight-2x':
      return { dirName: 'ios-icon', height: 80, width: 80, fileName: 'iphone-spotlight-2x' };
    case 'iphone-spotlight-3x':
      return { dirName: 'ios-icon', height: 120, width: 120, fileName: 'iphone-spotlight-3x' };
    case 'iphone-app-2x':
      return { dirName: 'ios-icon', height: 120, width: 120, fileName: 'iphone-app-2x' };
    case 'iphone-app-3x':
      return { dirName: 'ios-icon', height: 180, width: 180, fileName: 'iphone-app-3x' };
    default:
      return {};
  }
}

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
