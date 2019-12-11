new Vue({
    el: '#app',
    data: {
      words: [],
      touchedCards: [],
      turn: '',
    },
    beforeMount: function() {
        this.getWords();
        this.getCards();
        this.touchedCards = new Array(25).fill(false);
        // let url = "/getCards";
        // fetch(url).then(response => response.json()).then(data => {
        //     this.cards = data;
        // });
        this.turn = 'blue';
    },
    methods: {
        // CURRENTLY: clicking on Done guessing doesn't enter the changeTurn method,
        //             and trying to re-render tiles after clicking on them isn't working :(
        async getWords() {
            try {
                let response = await axios.get("/getCards");
                this.words = response.data;
            } catch (error) {
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
            } catch (error) {
              console.log(error);
            }
        },
        cardSelected: function( index ) {
            this.touchedCards[index] = true;
            console.log("Card " + this.words[ index ] + " was clicked");
            console.log(this.touchedCards);
        },
        isCardTouched: function( index ) {
            // if (this.touchedCards[index])
            //     return 'bg-red-400';
            // else
            //     return 'hidden';
            return this.touchedCards[index];
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
                return 'bg-blue-700'
            else
                return 'bg-red-700'
        },
    }, // End of computed
  })