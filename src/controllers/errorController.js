const path = require('path');

exports.getError = (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../views/error.html'));
};