'use strict';

var fs = require('fs');

var dict = {};

var anagram = {
  load: load,
  append: append,
  get: get,
  destroy: destroy,
  destroyAll: destroyAll
};

function load() {
  var data = fs.readFileSync('./lib/dictionary.txt', 'ascii').split('\n');

  append(data);
}

function append(words) {
  if(words === undefined) { return }
  words.forEach(function(word) {
    if(word.length === 0) { return }
    var sorted = sortWord(word);
    dict[sorted] = dict[sorted] || [];

    if(dict[sorted].indexOf(word) === -1) {
      dict[sorted].push(word);
    }
  });
}

// Fetch the anagrams for the given word.  Filter the word from the
// list of results.  Optionally limits the results to a given number.
// Note: The slice function already validates if limit is a number, and returns
// an empty array if validation fails.  However, we need to make sure limit is a
// non-negative number.

// @returns  {Array}
function get(word, limit) {
  var sorted = sortWord(word);

  var results = (dict[sorted] || []).filter(function(dictWord) {
    return word !== dictWord;
  });

  if(isNaN(parseFloat(limit)) === false) {
    limit = Math.max(0, limit);
  }

  return results.slice(0, limit);
}

// Destroy the word from the dictionary in memory, if it exists.
function destroy(word) {
  var sorted = sortWord(word);

  var results = dict[sorted] || [];

  var index = results.indexOf(word);
  if(index > -1) {
    results.splice(index, 1);
  }

  if(results.length === 0) {
    delete dict[sorted];
  }
}

// reset the dict to an empty object.
function destroyAll() {
  dict = {};
}

function sortWord(word) {
  return word.toLowerCase().split('').sort().join('');
}

module.exports = anagram;
