
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
        winner: "",
        winner_printed: false,
        showNavBar: false,
        showToast: false,
    },
    beforeMount: function () {
    },
    mounted() {
        this.getGame();
        setInterval(() => {
            this.getGame()
        }, 1000);
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
                this.winner = response.data.winner
                if (this.winner !== "" && !this.winner_printed) {
                    alert(this.winner)
                    this.winner_printed = true
                }
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
                case "bgLight":
                    if (this.team === 'blue')
                        return "bg-blue-700"
                    else
                        return "bg-red-700"
                default:
                    if (this.team === 'blue')
                        return 'bg-blue-800'
                    else
                        return 'bg-red-800'
            }
        },
    }, // End of methods

    watch: {
        turn: function() {
            this.showToast = true
            setTimeout(() => {
                this.showToast = false;
            }, 2000);
        }
    }, // End of watchers

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
        getNavBarColor: function() {
            if (this.team === 'blue') 
                return "border-top: 4rem solid; border-right: 4rem solid transparent;"
        },
        showNavBarVisibility: function() {
            if (this.showNavBar) 
                return 'left: 0;'
            else 
                return 'left: -40vw;'
        },
        toastStyling: function() {
            // If the turn changes, then do a setTimeout for a couple seconds
            if (this.showToast) {
                return 'bottom: 2rem;'
            }
            else {
                return 'bottom: -3rem;'
            }
        }
        
    }, // End of computed
});
