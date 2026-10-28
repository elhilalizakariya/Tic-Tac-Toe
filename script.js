function Gameboard(){
    const board = [];

    for(let i = 0; i < 9; i++){
        board.push(Cell());
    }

    const getBoard = () => board;

    const markCell = (cell ,player) => {
        if(board[cell - 1].getValue() !== 0) return false;

        board[cell - 1].mark(player);
        return true;
    }

    const printBoard = ()=>{
        for (let i = 0; i < board.length; i += 3) {
            console.log(board.map((cell)=> cell.getValue()).slice(i, i + 3).join(" "));
        }
    }


    const playerWon = (player)=> {
        const winningCombinations = [
            [0, 1, 2], // Top row
            [3, 4, 5], // Middle row
            [6, 7, 8], // Bottom row

            [0, 3, 6], // Left column
            [1, 4, 7], // Middle column
            [2, 5, 8], // Right column

            [0, 4, 8], // Diagonal
            [2, 4, 6]  // Diagonal
        ];

        for(const combination of winningCombinations){
            const [a,b,c] = combination;

            if(
                board[a].getValue() === player.token &&
                board[b].getValue() === player.token && 
                board[c].getValue() === player.token
            ){
                return true;
            }
        }

        return false;
    }

    const isTie = () => {
        for(const cell of board){
            if(cell.getValue() === 0)return false;
        }

        return true;
    }

    return {getBoard, markCell, printBoard, playerWon, isTie};
}

function Cell(){
    let value = 0;

    const getValue = () => value;
    const mark = (player) => {value = player};

    return {
        getValue,
        mark,
    }
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
){
    const board = Gameboard();
    const players= [
        {
            name: playerOneName,
            token:"X"
        },
        {name: playerTwoName,
            token:"O"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };



    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const playRound = (column) => {
        console.log(`checking column ${column} for ${getActivePlayer().name}`);
        const mark = board.markCell(column,getActivePlayer().token);

        if(board.playerWon(getActivePlayer())){
            console.log(`${getActivePlayer().name} has won the game`);
            board.printBoard();
            return "won";

        }else if(board.isTie()){
            console.log("The game is a tie");
            board.printBoard();
            return "tie";
        }else{
            if(mark === true){
                switchPlayerTurn();
            }
                printNewRound();  
                return "continue";


        }



    }

    printNewRound();

    return {getActivePlayer, playRound, getBoard: board.getBoard};


}

function displayController(){
    const game = GameController();
    let isGameOver = false;

    const activePlayerDiv = document.querySelector(".activePlayer");

    const printNewRound = () => {
        activePlayerDiv.textContent =`${game.getActivePlayer().name}'s Turn` ;
        printBoard();
    }



    const printBoard = ()=>{
        const displayBoard = document.querySelector(".game-container");
        const board = game.getBoard();
        for(let i = 0; i< board.length;i++){
            const box = displayBoard.querySelector(`#b${i}`);
            if(board[i].getValue() === "X"){
                box.innerHTML = "X";
            }else if (board[i].getValue() === "O"){
                box.innerHTML = "O";
            }
        }
    }

    const addMark = ()=>{
        const boxes = document.querySelectorAll(".box");
        for(let i = 0;i<boxes.length;i++){
            boxes[i].addEventListener('click', (event)=>{
                if(isGameOver == true)return
                const result = game.playRound(i+1);
                if(result === 'won'){
                    isGameOver = true;
                    printBoard();
                    activePlayerDiv.textContent = `${game.getActivePlayer().name} Has Won` ;
                }else if(result === "tie"){
                    isGameOver = true;
                    printBoard()
                    activePlayerDiv.textContent = `The Game is a Tie` ;
                }else if (result ==="continue"){
                    printNewRound();
                }
                
            })
        }
    }

    addMark();
    printNewRound();
    
    return {printNewRound,printBoard,playRound : game.playRound}
}

const game = displayController();

game.printBoard();




