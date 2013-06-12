var Client	= require('../../models/client.js');
var crypto	= require('crypto');

exports.query = function query(req, res, next) {
	console.log('Query Clients');

	Client.find(function(err, clients) {

		res.send({
			error: err,
			clients: clients || null
		});
	});
};

exports.create = function create(req, res, next) {
	console.log('Create Client');

	Client.create(req.body, function (err, client) {
	
		res.send({
			error: err,
			client: client || null
		});
	});
};

exports.get = function get(req, res, next) {
	console.log('Get Client ' + req.params.id);

	Client.findOne({_id: req.params.id}, function(err, client) {

		if(err || !client) {
			res.send({err: 'user not exist'}, 404);
			return;
		}
	
		res.send(client.getProfile());
	});
};

exports.save = function save(req, res, next) {
	console.log('Update Client ' + req.params.id);

	Client.findByIdAndUpdate(req.params.id, req.body, function(err, client) {

		res.send({
			error: err,
			client: client || null
		});
	});
};

exports.remove = function remove(req, res, next) {
	console.log('Remove Client ' + req.params.id);

	Client.findByIdAndRemove(req.params.id, function(err, client) {
		
		res.send({
			error: err,
			client: client || null
		});
	});
};

exports.login = function login(req, res, next) {
	console.log('Login Client ' + req.body.email);

	var newToken = crypto.createHash('sha256').update(crypto.randomBytes(24).toString('hex') + req.body.email + new Date()).digest('hex');

	Client.findOneAndUpdate(
		{
			email: req.body.email,
			password: req.body.password,
		},
		{
			token: newToken
		},
		function(err, client) {
	
			if(err || !client) {
				res.send({err: 'wrong email/password'}, 401);
				return;
			}
	
			res.send(client.getProfile());
		}
	);
};