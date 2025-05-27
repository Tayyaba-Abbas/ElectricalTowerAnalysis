import { MongoClient } from 'mongodb';

const uri = 'mongodb://mern_user:laiba526@estate-shard-00-00.cjith.mongodb.net:27017,estate-shard-00-01.cjith.mongodb.net:27017,estate-shard-00-02.cjith.mongodb.net:27017/Estate?ssl=true&replicaSet=atlas-110ft0-shard-0&authSource=admin&retryWrites=true&w=majority';

let client;
let db;

export async function getDb() {
  if (!client || !client.topology?.isConnected()) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('Estate');
    console.log('MongoDB connected (singleton)');
  }
  return db;
}