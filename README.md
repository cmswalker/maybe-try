# maybe-try :see_no_evil:

## A declarative sync & async js maybe that notes something may fail

Node and Browser Compatible

View on [NPM](https://www.npmjs.com/package/maybe-try)

```bash
npm install maybe-try
```

## Usage

The module exposes 3 methods, one for synchronous operations, one for promises, and one for callbacks.

Each method takes 2 parameters, the fallbackValue for error scenarios, and a function.

Both parameters are **REQUIRED**, maybe-try does not supply a default value for you

Returns an object with caught errors (if any) and either the result or fallbackValue, depending on success

More in-depth examples can be found [here](https://github.com/cmswalker/maybe-try/blob/master/examples)

### Synchronous Version

```js
const maybeTry = require('maybe-try');

// Synchronous Version

const data = 'some string';
const { error, result } = maybeTry.catch(false, functionThatOperatesOnDataAsIfItWereAnArray(data));
// No need to run try/catches in your code blocks, maybeTry resolves the caught error and result with assignment
```

### Promise Version

```js
// Promise Version

function fetchReviewsForProduct(productId) {
  const fallbackValue = [{ rating: 5 }];

  return maybeTry.promise(fallbackValue, getReviewsPromise)
    .then(({ error, result }) => {
      // No need to handle catches here, maybeTry resolves both the db error and our fallback value
      // Decide what you'd like to do with the error from here, either ignore and use the fallback value, or handle it manually
      // However, you still have access to the error in the response body should you need it

      // Access both the result and the error on response
      console.log('Promise Response', result);
      return result; // fallbackValue ([{ rating: 5 }])
    });
}
```

### Callback Version

```js
// Callback Version

const cbFallbackValue = [{ name: 'Tom' }];
fetchFriendsForUser(1, maybeTry.callback(cbFallbackValue, (err, { error, result }) => {
  // No need to handle errors here, maybeTry resolves both the db error and our fallback value
  // The first argument (err) will always be null to keep with error-first callback patterns
  // However, you still have access to the error in the response body should you need it

  // Decide what you'd like to do with the error from here, either ignore and use the fallback value, or handle it manually
  // Access both the result and the error on response
  console.log('Callback Response', result);
  return result; // fallbackValue (everything's ok, at least we have Tom)
}));

```

## Registering an errorHandler

An optional feature to register a function to handle errors for all occurances within the module

It's useful if you'd like to only stick to the happy path with your application logic but send logs to an external service when errors do occur

It should be noted that the errorHandler is a fire and forget method. You cannot chain to it or call it explicitly.

### Example using the Syncronous Version

```js
const errorHandler = error => {
  const { message } = error;
  console.log('An Error was caught from maybe-try', error);
  logErrorsToAnExternalService(error);
};

maybeTry.registerErrorHandler(errorHandler);

// The API remains the same, but the errorHandler will be firing in the background
const data = 'some string';
const { error, result } = maybeTry.catch(false, functionThatOperatesOnDataAsIfItWereAnArray(data));
// at this point, logErrorsToAnExternalService() has been called
```
