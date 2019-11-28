const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const crypto = require("crypto");
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
				let password = req.body.password;
				let md5 = crypto.createHash("md5");
				let newPas = md5.update(password).digest("hex");
				const newUser = new User({
					username: req.body.username,
					email: req.body.email,
					avatar,
					password: newPas,
					identity: req.body.identity
				})
				newUser.save()
					.then(user => res.json(user))
					.catch(err => console.log(err))
			}
		})
})

//登陆
router.post('/login', (req, res) => {
	const email = req.body.email
	let password = req.body.password;
	let md5 = crypto.createHash("md5");
	let newPas = md5.update(password).digest("hex");
	console.log(newPas)
	User.findOne({
		username: req.body.username,
		password: newPas
	}).then(user => {
		if (!user) { //token
			return res.status(404).json("用户不存在")
		} else {
			const rule = { //token规则,包含哪些字段
				id: user.id,
				username: user.username,
				avatar: user.avatar,
				identity: user.identity
			}
			//jwt.sign('规则','加密名字','过期时间','箭头函数')
			jwt.sign(rule, "secret", {
				expiresIn: 3600 //一小时后过期
			}, (err, token) => {
				if (err) throw err
				res.json({
					success: true,
					token: "Bearer " + token
				})
			})
		}
	}).catch(err => {
		console.log("错误是:" + err)
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
