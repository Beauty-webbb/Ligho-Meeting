'use strict'

import {
  app,
  protocol,
  BrowserWindow,
  Menu,
  ipcMain,
  dialog
} from 'electron'
import {
  createProtocol
} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {
  VUEJS_DEVTOOLS
} from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

let win

protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    secure: true,
    standard: true
  }
}])

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1000,
    minHeight: 680,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
    },
    icon: `${__static}/app.png`
  })

  win.webContents.on('did-fail-load', function () {
    console.log(`createWindow: did-fail-load, reload ${param.TRTC_ENV} soon...`);
    setTimeout(() => {
      win.reload();
    }, 1000);
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // win.loadURL(process.env.WEBPACK_DEV_SERVER_URL +'#/menu')
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    // win.loadURL('app://./index.html#/menu')
  }

  win.on('close', (e) => {
    e.preventDefault();
    dialog.showMessageBox(win, {
      type: 'info',
      title: '关闭',
      message: '是否退出？',
      buttons: ['取消', '确定']
    }).then((index) => {
      if (index.response === 1) {
        win.webContents.send('leave', '正在退出会议');
        setTimeout(() => {
          win = null;
          childview = null
          app.exit();
        }, 3000)
      }
    });
  })

  createMenu()
  protocalHandler()
  // push()
}

/**
 * 协议处理
 */
function protocalHandler() {
  const args = [];
  if (!app.isPackaged) {
    // 如果是开发阶段，需要把我们的脚本的绝对路径加入参数中
    args.push(path.resolve(process.argv[1]))
  }
  // 加一个 `--` 以确保后面的参数不被 Electron 处理
  args.push('--')

  // 注册协议
  const PROTOCOL = 'lighosmeet'
  app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args)

  // 如果打开协议时，没有其他实例，则当前实例当做主实例，处理参数
  handleArgv(process.argv)

  // 其他实例启动时，主实例会通过 second-instance 事件接收其他实例的启动参数 `argv`
  app.on('second-instance', (event, argv) => {
    // Windows 下通过协议URL启动时，URL会作为参数，所以需要在这个事件里处理
    if (process.platform === 'win32') {
      handleArgv(argv)
    }
  })

  // macOS 下通过协议URL启动时，主实例会通过 open-url 事件接收这个 URL
  app.on('open-url', (event, urlStr) => {
    handleUrl(urlStr)
  })

  // 处理参数
  function handleArgv(argv) {
    const prefix = `${PROTOCOL}:`;
    // 开发阶段，跳过前两个参数（`electron.exe .`）
    // 打包后，跳过第一个参数（`myapp.exe`）
    const offset = app.isPackaged ? 1 : 2
    const url = argv.find((arg, i) => i >= offset && arg.startsWith(prefix))
    if (url) handleUrl(url)
  }

  // 解析Url
  function handleUrl(urlStr) {
    // myapp:?a=1&b=2
    const urlObj = new URL(urlStr);
    const {
      searchParams
    } = urlObj;
    // 根据需要做其他事情
    win.webContents.send('joinmeet', {
      meetingId: searchParams.get('meetingId'),
      token: searchParams.get('token'),
      pwd: searchParams.get('meetPwd')
    });
  }

}

const path = require('path')
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:8080` :
  `file://${__dirname}/index.html`
let childview

// 打开子窗口(弹出参会者列表)
ipcMain.on('openNewWindow', function (data) {
  console.log(data)
  // window.open('./components/participants.vue')
  childview = new BrowserWindow({
    width: 405,
    height: 970,
    // minWidth: 385,
    // minHeight: 750,
    // maxWidth: 450,
    // maxHeight: 970,
    // resizable: false, // 禁止窗口放大缩小
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
    },
    icon: `${__static}/app.png`,

  })
  childview.loadURL(winURL + '#/partlist'); //new.html是新开窗口的渲染进程
  if (!process.env.IS_TEST) childview.webContents.openDevTools() // 打开调试工具

  childview.on('closed', () => {
    childview = null
  })
})

// ipcMain.on('sendreplay', (event, data) => {
//   // console.log(data);
//   // console.log(event);
//   childview.on('closed', () => {
//     console.log(123);
//     childview = null
//   })
//   //主进程给渲染进程广播数据
//   // event.sender.send('replay', 'ok  haha');
// })


//打开新的窗口
ipcMain.on('openViewVideo', function () {
  createNewWindow()
});



//新建视频窗口
let newVideowin

function createNewWindow() {
  newVideowin = new BrowserWindow({
    title: '轻会议',
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true, // 在渲染进程中可以使用node
    },
    icon: `${__static}/app.png`,
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    newVideowin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/video')
    if (!process.env.IS_TEST) newVideowin.webContents.openDevTools()
  } else {
    createProtocol('app')
    newVideowin.loadURL('app://./index.html#/video')
  }
  newVideowin.on('closed', () => {
    newVideowin = null
  })
}

//设置菜单栏
function createMenu() {
  // darwin表示macOS，针对macOS的设置
  if (process.platform === 'darwin') {
    const template = [{
      label: '轻会议',
      submenu: [{
          role: 'about'
        },
        {
          role: 'quit'
        }
      ]
    }]
    let menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    //win和linux系统
    Menu.setApplicationMenu(null)
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

ipcMain.on('asynchronous-message', function () {
  // push()
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
