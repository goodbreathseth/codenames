new Vue({
    el: '#app',
    data: {
        words: [],
        touchedCards: [],
        allCards: [],
        turn: '',
        index: 0,
        redCardsLeft: 9,
        blueCardsLeft: 8,
    },
    beforeMount: function() {
        this.getWords();
        this.getCards();
        this.touchedCards = new Array(25).fill(false);
        this.turn = 'blue';
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
                console.log("got cards:");
                console.log(this.allCards);
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
            console.log("entered currentTurnColor")
            if (this.turn == "blue")
                return 'bg-blue-800'
            else
                return 'bg-red-800'
        },
    }, // End of computed
})
