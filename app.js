const wordDisplay = document.querySelector(".word-container");
const messageDisplay = document.querySelector(".message-container");
const keyboard = document.querySelector(".keyboard-container");

let wordle;

const getWrolde = async () => {
  try {
    const res = await fetch("http://localhost:8000/word");
    const data = await res.json();
    wordle = data.toUpperCase();
    console.log(wordle);
  } catch (error) {
    console.log(error);
  }
};

getWrolde();
const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "DEL",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "ENTER",
];

const guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

let currentRow = 0;
let currentLetter = 0;
let isGameOver = false;

//Generate the keyboard and guess box
keys.map((key) => {
  const btn = document.createElement("button");
  btn.innerText = key;
  btn.setAttribute("id", key);
  btn.addEventListener("click", () => handleClick(key));
  keyboard.appendChild(btn);
});

guessRows.map((guessRow, i) => {
  const row = document.createElement("div");
  row.setAttribute("id", `guessRow-${i}`);
  guessRow.map((guess, index) => {
    const wordBox = document.createElement("div");
    wordBox.setAttribute("id", `guessRow-${i}-word-${index}`);
    wordBox.classList.add("word-box");
    row.appendChild(wordBox);
  });
  wordDisplay.appendChild(row);
});

//The function of clicking the keys
const handleClick = (letter) => {
  if (!isGameOver) {
    if (letter === "DEL") {
      return delLetter();
    }

    if (letter === "ENTER") {
      return checkAns();
    }
    addLetter(letter);
    console.log(guessRows);
  }
};

//The function of adding the letters to the guess box
const addLetter = (letter) => {
  if (currentLetter < 5 && currentRow < 6) {
    const letters = document.getElementById(
      `guessRow-${currentRow}-word-${currentLetter}`
    );
    letters.innerText = letter;
    guessRows[currentRow][currentLetter] = letter;
    letters.setAttribute("data", letter);
    currentLetter++;
  }
};

//The function of deleting the letters
const delLetter = () => {
  if (currentLetter > 0) {
    currentLetter--;
    const letters = document.getElementById(
      `guessRow-${currentRow}-word-${currentLetter}`
    );
    letters.innerText = "";
    guessRows[currentRow][currentLetter] = "";
    letters.setAttribute("data", "");
  }
};

//The function of checking the word
const checkAns = async () => {
  const guessWord = guessRows[currentRow].join("");

  if (currentLetter === 5) {
    try {
      const res = await fetch(`http://localhost:8000/check?word=${guessWord}`);
      const data = await res.json();
      console.log(data);
      if (data == "Entry word not found") {
        return showMsg("Word not found");
      } else {
        changeColor();
        if (guessWord == wordle) {
          isGameOver = true;
          return showMsg("Congrats!!");
        } else {
          if (currentRow == 5) {
            isGameOver = true;
            return showMsg("Game Over!");
          }

          //Passing to next row
          if (currentRow < 5) {
            currentRow++;
            currentLetter = 0;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  console.log(guessWord);
};

//Showing the msg of success or failure
const showMsg = (msg) => {
  const message = document.createElement("h2");
  message.innerText = msg;
  messageDisplay.appendChild(message);

  //The msg will disappear after a few sec
  setTimeout(() => messageDisplay.removeChild(message), 4000);
};

//Adding color to the keyboard
const addColorToKey = (keyLetter, colorClass) => {
  const keys = document.getElementById(keyLetter);
  keys.classList.add(colorClass);
};

//Changing the color in the guess box
const changeColor = () => {
  //All five letters in the row
  const rowWord = document.querySelector(`#guessRow-${currentRow}`).childNodes;
  let checkWordle = wordle;
  const guess = [];

  rowWord.forEach((word) => {
    guess.push({ letter: word.getAttribute("data"), color: "grey" });
  });

  guess.forEach((guess, i) => {
    if (guess.letter == wordle[i]) {
      guess.color = "green";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = "yellow";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  rowWord.forEach((word, i) => {
    //The letters in the guess box

    setTimeout(() => {
      //All would hv a flip animation
      word.classList.add("flip");
      word.classList.add(guess[i].color);
      addColorToKey(guess[i].letter, guess[i].color);

      //Correct position and Correct letters
      //Wrong position but Correct letters
      //Both is Wrong
    }, 500 * i);
  });
};
