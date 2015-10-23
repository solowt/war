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
  }
}
var deck = war.makeDeck(13);
var shuffledDeck = war.shuffleDeck(deck);
console.log(deck.pop());
console.log(deck.length);
console.log(deck.pop());
console.log(deck.length);

//notes: use pop to take a card off
//use unshift("card") to add a card to bottom
