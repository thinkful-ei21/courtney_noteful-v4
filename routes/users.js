'use strict';

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const User = require('../models/user');


router.post('/', (req, res, next) => {
	const {username, password, fullname} = req.body;

	if(!username || !password) {
		return res.status(422).json({
			code: 422,
			reason: 'Validation Error',
			message: 'Missing field'
		});
	}

	if(typeof username !== 'string' || typeof password !== 'string') {
		return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string'
    });
	}

	if(username !== username.trim() || password !== password.trim()) {
		return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace'
    });
	}

	// const trimmedFields = ['username', 'password'];
	// const notTrimmed = trimmedFields.find(
	// 	field => req.body[field].trim() !== req.body[field]
	// );

	// if(notTrimmed) {
	// 	return res.status(422).json({
 //      code: 422,
 //      reason: 'ValidationError',
 //      message: 'Cannot start or end with whitespace',
 //      location: trimmedFields
 //    });
	// }

	if(username.length < 1) {
		return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: '`username` is too short'
    });
	}

	if(password.length < 8 || password.length > 72) {
		return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: '`password` needs to be more than 8 characters and less than 72'
    });
	}

	// const fieldSize = {
	// 	username: {
	// 		min: 1
	// 	},
	// 	password: {
	// 		min: 8,
	// 		max: 72
	// 	}
	// };

	// const tooSmallField = Object.keys(fieldSize).find(field => {
	// 	field.min in fieldSize[field] && 
	// 	req.body[field].trim() < fieldSize[field].min 
	// });

	// const tooLargeField = Object.keys(fieldSize).find(field => {
	// 	field.max in fieldSize[field] &&
	// 	req.body[field].trim().length > fieldSize[field].max
	// });

	// if (tooSmallField || tooLargeField) {
 //    return res.status(422).json({
 //      code: 422,
 //      reason: 'ValidationError',
 //      message: tooSmallField
 //        ? `Must be at least ${fieldSize[tooSmallField]
 //          .min} characters long`
 //        : `Must be at most ${fieldSize[tooLargeField]
 //          .max} characters long`,
 //      location: tooSmallField || tooLargeField
 //    });
 //  }


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