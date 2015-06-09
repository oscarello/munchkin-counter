/* munchkin.js - A Munchkin Counter
 *
 * Oscar Estrada 2015
 */

var currentPlayers = [];

function addPlayer() {
     var newPlayerName = document.getElementById("txtPlayerName").value;

     if (newPlayerName.length > 0) {
        var newPlayer = {name:newPlayerName,
                         wins:0,
                         points:{
                             level:0,
                             gear:0
                         }};
        currentPlayers.push(newPlayer);

        sortJSON(currentPlayers, 'name', "asc");
        updateUsersTable();

        document.getElementById("txtPlayerName").value = "";
        document.getElementById("txtPlayerName").focus();
    }
}

function deletePlayer(player) {
    currentPlayers.splice(player, 1);
    updateUsersTable();
}

function sortJSON(data, key, way) {
    return data.sort(function(a,b){
        var x = a[key];
        var y = b[key];
        if (way === 'asc' ) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
        if (way === 'desc') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
}

function updateUsersTable() {
    var index;
    var tableScoreboard = document.getElementById("tableScoreboard");

    /* We cleanup the table first by deleting every row, except the first one */
    while ( tableScoreboard.rows.length > 1 ) {
        tableScoreboard.deleteRow(1);
    }

    /* Now we populate it with the players from the players array */
    for ( index = 0; index < currentPlayers.length; index++){
        var row = tableScoreboard.insertRow(index+1);
        var cellName = row.insertCell(0);
        var cellWins = row.insertCell(1);
        var cellDelete = row.insertCell(2);

        cellName.innerText = currentPlayers[index].name;
        cellWins.innerText = currentPlayers[index].wins;
        cellDelete.innerHTML = "<a href=\"javascript:void(0)\" "
            + "onclick=\"deletePlayer('" + index + "')\" "
            + "class=\"deleteUserLink\">X</a>";
    }
    return false;
}

function updateStrength(player) {
    var strengthSpan = document.getElementById("strengthSpan" + player);

    filterInt = function (value) {
        if(/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
              return Number(value);
        return 0;
    };
    
    var levelPoints = filterInt(document.getElementById("txtLevelPoints" + player).value);
    var itemPoints = filterInt(document.getElementById("txtItemPoints" + player).value);
    strengthSpan.innerText= levelPoints + itemPoints;

    
}

function beginGame(){
    var index;
    var mainContainer = document.getElementById("playersRow");
    
    for (index = 0; index < currentPlayers.length; index++){
        var playerDiv = document.createElement("div");
        playerDiv.id = "playerDiv" + index;
        playerDiv.className = "player-div";
        playerDiv.innerHTML = "<h4>" + currentPlayers[index].name + "</h4>";

        var playerStatsDiv = document.createElement("div");
        playerStatsDiv.id = "playerStatsDiv" + index;
        playerStatsDiv.className = "player-stats-div";
        playerStatsDiv.innerHTML =
            "<form id='formStats" + index + "' class='formStats'>"
            + "<label for 'txtLevelPoints'>Level</label>"
            + "<input type='text' name='txtLevelPoints" + index + "' id='txtLevelPoints" + index + "' value='0' "
            + "size='2' onkeyup='updateStrength(" + index + ")'></input><br>"
            + "<label for 'txtItemPoints'>Items</label>"
            + "<input type='text' name='txtItemPoints" + index + "' id='txtItemPoints" + index + "' value='0' "
            + "size='2' onkeyup='updateStrength(" + index + ")'></input><br>"
            + "</form";

        playerDiv.appendChild(playerStatsDiv);

        var playerStrengthDiv = document.createElement("div");
        playerStrengthDiv.id = "playerStrengthDiv" + index;
        playerStrengthDiv.className = "player-strength-div";

        playerStrengthDiv.innerHTML =
/*            "<h5>Strength</h5>"*/
             "<span class='strengthSpan' id='strengthSpan" + index + "'>0</span>";

        playerDiv.appendChild(playerStrengthDiv);

        mainContainer.appendChild(playerDiv);
    }
    return false;
}
