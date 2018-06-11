'use strict';

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const User = require('../models/user');


router.post('/', (req, res, next) => {
	const {username, password, fullname} = req.body;

	return User.hashPassword(password)
		.then(digest => {
			return User.create({
				username,
				password: digest,
				fullname
			});
		})
		.then(user => {
			res.status(201).location(`/api/users/${user.id}`).json(user);
		})
		.catch(err => {
			if (err.code === 11000) {
	      err = new Error('The username already exists');
	      err.status = 400;
    	}
			next(err);
		});
});


module.exports = router;