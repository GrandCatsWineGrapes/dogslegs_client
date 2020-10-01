const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	mode: 'development',
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	entry: './src/code/app.tsx',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'app.js'
	},
	module: {
		rules: [
			{test: /\.(scss|css)$/, use: ['style-loader', 'css-loader', 'sass-loader']},
			{test: /\.(ts|tsx)?$/, loader: 'awesome-typescript-loader'},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({template: './src/index.html'})
	],
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 3001
	}
}