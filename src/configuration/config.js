const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');

const url = process.env.MONGO_URI || 'mongodb://mongodb:27017/sanjeevani'

mongoose.connect(url).then(()=>{
  console.log('Connection successful');
}).catch(err => {
  console.log('Some error occurred: '+err);
})

let dbConnection;

module.exports = {
  //This fuction is used to connect to the mongodb database
  connectToDb : (cb) => {
    MongoClient.connect(url).then((client)=>{
      dbConnection =  client.db()
      return cb()
    }).catch(err => {
      console.log(err);
      return cb(err)
    })
  },

  //This function is used to retrieve the information from mongodb database
  getDb : () => dbConnection
}