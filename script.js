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
  quickGame: false, // ""
  deckCut: false, // ""
  computerReady: true, // ""
  intervalId: null, //will hold setInterval timer ID
  //template for cards with X and Y in place of value and suit
  cardTemplate: "<div class='card'>\n\t<div class='front'>\n\t\t<div class='index'>X<br />Y</div>\n\t\t<div class='spotB2'>Y</div>\n\t\t<div class='spotB1'>Y</div>\n\t\t<div class='spotB1'>Y</div>\n\t</div>\n</div>",
  //loads all sounds as global vars
  loadSounds: function(){
    shuffleSound = new Audio("sounds/shuffle.mp3");
    cutDeck = new Audio("sounds/cutDeck.mp3");
    dealCard1 = new Audio("sounds/dealCard.mp3");
    dealCard2 = new Audio("sounds/dealCard2.mp3");
  },
  //takes a card and returns an array containing its value and suit
  getCardVal: function(card){
    valueArray = [];
    var valueCard = card.split("-");
    valueArray[0] = parseInt(valueCard[0]);
    valueArray[1] = valueCard[1];
    if (valueArray[1] == this.suits[0][0]) {
      valueArray[1] = this.suits[0][1];
    }else if (valueArray[1] == this.suits[1][0]) {
      valueArray[1] = this.suits[1][1];
    }else if (valueArray[1] == this.suits[2][0]) {
      valueArray[1] = this.suits[2][1];
    }else if (valueArray[1] == this.suits[3][0]) {
      valueArray[1] = this.suits[3][1];
    }
    return valueArray;
  },
  //takes the card template and edits it based on the card being rendered
  //then returns the html string
  drawCard: function(string, valueArray) {
    returnString = "";
    valueArray[0] = parseInt(valueArray[0]);
    if (valueArray[0]<=8){
      valueArray[0]+=2;
    }else if(valueArray[0] == 9){
      valueArray[0] = 'J';
    }else if (valueArray[0] == 10){
      valueArray[0] = 'Q';
    }else if (valueArray[0] == 11){
      valueArray[0] = 'K';
    }else if (valueArray[0]==12){
      valueArray[0] = 'A';
    }
    returnString = string.replace(/X/g, valueArray[0]);
    returnString = returnString.replace(/Y/g, valueArray[1]);
    return returnString;
  },
  //make a new deck
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
  //shuffles a deck
  shuffleDeck: function(deck) {
    shuffleSound.play();
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
  //cuts a deck in half, returns an array with 2 indices, each one being a
  //deck
  cutDeck: function(deck){
    cutDeck.play();
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
  //draws the card pool on the screen in the event of a tie
  drawPool: function(){
    for (var i =0; i<2; i++){
      $(".pool").append($("<div class='poolcard1 cardback'></div>"));
    }
    for (var i =0; i<2; i++){
      $(".pool").append($("<div class='poolcard2 cardback'></div>"));
    }
    var card1Html = $(".front").eq(0).html();
    var card2Html = $(".front").eq(1).html();
    $(".pool").append($("<div class='poolcard1 newpool'>"+card1Html+"</div>"));
    $(".pool").append($("<div class='poolcard2  newpool'>"+card2Html+"</div>"));
    if ($(".spotB2").html() == "♥" || $(".spotB2").html() == "♦"){
      $(".newpool").css("color", "red");
    }
  },
  //clears the part pool
  clearPool: function(){
    $(".pool").html("");
  },
  //compares two cards, returns an array with each card and the winner as
  //3 indices
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
  //one round of war between two decks
  playWar: function(deck1, deck2){
    if(this.checkWinner()){
      return pair[1];
    }
    if (Math.random()<.5){
      dealCard1.play();
    }else{
      dealCard2.play();
    }
    var pair = this.compare(deck1.shift(), deck2.shift());
    if (pair[1] == "player1"){
      deck1.push(pair[0].shift());
      deck1.push(pair[0].shift());
      while (this.cardPool.length > 0){
        if (this.cardPool[0]==undefined){
          this.cardPool.shift();
          break;
        }
        deck1.push(this.cardPool.shift());
        this.clearPool();
      }
    }else if (pair[1] == "player2"){
      deck2.push(pair[0].shift());
      deck2.push(pair[0].shift());
      while (this.cardPool.length > 0){
        if (this.cardPool[0]==undefined){
          this.cardPool.shift();
          break;
        }
        deck2.push(this.cardPool.shift());
        this.clearPool();
      }
    }else if (pair[1] == "tie"){
      this.drawPool();
      for (var j=0; j<2; j++){
        this.cardPool.push(pair[0].shift());
      }
      for(var i=0;i<2;i++){
        this.cardPool.push(deck1.shift());
        this.cardPool.push(deck2.shift());
      }

    }
    return pair[1];
  },
  //check to see if either deck is empty, if so, run through some steps
  checkWinner: function(){
    if (this.halfDecks[0].length == 0 || this.halfDecks[1].length == 0){
      clearInterval(this.intervalId);
      if (this.halfDecks[0].length > this.halfDecks[1].length){
        this.playingGame = false;
        this.clearPool();
        while(this.cardPool.length>0){
          this.halfDecks[0].push(this.cardPool.shift());
          $(".deck1counter").html(this.halfDecks[0].length);
          $(".deck2counter").html(this.halfDecks[1].length);
        }
        alert("Player 1 Wins!");
        return true;
      }else if (this.halfDecks[1].length > this.halfDecks[0].length){
        this.playingGame = false;
        this.clearPool();
        while(this.cardPool.length>0){
          this.halfDecks[1].push(this.cardPool.shift());
          $(".deck1counter").html(this.halfDecks[0].length);
          $(".deck2counter").html(this.halfDecks[1].length);
        }
        alert("Player 2 Wins!");
        return true;
      }
    }
    return false;
  },
  //extension of the playWar method, also deals with html/css side of the game
  startWar: function(){
    if (this.readyCard2 && this.readyCard1){
      this.readyToDeal = false;
      var beforeLength1 = this.halfDecks[0].length;
      var beforeLength2 = this.halfDecks[1].length;
      var winnerStr = this.playWar(this.halfDecks[0], this.halfDecks[1])
      var self = this;
      setTimeout(function(){
        $(".topdeck1").addClass("hidden cardback");
        $(".topdeck2").addClass("hidden cardback");
      }, 2000);
      var subtractString1 = this.halfDecks[0].length-beforeLength1;
      var subtractString2 = this.halfDecks[1].length-beforeLength2;
      $(".deck1counter").html(this.halfDecks[0].length + " " + (Math.sign(subtractString1) == -1 ? "": "+") +" "+ subtractString1);
      $(".deck2counter").html(this.halfDecks[1].length + " " + (Math.sign(subtractString2) == -1 ? "": "+") +" "+ subtractString2);
      console.log(this.halfDecks[0].length +" "+this.halfDecks[1].length);
      this.readyCard2 = false;
      this.readyCard1 = false;
    }
  },
  //long function to add listeners to every button
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
      if (!self.deckCut) {
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
        $(".fight").removeClass("hidden");
        self.deckCut = true;
      }
    });
    $(".deck1").on("click", function(){
      if(self.deck1Ready == true && self.playingGame){
        var card1 = $(".topdeck1");
        card1.html("");
        if (!self.quickGame){
          card1.css("left","100px");
        }
        card1.removeClass("hidden");
        if (!self.quickGame){
          card1.animate({left: $(".target1").css("left")});
        }
        self.deck1Ready = false;
      }
    });
    $(".deck2").on("click", function(){
      if (self.deck2Ready == true && self.playingGame){
        var card2 = $(".topdeck2");
        card2.html("");
        if (!self.quickGame){
          card2.css("right","100px");
        }
        card2.removeClass("hidden");
        if (!self.quickGame){
          card2.animate({right: $(".target2").css("right")});
        }
        self.deck2Ready = false;
      }
    });
    $(".topdeck1").on("click", function(){
      if (self.playingGame == true && self.deck1Ready == false){
        //self.computerReady = false;
        if (Math.random()<.5){
          dealCard1.play();
        }else{
          dealCard2.play();
        }
        console.log("player 1 card: "+self.halfDecks[0][0]);
        $(".topdeck1").removeClass("cardback");
        var valueArray = self.getCardVal(self.halfDecks[0][0]);
        var newCardTemplate = self.drawCard(self.cardTemplate, valueArray);
        $(".topdeck1").html(newCardTemplate);
        if (valueArray[1] == "&hearts;" || valueArray[1] == "&diams;"){
          $(".topdeck1").css("color", "red");
        }else if (valueArray[1] == "&clubs;" || valueArray[1] == "&spades;"){
          $(".topdeck1").css("color", "black");
        }
        self.deck1Ready = true;
        self.readyCard1 = true;
        self.startWar();
      }
    });
    $(".topdeck2").on("click", function(){
      if (self.playingGame == true && self.deck2Ready == false){
        //self.computerReady = false;
        if (Math.random()<.5){
          dealCard1.play();
        }else{
          dealCard2.play();
        }
        console.log("player 2 card: "+self.halfDecks[1][0]);
        $(".topdeck2").removeClass("cardback");
        var valueArray = self.getCardVal(self.halfDecks[1][0]);
        var newCardTemplate = self.drawCard(self.cardTemplate, valueArray);
        $(".topdeck2").html(newCardTemplate);
        if (valueArray[1] == "&hearts;" || valueArray[1] == "&diams;"){
          $(".topdeck2").css("color", "red");
        }else if (valueArray[1] == "&clubs;" || valueArray[1] == "&spades;"){
          $(".topdeck2").css("color", "black");
        }
        self.deck2Ready = true;
        self.readyCard2 = true;
        self.startWar();
      }
    });

    $("#draw").on("click", function(){
      self.playRound();
    });
    $("#computer").on("click", function(){
      if (self.deck1Ready && self.deck2Ready && self.playingGame && self.computerReady){
        $(".topdeck1").css("left", "300px");
        $(".topdeck2").css("right", "300px");
        self.quickGame = true;
        self.intervalId = setInterval(function(){
          if (self.checkWinner() == true){
            return;
          }
          self.playRound();
        }, 25);
      }
    });
    $("#newGame").on("click", function(){
      self.currentDeck = [""];
      self.halfDecks = [""];
      self.quickGame = false;
      self.playingGame = false;
      self.deck1Ready = false;
      self.readyCard1 = false;
      self.deck2Ready = false;
      self.readyCard2 = false;
      self.deckCut = false;
      self.computerReady = true;
      self.clearPool();
      $(".topdeck2").addClass("hidden");
      $(".topdeck1").addClass("hidden");
      $(".deck1").addClass("hidden");
      $(".deck2").addClass("hidden");
      $(".initdeck").addClass("hidden");
      $(".deck1counter").html("");
      $(".deck2counter").html("");
      $(".deck1counter").addClass("hidden");
      $(".deck2counter").addClass("hidden");
    })
  },
  playRound: function(){
    if (this.deck1Ready && this.deck2Ready && this.playingGame){
      $(".deck1").trigger("click");
      $(".deck2").trigger("click");
      $(".topdeck1").trigger("click");
      $(".topdeck2").trigger("click");
    }
  },
}
war.loadSounds();
war.addButtonListeners();
