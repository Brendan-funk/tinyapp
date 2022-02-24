const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const app = express();
const { getPassword } = require('./helpers');
const { checkEmail } = require(' ./helpers');
const { generateRandomString } = require('./helpers');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['gungaginga'],

  maxAge: 24 * 60 * 60 * 1000,
}))
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const users = {};
const urlDatabase = {
    "b2xVn2": {
      longURL:  "http://www.lighthouselabs.ca",
      user: "default",
    },
    "9sm5xK": {
      longURL: "http://www.google.com",
      user: "default"
    }, 
};

//Main Page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.session.user_id};
  res.render("urls_index", templateVars);
});

//Register Page
app.get("/register", (req, res) => {
  const templateVars = {user: req.session.user_id};
  res.render("urls_register", templateVars);
})

app.post("/register", (req, res) => {
  if(!req.body["email"]) {
    res.status(400).send("please enter a valid email");
  } else if (!req.body["password"]){
    res.status(400).send("please enter a password");
  } else if (checkEmail(req.body["email"],users)) {
    res.status(400).send("email already registered");
  } else {
    const newID = generateRandomString();
    users[newID] = {
      id: newID,
      email: req.body["email"],
      password: bcrypt.hashSync(req.body["password"],10),
    };
    req.session.user_id = req.body["email"];
    res.redirect("/urls");
  }
  console.log(users);
});

//Login page
app.get("/login", (req, res) => {
  templateVars = {user: req.session.user_id};
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const loginEmail = req.body["email"];
  const loginPassword = req.body["password"];
  if(!checkEmail(loginEmail),users) {
    res.status(403).send("No account with that email found");
  } else if (bycrpt.compareSync(loginPassword,getPassword(loginEmail,users))) {
    res.status(403).send("Invalid Password");
  } else {
    req.session.user_id = loginEmail;
    res.redirect('/urls');
  }
});

//New short URL Page
app.get("/urls/new", (req, res) => {
  if(!req.session.user_id) {
    res.redirect("/login");
  }
  templateVars = {user: req.session.user_id};
  res.render("urls_new",templateVars);
});

app.post("/urls/new", (req, res) => {
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = {
    longURL: req.body["longURL"],
    user: req.session.user_id,
  };
  console.log(urlDatabase);
  res.redirect("/urls/"+shortUrl);
});

//Logout
app.post("/logout", (req,res) => {
  req.session = null;
  res.redirect("/urls");
})

//Delete
app.post("/urls/:shortURL/delete", (req, res) => {
  if(!req.session.user_id) {
  res.redirect("/login");
}
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
})

//edit a short url
app.get("/urls/:shortURL", (req,res) => {
  if(!req.session.user_id) {
  res.redirect("/login");
}
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]["longURL"], user: req.session.user_id};
  res.render("urls_show", templateVars);
});


app.post("/urls/:shortURL/edit", (req,res) => {
  urlDatabase[req.params.shortURL] = req.body["longURL"];
  res.redirect("/urls");
})

//Using the short url link
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
})

//home page
app.get("/", (req, res) => {
  if(!req.session.user_id) {
    res.redirect("/login");
  }
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Server is live`);
});






