var jwt = require('jwt-simple');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var _ = require('lodash');
var moment = require('moment');
var app = express();
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({extended: false})
app.use(cors())
app.use(jsonParser);
app.set('jwtTokenSecret', 'YOUR_SECRET_STRING');
app.get('/', function (req, res) {
    res.send('厉害了')
});
app.post('/login', function (req, res) {
    if (_.find(users, {username: req.body.username, password: req.body.password})) {
        var token = jwt.encode({
            username: req.body.username,
            exp: moment().add(125, 's').format('X')
        }, app.get('jwtTokenSecret'));
        tokens[req.body.username] = token;
        res.json({
            success: true,
            token: token
        })
        return
    }

    res.json({
        success: false
    })
});

app.get('/loginOut', verifyToken, function (req, res) {
    var jToken = jwt.decode(_.get(req, 'headers.authorization'), app.get('jwtTokenSecret'));
    delete tokens[jToken.username];
    res.json({
        success: true
    })
});


app.get('/userinfo', verifyToken, function (req, res) {
    var jToken = jwt.decode(_.get(req, 'headers.authorization'), app.get('jwtTokenSecret'));
    res.json({
        username: jToken.username
    })

});
app.listen(3000);

var users = [
    {username: 's', password: '1'}
];
var tokens = {}

function verifyToken(req, res, next) {
    var token = _.get(req, 'headers.authorization');
    if (_.isEmpty(token)) {
        res.send('需要TOKEN', 401);
    }
    try {
        var jToken = jwt.decode(token, app.get('jwtTokenSecret'));
        if (tokens[jToken.username] !== token) {
            res.send('TOKEN失效', 401)
        } else {
            next()
        }

    } catch (e) {
        res.send(e.message, 401)
    }
}