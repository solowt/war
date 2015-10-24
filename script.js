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
    var returnCards=[];
    var valueCard1 = parseInt(card1.split("-")[0]);
    var valueCard2 = parseInt(card2.split("-")[0]);
    if (valueCard1>valueCard2){
      returnCards[0]=card1;
      returnCards[1]=card2;
      returnCards[2]="player1"
    }else if (valueCard2>valueCard1){
      returnCards[0]=card2;
      returnCards[1]=card1;
      returnCards[2]="player2"
    }else{
      returnCards[0]=card1;
      returnCards[1]=card2;
      returnCards[2]="tie"
    }
    return returnCards;
  },
  playWar: function(deck1, deck2){
    var pair = this.compare(deck1.shift(), deck2.shift());
    console.log("1 "+pair);
    if (pair[2] == "player1"){
      deck1.push(pair[0]);
      deck1.push(pair[1]);

    }else if (pair[2] == "player2"){
      deck2.push(pair[0]);
      deck2.push(pair[1]);

    }else if (pair[2] == "tie"){
      deck1.push(pair[0]);
      deck1.push(pair[1]);
      
    }
    console.log("2 "+pair);
  },
  playWarButton: function(deck1, deck2){
    //add button
  },
  tieWar: function(){
    //deal with ties
  }

}

var deck = war.makeDeck(13);
war.shuffleDeck(deck);
var splitDecks = war.cutDeck(deck);
while ((splitDecks[0].length > 0) && (splitDecks[1].length > 0)){
  war.playWar(splitDecks[0], splitDecks[1]);
}
console.log(splitDecks);

//notes: use shift to take a card off
//use push to add a card to bottom
