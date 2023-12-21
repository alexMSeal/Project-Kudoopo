var numSelected = null;
var tileSelected = null;
var error_count = 0;
var solveClick = 0;
var score = 0;
var lastRandom = null;
var elapsedTime = 0; // Global variable to store the elapsed time
var completestatus = ""; 
var startTime; // Variable to store the start time
var timerInterval; // Variable to store the setInterval ID
var isPaused = false;
var points = score;
var board = [[
    "--3-K--CO",
    "3-KC--EN-",
    "-----K7--",
    "--7-N---C",
    "-7-----E-",
    "--J-----N",
    "-3--7---K",
    "K---3O-J-",
    "-O--E---7"
],
[   
    "----KA--O",
    "--K--7--J",
    "-C--J----",
    "OJ---E--C",
    "A--K-----",
    "-KJ--3-7N",
    "E-N---C--",
    "--C--OA--",
    "J---E-K--"
],
[
    "---J--NC-",
    "-A---7--J",
    "-C-3-----",
    "-J--N---C",
    "A--K---E-",
    "--J--3---",
    "---O---A-",
    "-N--3----",
    "-O---C--7"
],
[
    "7-3-----O",
    "3---O---J",
    "--E--K--A",
    "--7A-E---",
    "-7----JE-",
    "CK--A---N",
    "-3---J-A-",
    "K---3O--E",
    "J--N-C--7"
]
];

var solution = [
    "7E3JKANCO",
    "3AKCO7ENJ",
    "NCE3JK7OA",
    "OJ7ANE3KC",
    "A7OKCNJE3",
    "CKJEA3O7N",
    "E3NO7JCAK",
    "KNC73OAJE",
    "JOANECK37",
    "JANCOEK37"
];

startTimer();

window.onload = function() {
    setGame();
}

function setGame() {
    const lettersAndNumbers = solution[solution.length-1].split("");

    // Digits WORD & number selector
    for (let i = 0; i < 9; i++) {
        let number = document.createElement("div");
        number.id = i + 1;
        number.innerText = lettersAndNumbers[i];
        number.addEventListener("click", selectNumber);
        number.classList.add("selectorBox");
        document.getElementById("digits").appendChild(number);
    }

    var random = Math.floor(Math.random()*board.length);
    
    console.log("before check:", random)
    if(lastRandom == random){
        if(lastRandom == board.length-1){
            random = random - 1;
        }
        else{
            random += 1;
        }
        console.log("random check")
    }
    lastRandom = random;
    console.log("after check:", random)
    // Board 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[random][r][c] != "-") {
                tile.innerText = board[random][r][c]; // Add the numbers inside the board
                tile.dataset.solution = solution[r][c]; // Store the solution value
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
    showButtons();
    enableButtons();
}

function startNewGame() {
    // Check if there are filled tiles and error count is greater than 0
    const hasFilledTiles = checkFilledTiles();

    // Ask for confirmation only if there are filled tiles or errors
    if (hasFilledTiles || error_count > 0) {
        if(solveClick == 0){
        const confirmed = window.confirm("Starting a new game will reset your progress. Are you sure you want to proceed?");
            if (!confirmed) {
                return;
            }
        }
    }

    // Clear the board
    clearBoard();

    // Reset the game state
    numSelected = null;
    tileSelected = null; // If you have a tileSelected variable
    error_count = 0;
    document.getElementById("errors").innerText = error_count;

    // Start a new game
    setGame();
    resetTimer();
    enableButtons();
    solveClick = 0;
}

function checkFilledTiles() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tileId = r.toString() + "-" + c.toString();
            let tile = document.getElementById(tileId);
            // If any tile is filled, return true
            if (!tile.classList.contains("tile-start") && tile.innerText !== "") {
                return true;
            }
        }
    }
    // No filled tiles found
    return false;
}

function showButtons() {
    document.querySelector(".solvebtn").style.display = "inline-block";
    document.querySelector(".clearbtn").style.display = "inline-block";
    document.querySelector(".newgamebtn").style.display = "inline-block";
}

function disableButtons() {
    let solveBtn = document.querySelector(".solvebtn");
    let clearBtn = document.querySelector(".clearbtn");
    let newGameBtn = document.querySelector(".newgamebtn");
    let pauseBtn = document.querySelector(".pause");
    solveBtn.disabled = true;
    clearBtn.disabled = true;
    newGameBtn.disabled = false;
    pauseBtn.disabled = true;
    solveBtn.style.opacity = "0.2";
    clearBtn.style.opacity = "0.2";
    pauseBtn.style.opacity = "0.2";
}

function enableButtons() {
    document.querySelector(".solvebtn").style.opacity = "1";
    document.querySelector(".clearbtn").style.opacity = "1";
    document.querySelector(".newgamebtn").style.opacity = "1";
    document.querySelector(".pause").style.opacity = "1";
    document.querySelector(".solvebtn").disabled = false;
    document.querySelector(".clearbtn").disabled = false;
    document.querySelector(".newgamebtn").disabled = false;
    document.querySelector(".pause").disabled = false;
}

function selectNumber() {
     if (disableDigitSelector()) {
        return;
    }
    
    // Check if the clicked button is already selected
    if (numSelected === this) {
        // If yes, remove the selection and exit the function
        numSelected.classList.remove("number-selected");
        numSelected = null;
        return;
    }

    // If a different button is selected, remove the selection from the previous one
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }

    // Set the newly clicked button as selected
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function disableDigitSelector(){
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tileId = r.toString() + "-" + c.toString();
            let tile = document.getElementById(tileId);

            // If any tile is empty, puzzle is not complete
            if (!tile.classList.contains("tile-start") && tile.innerText === "") {
                return;
            }
        }
    }   

    return true;
}

function selectTile() {
    if (numSelected) {
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        let solutionValue = solution[r][c];

        if (!this.classList.contains("tile-start")) {
            this.style.color = "#FFEF1F";
            // Check if the clicked tile is not a starting tile
            if (solutionValue === numSelected.id || solutionValue === numSelected.innerText) {
                // Check if the tile already contains the correct value
                if (this.innerText !== numSelected.innerText) {
                    console.log("tile-changed");
                    this.innerText = numSelected.innerText;
                }
            } else {
                error_count += 1;
                document.getElementById("errors").innerText = error_count;
                this.classList.add("tile-wrong");

                setTimeout(() => {
                    this.classList.remove("tile-wrong");
                }, 2000);
            }
            checkPuzzleCompletion();
        }
    }
}


function checkPuzzleCompletion() {
    console.log("CHECK")
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tileId = r.toString() + "-" + c.toString();
            let tile = document.getElementById(tileId);

            // If any tile is empty, puzzle is not complete
            if (!tile.classList.contains("tile-start") && tile.innerText === "") {
                return;
            }
        }
    }   
    //if Puzzle is complete
    stopTimer();
    disableButtons();

    score = (solveClick === 1) ? 2 : 100;
    points += score;

    let time = getFinalTime();

    if (solveClick === 1) {
        audioUrl = "../sfx/solve.mp3";
        completionMessage = "You clicked the solve button!";
        console.log("audio played-1")
    } else {
        audioUrl = "../sfx/victory-tf2.mp3";
        completionMessage = "Puzzle Completed!";
        console.log("audio played-2")
    }


    $.ajax({
        type: "GET",
        url: audioUrl,
        success: function () {
            // Play audio when the request is successful
            let audio = new Audio(audioUrl);
            audio.play();

            // Additional logic or callbacks can be added here
        },
        error: function () {
            console.error("Error loading audio");
        }
        
    });
    console.log("ajax passed")
    //remove the selected digit-selector
    if (numSelected) {
        numSelected.classList.remove("number-selected");
        numSelected = null;
    }

    updateScore();
    openModal(time, score, completionMessage);
    return true;
}

function solveSudoku() {
    stopTimer()
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tileId = r.toString() + "-" + c.toString();
            let tile = document.getElementById(tileId);

            if (!tile.classList.contains("tile-start")) {
                tile.innerText = solution[r][c];
            }
        }
    }

    solveClick += 1;
    checkPuzzleCompletion();
}


function clearBoard() { // Clear the entire board to generate a new sudoku
    let boardElement = document.getElementById("board");
    while (boardElement.firstChild) {
        boardElement.removeChild(boardElement.firstChild);
    }

    let digitsElement = document.getElementById("digits");
    while (digitsElement.firstChild) {
        digitsElement.removeChild(digitsElement.firstChild);
    }
}

function clearSudoku() { //Clear the answer tiles only
    const confirmed = window.confirm("Are you sure you want to clear the sudoku board?");

    if (confirmed) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                let tileId = r.toString() + "-" + c.toString();
                let tile = document.getElementById(tileId);

                if (!tile.classList.contains("tile-start")) {
                    tile.innerText = "";
                }
            }
        }
        enableButtons(); // Enable buttons after clearing
    }
}

function updateScore(){
    document.getElementById("score-display-id").innerText = "Last Game Score: " + score;
}

function startTimer() {
    startTime = new Date(); // Set the start time
    timerInterval = setInterval(updateTimer, 1000); // Update the timer every second
}

function updateTimer() {
    var currentTime = new Date();
    var elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

    var hours = Math.floor(elapsedSeconds / 3600);
    var minutes = Math.floor((elapsedSeconds % 3600)/ 60);
    var seconds = elapsedSeconds % 60;

    // Display the formatted time
    var formattedTime = padNumber(hours) + ":" + padNumber(minutes) + ":" + padNumber(seconds);
    document.getElementById("timer").innerText = "Playing Time: " + formattedTime;

    elapsedTime = elapsedSeconds;
}

function padNumber(number) {
    return number < 10 ? "0" + number : number;
}

function stopTimer() {
    clearInterval(timerInterval); // Stop the timer
}

function continueTimer() {
    startTime = new Date() - elapsedTime * 1000; // Subtract elapsed time from the current time
    timerInterval = setInterval(updateTimer, 1000); // Resume the timer
}

function resetTimer() {
    clearInterval(timerInterval); // Stop the timer
    document.getElementById("timer").innerText = "Playing Time: 00:00:00"; // Reset displayed time
    elapsedTime = 0; // Reset elapsed time
    startTimer(); // Start the timer again
}

function getFinalTime() {
    return elapsedTime;
}

//for pop up window after completing the sudoku
function openModal(time, score, completestatus) {
    var hours = Math.floor(time / 3600);
    var minutes = Math.floor((time % 3600) / 60);
    var seconds = time % 60;

    var formattedTime = padNumber(hours) + ":" + padNumber(minutes) + ":" + padNumber(seconds);
    document.getElementById("modalTime").innerText = formattedTime;
    document.getElementById("modalPoints").innerText = score;
    document.getElementById("modalStatus").innerText = completestatus;
    document.getElementById("resultModal").style.display = "block";

    saveScore({ time: formattedTime, result: score, status: completestatus });
}

// Function to close the pop up window
function closeModal() {
    document.getElementById("resultModal").style.display = "none";
}

function saveScore(scoreData) {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scoreData.error_count = error_count;
    // Push the score data to the scores array
    scores.push(scoreData);
    localStorage.setItem('scores', JSON.stringify(scores));
}

function displayScoreboardModal() {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];

    // Remove existing modal container if any
    const existingModalContainer = document.querySelector('.scoreboard-modal');
    if (existingModalContainer) {
        document.body.removeChild(existingModalContainer);
    }

    // Create a modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal scoreboard-modal'; // Add 'scoreboard-modal' class

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // Close button
    const closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = closeScoreboardModal;

    modalContent.appendChild(closeButton);
    
    // Create title outside of the table
    const titleDiv = document.createElement('div');
    titleDiv.className = 'scoreboard-title';
    titleDiv.innerHTML = 'Gameplay Status'; // Customize the title
    modalContent.appendChild(titleDiv);

    const ScoreTitleDiv = document.createElement('div');
    ScoreTitleDiv.className = 'scoreboard-scoretitle';
    ScoreTitleDiv.innerHTML = 'Total Score: ' + calculateTotalScore(); // Calculate total score
    modalContent.appendChild(ScoreTitleDiv);

    // Create a table
    const table = document.createElement('table');
    table.className = 'score-table';

    // Create table header
    const headerRow = table.createTHead().insertRow(0);
    const headers = ['No.', 'Game Type', 'Miss Click', 'Status', 'Time', 'Score'];
    headers.forEach((headerText, index) => {
        const th = document.createElement('th');
        th.innerHTML = headerText;
        headerRow.appendChild(th);
    });
    console.log(error_count)
    // Create table body
    const tbody = table.createTBody();
    scores.forEach((score, index) => {
        const row = tbody.insertRow(index);
        const cellNumber = row.insertCell(0);
        const cellGameType = row.insertCell(1);
        const cellMissClick = row.insertCell(2);
        const cellStatus = row.insertCell(3);
        const cellTime = row.insertCell(4);
        const cellScore = row.insertCell(5);

        cellNumber.innerHTML = index + 1;
        cellGameType.innerHTML = 'Word Sudoku'; // Replace this with the actual game type
        cellMissClick.innerHTML = score.error_count;
        cellStatus.innerHTML = score.status;
        cellTime.innerHTML = score.time;
        cellScore.innerHTML = score.result;
    });
    console.log("After setting error count:", error_count);
    modalContent.appendChild(table);
    modalContainer.appendChild(modalContent);

    // Button to clear local storage
    const clearStorageButton = document.createElement('button');
    clearStorageButton.innerHTML = 'Clear Saved Data';
    clearStorageButton.onclick = clearLocalStorage;
    modalContent.appendChild(clearStorageButton);

    // Append modal to the body
    document.body.appendChild(modalContainer);

    // Change display property to "block"
    modalContainer.style.display = 'block';
    console.log("appended");
}

//to display the total store in the modal
function calculateTotalScore() {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    let totalScore = 0;

    scores.forEach(score => {
        // Assuming 'score.result' is the property containing the individual scores
        totalScore += parseInt(score.result) || 0;
    });

    return totalScore;
}

function closeScoreboardModal() {
    // Remove the scoreboard modal when the close button is clicked
    const modalContainer = document.querySelector('.scoreboard-modal');
    if (modalContainer) {
        document.body.removeChild(modalContainer);
    }
}

function clearLocalStorage() {
    var confirm = window.confirm("Do you wish to continue? All saved data will be clear");
    if(!confirm){
        return;
    }
    localStorage.removeItem('scores');
    closeScoreboardModal();   
}

//prevent from missclick closing the tab
window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
});

//Pause and resume button function
function pause() {
    if(isPaused == false){
    stopTimer();
    document.getElementById("block-id").style.display = "block";
    document.getElementById("pause-overlay").style.display = "block";
    isPaused = true;
    console.log("paused");
    }
    else{
        continueTimer();
        document.getElementById("block-id").style.display = "none";
        document.getElementById("pause-overlay").style.display = "none";
        isPaused = false;
        console.log("un-paused");
    }
}