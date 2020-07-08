import uuid from 'uuid';
import Fakerator from 'fakerator';
import apm from 'elastic-apm-node/start';
import {
    Transaction,
    LabelValue,
    CaptureErrorCallback,
    UserObject,
    CaptureErrorOptions,
    TransactionOptions,
    SpanOptions,
    Span,
    Agent
} from '../shared/types/apm'; //'elastic-apm-node';

class ApmService {
    private static instance: ApmService | null = null;

    private constructor() {}

    static getInstance(): ApmService {
        if (ApmService.instance) {
            return ApmService.instance;
        } else {
            ApmService.instance = new ApmService();
            return ApmService.instance;
        }
    }

    init(): Agent {
        return apm.start({
            serviceName:
                process.env.ELASTIC_APM_SERVICE_NAME ||
                'elastic-apm-demo-middleware',
            serverUrl:
                process.env.ELASTIC_APM_SERVER_URL || 'http://apm-server:8200',
            secretToken: process.env.ELASTIC_APM_SECRET_TOKEN || '',
            logUncaughtExceptions: true
        });
    }

    getCurrentTransaction(): Transaction | null {
        return apm.currentTransaction;
    }

    getCurrentTraceparent() {
        return apm.currentTraceparent;
    }

    setLabel(name: string, value: LabelValue) {
        apm.setLabel(name, value);
    }

    setUserContext(userContext) {
        let id: string | number;
        let firstName: string;
        let lastName: string;
        let username: string;
        let email: string;

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

        const userObject: UserObject = {
            id: uuid.v4(),
            username: username,
            email: email
        };

        apm.setUserContext(userObject);
    }

    setCustomContext() {}

    captureError(
        error,
        options?: CaptureErrorOptions,
        callback?: CaptureErrorCallback
    ) {
        apm.captureError(error, options, callback);
    }

    startTransaction(
        name: string,
        type: string,
        options?: TransactionOptions
    ): Transaction | null {
        return apm.startTransaction(name, type, options);
    }

    startSpan(name: string, type: string, options?: SpanOptions): Span | null {
        return apm.startSpan(name, type, options);
    }
}

export default ApmService;
