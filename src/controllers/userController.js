const path = require('path');
const bcrypt = require('bcrypt');
const user = require('../models/user')
const saltRounds = 10;

exports.getLogIn = (req, res) => {
  if (!req.session.userId)
    res.sendFile(path.join(__dirname, '../views/login.html'));
  else
    res.redirect('/');
};

exports.authentication = (req, res) => {
  user.getByEmail (req.body.email, (error, results) => {
    if (error)
      throw error;
    else if (results.length) {
      bcrypt.compare(req.body.password, results[0].password, (err, result) => {

        // Автентифікація користувача
        if (result)
          res.json({
          valid: true
          });
        else
          res.json({
          valid: false
          });
      });
    }
    else
      res.json({
        valid: false
      });
  });
};

exports.logIn = (req, res) => {
  user.getByEmail (req.body.email, (error, results) => {
    if (error)
      throw error;
    else if (results.length) {
      bcrypt.compare(req.body.password, results[0].password, (err, result) => {

        if (result) {
          
          // Встановлення ідентифікатора сесії користувача та перенаправлення на головну сторінку
          req.session.userId = results[0].id;
        }
        res.redirect(`/`);
      });
    }
  });
};

exports.getSignUp = (req, res) => {
  if (!req.session.userId)
    res.sendFile(path.join(__dirname, '../views/signup.html'));
  else
    res.redirect('/');
};

exports.checkEmail = (req, res) => {
  user.getByEmail (req.body.email, (error, results) => {
    if (error)
      throw error;

    // Перевірка на відсутність електронної пошти в базі даних
    else if (!results.length)
      res.json({
        valid: true
      });
    else 
      res.json({
        valid: false
      });
  });
};

exports.signUp = (req, res) => {

  // Хешування паролю отриманого з форми 
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err)
      throw err;
    else {
      user.add(req.body.firstName, req.body.lastName, req.body.email, hash, (error, results) => {
        if (error)
          throw error;
        else {

          // Встановлення ідентифікатора сесії для нового користувача та перенаправлення на головну сторінку
          req.session.userId = results.insertId;
          res.redirect(`/`);
        }
      });
    }
  });
};

exports.checkLogIn = (req, res) => {

  // Якщо користувач увійшов, отримуємо його дані з бази даних
  if (req.session.userId) {
    user.getById(req.session.userId, (error, results) => {
      if (error)
        throw error;

      // Повертаємо дані користувача у форматі JSON
      else 
        res.json({
          loggedIn: true,
          fullName: `${results[0].first_name} ${results[0].last_name}`,
          email: results[0].email,
          createdAt: results[0].created_at
        });
    });
  }

  // Якщо користувач не увійшов, повертаємо статус неуспішного входу
  else 
    res.json({ 
      loggedIn: false
    });
};

exports.logOut = (req, res) => {
  user.getById(req.session.userId, (error, results) => {
    if (error)
      throw error;
    else {

      // Знищення сесії користувача та перенаправлення на головну сторінку
      req.session.destroy();
      res.redirect('/');
    }
  });
};