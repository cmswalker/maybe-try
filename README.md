# maybe-try :see_no_evil:

Dependency-free Asynchronous JavaScript Maybe Monad

Node and Browser Compatible

View on [NPM](https://www.npmjs.com/package/maybe-try)

```bash
npm install maybe-try
```

## Usage

The module exposes 2 methods, one for callbacks and one for promises.

Each method takes 2 parameters, the fallbackValue for error scenarios, and a function.

Both parameters are **REQUIRED**, maybe-try does not supply a default value for you

More in-depth examples can be found [here](https://github.com/cmswalker/maybe-try/blob/master/examples)

```js
const maybeTry = require('maybe-try');

// Promise Version

function fetchReviewsForProduct(productId) {
  const fallbackValue = [{ rating: '5' }];

  return maybeTry.promise(fallbackValue, getReviewsPromise)
    .then((response) => {
      // No need to handle catches here, maybeTry resolves both the db error and our fallback value
      // Decide what you'd like to do with the error from here, either ignore and use the fallback value, or handle it manually

      // Access both the result and the error on response
      console.log('Promise Response', response);
      return response.result; // fallbackValue
    });
}

// Callback Version

const cbFallbackValue = [{ name: 'Tom' }];
fetchFriendsForUser(1, maybeTry.callback(cbFallbackValue, (err, response) => {
  // No need to handle errors here, maybeTry resolves both the db error and our fallback value
  // The first argument (err) will always be null to keep with error-first callback patterns

  // Decide what you'd like to do with the error from here, either ignore and use the fallback value, or handle it manually
  // Access both the result and the error on response
  console.log('Callback Response', response);
  return response.result; // fallbackValue (everything's ok, at least we have Tom)
}));

```
