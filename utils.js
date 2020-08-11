const fs = require('fs')

module.exports = class FileUtils {
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
