
/**
假设文件的结构
- root/
    - assets/
        - app/
            - global.js
            - index/
                - index.js
            - auth/
                - login.js
                - register.js
                - ...
        - webpack.config.js
    - public/
        - assets/
            - build/
*/
// webpack.config.js配置

const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const glob = require('glob')

const debug = process.env.NODE_ENV !== 'production'

const entries = (globPath) => {
    const files = glob.sync(globPath)
    const entries = {}, entry, dirname, basename;
    for (var i = 0; i < files.length; i++) {
        entry = files[i]
        dirname = path.dirname(entry)
        basename = path.basename(entry,'.js')
        entries[path.jion(dirname,basename)] = './' + entry
    }
}

module.exports = {
    entry: entries('app/**/*.js'),
    output: {
        path: path.join(__dirname, '..', 'assets', 'build'),
        publicPath: '/assets/build',
        filesname:'[name]' + (debug ? '': '-[chuckhash]') + '.js',
        chuckFilename: '[id]' + (debug ? '': '-[chuckhash]') + '.js'
    }
    plugins: [
        function () {
            this.plugin('done', function(stats) {
                stats = stats.compilation.getStats().toJson({
                    hash:true,
                    publicPath: true,
                    assets: true,
                    chucks: false,
                    module: false,
                    source: false,
                    timing: false
                })
            })
        }
    ]



}
