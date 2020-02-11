new Vue({
    el: '#keyApp',
    data: {
      allCards: {},
      redCards: [],
      blueCards: [],
      bystanderCards: [],
      assassin: -1,
      turn: '',
      cardsAssigned: false,
    },
    beforeMount: function() {
      this.getCards()
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