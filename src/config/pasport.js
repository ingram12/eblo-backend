var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
import dbconfig from './database';
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        connection.query("SELECT * FROM users WHERE id = ? ", [id], (err, rows) => {
            done(err, rows[0]);
        });
    });

    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
        },
        (req, username, password, done) => {
            connection.query("SELECT * FROM users WHERE username = ?",[username], (err, rows) => {
                if (err) {
                  return done(err);
                }

                if (rows.length) {
                    return done(null, false, {messsage: 'That username is already taken.'});
                } else {
                    const newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)
                    };

                    const insertQuery = "INSERT INTO users ( username, password ) values (?,?)";

                    connection.query(insertQuery, [newUserMysql.username, newUserMysql.password], (err, rows) => {
                      newUserMysql.id = rows.insertId;
                      return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
        },
        (req, username, password, done) => {
            connection.query("SELECT * FROM users WHERE username = ?", [username], (err, rows) => {
                if (err) {
                  return done(err);
                }

                if (!rows.length) {
                    return done(null, false, {message: 'No user found.'});
                }

                if (!bcrypt.compareSync(password, rows[0].password)) {
                  return done(null, false, {message: 'Wrong password.'});
                }

                return done(null, rows[0]);
            });
        })
    );
};
