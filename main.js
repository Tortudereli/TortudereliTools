const path = require('path');
const request = require('request');
const LCUConnector = require("lcu-connector");
const connector = new LCUConnector();
const btoa = require('btoa');
const {
    exec
} = require("child_process");

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = require('electron');


function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        minWidth: 1024,
        minHeight: 576,
        height: 720,
        icon: path.join(__dirname, "icon/icon.ico"),
        title: "Tortudereli",
        webPreferences: {
            nodeIntegration: true
        }
    })


    connector.on('connect', data => {
        var clientUrl = `${data['protocol']}://${data['address']}:${data['port']}`;

        ipcMain.on("get", (event, arg) => {
            let options = {
                url: clientUrl + arg,
                strictSSL: false,
                auth: {
                    username: `${data['username']}`,
                    password: `${data['password']}`
                },
                headers: {
                    'Accept': 'application/json'
                },
                json: true
            }
            request.get(options, (err, response, body) => {
                event.returnValue = {
                    "body": body,
                    "status": response.statusCode
                };
            });
        });

        ipcMain.on("delete", (event, arg) => {
            let options = {
                url: clientUrl + arg,
                strictSSL: false,
                auth: {
                    username: `${data['username']}`,
                    password: `${data['password']}`
                },
                headers: {
                    'Accept': 'application/json'
                }
            }
            request.delete(options, (err, response, body) => {
                event.returnValue = {
                    "body": body,
                    "status": response.statusCode
                };
            });
        });

        ipcMain.on("post", (event, arg) => {
            let options = {
                url: clientUrl + arg['url'],
                strictSSL: false,
                auth: {
                    username: `${data['username']}`,
                    password: `${data['password']}`
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                json: arg['json']
            }
            request.post(options, (err, response, body) => {
                event.returnValue = {
                    "body": body,
                    "status": response.statusCode
                };
            });
        });

        ipcMain.on("put", (event, arg) => {
            let options = {
                url: clientUrl + arg['url'],
                strictSSL: false,
                auth: {
                    username: `${data['username']}`,
                    password: `${data['password']}`
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                json: arg['json']
            }
            request.put(options, (err, response, body) => {
                event.returnValue = {
                    "body": body,
                    "status": response.statusCode
                };
            });
        });

        ipcMain.on("patch", (event, arg) => {
            let options = {
                url: clientUrl + arg['url'],
                strictSSL: false,
                auth: {
                    username: `${data['username']}`,
                    password: `${data['password']}`
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                json: arg['json']
            }
            request.patch(options, (err, response, body) => {
                event.returnValue = {
                    "body": body,
                    "status": response.statusCode
                };
            });
        });

        ipcMain.on("getApi", (event, arg) => {
            let options = {
                url: arg,
                strictSSL: false,
                json: true
            }
            request.get(options, (err, response, body) => {
                event.returnValue = {
                    "body": body
                };
            });
        });

        ipcMain.on("getImg", (event, arg) => {
            let options = {
                url: clientUrl + arg,
                strictSSL: false,
                encoding: null,
                auth: {
                    username: `${data['username']}`,
                    password: `${data['password']}`
                },
                headers: {
                    'content-type': 'image/jpeg'
                }
            }
            request.get(options, (err, response, body) => {
                function Uint8ToString(u8a) {
                    var CHUNK_SZ = 0x8000;
                    var c = [];
                    for (var i = 0; i < u8a.length; i += CHUNK_SZ) {
                        c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
                    }
                    return c.join("");
                }
                var u8 = new Uint8Array(body);
                var b64encoded = btoa(Uint8ToString(u8));
                event.returnValue = {
                    "body": "data:image/png;base64," + b64encoded
                }
            });
        });

        ipcMain.on("getAudio", (event, arg) => {
            let options = {
                url: clientUrl + arg,
                strictSSL: false,
                encoding: null,
                auth: {
                    username: `${data['username']}`,
                    password: `${data['password']}`
                },
                headers: {
                    'content-type': 'audio/ogg'
                }
            }
            request.get(options, (err, response, body) => {
                function Uint8ToString(u8a) {
                    var CHUNK_SZ = 0x8000;
                    var c = [];
                    for (var i = 0; i < u8a.length; i += CHUNK_SZ) {
                        c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
                    }
                    return c.join("");
                }
                var u8 = new Uint8Array(body);
                var b64encoded = btoa(Uint8ToString(u8));
                event.returnValue = {
                    "body": "data:audio/ogg;base64," + b64encoded
                }
            });
        });

        ipcMain.on("getWebm", (event, arg) => {
            let options = {
                url: clientUrl + arg,
                strictSSL: false,
                encoding: null,
                auth: {
                    username: `${data['username']}`,
                    password: `${data['password']}`
                },
                headers: {
                    'content-type': 'video/webm'
                }
            }
            request.get(options, (err, response, body) => {
                function Uint8ToString(u8a) {
                    var CHUNK_SZ = 0x8000;
                    var c = [];
                    for (var i = 0; i < u8a.length; i += CHUNK_SZ) {
                        c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
                    }
                    return c.join("");
                }
                var u8 = new Uint8Array(body);
                var b64encoded = btoa(Uint8ToString(u8));
                event.returnValue = {
                    "body": "data:video/webm;base64," + b64encoded
                }
            });
        });

        setTimeout(() => {
            win.loadFile(path.join(__dirname, 'src/html/info.html'));
        }, 10000);
    });

    connector.on('disconnect', () => {
        exec("netsh advfirewall firewall delete rule name=\"LoLChatOffline\"", (error, data, getter) => {
            if (error) {
                console.log("error", error.message);
                return;
            }
            if (getter) {
                console.log("data", data);
                return;
            }
            console.log("data", data);
        });
        app.quit();
    });

    connector.start();
    win.loadFile(path.join(__dirname, 'src/html/waitingLoL.html'));
}


app.whenReady().then(createWindow)

Menu.setApplicationMenu(null);

app.on('window-all-closed', () => {
    exec("netsh advfirewall firewall delete rule name=\"LoLChatOffline\"", (error, data, getter) => {
        if (error) {
            console.log("error", error.message);
            return;
        }
        if (getter) {
            console.log("data", data);
            return;
        }
        console.log("data", data);
    });
    app.quit()
})