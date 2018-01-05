// Examples

const maybeTry = require('../lib');

// Callback
const callbackFactory = (forceErr, callback) => {
  if (forceErr) {
    return callback(new Error(CB_ERR_MSG));
  }

  callback(null, SUCCESS);
};

// Synchronous Version

const data = 'some string';
// No need to handle try/catches here, maybeTry resolves both the runtime error and our fallback value
const dataIsValid = checkIfDataIsValid(data);
console.log('Synchronous Result', dataIsValid);

function checkIfDataIsValid(data) {
  return maybeTry.catch(false, function() {
    console.log('incomingData', data);
    // Will break at runtime as we're trying to operate Array method on String
    return data.filter((key) => {
      return !!data[key];
    });
  });
}

// Promise Version

fetchReviewsForProduct(1);

function fetchReviewsForProduct(productId) {
  const fallbackValue = [{ rating: '5' }];

  return maybeTry.promise(fallbackValue, getReviewsPromise)
    .then((response) => {
      // No need to handle catches here, maybeTry resolves both the db error and our fallback value
      // Decide what you'd like to do with the error from here, either ignore and use the fallback value, or handle it manually

      // Access both the result and the error on response
      console.log('Promise Result', response.result);
      // console.log('Error', response.error);
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
  console.log('Callback Result', response.result);
  // console.log('Error', response.error);
  return response.result; // fallbackValue (everything's ok, at least we have Tom)
}));

// Error Scenario Mocks

function getReviewsPromise() {
  return new Promise((resolve, reject) => {
    // NOTE: go off to the db and grab the reviews
    setTimeout(() => {
      // NOTE: oh no, there was an error down the promise chain!
      return reject(new Error('DB ERROR: Could not fetch the user reviews!'));
    }, 1000);
  });
}

function fetchFriendsForUser(userId, callback) {
  // NOTE: go off to the db and grab the friends
  setTimeout(() => {
    // NOTE: oh no, there was an error down the callback stack
    return callback(new Error('DB ERROR: Could not fetch the users friends!'));
  }, 1000);
}
