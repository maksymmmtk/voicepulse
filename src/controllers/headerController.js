const path = require('path');

exports.getHome = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
};

exports.getAbout = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/about.html'));
};

exports.getServices = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/services.html'));
};

exports.getTeam = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/team.html'));
};

exports.getContact = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/contact.html'));
};