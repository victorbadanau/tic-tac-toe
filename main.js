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
  return { getBoard, placeToken };
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

function GameController(playerOne = "Player", playerTwo = "Computer") {
  const board = GameBoard();

  function getToken() {
    const tokenSelector = document.querySelector("#token-selector");
    let token = tokenSelector.value;
    if (token === "x") return ["x", "o"];
    return ["o", "x"];
  }

  const players = [
    { name: playerOne, token: getToken()[0] },
    { name: playerTwo, token: getToken()[1] },
  ];

  function firstPlayer() {
    if (players[0].token === "x") return players[0];
    return players[1];
  }

  let activePlayer = firstPlayer();

  function switchPlayerTurn() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  function getActivePlayer() {
    return activePlayer;
  }

  function playRound(row, column) {
    board.placeToken(row, column, getActivePlayer().token);
    switchPlayerTurn();
  }

  return { playRound, getActivePlayer, getBoard: board.getBoard };
}

function ScreenController() {
  const game = GameController();
  const boardDiv = document.querySelector(".game-board");

  function updateScreen() {
    boardDiv.textContent = "";
    let board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  }
  
  function clickHandler(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    if (!selectedRow || !selectedColumn) return;
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }

  boardDiv.addEventListener("pointerdown", clickHandler);

  updateScreen();
}

ScreenController();