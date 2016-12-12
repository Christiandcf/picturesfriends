# Pictures with Friends
Pictures with Friends is a real time drawing multiplayer game which include a canvas as a form of communication. The client and server was handled by the Node.js environment along with the Socket.io library to handle the sockets connected to the server. The game was created implementing a canvas that uses socket.io and also room management, also made possible with socket.io

# Instructions
This application is not hosted in any cloud web service provided.

## Kickstart
  - Open a bash terminal or the Node.js cmd
  - Go to the project directory
  - Type the following command: "node index.js", this will start the server
  - If there is an error starting the server make sure there are no tabs open with "localhost:4000" as this can cause a crash in the server.
  - The port used was 4000, to log into the website open a browser and go to "localhost:4000"

## Draw
- Join a game: Click one of the rooms created.
- Be the Drawer: Press the Drawer button that enables you to be the Drawer.
- In the lobby, wait for your friend to join the game before clicking Generate.
- Once your friend has joined, click Generate to start the game.

## Guess
  - Once you have joined, wait until your friend clicked Generate for the game to start
  - Enter the correct answer before the time ends

# Important Files
  - index.html: Contains all the views hidden and displays the lobby
  - index.js: Server side of the application, receives and emits the random generated word, answer, drawings and times
  - main.js: Contains all the logic of the game, the word generation and the canvas drawing
