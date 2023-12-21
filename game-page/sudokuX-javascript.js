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
    "-----8-37",
    "-67---4-1",
    "-34-7-9--",
    "-------2-",
    "--6----5-",
    "-------9-",
    "9--2-6-7-",
    "----85---",
    "------2--"],
    [
    "2-----53-",
    "5--3---81",
    "--4-71---",
    "3---5----",
    "19----75-",
    "-5-1-7--8",
    "9--21--7-",
    "--3----19",
    "6--7---4-"
    ],
    [
    "--9---53-",
    "5-7-2---1",
    "8-----9--",
    "---95---6",
    "----3--54",
    "-5-1--3-8",
    "-4--16--3",
    "7--4---19",
    "---7--2--"
    ],
    [
    "---6--5-7",
    "-----9--1",
    "8-----9--",
    "3--9--1--",
    "1--83--54",
    "-5--6---8",
    "--52--8-3",
    "------61-",
    "6--79-2--"
    ]
]

var solution = [
    "219648537",
    "567329481",
    "834571962",
    "378954126",
    "196832754",
    "452167398",
    "945216873",
    "723485619",
    "681793245"
]

startTimer();
window.onload = function() {
    setGame();
}

function setGame() {
    // Digits 1-9 number selector
    for (let i = 1; i <= 9; i++) {
        //<div id="1" class="number">1</div>
        let number = document.createElement("div");
        number.id = i
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
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

    // Board 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[random][r][c] != "-") {
                if(r === c || r+c === 8){
                    tile.innerText = board[random][r][c]; //Add the numbers inside the diagonal pattern
                    tile.classList.add("tile-start-diagonal");
                    tile.style.color = "#FFEF1F";
                }

                else {
                    tile.innerText = board[random][r][c]; //Add the numbers inside the normal pattern
                    tile.classList.add("tile-start");
                    tile.style.color = "#FFEF1F";
                }
            }
            // Check if the tile is on the X pattern
            if ((r === c) || (r + c === 8)) {
                tile.classList.add("diagonal-line");
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
}

function selectNumber(){
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
        // "0-0" "0-1" .. "3-1"
        let coords = this.id.split("-"); //["0", "0"]
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        let solutionValue = solution[r][c];

        if (!this.classList.contains("tile-start")) {
            // Check if the clicked tile is not a starting tile
            if (solutionValue === numSelected.id || solutionValue === numSelected.innerText) {
                // Check if the tile already contains the correct value
                if (this.innerText !== numSelected.innerText) {
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

function startNewGame() {
    // Check if there are filled tiles and error count is greater than 0
    const hasFilledTiles = checkFilledTiles();

    // Ask for confirmation only if there are filled tiles or errors
    if (hasFilledTiles || error_count > 0) {
        if(solveClick == 0){
        const confirmed = window.confirm("Starting a new game will reset your current progress. Are you sure you want to proceed?");
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


//===================================================================================================
//BUTTON DISABLE OR ENABLE
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


//==========================================================================
function updateScore(){
    document.getElementById("score-display-id").innerText = "Last Game Score: " + score;
}


//==========================================================================
//PLAYING TIME COUNT FUNCTION
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


//===================================================================================================
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

    saveScore({ time: formattedTime, result: score, status: completestatus}, "Sudoku-X!" );
}

// Function to close the pop up window
function closeModal() {
    document.getElementById("resultModal").style.display = "none";
}

//save the data to local storage
function saveScore(scoreData, gameMode) {
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

        cellNumber.className = 'col-0';
        cellGameType.className = 'col-1';
        cellMissClick.className = 'col-2';
        cellStatus.className = 'col-3';
        cellTime.className = 'col-4';
        cellScore.className = 'col-5';

        cellNumber.innerHTML = index + 1;
        cellGameType.innerHTML = 'Sudoku X!'; // Replace this with the actual game type
        cellMissClick.innerHTML = score.error_count;
        console.log("Inside loop - Error count:", error_count); // Replace this with the actual miss click count
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