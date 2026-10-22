function Gameboard(){
    const board = [];

    for(let i = 0; i < 9; i++){
        board.push(Cell());
    }

    const getBoard = () => board;

    const markCell = (cell ,player) => {
        if(board[cell - 1].getValue() !== 0) return;

        board[cell - 1].mark(player);
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

    return {getBoard, markCell, printBoard, playerWon};
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
        board.markCell(column,getActivePlayer().token);

        if(board.playerWon(getActivePlayer())){
            console.log(`${getActivePlayer().name} has won the game`);
            board.printBoard();git 
        }else{
            switchPlayerTurn();
            printNewRound();  
        }



    }

    printNewRound();

    return {getActivePlayer, playRound, getBoard: board.getBoard};


}

const game = GameController();

