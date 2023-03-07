const fields = document.querySelectorAll(".field");
const restartBtn = document.querySelector(".restart-game");
const jsConfetti = new JSConfetti();

//create playerFactory to return player objects
const playerFactory = (name, mark) => {
  const move = (event, board) => {
    const index = [...fields].indexOf(event.target);
    if (board[index] !== "") {
      throw Error("This field is occupied! Please choose another");
    }
    board[index] = mark;
  };
  return { name, move, mark };
};

//game module handles setup and flow
const game = (() => {
  let turn = 0;

  const board = Array(9).fill("");

  const name1 = location.search.split("&")[1].slice(-4);
  const name2 = location.search.split("&")[3].slice(-7);

  const players = [playerFactory(name1, "X"), playerFactory(name2, "O")];

  const updateBoard = (currentPlayer) => {
    let resCode = 0;
    fields.forEach((field, index) => (field.textContent = board[index]));
    //check for win conditions
    //possible winning positions
    const combs = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    //sort board into player 1 and 2 move indices to check for win combos
    const moveIndices = board.reduce((moves, currentValue, currentIndex) => {
      if (currentValue === currentPlayer.mark) {
        moves.push(currentIndex);
      }
      return moves;
    }, []);
    //check if game is over
    if (
      combs.some((comb) => comb.every((elem) => moveIndices.includes(elem)))
    ) {
      resCode = 1;
    } else if (!board.includes("")) {
      resCode = 2;
    }
    return resCode;
  };

  const statusMsg = document.querySelector(".game-status");

  const flow = (evt) => {
    try {
      players[turn % 2].move(evt, board);
      switch (updateBoard(players[turn % 2])) {
        case 0:
          statusMsg.textContent = `${
            players[++turn % 2].name
          } please select your move`;
          break;
        case 1:
          confettiFY();
          statusMsg.textContent = `Game Over - ${
            players[turn % 2].name
          } is the Winner!`;
          fields.forEach((field) => {
            field.removeEventListener("click", game.flow);
          });
          break;
        case 2:
          statusMsg.textContent = "Game Over - Tie";
          fields.forEach((field) => {
            field.removeEventListener("click", game.flow);
          });
          break;
      }
    } catch (error) {
      document.querySelector(".game-status").textContent = error;
    }
  };
  const restart = () => {
    board.fill("");
    turn = 0;
    updateBoard(players[0]);
    statusMsg.textContent = "";
    fields.forEach((field) => field.addEventListener("click", game.flow));
  };
  return { flow, restart };
})();

//set event listener on DOM fields
fields.forEach((field) => field.addEventListener("click", game.flow));
restartBtn.addEventListener("click", game.restart);

function confettiFY() {
  jsConfetti.addConfetti();
}
