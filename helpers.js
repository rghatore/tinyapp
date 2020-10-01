// Helper functions for the server
const bcrypt = require('bcrypt');

// this function generates a random six string alphanumeric characters
function generateRandomString() {
  const result = Math.random().toString(36).substring(2,8);
  // console.log(result);
  return result;
};

// this function checks if the registration email alreay exists in the database
// returns the userID if found. otherwise, null.
const compareEmail = (list, regEmail) => {
  for (const user in list) {
    // console.log('USER: ', user);
    // console.log('user.email: ', list[user].email); // this is where I had trouble!
    // console.log('regEmail: ', regEmail);
    if (list[user].email === regEmail) {
      return user;
    }
  }
  return null;
};

// this functoin check if the password provided matches the password saved
const comparePassword = (list, user, loginPassword) => {
  // if(bcrypt.compareSync(loginPassword, list[user].password)) {
    // return true;
  // } else {
    // return null;
  // }
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
  // const userDatabase = {};
  // if (list[shortURL] && (list[shortURL].userID === id)) {
  //   // list[shortURL] = list[shortURL].longURL;
  //   // return userDatabase;
  //   return true;
  // } else {
  //   return null;
    
  // }
  return (list[shortURL] && (list[shortURL].userID === id)) ? true : false;

};

module.exports = { compareEmail, comparePassword, generateRandomString, shortURLforUser, urlsForUser };