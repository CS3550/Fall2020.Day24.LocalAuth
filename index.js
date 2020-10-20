const express = require('express')
const path = require('path');
const app = express()
const bcrypt = require('bcryptjs')

app.use(express.static(path.join(__dirname, "/public")))

let credentials = [];

app.get("/login_route", (req, res) => {
  console.log(req.query);
  console.log(`tried to login with url params ${req.query.userName} and ${req.query.password}`);

  let credential = credentials.find(c => c.userName == req.query.userName);
  if (!credential) {
    console.log("There is no user with that name");
    return res.redirect("/index.html?error=Invalid credentials");
  }
  let valid = bcrypt.compareSync(req.query.password, credential.hash);
  if (!valid) {
    console.log("That password does not match");
    return res.redirect("/index.html?error=Invalid credentials");
  }

  res.sendFile(path.join(__dirname, '/private/private.html'));

})

app.get("/create_route", (req, res) => {
  let userName = req.query.userName;
  let password = req.query.password;

  if(credentials.find(c=>c.userName == userName)){
    console.log("That username is not available");
    return res.redirect("/index.html?error=That user name is not available")
  }

  console.log(req.query);

  let salt = bcrypt.genSaltSync(10);

  let hash = bcrypt.hashSync(password, salt);

  credentials.push({
    userName,
    password,
    salt,
    hash
  })

  console.log(credentials);

  res.redirect("/index.html")
})



app.get("/logout", (req, res) => {
  console.log("Logout");
  res.sendFile(path.join(__dirname, './public/index.html'))
})

app.listen(3000, () => console.log('Example app listening on http://localhost:3000'))

