define({ "api": [
  {
    "type": "post",
    "url": "/words",
    "title": "Add one or more words to the dictionary.",
    "name": "CreateWords",
    "group": "Anagram",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "words",
            "description": "<p>An array of words to add to the dictionary.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "HTTP/1.1 201 OK",
          "content": " HTTP/1.1 201 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "lib/routes.js",
    "groupTitle": "Anagram"
  },
  {
    "type": "delete",
    "url": "/words",
    "title": "Delete all words from the corpus.",
    "name": "DeleteAll",
    "group": "Anagram",
    "success": {
      "examples": [
        {
          "title": "HTTP/1.1 204 OK",
          "content": " HTTP/1.1 204 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "lib/routes.js",
    "groupTitle": "Anagram"
  },
  {
    "type": "delete",
    "url": "/words/:word",
    "title": "Delete a word from the dictionary.",
    "name": "DeleteWord",
    "group": "Anagram",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "word",
            "description": "<p>Word to delete from the corpus.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "HTTP/1.1 200 OK",
          "content": " HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "lib/routes.js",
    "groupTitle": "Anagram"
  },
  {
    "type": "get",
    "url": "/anagrams/areAnagrams",
    "title": "Check if words are anagrams of each other.",
    "name": "GetAnagrams",
    "group": "Anagram",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "words",
            "description": "<p>Array of words to check</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>True or false</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "HTTP/1.1 200 OK",
          "content": " HTTP/1.1 200 OK\n {\n   result: true\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "lib/routes.js",
    "groupTitle": "Anagram"
  },
  {
    "type": "get",
    "url": "/anagrams/:word",
    "title": "Get the anagrams for a given word.",
    "name": "GetAnagrams",
    "group": "Anagram",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "word",
            "description": "<p>Word to search for.</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>Optional Max number of anagrams to return.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Array",
            "optional": false,
            "field": "anagrams",
            "description": "<p>Array of anagrams that match the given word.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "HTTP/1.1 200 OK",
          "content": " HTTP/1.1 200 OK\n {\n   anagrams: [\"ared\",\"daer\",\"dare\",\"dear\"]\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "lib/routes.js",
    "groupTitle": "Anagram"
  }
] });