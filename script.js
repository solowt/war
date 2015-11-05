var war = { // NHO: Great job wrapping all your code in a global object!
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
  counter: 0, //count number of turns
  //template for cards with X and Y in place of value and suit
  cardTemplate: "<div class='card'>\n\t<div class='front'>\n\t\t<div class='index'>X<br />Y</div>\n\t\t<div class='spotB2'>Y</div>\n\t\t<div class='spotB1'>Y</div>\n\t\t<div class='spotB1'>Y</div>\n\t</div>\n</div>",
  //loads all sounds as global vars
  loadSounds: function(){ // NHO: Loved the sounds!
    shuffleSound = new Audio("sounds/shuffle.mp3");
    cutDeck = new Audio("sounds/cutDeck.mp3");
    dealCard1 = new Audio("sounds/dealCard.mp3");
    dealCard2 = new Audio("sounds/dealCard2.mp3");
  },
  //takes a card and returns an array containing its value and suit
  getCardVal: function(card){ // NHO: As you pointed out, I think your code could be simplified by making each card an object rather than a string
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
    returnString = string.replace(/X/g, valueArray[0]); // NHO: RegEx!
    returnString = returnString.replace(/Y/g, valueArray[1]);
    return returnString;
  },
  //make a new deck
  makeDeck: function(numRanks) {
    var newDeck = [];
    for (var i=0; i<this.suits.length; i++){
      for (var j=0; j<numRanks;j++){
        var cardName = j+'-'+this.suits[i][0]; // NHO: would recommend making each card an object here!
        newDeck.push(cardName);
      }
    }
    return newDeck;
  },
  //shuffles a deck
  shuffleDeck: function(deck) { // NHO: Fischer-Yates random!
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
    while (deck.length>halfDeckLength){ // NHO: clever!
      halfDeck.push(deck.pop());
    }
    bothDecks[0]=deck;
    bothDecks[1]=halfDeck;
    return bothDecks;
  },
  //draws the card pool on the screen in the event of a tie
  drawPool: function(){ // NHO: Visually, really liked this implementation
    for (var i =0; i<2; i++){
      $(".pool").append($("<div class='poolcard1 cardback'></div>"));
    }
    for (var i =0; i<2; i++){
      $(".pool").append($("<div class='poolcard2 cardback'></div>"));
    }
    var card1Html = $(".front").eq(0).html();
    var card2Html = $(".front").eq(1).html();
    $(".pool").append($("<div class='poolcard1 newpool tie1'>"+card1Html+"</div>"));
    $(".pool").append($("<div class='poolcard2  newpool tie2'>"+card2Html+"</div>"));
    if ($(".spotB2").eq(0).html() == "♥" || $(".spotB2").eq(0).html() == "♦"){
      $(".newpool").eq(0).css("color", "red");
    }
    if ($(".spotB2").eq(1).html() == "♥" || $(".spotB2").eq(1).html() == "♦"){
      $(".newpool").eq(1).css("color", "red");
    }
  },
  //clears the part pool
  clearPool: function(){
    $(".pool").html("");
  },
  //compares two cards, returns an array with each card and the winner as
  //3 indices
  compare: function(card1, card2){ // NHO: The essentail function of war! Like how you included the winning player as string in the return
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
  playWar: function(deck1, deck2){ // NHO: Would love to think of ways this function could be simplified
    //checks for winner
    if(this.checkWinner()){
      return pair[1];
    }
    //play a random sound
    if (Math.random()<.5){
      dealCard1.play();
    }else{
      dealCard2.play();
    }
    //take one card from each deck and compare them
    var pair = this.compare(deck1.shift(), deck2.shift());
    //if the card from player 1 is higher add both cards to deck 1
    if (pair[1] == "player1"){
      //shuffles the pairs half the time.  this makes the game
      //non-deterministic
      if (Math.random() > .5){
        var temp = pair[0][0];
        pair[0][1] = pair[0][0];
        pair[0][0] = temp;
      }
      deck1.push(pair[0].shift());
      deck1.push(pair[0].shift());
      //shuffle the card pool
      if (this.cardPool.length > 0){
         this.cardPool = this.shuffleDeck(this.cardPool);
      }
      //empty the pool into the winner's deck
      while (this.cardPool.length > 0){
        if (this.cardPool[0]==undefined){
          this.cardPool.shift();
          break;
        }
        deck1.push(this.cardPool.shift());
        this.clearPool();
      }
      //if the card from player 2 is higher add both cards to deck 2
    }else if (pair[1] == "player2"){
      //shuffles the pairs half the time.  this makes the game
      //non-deterministic
      if (Math.random() > .5){
        var temp = pair[0][0];
        pair[0][1] = pair[0][0];
        pair[0][0] = temp;
      }
      deck2.push(pair[0].shift());
      deck2.push(pair[0].shift());
      //shuffle card pool
      if (this.cardPool.length > 0){
         this.cardPool = this.shuffleDeck(this.cardPool);
      }
      //empty the pool into the winner's deck
      while (this.cardPool.length > 0){
        if (this.cardPool[0]==undefined){
          this.cardPool.shift();
          break;
        }
        deck2.push(this.cardPool.shift());
        this.clearPool();
      }
      //if the cards have the same value add to the pool (2 from each
      //deck + the two tied cards)
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
    //return the winner string
    return pair[1];
  },
  //check to see if either deck is empty, if so, run through some steps
  checkWinner: function(){
    if (this.halfDecks[0].length == 0 || this.halfDecks[1].length == 0){
      console.log("Game ended in: "+this.counter+" turns.");
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
  addButtonListeners: function(){ // NHO: Really like the level of detail to manage game state
    var self = this;
    //create deck button creates a new deck
    $("#createDeck").on("click", function(){
      if (!self.playingGame) {
        $(".initdeck").removeClass("hidden");
        self.playingGame = true;
        self.currentDeck = self.makeDeck(13);
      }
    });
    //shuffle deck function shuffles on click
    $("#shuffleDeck").on("click", function(){
      if (self.currentDeck){
        self.shuffleDeck(self.currentDeck);
      }
    });
    //cuts a deck in half and toggles the hidden class on a lot of stuff
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
    //if you click on the left deck...
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
    //if you click on the right deck..
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
    //click on the drawn card from the left deck
    $(".topdeck1").on("click", function(){
      if (self.playingGame == true && self.deck1Ready == false){
        if (Math.random()<.5){
          dealCard1.play();
        }else{
          dealCard2.play();
        }
        console.log("player 1 card: "+self.halfDecks[0][0]);
        self.counter++
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
    //click on the drawn card from the right deck
    $(".topdeck2").on("click", function(){
      if (self.playingGame == true && self.deck2Ready == false){
        if (Math.random()<.5){
          dealCard1.play();
        }else{
          dealCard2.play();
        }
        console.log("player 2 card: "+self.halfDecks[1][0]);
        self.counter++;
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
    //this function draws and flips cards from both decks
    $("#draw").on("click", function(){
      self.playRound();
    });
    //this plays a quick game
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
    //clears everything to prep for a new game
    $("#newGame").on("click", function(){
      self.currentDeck = [""];
      self.halfDecks = [""];
      self.quickGame = false;
      self.counter = 0;
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
  //plays one round
  playRound: function(){
    if (this.deck1Ready && this.deck2Ready && this.playingGame){
      $(".deck1").trigger("click");
      $(".deck2").trigger("click");
      $(".topdeck1").trigger("click");
      $(".topdeck2").trigger("click");
    }
  },
}
//loads everything
war.loadSounds();
war.addButtonListeners();

// NHO: Overall this is some very good JS. I really like how you utilize a global object to encapsulate all your logic
// As far as simplification goes, I think a lot of value could be gained by converting to a deck of card objects
// rather than by having to parse through strings. Also, thinking big picture, it's generally good practice to seperate our logic, from the view.
// We will go further in-depth into these concepts in the weeks to come, but I would encourage you to start thinking about objects
// representing business data (our Models), and an object representing our view state (which would take a model to build a view)!
