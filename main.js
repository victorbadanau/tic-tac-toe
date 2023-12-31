const gameBoard = document.querySelector(".game-board");
const restart = document.querySelector(".restart");
const tokenSelector = document.getElementById("token-selector");
const levelSelector = document.querySelector("#difficulty");

const documentHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
};
window.addEventListener("resize", documentHeight);
documentHeight();

function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  function getBoard() {
    return board;
  }

  function placeToken(row, column, player) {
    if (board[row][column].getValue() !== "") return;
    board[row][column].addToken(player);
  }

  function reset() {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        board[i][j].addToken("");
      }
    }
  }
  return { getBoard, placeToken, reset };
}

function Cell() {
  let value = "";

  function addToken(player) {
    value = player;
  }

  function getValue() {
    return value;
  }

  return { addToken, getValue };
}

function GameController() {
  const gameBoard = GameBoard();

  function getToken() {
    let token = document.querySelector("#token-selector").value;
    if (token === "x") return ["x", "o"];
    return ["o", "x"];
  }

  function winning(board, player) {
    if (
      (board[0] == player && board[1] == player && board[2] == player) ||
      (board[3] == player && board[4] == player && board[5] == player) ||
      (board[6] == player && board[7] == player && board[8] == player) ||
      (board[0] == player && board[3] == player && board[6] == player) ||
      (board[1] == player && board[4] == player && board[7] == player) ||
      (board[2] == player && board[5] == player && board[8] == player) ||
      (board[0] == player && board[4] == player && board[8] == player) ||
      (board[2] == player && board[4] == player && board[6] == player)
    ) {
      return true;
    } else {
      return false;
    }
  }

  function getCurrentBoard(board) {
    let emptyRows = [];
    let emptyColumns = [];
    let gameBoard = [];
    let emptyCellIndexes = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j].getValue() === "") {
          emptyRows.push(i);
          emptyColumns.push(j);
          emptyCellIndexes.push(3 * i + j);
          gameBoard.push(3 * i + j);
        } else {
          gameBoard.push(board[i][j].getValue());
        }
      }
    }
    return [emptyRows, emptyColumns, emptyCellIndexes, gameBoard];
  }

  function getRows(board, player) {
    let rows = [[], [], []];
    let index = [[], [], []];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j].getValue() === player) {
          rows[i].push(player);
        }
        if (board[i][j].getValue() == "") {
          index[i].push(i);
          index[i].push(j);
        }
      }
    }
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].length == 2 && index[i].length == 2) {
        return [true, index[i][0], index[i][1]];
      }
    }
    return [false];
  }

  function transpose(matrix) {
    return matrix.map((value, column) => matrix.map((row) => row[column]));
  }

  function getColumns(board, player) {
    let newBoard = transpose(board);
    let columns = [[], [], []];
    let index = [[], [], []];
    for (let i = 0; i < newBoard.length; i++) {
      for (let j = 0; j < newBoard.length; j++) {
        if (newBoard[i][j].getValue() === player) {
          columns[i].push(player);
        }
        if (newBoard[i][j].getValue() == "") {
          index[i].push(j);
          index[i].push(i);
        }
      }
    }
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].length == 2 && index[i].length == 2) {
        return [true, index[i][0], index[i][1]];
      }
    }
    return [false];
  }

  function getDiagonals(board, player) {
    let newBoard = [
      [board[0][0], board[1][1], board[2][2]],
      [board[2][0], board[1][1], board[0][2]],
    ];
    let diagonals = [[], []];
    let index = [[], []];
    for (let i = 0; i < newBoard.length; i++) {
      for (let j = 0; j < newBoard[i].length; j++) {
        if (newBoard[i][j].getValue() === player) {
          diagonals[i].push(player);
        }
        if (
          (newBoard[i][j].getValue() == "" && i == 0) ||
          (newBoard[i][j].getValue() == "" && i == 1 && j == 1)
        ) {
          index[i].push(j);
          index[i].push(j);
        } else if (newBoard[i][j].getValue() == "" && i == 1 && j == 0) {
          index[i].push(2);
          index[i].push(j);
        } else if (newBoard[i][j].getValue() == "" && i == 1 && j == 2) {
          index[i].push(0);
          index[i].push(j);
        }
      }
    }
    for (let i = 0; i < diagonals.length; i++) {
      if (diagonals[i].length == 2 && index[i].length == 2) {
        return [true, index[i][0], index[i][1]];
      }
    }
    return [false];
  }

  function computerChoice(board) {
    const level = document.querySelector("#difficulty").value;
    const matrix = [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ];
    let currentBoard = getCurrentBoard(board);
    let boardArray = currentBoard[3];
    let human = getToken()[0];
    let computer = getToken()[1];
    let row = getRows(board, human);
    let column = getColumns(board, human);
    let diagonal = getDiagonals(board, human);
    let cRow = getRows(board, computer);
    let cColumn = getColumns(board, computer);
    let cDiagonal = getDiagonals(board, computer);
    let rowIndex;
    let columnIndex;
    if (level == "easy") {
      let randomCell = Math.floor(Math.random() * currentBoard[0].length);
      rowIndex = currentBoard[0][randomCell];
      columnIndex = currentBoard[1][randomCell];
    } else if (level == "medium") {
      if (row[0] == true) {
        rowIndex = row[1];
        columnIndex = row[2];
      } else if (column[0] == true) {
        rowIndex = column[1];
        columnIndex = column[2];
      } else if (diagonal[0] == true) {
        rowIndex = diagonal[1];
        columnIndex = diagonal[2];
      } else {
        let randomCell = Math.floor(Math.random() * currentBoard[0].length);
        rowIndex = currentBoard[0][randomCell];
        columnIndex = currentBoard[1][randomCell];
      }
    } else if (level == "hard") {
      if (cRow[0] == true) {
        rowIndex = cRow[1];
        columnIndex = cRow[2];
      } else if (cColumn[0] == true) {
        rowIndex = cColumn[1];
        columnIndex = cColumn[2];
      } else if (cDiagonal[0] == true) {
        rowIndex = cDiagonal[1];
        columnIndex = cDiagonal[2];
      } else if (row[0] == true) {
        rowIndex = row[1];
        columnIndex = row[2];
      } else if (column[0] == true) {
        rowIndex = column[1];
        columnIndex = column[2];
      } else if (diagonal[0] == true) {
        rowIndex = diagonal[1];
        columnIndex = diagonal[2];
      } else {
        let randomCell = Math.floor(Math.random() * currentBoard[0].length);
        rowIndex = currentBoard[0][randomCell];
        columnIndex = currentBoard[1][randomCell];
      }
    } else if (level == "impossible") {
      let choice = minimax(boardArray, computer);
      rowIndex = matrix[choice.index][0];
      columnIndex = matrix[choice.index][1];
    }
    if (rowIndex == undefined) return;
    return [rowIndex, columnIndex];
  }

  function humanMove(row, column) {
    gameBoard.placeToken(row, column, getToken()[0]);
  }

  function computerMove(board) {
    let cell = computerChoice(board);
    if (cell == undefined) return;
    gameBoard.placeToken(cell[0], cell[1], getToken()[1]);
  }

  function firstMove(board, token) {
    if (token == "x") return;
    computerMove(board);
  }

  function getWinner(board, win, lose, draw) {
    let emptyCellIndexes = getCurrentBoard(board)[2];
    let gameBoard = getCurrentBoard(board)[3];
    let human = getToken()[0];
    let computer = getToken()[1];
    if (winning(gameBoard, human)) {
      win();
    } else if (winning(gameBoard, computer)) {
      lose();
    } else if (emptyCellIndexes.length == 0) {
      draw();
    }
  }

  function getEmptyIndexes(board) {
    let array = [];
    for (let i = 0; i < board.length; i++) {
      if (typeof board[i] == "number") {
        array.push(i);
      }
    }
    return array;
  }

  function minimax(board, player) {
    let empty = getEmptyIndexes(board);
    let human = getToken()[0];
    let computer = getToken()[1];
    if (winning(board, human)) {
      return { score: -10 };
    } else if (winning(board, computer)) {
      return { score: 10 };
    } else if (empty.length === 0) {
      return { score: 0 };
    }
    let moves = [];
    for (let i = 0; i < empty.length; i++) {
      let move = {};
      move.index = board[empty[i]];
      board[empty[i]] = player;
      if (player === computer) {
        let result = minimax(board, human);
        move.score = result.score;
      } else {
        let result = minimax(board, computer);
        move.score = result.score;
      }
      board[empty[i]] = move.index;
      moves.push(move);
    }
    let bestMove;
    if (player === computer) {
      let bestScore = -100;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 100;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  }

  return {
    getWinner,
    firstMove,
    humanMove,
    computerMove,
    getBoard: gameBoard.getBoard,
    reset: gameBoard.reset,
  };
}

function ScreenController() {
  const winModal = document.querySelector(".win-modal");
  const overlay = document.querySelector(".overlay");
  let game = GameController();
  let board = game.getBoard();
  let winner;

  function openWinModal() {
    winModal.classList.add("active");
    overlay.classList.add("active");
  }

  function closeWinModal() {
    winModal.textContent = "";
    winModal.classList.remove("active");
    overlay.classList.remove("active");
  }

  function updateScreen() {
    gameBoard.textContent = "";
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        cellButton.textContent = cell.getValue();
        gameBoard.appendChild(cellButton);
      });
    });
  }

  function clickHandler(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    let token = e.target.textContent;
    if (winner || token || !selectedRow) return;
    game.humanMove(selectedRow, selectedColumn);
    updateScreen();
    game.getWinner(board, win, lose, draw);
    if (winner) return;
    game.computerMove(board);
    setTimeout(updateScreen, 150);
    game.getWinner(board, win, lose, draw);
  }

  function win() {
    winner = 1;
    winModal.textContent = "You Win!";
    setTimeout(openWinModal, 150);
  }

  function lose() {
    winner = 1;
    winModal.textContent = "You Lose!";
    setTimeout(openWinModal, 150);
  }

  function draw() {
    winner = 1;
    winModal.textContent = "It's a Draw!";
    setTimeout(openWinModal, 150);
  }

  function reset() {
    winner = undefined;
    winModal.textContent = "";
    game.reset();
    game.firstMove(board, tokenSelector.value);
    setTimeout(updateScreen, 150);
  }

  gameBoard.addEventListener("pointerdown", clickHandler);
  restart.addEventListener("pointerdown", reset);
  tokenSelector.addEventListener("change", reset);
  levelSelector.addEventListener("change", reset);
  overlay.addEventListener("pointerdown", closeWinModal);
  overlay.addEventListener("pointerdown", reset);

  updateScreen();
}

ScreenController();
