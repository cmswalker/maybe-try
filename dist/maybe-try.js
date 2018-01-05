(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("maybeTry", [], factory);
	else if(typeof exports === 'object')
		exports["maybeTry"] = factory();
	else
		root["maybeTry"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
if (!Promise) {
  throw noPromises();
}

var responseFactory = function responseFactory(error, result) {
  return {
    error: error,
    result: result
  };
};

var noPromises = function noPromises() {
  new Error('No promise library available, please provide a global Promise polyfill');
};

var fallBackError = function fallBackError() {
  new Error('Must provide and explicit fallback value');
};

/**
 * Returns a Promise that will successfully resolve an object containing the original Error and either the successful value or fallback value
 *
 * @param {any} fallbackValue REQUIRED
 * @param {Promise} method requested promise method to execute
 * @returns Promise
 */
var promise = function promise(fallbackValue, method) {
  if (fallbackValue === undefined) {
    return fallBackError();
  }

  return new Promise(function (resolve, reject) {
    if (!method || typeof method !== 'function' && !method.then) {
      return reject(new Error('Must pass a promise-returning-function'));
    }

    return method().then(function (result) {
      return resolve(responseFactory(null, result));
    }).catch(function (err) {
      maybeTry.errorHandler(err);
      resolve(responseFactory(err, fallbackValue));
    });
  });
};

/**
 * Returns a callback with a null error value and a result containing the original Error and either the succussful value or fallback value
 *
 * @param {any} fallbackValue
 * @param {Function} method Callback that will expect (err, val)
 * @returns Function
 */
var callback = function callback(fallbackValue, method) {
  if (fallbackValue === undefined) {
    return fallBackError();
  }

  if (typeof method !== 'function') {
    return new Error('Must pass a callback-function');
  }

  return function (err, result) {
    if (err) {
      maybeTry.errorHandler(err);
      return method(null, responseFactory(err, fallbackValue));
    }

    return method(null, responseFactory(err, result));
  };
};

var catchMethod = function catchMethod(fallbackValue, method) {
  if (fallbackValue === undefined) {
    return fallBackError();
  }

  if (typeof method !== 'function') {
    return new Error('Must pass a callback-function');
  }

  var result = void 0;
  var error = void 0;
  try {
    result = method();
  } catch (e) {
    error = e;
    result = fallbackValue;
    maybeTry.errorHandler(e);
  }

  return {
    error: error,
    result: result
  };
};

var registerErrorHandler = function registerErrorHandler(f) {
  maybeTry.errorHandler = function (error) {
    return f(error);
  };
};

/**
 * maybe.promise - Must pass a function returning a promise
 * maybe.callback
 *
 * @return {Object} - promise and callback implementations of maybe-try
 */
var maybeTry = {
  errorHandler: function errorHandler() {},
  registerErrorHandler: registerErrorHandler,
  promise: promise,
  callback: callback,
  catch: catchMethod
};

exports.default = maybeTry;
module.exports = exports['default'];

/***/ })
/******/ ]);
});