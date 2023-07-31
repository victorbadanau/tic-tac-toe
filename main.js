const gameBoard = document.querySelector(".game-board");
const restart = document.querySelector(".restart");
const tokenSelector = document.getElementById("token-selector");
const levelSelector = document.querySelector("#difficulty");
const level = document.querySelector("#difficulty").value;

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

  function availableCells(board) {
    let emptyRows = [];
    let emptyColumns = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j].getValue() === "") {
          emptyRows.push(i);
          emptyColumns.push(j);
        }
      }
    }
    return [emptyRows, emptyColumns];
  }

  function computerChoice(board) {
    const cells = availableCells(board);
    let rowIndex;
    let columnIndex;
    if (level == "easy") {
      let randomCell = Math.floor(Math.random() * cells[0].length);
      rowIndex = cells[0][randomCell];
      columnIndex = cells[1][randomCell];
    } else if (level == "medium") {
    } else if (level == "hard") {
    } else if (level == "impossible") {
    }
    if (rowIndex == undefined) return;
    return [rowIndex, columnIndex];
  }

  function playerMove(row, column) {
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

  function row(board, token) {
    let array;
    if (board == undefined || token == undefined) return;
    array = board
      .map((row) => row.filter((column) => column.getValue() == token))
      .filter((row) => row.length === 3);
    return array;
  }
  function column(board, token) {
    let array;
    if (board == undefined || token == undefined) return;
    array = board[0]
      .map((col, i) => board.map((row) => row[i]))
      .map((row) => row.filter((column) => column.getValue() == token))
      .filter((row) => row.length === 3);
    return array;
  }

  function diagonal(board, token) {
    if (board == undefined || token == undefined) return;
    const length = board.length;
    let firstDiagonal = [];
    let secondDiagonal = [];
    for (let i = 0; i < length; i++) {
      firstDiagonal.push(board[i][i]);
      secondDiagonal.push(board[i][length - i - 1]);
    }
    let diagonals = [firstDiagonal, secondDiagonal];
    let array = diagonals
      .map((row) => row.filter((column) => column.getValue() == token))
      .filter((row) => row.length === 3);
    return array;
  }

  function winner(board, win, lose) {
    let xRow = row(board, "x");
    let xColumn = column(board, "x");
    let xDiagonal = diagonal(board, "x");
    let oRow = row(board, "o");
    let oColumn = column(board, "o");
    let oDiagonal = diagonal(board, "o");
    let player = getToken()[0];
    let x = xRow.length !== 0 || xColumn.length !== 0 || xDiagonal.length !== 0;
    let o = oRow.length !== 0 || oColumn.length !== 0 || oDiagonal.length !== 0;
    if ((x && player === "x") || (o && player === "o")) {
      win();
    } else if ((x && player === "o") || (o && player === "x")) {
      lose();
    }
    return;
  }

  return {
    winner,
    firstMove,
    playerMove,
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
    game.playerMove(selectedRow, selectedColumn);
    updateScreen();
    game.winner(board, win, lose);
    if (winner) return;
    game.computerMove(board);
    setTimeout(updateScreen, 150);
    game.winner(board, win, lose);
  }

  function win() {
    winner = 1;
    winModal.textContent = "You Win!";
    openWinModal();
  }
  
  function lose() {
    winner = 1;
    winModal.textContent = "You Lose!";
    openWinModal();
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
