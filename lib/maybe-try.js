if (!Promise) {
  throw noPromises();
}

const responseFactory = (error, result) => {
  return {
    error,
    result
  };
};

const noPromises = () => {
  new Error('No promise library available, please provide a global Promise polyfill');
}

const fallBackError = () => {
  new Error('Must provide and explicit fallback value');
};

/**
 * Returns a Promise that will successfully resolve an object containing the original Error and either the successful value or fallback value
 *
 * @param {any} fallbackValue REQUIRED
 * @param {Promise} method requested promise method to execute
 * @returns Promise
 */
const promise = (fallbackValue, method) => {
  if (fallbackValue === undefined) {
    return fallBackError();
  }

  return new Promise((resolve, reject) => {
    if (!method || (typeof method !== 'function' && !method.then)) {
      return reject(new Error('Must pass a promise-returning-function'));
    }

    return method()
      .then(result => resolve(responseFactory(null, result)))
      .catch(err => {
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
const callback = (fallbackValue, method) => {
  if (fallbackValue === undefined) {
    return fallBackError();
  }

  if (typeof method !== 'function') {
    return new Error('Must pass a callback-function');
  }

  return (err, result) => {
    if (err) {
      maybeTry.errorHandler(err);
      return method(null, responseFactory(err, fallbackValue));
    }

    return method(null, responseFactory(err, result));
  };
};

const catchMethod = (fallbackValue, method) => {
  if (fallbackValue === undefined) {
    return fallBackError();
  }

  if (typeof method !== 'function') {
    return new Error('Must pass a callback-function');
  }

  let result;
  let error;
  try {
    result = method();
  } catch(e) {
    error = e;
    result = fallbackValue;
    maybeTry.errorHandler(e);
  }

  return {
    error,
    result
  };
};

const registerErrorHandler = (f) => {
  maybeTry.errorHandler = error => f(error);
}

/**
 * maybe.promise - Must pass a function returning a promise
 * maybe.callback
 *
 * @return {Object} - promise and callback implementations of maybe-try
 */
const maybeTry = {
  errorHandler: () => {},
  registerErrorHandler,
  promise,
  callback,
  catch: catchMethod
};

export default maybeTry;
