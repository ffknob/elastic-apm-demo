const mongo = require('mongodb').MongoClient;
const axios = require('axios');

const apm = require('elastic-apm-node');

module.exports = class ApiService {
    constructor() { }

    static fetchAndSave(dataset) {
        const currentTraceparent = apm.currentTraceparent;

        let usersTransaction = apm.startTransaction('MongoDB', 'db.mongodb.connect', { childOf: currentTraceparent });

        let connectToMongoDbSpan = usersTransaction.startSpan('Connect to MongoDB');

        const url = 'mongodb://root:password@mongo:27017';
        return new Promise((resolve, reject) => {
            mongo.connect(url, (err, client) => {
                if (err) {
                    connectToMongoDbSpan.end();
                    usersTransaction.end();

                    reject(err);
                }

                connectToMongoDbSpan.end();

                let getUsersJsonSpan = usersTransaction.startSpan(`Fetch "${dataset}" JSON`);

                axios.get(`https://jsonplaceholder.typicode.com/${dataset}`)
                    .then(response => {
                        getUsersJsonSpan.end();

                        const data = response.data;

                        let createUsersCollectionSpan = usersTransaction.startSpan(`Create "${dataset}" collection`);

                        const db = client.db('apm-demo');        
                        const usersCollection = db.collection('users');
            
                        createUsersCollectionSpan.end();

                        let insertIntoUsersCollectionSpan = usersTransaction.startSpan(`Insert into ${dataset} collection`);

                        usersCollection.insertMany(data, (err, result) => {
                            insertIntoUsersCollectionSpan.end();

                            if (err) {
                                reject(err);
                            }

                            let findUsersSpan = usersTransaction.startSpan(`Find ${dataset} documents`, 'db.mongodb.query');

                            usersCollection.find().toArray((err, items) => {
                                findUsersSpan.end();
                                usersTransaction.end();

                                resolve(items);
                            });
                        });
                    })
                    .catch(error => {
                        usersTransaction.end();

                        reject(error);
                    });
            })
        });
    }
}