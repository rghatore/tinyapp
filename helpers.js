// Helper functions for the server
const bcrypt = require('bcrypt');

// this function generates a random six string alphanumeric characters
const generateRandomString = () => {
  const result = Math.random().toString(36).substring(2,8);
  return result;
};

// this function checks if the registration or login email alreay exists in the database
// returns the userID if found. otherwise, null.
// same as getUsersByEmail function
const compareEmail = (list, userEmail) => {
  for (const user in list) {
    if (list[user].email === userEmail) {
      return user;
    }
  }
  return null;
};

// this functoin check if the password provided matches the password saved
const comparePassword = (list, user, loginPassword) => {
  return (bcrypt.compareSync(loginPassword, list[user].password)) ? true : null;
};

// this function returns the list of urls (as an object) for a particular user
const urlsForUser = (list, id) => {
  const userDatabase = {};
  for (const shortURL in list) {
    if (list[shortURL].userID === id) {
      userDatabase[shortURL] = list[shortURL].longURL;
    }
  }
  return userDatabase;
};

// this function return true or false if the shortURLs userID key matches the cookie userID
const shortURLforUser = (list, shortURL, id) => {
  return (list[shortURL] && (list[shortURL].userID === id)) ? true : false;
};

module.exports = { compareEmail, comparePassword, generateRandomString, shortURLforUser, urlsForUser };