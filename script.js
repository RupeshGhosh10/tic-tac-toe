const Player = () => {

    let turn = false;
    let symbol = null;

    const isTurn = () => {
        return turn;
    }
    const toggleTurn = () => {
        turn = !turn;
    }
    const setSymbol = (temp) => {
        symbol = temp;
    }
    const getSymbol = () => {
        return symbol
    }

    return {
        getSymbol,
        setSymbol,
        isTurn,
        toggleTurn
    }
}

const humanPlayer = Player();
const aiPlayer = Player();
let gameOver = false;

buttonX = document.querySelector('#X');
buttonO = document.querySelector('#O');

let board = ['', '', '', '', '', '', '', '', ''];

buttonX.addEventListener('click', () => {
    humanPlayer.setSymbol('X');
    aiPlayer.setSymbol('O');
    humanPlayer.toggleTurn();
    drawBoard();
    removeNode('#select');
    createResetBtn();
});

buttonO.addEventListener('click', () => {
    humanPlayer.setSymbol('O');
    aiPlayer.setSymbol('X');
    aiPlayer.toggleTurn();
    drawBoard();
    removeNode('#select');
    createResetBtn();
});

const drawBoard = () => {

    const gameBoard = createNode('div');
    gameBoard.classList.add('game-board');

    board.forEach((e, i) => {

        let div = document.createElement('div');
        div.id = `${i}`;
        div.classList.add('box');
        div.innerHTML = board[i];

        div.addEventListener('click', () => {
            
            if (!gameOver) {
                if (div.innerHTML !== '') {
                    return;
                }
                if (humanPlayer.isTurn()) {
                    board[div.id] = humanPlayer.getSymbol();
                    render();
                    humanPlayer.toggleTurn();
                    aiPlayer.toggleTurn();
                    if (checkWinner(humanPlayer.getSymbol())) {
                        gameOver = true;
                        return;
                    }
                    playAiTurn();
                }
            }
            console.log(gameOver);
        });

        gameBoard.appendChild(div);
    });

    if (aiPlayer.isTurn()) {
        playAiTurn();
    }
}

const render = () => {
    board.forEach((e, i) => {
        if (e !== '') {
            const div = document.getElementById(`${i}`);
            div.innerHTML = e;
            div.classList.add('invalid-box');
        }
    });
}

const playAiTurn = () => {
    let index = selectMiniMax();
    board[index] = aiPlayer.getSymbol();
    render();
    aiPlayer.toggleTurn();
    humanPlayer.toggleTurn();
    if (checkWinner(aiPlayer.getSymbol())) {
        gameOver = true;
        return;
    }
}

const selectMiniMax = () => {

    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = aiPlayer.getSymbol();
            let score = minimax(board, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

const minimax = (board, isMax) => {

    let result = getScore();
    if (result !== null) {
        return result;
    }

    if (isMax) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = aiPlayer.getSymbol();
                let score = minimax(board, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = humanPlayer.getSymbol();
                let score = minimax(board, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

const getScore = () => {

    const check = (i, j, k, symbol) => {
        return (board[i] === symbol && board[j] === symbol && board[k] === symbol);
    }
    if (check(0, 1, 2, humanPlayer.getSymbol()) || check(3, 4, 5, humanPlayer.getSymbol()) || check(6, 7, 8, humanPlayer.getSymbol()) || check(0, 3, 6, humanPlayer.getSymbol()) || check(1, 4, 7, humanPlayer.getSymbol()) || check(2, 5, 8, humanPlayer.getSymbol()) || check(0, 4, 8, humanPlayer.getSymbol()) || check(2, 4, 6, humanPlayer.getSymbol())) {
        return -1;
    } else if (check(0, 1, 2, aiPlayer.getSymbol()) || check(3, 4, 5, aiPlayer.getSymbol()) || check(6, 7, 8, aiPlayer.getSymbol()) || check(0, 3, 6, aiPlayer.getSymbol()) || check(1, 4, 7, aiPlayer.getSymbol()) || check(2, 5, 8, aiPlayer.getSymbol()) || check(0, 4, 8, aiPlayer.getSymbol()) || check(2, 4, 6, aiPlayer.getSymbol())) {
        return 1;
    }

    if (board.includes('') === false) {
        return 0;
    }

    return null;
}

const checkWinner = (symbol) => {

    const check = (i, j, k) => {
        return (board[i] === symbol && board[j] === symbol && board[k] === symbol);
    }
    const draw = () => {
        for (let i = 0; i <= 8; i++) {
            if (board[i] === '') {
                return false;
            }
        }
        return true;
    }

    const createWindow = (message) => {
        const winnerWindow = createNode('div');
        winnerWindow.innerHTML = message;
        winnerWindow.classList.add('winner')
        removeNode('.reset-btn-window');
        createResetBtn();
    }

    if (check(0, 1, 2) || check(3, 4, 5) || check(6, 7, 8) || check(0, 3, 6) || check(1, 4, 7) || check(2, 5, 8) || check(0, 4, 8) || check(2, 4, 6)) {
        if (symbol === humanPlayer.getSymbol()) {
            createWindow('You Won');
        } else {
            createWindow('You Lost');
        }
        return true;
    }

    if (draw()) {
        createWindow('Draw');
        return true;
    }

    return false;
}

const createResetBtn = () => {
    const btnWindow = createNode('div');
    const btn = document.createElement('button');
    btn.innerHTML = 'Reset';
    btnWindow.appendChild(btn);
    btnWindow.classList.add('reset-btn-window');
    btn.classList.add('reset-btn');
    btn.addEventListener('click', () => {
        location.reload(true);
    });
}

const removeNode = (nodeId) => {
    const node = document.querySelector(nodeId);
    node.parentNode.removeChild(node);
}

const createNode = (tag) => {
    const node = document.createElement(tag);
    document.querySelector('body').appendChild(node);
    return node;
}