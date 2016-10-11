function init() {
	document.getElementById("uname").innerHTML = "Username: " + sessionStorage.username;
}

$(document).ready(function(){
	var h3 = document.getElementsByTagName('h3')[0],
	start = document.getElementById('startid'),
	stop = document.getElementById('stop'),
	clear = document.getElementById('clear'),
	milliseconds = 0, minutes = 0, hours = 0,
	t;

	$("#startgame").click(function(){
		(function(){
			if(milliseconds == 0)
				timer();

			function add() {
				milliseconds++;
				if (milliseconds >= 100) {
					milliseconds = 0;
					minutes++;
					if (minutes >= 60) {
						minutes = 0;
						hours++;
					}
				}

				h3.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (milliseconds > 9 ? milliseconds : "0" + milliseconds);

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
					this.shuffleCards(this.cardsArray);
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
		// kinda messy but hey
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
			setTimeout(function(){
				Memory.showModal();
				Memory.$game.fadeOut();
			}, 1000);
			clearTimeout(t);
			milliseconds = 0; minutes = 0; hours = 0;
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
    		alt="Codepen" /></div></div>\
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


function updateStats(){
	$('#stats').html('<div class="padded"><h2>Figures: <span>'+
		'<b>'+get('flip_won')+'</b><i>Won</i>'+
		'<b>'+get('flip_lost')+'</b><i>Lost</i>'+
		'<b>'+get('flip_abandoned')+'</b><i>Abandoned</i></span></h2>'+
		'<ul><li><b>Best Casual:</b> <span>'+toTime( get('flip_casual') )+'</span></li>'+
		'<li><b>Best Medium:</b> <span>'+toTime( get('flip_medium') )+'</span></li>'+
		'<li><b>Best Hard:</b> <span>'+toTime( get('flip_hard') )+'</span></li></ul>'+
		'<ul><li><b>Total Flips:</b> <span>'+parseInt( ( parseInt(get('flip_matched')) + parseInt(get('flip_wrong')) ) * 2)+'</span></li>'+
		'<li><b>Matched Flips:</b> <span>'+get('flip_matched')+'</span></li>'+
		'<li><b>Wrong Flips:</b> <span>'+get('flip_wrong')+'</span></li></ul></div>');
};

})();
});
});

/*
stop.onclick = function() {
	clearTimeout(t);
}


clear.onclick = function() {
	h3.textContent = "00:00:00";
	milliseconds = 0; minutes = 0; hours = 0;
}*/