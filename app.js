const possibleMoves = {
  A1: {
    red: ["B2"],
  },
  A3: {
    red: ["B2", "B4"],
  },
  A5: {
    red: ["B4", "B6"],
  },
  A7: {
    red: ["B6", "B8"],
  },
  B2: {
    red: ["C1", "C3"],
    white: ["A1", "A3"],
    // king: ["C1", "C3", "A1", "A3"],
  },
  B4: {
    red: ["C3", "C5"],
    white: ["A3", "A5"],
    // king: ["C3", "C5", "A3", "A5"],
  },
  B6: {
    red: ["C5", "C7"],
    white: ["A5", "A7"],
    // king: ["C5", "C7", "A5", "A7"],
  },
  B8: { red: ["C7"], white: ["A7"], 
  // king: ["C7", "A7"] 
},
  C1: { red: ["D2"], white: ["B2"], 
  // king: ["D2", "B2"] 
},
  C3: {
    red: ["D2", "D4"],
    white: ["B2", "B4"],
    // king: ["D2", "D4", "B2", "B4"],
  },
  C5: {
    red: ["D4", "D6"],
    white: ["B4", "B6"],
    // king: ["D4", "D6", "B4", "B6"],
  },
  C7: {
    red: ["D6", "D8"],
    white: ["B6", "B8"],
    // king: ["D6", "D8", "B6", "B8"],
  },
  D2: { red: ["E1", "E3"], white: ["C1", "C3"], 
  // king: ["E1", "E3", "C1, C3"] 
},
  D4: {
    red: ["E3", "E5"],
    white: ["C3", "C5"],
    // king: ["E3", "E5", "C3", "C5"],
  },
  D6: {
    red: ["E5", "E7"],
    white: ["C5", "C7"],
    // king: ["E5", "E7", "C5", "C7"],
  },
  D8: { red: ["E7"], white: ["C7"], 
  // king: ["E7", "C7"] 
},
  E1: { red: ["F2"], white: ["D2"], 
  // king: ["F2", "D2"] 
},
  E3: {
    red: ["F2", "F4"],
    white: ["D2", "D4"],
    // king: ["F2", "F4", "D2", "D4"],
  },
  E5: {
    red: ["F4", "F6"],
    white: ["D4", "D6"],
    // king: ["F4", "F6", "D4", "D6"],
  },
  E7: {
    red: ["F6", "F8"],
    white: ["D6", "D8"],
    // king: ["F6", "F8", "D6", "D8"],
  },
  F2: {
    red: ["G1", "G3"],
    white: ["E1", "E3"],
    // king: ["G1", "G3", "E1", "E3"],
  },
  F4: {
    red: ["G3", "G5"],
    white: ["E3", "E5"],
    king: ["G3", "G5", "E3", "E5"],
  },
  F6: {
    red: ["G5", "G7"],
    white: ["E5", "E7"],
    // king: ["G5", "G7", "E5", "E7"],
  },
  F8: { red: ["G7"], white: ["E7"], 
  // king: ["G7", "E7"] 
},
  G1: { red: ["H2"], white: ["F2"], 
  // king: ["H2", "F2"] 
},
  G3: {
    red: ["H2", "H4"],
    white: ["F2", "F4"],
    // king: ["H2", "H4", "F2", "F4"],
  },
  G5: {
    red: ["H4", "H6"],
    white: ["F4", "F6"],
    // king: ["H4", "H6", "F4", "F6"],
  },
  G7: {
    red: ["H6", "H8"],
    white: ["F6", "F8"],
    // king: ["H6", "H8", "F6", "F8"],
  },
  H2: {
    white: ["G1", "G3"],
  },
  H4: {
    white: ["G3", "G5"],
  },
  H6: {
    white: ["G5", "G7"],
  },
  H8: {
    white: ["G7"],
  },
};

function init(turn) {
  // Remove .activeCells class and attributes from all black cells
  for (const cell of document.querySelectorAll('.bg-black')) {
    cell.removeAttribute('onclick');
    cell.firstElementChild?.removeAttribute('onclick');
    cell.classList.remove('activeCells');
  }
  // Apply move function to all pieces based on turn ('white' or 'red')
  for (const piece of document.querySelectorAll(`.${turn}`)) {
    if (!piece.classList.contains('active')) {
      piece.setAttribute('onclick', 'handleMove(this)')
    }
  }
}

function handleMove(target) {
  const cell = target.parentElement,
    position = cell.dataset.cell;
  // Remove onclick attributes from un-clicked pieces
  for (const inactivePiece of [...document.querySelectorAll(`.${turn}`)].filter(el => el !== target)) {
    inactivePiece.removeAttribute('onclick');
  }
  // Remove .active class to clicked piece then revert all .canBeEaten & .activeCells to black then restart SAME TURN.
  if (target.classList.contains('active')) {
    target.classList.remove("active");
    for (const aCell of [...document.querySelectorAll(".canBeEaten")]) {
      aCell.classList.remove("canBeEaten");
      aCell.classList.add("bg-black");
    }
    for (const aCell of [...document.querySelectorAll(".activeCells")]) {
      aCell.removeAttribute("onclick");
      aCell.classList.remove("activeCells");
      aCell.classList.add("bg-black");
    }
    init(turn);
  } else {
    // Add .active class to clicked piece and highlight it's cell
    target.classList.add("active");
    cell.classList.remove("bg-black");
    cell.classList.add("activeCells");
    // Highlight cell and apply function to each possible move based on the piece clicked & space available
    for (const move of possibleMoves?.[position]?.[turn]) {
      const pCell = document.querySelector(`[data-cell~="${move}"]`);
      if (pCell?.innerHTML == "" || pCell?.innerHTML == '\n          \n        ') {
        pCell.classList.remove("bg-black");
        pCell.classList.add("activeCells");
        pCell.setAttribute("onclick", "movePieceToCell(this)");
      }
      // Check for valid cell/piece-jumping & apply class and function appropriately
      else if (!pCell.firstElementChild.classList.contains(`${turn}`)) {
        let pJumpCell = document.querySelector(`[data-cell~="${[turn == 'white' ? getPrevChar(move.slice(0,1)) : getNextChar(move.slice(0,1)), move.slice(1) < position.slice(1) ? move.slice(1)-1 : Number(move.slice(1)) + 1].join('')}"]`);
        if (pJumpCell?.innerHTML == "" || pJumpCell?.innerHTML == '\n          \n        ') {
          pJumpCell.classList.remove("bg-black");
          pJumpCell.classList.add("activeCells");
          pJumpCell.setAttribute("onclick", "movePieceToCell(this)");
          document.querySelector(`[data-cell~="${move}"]`).classList.remove('bg-black');
          document.querySelector(`[data-cell~="${move}"]`).classList.add('canBeEaten');
        }
      }
    }
  }
}

function movePieceToCell(target) {
  const ogPosition = document.querySelector('.active').parentElement.dataset.cell, 
    newPosition = target.dataset.cell;
  // Move active piece to the clicked cell if empty, remove functions & revert cells to black
  if (target.innerHTML == "" || target.innerHTML == '\n          \n        ') {
    document.querySelector(".active").removeAttribute("click");
    target.appendChild(document.querySelector(".active"));
    document.querySelector(".active").classList.remove("active");
    for (const aCell of [...document.querySelectorAll(".activeCells")]) {
      aCell.removeAttribute("onclick");
      aCell.classList.add("bg-black");
      aCell.classList.remove("activeCells");
    }
    document.querySelector(".active")?.removeAttribute("onclick");
  }
  // Simple eating mechanic
  let pEatCell = document.querySelector(`[data-cell~="${[ogPosition.slice(0, 1) > newPosition.slice(0, 1) ? getPrevChar(ogPosition.slice(0, 1)) : getNextChar(ogPosition.slice(0, 1)), ogPosition.slice(1) > newPosition.slice(1) ? ogPosition.slice(1)-1 : Number(ogPosition.slice(1)) + 1].join('')}"]`);
  if (pEatCell.classList.contains('canBeEaten')) {
    pEatCell.removeChild(pEatCell.firstElementChild);
  }
  for (const aCell of [...document.querySelectorAll(".canBeEaten")]) {
    aCell.classList.add("bg-black");
    aCell.classList.remove("canBeEaten");
  }
  init(turn == "white" ? (turn = "red") : (turn = "white"));
}

function getNextChar(char) {
  return String.fromCharCode(char.charCodeAt(0) + 1);
}

function getPrevChar(char) {
  return String.fromCharCode(char.charCodeAt(0) - 1);
}

init(turn = 'white');