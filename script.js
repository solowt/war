var war = {
  cardPool: [], //to hold cards in the event of a tie
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
    var bothDecks = [];
    var halfDeck = [];
    var halfDeckLength=deck.length/2;
    while (deck.length>halfDeckLength){
      halfDeck.push(deck.pop());
    }
    bothDecks[0]=deck;
    bothDecks[1]=halfDeck;
    return bothDecks;
  },
  compare: function(card1, card2){
    var returnCards=[[],""];
    var valueCard1 = parseInt(card1.split("-")[0]);
    var valueCard2 = parseInt(card2.split("-")[0]);
    if (valueCard1>valueCard2){
      returnCards[0][0]=card1;
      returnCards[0][1]=card2;
      returnCards[1]="player1";
    }else if (valueCard2>valueCard1){
      returnCards[0][0]=card2;
      returnCards[0][1]=card1;
      returnCards[1]="player2";
    }else{
      returnCards[0][0]=card1;
      returnCards[0][1]=card2;
      returnCards[1]="tie";
    }
    console.log(returnCards)
    return returnCards;
  },
  playWar: function(deck1, deck2){
    var pair = this.compare(deck1.shift(), deck2.shift());
    if (pair[1] == "player1"){
      deck1.push(pair[0].shift());
      deck1.push(pair[0].shift());
      while (this.cardPool.length > 0){
        deck1.push(this.cardPool.shift());
      }
    }else if (pair[1] == "player2"){
      deck2.push(pair[0].shift());
      deck2.push(pair[0].shift());
      while (this.cardPool.length > 0){
        deck2.push(this.cardPool.shift());
      }
    }else if (pair[1] == "tie"){
      this.cardPool.push(pair[0].shift());
      this.cardPool.push(pair[0].shift());
      for(var i=0;i<3;i++){
        if (deck1.length==0){
          while (this.cardPool.length > 0){
            deck2.push(this.cardPool.shift());
          }
        }else if (deck2.length==0){
          while (this.cardPool.length > 0){
            deck1.push(this.cardPool.shift());
          }
        }
        this.cardPool.push(deck1.shift());
        this.cardPool.push(deck2.shift());
      }
    }
    return;
  },
  playWarButton: function(deck1, deck2){
    //add button
  },

}

var deck = war.makeDeck(13);
war.shuffleDeck(deck);
var splitDecks = war.cutDeck(deck);
while ((splitDecks[0].length > 0) && (splitDecks[1].length > 0)){
  war.playWar(splitDecks[0], splitDecks[1]);

  console.log(splitDecks);
}

//notes: use shift to take a card off
//use push to add a card to bottom

// tieWar: function(deck1, deck2, pair){
//   var tieStakes = 3;
//   var tieCards = [];
//   tieCards.push(pair.shift());
//   tieCards.push(pair.shift());
//   for (var i=0;i<tieStakes;i++){
//     tieCards.push(deck1.shift());
//     tieCards.push(deck2.shift());
//   }
//   var testPair = this.playWar(deck1, deck2);
//   if (testPair.length == 1){
//     if(testPair[0] == "player1"){
//       for (var j=0;j<tieCards.length;j++){
//         deck1.push(tieCards.shift());
//       }
//     }else if (testPair[0] == "player2"){
//       for(var k=0; k<tieCards.length; k++){
//         deck2.push(tieCards.shift());
//       }
//     }
//   }else{
//     return;
//   }
//
// }
