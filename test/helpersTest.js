const { assert } = require('chai');

const { compareEmail, urlsForUser, shortURLforUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
  "user3RandomID": {
    id: "user3RandomID", 
    email: "user3@example.com", 
    password: "blue-dog-pluto"
  }
};

const urlTestDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user3RandomID" },
  c5eG8t: { longURL: "https://www.amazon.ca", userID: "userRandomID" }
};



// Testing compareEmail function
describe('compareEmail', function() {
  it('should return a user with valid email', function() {
    const user = compareEmail(testUsers, "user@example.com");
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert.strictEqual(user, expectedOutput);
  });
  it('should return null with invalid email', function() {
    const user = compareEmail(testUsers, "use@example.com");
    const expectedOutput = null;
    // Write your assert statement here
    assert.strictEqual(user, expectedOutput);
  });
  it('should return null with empty email', function() {
    const user = compareEmail(testUsers, "");
    const expectedOutput = null;
    // Write your assert statement here
    assert.strictEqual(user, expectedOutput);
  });
});

// Testing urlsForUser
describe('urlsForUser', function() {
  it('should return an object with all shortURLs: longURLs for valid ID', function() {
    const urls = urlsForUser(urlTestDatabase, "userRandomID");
    const expectedOutput = { b6UTxQ: "https://www.tsn.ca", c5eG8t: "https://www.amazon.ca"};
    // Write your assert statement here
    assert.deepEqual(urls, expectedOutput);
  });
  it('should return {} if userID doesn\'t have any urls saved', function() {
    const user = urlsForUser(urlTestDatabase, "user2RandomID");
    const expectedOutput = {};
    // Write your assert statement here
    assert.deepEqual(user, expectedOutput);
  });
  it('should return {} if the url database is empty', function() {
    const user = urlsForUser({}, "user3RandomID");
    const expectedOutput = {};
    // Write your assert statement here
    assert.deepEqual(user, expectedOutput);
  });
});

// Testing shortURLforUser
describe('shortURLforUser', function() {
  it('should return true if shortURLs userID matches cookie userID', function() {
    const exists = shortURLforUser(urlTestDatabase, "i3BoGr", "user3RandomID");
    const expectedOutput = true;
    // Write your assert statement here
    assert.strictEqual(exists, expectedOutput);
  });  
  it('should return false if shortURLs userID matches cookie userID', function() {
    const exists = shortURLforUser(urlTestDatabase, "c5eG8t", "user3RandomID");
    const expectedOutput = false;
    // Write your assert statement here
    assert.strictEqual(exists, expectedOutput);
  });
  it('should return false if shortURLs does\'t exist in database', function() {
    const exists = shortURLforUser(urlTestDatabase, "afadsf", "user3RandomID");
    const expectedOutput = false;
    // Write your assert statement here
    assert.strictEqual(exists, expectedOutput);
  });
  it('should return false if user does\'t exist in database', function() {
    const exists = shortURLforUser(urlTestDatabase, "i3BoGr", "useRandomID");
    const expectedOutput = false;
    // Write your assert statement here
    assert.strictEqual(exists, expectedOutput);
  });
  it('should return false if database is empty', function() {
    const exists = shortURLforUser({}, "i3BoGr", "user3RandomID");
    const expectedOutput = false;
    // Write your assert statement here
    assert.strictEqual(exists, expectedOutput);
  });
});