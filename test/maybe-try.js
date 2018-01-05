const assert = require('assert');

const maybeTry = require('../dist/maybe-try');

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

const catchFactory = (forceErr) => {
  return () => {
    if (forceErr) {
      return notAFunction();
    }

    return 'foo bar'.replace('bar', 'baz');
  }
}

describe('maybeTry', function() {
  context('With Synchronous Catch', () => {
    it('Should handle success case', () => {
      const response = maybeTry.catch(null, catchFactory(false));
      const { result, error } = response;
      assert.ok(!error);
      assert.equal(result, 'foo baz');
    });

    it('Should handle error case', () => {
      const response = maybeTry.catch('bar', catchFactory(true));
      const { result, error } = response;
      assert.ok(error);

      const { message } = error;
      assert.equal(message, 'notAFunction is not defined');
      assert.equal(result, 'bar');
    });
  });

  context('With function-returning-promises', () => {
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
          assert.equal(error.message, PROMISE_ERR_MSG);
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

  context.only('With registerErrorHandler, a user-provided errorHandler gets called with the error context', () => {
    let calledHandler;

    beforeEach(() => {
      calledHandler = false;
    });

    afterEach(() => {
      maybeTry.errorHandler = () => {};
    });

    it('Should call the errorHandler with Synchronous catch', () => {
        const errorHandler = (error) => {
          const { message } = error;
          assert.equal(message, 'notAFunction is not defined');
          calledHandler = true;
        };

        maybeTry.registerErrorHandler(errorHandler);

        const response = maybeTry.catch('bar', catchFactory(true));
        const { result, error } = response;
        assert.ok(error);
        assert.equal(calledHandler, true);
    });

    it('Should call the errorHandler with Promises', (done) => {
        const errorHandler = (error) => {
          const { message } = error;
          assert.equal(message, PROMISE_ERR_MSG);
          calledHandler = true;
        };

        maybeTry.registerErrorHandler(errorHandler);

        maybeTry
          .promise([], promiseFactory.bind(null, true))
          .then(({ error, result }) => {
            assert.equal(error.message, PROMISE_ERR_MSG);
            assert.deepEqual(result, []);
            assert.equal(calledHandler, true);
            done();
          });
    });

    it('Should call the errorHandler with Callbacks', (done) => {
      const errorHandler = error => {
        const { message } = error;
        assert.equal(message, CB_ERR_MSG);
        calledHandler = true;
      };

      maybeTry.registerErrorHandler(errorHandler);

      callbackFactory(
        true,
        maybeTry.callback([], (standardCbErr, { error, result }) => {
          assert.ok(!standardCbErr);
          assert.ok(error);

          assert.equal(error.message, CB_ERR_MSG);
          assert.deepEqual(result, []);
          assert.equal(calledHandler, true);
          done();
        })
      );
    });
  });
});
