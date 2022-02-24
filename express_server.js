const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
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

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.cookies["user"]};
  console.log(templateVars);
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {user: req.cookies["user"]};
  res.render("urls_register", templateVars);
})

app.post("/register", (req, res) => {
  if(!req.body["email"]) {
    res.status(400).send("please enter a valid email");
  } else if (!req.body["password"]){
    res.status(400).send("please enter a password");
  } else if (checkEmail(req.body["email"])) {
    res.status(400).send("email already registered");
  } else {
    const newID = generateRandomString();
    users[newID] = {
      id: newID,
      email: req.body["email"],
      password: bcrypt.hashSync(req.body["password"]),
    };
    res.cookie("user",newID);
    res.redirect("/urls");
  }
  console.log(users);
});

app.get("/login", (req, res) => {
  templateVars = {user: req.cookies["user"]};
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const loginEmail = req.body["email"];
  const loginPassword = req.body["password"];
  if(!checkEmail(loginEmail)) {
    res.status(403).send("No account with that email found");
  } else if (!passwordCheck(loginEmail,loginPassword)) {
    res.status(403).send("Invalid Password");
  } else {
    res.cookie("user",getUserId(loginEmail));
  }
});
app.get("/urls/new", (req, res) => {
  if(!req.cookies["user"]) {
    res.redirect("/login");
  }
  templateVars = {user: users[req.cookies.user]};
  res.render("urls_new",templateVars);
});

app.post("/urls/new", (req, res) => {
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = {
    longURL: req.body["longURL"],
    user: req.cookies["user"],
  };
  console.log(urlDatabase);
  res.redirect("/urls/"+shortUrl);
});

app.post("/logout", (req,res) => {
  res.clearCookie('user');
  res.redirect("/urls");
})

app.post("/urls/:shortURL/delete", (req, res) => {
  if(!req.cookies["user"]) {
  res.redirect("/login");
}
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
})

app.get("/urls/:shortURL", (req,res) => {if(!req.cookies["user"]) {
  res.redirect("/login");
}
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]["longURL"], user: req.cookies["user"]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
})



app.post("/urls/:shortURL/edit", (req,res) => {
  urlDatabase[req.params.shortURL] = req.body["longURL"];
  res.redirect("/urls");
})

app.get("/", (req, res) => {
  if(!req.cookies["user"]) {
    res.redirect("/login");
  }
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Server is live`);
});






//FUNCTIONS
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

 const checkEmail = function (newEmail) {
  for(const user in users) {
    if(newEmail === users[user].email) {
      return true;
    }
  }
  return false;
 };

 const passwordCheck = function(email,password) {
   for(const user in users) {
     if(users[user]["email"] === email && bcrypt.compareSync(password,users[user]["password"])) {
       return true;
     }
   }
   return false;
 };

 const getUserId = function(email) {
   for(const user in users) {
    if(users[user]["email"] === email) {
      return users[user].id;
    }
   }
 }