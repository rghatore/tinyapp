const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const { response } = require('express'); // what is this??
const cookieParser = require('cookie-parser');
const { compareEmail, comparePassword, generateRandomString, shortURLforUser, urlsForUser } = require('./helpers');

// this will convert request body data from buffer to string we can read
app.use(bodyParser.urlencoded({extended: true}));

// this will populate req.cookies object in key-value pairs
app.use(cookieParser());

// setting ejs as a template engine
app.set('view engine', 'ejs');


// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };
  
// url database object - we're not working with actual databases yet
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "dummy" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "dummy" }
};

// user database object - we're not working with actual databases yet
const users = {};

// generateRandomString(); // testing

// sending a string - this was just a test
// app.get('/', (req, res) => {
//   res.send('Hello!');
// });

// sending a json string
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// sending an html response - this was just a test
// app.get('/hello', (req, res) => {
//   res.send('<html><body>Hello <b>World</b></body></html>\n');
// });

// using ejs template to /urls route
app.get('/urls', (req, res) => {
  // console.log('cookie id :', req.cookies['user_id']); // testing
  // console.log('users :', users); // testing
  // console.log('user object: ', users[req.cookies['user_id']]); // testing

  if (req.cookies['user_id']) {
    const user = users[req.cookies['user_id']];
    const urls = urlsForUser(urlDatabase, user.id);
    const templateVars = { user, urls };
    // console.log('templateVars: ', templateVars); // including this to understand the code - to be deleted later
    res.render('urls_index', templateVars);
  } else {
    // res.send('Please register or login')
    res.status(403).render('urls_home', { user: null });  }
});

// routing to get the form for new urls
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']]
  }

  if (templateVars.user) {
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }
});

// routing to register as a user
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']],
    // page: 'register' // do not use the same template for login - makes it more complicated instead
  }
  res.render('urls_register', templateVars);
});

// routing to register as a user
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']],
  }
  res.render('urls_login', templateVars);
});

// submitting form at urls/new and posting response
app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console
  const longURL = req.body.longURL;
  const userID = req.cookies['user_id'];
  const shortURL = generateRandomString();

  urlDatabase[shortURL] = { longURL, userID };
  console.log(urlDatabase); // testing
  res.redirect(`/urls/${shortURL}`);
});

// using ejs template + req.params to /urls:shortUrl route
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const id = req.cookies['user_id'];
  if (shortURLforUser(urlDatabase, shortURL, id)) {
    const templateVars = { 
      shortURL, 
      user: users[id],
      longURL: urlDatabase[shortURL].longURL };
    // console.log(templateVars); // including this to understand the code - to be deleted later
    res.render('urls_show', templateVars);
  } else {
    res.status(403).render('urls_home', { user: null });  }
});

// redirecting to the website from a shortURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

// Editing a url entry
// POST /urls/:id
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const id = req.cookies['user_id'];
  if (shortURLforUser(urlDatabase, shortURL, id)) {
    const longURL = req.body.newLongURL;
    urlDatabase[shortURL].longURL = longURL;
    // console.log(urlDatabase);
    res.redirect('/urls');
  } else {
    // res.redirect('/urls/shortURL');
    res.status(403).render('urls_home', { user: null });  }
});

// Register a new user
app.post('/register', (req, res) => {
  // console.log(users); // testing - to be deleted later
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Please do not leave any fields empty');
  } else {

    // check if the email already exists
    
    if(compareEmail(users, req.body.email)) {
      res.status(400).send('This email is already registered.\nPlease login or register with a new email.');
    } else {
      const id = generateRandomString();
      const email = req.body.email;
      const password = req.body.password;
      users[id] = { id, email, password };
      res.cookie('user_id', id);
      // MENTOR ASSISTANCE HERE
      // console.log('----------------')
      // console.log(req.cookies['user_id']); // it has to come from a request method which had previous/empty cookie
      // console.log('----------------')
      // console.log('users obj: ', users); // testing - to be deleted later
      // console.log('----------------')
      // console.log(users[req.cookies['user_id']]); // testing - to be deleted later
      res.redirect('/urls');
    }
  }
});

// Login with username and set cookie
app.post('/login', (req, res) => {
  // res.cookie('username', req.body.username); // not using it anymore
  const user = compareEmail(users, req.body.email);  
  if (!user) {
    res.status(403).send('Please register')
  } else if (!comparePassword(users, user, req.body.password)) {
    res.status(403).send('Please check your password')
  } else {
    res.cookie('user_id', users[user].id);
    // console.log('user id: ', user); // testing - user is the same as user[user].id
    res.redirect('/urls');
  }
});

// Logout the user and clear cookie
app.post('/logout', (req, res) => {
  // res.clearCookie('username'); // not using it anymore
  res.clearCookie('user_id');
  res.redirect('/urls');
})

// Deleting a url entry
app.post('/urls/:shortURL/delete', (req, res) => {
  // console.log(req.params.shortURL);
  const shortURL = req.params.shortURL;
  const id = req.cookies['user_id'];
  if (shortURLforUser(urlDatabase, shortURL, id)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.status(403).render('urls_home', { user: null });
  }
  
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});