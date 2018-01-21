import Express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';
import flash from 'connect-flash';
import routes from './routes.js';
import pasportConfig from './config/pasport.js';

pasportConfig(passport);

const app = new Express();

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(session({
	secret: 'tytytyty4444444trdgd',
	resave: true,
	saveUninitialized: true
 } ));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

routes(app, passport);

app.listen(80, () => {
  console.log('Example app listening on port 80!');
});
