'use strict';

var express = require('express');
var router = express.Router();
var dictionary = require('./dictionary');

/**
 * @api {post} /words Add one or more words to the dictionary.
 * @apiName CreateWords
 * @apiGroup Anagram
 *
 * @apiParam {Number} words An array of words to add to the dictionary.
 * @apiSuccessExample
 *  HTTP/1.1 201 OK
 */
router.post('/words\.:ext?', function(req, res) {
  dictionary.append(req.body.words).then(function() {
    res.status(201).send();
  });
});

/**
 * @api {get} /anagrams/areAnagrams Check if words are anagrams of each other.
 * @apiName GetAnagrams
 * @apiGroup Anagram
 *
 * @apiParam {Array} words Array of words to check
 *
 * @apiSuccess (200) {Boolean} result True or false
 *
 * @apiSuccessExample
 *  HTTP/1.1 200 OK
 *  {
 *    result: true
 *  }
 */
router.get('/anagrams/areAnagrams\.:ext?', function(req, res) {
  if(Array.isArray(req.query.words)) {
    return res.json({ result: dictionary.areAnagrams(req.query.words) });
  } else {
    return res.status(400).send();
  }
});

/**
 * @api {get} /anagrams/:word Get the anagrams for a given word.
 * @apiName GetAnagrams
 * @apiGroup Anagram
 *
 * @apiParam {Number} word Word to search for.
 * @apiParam {Number} [limit] Optional Max number of anagrams to return.
 *
 * @apiSuccess (200) {Array} anagrams Array of anagrams that match the given word.
 *
 * @apiSuccessExample
 *  HTTP/1.1 200 OK
 *  {
 *    anagrams: ["ared","daer","dare","dear"]
 *  }
 */
router.get('/anagrams/:word\.:ext?', function(req, res) {
  dictionary.getAnagrams(req.params.word, req.query.limit)
  .then(function(anagrams) {
    res.json({ anagrams: anagrams });
  });
});

/**
 * @api {delete} /words/:word Delete a word from the dictionary.
 * @apiName DeleteWord
 * @apiGroup Anagram
 *
 * @apiParam {String} word Word to delete from the corpus.
 *
 * @apiSuccessExample
 *  HTTP/1.1 200 OK
 */
router.delete('/words/:word\.:ext?', function(req, res) {
  dictionary.destroy(req.params.word)
  .then(function() {
    res.status(200).send();
  });
});

/**
 * @api {delete} /words Delete all words from the corpus.
 * @apiName DeleteAll
 * @apiGroup Anagram
 *
 * @apiSuccessExample
 *  HTTP/1.1 204 OK
 */
router.delete('/words\.:ext?', function(req, res) {
  dictionary.destroyAll()
  .then(function() {
    res.status(204).send();
  });
});

module.exports = router;
