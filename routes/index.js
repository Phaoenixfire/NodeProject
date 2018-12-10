const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const Story = require('../models/story');
const router = express.Router();

const fetch = require('node-fetch');

const translate = require('moji-translate');

var WordPOS = require('wordpos'),
    wordpos = new WordPOS();

wordpos.getAdjectives('The angry bear chased the frightened little squirrel.', function (result) {
    console.log(result);
});
// [ 'little', 'angry', 'frightened' ]

wordpos.isAdjective('awesome', function (result) {
    console.log(result);
});
// true 'awesome'

console.log(translate.getAllEmojiForWord('👀'));
console.log(translate.translate("the house is on fire and the cat is eating the cake"));
//API Key= 5edd98ce34fbd27acab549e7451bbafcf13f243565ebf20828fdf4625b7e2962

/*https://apifootball.com/api/?action=get_countries&APIkey=xxxxxxxxxxxxxx*/

router.get('/search', isLoggedIn, async (req, res) => {
    let authors = await fetchPoetryAuthor("author")
    //console.log(authors)
    res.render('search', { authors: authors.authors });

});

router.post('/search', async (req, res) => {
    //console.log(req.body, "this is req.body", req.body.author)
    let stories = await fetchPoetryAuthor(`author/${req.body.author}`)
    //console.log(stories)
    res.json({ stories })

})

function fetchPoetryAuthor(author) {

    return fetch(`http://poetrydb.org/${author}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            //console.log(JSON.stringify(myJson));
            return myJson
        });
}


router.get('/', (req, res) => { //Home Page grab all users stories
    Story.find({}).then(stories => {
        //console.log(stories, "stories", req.user)
        for (let i = 0; i < stories.length; i++) {
            //  console.log("5",stories[i].name)
        }
        res.render('index', { user: req.user, stories: stories, fruit: "bananananananaana" });
    })
});

router.post('/register', (req, res, next) => {
    Account.register(new Account({ username: req.body.username }), req.body.password, (err, account) => {
        if (err) {
            return res.render('register', { error: err.message });
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

router.get('/register', (req, res) => {
    res.render('register', {});
});
router.post('/saveStory', isLoggedIn, (req, res) => {
    console.log("post it to saveStory", req.body, req.user)

    let body = JSON.parse(req.body.story)
    console.log("post it to ", body)

    let story = new Story(body)
    story.userId = req.user._id
    story.date = new Date()
    //story.name = translate.translate(story.name)
    var test = body.lines.join(' ')
    console.log(test)
    var promise1 = wordpos.getAdjectives(body.lines.join(' '), function (result) {
        console.log(promise1)
        return result
    });
    var promise2 = wordpos.getNouns(body.lines.join(' '), function (result) {
        return result
    });
    var promise3 = wordpos.getVerbs(body.lines.join(' '), function (result) {
        return result
    });

    Promise.all([promise1, promise2, promise3]).then(function (values) {
        console.log('promssesssee', values);
        story.adjectives = values[0]
        story.nouns = values[1]
        story.verbs = values[2]
        story.formattedLines = body.lines.join("<br>")
        story.save(function (err) {
            if (err) {
                console.log(err)
                throw err
            }
            res.json({ 'success': true })
            //res.redirect('/profile');
        })

    })
    //fetchDadJoke()
    //res.redirect('/profile')



})

function createMadLib(storyId) {
    //Taking a swing at doing anything.



}

router.get('/profile', isLoggedIn, (req, res) => { // Finds the stories submitted by a user and displays them.
    Story.find({ userId: req.user._id }).then(stories => {
        console.log('stories', stories)
        let num = 3;
        let html = `<div class="Test">GIGGITY</div>`
        //let copy = [...stories.lines]
        stories.forEach(function (story) {
            //story.html = []
            //let lines = story.formattedLines.split(" ")
            //console.log(lines)
            //lines.forEach(function (line, j) {

            //let words = line.split(" ")
            //let tagFreePoem = story.formattedLines.replace(/<br>/g, " ");
            let words = story.formattedLines.split(" ")
            let difwords = []
            // words = words.replace(/<br>/g, " ");
            words.forEach(function (word) {
                //word = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
                let adjectives = story.adjectives;
                let nouns = story.nouns;
                let verbs = story.verbs;
                let w = word;
                let testValue = createTestValue(word);
                console.log(word + "versus" + testValue)
                for (let i = 0; i < verbs.length; i++) {
                    // console.log("found it", word, adjectives[i])
                    if (verbs[i] === testValue) {

                        w = `<span class="verbs changePartOfSpeech">${word}</span>`
                    }
                }
                for (let i = 0; i < nouns.length; i++) {
                    // console.log("found it", word, adjectives[i])
                    //console.log(nouns[i] + " verses " + word)
                    
                    if (nouns[i] === testValue) {

                        w = `<span class="nouns changePartOfSpeech">${word}</span>`

                    }
                }
                for (let i = 0; i < adjectives.length; i++) {
                    //console.log("found it", word, adjectives[i])
                    if (adjectives[i] === testValue) {

                        w = `<span class="adjectives changePartOfSpeech">${word}</span>`

                    }
                }
                
                difwords.push(w)
            })
            story.formattedLines = difwords.join(" ")
            //story.html.push(line)
            // })
        })


        res.render('profile', { user: req.user, stories: stories });
    });
})

function createTestValue(word) {

    let testWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    testWord = testWord.replace(/<[^>]*>/g, "")
    return testWord;

}
/*Hey Andrew, look here for some things you tried -->

router.post('/profile', isLoggedIn, (req, res) => {
    $('Test').submit(async (e) => {
        e.preventDefault();
        
    })
});*/
function doMadlib(body) {
    // we use destructuring to get the values for adjective1, adjective2, etc.
    // from the request params
    const { adjective1, adjective2, adjective3, adverb, name, noun, place } = body;
    // then we return a string that substitutes in these values
    return (
        `There's a ${adjective1} new ${name} in ${place} and everyone's ` +
        `talking. Stunningly ${adjective2} and ${adverb} ${adjective3}, all the cool kids know it. ` +
        `However, ${name} has a secret - ${name}'s a vile vampire. \n` +
        `Will it end with a bite, or with a stake through the ${noun}?`);
}

router.delete("/delete_Story", (req, res) => {
    //console.log("delete", req.body, req.user)
    Story.remove({ _id: req.body.storyid }).then(response => {
        res.json({ deletedid: req.body.storyid })
    })

})

// Attempt 2018
router.put("/save_Story", (req, res) => {
    console.log("save", req.body, req.user, req.body.nouns, JSON.parse(req.body.nouns))
    Story.findOne({ _id: req.body.storyid }).then(response => {
        console.log(response)
        response.adjectives = JSON.parse(req.body.adjectives)
        response.nouns = JSON.parse(req.body.nouns)
        response.verbs = JSON.parse(req.body.verbs)
        response.formattedLines = req.body.formattedLines
        response.save(function (err) {
            if (err) {
                console.log(err)
                throw err
            }
            res.json({ 'success': true })
            //res.redirect('/profile');
        })
    })
})


router.get('/login', (req, res) => {
    res.render('login', { user: req.user, error: req.flash('error') });
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
    res.status(200).json({ name: "pong" });
});



// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}





module.exports = router;


