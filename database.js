const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');

const config = require('./config');

const sequelize = new Sequelize(config.postgres.database, config.postgres.username, config.postgres.password, {
    host: config.postgres.host,
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
});

const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    password: Sequelize.STRING
}, {
        hooks: {
            beforeCreate: (user, options) => {
                return new Promise((resolve, reject) => {
                    bcrypt.genSalt(8, (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        bcrypt.hash(user.password, result, null, (err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            user.password = result;
                            resolve();
                        });
                    });
                });
            }
        }
    });

User.prototype.verifyPassword = function (password) {
    return new Promise((resolve, reject) => {
        return bcrypt.compare(password, this.password, (err, result) => {
            if (err) {
                return resolve(false);
            }
            resolve(result);
        });
    });
};

module.exports = {
    sequelize,
    User
};
