const path = require('path')
const xlsx = require('node-xlsx')
const createFile = require('./file-process')

const indexFile = path.resolve(__dirname, '../src/i18n/index.js')
const translationsXlsx = path.resolve(__dirname, '../src/i18n/translations.xlsx')

const langList = xlsx.parse(translationsXlsx)
const content = langList[0].data
const langs = content[0]
const langObj = {}

content.shift()
langs.map((l, i) => (langObj[`${i}`] = { lang: l }))
content.map(row => {
    const _property = row[0]
    for (let _i = 1; _i < langs.length; _i++) {
        langObj[_i][_property] = row[_i]
    }
})

delete langObj[0]

Object.values(langObj).map(obj => {
    const langJson = path.resolve(__dirname, `../src/i18n/lang/${obj.lang.toLowerCase()}.json`)
    delete obj.lang
    createFile(langJson, JSON.stringify(obj, null, '\t'))
})

langs.shift()

const fileContent = [
    'import Vue from \'vue\';',
    'import VueI18n from \'vue-i18n\';'
]

let exportStr = `
export default new VueI18n({
    locale: 'zh',
    fallbackLocale: 'zh',
    messages: {
`
langs.map(l => {
    const importStr = `import ${l.toLowerCase()} from './lang/${l.toLowerCase()}.json';`
    fileContent.push(importStr)
    exportStr += `        ${l.toLowerCase()},\n`
})

fileContent.push('Vue.use(VueI18n);')
exportStr += `    }
});`

fileContent.push(exportStr)

createFile(indexFile, fileContent.join('\n'))
console.log('I18n is ready!')
