let indexApp = new Vue({
    el: '#indexApp',
    data: {
        team: null,
    },
    watch: {
        team: function() {
            gameBoardApp.team = this.team;
            spymasterApp.team = this.team
        }
    }
})


let gameBoardApp = new Vue({
    el: '#gameBoardApp',
    data: {
        words: [],
        touchedCards: [],
        allCards: [],
        turn: '',
        index: 0,
        redCardsLeft: 9,
        blueCardsLeft: 8,
        team: null,
    },
    beforeMount: function() {
        this.getWords();
        this.getCards();
        this.touchedCards = new Array(25).fill(false);
        this.turn = 'blue';
    },
    watch: {
        team: function() {
            console.log("team changed in gameboardapp")
        }
    },
    methods: {
        async getWords() {
            try {
                let response = await axios.get("/getCards");
                this.words = response.data;
            }
            catch (error) {
                console.log(error);
            }
        },
        async getCards() {
            try {
                let response = await axios.get("/api/getCards");
                this.allCards = response.data;
                return true;
            }
            catch (error) {
                console.log(error);
            }
        },
        cardSelected: function(index) {
            if (this.touchedCards[index] == false) {

                Vue.set(this.touchedCards, index, true)
                let variableChanged = false;
                let tempRedCards = 9;
                for (let i = 0; i < this.allCards.redCards.length; i++) {
                    if (this.allCards.redCards[i] == index) {
                        this.redCardsLeft--;
                    }
                }

                variableChanged = false;
                let tempBlueCards = 8;
                for (let i = 0; i < this.allCards.blueCards.length; i++) {
                    if (this.allCards.blueCards[i] == index) {
                        this.blueCardsLeft--;
                    }
                }
            }


            // console.log("Card " + this.words[index] + " was clicked");
        },
        isCardTouched: function(index) {
            return this.touchedCards[index];
        },
        getCardColor: function(index) {
            if (this.touchedCards[index]) {
                if (index == this.allCards.assassin) {
                    setTimeout(() => window.confirm("Game over!"), 3000);

                    return 'bg-black'
                }

                for (let i = 0; i < this.allCards.redCards.length; i++) {
                    if (this.allCards.redCards[i] == index) {
                        return 'bg-red-700'
                    }
                }

                for (let i = 0; i < this.allCards.blueCards.length; i++) {
                    if (this.allCards.blueCards[i] == index) {
                        return 'bg-blue-700'
                    }
                }

                for (let i = 0; i < this.allCards.bystanderCards.length; i++) {
                    if (this.allCards.bystanderCards[i] == index) {
                        // return 'bg-gray-500'
                        return 'bg-orange-300'
                    }
                }
            }
            else {
                return 'bg-orange-200'
            }
        },
        changeTurn: function() {
            console.log("changed turn")
            if (this.turn == "blue") {
                this.turn = "red";
            }
            else {
                this.turn = "blue";
            }
        },
        getColor: function() {
            if (this.turn == "blue") {
                return "bg-blue-700";
            }
            else {
                return "bg-red-700";
            }
        },
    }, // End of methods
    computed: {
        currentTurnColor: function() {
            if (this.turn == "blue")
                return 'bg-blue-800'
            else
                return 'bg-red-800'
        },
    }, // End of computed
})

let spymasterApp = new Vue({
    el: '#spymasterApp',
    data: {
      allCards: {},
      redCards: [],
      blueCards: [],
      bystanderCards: [],
      assassin: -1,
      turn: '',
      cardsAssigned: false,
      team: null,
    },
    beforeMount: function() {
      this.getCards()
    },
    watch: {
        team: function() {
            console.log("team changed in spymasterApp")
        }
    },
    methods: {
      async getCards() {
        try {
          let response = await axios.get("/api/getCards");
          this.allCards = response.data;
          return true;
        } catch (error) {
          console.log(error);
        }
      },
      async getNewKeyCard() {
        try {
          let response = await axios.get("/api/getNewKeyCard");
          this.allCards = response.data;
          return true;
          
        } catch (error) {
          console.log(error);
        }
      },
      
      async getRandomCardsFromDeck() {
        try {
          let response = await axios.put("api/pullRandomCardsFromDeck");
          window.alert("Cards refreshed");
          return true;
          
        } catch (error) {
          console.log(error);
        }
      },
      getCardColor: function(index) {
        
        if (index == this.allCards.assassin) {
          return 'bg-black'
        }
        
        for (let i = 0; i < this.allCards.redCards.length; i++) {
          if (this.allCards.redCards[i] == index) {
            return 'bg-red-700'
          }
        }
        
        for (let i = 0; i < this.allCards.blueCards.length; i++) {
          if (this.allCards.blueCards[i] == index) {
            return 'bg-blue-700'
          }
        }
        
        for (let i = 0; i < this.allCards.bystanderCards.length; i++) {
          if (this.allCards.bystanderCards[i] == index) {
            return 'bg-orange-200'
          }
        }
      }, // End of getCardColor function
    }, // End of methods
    
});