var dictionary = require("./dictionary");
var dynamoose = require('dynamoose');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
var sinon = require('sinon');
var Promise = require('bluebird');
chai.use(chaiAsPromised);

describe("the dictionary", function() {
  afterEach(function() {
    return dictionary.destroyAll();
  });

  describe("loading the dictionary file into the database", function() {
    it("loads the file into an array in memory, and then calls append", function() {
      sinon.stub(dictionary, 'append').returns(Promise.resolve());
      return dictionary.load()
      .then(function() {
        expect(dictionary.append.calledWith(sinon.match.array))
        dictionary.append.restore();
      });
    });
  });

  describe("appending to the dictionary", function() {
    it("adds new items if needed", function() {
      return dictionary.append(["read", "dear", "dare"])
      .then(function() {
        var results = dictionary.getAnagrams('read');
        return expect(results).to.eventually.eql(['dear', 'dare']);
      });
    });

    it("appends dictionarys to existing items if they already exist", function() {
      return dictionary.append(["read", "dear"])
      .then(function() {
        return dictionary.append(["dare"]);
      })
      .then(function() {
        var results = dictionary.getAnagrams('read');
        return expect(results).to.eventually.eql(['dear', 'dare']);
      });
    });

    it("does not add a duplicate if the word is already in the dictionary", function() {
      return dictionary.append(["read", "dear", "dare"])
      .then(function() {
        return dictionary.append(["dare"]);
      })
      .then(function() {
        var results = dictionary.getAnagrams('read');
        return expect(results).to.eventually.eql(['dear', 'dare']);
      });
    });

    it("returns successfully if no words are passed in", function() {
      return dictionary.append()
      .catch(function() {
        assert.fail("Append should not have failed");
      });
    });

    it("returns successfully if one or more words is an empty string", function() {
      return dictionary.append(['bear', ''])
      .catch(function() {
        assert.fail("Append should not have failed");
      });
    });
  });

  describe("fetching dictionarys for a word", function() {
    it("returns an empty array if the word does not exist in the database", function() {
      var results = dictionary.getAnagrams('read');
      return expect(results).to.eventually.eql([]);
    });

    it("returns the dictionarys for a word if it is in the dictionary", function() {
      return dictionary.append(["read", "dear", "dare"])
      .then(function() {
        var results = dictionary.getAnagrams('read');
        return expect(results).to.eventually.eql(['dear', 'dare']);
      });
    });

    it("can limit the number of words returned", function() {
      return dictionary.append(["read", "dear", "dare"])
      .then(function() {
        var results = dictionary.getAnagrams('read', 1);
        return expect(results).to.eventually.eql(['dear']);
      });
    });

    it("returns an empty array if limit is invalid", function() {
      return dictionary.append(["read", "dear", "dare"])
      .then(function() {
        var results = dictionary.getAnagrams('read', -1);
        return expect(results).to.eventually.eql([]);
      });
    });
  });

  describe("destroy", function() {
    it("removes the word from the list of dictionarys for the item", function() {
      return dictionary.append(['read', 'dear', 'dare'])
      .then(function() {
        var results = dictionary.getAnagrams('read');
        return expect(results).to.eventually.eql(['dear', 'dare']);
      })
      .then(function() {
        return dictionary.destroy('dare');
      })
      .then(function() {
        var results = dictionary.getAnagrams('read');
        return expect(results).to.eventually.eql(['dear']);
      });
    });

    it("removes the item itself if it no longer has any words in its dictionary list", function() {
      return dictionary.append(['bear'])
      .then(function() {
        var results = dictionary.getAnagrams('reab');
        return expect(results).to.eventually.eql(['bear']);
      })
      .then(function() {
        return dictionary.destroy('bear');
      })
      .then(function() {
        var results = dictionary.getAnagrams('reab');
        return expect(results).to.eventually.eql([]);
      });
    });

    it("returns successfully if the word can't be found in the dictionary", function() {
      expect(dictionary.destroy('snarglefluffer')).to.eventually.eql(true);
    });

    it("returns successfully if the word can't be found in the dictionary list", function() {
      return dictionary.append(['read', 'dear', 'dare'])
      .then(function() {
        var results = dictionary.getAnagrams('read');
        return expect(results).to.eventually.eql(['dear', 'dare']);
      })
      .then(function() {
        expect(dictionary.destroy('dera')).to.eventually.eql(true);
      })
    });
  });

});
