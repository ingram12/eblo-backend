// app/routes.js
export default (app, passport) => {
	app.use((err, req, res, next) => {
		res.send({status: 0, error: 'Fatal error!'});
	});

	app.get('/', (req, res) => {
		res.send('<html>111111</html>');
	});

	app.post('/login', (req, res, next) => {
		passport.authenticate('local-login', (err, user, info) => {
			if (err) {
				return next(err);
			}

			if (!user) {
				return res.send({status: 0, ...info});
			}

			req.logIn(user, function(err) {
				if (err) {
					return next(err);
				}
			});

			if (req.body.remember) {
				req.session.cookie.maxAge = 1000 * 60 * 3;
			} else {
				req.session.cookie.expires = false;
			}

			const {id, username} = user;
			return res.send({status: 1, id, username});
		}) (req, res, next);
	});

	app.post('/signup', (req, res, next) => {
		passport.authenticate('local-signup', (err, user, info) => {
			if (err) {
				return next(err);
			}

			if (!user) {
				return res.send({status: 0, ...info});
			}

			const {id, username} = user;
			return res.send({status: 1, id, username});
		}) (req, res, next);
	});

	app.get('/logout', (req, res) => {
		req.logout();
    return res.send({status: 1});
	});

  app.use(isLoggedIn);

	app.get('/profile', (req, res) => {
		const {id, username} = req.user;
		return res.send({status: 1, id, username});
	});

	app.get('/words', (req, res) => {
		const {id, username} = req.user;
		return res.send({status: 1, id, username});
	});

	app.get('/word/:id', (req, res) => {
		const {id, username} = req.user;
		return res.send({status: 1, id, username});
	});
};

const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
    return next();
  }
	res.send({status: 0, error: 'You are not authorized'});
}



/*
fetch("/profile", {
  method: "GET",
  credentials: 'same-origin'
});

fetch("/login", {
  method: "POST",
  body: 'username=ingram&password=ingram',
  credentials: 'same-origin',
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
});

fetch("/logout", {
  method: "GET",
  credentials: 'include'
});
*/
