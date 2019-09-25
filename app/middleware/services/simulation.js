const mongo = require('mongodb').MongoClient;
const axios = require('axios');

const uuid = require('uuid');
const DelayGenerator = require('./delay-generator');
const ErrorGenerator = require('./error-generator');
const LabelGenerator = require('./label-generator');
const ApmService = require('./apm');
const util = require('../shared/util');

module.exports = class Simulation {
    constructor() { }

    createUserContext(simulationRequest) {
        const userContext = simulationRequest.userContext;

        if (userContext) {
            return {
                random: simulationRequest.setRandomUserContext,
                id: userContext.id,
                username: userContext.username,
                email: userContext.email
            };
        } else {
            return { random: true };
        }
    }

    async init(simulationRequest, delay) {
        const apmService = new ApmService();
        const delayGenerator = new DelayGenerator();

        const userContext = this.createUserContext(simulationRequest);
        apmService.setUserContext(userContext);

        if (simulationRequest.setRandomLabels) {
            const labelGenerator = new LabelGenerator();
            const label = labelGenerator.getRandomLabel();
            apmService.setLabel(label.name, label.value);
        } else {
            simulationRequest.labels.forEach(label => apmService.setLabel(label.name, label.value));
        }

        if (delay) {
            await delayGenerator.randomDelay(simulationRequest.maxRandomDelay);
        }
    }

    async generateSuccess(simulationRequest) {
        await this.init(simulationRequest);
    }

    async generateThrownError(simulationRequest) {
        await this.init(simulationRequest);

        const errorGenerator = new ErrorGenerator();
        throw errorGenerator.getRandomError();
    }

    async generateCapturedError(simulationRequest) {
        const apmService = new ApmService();
        
        await this.init(simulationRequest);

        const errorGenerator = new ErrorGenerator();
        const error = errorGenerator.getRandomError();

        apmService.captureError(
            error,
            { 
                handled: false,
                custom: { 
                    fake: true,
                    category: error.category,
                    statusCode: errorGenerator.statusCode
                }
            }
        );
    }

    async generateComplexTransaction(simulationRequest) {
        const apmService = new ApmService();
        const delayGenerator = new DelayGenerator();

        const complexTransaction = simulationRequest.complexTransaction;
        const traceparent = apmService.getCurrentTraceparent();

        await this.init(simulationRequest, false);

        for (let i =0; i < complexTransaction.totalSubTransactions; i++) {
            let subTransactionName = `Sub-transaction #${i}`;
            let subTransactionType = 'custom';
            let subTransactionId = uuid.v4().split('-')[0];
            let subTransaction = 
                apmService.startTransaction(
                    `${subTransactionName} (${subTransactionId})`,
                    subTransactionType,
                    { childOf:  traceparent});

            for (let j = 0; j < complexTransaction.totalSpans; j++) {
                let randomSpanTypeIndex = util.randomNumber(apmService.SPAN_TYPES().length);
                let span = subTransaction.startSpan(`Span #${i}.${j}`, apmService.SPAN_TYPES()[randomSpanTypeIndex]);
    
                await delayGenerator.randomDelay(simulationRequest.maxRandomDelay);
    
                span.end();
    
                await delayGenerator.randomDelay(simulationRequest.maxRandomDelay);
            }

            subTransaction.end();
        }
    }

    async generateDistributedTransaction(simulationRequest) {
        const apmService = new ApmService();
        const delayGenerator = new DelayGenerator();

        const distributedTransaction = simulationRequest.distributedTransaction;
        const currentTransaction = apmService.getCurrentTransaction();
        const currentTraceparent = apmService.getCurrentTraceparent();

        await this.init(simulationRequest, false);

        let usersTransaction = apmService.startTransaction('MongoDB', 'db.mongodb.connect', { childOf: currentTraceparent });

        let connectToMongoDbSpan = usersTransaction.startSpan('Connect to MongoDB');

        const url = 'mongodb://root:password@localhost:27017';
        mongo.connect(url, (err, client) => {
            if (err) {
                connectToMongoDbSpan.end();
                usersTransaction.end();

                console.error(err)
                return
            }

            connectToMongoDbSpan.end();

            let getUsersJsonSpan = usersTransaction.startSpan('Get Users JSON');

            axios.get('https://jsonplaceholder.typicode.com/users')
                .then(response => {
                    getUsersJsonSpan.end();

                    const data = response.data;

                    let createUsersCollectionSpan = usersTransaction.startSpan('Create Users collection');

                    const db = client.db('apm-demo');        
                    const usersCollection = db.collection('users');
        
                    createUsersCollectionSpan.end();

                    let insertIntoUsersCollectionSpan = usersTransaction.startSpan('Insert into Users collection');

                    usersCollection.insertMany(data, (err, result) => {
                        insertIntoUsersCollectionSpan.end();

                        if (err) {
                            throw err;
                        }

                        let findUsersSpan = usersTransaction.startSpan('Find Users', 'db.mongodb.query');

                        usersCollection.find().toArray((err, items) => {
                            findUsersSpan.end();
                            usersTransaction.end();

                            console.log(`Got ${items.length} items`);
                        });
                    });
                })
                .catch(error => {
                    usersTransaction.end();

                    console.log(error);
                });
          });
    }
}