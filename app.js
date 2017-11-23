var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/myproject';


function insertDocuments(db) {
  // Grab the documents collection.
  const collection = db.collection('documents');

  const documents = [{a: 1}, {a: 2}, {a: 3}];

  return collection.insertMany(documents).then((result) => {
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection!");
  });
}

function findDocuments(db) {
  // Grab the documents collection.
  const collection = db.collection('documents');

  // Only retrieve documents that match our query.
  // Queries are plain JS objects.
  const query = {a: 2};

  return collection.find(query).toArray().then((docs) => {
    console.log("Found the following records:");
    console.log(docs);
  });
}


function updateDocument(db) {
  const collection = db.collection('documents');

  // Update the first document matching the filter a === 2, setting b = 1.
  const filter = {a: 2};
  const update = {$set: {b: 1}};

  return collection.updateOne(filter, update).then((result) => {
    assert.equal(1, result.result.n);
    console.log("Successfully updated a document by setting b = 1.");
  });
}


function removeDocument(db) {
  const collection = db.collection('documents');

  // Delete the first document where a is 3
  const filter = {a: 3};

  return collection.deleteOne(filter).then((result) => {
    assert.equal(1, result.result.n);
    console.log('Removed a document matching a = 3!');
  });
}


function indexCollection(db) {
  const collection = db.collection('documents');

  // It appears that we only need to specify the keys, the value we actually
  // store in the object is not important.
  const fields = {a: 1};
  const options = null;

  return collection.createIndex(fields, options).then((results) => {
    console.log(`Added an index to field 'a' as "${results}"!`);
  });
}



MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server!");

  indexCollection(db)
    .then(() => insertDocuments(db))
    .then(() => updateDocument(db))
    .then(() => findDocuments(db))
    .then(() => removeDocument(db))
    .then(() => db.close());
});
