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

const checkEmail = function (newEmail,users) {
 for(const user in users) {
   if(newEmail === users[user].email) {
     return true;
   }
 }
 return false;
};

const getPassword = function(email,users) {
  for(const user in users) {
    if(users[user]["email"] === email) {
      return users[user]["password"];
    }
  }
  return false;
};
module.exports = {generateRandomString, checkEmail, getPassword};