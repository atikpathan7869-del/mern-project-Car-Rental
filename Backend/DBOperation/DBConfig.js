const { MongoClient } = require('mongodb');

const dbConfig = async () => {
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);

    const dbName = 'DB_Cars';
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    return db;
}

module.exports= {
    dbConfig
}