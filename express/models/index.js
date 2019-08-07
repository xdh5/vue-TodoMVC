const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://admin:xdh12345@cluster0-1hhjc.mongodb.net/test?retryWrites=true&w=majority";

module.exports = new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function (error, result) {
        if (error) {
            reject(error)
        } else {
            resolve(result.db('todolists'))
        }
    })
})
