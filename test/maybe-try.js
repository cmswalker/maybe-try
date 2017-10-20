const assert = require('assert');

const maybeTry = require('../lib');

const PROMISE_ERR_MSG = 'promise factory error';
const CB_ERR_MSG = 'callback factory error';
const SUCCESS = { status: 200 };

const promiseFactory = err => {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(new Error(PROMISE_ERR_MSG));
    }

    return resolve(SUCCESS);
  });
};

const callbackFactory = (forceErr, callback) => {
  if (forceErr) {
    return callback(new Error(CB_ERR_MSG));
  }

  callback(null, SUCCESS);
};

describe('maybeTry', function() {
  context('Function returning promises', () => {
    it('Should handle success case', done => {
      maybeTry.promise(null, promiseFactory).then(({ error, result }) => {
        assert.ok(!error);
        assert.equal(result.status, 200);
        done();
      });
    });

    it('Should handle fail case', done => {
      maybeTry
        .promise([], promiseFactory.bind(null, true))
        .then(({ error, result }) => {
          assert.ok(error.message);
          assert.deepEqual(result, []);
          done();
        });
    });
  });

  context('With callbacks', () => {
    it('Should handle success case', done => {
      callbackFactory(
        false,
        maybeTry.callback(null, (standardCbErr, { error, result }) => {
          assert.ok(!standardCbErr);
          assert.ok(!error);
          assert.equal(result.status, 200);
          done();
        })
      );
    });

    it('Should handle fail case', done => {
      callbackFactory(
        true,
        maybeTry.callback([], (standardCbErr, { error, result }) => {
          assert.ok(!standardCbErr);
          assert.ok(error);

          assert.equal(error.message, CB_ERR_MSG);
          assert.deepEqual(result, []);
          done();
        })
      );
    });
  });
});
