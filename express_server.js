const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const cookieSession = require('cookie-session');

const { compareEmail, comparePassword, generateRandomString, shortURLforUser, urlsForUser } = require('./helpers');

// this will convert request body data from buffer to string we can read
app.use(bodyParser.urlencoded({extended: true}));

// this will encrypt our cookies // keys generated using dbus-uuidgen
app.use(cookieSession({
  name: 'session',
  keys: ['07d9531676240266356dfd935f762c6c', 'ff0570a4b7a91b5ae4e23bc35f762c8d']
}));

// setting ejs as a template engine
app.set('view engine', 'ejs');

// url database object - we're not working with actual databases yet
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "dummy" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "dummy" }
};

// user database object - we're not working with actual databases yet
const users = {};

// using ejs template to /urls route - only shows logged in user's urls
app.get('/urls', (req, res) => {
  const loginID = req.session['user_id'];
  if (loginID) {
    const user = users[loginID];
    const urls = urlsForUser(urlDatabase, user.id);
    const templateVars = { user, urls };
    res.render('urls_index', templateVars);
  } else {
    const message = 'Please register or login';
    res.status(403).render('urls_error', { message, user: null });
  }
});

// routing to get the form to add new urls
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.session['user_id']]
  };

  if (templateVars.user) {
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }
});

// routing to register as a user
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.session['user_id']]
  };
  res.render('urls_register', templateVars);
});

// routing to login as a user
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.session['user_id']]
  };
  res.render('urls_login', templateVars);
});

// submitting form at urls/new and redirecting to shortURL page
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const userID = req.session['user_id'];
  const shortURL = generateRandomString();

  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`/urls/${shortURL}`);
});

// using req.params for /urls:shortUrl route
// showing page if shortURL is registered with userID === loginID
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const loginID = req.session['user_id'];
  if (shortURLforUser(urlDatabase, shortURL, loginID)) {
    const templateVars = {
      shortURL,
      user: users[loginID],
      longURL: urlDatabase[shortURL].longURL };
    res.render('urls_show', templateVars);
  } else if (loginID) {
    const user = users[loginID];
    const message = 'Access denied: shortURL not assigned to this login';
    res.status(403).render('urls_error', { message, user });
  } else {
    const message = 'Please register or login';
    res.status(403).render('urls_error', { message, user: null });
  }
});

// redirecting to the website from a shortURL
// express only allows http:// redirects - i.e. www.amazon.ca !== https://www.amazon.ca
app.get("/u/:shortURL", (req, res) => {
  console.log('urlDATA:', urlDatabase);
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

// Editing a url entry // POST /urls/:id
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const loginID = req.session['user_id'];
  if (shortURLforUser(urlDatabase, shortURL, loginID)) {
    const longURL = req.body.newLongURL;
    urlDatabase[shortURL].longURL = longURL;
    res.redirect('/urls');
  } else {
    const message = 'Please register or login';
    res.status(403).render('urls_error', { message, user: null });
  }
});

// Register a new user
app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password) {
    const message = 'Please do not leave any fields empty';
    res.status(400).render('urls_error', { message, user: null });
  } else {
    // check if the email already exists in database
    if (compareEmail(users, req.body.email)) {
      const message = 'This email is already registered.\nPlease login or register with a new email.';
      res.status(400).render('urls_error', { message, user: null });
    } else {
      const id = generateRandomString();
      const email = req.body.email;
      const password = bcrypt.hashSync(req.body.password, salt);
      users[id] = { id, email, password };
      req.session['user_id'] = id;
      res.redirect('/urls');
    }
  }
});

// Login with username and set cookie
app.post('/login', (req, res) => {
  const user = compareEmail(users, req.body.email);
  if (!user) {
    const message = 'Please register';
    res.status(403).render('urls_error', { message, user: null });
  } else if (!comparePassword(users, user, req.body.password)) {
    const message = 'Please check your password';
    res.status(403).render('urls_error', { message, user: null });
  } else {
    req.session['user_id'] = users[user].id;
    res.redirect('/urls');
  }
});

// Logout the user and clear cookie
app.post('/logout', (req, res) => {
  req.session['user_id'] = "";
  res.redirect('/urls');
});

// Deleting a url entry
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  const id = req.session['user_id'];
  if (shortURLforUser(urlDatabase, shortURL, id)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    const message = 'Please register or login';
    res.status(403).render('urls_error', { message, user: null });
  }
  
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});