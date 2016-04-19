import { assert } from 'chai';
import _ from 'lodash';
import Promise from 'bluebird';
import sinon from 'sinon';
import BaseController from 'server/controllers/BaseController';

const Model = {
    create(props) {
        if (_.isPlainObject(props)) {
            return Promise.resolve(props);
        }
        return Promise.reject('test error');
    },
    remove(id) {
        if (_.isNaN(id)) {
            return Promise.reject('test error');
        }

        return Promise.resolve();
    },
    getWithChildren(id) {
        if (_.isNaN(id)) {
            return Promise.reject('test error');
        }

        return Promise.resolve({ title: 'test entry' });
    }
};
const TestController = _.assign({}, BaseController, { Model });

describe('BaseController', () => {
    describe('create entry', () => {
        it('should respond with status 201', () => {
            const spy = sinon.spy();
            const req = {
                body: { title: 'test' }
            };
            const res = {
                status(code) {
                    spy(code);
                    return { json: function() {} };
                }
            };
            return TestController.create(req, res)
                .then(() => {
                    assert(spy.calledWith(201));
                });
        });

        it('should return created entry', () => {
            const spy = sinon.spy();
            const req = {
                body: { title: 'test' }
            };
            const res = {
                status() {
                    return { json: spy };
                }
            };
            return TestController.create(req, res)
                .then(() => {
                    assert(spy.calledWith({ result: req.body }));
                });
        });

        it('should call `next` function with error, if promise was rejected', () => {
            const spy = sinon.spy();
            return TestController.create({}, {}, spy)
                .then(() => {
                    assert(spy.calledWith('test error'));
                });
        });
    });

    describe('get', () => {
        it('should return entry by given id', () => {
            const spy = sinon.spy();
            const req = {
                params: { id: 3 }
            };
            const res = {
                status() {
                    return { json: spy };
                }
            };
            return TestController.get(req, res)
                .then(() => {
                    assert(spy.calledWith({ result: { title: 'test entry' } }));
                });
        });

        it('should respond with status 200', () => {
            const spy = sinon.spy();
            const res = {
                status(code) {
                    spy(code);
                    return { json: function() {} };
                }
            };
            return TestController.get({}, res)
                .then(() => {
                    assert(spy.calledWith(200));
                });
        });

        it('should call `next` function with error, if promise was rejected', () => {
            const spy = sinon.spy();
            const req = {
                params: { id: false }
            };

            return TestController.get(req, {}, spy)
                .then(() => {
                    assert(spy.calledWith('test error'));
                });
        });
    });

    describe('remove', () => {
        it('should respond with status 204', () => {
            const spy = sinon.spy();
            const req = {
                params: { id: 5 }
            };
            const res = {
                status(code) {
                    spy(code);
                    return { json: function() {} };
                }
            };
            return TestController.remove(req, res)
                .then(() => {
                    assert(spy.calledWith(204));
                });
        });

        it('should call `next` function with error, if promise was rejected', () => {
            const spy = sinon.spy();
            const req = {
                params: { id: false }
            };

            return TestController.remove(req, {}, spy)
                .then(() => {
                    assert(spy.calledWith('test error'));
                });
        });

        it('should return empty json body', () => {
            const spy = sinon.spy();
            const req = {
                params: { id: 3 }
            };
            const res = {
                status() {
                    return { json: spy };
                }
            };
            return TestController.remove(req, res)
                .then(() => {
                    assert(spy.calledWith());
                });
        });
    });
});