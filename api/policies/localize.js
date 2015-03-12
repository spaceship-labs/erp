module.exports = function(req, res, next) {
	var lang = req.session.lang || 'en';
	req.setLocale(lang);
	next();
};
