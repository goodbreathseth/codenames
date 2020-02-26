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
    beforeMount: function () {
        this.getGame();
        setInterval(() => {
            this.getGame()
        }, 2000);

        //TODO: sync the turn in the server
        this.turn = 'blue';
        if (!this.team) {
            this.team = "red"
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
        // TODO: SYNC WITH THE SERVER WHEN TURNS CHANGE
        changeTurn: function () {
            console.log("changed turn")
            if (this.turn == "blue") {
                this.turn = "red";
            }
            else {
                this.turn = "blue";
            }
        },
        teamColor: function(typeOfColoring) {
            switch (typeOfColoring) {
                case "text":
                    if (this.team === 'blue')
                        return 'text-blue-700'
                    else
                        return 'text-red-700'
                case "border":
                    if (this.team === "blue")
                        return "border-blue-800"
                    else
                        return "text-red-800"
                case "bg":
                    if (this.team === "blue")
                        return "bg-blue-800"
                    else
                        return "bg-blue-800"
                default:
                    if (this.team === 'blue')
                        return 'bg-blue-800'
                    else
                        return 'bg-red-800'
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
        currentTurnBorderAndTextColor: function () {
            if (this.turn == "blue")
                return 'border-blue-600 text-blue-600'
            else
                return 'border-red-600 text-red-600'
        },
    }, // End of computed
})

let spymasterApp = new Vue({
    el: '#spymasterApp',
    data: {
        words: [],
        allCards: {},
        touchedCards: [],
        redCards: [],
        blueCards: [],
        bystanderCards: [],
        assassin: -1,
        turn: '',
        cardsAssigned: false,
        team: null,
        redCardsLeft: 9,
        blueCardsLeft: 8,
    },
    beforeMount: function () {
        this.getGame()
        setInterval(() => {
            this.getGame()
        }, 2000);
        //TODO: sync the turn in the server
        this.turn = 'blue';
        if (!this.team) {
            this.team = "red"
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
                this.words = response.data.words;
                this.allCards = response.data.allCards;
                this.touchedCards = response.data.touchedCards;
            } catch (error) {
                console.log(error);
            }
        },
        isCardTouched: function (index) {
            return this.touchedCards[index];
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
        teamColor: function(typeOfColoring) {
            switch (typeOfColoring) {
                case "text":
                    if (this.team === 'blue')
                        return 'text-blue-700'
                    else
                        return 'text-red-700'
                case "border":
                    if (this.team === "blue")
                        return "border-blue-800"
                    else
                        return "text-red-800"
                case "bg":
                    if (this.team === "blue")
                        return "bg-blue-800"
                    else
                        return "bg-blue-800"
                default:
                    if (this.team === 'blue')
                        return 'bg-blue-800'
                    else
                        return 'bg-red-800'
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
        currentTurnBorderAndTextColor: function () {
            if (this.turn == "blue")
                return 'border-blue-600 text-blue-600'
            else
                return 'border-red-600 text-red-600'
        },
    }, // End of computed

});