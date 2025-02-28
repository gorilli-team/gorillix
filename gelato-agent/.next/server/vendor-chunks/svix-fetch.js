"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/svix-fetch";
exports.ids = ["vendor-chunks/svix-fetch"];
exports.modules = {

/***/ "(rsc)/./node_modules/svix-fetch/fetch-npm-node.js":
/*!***************************************************!*\
  !*** ./node_modules/svix-fetch/fetch-npm-node.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar http = __webpack_require__(/*! http */ \"http\");\nvar https = __webpack_require__(/*! https */ \"https\");\nvar realFetch = __webpack_require__(/*! node-fetch */ \"(rsc)/./node_modules/node-fetch/lib/index.mjs\");\n\nconst httpAgent = new http.Agent({\n\tkeepAlive: true\n});\nconst httpsAgent = new https.Agent({\n\tkeepAlive: true\n});\n\nconst agent = function(_parsedURL) {\n\tif (_parsedURL.protocol == 'http:') {\n\t\treturn httpAgent;\n\t} else {\n\t\treturn httpsAgent;\n\t}\n};\n\nmodule.exports = function(url, options) {\n\tif (/^\\/\\//.test(url)) {\n\t\turl = 'https:' + url;\n\t}\n\treturn realFetch.call(this, url, {agent, ...options});\n};\n\nif (!global.fetch) {\n\tglobal.fetch = module.exports;\n\tglobal.Response = realFetch.Response;\n\tglobal.Headers = realFetch.Headers;\n\tglobal.Request = realFetch.Request;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvc3ZpeC1mZXRjaC9mZXRjaC1ucG0tbm9kZS5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYixXQUFXLG1CQUFPLENBQUMsa0JBQU07QUFDekIsWUFBWSxtQkFBTyxDQUFDLG9CQUFPO0FBQzNCLGdCQUFnQixtQkFBTyxDQUFDLGlFQUFZOztBQUVwQztBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsa0JBQWtCO0FBQ3JEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2dlbGF0by8uL25vZGVfbW9kdWxlcy9zdml4LWZldGNoL2ZldGNoLW5wbS1ub2RlLmpzPzkzOTAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBodHRwID0gcmVxdWlyZSgnaHR0cCcpO1xudmFyIGh0dHBzID0gcmVxdWlyZSgnaHR0cHMnKTtcbnZhciByZWFsRmV0Y2ggPSByZXF1aXJlKCdub2RlLWZldGNoJyk7XG5cbmNvbnN0IGh0dHBBZ2VudCA9IG5ldyBodHRwLkFnZW50KHtcblx0a2VlcEFsaXZlOiB0cnVlXG59KTtcbmNvbnN0IGh0dHBzQWdlbnQgPSBuZXcgaHR0cHMuQWdlbnQoe1xuXHRrZWVwQWxpdmU6IHRydWVcbn0pO1xuXG5jb25zdCBhZ2VudCA9IGZ1bmN0aW9uKF9wYXJzZWRVUkwpIHtcblx0aWYgKF9wYXJzZWRVUkwucHJvdG9jb2wgPT0gJ2h0dHA6Jykge1xuXHRcdHJldHVybiBodHRwQWdlbnQ7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGh0dHBzQWdlbnQ7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsLCBvcHRpb25zKSB7XG5cdGlmICgvXlxcL1xcLy8udGVzdCh1cmwpKSB7XG5cdFx0dXJsID0gJ2h0dHBzOicgKyB1cmw7XG5cdH1cblx0cmV0dXJuIHJlYWxGZXRjaC5jYWxsKHRoaXMsIHVybCwge2FnZW50LCAuLi5vcHRpb25zfSk7XG59O1xuXG5pZiAoIWdsb2JhbC5mZXRjaCkge1xuXHRnbG9iYWwuZmV0Y2ggPSBtb2R1bGUuZXhwb3J0cztcblx0Z2xvYmFsLlJlc3BvbnNlID0gcmVhbEZldGNoLlJlc3BvbnNlO1xuXHRnbG9iYWwuSGVhZGVycyA9IHJlYWxGZXRjaC5IZWFkZXJzO1xuXHRnbG9iYWwuUmVxdWVzdCA9IHJlYWxGZXRjaC5SZXF1ZXN0O1xufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/svix-fetch/fetch-npm-node.js\n");

/***/ })

};
;