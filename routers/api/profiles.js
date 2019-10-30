const express = require('express')
const router = express.Router()
const passport = require('passport')
const Profile = require('../../models/Profile')


//创建信息
router.post('/add', passport.authenticate('jwt', {
	session: false
}), (req, res) => {
	let writeone = new Profile({
		type: req.body.type,
		describe: req.body.describe,
		income: req.body.income,
		expend: req.body.expend,
		cash: req.body.cash,
		remark: req.body.remark
	})

	writeone.save().then(profile => {
		res.json(profile)
	})
})

//获得全部信息
router.get('/', passport.authenticate('jwt', {
	session: false
}), (req, res) => {
	Profile.find()
		.then(profile => {
			if (!profile) {
				return res.status(404).json("没有任何内容")
			}
			res.json(profile)
		})
		.catch(err => {
			res.status(404).json(err)
		})
})

//获取单个信息
router.get('/:id', passport.authenticate('jwt', {
	session: false
}), (req, res) => {
	Profile.findOne({
			_id: req.params.id
		})
		.then(profile => {
			if (!profile) {
				return res.status(404).json("没有任何内容")
			}
			res.json(profile)
		})
		.catch(err => {
			res.status(404).json(err)
		})
})

//编辑信息
router.post('/edit/:id', passport.authenticate('jwt', {
	session: false
}), (req, res) => {
	Profile.updateOne({
		_id: req.params.id
	}, {
		type: req.body.type,
		describe: req.body.describe,
		income: req.body.income,
		expend: req.body.expend,
		cash: req.body.cash,
		remark: req.body.remark
	}).then(profile => {
		res.json(profile)
	})
})


// 删除信息
router.delete('/delete/:id', passport.authenticate('jwt', {
	session: false
}), (req, res) => {
	Profile.deleteOne({
		_id: req.params.id
	}).then(result => {
		if (result) {
			res.json(result)
		}
	}).catch(err => res.status(404).json("删除失败"))
})

module.exports = router
