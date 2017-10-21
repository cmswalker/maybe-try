'use strict';

/**
 * maybe.promise - Must pass a function returning a promise
 * maybe.callback
 *
 * @return {Object} - promise and callback implementations of maybe-try
 */
var maybeTry = {
  promise: promise,
  callback: callback,
  catch: catchMethod
};

if (typeof module !== 'undefined') {
  module.exports = maybeTry;
}

var responseFactory = function responseFactory(error, result) {
  return {
    error: error,
    result: result
  };
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
function promise(fallbackValue, method) {
  if (fallbackValue === undefined) {
    return fallBackError();
  }

  return new Promise(function (resolve, reject) {
    if (!method || typeof method !== "function" && !method.then) {
      return reject(new Error("Must pass a promise-returning-function"));
    }

    return method().then(function (result) {
      return resolve(responseFactory(null, result));
    }).catch(function (err) {
      return resolve(responseFactory(err, fallbackValue));
    });
  });
}

/**
 * Returns a callback with a null error value and a result containing the original Error and either the succussful value or fallback value
 *
 * @param {any} fallbackValue
 * @param {Function} method Callback that will expect (err, val)
 * @returns Function
 */
function callback(fallbackValue, method) {
  if (fallbackValue === undefined) {
    return fallBackError();
  }

  if (typeof method !== "function") {
    return new Error("Must pass a callback-function");
  }

  return function (err, result) {
    if (err) {
      return method(null, responseFactory(err, fallbackValue));
    }

    return method(null, responseFactory(err, result));
  };
}

function catchMethod(fallbackValue, method) {
  if (fallbackValue === undefined) {
    return fallBackError();
  }

  if (typeof method !== "function") {
    return new Error("Must pass a callback-function");
  }

  var result = void 0;
  var error = void 0;
  try {
    result = method();
  } catch (e) {
    error = e;
    result = fallbackValue;
  }

  return {
    error: error,
    result: result
  };
}