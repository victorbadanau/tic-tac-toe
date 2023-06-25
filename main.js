function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  function placeToken(row, column, player) {
    if (board[row][column].getValue() !== "") return;
    board[row][column].addToken(player);
  }
  return { getBoard, placeToken };
}

function Cell() {
  let value = "";

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
}

function GameController(playerOne = "Player", playerTwo = "Computer") {
  const board = Gameboard();

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
}
