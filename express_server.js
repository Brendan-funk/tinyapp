const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {username: req.cookies["username"]};
  res.render("urls_register", templateVars);
})
app.get("/urls/new", (req, res) => {
  templateVars = {username: req.cookies.username}
  res.render("urls_new",templateVars);
});

app.post("/urls", (req, res) => {
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body["longURL"];
  console.log(urlDatabase);
  res.redirect("/urls/"+shortUrl);
});

app.post("/login", (req,res) => {
  res.cookie("username",req.body["usernameValue"]);
  res.redirect("/urls");
});

app.post("/logout", (req,res) => {
  res.clearCookie('username');
  res.redirect("/urls");
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
})

app.get("/urls/:shortURL", (req,res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})

app.post("/urls/:shortURL/edit", (req,res) => {
  urlDatabase[req.params.shortURL] = req.body["longURL"];
  res.redirect("/urls");
})


app.listen(PORT, () => {
  console.log(`Server is live`);
});

const generateRandomString = function() {
   const charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let output = '';
   const shortUrlLength = 6;
   for(let i = 0; i < shortUrlLength; i++) {
     const randomNumber = Math.floor(Math.random() * charList.length);
     output += charList.charAt(randomNumber);
   }
   return output;
 };