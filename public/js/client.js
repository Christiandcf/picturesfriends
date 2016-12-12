document.addEventListener("DOMContentLoaded", function() {
   var mouse = {
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };
   // get canvas element and create context
   var canvas  = document.getElementById('drawing');
   var context = canvas.getContext('2d');
   var width   = 500;
   var height  = 500;
   var socket  = io.connect();



   // set canvas to full browser width/height
   canvas.width = width;
   canvas.height = height;

   // register mouse event handlers
   canvas.onmousedown = function(e){ mouse.click = true; };
   canvas.onmouseup = function(e){ mouse.click = false; };

   canvas.onmousemove = function(e) {
      // normalize mouse position to range 0.0 - 1.0
      mouse.pos.x = (e.clientX / width) - 0.94;
      mouse.pos.y = (e.clientY / height) - 0.34;
      mouse.move = true;
      // console.log("X : "+mouse.pos.x);
      // console.log("Y : "+mouse.pos.y);

      //range y = 0.3 ... 0.75
      //range x = 0 ... 1

   };


   // main loop, running every 25ms
   function mainLoop() {
      // check if the user is drawing
      if (mouse.click && mouse.move && mouse.pos_prev) {
         // send line to to the server
         socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ] });
         mouse.move = false;
      }

      if(clearCanvas == true)
      {
         context.clearRect(0, 0, width, height);
         clearCanvas = false;
      }

      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      setTimeout(mainLoop, 25);
   }
   mainLoop();

   // draw line received from server
 socket.on('draw_line', function (data) {
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

   //Jquery stuffs, mainly for hide and shows
 $(document).ready(function(){

      $("#drawing").hide();
      $("#colors").hide();
      $("#timer_div").hide();

    $("#generate").click(function(){
        $("#drawing").show();
        $("#colors").show();
        $("#timer_div").show();
    });

});
      //Initially setting the stroke color to back
      var color = 'black';
      //Normal stroke width for drawing
      var lineWidth = 1;
      //Canvas is not yet to be cleared
      var clearCanvas = false;

      //Function to handle stroke color change
      function changeColor(newColor){
         lineWidth = 1;
         color = newColor;
      }

      //Function handling eraser, set the stroke to white, increase the width of the stroke
      function eraser(){
         color = 'white';
         lineWidth = 50;
      }

      //This function handles:
      //1) Playing background stopwatch sound
      //2) Clearing the canvas after the timer is up
      //3) Counting the stopwatch
      function clearFunction(){
          $("#generate").hide();

         setTimeout(function () {
         new Audio('../30secs.mp3').play();
      }, 700);

         clearCanvas = true;
         var seconds_left = 30;

         var interval = setInterval(function(){

         document.getElementById('timer_div').innerHTML = --seconds_left;

         if (seconds_left <= 0)
            {
                  document.getElementById('timer_div').innerHTML = "Time is Up!";
                  alert("Time is up! Click GO! for next word");
                  clearCanvas = true;
                  clearInterval(interval);
                  $("#drawing").hide();
                  $("#colors").hide();
                  $("#generate").show();

            }
         }, 1000);

      }
