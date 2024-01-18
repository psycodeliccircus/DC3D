const { ipcMain, app, shell, nativeImage} = require('electron');

module.exports = [
    {
        label: 'DC3D Models v' + app.getVersion(),
        icon: nativeImage.createFromPath(__dirname + '/assets/icon.png').resize({ width: 16 }),
        submenu: [
            {
                label : 'Home', 
                icon: nativeImage.createFromPath(__dirname + '/assets/icon.png').resize({ width: 16 }),
                click : () => { require('./main')("home") }
            },
            {
                label : 'About', 
                icon: nativeImage.createFromPath(__dirname + '/assets/icon.png').resize({ width: 16 }),
                click : () => { require('./main')("about") }
            },
            { type: 'separator' },
            { 
                icon: nativeImage.createFromPath(__dirname + '/assets/reload.png').resize({ width: 16 }),
                role : 'reload'
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
        ]
    },
]
