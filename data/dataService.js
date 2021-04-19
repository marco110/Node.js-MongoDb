let mongoose = require('mongoose');
let logger = require('../util/logger');
// let MongoClient = require('mongodb').MongoClient;

class DataService {
    constructor() {
        this.dataBase = null;
        this.dbName = 'marco';
        this.mongodbUrl = "mongodb://marcoma:666888@192.168.218.133:27017/" + this.dbName;
    }

    async connect() {
        mongoose.connection.on('connected', () => {
            logger.log('info', 'Mongoose connection success to db: ' + this.dbName)
        });

        mongoose.connection.on('error', (err) => {
            logger.log('error', 'Mongoose connection error: ' + err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.log('info', 'Mongoose connection disconnected');
        });

        await mongoose.connect(this.mongodbUrl, {
            useNewUrlParser: true
        });
    }

    // createDb(dbName) {
    //     this.dbName = dbName;
    //     MongoClient.connect(`${url}${dbName}`, {
    //         useNewUrlParser: true
    //     }, (err, db) => {
    //         if (err) throw err;
    //         console.log("created db " + dbName);
    //         this.dataBase = db.db(dbName);
    //     });
    // }

    // createCollection(collectionName) {
    //     MongoClient.connect(`${url}${this.dbName}`, {
    //         useNewUrlParser: true
    //     }, (err, db) => {
    //         if (err) throw err;
    //         this.dataBase = db.db(this.dbName);
    //         this.dataBase.createCollection(collectionName, function (err, res) {
    //             if (err) throw err;
    //             console.log("created collection " + collectionName);
    //         });
    //     });

    // }
}

module.exports = DataService;