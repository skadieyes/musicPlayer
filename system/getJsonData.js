/*
* https://zhaoqize.github.io/puppeteer-api-zh_CN/#/
* */
const puppeteer = require('puppeteer-core')
const fs = require('fs')

let jsonDataList = [];
(async () => {
    const browser = await puppeteer.launch({
        executablePath: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`,
        headless: true
    })
    const page = await browser.newPage()
    await page.goto('http://music.wandhi.com/?name=%E8%A1%80%E8%85%A5%E7%88%B1%E6%83%85%E6%95%85%E4%BA%8B&type=netease')

    // 根据网站规则，监听页面ajax请求，截获请求数据
    page.on('response', async res => {
        const url = res.url()
        console.log('url')
        console.log(url)
        if (url === 'http://music.wandhi.com/') {
            const data = await res.json()
            const list = data.data
            console.log('list')
            console.log(list)
            jsonDataList.push(...list)

            // 词曲分离分别写入各自文件
            function writeData() {
                let list = jsonDataList.map(item => {
                    const lrcJson = JSON.stringify({lrc: item.lrc}, null, 4)
                    console.log('写入songid.json')
                    console.log(item)
                    if (item.songid !== 31311140) return
                    fs.appendFile(`./system/musicLrc/${item.songid}.json`, lrcJson, (e, result) => {
                        console.log(item.songid)
                        console.log(result)
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
