var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const userModel = require('../models/users');
const travelModel = require('../models/travels');




/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* POST signup page. */
router.post('/signup', function(req, res, next) {
    userModel.findOne({ email: req.body.email }, function(err, user) {
        if (user) {
            console.log("deja en base");
            res.render('index');

        } else {
            var newUser = new userModel({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password
            })
            newUser.save();
            req.session.user = newUser;
            req.session.currentTravelList = [];
            console.log(req.session.user);
            res.redirect('/search-page');
        }
    })
});

/* GET login page. */
router.post('/login', function(req, res, next) {
    userModel.findOne({ email: req.body.email, password: req.body.password }, function(err, user) {
        if (user) {
            req.session.user = user;
            req.session.currentTravelList = [];
            res.redirect('/search-page');
        } else {
            console.log("mauvais mdp");
            res.render('index', { title: 'Express' });
        }
    });
});

/* GET search page. */
router.get('/search-page', function(req, res, next) {
    res.render('search', { title: 'Express' });
});

/* POST search . */
router.post('/searching', async function(req, res, next) {
    console.log("date recup " + req.body.date);
    // console.log("date recherchée " + tempDate);

    var travelBDD = await travelModel.find({
        departure: req.body.fromCity,
        arrival: req.body.toCity,
        date: {
            $gte: req.body.date
        }
    });
    console.log(travelBDD);
    if (travelBDD) {
        var url = `?departure=${req.body.fromCity}&arrival=${req.body.toCity}&date=${req.body.date}`;
        res.redirect('/list' + url);

    } else {
        console.log("pas de train à ces conditions");
        res.render(`search`, { title: 'Express' });
    }
});
/* GET list results*/
router.get('/list', async function(req, res, next) {
    var tempTravel = {
        departure: req.query.departure,
        arrival: req.query.arrival,
        date: req.query.date
    };
    var travelList = await travelModel.find({
        departure: tempTravel.departure,
        arrival: tempTravel.arrival,
        date: { $gte: tempTravel.date },
    }).sort({ date: 1 });
    console.log("tioto", travelList);
    res.render('list', { travelList });
});

/* POST select travel*/
router.post('/select-travel', async function(req, res, next) {
    var travel = await travelModel.findOne({ _id: req.body.id });
    req.session.currentTravelList.push({
        _id: travel._id,
        departure: travel.departure,
        arrival: travel.arrival,
        date: `${travel.date.getDate()}-${travel.date.getMonth()+1}-${travel.date.getFullYear()}`,
        departureTime: travel.departureTime,
        price: travel.price
    });
    console.log(req.session.currentTravelList);
    res.render('my-travels', { travelList: req.session.currentTravelList });
});



module.exports = router;