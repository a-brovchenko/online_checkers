/*----------- Game State Data ----------*/

const board = [
    null, 0, null, 1, null, 2, null, 3,
    4, null, 5, null, 6, null, 7, null,
    null, 8, null, 9, null, 10, null, 11,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    12, null, 13, null, 14, null, 15, null,
    null, 16, null, 17, null, 18, null, 19,
    20, null, 21, null, 22, null, 23, null
]

/*---------- Cached Variables ----------*/
// player properties


let player;
let turn = true;
let redScore = 12;
let blackScore = 12;
let playerPieces;
let mustMove = []
nextJump = false

// parses pieceId's and returns the index of that piece's place on the board
let findPiece = function (pieceId) {
    let parsed = parseInt(pieceId);
    return board.indexOf(parsed);
};

// DOM referenes
const cells = document.querySelectorAll("td");
let redsPieces = document.querySelectorAll("p");
let blacksPieces = document.querySelectorAll("span")
let redTurnText = document.querySelectorAll(".red-turn-text");
let blackTurnText = document.querySelectorAll(".black-turn-text");

// selected piece properties
let selectedPiece = {
    pieceId: -1,
    indexOfBoardPiece: -1,
    isKing: false,
    seventhSpace: false,
    ninthSpace: false,
    fourteenthSpace: false,
    eighteenthSpace: false,
    minusSeventhSpace: false,
    minusNinthSpace: false,
    minusFourteenthSpace: false,
    minusEighteenthSpace: false,
    flag: false,
}

var paragraphElement = document.querySelector('strong');
var textContent = paragraphElement.textContent;
var userElement = document.querySelector('user');
var userId = userElement.textContent;

var csrfToken = $('meta[name="csrf-token"]').attr('content');
var data = {
    user_id: Number(userId),
};

$.ajax({
    async: false,
    url: '/player/',
    type: 'POST',
    data: {
            'user_id': userId,
            'board': textContent,
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
        },
    success: function (response) {
        if (response.player1){
            player = 1
            blacksPieces.forEach((function(x){x.setAttribute('style', 'pointer-events: none')}))
        }else{
            player = 2
            redsPieces.forEach((function(x){x.setAttribute('style', 'pointer-events: none')}))
        }

    },
    error: function (xhr, status, error) {
        console.error(xhr.responseText);
    }
});


/*---------- Event Listeners ----------*/

// initialize event listeners on pieces
function givePiecesEventListeners(jump) {

    if (turn) {
        if (jump === undefined){
            for (let i = 0; i < redsPieces.length; i++) {
                getPlayerPieces(Number(redsPieces[i].id))
            }
        }
       if (mustMove.length > 0){
            for (let i = 0; i < redsPieces.length; i++) {
                const pieceId = Number(redsPieces[i].id);
                if (mustMove.includes(pieceId)) {
                    redsPieces[i].addEventListener("click", getPlayerPieces);
                }
            }
       }else{
            for (let i = 0; i < redsPieces.length; i++) {
                 redsPieces[i].addEventListener("click", getPlayerPieces);
            }
       }
    } else {
        if (jump === undefined){
            for (let i = 0; i < blacksPieces.length; i++) {
                getPlayerPieces(Number(blacksPieces[i].id))
            }
        }
        if (mustMove.length > 0){
            for (let i = 0; i < blacksPieces.length; i++) {
                const pieceId = Number(blacksPieces[i].id);
                if (mustMove.includes(pieceId)) {
                    blacksPieces[i].addEventListener("click", getPlayerPieces);
                }
            }
       }else{
            for (let i = 0; i < blacksPieces.length; i++) {
                 blacksPieces[i].addEventListener("click", getPlayerPieces);
            }
       }
    }
    redTurnText.forEach(function(element) {element.textContent = player === 1 ? "Ваш ход" : "Ход противника";});
    blackTurnText.forEach(function(element) {element.textContent = player === 1 ? "Ход противника" : "Ваш ход";});

}

/*---------- Logic ----------*/
// holds the length of the players piece count
function getPlayerPieces(id) {
    if (turn) {
        playerPieces = redsPieces;
    } else {
        playerPieces = blacksPieces;
    }
    removeCellonclick();
    resetBorders(id);
}

// removes possible moves from old selected piece (* this is needed because the user might re-select a piece *)
function removeCellonclick() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeAttribute("onclick");
    }
}

// resets borders to default
function resetBorders(id) {
    for (let i = 0; i < playerPieces.length; i++) {
        playerPieces[i].style.border = "1px solid white";
    }
    resetSelectedPieceProperties();
    getSelectedPiece(id);
}

// resets selected piece properties
function resetSelectedPieceProperties() {
    selectedPiece.pieceId = -1;
    selectedPiece.pieceId = -1;
    selectedPiece.isKing = false;
    selectedPiece.seventhSpace = false;
    selectedPiece.ninthSpace = false;
    selectedPiece.fourteenthSpace = false;
    selectedPiece.eighteenthSpace = false;
    selectedPiece.minusSeventhSpace = false;
    selectedPiece.minusNinthSpace = false;
    selectedPiece.minusFourteenthSpace = false;
    selectedPiece.minusEighteenthSpace = false;
    selectedPiece.flag = false;
}

// gets ID and index of the board cell its on
function getSelectedPiece(id) {
        if (id >= 0){
            selectedPiece.pieceId = id
            selectedPiece.flag = true
        }else{
            selectedPiece.pieceId = parseInt(event.target.id);
        }
        selectedPiece.indexOfBoardPiece = findPiece(selectedPiece.pieceId);
        isPieceKing();
}

// checks if selected piece is a king
function isPieceKing() {
    selectedPiece.isKing = false;
    if (document.getElementById(selectedPiece.pieceId) !== null){
        if (document.getElementById(selectedPiece.pieceId).classList.contains("king")) {
            selectedPiece.isKing = true;
        }
    }

    checkAvailableJumpSpaces();
}

// gets the moves that the selected piece can jump
function checkAvailableJumpSpaces(id) {
    if (id !== undefined){
        selectedPiece.indexOfBoardPiece = findPiece(id)
        selectedPiece.flag = true
    }

    if (turn) {
        if (board[selectedPiece.indexOfBoardPiece + 14] === null
        && cells[selectedPiece.indexOfBoardPiece + 14].classList.contains("noPieceHere") !== true
        && board[selectedPiece.indexOfBoardPiece + 7] >= 12) {
            selectedPiece.fourteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece + 18] === null
        && cells[selectedPiece.indexOfBoardPiece + 18].classList.contains("noPieceHere") !== true
        && board[selectedPiece.indexOfBoardPiece + 9] >= 12) {
            selectedPiece.eighteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 14] === null
        && cells[selectedPiece.indexOfBoardPiece - 14].classList.contains("noPieceHere") !== true
        && board[selectedPiece.indexOfBoardPiece - 7] >= 12) {
            selectedPiece.minusFourteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 18] === null
        && cells[selectedPiece.indexOfBoardPiece - 18].classList.contains("noPieceHere") !== true
        && board[selectedPiece.indexOfBoardPiece - 9] >= 12) {
            selectedPiece.minusEighteenthSpace = true;
        }
        if (selectedPiece.isKing && (selectedPiece.fourteenthSpace || selectedPiece.eighteenthSpace ||
        selectedPiece.minusFourteenthSpace || selectedPiece.minusEighteenthSpace) && selectedPiece.indexOfBoardPiece >= 0){
            mustMove.push(selectedPiece.pieceId)
        }else if ((selectedPiece.fourteenthSpace || selectedPiece.eighteenthSpace) && selectedPiece.indexOfBoardPiece >= 0){
            mustMove.push(selectedPiece.pieceId)
        }
    } else {
        if (board[selectedPiece.indexOfBoardPiece + 14] === null
        && cells[selectedPiece.indexOfBoardPiece + 14].classList.contains("noPieceHere") !== true
        && board[selectedPiece.indexOfBoardPiece + 7] < 12 && board[selectedPiece.indexOfBoardPiece + 7] !== null) {
            selectedPiece.fourteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece + 18] === null
        && cells[selectedPiece.indexOfBoardPiece + 18].classList.contains("noPieceHere") !== true
        && board[selectedPiece.indexOfBoardPiece + 9] < 12 && board[selectedPiece.indexOfBoardPiece + 9] !== null) {
            selectedPiece.eighteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 14] === null && cells[selectedPiece.indexOfBoardPiece - 14].classList.contains("noPieceHere") !== true
        && board[selectedPiece.indexOfBoardPiece - 7] < 12
        && board[selectedPiece.indexOfBoardPiece - 7] !== null) {
            selectedPiece.minusFourteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 18] === null && cells[selectedPiece.indexOfBoardPiece - 18].classList.contains("noPieceHere") !== true
        && board[selectedPiece.indexOfBoardPiece - 9] < 12
        && board[selectedPiece.indexOfBoardPiece - 9] !== null) {
            selectedPiece.minusEighteenthSpace = true;
        }
        if (selectedPiece.isKing && (selectedPiece.fourteenthSpace || selectedPiece.eighteenthSpace ||
        selectedPiece.minusFourteenthSpace || selectedPiece.minusEighteenthSpace) && selectedPiece.indexOfBoardPiece >= 0){
            mustMove.push(selectedPiece.pieceId)
        }else if ((selectedPiece.minusFourteenthSpace || selectedPiece.minusEighteenthSpace) && selectedPiece.indexOfBoardPiece >= 0){
            mustMove.push(selectedPiece.pieceId)
        }
    }
    if (selectedPiece.flag){
        selectedPiece.flag = false
        return
    }else{
        getAvailableSpaces()
    }
}


// gets the moves that the selected piece can make
function getAvailableSpaces() {
    if (board[selectedPiece.indexOfBoardPiece + 7] === null &&
        cells[selectedPiece.indexOfBoardPiece + 7].classList.contains("noPieceHere") !== true) {
        selectedPiece.seventhSpace = true;
    }
    if (board[selectedPiece.indexOfBoardPiece + 9] === null &&
        cells[selectedPiece.indexOfBoardPiece + 9].classList.contains("noPieceHere") !== true) {
        selectedPiece.ninthSpace = true;
    }
    if (board[selectedPiece.indexOfBoardPiece - 7] === null &&
        cells[selectedPiece.indexOfBoardPiece - 7].classList.contains("noPieceHere") !== true) {
        selectedPiece.minusSeventhSpace = true;
    }
    if (board[selectedPiece.indexOfBoardPiece - 9] === null &&
        cells[selectedPiece.indexOfBoardPiece - 9].classList.contains("noPieceHere") !== true) {
        selectedPiece.minusNinthSpace = true;
    }
    checkPieceConditions()
}



// restricts movement if the piece is a king
function checkPieceConditions() {
    if (selectedPiece.isKing) {
        givePieceBorder();
    } else {
        if (turn) {
            selectedPiece.minusSeventhSpace = false;
            selectedPiece.minusNinthSpace = false;
            selectedPiece.minusFourteenthSpace = false;
            selectedPiece.minusEighteenthSpace = false;
        } else {
            selectedPiece.seventhSpace = false;
            selectedPiece.ninthSpace = false;
            selectedPiece.fourteenthSpace = false;
            selectedPiece.eighteenthSpace = false;
        }
        givePieceBorder();
    }
}

// gives the piece a green highlight for the user (showing its movable)
function givePieceBorder() {
    if (selectedPiece.fourteenthSpace || selectedPiece.eighteenthSpace || selectedPiece.minusFourteenthSpace || selectedPiece.minusEighteenthSpace) {
        document.getElementById(selectedPiece.pieceId).style.border = "3px solid green";
        selectedPiece.minusSeventhSpace = false;
        selectedPiece.minusNinthSpace = false;
        selectedPiece.seventhSpace = false;
        selectedPiece.ninthSpace = false;
        giveCellsClick();
    }
    if (selectedPiece.seventhSpace || selectedPiece.ninthSpace || selectedPiece.minusSeventhSpace || selectedPiece.minusNinthSpace){
        document.getElementById(selectedPiece.pieceId).style.border = "3px solid green";
        giveCellsClick();
    } else {
        return;
    }
}


// gives the cells on the board a 'click' bassed on the possible moves
function giveCellsClick() {
    if (selectedPiece.seventhSpace) {
        cells[selectedPiece.indexOfBoardPiece + 7].setAttribute("onclick", "sendData(7)");
    }
    if (selectedPiece.ninthSpace) {
        cells[selectedPiece.indexOfBoardPiece + 9].setAttribute("onclick", "sendData(9)");
    }
    if (selectedPiece.fourteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece + 14].setAttribute("onclick", "sendData(14)");
    }
    if (selectedPiece.eighteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece + 18].setAttribute("onclick", "sendData(18)");
    }
    if (selectedPiece.minusSeventhSpace) {
        cells[selectedPiece.indexOfBoardPiece - 7].setAttribute("onclick", "sendData(-7)");
    }
    if (selectedPiece.minusNinthSpace) {
        cells[selectedPiece.indexOfBoardPiece - 9].setAttribute("onclick", "sendData(-9)");
    }
    if (selectedPiece.minusFourteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece - 14].setAttribute("onclick", "sendData(-14)");
    }
    if (selectedPiece.minusEighteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece - 18].setAttribute("onclick", "sendData(-18)");
    }
}

function sendData(number){
    let data = {
            'theme': 'move',
            selectedPiece: selectedPiece,
            number: number,
            }
    return socket.send(JSON.stringify(data));

}

/* v when the cell is clicked v */

// makes the move that was clicked
function makeMove(number) {
    document.getElementById(selectedPiece.pieceId).remove();
    cells[selectedPiece.indexOfBoardPiece].innerHTML = "";
    if (turn) {
        if (selectedPiece.isKing) {
            cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<p class="red-piece king" id="${selectedPiece.pieceId}"></p>`;
            redsPieces = document.querySelectorAll("p");
        } else {
            cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<p class="red-piece" id="${selectedPiece.pieceId}"></p>`;
            redsPieces = document.querySelectorAll("p");
        }
    } else {
        if (selectedPiece.isKing) {
            cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<span class="black-piece king" id="${selectedPiece.pieceId}"></span>`;
            blacksPieces = document.querySelectorAll("span");
        } else {
            cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<span class="black-piece" id="${selectedPiece.pieceId}"></span>`;
            blacksPieces = document.querySelectorAll("span");
        }
    }

    let indexOfPiece = selectedPiece.indexOfBoardPiece
    if (number === 14 || number === -14 || number === 18 || number === -18) {
        changeData(indexOfPiece, indexOfPiece + number, indexOfPiece + number / 2);
    } else {
        changeData(indexOfPiece, indexOfPiece + number);
    }
}

// Changes the board states data on the back end
function changeData(indexOfBoardPiece, modifiedIndex, removePiece) {
    board[indexOfBoardPiece] = null;
    board[modifiedIndex] = parseInt(selectedPiece.pieceId);
    if (turn && selectedPiece.pieceId < 12 && modifiedIndex >= 56) {
        document.getElementById(selectedPiece.pieceId).classList.add("king")
    }
    if (turn === false && selectedPiece.pieceId >= 12 && modifiedIndex <= 7) {
        document.getElementById(selectedPiece.pieceId).classList.add("king");
    }
    if (removePiece) {
        board[removePiece] = null;
        if (turn && selectedPiece.pieceId < 12) {
            cells[removePiece].innerHTML = "";
            blackScore--
        }
        if (turn === false && selectedPiece.pieceId >= 12) {
            cells[removePiece].innerHTML = "";
            redScore--
        }
        selectedPiece.fourteenthSpace = false;
        selectedPiece.eighteenthSpace = false;
        selectedPiece.minusFourteenthSpace = false;
        selectedPiece.minusEighteenthSpace = false;
        checkAvailableJumpSpaces(selectedPiece.pieceId);
        nextJump = false

        if (selectedPiece.isKing && (selectedPiece.fourteenthSpace || selectedPiece.eighteenthSpace
        || selectedPiece.minusFourteenthSpace || selectedPiece.minusEighteenthSpace)){
            nextJump = true
            mustMove = [selectedPiece.pieceId]
        }else if (turn && (selectedPiece.fourteenthSpace || selectedPiece.eighteenthSpace)){
            nextJump = true
            mustMove = [selectedPiece.pieceId]
        }else if (!turn && (selectedPiece.minusFourteenthSpace || selectedPiece.minusEighteenthSpace)){
            nextJump = true
            mustMove = [selectedPiece.pieceId]
        }
    }
    if (nextJump){
        nextJump = false
        givePiecesEventListeners(mustMove)
    }else{
        mustMove = []
        resetSelectedPieceProperties();
        removeCellonclick();
        removeEventListeners();
    }
}

// removes the 'onClick' event listeners for pieces
function removeEventListeners() {
    if (turn) {
        for (let i = 0; i < redsPieces.length; i++) {
            redsPieces[i].removeEventListener("click", getPlayerPieces);
        }
    } else {
        for (let i = 0; i < blacksPieces.length; i++) {
            blacksPieces[i].removeEventListener("click", getPlayerPieces);
        }
    }
    checkForWin();
}

// Checks for a win
function checkForWin() {
    if (blackScore === 0) {
        for (let i = 0; i < redTurnText.length; i++) {
            redTurnText[i].style.color = "black";
            blackTurnText[i].style.display = "none";
            redTurnText[i].textContent = "RED WINS!";
        }
        $.ajax({
            url: '/end_game/',
            type: 'POST',
            data: {
                    'score': redScore,
                    'player': 'player1',
                    'board': textContent,
                    'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
                },
                success: function(response) {
                    window.location.href = '/';
                },
        });
    } else if (redScore === 0) {
        for (let i = 0; i < blackTurnText.length; i++) {
            blackTurnText[i].style.color = "black";
            redTurnText[i].style.display = "none";
            blackTurnText[i].textContent = "BLACK WINS!";
        }
        $.ajax({
            url: '/end_game/',
            type: 'POST',
            data: {
                    'score': blackScore,
                    'player': 'player2',
                    'board': textContent,
                    'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
                },
                success: function(response) {
                    window.location.href = '/';
                },
        });
    }
    changePlayer();
}

// Switches players turn
function changePlayer() {
    $.ajax({
    async: false,
    url: '/change/',
    type: 'POST',
    data: {
            'turn': turn,
            'player': player,
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function (response) {
            if (response.turn){
                if (response.player === '1'){
                    redsPieces.forEach((function(x){x.setAttribute('style', 'pointer-events: none')}))
                    blacksPieces.forEach((function(x){x.setAttribute('style', 'pointer-events: none')}))
                }
                if (response.player === '2'){
                    blacksPieces.forEach((function(x){x.setAttribute('style', 'pointer-events: auto')}))
                    redsPieces.forEach((function(x){x.setAttribute('style', 'pointer-events: none')}))
                }

            }else{
                if (response.player === '1'){
                    blacksPieces.forEach((function(x){x.setAttribute('style', 'pointer-events: none')}))
                    redsPieces.forEach((function(x){x.setAttribute('style', 'pointer-events: auto')}))
                }
                if (response.player === '2'){
                blacksPieces.forEach((function(x){x.setAttribute('style', 'pointer-events: none')}))
                redsPieces.forEach((function(x){x.setAttribute('style', 'pointer-events: none')}))
                }
            }
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
        }
    });

    if (turn) {
        turn = false;
        for (let i = 0; i < redTurnText.length; i++) {
            redTurnText[i].style.color = "lightGrey";
            blackTurnText[i].style.color = "black";
        }
    } else {
        turn = true;
        for (let i = 0; i < blackTurnText.length; i++) {
            blackTurnText[i].style.color = "lightGrey";
            redTurnText[i].style.color = "black";
        }
    }
    givePiecesEventListeners();
}

var hostname = window.location.hostname;
const socket = new WebSocket(`ws://${hostname}/board-${textContent}/`);
//const socket = new WebSocket(`ws://127.0.0.1:8000/board-${textContent}/`);
socket.addEventListener('open', (event) => {
    console.log('Соединение установлено');
    var modal = document.getElementById("myModal");
    modal.style.display = "block";

});
socket.addEventListener('message', (event) => {

    var messageData = JSON.parse(event.data);
    var message = JSON.parse(messageData.move.message)
    number = message.number
    selectedPiece = message.selectedPiece
    makeMove(number)


});
function checkPlayers(){
    $.ajax({
    async: false,
    url: '/check/',
    type: 'POST',
    data: {
            'check': 'check',
            'board': textContent,
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function (response) {
            if (response.check){
                clearInterval(intervalId);
                var modal = document.getElementById("myModal");

                modal.style.display = "none";
                givePiecesEventListeners();
            }
        }


    });
}
let intervalId = setInterval(checkPlayers, 5000);
