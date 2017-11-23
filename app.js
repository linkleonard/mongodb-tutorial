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
  const query = {a: 2};
  collection.find(query).toArray(function(err, docs) {
    assert.equal(null, err);
    console.log("Found the following records:");
    console.log(docs);
    callback(docs);
  })
}


function updateDocument(db, callback) {
  const collection = db.collection('documents');

  // Update the first document matching the filter a === 2, setting b = 1.
  const filter = {a: 2};
  const update = {$set: {b: 1}};
  collection.updateOne(filter, update, function(err, result) {
    assert.equal(null, err);
    assert.equal(1, result.result.n);
    console.log("Successfully updated a document by setting b = 1.");
    callback(result);
  });
}


function removeDocument(db, callback) {
  const collection = db.collection('documents');

  // Delete the first document where a is 3
  const filter = {a: 3};
  collection.deleteOne(filter, function(err, result) {
    assert.equal(null, err);
    assert.equal(1, result.result.n);
    console.log('Removed a document matching a = 3!');
    callback(result);
  });
}


function indexCollection(db, callback) {
  const collection = db.collection('documents');

  // It appears that we only need to specify the keys, the value we actually
  // store in the object is not important.
  const fields = {a: 1};
  const options = null;
  collection.createIndex(fields, options, function(err, results) {
    assert.equal(null, err);
    console.log(`Added an index to field 'a' as "${results}"!`);
    callback(results);
  });
}



MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server!");

  indexCollection(db, function() {
    insertDocuments(db, function() {
      updateDocument(db, function() {
        findDocuments(db, function() {
          removeDocument(db, function() {
            db.close();
          });
        });
      });
    });
  });
});
