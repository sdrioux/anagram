# anagram

## Documentation
https://sdrioux.github.io/anagram/

##Project

* Node.js
* Express
* [Dynamoose](https://github.com/automategreen/dynamoose) - AWS DynamoDB API Wrapper
* [ApiDoc](http://apidocjs.com/) for documentation
* [Istanbul](https://github.com/gotwarlost/istanbul) for code coverage
* Tests with [Mocha](https://github.com/mochajs/mocha), [Chai](https://github.com/chaijs/chai), and [Sinon](https://github.com/sinonjs/sinon)

## Setup
Follow the instructions [HERE](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) to set up a local version of DynamoDB, or feel free to use the cloud version.

Note: Ingesting the full dictionary.txt file takes SEVERAL DAYS.  We can not use the Dynamo BatchWriteItem command, as we check each word to see if it already exists in the database.  Even if we could, BatchWriteItem only allows 25 writes at a time, and there are over 250,000 words in the dictionary.  The loading function is currently commented out in ```index.js```.
```
npm install
# will use AWS DynamoDB
gulp start

# will use local AWS DynamoDB
gulp start-test
```
## Testing
Tests are meant to be run against a local version of Dynamo, as opposed to the cloud version.  The cloud version takes anywhere from 5-10 seconds to delete and recreate a table.  We are resetting the table after every test, so as you can imagine, running the test suite can take a long time.  The local version does not have this issue.

## Performance
Performance running on my local environment hovered between 200-500ms per request.  This is significantly slower than the advertised "single-digit millisecond latency at any scale", that AWS advertises.  Supposedly, however, requests will be much faster if the server is hosted on EC2 in the same region as our Dynamo DB.
