// Helper functions for the server

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
const comparePassword = (list, user, regPassword) => {
  if(list[user].password === regPassword) {
    return true;
  } else {
    return null;
  }
};

module.exports = { compareEmail, comparePassword, generateRandomString };