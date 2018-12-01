const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const validator = require("email-validator");
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
                    // Check if email is valid
                    if (!validator.validate(user.email)) {
                        return reject(new Error('Email is invalid'));
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
    image: Sequelize.BLOB('tiny')
    //productImage is a string
});

//create entity category
/*const Category = sequelize.define('category', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: Sequelize.STRING
}); */
Location.belongsTo(User, { foreignKey: 'user_id' });
//Location.belongsToMany(Category, { through: 'LocationCategory', foreignKey: 'category_id' });

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
Comment.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(Location, { foreignKey: 'location_id' });

//Category.belongsToMany(Location, { through: 'locationcategory', foreignKey: 'location_id' });
//Location.belongsToMany(Category, { through: 'locationcategory', foreignKey: 'category_id' });

// Export entities
module.exports = {
    sequelize,
    User,
    Location,
    //Category,
    Comment
};
