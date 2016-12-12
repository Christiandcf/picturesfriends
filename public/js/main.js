var socket = io.connect();

/*
 * Word Checker Generator
 */

// This are only the divisions
// var $firstPage = $('#firstPage');
// var $gameRoom = $('#gameRoom');
//
// var $answer = $('#answer'); // Input answer
// var $check = $('#check'); // Check button
// var $gen = $('#gen'); // Generate button
// var $playerType = $('#playerType'); // Just a checker
// var $randWord = $('#randWord'); // Generated word space
// var $drawerBtn = $('#drawerBtn'); // Toggles to become a drawer
// var $playerBtn = $('#playerBtn'); // Toggles to become a plyer
var status = 'player'; // true is drawer, false is player
var rand = 0;
var lives = 3; // total lives
var pickedWord = ''; // random word from the list
var generated = false; //checks that a words is already generated
var wordsList = ['banana', 'potato', 'chair', 'backpack', 'cigarrete', 'cellphone', 'shoes', 'windows', 'laptop', 'book', 'Trump', 'Venezuela', 'skateboard', 'headphones', 'math', 'vodka', 'pirate', 'television', 'hat', 'lamp']; // list of possible words

//cancels enter key
$(function() {
    $('form').submit(function() {
        return false;
    });
});

// Connecting for the first time
socket.on('connect', function() {
    $('#randWord').hide(); // Don't show the random word
    $('#gen').hide();
    socket.emit('startup', 'å'); // random room
});


//Choses if you want to be a drawer or player
$('#drawerBtn').click(function(e) {
    $('#playerType').text('Drawer');
    $('#answer').hide();
    $('#check').hide();
    $('#randWord').show();
    $('#gen').show();
    console.log('Drawer');
    status = 'drawer';
    socket.emit('hideDraw', '$drawerBtn');
});

socket.on('hideDraw', function(data) {
    console.log('Hiding ' + data);

    $('#drawerBtn').hide();
});

socket.on('showCanvas', function(data) {
    $('#drawing').show();
    $('#timer_div').show();
});

// If it's a drawer
// Picks a random word from the list only if it's a drawer
$('#gen').click(function(e) {
    if (status == 'drawer') {

        if (generated == false) {
            console.log('generating word...');
            rand = Math.floor(Math.random() * 20);
            pickedWord = wordsList[rand];
            $('#colors').show();
            socket.emit('reset', 'data');
            socket.emit('showCanvas', 'nothing');
            socket.emit('generated', pickedWord); // sends the word to the server
        } else {
            console.log('word already generated');
        }
    }
    return false;
});



socket.on('generated', function(word) { // gets picked up word from server
    if (generated == false) {
        pickedWord = word;
        console.log('word generated: ' + pickedWord);
        $('#randWord').text(pickedWord); // it does shows on both sides but it's not recognize to be checked in the one were is was not generated
        generated = true;
    }
});

// Checks if answer is correct

$('#check').click(function(e) {
    if ($('#answer').val() != '') {
        socket.emit('answered', $('#answer').val());
    }
    return false;
});

socket.on('answered', function(word, id) {
    var match = false;
    if (word.toLowerCase() == pickedWord.toLowerCase()) {
        match = true;
    } else {
        match = false;
        lives--;
    }
    $('#answer').val('');
    console.log(lives);

    // check lives & reset everything if lives is 0 and reset everything
    if (match == true || lives == 0) {
        if (match == true && lives != 0) { // Winning
            console.log('Winner is: ' + id); // Winning
            socket.emit('winning', 'data');
        } else if (match != true && lives == 0) { // Losing
            console.log('FATALITY');
        }

        $('#randWord').text('-');
        $('#answer').val('');
        lives = 3;
        generated = false;
    }
});



/*
 *    ROOMS
 */
function joinRoom(room) {
    $('#firstPage').hide();
    $('#gameRoom').show();
    $('#roomName').text('Current Room: ' + room);
}

$('#room1').click(function(e) {
    socket.emit('join', 'room1');
    joinRoom('Potato');
});

$('#room2').click(function(e) {
    socket.emit('join', 'room2');
    joinRoom('Lemon');
});

$('#room3').click(function(e) {
    socket.emit('join', 'room3');
    joinRoom('Carrot');
});

$('#room4').click(function(e) {
    socket.emit('join', 'room4');
    joinRoom('Banana');
});


/*
 * CANVAS
 */

document.addEventListener('DOMContentLoaded', function() {
    var mouse = {
        click: false,
        move: false,
        pos: {
            x: 0,
            y: 0
        },
        pos_prev: false
    };
    // get canvas element and create context
    var canvas = document.getElementById('drawing');
    var context = canvas.getContext('2d');
    var width = 500;
    var height = 500;
    //  var socket  = io.connect();



    // set canvas to full browser width/height
    canvas.width = width;
    canvas.height = height;

    // register mouse event handlers
    canvas.onmousedown = function(e) {
        mouse.click = true;
    };
    canvas.onmouseup = function(e) {
        mouse.click = false;
    };

    canvas.onmousemove = function(e) {
        // normalize mouse position to range 0.0 - 1.0
        mouse.pos.x = (e.clientX / width) - 0.94;
        mouse.pos.y = (e.clientY / height) - 0.34;
        mouse.move = true;
    };


    // main loop, running every 25ms
    function mainLoop() {
        // check if the user is drawing
        if (mouse.click && mouse.move && mouse.pos_prev) {
            // send line to to the server
            socket.emit('draw_line', {
                line: [mouse.pos, mouse.pos_prev]
            });
            mouse.move = false;
        }

        if (clearCanvas == true) {
            context.clearRect(0, 0, width, height);
            clearCanvas = false;
        }

        mouse.pos_prev = {
            x: mouse.pos.x,
            y: mouse.pos.y
        };
        setTimeout(mainLoop, 25);
    }
    mainLoop();

    // draw line received from server
    socket.on('draw_line', function(data) {
        console.log('In client');
        var line = data.line;
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        context.stroke();


    });

});

//Initially setting the stroke color to back
var color = 'black';
//Normal stroke width for drawing
var lineWidth = 2;
//Canvas is not yet to be cleared
var clearCanvas = false;

//Function handling eraser, set the stroke to white, increase the width of the stroke
function eraser() {
    color = 'white';
    lineWidth = 50;
}

socket.on('reset', function(data) {
    $('#gen').hide();

    setTimeout(function() {
        new Audio('../30secs.mp3').play();
    }, 700);

    clearCanvas = true;
    var seconds_left = 30;

    interval = setInterval(function() {

        document.getElementById('timer_div').innerHTML = --seconds_left;

        if (seconds_left <= 0) {
            $('#timer_div').text('Time is Up!');
            alert('Time is up! Click GO! for next word');
            clearCanvas = true;
            clearInterval(interval);
            $('#drawing').hide();
            $('#colors').hide();
            $('#randWord').hide();
            $('#check').hide();
            $('#answer').hide();
            $('#randWord').text('-');
            $('#drawerBtn').text('Become the Drawer');
            $('#drawerBtn').show();
            status = 'player';
            $('#playerType').text('Player');
            generated = false;

        }
    }, 1000);
});

socket.on('winning', function(data) {
  $('#timer_div').text('WINNER is: ' + data);
  alert('WINNER: ' + data);
  clearCanvas = true;
  clearInterval(interval);
  $('#drawing').hide();
  $('#colors').hide();
  $('#randWord').hide();
  $('#check').show();
  $('#answer').show();
  $('#randWord').text('-');
  $('#drawerBtn').text('Become the Drawer');
  $('#drawerBtn').show();
  status = 'player';
  $('#playerType').text('Player');
  generated = false;
});
