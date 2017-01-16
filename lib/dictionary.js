'use strict';
// API wrapper to interact with DynamoDb.
var dynamoose = require('dynamoose');

var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

// this belongs in index.js, but for smoe reason my AWS SDK will not allow it.
if(process.env.NODE_ENV === 'test') {
  dynamoose.local();
}

var Schema = dynamoose.Schema;
var fs = require('fs');
var Promise = require('bluebird');

var DictSchema = new Schema({
  id: {
    hashKey: true,
    type: String
  },
  anagrams : {
    type : Array
  }
}, {
  // createdAt and updatedAt
  timestamps: true
});

// creates the table in DynamoDB if it does not already exist.
var Dictionary = dynamoose.model("dictionary", DictSchema);

Dictionary.load = load;
Dictionary.append = append;
Dictionary.getAnagrams = getAnagrams;
Dictionary.destroyAll = destroyAll;
Dictionary.destroy = destroy;

/* Load the dictionary into memory as an array of words.  Then send them to Dynamo.
*  WARNING: This process takes 1-2 days to get through the entire dictionary.
*  If we can make the assumption that we are loading the database from scratch,
*  we could build the id and anagrams as an Object in memory, and then send the
*  finished list to Dynamo.  This would reduce the number of PUTs to Dynamo.
*/
function load() {
  var data = fs.readFileSync('./lib/dictionary.txt', 'ascii').split('\n');

  return Dictionary.append(data);
}

/* Take an array of one or more words, and add them to the dictionary if they do
*  not already exist.  If no entry exists with the key for the word, add it as a
*  new row.  Otherwise, find the existing row, and append the word to the list
*  of anagrams.
*
*  Uses Bluebirds #each to loop through each word syncronously, so as to avoid
*  any possible race conditions.
*/
function append(words) {
  if(words === undefined) { return Promise.resolve(); }
  return Promise.each(words, function(word) {
    if(word.length === 0) { return Promise.resolve(); }
    var sorted = sortWord(word);

    // check if key exists already in database.
    return Dictionary.get(sorted)
    .then(function(dictWord) {
      if(dictWord === undefined) {
        console.log(word);
        return Dictionary.create({
          id: sorted,
          anagrams: [word]
        });
      } else {
        if(dictWord.anagrams.indexOf(word) === -1) {
          return Dictionary.update(sorted, { anagrams: dictWord.anagrams.concat(word)});
        }
      }
    });
  });
}

/* Finds all anagrams for the given word.  If the word does not exist in the
*  database, returns an empty array.  Optionally, user can limit the number of
*  anagrams returned.
*/
function getAnagrams(word, limit) {
  var sorted = sortWord(word);
  return Dictionary.get(sorted).then(function(dictWord) {
    if(dictWord === undefined) { return []; }
    var results =  dictWord.anagrams.filter(function(anagram) {
      return word !== anagram;
    });

    if(isNaN(parseFloat(limit)) === false) {
      limit = Math.max(0, limit);
    }

    return results.slice(0, limit);
  });
}

/* Removes the word from the dictionary.  If the sorted word exists as a key in
*  the dictionary, and the word itself exists as a known anagram, removes the
*  word from the anaagram list.  If the key then has no more anagrams, removes
*  the row from the dictionary.
*
*/
function destroy(word) {
  var sorted = sortWord(word);

  return Dictionary.get(sorted).then(function(dictWord) {
    if(dictWord === undefined) { return true; }

    var index = dictWord.anagrams.indexOf(word);
    if(index > -1) {
      dictWord.anagrams.splice(index, 1);

      if(dictWord.anagrams.length > 0) {
        return Dictionary.update(sorted, { anagrams: dictWord.anagrams });
      } else {
        return Dictionary.delete(sorted);
      }
    }

  });
}

/* Dynamoose does not tell us when AWS is done deleting/creating a table. Instead,
*  we initiate the delete/create request, and then poll DynamoDB until we get back
*  the table status that we are looking for.
*/
function destroyAll() {
  return Dictionary.$__.table.delete()
  .then(function() {
    return repeatUntilStatus("DELETED");
  })
  .then(function() {
    return Dictionary.$__.table.init();
  })
  .then(function() {
    return repeatUntilStatus("ACTIVE");
  })
}

/* Poll DynamoDB until our table is in the status we are looking for.
*  Only necessary for live Dynamo tables.  Local tables do not have the same delay,
*  so we can skip it, so as to have faster test run times.
*  TODO: Implement a sane timeout limit.  Currently, it will poll forever.
*/
function repeatUntilStatus(status) {
  var promise;
  return new Promise(function(resolve) {
    if(process.env.NODE_ENV !== 'test') {
      promise = Promise.delay(1000);
    } else {
      promise = Promise.resolve();
    }
    return promise.then(function() {
      return Dictionary.$__.table.describe();
    })
    .then(function(data) {
      if(data.Table.TableStatus === status) {
        resolve(true);
      } else {
        resolve(repeatUntilStatus(status));
      }
    })
    .catch(function(err) {
      // indicates the table does not exist.
      if(err.code === 'ResourceNotFoundException' && status === 'DELETED') {
        resolve();
      }
    });
  });
}

/* Provides an algorithm for finding the Dynamo key for a given word.
*  Splits the word into a lowercase array of characters, sorts it alphabetically,
*  then rejoins the array back into a string.
*/
function sortWord(word) {
  return word.toLowerCase().split('').sort().join('');
}

module.exports = Dictionary;
