var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy
, bcrypt = require('bcrypt');
passport.use(new LocalStrategy(function(username, password, done){
	process.nextTick(function () {
		User.findOne().where({
			or: [
				{ name: username },
				{ email: username }
			]
		}).populate('accessList').exec(function(err, user) {
			if (err) { return done(null, err); }
			if (!user) { 
				//return done(null, true, { message: 'Logged In Successfully'}); 
				return done(null, false, { message: 'Unknown user ' + username }); 
			}
			bcrypt.compare(password, user.password, function(err, res) {
				if (!res) return done(null, false, { message: 'Invalid Password'});
                User.update({id : user.id},{ lastLogin : new Date() }).exec(function(err,ruser){
                    delete user.password;
                    return done(null, user, { message: 'Logged In Successfully'} );
                });
			});
		})
	});
}));

passport.serializeUser(function(user,done){ 
	done(null, user);
});

passport.deserializeUser(function(id,done){	
	User.findOne(id.id).populate('companies').populate('accessList').exec(function (err, user){
		try {
			user.select_company = user.default_company;
			Company.findOne(user.select_company).populate('currencies').populate('base_currency').exec(function(e,company){
				user.company = company;
				done(err,user);
			});
		} catch (e) {
			done(null, false);
		}
	});
});	

module.exports = {
	express:{
		customMiddleware: function(app){
			var timeout = require('connect-timeout');
			app.use(passport.initialize());
			app.use(passport.session());
			app.use(timeout('60s'));
		}

	}
}
