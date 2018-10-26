const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const Story = require('../models/story');
const router = express.Router();

const fetch = require('node-fetch');

const translate = require('moji-translate');

var WordPOS = require('wordpos'),
    wordpos = new WordPOS();
 
wordpos.getAdjectives('The angry bear chased the frightened little squirrel.', function(result){
    console.log(result);
});
// [ 'little', 'angry', 'frightened' ]
 
wordpos.isAdjective('awesome', function(result){
    console.log(result);
});
// true 'awesome'

console.log(translate.getAllEmojiForWord('👀'));
console.log(translate.translate("the house is on fire and the cat is eating the cake"));
//API Key= 5edd98ce34fbd27acab549e7451bbafcf13f243565ebf20828fdf4625b7e2962

/*https://apifootball.com/api/?action=get_countries&APIkey=xxxxxxxxxxxxxx*/

router.get('/search', async (req, res) => {
    let authors = await fetchPoetryAuthor("author")
    console.log(authors)
    res.render('search', {authors:authors.authors});

});

function fetchPoetryAuthor(author){

    return fetch(`http://poetrydb.org/${author}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
  console.log(JSON.stringify(myJson));
    return myJson
  });
}

router.post('/search', async (req,res)=>{
    console.log(req.body, "this is req.body", req.body.author)
    let stories = await fetchPoetryAuthor(`author/${req.body.author}`)
    console.log(stories)
    res.json({stories})
})


router.get('/', (req, res) => { //Home Page grab all users stories
    Story.find({}).then(stories => {
        //console.log(stories, "stories", req.user)
        for(let i = 0;i< stories.length; i++){
          //  console.log("5",stories[i].name)
        }
        res.render('index', { user : req.user, stories: stories, fruit: "bananananananaana" });
    })
});

router.get('/register', (req, res) => {
    res.render('register', { });
});
router.post('/createstory',isLoggedIn, (req, res) => {
    console.log("post it to createstory", req.body,req.user)
    let story = new Story(req.body)
    story.userId = req.user._id
    story.date = new Date()
    //story.name = translate.translate(story.name)
    wordpos.getAdjectives(req.body.name, function(result){
        console.log(result);
    });
    wordpos.getNouns(req.body.name, function(result){
        console.log(result);
    });
    wordpos.getVerbs(req.body.name, function(result){
        console.log(result);
    });
    //story.save()
    //fetchDadJoke()
    res.redirect('/profile')
    
})

router.get('/profile',isLoggedIn, (req, res) => { // Finds the stories submitted by a user and displays them.
    Story.find({userId: req.user._id}).then(stories => {
        //console.log('stories', stories)
        res.render('profile', { user : req.user, stories:stories });
        
    })

    
});

function doMadlib(body) {
    // we use destructuring to get the values for adjective1, adjective2, etc.
    // from the request params
    const {adjective1, adjective2, adjective3, adverb, name, noun, place} = body;
    // then we return a string that substitutes in these values
    return (
    `There's a ${adjective1} new ${name} in ${place} and everyone's ` +
    `talking. Stunningly ${adjective2} and ${adverb} ${adjective3}, all the cool kids know it. ` + 
    `However, ${name} has a secret - ${name}'s a vile vampire. \n` + 
    `Will it end with a bite, or with a stake through the ${noun}?`);
  }
 

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
    res.status(200).json({name:"pong"});
});

module.exports = router;

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

