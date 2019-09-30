const mongo = require('mongodb').MongoClient;
const axios = require('axios');

const apm = require('elastic-apm-node');

module.exports = class ApiService {
    constructor() { }

    static async fetchAndSave(dataset) {
        const currentTraceparent = apm.currentTraceparent;

        let usersTransaction = apm.startTransaction('MongoDB', 'db.mongodb.connect', { childOf: currentTraceparent });

        let connectToMongoDbSpan = usersTransaction.startSpan('Connect to MongoDB');

        const url = 'mongodb://root:password@mongo:27017';
        mongo.connect(url, (err, client) => {
            if (err) {
                connectToMongoDbSpan.end();
                usersTransaction.end();

                console.error(err)
                return
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
                            throw err;
                        }

                        let findUsersSpan = usersTransaction.startSpan(`Find ${dataset} documents`, 'db.mongodb.query');

                        usersCollection.find().toArray((err, items) => {
                            findUsersSpan.end();
                            usersTransaction.end();

                            console.log(`Got ${items.length} ${dataset} documents`);
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