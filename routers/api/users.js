const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const User = require('../../models/Users')


//注册
router.post('/register', (req, res) => {
	User.findOne({
			email: req.body.email
		})
		.then((user) => {
			if (user) {
				return res.status(400).json("邮箱已经被注册")
			} else {
				const avatar = gravatar.url(req.body.email, {
					s: '200',
					r: 'pg',
					d: 'mm'
				});
				const newUser = new User({
					username: req.body.username,
					email: req.body.email,
					avatar,
					password: req.body.password,
					identity: req.body.identity
				})
				bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) {
							throw err
						}
						newUser.password = hash
						newUser.save()
							.then(user => res.json(user))
							.catch(err => console.log(err))
					});
				});
			}
		})
})

//登陆
router.post('/login', (req, res) => {
	const email = req.body.email
	const password = req.body.password
	User.findOne({
			email
		})
		.then(user => {
			if (!user) {
				return res.status(404).json("用户不存在")
			}
			bcrypt.compare(password, user.password)
				.then(isMatch => {
					if (isMatch) {
						const rule = {
							id: user.id,
							username: user.username,
							avatar: user.avatar,
							identity: user.identity
						}
						jwt.sign(rule, "secret", {
							expiresIn: 3600
						}, (err, token) => {
							if (err) throw err
							res.json({
								success: true,
								token: "Bearer " + token
							})
						})
					} else {
						return res.status(404).json("密码错误")
					}
				})
		})
})

//passport-jwt验证token
router.get('/current', passport.authenticate('jwt', {
	session: false
}), (req, res) => {
	res.json({
		id: req.user.id,
		username: req.user.username,
		email: req.user.email,
		identity: req.user.identity
	})
})
module.exports = router
