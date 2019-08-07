var express = require('express');
var mongodb = require('../models/index');
var ObjectId = require('mongodb').ObjectID;
var router = express.Router();
var axios= require('axios')

router.get('/', function (req, res, next) {
    res.send()
})

// 登录
router.get('/oauth/redirect', function (req, res, next) {
    axios.get('https://github.com/login/oauth/access_token', {
        params: {
            client_id: '376770a70a24778e582c',
            client_secret: '504dfeae16e553d6f3a200121a7747ad1d854dfc',
            code: req.query.code
        },
    }).then(token => {
        axios.get(`https://api.github.com/user?access_token=${token.data.split('=')[1].split('&')[0]}`)
            .then(user => {
                res.cookie('name', user.data.login, { maxAge: 2592000 })
                res.redirect('/')
        })
    }).catch(err => {
        res.send(err)
    })
})
// 注销
router.post('/v1/logout', function (req, res, next) {
    res.clearCookie('name')
    res.send({
        state: 1,
        errMsg: '用户注销'
    })
})
// 增加 todolist
router.post('/v1/createList', function (req, res, next) {
    if (!req.cookies.name) {
        res.send({
            state: 1,
            errMsg: '用户未登录'
        })
    } else {
        var newList = req.body.newList
        mongodb.then(todolists => {
            todolists.collection('lists').insertOne({ ...newList, "name": req.cookies.name }, function (error, result) {
                if (error) throw error
                res.send()
            })
        }).catch(err => {
            res.send({
                state: 2,
                errMsg: '数据库连接失败'
            })
        })
    }
})

// 删除 todolist
router.delete('/v1/removeList', function (req, res, next) {
    if (!req.cookies.name) {
        res.send({
            state: 1,
            errMsg: '用户未登录'
        })
    } else {
        var whereStr = { "_id": new ObjectId(req.body.id), "name": req.cookies.name }
        mongodb.then(todolists => {
            todolists.collection("lists").deleteOne(whereStr, function (errer, result) {
                if (errer) throw errer
                res.send()
            })
        }).catch(err => {
            res.send({
                state: 2,
                errMsg: '数据库连接失败'
            })
        })        
    }
})
router.delete('/v1/removeAll', function (req, res, next) {
    if (!req.cookies.name) {
        res.send({
            state: 1,
            errMsg: '用户未登录'
        })
    } else {
        var whereStr = { "isComplete": true, "name": req.cookies.name }
        mongodb.then(todolists => {
            todolists.collection("lists").deleteMany(whereStr, function (errer, result) {
                if (errer) throw errer
                res.send()
            })
        }).catch(err => {
            res.send({
                state: 2,
                errMsg: '数据库连接失败'
            })
        })
    }
})
// 更改 todolists
router.put('/v1/updateList', function (req, res, next) {
    if (!req.cookies.name) {
        res.send({
            state: 1,
            errMsg: '用户未登录'
        })
    } else {
        var whereStr = { "_id": new ObjectId(req.body.id), "name": req.cookies.name }
        var updateStr = { $set: { "list": req.body.list, "name": req.cookies.name } };
        mongodb.then(todolists => {
            todolists.collection("lists").updateOne(whereStr, updateStr, function (errer, result) {
                if (errer) throw errer
                res.send()
            })
        }).catch(err => {
            res.send({
                state: 2,
                errMsg: '数据库连接失败'
            })
        })    
    }
})
router.put('/v1/updateComplete', function (req, res, next) {
    if (!req.cookies.name) {
        res.send({
            state: 1,
            errMsg: '用户未登录'
        })
    } else {
        var whereStr = { "_id": new ObjectId(req.body.id), "name": req.cookies.name }
        var updateStr = { $set: { "isComplete": req.body.isComplete, "name": req.cookies.name } };
        mongodb.then(todolists => {
            todolists.collection("lists").updateMany(whereStr, updateStr, function (errer, result) {
                if (errer) throw errer
                res.send()
            })
        }).catch(err => {
            res.send({
                state: 2,
                errMsg: '数据库连接失败'
            })
        })
    }
})
router.put('/v1/allComplete', function (req, res, next) {
    if (!req.cookies.name) {
        res.send({
            state: 1,
            errMsg: '用户未登录'
        })
    } else {
        var whereStr = { "isComplete": false, "name": req.cookies.name }
        var updateStr = { $set: { "isComplete": true, "name": req.cookies.name } };
        mongodb.then(todolists => {
            todolists.collection("lists").updateOne(whereStr, updateStr, function (errer, result) {
                if (errer) throw errer
                res.send()
            })
        }).catch(err => {
            res.send({
                state: 2,
                errMsg: '数据库连接失败'
            })
        })
    }
})
// 查询 todolists
router.get('/v1/readList', function (req, res, next) {
    if (!req.cookies.name) {
        res.send({
            state: 1,
            errMsg: '用户未登录'
        })
    } else {
        let queryStr
        switch (req.query.type) {
            case 'active':
                queryStr = { "isComplete": false, "name": req.cookies.name }
                break
            case 'completed':
                queryStr = { "isComplete": true, "name": req.cookies.name }
                break
            default:
                queryStr = { "name": req.cookies.name}
                break
        }
        mongodb.then(todolists => {
            todolists.collection('lists').find(queryStr).toArray(function (error, result) {
                if (error) {
                    throw error
                }
                res.send({
                    state: 0,
                    data: result,
                    msg: 'success'
                })
            });
        }).catch(err => {
            res.send({
                state: 2,
                errMsg: '数据库连接失败'
            })
        })
    }
})

module.exports = router;
