const express = require('express');
const app = express();
const PORT = 8080;

// setting ejs as a template engine
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

// using ejs templatet to /urls route
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  // console.log(templateVars); // including this to understand the code - to be deleted later
  res.render('urls_index', templateVars);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
