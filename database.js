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

// Create entity
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
                    // Prevent empty username and password
                    if ((!user.username && user.username !== 0) || (!user.password && user.password !== 0)) {
                        return reject(new Error('No empty values possible'));
                    }
                    // Salt password
                    bcrypt.genSalt(8, (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        // Hash password
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

// Compare hashed passwords
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

// Export entities
module.exports = {
    sequelize,
    User
};
