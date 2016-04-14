# learn_react
Webpack 配置 React 开发环境

Webpack 是一个前端资源加载和打包工具，只需要相对简单的配置就可以提供前端工程化需要的各种功能

安装 Webpack：`npm install -g webpack`

Webpack 使用一个名为 `webpack.config.js` 的配置文件

假设我们在当前工程目录有一个入口文件 app.js，React 组件放置在一个 components/ 目录下，组件被 app.js 引用，要使用 app.js，我们把这个文件指定输出到 dist/app.min.js，Webpack 配置如下：
```
var webpack = require('webpack')
var path = require('path')
//输出HTML和CSS等等文件到路径的插件
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	//入口 entry
	/*
		可以有两种的形势
		第一种：
		[
			'webpack/hot/dev-server',
        	'webpack-dev-server/client?http://localhost:9121',
        	path.resolve(__dirname, 'components/app.min.js')
        ]
        第二种：
        {
			"app/global.js": "app/global.js",
			"app/index/index.js": "app/index/index.js",
			"app/auth/login.js": "app/auth/login.js",
			"app/auth/register.js": "app/auth/register.js",
        }
	*/
	entry:{
		app: './src/app.js',
        download: './src/download.js'
	},

	//输出文件位置
    output: {
        //绝对路径,用于输出到位置
        path: __dirname + '/dist',
        //服务路径,用于热替换服务器
        publicPath: '/',
        //输出文件名
        filename: './app.min.js'
    },
    //模块
    module: {
        //webpack的核心,所有的文件通过loader来处理编译
        loaders: [
            //js
            {
                //首先匹配文件后缀
                test: /\.js[x]?$/,
                //然后指定作用范围,这里可不写,但是范围越小速度越快
                include: path.resolve(__dirname, 'components'),
                //排除目录,exclude后将不匹配
                exclude: /node_modules/,
                //加载的loader,上面匹配到的文件都通过下面的loader来处理编译,这里是babel-es6+react
                loader: 'babel?presets[]=react,presets[]=es2015'
            },
            //.css 文件使用 style-loader 和 css-loader 来处理
            { test: /\.css$/, loader: 'style!css' },
            //图片文件使用url-loader 处理 '?limit=8192'表示将所有小于8kb的图片都转为base64形式
            { test: /.(png|jpg)$/, loader: 'url-loader?limit=8192' }
        ]
    },
    //插件
    plugins: [
        //热替换插件
        new webpack.HotModuleReplacementPlugin(),
        //输出文件插件,最顶上有引入
        new CopyWebpackPlugin([
            { from: './index.html', to: 'index.html' },
        ]),
        //以下代码为压缩代码插件,在打包的时候用,开发环境下会减慢编译速度
        //new webpack.optimize.UglifyJsPlugin({
        //    这里是去除错误提示的配置,具体看webpack文档
        //    compress: {
        //        warnings: false
        //    }
        //}),
    ],
    //配置热替换服务器,每次改变JS文件都会自动AJAX刷新浏览器
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        contentBase: './components',
        port: 9121
    },
    //sourcemap,正式打包请去掉此行或改成none
    devtool: 'source-map',
  }
  ```
