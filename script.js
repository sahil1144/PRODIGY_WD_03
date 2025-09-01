document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  const game = document.getElementById("game");
  const friendBtn = document.getElementById("friendBtn");
  const aiBtn = document.getElementById("aiBtn");
  const restartBtn = document.getElementById("restartBtn");
  const menuBtn = document.getElementById("menuBtn");
  const cells = document.querySelectorAll(".cell");
  const statusText = document.getElementById("status");

  let currentPlayer = "X";
  let board = ["","","","","","","","",""];
  let gameOver = false;
  let vsAI = false;

  friendBtn.addEventListener("click", () => {
    vsAI = false;
    menu.classList.add("hidden");
    game.classList.remove("hidden");
    resetGame();
  });

  aiBtn.addEventListener("click", () => {
    vsAI = true;
    menu.classList.add("hidden");
    game.classList.remove("hidden");
    resetGame();
  });

  restartBtn.addEventListener("click", resetGame);

  menuBtn.addEventListener("click", () => {
    resetGame();
    game.classList.add("hidden");
    menu.classList.remove("hidden");
  });

  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      const index = cell.dataset.index;
      if (board[index] === "" && !gameOver) {
        makeMove(index, currentPlayer);
        if (vsAI && !gameOver && currentPlayer === "O") {
          setTimeout(aiMove, 600);
        }
      }
    });
  });

  function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    if (checkWinner(player)) {
      statusText.textContent = `Player ${player} Wins! 🎉`;
      gameOver = true;
      highlightWinner(checkWinner(player));
      return;
    }
    if (!board.includes("")) {
      statusText.textContent = "It's a Draw 😅";
      gameOver = true;
      return;
    }
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }

  function aiMove() {
    let bestScore = -Infinity;
    let move;
    for (let i=0; i<9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, 0, false);
        board[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    makeMove(move, "O");
  }

  function minimax(newBoard, depth, isMax) {
    let winner = getWinner(newBoard);
    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
    if (!newBoard.includes("")) return 0;

    if (isMax) {
      let best = -Infinity;
      for (let i=0; i<9; i++) {
        if (newBoard[i] === "") {
          newBoard[i] = "O";
          let score = minimax(newBoard, depth+1, false);
          newBoard[i] = "";
          best = Math.max(score, best);
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i=0; i<9; i++) {
        if (newBoard[i] === "") {
          newBoard[i] = "X";
          let score = minimax(newBoard, depth+1, true);
          newBoard[i] = "";
          best = Math.min(score, best);
        }
      }
      return best;
    }
  }

  function checkWinner(player) {
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let p of winPatterns) {
      const [a,b,c] = p;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return p;
      }
    }
    return null;
  }

  function highlightWinner(pattern) {
    if (pattern) {
      pattern.forEach(i => cells[i].classList.add("winning"));
    }
  }

  function getWinner(bd) {
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let [a,b,c] of winPatterns) {
      if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) return bd[a];
    }
    return null;
  }

  function resetGame() {
    currentPlayer = "X";
    board = ["","","","","","","","",""];
    gameOver = false;
    cells.forEach(c => {
      c.textContent = "";
      c.classList.remove("winning");
    });
    statusText.textContent = "Player X's Turn";
  }
});
