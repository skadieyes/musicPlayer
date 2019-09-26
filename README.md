# 一个音乐播放器
## getJsonData
    1. 使用puppeteer模拟打开一个chorme, 并访问页面
    2. 通过puppeteer的launch方法生成了一个browser的实例，对应于浏览器，launch方法可以传入配置项，比较有用的是在本地调试时传入{headless:false}可以关闭headless模式。
    3. 监听并拦截页面的ajax请求
    4. 根据收到的数据用fs模块的appendFile写入到list.json中，这样就拿到了音乐的地址，也是数据的源头
## downloadMusic
    1. 拿到音乐，批量把音乐下载到本地
## uploadMusicQiNiu
    1. 到七牛云去注册，获得你的ACCESS_KEY和SECRET_KEY，通过实名认证之后获得一个免费的空间
    2. 读取下载到本地文件，遍历上传到七牛云空间上
## app
    1. 现在来做一个静态播放器，本地的list.json就是歌曲列表
    2. 使用h5 audio来播放音乐，如果需要自定义audio的样式，可以隐藏audio的ui，使用自定义的ui绑定audio元素的事件来控制audio。
