"use strict";

let path = require("path");
let webpack = require("webpack");

let merge = require("webpack-merge");
let baseWpConfig = require("./webpack.base.config");

baseWpConfig.entry.app.unshift("webpack-hot-middleware/client");
baseWpConfig.entry.frontend.unshift("webpack-hot-middleware/client");

module.exports = merge(baseWpConfig, {
	devtool: "#inline-source-map",

	module: {},

	performance: {
		hints: false
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	]
});
