function init() {
	if(sessionStorage.username)
		document.getElementById("uname").innerHTML = sessionStorage.username;
	else
		document.getElementById("uname").innerHTML = "unknown";
}

$(document).ready(function(){
	var h3 = document.getElementsByTagName("h3")[0],
	start = document.getElementById("startid"),
	stop = document.getElementById("stop"),
	clear = document.getElementById("clear"),
	usrnm = sessionStorage.username,
	milliseconds = 0, seconds = 0, minutes = 0, runtime = false, winningTime = 0, arrayPemenang = [],
	t, pemenang;

	function inputArray() {
	pemenang = {'username' : usrnm, 'waktu' : parseInt(winningTime), 'result' : (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00") + ":" + (milliseconds > 9 ? milliseconds : "0" + milliseconds)}
	if(arrayPemenang != null) {
		arrayPemenang.push(pemenang);
		arrayPemenang.sort(compare);
	}
}

function compare(x,y) {
	if(x.waktu < y.waktu) {
		return -1;
	} else if (x.waktu > y.waktu) {
		return 1;
	} else {
		return 0;
	}
}

function generateBoard() {
	var printTab = JSON.parse(localStorage.getItem("awal"));
	$.each(printTab, function(i, element) {
		if(arrayPemenang != null) {
			$("#uname" + i + "").text(element.username);
			$("#waktu" + i + "").text(element.result);
		}
	})
}

function setBoard() {
	if(localStorage.getItem("awal") == null) {
		localStorage.setItem("awal", JSON.stringify(arrayPemenang));
	} else {
		var arrObj = JSON.parse(localStorage.getItem("awal"));
		arrObj.push({'username' : usrnm, 'waktu' : parseInt(winningTime), 'result' : (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00") + ":" + (milliseconds > 9 ? milliseconds : "0" + milliseconds)})
		arrObj.sort(compare);
		localStorage.setItem("awal", JSON.stringify(arrObj));
	}
}

generateBoard();

	$("#startgame").click(function(){
		(function(){
			if(milliseconds == 0)
				timer();

			function add() {
				milliseconds++;
				if (milliseconds >= 100) {
					milliseconds = 0;
					seconds++;
					if (seconds >= 60) {
						seconds = 0;
						minutes++;
					}
				}

				h3.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00") + ":" + (milliseconds > 9 ? milliseconds : "0" + milliseconds);

				timer();
			}

			function timer() {
				t = setTimeout(add, 10);
			}

			function set(key, value) { localStorage.setItem(key, value); }
			function get(key)        { return localStorage.getItem(key); }
			function increase(el)    { set(el, parseInt( get(el) ) + 1); }
			function decrease(el)    { set(el, parseInt( get(el) ) - 1); }

			var Memory = {

				init: function(cards){
					this.$game = $(".game");
					this.cardsArray = $.merge(cards, cards);
					if(runtime == false) {
						this.shuffleCards(this.cardsArray);
						runtime = true;
					}
					this.setup();
				},

				shuffleCards: function(cardsArray){
					this.$cards = $(this.shuffle(this.cardsArray));
				},

				setup: function(){
					this.html = this.buildHTML();
					this.$game.html(this.html);
					this.$memoryCards = $(".card");
					this.binding();
					this.paused = false;
					this.guess = null;
				},

				binding: function(){
					this.$memoryCards.on("click", this.cardClicked);
				},

				cardClicked: function(){
					var _ = Memory;
					var $card = $(this);
					if(!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
						$card.find(".inside").addClass("picked");
						if(!_.guess){
							_.guess = $(this).attr("data-id");
						} else if(_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")){
							$(".picked").addClass("matched");
							_.guess = null;
						} else {
							_.guess = null;
							_.paused = true;
							setTimeout(function(){
								$(".picked").removeClass("picked");
								Memory.paused = false;
							}, 600);
						}
						if($(".matched").length == $(".card").length){
							_.win();
						}
					}
				},

				win: function(){
					this.paused = true;
			//reset timer
			clearTimeout(t);

			//generating boards
			winningTime = parseInt((minutes * 60000) + (seconds * 1000) + milliseconds);
			inputArray();
			setBoard();
			generateBoard();

			//reset the value
			milliseconds = 0; seconds = 0; minutes = 0;
			runtime = false;
		},

		// Fisher--Yates Algorithm -- http://bost.ocks.org/mike/shuffle/
		shuffle: function(array){
			var counter = array.length, temp, index;
	   	// While there are elements in the array
	   	while (counter > 0) {
        	// Pick a random index
        	index = Math.floor(Math.random() * counter);
        	// Decrease counter by 1
        	counter--;
        	// And swap the last element with it
        	temp = array[counter];
        	array[counter] = array[index];
        	array[index] = temp;
        }
        return array;
    },

    buildHTML: function(){
    	var frag = '';
    	this.$cards.each(function(k, v){
    		frag += '<div class="card" data-id="'+ v.id +'"><div class="inside">\
    		<div class="front"><img src="'+ v.img +'"\
    		alt="'+ v.name +'" /></div>\
    		<div class="back"><img src="src/images/guess.png"\
    		alt="CGuess" /></div></div>\
    		</div>';
    	});
    	return frag;
    }
};

var cards = [
{
	name: "farmasi",
	img: "src/images/makara/farmasi.png",
	id: 1,
},
{
	name: "fasilkom",
	img: "src/images/makara/fasilkom.png",
	id: 2
},
{
	name: "fik",
	img: "src/images/makara/fik.png",
	id: 3
},
{
	name: "fisip",
	img: "src/images/makara/fisip.png",
	id: 4
}, 
{
	name: "fk",
	img: "src/images/makara/fk.png",
	id: 5
},
{
	name: "ft",
	img: "src/images/makara/ft.png",
	id: 6
},
{
	name: "fmipa",
	img: "src/images/makara/fmipa.png",
	id: 7
},
{
	name: "vokasi",
	img: "src/images/makara/vokasi.png",
	id: 8
},
];

Memory.init(cards);

})();
});
});