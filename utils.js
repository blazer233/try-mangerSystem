const fs = require('fs')

const timeFormat = (date, type = "yyyy-mm-dd hh:ii:ss") => {
    var date = new Date(Number(date));
    var o = {
        "m+": date.getMonth() + 1, //月份   
        "d+": date.getDate(), //日   
        "h+": date.getHours(), //小时   
        "i+": date.getMinutes(), //分    
        "s+": date.getSeconds(), //秒   
    };
    if (/(y+)/.test(type)) {
        type = type.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    };
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(type)) {
            type = type.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        };
    }
    return type;
}
class FileUtils {
    constructor() {}
    checkFile(path) {
        return new Promise((resolve, reject) => {
            try {
                let result = fs.existsSync(path);
                if (result) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            } catch (e) {
                reject(e)
            }
        });
    }
    unlink(path) {
        return new Promise((resolve, reject) => {
            try {
                let result = fs.unlink(path, err => {
                    if (err) resolve(false)
                });
                if (result) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            } catch (e) {
                reject(e)
            }
        });
    }
    readFile(path, opts = 'utf8') {
        return new Promise((resolve, reject) => {
            try {
                var read_file = fs.createReadStream(path, {
                    encoding: 'utf8',
                    autoClose: true,
                });
                var remaining = '';
                read_file.on('data', function (data) {
                    remaining += data;
                    var index = remaining.indexOf('\n');
                    var last = 0;
                    while (index > -1) {
                        var line = remaining.substring(last, index);
                        last = index + 1;
                        func(line);
                        index = remaining.indexOf('\n', last);
                    }
                    remaining = remaining.substring(last);
                });
                read_file.on('end', function () {
                    resolve(remaining)
                });
            } catch (e) {
                console.error('Error writeObjectToJsonString:', e);
                resolve(e)
            }

        })
    }

    writeFile(path, data, opts = 'utf8') {
        return new Promise((resolve, reject) => {
            var out = null;
            out = fs.createWriteStream(path, {
                encoding: opts
            });
            out.write(data, (error) => {
                if (error) {
                    reject(error)
                } else {
                    resolve()
                }
            });
            out.end();
        })
    }

    mkdirs(dirname) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(dirname)) {
                fs.mkdir(dirname, {
                    recursive: true
                }, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports = {
    FileUtils,
    timeFormat
}
