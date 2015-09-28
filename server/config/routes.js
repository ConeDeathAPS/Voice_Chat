var users = require('./../controllers/users.js');

module.exports = function (app) {
	app.get('/users', function (req, res) {
		users.index(req, res);
	})

	app.post('/users', function (req, res) {
		users.create(req, res);
	})

	app.put('/users', function (req, res) {
		users.findOne(req, res);
	})

	app.delete('/users/:id', function (req, res) {
		users.destroy(req, res);
	})
}