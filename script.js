var war = {
  cardPool: [], //to hold cards in the event of a tie
  suits: [["Clubs","&clubs;" ], ["Hearts","&hearts;"], ["Diamonds","&diams;"], ["Spades","&spades;"]], //suits
  currentDeck: null, //the current deck being used
  halfDecks: [], //array to hold decks after they've been cut
  playingGame: false, //boolean to keep track of game state
  deck1Ready: false, //another boolean to keep track of the game state
  deck2Ready: false, //another boolean to keep track of the game state
  readyCard1: false, //another boolean to..
  readyCard2: false, //another boolea...
  value: "V",
  suit: "S",
  cardTemplate: "<div class='card'>\n\t<div class='front'>\n\t\t<div class='index'>X<br />Y</div>\n\t\t<div class='spotB1'>Y</div>\n\t\t<div class='spotB1'>Y</div>\n\t\t<div class='spotB1'>Y</div>\n\t</div>\n</div>",
  getCardVal: function(card){
    valueArray = [];
    var valueCard = parseInt(card.split("-")[0]);
    valueArray[0]= valueCard;
    if (valueCard[1]=this.suits[0][0]) {
      valueArray[1] = this.suits[0][1];
    }else if (valueCard[1]=this.suits[1][0]) {
      valueArray[1] = this.suits[1][1];
    }else if (valueCard[1]=this.suits[2][0]) {
      valueArray[1] = this.suits[2][1];
    }else if (valueCard[1]=this.suits[3][0]) {
      valueArray[1] = this.suits[3][1];
    }
    return valueArray;
  },
  drawCard: function(string, valueArray) {
    returnString = "";
    returnString = string.replace(/X/g, valueArray[0]);
    returnString = returnString.replace(/Y/g, valueArray[1]);
    return returnString;
  },
  makeDeck: function(numRanks) {
    var newDeck = [];
    for (var i=0; i<this.suits.length; i++){
      for (var j=0; j<numRanks;j++){
        var cardName = j+'-'+this.suits[i][0];
        newDeck.push(cardName);
      }
    }
    return newDeck;
  },
  shuffleDeck: function(deck) {
    var j, k;
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
  getCardInfo: function(deck){
    var valueCard = deck[0].split("-");
    return valueCard;
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
  addButtonListeners: function(){
    var self = this;
    $("#createDeck").on("click", function(){
      if (!self.playingGame) {
        $(".initdeck").removeClass("hidden");
        self.playingGame = true;
        self.currentDeck = self.makeDeck(13);
      }
    });
    $("#shuffleDeck").on("click", function(){
      if (self.currentDeck){
        self.shuffleDeck(self.currentDeck);
      }
    });
    $("#cutDeck").on("click", function(){
      self.deck1Ready = true;
      self.deck2Ready = true;
      self.halfDecks = self.cutDeck(self.currentDeck);
      $(".initdeck").addClass("hidden");
      $(".deck2").removeClass("hidden");
      $(".deck1").removeClass("hidden");
      $(".deck1counter").removeClass("hidden");
      $(".deck2counter").removeClass("hidden");
      $(".deck1counter").html(self.halfDecks[0].length);
      $(".deck2counter").html(self.halfDecks[1].length);
    });
    $(".deck1").on("click", function(){
      if (self.deck1Ready == true){
        $(".topdeck1").html("");
        $(".topdeck1").removeClass("hidden");
        self.deck1Ready = false;
      }
    });
    $(".deck2").on("click", function(){
      if (self.deck2Ready == true){
        $(".topdeck2").html("");
        $(".topdeck2").removeClass("hidden");
        self.deck2Ready = false;
      }
    });
    $(".topdeck1").on("click", function(){
      if (self.playingGame == true && self.deck1Ready == false){
        console.log(self.halfDecks[0][0]);
        var valueArray = self.getCardVal(self.halfDecks[0][0]);
        var newCardTemplate = self.drawCard(self.cardTemplate, valueArray);
        $(".topdeck1").html(newCardTemplate);
        self.deck1Ready = true;
        self.readyCard1 = true;
        if (self.readyCard2 == true && self.readyCard1 == true){
          self.readyCard2 = false;
          self.readyCard1 = false;
          self.playWar(self.halfDecks[0], self.halfDecks[1])
          setTimeout(function(){$(".topdeck1").addClass("hidden");}, 1500);
          setTimeout(function(){$(".topdeck2").addClass("hidden");}, 1500);
          $(".deck1counter").html(self.halfDecks[0].length);
          $(".deck2counter").html(self.halfDecks[1].length);
          console.log(self.halfDecks[0].length +" "+self.halfDecks[1].length);
        }
      }
    });
    $(".topdeck2").on("click", function(){
      if (self.playingGame == true && self.deck2Ready == false){
        console.log(self.halfDecks[1][0]);
        var valueArray = self.getCardVal(self.halfDecks[1][0]);
        var newCardTemplate = self.drawCard(self.cardTemplate, valueArray);
        $(".topdeck2").html(newCardTemplate);
        self.deck2Ready = true;
        self.readyCard2 = true;
        if (self.readyCard2 == true && self.readyCard1 == true){
          self.readyCard2 = false;
          self.readyCard1 = false;
          self.playWar(self.halfDecks[0], self.halfDecks[1])
          setTimeout(function(){$(".topdeck2").addClass("hidden");}, 1500);
          setTimeout(function(){$(".topdeck1").addClass("hidden");}, 1500);
          $(".deck1counter").html(self.halfDecks[0].length);
          $(".deck2counter").html(self.halfDecks[1].length);
          console.log(self.halfDecks[0].length +" "+self.halfDecks[1].length);
        }
      }
    });
  },
}
war.addButtonListeners();
// var deck = war.makeDeck(13);
// war.shuffleDeck(deck);
// var splitDecks = war.cutDeck(deck);
// var i=0;
// while ((splitDecks[0].length > 0) && (splitDecks[1].length > 0)){
//   war.playWar(splitDecks[0], splitDecks[1]);
//   console.log(splitDecks[0].length +" "+splitDecks[1].length);
//   i++;
// }
//   console.log(i)
