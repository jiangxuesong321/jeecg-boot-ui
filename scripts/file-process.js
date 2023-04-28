const fs = require('fs')

const dirCache = {}
const mkdir = (filePath) => {
    const arr = filePath.split('/')
    let dir = arr[0]
    for (let i = 1; i < arr.length; i++) {
        if (dir && !dirCache[dir] && !fs.existsSync(dir)) {
            dirCache[dir] = true
            fs.mkdirSync(dir)
        }
        dir = dir + '/' + arr[i]
    }
    fs.writeFileSync(filePath, '')
}

const createFile = (filePath, data) => {
    if (!fs.existsSync(filePath)) {
        mkdir(filePath)
    }
    try {
        fs.writeFileSync(filePath, data, 'utf8')
    } catch (error) {
        console.log(error)
    }
}

module.exports = createFile
