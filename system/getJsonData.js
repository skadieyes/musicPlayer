
const puppeteer = require('puppeteer-core')
const fs = require('fs')

let jsonDataList = [];
(async () => {
    const browser = await puppeteer.launch({
        executablePath: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`,
        headless: true
    })
    const page = await browser.newPage()
    await page.goto('http://music.wandhi.com/?name=No%20roots&type=netease')

    // 根据网站规则，监听页面ajax请求，截获请求数据
    page.on('response', async res => {
        const url = res.url()
        if (url === 'http://music.wandhi.com/') {
            const data = await res.json()
            const list = data.data
            jsonDataList.push(...list)

            // 词曲分离分别写入各自文件
            function writeData() {
                let list = jsonDataList.map(item => {
                    const lrcJson = JSON.stringify({lrc: item.lrc}, null, 4)
                    if (item.songid !== 444324644) return
                    fs.appendFile(`./system/musicLrc/${item.songid}.json`, lrcJson, (e, result) => {
                        if (e) {
                            console.error(e)
                        }
                    })
                    // 剔除歌词
                    delete item.lrc
                    return item
                })
                // 写入歌曲列表
                console.log('写入歌曲列表')
                fs.appendFile('./system/musicList.json', JSON.stringify(list, null, 4), (e, result) => {
                    if (e) {
                        console.error(e)
                    }
                })
            }
            writeData()
            /* // 判断列表长度自动翻页
            if (list.length >= 10) {
                console.log('下一页')
                // 此处需要延迟执行 300s 最为合适
                setTimeout(() => {
                    page.click('.aplayer-more').catch(e => {
                        writeData()
                    })
                }, 300)
                return
            } else {
                writeData()
            } */
        }
    })
})()
