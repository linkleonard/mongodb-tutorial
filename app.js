var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/myproject';


function insertDocuments(db, callback) {
  // Grab the documents collection.
  const collection = db.collection('documents');

  const documents = [{a: 1}, {a: 2}, {a: 3}];
  collection.insertMany(documents, function(err, result) {
    assert.equal(null, err);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection!");
    callback(result);
  });
}

function findDocuments(db, callback) {
  // Grab the documents collection.
  const collection = db.collection('documents');

  // Only retrieve documents that match our query.
  // Queries are plain JS objects.
  const query = {a: 3};
  collection.find(query).toArray(function(err, docs) {
    assert.equal(null, err);
    console.log("Found the following records:");
    console.log(docs);
    callback(docs);
  })
}


MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server!");

  insertDocuments(db, function() {
    findDocuments(db, function() {
      db.close();
    });
  });
});
