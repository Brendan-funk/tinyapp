const { assert } = require('chai');
const { checkEmail, generateRandomString, getPassword } = require('../helpers');

const testUsers = {
  "userID1": {
    id: "userID1",
    email: "test1@gmail.com",
    password: "abcd",
  },
  "userID2": {
    id: "userID2",
    email: "user2@gmail.com",
    password: "12345",
  }
};


describe('#checkEmail', function() {

  it('should return true if email is in the object', function() {
    const result = checkEmail("user2@gmail.com",testUsers);
    assert.equal(result,true);
  });

  it('should return false if there is no user with that email in the users object', function() {
    const result = checkEmail("gungaginga@gmail.com",testUsers);
    assert.equal(result,false);
  });
});

describe('#generateRandomString', function() {

  it('should return a 6 character string', function() {
    const result = generateRandomString();
    assert.equal(result.length,6);
  });

  it('should return unique strings each time', function() {
    const result1 = generateRandomString();
    const result2 = generateRandomString();
    assert.notEqual(result1,result2);
  });
});

describe('#getPassword', function() {

  it('should return the encrypted password of the email specified', function() {
    const result = getPassword("user2@gmail.com",testUsers);
    assert.equal(result,"12345");
  });

  it('should return false if no email in the user database matches the one specified', function() {
    const result = getPassword('gungaginga@gmail.com',testUsers);
    assert.equal(result,false);
  });
});