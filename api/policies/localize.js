module.exports = function(req, res, next) {
	var lang = req.session.lang || 'es';
	req.setLocale(lang);
	next();
};
