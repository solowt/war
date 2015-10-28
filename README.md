gh-pages: http://solowt.github.io/war/index.html

git repo: https://github.com/solowt/war

Project:

Used html, css, and javascript to create a version of the children's card game war. [wikipedia](https://en.wikipedia.org/wiki/War_(card_game)).

Approach:

In order to code the card game war, I took the approach of first coding a deck object and then adding several basic methods to it: shuffle, cut (split the deck in half), as well as the ability to create a new deck with a variable number of ranks (a normal deck would have 13 ranks: 2-10, ace, jack, queen, king).  I also used an array of suits, which could be easily modified to add custom suits to the deck.  Suits play no role in war, but are an integral part of real 52 card decks and I wanted my deck to feel relatively real.

I represented my deck as an array of strings, with each string representing a card.  Each string was formulated like so: "value-Suit" ("10-Hearts", "2-Clubs").  When I needed to access the value, I used the split and parseInt functions to get at the value.  In retrospect it would have made more sense to use an array of objects in order to hold the deck.  This would have simplified extracting information from the deck about each card.

After I had the basic deck coded, I added a method to play war between two decks.  I used shift to take the first element/string/card off of a deck and push to add a new element to the end.  I determined a winner in a separate function and passed that result back to the play war function so I would know which deck to push.

Coding ties was a bit challenging.  In war, in the event of a tie, each player puts a set amount of cards face down to the side (usually 2 or 3) along with the cards that resulted in a tie.  Then a new card is played, and the winner of that pairing takes the entire pool.  Initially I wanted to recursively call the playWar function in the event of a tie, but I ended up running into issues here.  Instead, I created a local pool array inside the war object and push any cards that should be added to the pool into this array.  Then, every time a player wins or loses, the playWar function empties the pool array into the winner's deck.  Usually the pool array is empty, except if there was a tie in the previous play.

I added html and css after the js was more or less done.  For this reason the first half of my js file focuses on the the deck and the game and the second half is using DOM manipulation and adding listeners to buttons and so on.  The latter part of my code focuses almost entirely on the graphical representation of war.

User stories for war:

1. As a user, I want to be able to be able to see html representations of cards because text based games are boring.

2. As a user, I want to be able to reset the game with a button so that I don't have to reload the page.

3. As a user, I want to be able to hear sounds whenever something happens (shuffling a deck, dealing cards) because sounds will make the game more immersive.

4. As a user, I want to be able to mute the sounds because sometimes I'd rather listen to music while playing war.

5. As a user, I want to be able to play against the computer because my friends won't always want to play war.
