const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const { response } = require('express'); // what is this??
const cookieParser = require('cookie-parser');

// this will convert request body data from buffer to string we can read
app.use(bodyParser.urlencoded({extended: true}));

// this will populate req.cookies object in key-value pairs
app.use(cookieParser());

// setting ejs as a template engine
app.set('view engine', 'ejs');


// url database object - we're not working with actual databases yet
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// user database object - we're not working with actual databases yet
const users = { 
//   "userRandomID": {
//     id: "userRandomID", 
//     email: "user@example.com", 
//     password: "purple-monkey-dinosaur"
//   },
//  "user2RandomID": {
//     id: "user2RandomID", 
//     email: "user2@example.com", 
//     password: "dishwasher-funk"
//   }
};


// this function generates a random six string alphanumeric characters
function generateRandomString() {
  const result = Math.random().toString(36).substring(2,8);
  // console.log(result);
  return result;
};

// generateRandomString();

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
  const templateVars = { 
    username: req.cookies['username'],
    urls: urlDatabase };
  // console.log(templateVars); // including this to understand the code - to be deleted later
  res.render('urls_index', templateVars);
});

// routing to get the form for new urls
app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies['username']
  }
  res.render('urls_new', templateVars);
});

// routing to register as a user
app.get('/register', (req, res) => {
  const templateVars = {
    username: req.cookies['username']
  }
  res.render('urls_register', templateVars);
});

// submitting form at urls/new and posting response
app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  // console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

// using ejs template + req.params to /urls:shortUrl route
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { 
    username: req.cookies['username'],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL] };
  // console.log(templateVars); // including this to understand the code - to be deleted later
  res.render('urls_show', templateVars);
});

// redirecting to the website from a shortURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// Editing a url entry
// POST /urls/:id
app.post('/urls/:shortURL', (req, res) => {
  const longURL = req.body.newLongURL;
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = longURL;
  // console.log(urlDatabase);
  res.redirect('/urls');
});

// Login with username and set cookie
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
})

// Logout the user and clear cookie
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
})

// Deleting a url entry
app.post('/urls/:shortURL/delete', (req, res) => {
  // console.log(req.params.shortURL);
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});