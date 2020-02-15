let indexApp = new Vue({
    el: '#indexApp',
    data: {
        team: null,
    },
    watch: {
        team: function () {
            gameBoardApp.team = this.team;
            spymasterApp.team = this.team
        }
    }
})

let currentTurn = null;

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
    created: function () {
        this.getGame();
        this.turn = 'blue';
    },
    methods: {
        async getGame() {
            try {
                let response = await axios.get("/api/getGame")
                this.words = response.data.words;
                this.allCards = response.data.allCards;
                this.touchedCards = response.data.touchedCards;
            } catch (error) {
                console.log(error);
            }
        },
        async cardSelected(index) {
            if (this.touchedCards[index] == false) {
                try {
                    let response = await axios.post("/api/cardSelected", {
                        index
                    });

                    Vue.set(this.touchedCards, index, true)
                    for (let i = 0; i < this.allCards.redCards.length; i++) {
                        if (this.allCards.redCards[i] == index) {
                            this.redCardsLeft--;
                        }
                    }
                    for (let i = 0; i < this.allCards.blueCards.length; i++) {
                        if (this.allCards.blueCards[i] == index) {
                            this.blueCardsLeft--;
                        }
                    }
                    
                } catch (error) {
                    console.log(error)
                }
            }
        },
        isCardTouched: function (index) {
            return this.touchedCards[index];
        },
        getCardColor: function (index) {
            if (this.touchedCards[index]) {
                if (index == this.allCards.assassin) {
                    setTimeout(() => window.confirm("Game over!"), 300);

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
        changeTurn: function () {
            console.log("changed turn")
            if (this.turn == "blue") {
                this.turn = "red";
            }
            else {
                this.turn = "blue";
            }
        },
        getColor: function () {
            if (this.turn == "blue") {
                return "bg-blue-700";
            }
            else {
                return "bg-red-700";
            }
        },
    }, // End of methods
    computed: {
        currentTurnColor: function () {
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
        words: [],
        allCards: {},
        touchedCards: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        redCards: [],
        blueCards: [],
        bystanderCards: [],
        assassin: -1,
        turn: '',
        cardsAssigned: false,
        team: null,
    },
    beforeMount: function () {
        this.getGame()
    },
    watch: {
        touchedCards: function() {
            console.log("touchedCards changed")
        }
    },
    methods: {
        async getGame() {
            try {
                let response = await axios.get("/api/getGame")
                this.words = response.data.words;
                this.allCards = response.data.allCards;
                this.touchedCards = response.data.touchedCards;
            } catch (error) {
                console.log(error);
            }
        },
        async getNewGame() {
            try {
                let response = await axios.get("/api/getNewGame")
                console.log("before getNewGame: \n" + this.allCards + "\n" + this.touchedCards)
                this.allCards = response.data.allCards;
                this.touchedCards = response.data.touchedCards;
                console.log("after getNewGame: \n" + this.allCards + "\n" + this.touchedCards)

                window.alert("New game started");
                return true;

            } catch (error) {
                console.log(error);
            }
        },
        getCardColor: function (index) {
            // If the card has been flipped over on the player side, make it lighter on the spymaster side
            if (index == this.allCards.assassin) {
                if (this.touchedCards[index]) {
                    return 'bg-black'
                }
                else {
                    return 'bg-gray-700'
                }
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
                    return 'bg-orange-300'
                }
            }
        },
    }, // End of methods

});