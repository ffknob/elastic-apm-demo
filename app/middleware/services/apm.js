const uuid = require('uuid');
const Fakerator = require('fakerator');
const apm = require('elastic-apm-node');

module.exports = class ApmService {
    constructor() { }

    SPAN_TYPES() {
        //return ['app', 'db', 'cache', 'template', 'ext'];
        return ['ext.http.http', 'db.mongodb.query'];
    }

    getCurrentTransaction() {
        return apm.currentTransaction;
    }

    getCurrentTraceparent() {
        return apm.currentTraceparent;
    }

    setLabel(name, value) {
        apm.setLabel(name, value);
    }

    setUserContext(userContext) {
        let id = null;
        let firstName = null;
        let lastName = null;
        let username = null;
        let email = null;

        const fakerator = Fakerator();

        if (userContext.random) {
            firstName = fakerator.names.firstName();
            lastName = fakerator.names.lastName();
            username = fakerator.internet.userName(firstName, lastName);
            email = fakerator.internet.email(firstName, lastName);
        } else {
            id = userContext.id;
            username = userContext.username;
            email = userContext.email;
        }

        apm.setUserContext({
            id: uuid.v4(),
            username: username,
            email: email
        });
    }

    setCustomContext() {
    }

    captureError(error) {
        apm.captureError(error);
    }

    startTransaction(name, type, options) {
        return apm.startTransaction(name, type, options);
    }

    startSpan(name, type, options) {
        return apm.startSpan(name, type, options);
    }
}