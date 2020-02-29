let indexApp = new Vue({
    el: '#indexApp',
    data: {
        team: "",
    },
    mounted() {
        if (localStorage.team) {
            this.team = localStorage.team;
        }
    },
    watch: {
        team(newTeam) {
            localStorage.team = newTeam;
        }
    }
});

let gameBoardApp = new Vue({
    el: '#gameBoardApp',
    data: {
        words: [],
        touchedCards: [],
        allCards: [],
        turn: "",
        team: "",
        index: 0,
        redCardsLeft: 9,
        blueCardsLeft: 8,
        hint: "",
        hintNum: "",
    },
    beforeMount: function () {
        this.getGame();
        setInterval(() => {
            this.getGame()
        }, 1000);
    },
    mounted() {
        if (localStorage.team) {
            this.team = localStorage.team;
        }
    },
    methods: {
        async getGame() {
            try {
                let response = await axios.get("/api/getGame");
                this.words = response.data.words;
                this.allCards = response.data.allCards;
                this.touchedCards = response.data.touchedCards;
                this.redCardsLeft = response.data.redCardsLeft;
                this.blueCardsLeft = response.data.blueCardsLeft;
                this.turn = response.data.turn;
                this.hint = response.data.hint;
                this.hintNum = response.data.hintNum;
            } catch (error) {
                console.log(error);
            }
        },
        async cardSelected(index) {
            if (this.turn != this.team) {
                alert("It is not your turn!")
            }
            else if (this.touchedCards[index] == false) {
                try {
                    await axios.post("/api/cardSelected", {
                        index
                    });

                    Vue.set(this.touchedCards, index, true)
                } catch (error) {
                    console.log(error)
                }
            }
        },
        async changeTurn() {
            let turn = this.turn;
            try {
                await axios.post("/api/changeTurn", {
                    turn
                })
            } catch (error) {
                console.log(error)
            }
        },
        isCardTouched: function (index) {
            return this.touchedCards[index];
        },
        getCardColor: function (index) {
            if (this.touchedCards[index]) {
                if (index == this.allCards.assassin) {
                    return 'bg-black'
                }
                else if (this.allCards.redCards.includes(index)) {
                    return 'bg-red-700';
                }
                else if (this.allCards.blueCards.includes(index)) {
                    return 'bg-blue-700';
                }
                else if (this.allCards.bystanderCards.includes(index)) {
                    return 'bg-orange-300';
                }

            }
            else {
                return 'bg-orange-200'
            }
        },
        teamColor: function (typeOfColoring) {
            switch (typeOfColoring) {
                case "text":
                    if (this.team === 'blue')
                        return 'text-blue-800'
                    else
                        return 'text-red-800'
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
                return 'border-blue-800 text-blue-800'
            else
                return 'border-red-800 text-red-800'
        },
    }, // End of computed
});

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
        team: '',
        cardsAssigned: false,
        team: null,
        redCardsLeft: 9,
        blueCardsLeft: 8,
        hint: '',
        hintNum: '',
    },
    beforeMount: function () {
        this.getGame()
        setInterval(() => {
            this.getGame()
        }, 2000);
    },
    mounted() {
        if (localStorage.team) {
            this.team = localStorage.team;
        }
    },
    methods: {
        async getGame() {
            try {
                let response = await axios.get("/api/getGame")
                this.words = response.data.words;
                this.allCards = response.data.allCards;
                this.touchedCards = response.data.touchedCards;
                this.redCardsLeft = response.data.redCardsLeft;
                this.blueCardsLeft = response.data.blueCardsLeft;
                if (this.turn != response.data.turn) {
                    this.turn = response.data.turn;
                    this.hint = "";
                    this.hintNum = "";
                }
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
        async setHint() {
            let view = this;
            if (this.turn === this.team) {
                try {
                    await axios.post("/api/setHint", {
                        hint: view.hint,
                        hintNum: this.hintNum
                    })
                    alert("Hint sent!")
                } catch (error) {
                    console.log(error)
                }
            } else {
                alert("Not your turn")
            }
        },
        isCardTouched: function (index) {
            return this.touchedCards[index];
        },
        getCardColor: function (index) {
            // If the card has been flipped over on the player side, make it lighter on the spymaster side
            if (index == this.allCards.assassin) {
                if (this.touchedCards[index]) {
                    return 'bg-gray-900'
                }
                else {
                    return 'bg-gray-900'
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
        teamColor: function (typeOfColoring) {
            switch (typeOfColoring) {
                case "text":
                    if (this.team === 'blue')
                        return 'text-blue-700'
                    else
                        return 'text-red-700'
                case "border":
                    if (this.team === "blue")
                        return "border-blue-700"
                    else
                        return "text-red-700"
                case "bg":
                    if (this.team === "blue")
                        return "bg-blue-700"
                    else
                        return "bg-blue-700"
                default:
                    if (this.team === 'blue')
                        return 'bg-blue-700'
                    else
                        return 'bg-red-700'
            }
        },
    }, // End of methods
    computed: {
        currentTurnColor: function () {
            if (this.turn == "blue")
                return 'bg-blue-700'
            else
                return 'bg-red-700'
        },
        currentTurnBorderAndTextColor: function () {
            if (this.turn == "blue")
                return 'border-blue-700 text-blue-700'
            else
                return 'border-red-700 text-red-700'
        },
    }, // End of computed

});
