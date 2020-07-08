"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = __importDefault(require("uuid"));
const fakerator_1 = __importDefault(require("fakerator"));
const start_1 = __importDefault(require("elastic-apm-node/start"));
class ApmService {
    constructor() { }
    init() {
        return start_1.default.start({
            serviceName: process.env.ELASTIC_APM_SERVICE_NAME ||
                'elastic-apm-demo-middleware',
            serverUrl: process.env.ELASTIC_APM_SERVER_URL || 'http://apm-server:8200',
            secretToken: process.env.ELASTIC_APM_SECRET_TOKEN || '',
            logUncaughtExceptions: true
        });
    }
    getCurrentTransaction() {
        return start_1.default.currentTransaction;
    }
    getCurrentTraceparent() {
        return start_1.default.currentTraceparent;
    }
    setLabel(name, value) {
        start_1.default.setLabel(name, value);
    }
    setUserContext(userContext) {
        let id;
        let firstName;
        let lastName;
        let username;
        let email;
        const fakerator = fakerator_1.default();
        if (userContext.random) {
            firstName = fakerator.names.firstName();
            lastName = fakerator.names.lastName();
            username = fakerator.internet.userName(firstName, lastName);
            email = fakerator.internet.email(firstName, lastName);
        }
        else {
            id = userContext.id;
            username = userContext.username;
            email = userContext.email;
        }
        const userObject = {
            id: uuid_1.default.v4(),
            username: username,
            email: email
        };
        start_1.default.setUserContext(userObject);
    }
    setCustomContext() { }
    captureError(error, options, callback) {
        start_1.default.captureError(error, options, callback);
    }
    startTransaction(name, type, options) {
        return start_1.default.startTransaction(name, type, options);
    }
    startSpan(name, type, options) {
        return start_1.default.startSpan(name, type, options);
    }
}
exports.default = ApmService;
