const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const { response } = require('express');

// this will convert request body data from buffer to string we can read
app.use(bodyParser.urlencoded({extended: true}));


// setting ejs as a template engine
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// this function generates a random six string alphanumeric characters
function generateRandomString() {
  const result = Math.random().toString(36).substring(2,8);
  // console.log(result);
  return result;
};

// generateRandomString();

// sending a string
app.get('/', (req, res) => {
  res.send('Hello!');
});

// sending a json string
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// sending an html response
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

// using ejs template to /urls route
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  // console.log(templateVars); // including this to understand the code - to be deleted later
  res.render('urls_index', templateVars);
});

// routing to get the form for new urls
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

// submitting form at urls/new and posting response
app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  // console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
  // res.send(generateRandomString());         // Respond with 'Ok' (we will replace this)
});

// using ejs template + req.params to /urls:shortUrl route
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  // console.log(templateVars); // including this to understand the code - to be deleted later
  res.render('urls_show', templateVars);
});

// redirecting to the website from a shortURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
