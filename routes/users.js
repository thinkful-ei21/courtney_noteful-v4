'use strict';

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const User = require('../models/user');


router.post('/', (req, res, next) => {
	const {username, password, fullname} = req.body;

	return User.create({
		username,
		password,
		fullname
	})
	.then(user => {
		res.status(201).location(`/api/users/${user.id}`).json(user);
	})
	.catch(err => next(err));

});


module.exports = router;