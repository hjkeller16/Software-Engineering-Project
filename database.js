const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const validator = require("email-validator");
const { Pool } = require('pg');

const pool = process.env.DATABASE_URL ? new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
}) : null;
var sequelize;

if (process.env.DATABASE_URL) {
    // the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        port: 3000,//match[4],
        host: 3000,//match[3],
        logging: true //false
    });
} else {
    //use local database
    const config = require('./config');
    // the application is executed on the local machine ... use postgres
    sequelize = new Sequelize(config.postgres.database, config.postgres.username, config.postgres.password, {
        host: config.postgres.host,
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        operatorsAliases: false
    });
}

// Create entity user
const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        unique: true
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

// Create entity location
const Location = sequelize.define('location', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: Sequelize.STRING,
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    address: Sequelize.STRING,
    lat: Sequelize.FLOAT,
    lng: Sequelize.FLOAT,
    image: Sequelize.BLOB('tiny'),
    avgrating: Sequelize.INTEGER
});

//create entity Comment
const Comment = sequelize.define('comment', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rating: Sequelize.INTEGER,
    content: Sequelize.STRING
});

Location.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(Location, { foreignKey: 'location_id' });

// Export entities
module.exports = {
    sequelize,
    User,
    Location,
    Comment
};
