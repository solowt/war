var war = {
  makeDeck: function(numRanks) {
    var newDeck = [];
    var suits = ["Clubs", "Hearts", "Diamonds", "Spades"];
    for (var i=0; i<suits.length; i++){
      for (var j=0; j<numRanks;j++){
        var cardName = j+'-'+suits[i];
        newDeck.push(cardName);
      }
    }
    return newDeck;
  },
  shuffleDeck: function(deck) {
    var i, j, k;
    var temp;
    for (j = 0; j < deck.length; j++) {
      k = Math.floor(Math.random() * deck.length);
      temp = deck[j];
      deck[j] = deck[k];
      deck[k] = temp;
    }
    return deck;
  },
  cutDeck: function(deck){
    var bothDecks = [[]];
    var halfDeck = [];
    var halfDeckLength=deck.length/2;
    while (deck.length>halfDeckLength){
      halfDeck.push(deck.pop());
    }
    bothDecks[0]=deck;
    bothDecks[1]=halfDeck;
    return bothDecks;
  },

}

var deck = war.makeDeck(13);
war.cutDeck(deck);


//notes: use shift to take a card off
//use push to add a card to bottom
