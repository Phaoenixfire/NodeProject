const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const Story = require('../models/story');
const router = express.Router();

const fetch = require('node-fetch');

//API Key= 5edd98ce34fbd27acab549e7451bbafcf13f243565ebf20828fdf4625b7e2962

/*https://apifootball.com/api/?action=get_countries&APIkey=xxxxxxxxxxxxxx*/

router.get('/chat', (req, res) => {
    res.render('chat');

});

router.get('/', (req, res) => { //Home Page grab all users stories
    Story.find({}).then(stories => {
        res.render('index', { user : req.user, stories: stories });
    })
});

router.get('/register', (req, res) => {
    res.render('register', { });
});
router.post('/createstory', (req, res) => {
    console.log("post it to createstory", req.body,req.user)
    let story = new Story(req.body)
    story.userId = req.user._id
    story.date = new Date()
    story.save()
    //fetchDadJoke()
    res.redirect('/profile')
    
})

router.get('/profile',isLoggedIn, (req, res) => { // Finds the stories submitted by a user and displays them.
    Story.find({userId: req.user._id}).then(stories => {
        console.log('stories', stories)
        res.render('profile', { user : req.user, stories:stories });
    })

    
});

router.delete("/delete_Story",(req,res) =>{
    console.log("delete", req.body, req.user)
    Story.remove({_id:req.body.storyid}).then(response =>{

        res.json({deletedid:req.body.storyid})
    })
    
})


router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});



router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/profile');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/ping', (req, res) => {
    res.status(200).send("pong!");
});

module.exports = router;

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

function fetchDadJoke(){
    
    fetch('https://icanhazdadjoke.com/', {headers: {Accept: "application/json"}})
        .then(res => res.json())
        .then(json => {
            console.log(json)
            return json
        }
    );
}