var numSelected = null;
var tileSelected = null;

var error_count = 0;

var board = [
    "-----8-37",
    "-67---4-1",
    "-34-7-9--",
    "-------2-",
    "--6----5-",
    "-------9-",
    "9--2-6-7-",
    "----85---",
    "------2--"
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

    // Board 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] != "-") {
                tile.innerText = board[r][c]; //Add the numbers inside the board
                tile.classList.add("tile-start");
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
    if (numSelected != null) {
        numSelected.classList.remove("number-selected"); //make sure only 1 box of number selector can be selected
    }
    numSelected = this; //if no box number selector is selected before
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (numSelected) {


        // "0-0" "0-1" .. "3-1"
        let coords = this.id.split("-"); //["0", "0"]
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        
         // Set the color of the selected tile
         this.style.color = "yellow";
    
        if (solution[r][c] == numSelected.id) {
            this.innerText = numSelected.id; //to make sure the filled number is correct according to the solution
        }
        else {
            error_count += 1;
            document.getElementById("errors").innerText = error_count;
        }
    }
}
