var express = require('express');
var router = express.Router();

let words = [ 
    "apple", "carrot", "bread", "egg", "car", "bus", "hot dog", "pickle", "card",
    "sun", "moon", "cheese", "computer", "shoes", "guitar", "shirt", "toe", "chair", "blanket", "hand", "leaf", "wheel", "pencil", "paper", "stand"
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/getCards", (req, res) => {
    res.send(words);
});

router.get("/key", (req, res) => {
    res.sendFile('key.html', { root: '/var/www/html/codenames/public' });
});

// Get the cards to display on the front end
router.get('/api/getCards', async (req, res) => {
  try {
    let items = {
        all: allCards,
        redCards: redCards,
        blueCards: blueCards,
        bystanderCards: bystanderCards,
        assassin: assassin
    };
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Change the order of the cards and return the cards to the front end
router.get("/api/getNewKeyCard", async (req, res) => {
    try {
        refreshCards();
        let items = {
            all: allCards,
            redCards: redCards,
            blueCards: blueCards,
            bystanderCards: bystanderCards,
            assassin: assassin
        };
        res.send(items);
        
   } catch (error) {
       console.log(error);
       res.sendStatus(500);
   }
    
});


let allCards = [], redCards = [], blueCards = [], bystanderCards = [];
let assassin = -1;
refreshCards();

function refreshCards() {
    allCards = Array.from(Array(25).keys());
    redCards = [];
    blueCards = [];
    bystanderCards = [];
    assassin = -1;
    
    let i, item, index;
    let size = allCards.length;
    
    // Instantiate array of redCards with 9
    for (i = 0; i < 9; i++) {
      item = allCards[Math.floor(Math.random()*allCards.length)];
      index = allCards.indexOf(item);
      allCards.splice(index, 1);
      redCards.push(item);
    }
    
    // Instantiate array of blueCards with 8
    for (i = 0; i < 8; i++) {
      item = allCards[Math.floor(Math.random()*allCards.length)];
      index = allCards.indexOf(item);
      allCards.splice(index, 1);
      blueCards.push(item);
    }
    
    // Choose assassin card
    item = allCards[Math.floor(Math.random()*allCards.length)];
    index = allCards.indexOf(item);
    allCards.splice(index, 1);
    assassin = item;
    
    // Assign the remaining cards to be bystander cards
    bystanderCards = allCards.slice();
    
    // Refill allCards
    allCards = Array.from(Array(25).keys());
}



module.exports = router;
