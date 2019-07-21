const MemoryGame = function() {
	'use strict';

	return {
		deck: document.querySelector('.deck'), // deck of all cards in game
		stars: document.querySelectorAll(".fa-star"), // declaring rating selector
		timer: document.querySelector(".timer"), // declaring timer selector
		movesText: document.querySelector('.moves'),	// declaring move text selector	
		modal: document.getElementById("modalWin"), // declaring the final modal	
		close: document.getElementById("close"), //declaring modal close selector
		restartGame: document.getElementById("restartGame"), //declaring restart game button selector
		cardList: [], // holds all cards
		cards: ['gem','plane','anchor','bolt','cube','leaf','bicycle','bomb'], // declare array for card icons
		classOpen: 'open', // class open / show
		classMatch: 'match', //class if cards match
		classUnmatched: 'unmatched', //class if cards match
		listOpenCards: [],  // array for opened cards
		lockBoard: false, // Locks the board 
		numMoves: 0, // declaring number of moves variable
		rightMoves:0, // declaring right moves variable		
		interval:'', //declaring timer		

		/**
		* @description Start Game and creates the board
		* @returns Deck of cards full and shuffled
		*/
		init:function(){
			const t = this;
			t.reset();
			
			const arrayCards = [...t.shuffle(t.cards),...t.shuffle(t.cards.slice())];

			const html = t.shuffle(arrayCards).map(function(card){
				t.deck.innerHTML = "";
				return t.createCards(card);
			});

			t.deck.innerHTML = html.join('');

			t.cardList = t.deck.querySelectorAll('.card');
			t.cardsClick();
			t.restartClick();
		},

		/**
		* @description Creates HTML cards
		* @param {string} symbol - Receive the icon
		* @returns HTML of cards
		*/
		createCards:function(symbol){
			return `<li class="card" data-icon="${symbol}"><i class="fas fa-${symbol}"></i></li>`;
		},

		/**
		* @description Get card's click
		*/
		cardsClick:function(){
			const t = this;

			t.cardList.forEach(function(cards){
				cards.addEventListener('click',function(){
					t.displayCard(cards);					
				});
			});

			//t.cardList.forEach(card => card.addEventListener('click',t.displayCard));
		},
		/**
		* @description Display card's symbol (Flip)
		* @param {object} card - Receive the card to open
		*/
		displayCard:function(card){			
			const t = this;
			const cl = card.classList;

			if(t.lockBoard) return;

			if(!cl.contains(t.classOpen) && !cl.contains(t.classMatch)){
				cl.add(t.classOpen);
				t.addListOpenCards(card);

				if(t.listOpenCards.length == 2){
					t.lockBoard = true;
					t.updateMoves();
					t.updateRating();
					t.checkForMatch();					
				}
			}
		},

		/**
		* @description Check if the cards match
		*/
		checkForMatch:function(){
			const t = this;
			let isMatch = t.listOpenCards[0].dataset.icon == t.listOpenCards[1].dataset.icon;

			isMatch ? t.addsMatchClass() : t.hideCard();
		},

		/**
		* @description Adds match class
		*/
		addsMatchClass:function(){
			const t = this;

			t.listOpenCards.forEach(function(card){
				card.classList.add(t.classMatch);
			});

			t.rightMoves += 1;
			t.emptyListOpenCards();			
			t.checkForEnd();		
		},

		/**
		* @description Hide card's symbol (Unflip)
		*/
		hideCard:function(){
			const t = this;

			t.listOpenCards.forEach(function(card){
				card.classList.add(t.classUnmatched);
			});

			setTimeout(function(){
				t.listOpenCards.forEach(function(card){
					card.classList.remove(t.classOpen);
					card.classList.remove(t.classMatch);
					card.classList.remove(t.classUnmatched);
				});

				t.emptyListOpenCards();
			}, 1000);
		},

		/**
		* @description Adds the card to a list of open cards
		* @param {object} card - Add card to an array
		*/
		addListOpenCards:function(card){
			this.listOpenCards.push(card);
		},

		/**
		* @description Clean list of open cards
		*/
		emptyListOpenCards:function(){
			this.listOpenCards = [];
			this.lockBoard = false;
		},		

		/**
		* @description Update moves counter
		*/
		updateMoves:function(){
			const t = this;

			t.numMoves += 1;
			t.movesText.innerText =  t.numMoves;

			t.starTimer();
		},

		/**
		* @description Update Rating
		*/
		updateRating:function(){
			const t = this;

			if (t.numMoves > 8 && t.numMoves < 12){

				for(let i= 0; i < 3; i++){
					if(i > 1){
						t.stars[i].classList.remove('fas');
						t.stars[i].classList.add('far');
					}
				}

			}else if (t.numMoves > 13){

				for(let i= 0; i < 3; i++){
					if(i > 0){
						t.stars[i].classList.remove('fas');
						t.stars[i].classList.add('far');
					}
				}

			}
		},	

		/**
		* @description game timer
		*/		
		starTimer:function(){
			const t = this;

			let second = 0;
			let minute = 0;
			let hour = 0;

			if (t.numMoves === 1){
				t.interval = setInterval(function(){
					//t.timer.innerHTML = `${hour}<b>hour(s)</b> ${minute}<b>mins</b> ${second}<b>secs</b>`;
					t.timer.innerHTML = `${minute} <b>mins</b> - ${second} <b>secs</b>`;

					second++;
					if(second == 60){
						minute++;
						second=0;
					}
					if(minute == 60){
						hour++;
						minute = 0;
					}
				},1000);
			}
		},

		/**
		* @description Check if the game is over
		*/
		checkForEnd:function(){
			const t = this;
			const win =  t.cardList.length / 2;

			if(t.rightMoves == win){
				t.openModal();
			}
		},

		/**
		* @description Open Pop up with the results
		*/
		openModal: function(){
			const t = this;
			clearInterval(t.interval);

			document.getElementById("finalMoves").innerHTML = t.numMoves;
			document.getElementById("finalTime").innerHTML = t.timer.innerHTML;
			document.getElementById("finalRating").innerHTML = document.querySelector(".stars").innerHTML;

			t.modal.classList.add("show");
			t.closeModal();
		},

		/**
		* @description Close Pop up 
		*/
		closeModal:function(){
			const t = this;

			t.close.addEventListener("click", function(e){
				t.modal.classList.remove("show");
				t.init();
			});

			t.restartGame.addEventListener("click", function(e){
				t.modal.classList.remove("show");
				t.init();
			});
		},

		/**
		* @description Reset the game and shuffle cards
		*/
		reset:function(){
			const t = this;
			
			t.lockBoard = false;
			t.numMoves = 0;
			t.movesText.innerText =  t.numMoves;

			t.rightMoves = 0;			

			t.stars.forEach(function(star){
				star.classList.remove('far');
				star.classList.add('fas');
			});

			clearInterval(t.interval);
			t.timer.innerHTML = "0 <b>mins</b> - 0 <b>secs</b>";			
		},
		
		/**
		* @description Click button restart
		*/
		restartClick:function(){
			const t = this;
			
			document.querySelector('.restart').addEventListener('click',function(){	
				t.init();
			});			
		},

		/**
		* @description Shuffle cards
		* @param {array} array - Array with the cards
		* @returns shuffledarray
		*/
		shuffle:function(array){
			var currentIndex = array.length, temporaryValue, randomIndex;

			while (0 !== currentIndex) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;

				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}

			return array;
		}
	}
}();


(function() {
	/**
	* @description Start the game
	*/
	MemoryGame.init();
})();