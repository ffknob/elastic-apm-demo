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

    async init(simulationRequest) {
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

        await delayGenerator.randomDelay(simulationRequest.maxRandomDelay);
    }

    async generateSuccess(simulationRequest) {
        await this.init(simulationRequest);
    }

    async generateThrownError(simulationRequest) {
        await this.init(simulationRequest);

        const errorGenerator = new ErrorGenerator();
        throw errorGenerator.getRandomError(); 
    }

    async generateUncaughtError(simulationRequest) {
        const apmService = new ApmService();
        
        await this.init(simulationRequest);

        const errorGenerator = new ErrorGenerator();

        apmService.captureError(errorGenerator.getRandomError()); 
    }

    async generateComplexTransaction(simulationRequest) {
        const apmService = new ApmService();
        const delayGenerator = new DelayGenerator();

        const complexTransaction = simulationRequest.complexTransaction;
        const traceparent = apmService.getCurrentTraceparent();

        await this.init(simulationRequest);

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

        await this.init(simulationRequest);
       
        const url = 'mongodb://root:password@localhost:27017';
        mongo.connect(url, (err, client) => {
            if (err) {
              console.error(err)
              return
            }

            axios.get('https://jsonplaceholder.typicode.com/users')
                .then(response => {
                    const data = response.data;

                    const db = client.db('apm-demo');        
                    const usersCollection = db.collection('users');
        
                    usersCollection.insertMany(data, (err, result) => {
                        if (err) {
                            throw err;
                        }

                        usersCollection.find().toArray((err, items) => {
                            console.log(items);
                        })
                    })
                })
                .catch(error => {
                    console.log(error);
                });
          });
/*
        for (let i = 0; i < distributedTransaction.totalSpans; i++) {
            let randomSpanTypeIndex = util.randomNumber(apmService.SPAN_TYPES().length);
            let span = apmService.startSpan(`Span #${i}`, apmService.SPAN_TYPES()[randomSpanTypeIndex]);

            await delayGenerator.randomDelay(simulationRequest.maxRandomDelay);

            span.end();

            await delayGenerator.randomDelay(simulationRequest.maxRandomDelay);
        }
*/
    }
}