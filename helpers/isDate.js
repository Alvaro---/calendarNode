const moment = require('moment');

const isDate = (value, { req, location, path }) => {
    // console.log(value)
    // console.log(req, location, path)
    if (!value) {
        return false;
    }

    const fecha = moment(value);//Moment verificara si es fecha correcta o no en cualquier formato 
    if (fecha.isValid()) {
        return true;
    } else {
        return false;
    }
}

module.exports = { isDate }