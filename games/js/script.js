$(document).ready(function () {

    (function ($) {
        "use strict";

        // jQuery for page scrolling feature - requires jQuery Easing plugin
        $('a.page-scroll').bind('click', function (event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: ($($anchor.attr('href')).offset().top - 50)
            }, 1250, 'easeInOutExpo');
            event.preventDefault();
        });

        // Highlight the top nav as scrolling occurs
        $('body').scrollspy({
            target: '.navbar-fixed-top',
            offset: 51
        });

        // Closes the Responsive Menu on Menu Item Click
        $('.navbar-collapse ul li a').click(function () {
            $('.navbar-toggle:visible').click();
        });

        // Offset for Main Navigation
        $('#mainNav').affix({
            offset: {
                top: 100
            }
        });

    })(jQuery);

//***************************************************************************************
//***********************************Picture Puzzle logics*******************************
    /*global createjs */
    /*jshint esversion: 6 */
//     alert("ready");
    //image size 1500*900
    const PUZZLE_COLUMNS = 5;
    const PUZZLE_ROWS = 3;
    const PUZZLE_SIZE = 300;

    var stage;
    var pieces = [];
    var selectedPieces = [];
    init();
    function init() {
        stage = new createjs.Stage(document.getElementById('canvas'));
        //console.log(stage);
        buildPuzzle();
        startGame();
        setTimeout(shufflePuzzle, 2000);
    }

    function buildPuzzle() {
        var i, piece;
        var l = PUZZLE_COLUMNS * PUZZLE_ROWS;
        var col = 0;
        var row = 0;
        for (i = 0; i < l; i++) {
            piece = new createjs.Bitmap('img/nycda.jpg');// A Bitmap can be instantiated using an existing HTML element.
             //console.log(piece);
            //a rectangle as defined by the points Rectangle(x, y, x+width, y+height).
            piece.sourceRect = new createjs.Rectangle(col * PUZZLE_SIZE, row * PUZZLE_SIZE, PUZZLE_SIZE, PUZZLE_SIZE);
            piece.homePoint = {x: col * PUZZLE_SIZE, y: row * PUZZLE_SIZE};
            console.log(piece.sourceRect);
            console.log(piece.homePoint);
            piece.x = piece.homePoint.x;
            console.log("i="+i+" => piece.x = "+piece.x);
            piece.y = piece.homePoint.y;
            console.log("i="+i+" => piece.y = "+piece.y);
            // console.log("******************************");
            stage.addChild(piece);
            pieces[i] = piece;
            col++;
            if (col === PUZZLE_COLUMNS) {
                col = 0;
                row++;
                // console.log("row "+row+" -----------------");

            }
        }
    }

    function shufflePuzzle() {
        var i, piece, randomIndex;
        var col = 0;
        var row = 0;
        var p = [];
        p = p.concat(pieces);
        var l = p.length;
        for (i = 0; i < l; i++) {
            randomIndex = Math.floor(Math.random() * p.length);
            piece = p[randomIndex];
            // console.log(piece);
            // console.log(randomIndex);
            p.splice(randomIndex, 1);
            createjs.Tween.get(piece).to({x: col * PUZZLE_SIZE, y: row * PUZZLE_SIZE}, 200);
            piece.addEventListener('click', onPieceClick);
            col++;
            if (col === PUZZLE_COLUMNS) {
                col = 0;
                row++;
            }
        }
    }

    function onPieceClick(e) {
        if (selectedPieces === 2) {
            return;
        }
        var piece = e.target;
        var matrix = new createjs.ColorMatrix().adjustColor(15, 10, 100, 180);//adjustColor(brightness, contrast, saturation, hue)
        piece.filters = [
            new createjs.ColorMatrixFilter(matrix)
        ];
        piece.cache(0, 0, PUZZLE_SIZE, PUZZLE_SIZE);
        selectedPieces.push(piece);
        if (selectedPieces.length === 2) {
            swapPieces();
        }
    }

    function swapPieces() {
        var piece1 = selectedPieces[0];
        var piece2 = selectedPieces[1];
        createjs.Tween.get(piece1).wait(300).to({x: piece2.x, y: piece2.y}, 200);
        createjs.Tween.get(piece2).wait(300).to({x: piece1.x, y: piece1.y}, 200).call(function () {
            setTimeout(evalPuzzle, 200);
        });
    }

    function evalPuzzle() {
        var win = true;
        var i, piece;
        selectedPieces[0].uncache();
        selectedPieces[1].uncache();
        for (i = 0; i < pieces.length; i++) {
            piece = pieces[i];
            if (piece.x !== piece.homePoint.x || piece.y !== piece.homePoint.y) {
                win = false;
                break;
            }
        }
        if (win) {
            setTimeout(function () {
                alert('Nice Work, Shuffle the Puzzle Again if you have NOTHING to do!');
            }, 200);
        }
        else {
            selectedPieces = [];
        }
    }

    function startGame() {
        createjs.Ticker.addEventListener("tick", function () {
            stage.update();
        });
        createjs.Ticker.setFPS(60); //setInterval()
    }

    //Shuffle the puzzle
    $("#shuffleBtn").on("click", function () {
        // e.preventDefault();
        shufflePuzzle();
    });
    //*****************************************************************************
    //*******************************Card Game Logics******************************

    // console.log("Card game start hier");
    //a global object to hold all global vars related to the game
    var matchingGame = {};

    //all possible values for each card
    matchingGame.deck = [
        'cardAK', 'cardAK',
        'cardAQ', 'cardAQ',
        'cardAJ', 'cardAJ',
        'cardBK', 'cardBK',
        'cardBQ', 'cardBQ',
        'cardBJ', 'cardBJ'
    ];

    $(function () {
        //shuffling the deck
        matchingGame.deck.sort(shuffle);
        //console.log(matchingGame.deck.sort(shuffle)); //working with every refresh i get different array.

        //clone 12 copies of the cards
        for (var i = 0; i < 11; i++) {
            $(".card:first-child").clone().appendTo("#cards");
        }

        // initialize each card
        $("#cards").children().each(function (index) {
            // align the cards to be 4x4 ourselves.
            $(this).css({
                "left": ($(this).width() + 20) * (index % 4),
                "top" : ($(this).height() + 20) * Math.floor(index / 4)
            });

            // get a pattern from the shuffled deck
            var pattern = matchingGame.deck.pop();

            // visually apply the pattern on the card's back side.
            // the pattern value is actually a CSS class with the
            // corrisponding playing card graphic.
            $(this).find(".back").addClass(pattern);

            // embed the pattern data into the DOM element.
            $(this).data("pattern", pattern);

            // listen the click event on each card DIV element.
            $(this).click(selectCard);
        });

        // reset the elapsed time to 0.
        matchingGame.elapsedTime = 0;

        // start the timer
        matchingGame.timer = setInterval(countTimer, 1000);
    });

// execute every second to count the elapsed time
    function countTimer() {

        matchingGame.elapsedTime++;

        // calculate the minutes and seconds from elapsed time
        var minute = Math.floor(matchingGame.elapsedTime / 60);
        var second = matchingGame.elapsedTime % 60;

        // add padding 0 if minute and second is less then 10
        if (minute < 10) minute = "0" + minute;
        if (second < 10) second = "0" + second;

        // display the elapsed time
        $("#elapsed-time").html(minute + ":" + second);
    }

    function selectCard() {
        // we do nothing if there are already two card flipped.
        if ($(".card-flipped").size() > 1) {
            return;
        }

        // add the class "card-flipped".
        // the browser will animate the styles between current state and card-flipped state.
        $(this).addClass("card-flipped");

        // check the pattern of both flipped card 0.7s later.
        if ($(".card-flipped").size() === 2) {
            setTimeout(checkPattern, 700);
        }
    }

// a function that will  return a random number between -0.5 to 0.5
    function shuffle() {
        // returning a random number in sort function.
        // the sort function determine by eiter possitive number and negative number.
        // Math.random() range from 0 - 1, 0.5 - Math.random() results eiter possitive or negative number.
        return 0.5 - Math.random();
    }

// a function to do action when both cards match
    function checkPattern() {
        if (isMatchPattern()) {
            $(".card-flipped").removeClass("card-flipped").addClass("card-removed");

            // delete the card DOM node after the transition finished.
            $(".card-removed").bind("webkitTransitionEnd", removeTookCards);
        }
        else {
            $(".card-flipped").removeClass("card-flipped");
        }
    }

// a function to delete all removed cards
    function removeTookCards() {
        $(".card-removed").remove();

        // check if all cards are removed and show game over
        if ($(".card").length === 0) {
            gameover();
        }

    }

// a function to check if the flipped card match the pattern.
    function isMatchPattern() {
        var cards = $(".card-flipped");
        var pattern = $(cards[0]).data("pattern");
        var anotherPattern = $(cards[1]).data("pattern");
        return (pattern === anotherPattern);
    }


    function gameover() {
        // stop the timer
        clearInterval(matchingGame.timer);

        // display the elapsed time in the game over popup
        $(".score").html($("#elapsed-time").html());

        // load the saved last score and save time from local storage
        var lastScore = localStorage.getItem("last-score");

        // check if there is no any saved record
        lastScoreObj = JSON.parse(lastScore);
        if (lastScoreObj === null) {
            // create an empty record if there is no any saved record
            lastScoreObj = {"savedTime": "no record", "score": 0};
        }
        var lastElapsedTime = lastScoreObj.score;

        // convert the elapsed seconds into minute:second format
        // calculate the minutes and seconds from elapsed time
        var minute = Math.floor(lastElapsedTime / 60);
        var second = lastElapsedTime % 60;

        // add padding 0 if minute and second is less then 10
        if (minute < 10) minute = "0" + minute;
        if (second < 10) second = "0" + second;

        // display the last elapsed time in game over popup
        $(".last-score").html(minute + ":" + second);

        // display the saved time of last score
        var savedTime = lastScoreObj.savedTime;
        $(".saved-time").html(savedTime);

        // get the current datetime
        var currentTime = new Date();
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        // add padding 0 to minutes
        if (minutes < 10) minutes = "0" + minutes;
        var seconds = currentTime.getSeconds();
        // add padding 0 to seconds
        if (seconds < 10) seconds = "0" + seconds;

        var now = day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;

        //construct the object of datetime and game score
        var obj = {"savedTime": now, "score": matchingGame.elapsedTime};

        // save the score into local storage
        localStorage.setItem("last-score", JSON.stringify(obj));

        // show the game over popup
        $("#popup").removeClass("hide");
    }


});