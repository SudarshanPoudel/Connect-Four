let container = document.querySelector(".main-grid");

// Initial state of board
let board = [
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '']
]

// Some useful variables
let turn = "red"
let isGameOver = false;
let isSinglePlayer = true;
let maxDepth = 5

// Initial screen script to select GameMode as single or multi player
let modeBtns = document.querySelectorAll('.gameMode');
let blackBg = document.querySelector('.bg-black');
let popUp = document.querySelector('.popup');

modeBtns[0].addEventListener('click', ()=>{
    isSinglePlayer = false;
    popUp.style.left = "145%"
    blackBg.style.display = "none"
})
modeBtns[1].addEventListener('click', ()=>{
    isSinglePlayer = true;
    popUp.style.left = "145%"
    blackBg.style.display = "none"
})

let arrows = document.querySelectorAll('.selection-box')
for(let i = 0; i < 7; i++){
    arrows[i].addEventListener('click', ()=>{
        arrowClicked(i);
    })
}


// Function that generate and displays our board
displayBoard();
function displayBoard(){
    container.innerHTML = ""  //Reset container
    for (let i = 0; i < 6; i++) {
        for(let j = 0; j < 7; j++){
            // Create boxes, give them class name to apply CSS, Value inside box from board
            let box = document.createElement("div"); 
            box.classList = ['box'];
            box.style.backgroundColor = board[i][j]
            box.addEventListener('click', ()=>{
                arrowClicked(j)
            })
            container.appendChild(box) //Append created box to container
        }
    }
}


// // Function that is called when someone clicks the arrow (either user clicking it directly or AI doing it virtually)
function arrowClicked(index){  //i and j are cordinates of the box clicked in container
    if(!isGameOver){ 
        for(let i = 5; i >= 0; i--){
            if(board[i][index] === ''){
                board[i][index] = turn
                switchTurn();
                checkResult(board);
                displayBoard();
                if(checkResult(board) != null) displayResults();
                break
            }
        }

    }
}

// // Function that switch turn of O and X when called
function switchTurn(){
    if(turn === "red"){
        turn = "blue"
        document.querySelector(".bg").style.left = "85px"

        //If it is single player, when switched to 'O''s turn it calles computerChoice function after 0.5 sec timeout
        if(isSinglePlayer){
            setTimeout(computerChoice, 500)
        }
    }
    else{
        turn = "red"
        document.querySelector(".bg").style.left = "0"
    }
}

// //Function to check result of Board, returns 1 if 'X' wins, -1 if 'O' wins, 0 if draw and null if noone won
function checkResult(board, displyBoxes = false) {
    // Check for horizontal win
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col] !== '' &&
          board[row][col] === board[row][col + 1] &&
          board[row][col] === board[row][col + 2] &&
          board[row][col] === board[row][col + 3]
        ) {
           if(displyBoxes) addBorderToBox([[row, col], [row, col + 1], [row, col + 2],[row, col + 3]])
          return (board[row][col] === 'red') ? 1 : -1;
        }
      }
    }
  
    // Check for vertical win
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 7; col++) {
        if (
          board[row][col] !== '' &&
          board[row][col] === board[row + 1][col] &&
          board[row][col] === board[row + 2][col] &&
          board[row][col] === board[row + 3][col]
        ) {
            if(displyBoxes) addBorderToBox([[row, col], [row + 1, col], [row + 2, col],[row +3, col]])
            return (board[row][col] === 'red') ? 1 : -1;
        }
      }
    }
  
    // Check for diagonal win (bottom-left to top-right)
    for (let row = 3; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col] !== '' &&
          board[row][col] === board[row - 1][col + 1] &&
          board[row][col] === board[row - 2][col + 2] &&
          board[row][col] === board[row - 3][col + 3]
        ) {
            if(displyBoxes) addBorderToBox([[row, col], [row - 1, col + 1], [row - 2, col + 2],[row - 3, col + 3]])
            return (board[row][col] === 'red') ? 1 : -1;
        }
      }
    }
  
    // Check for diagonal win (top-left to bottom-right)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col] !== '' &&
          board[row][col] === board[row + 1][col + 1] &&
          board[row][col] === board[row + 2][col + 2] &&
          board[row][col] === board[row + 3][col + 3]
        ) {
            if(displyBoxes) addBorderToBox([[row, col], [row + 1, col + 1], [row + 2, col + 2],[row + 3, col + 3]])
            return (board[row][col] === 'red') ? 1 : -1;
        }
      }
    }
    
    let isdraw = true;
    for(let row = 0; row < 6; row++){
        for(let col = 0; col < 7; col++){
            if(board[row][col] === ''){
                isdraw = false
                break
            }
        }
    }
    if(isdraw) return 0;

    return null
}
  
function addBorderToBox(winBox){
    let box = document.querySelectorAll('.box')
    winBox.forEach(e => {
        box[e[0] * 7 + e[1]].style.border = '5px solid #fff'
    });

}

// //Function to actually display the results
function displayResults(){
    if(checkResult(board) == 0) document.querySelector("#result").innerHTML = "Draw";
    else if(checkResult(board, displyBoxes = true) == 1) document.querySelector("#result").innerHTML = "Red won";
    else document.querySelector("#result").innerHTML = "Blue won"

    document.querySelector("#play-again").style.display = "inline";
    isGameOver = true;
}


// Minimax Algorithm starts here
//Function thats called when its turn for Computer to make choice
function computerChoice(){
    let bestValue = Infinity; //Since 'blue' is minimizing Player
    let bestMove;
    for(let i = 0; i < 7; i++){
        isSpotAvilable = false
        let j;
        for(j = 5; j >= 0; j--){
            if(board[j][i] === ''){
                board[j][i] = 'blue'
                isSpotAvilable = true
                break
            }
        }
        if(isSpotAvilable){
            let value = minimax(board, 0, true);
            board[j][i] = '' //Undo prev. move

            if(value < bestValue){
                bestValue = value;
                bestMove = i; //Save current move as best move if new score is less than prev.
            }
        }

    }

    arrowClicked(bestMove) //AI Clicks the best Option among all available
}


//Minimax Function
function minimax(board, depth, isMaximizing){
    //If Game is over returns same value returned by checkResult function
    if(checkResult(board) != null){
        return checkResult(board);
    }
    if(depth >= maxDepth){
        return 0;
    }

    //Similar as computerChoice function, Calls this function recursively for each possible moves while changing turns till it returns solid value of result.
    if(isMaximizing){
        
        let bestValue = -Infinity; //Since 'red' is minimizing Player
        for(let i = 0; i < 7; i++){
            isSpotAvilable = false
            let j;
            for(j = 5; j >= 0; j--){
                if(board[j][i] === ''){
                    board[j][i] = 'red'
                    isSpotAvilable = true
                    break
                }
            }
            if(isSpotAvilable){
                let value = minimax(board, depth + 1, false);
                board[j][i] = '' //Undo prev. move

                if(value > bestValue){
                    bestValue = value;
                }
            }
        }
        return bestValue;
    }
    else{
        let bestValue = Infinity; //Since 'blue' is minimizing Player
        for(let i = 0; i < 7; i++){
            isSpotAvilable = false
            let j;
            for(j = 5; j >= 0; j--){
                if(board[j][i] === ''){
                    board[j][i] = 'blue'
                    isSpotAvilable = true
                    break
                }
            }
            if(isSpotAvilable){
                let value = minimax(board, depth + 1, true);
                board[j][i] = '' //Undo prev. move

                if(value < bestValue){
                    bestValue = value;
                }
            }

        }
        return bestValue;
    }
}

// //restart the game
document.querySelector("#play-again").addEventListener("click", ()=>{
    isGameOver = false;
    turn = "red"
    document.querySelector(".bg").style.left = "0"
    document.querySelector("#result").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";
    board = [
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '']
    ]
    displayBoard();
})