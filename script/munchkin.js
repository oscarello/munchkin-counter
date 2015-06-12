/* munchkin.js - A Munchkin Counter
 *
 * Oscar Estrada 2015
 */

var currentPlayers = [];

function addPlayer() {
    var newPlayerName = $("#txtPlayerName").val();

    if (newPlayerName.length > 0) {
        /* Add player to current players */
        var newPlayer = {name:newPlayerName,
                         wins:0
                        };
        currentPlayers.push(newPlayer);

        /* Sort and display the users list */
        sortJSON(currentPlayers, 'name', "asc");
        updateUsersTable();

        /* Clear the player name texted and make the txt to acquire focus. */
        $("#txtPlayerName").val("");
        $("#txtPlayerName").focus();
     }
    return false;
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

    var levelPoints = filterInt($("#txtLevelPoints" + player).val());
    var itemPoints = filterInt($("#txtItemPoints" + player).val());
    strengthSpan.innerText= levelPoints + itemPoints;

    // If someone won
    if (levelPoints >= 10) {
        $("#btnEndGame").attr("onclick", "endGame(" + player + ")").show();
        $("#btnContinue").show();

        $("#winnerSpan").text(currentPlayers[player].name);
        $("#resultsRow").show();
    }
}

function beginGame(){
    /* We make sure we start without any remnants from an old game. */
    $("#playersRow").empty();

    /* We shouldn't display any winner results yet. */
    $("#resultsRow").hide();

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
            + "size='2' onkeyup='updateStrength(" + index + ")' class='txtLevelPoints'></input><br>"
            + "<label for 'txtItemPoints'>Items</label>"
            + "<input type='text' name='txtItemPoints" + index + "' id='txtItemPoints" + index + "' value='0' "
            + "size='2' onkeyup='updateStrength(" + index + ")' class='txtItemPoints'></input><br>"
            + "</form";

        playerDiv.appendChild(playerStatsDiv);

        var playerStrengthDiv = document.createElement("div");
        playerStrengthDiv.id = "playerStrengthDiv" + index;
        playerStrengthDiv.className = "player-strength-div";

        playerStrengthDiv.innerHTML =
             "<span class='strengthSpan' id='strengthSpan" + index + "'>0</span>";

        playerDiv.appendChild(playerStrengthDiv);

        mainContainer.appendChild(playerDiv);
    }

    /* We shouldn't make any hanges on the players at this point */
    $("#setupRow").hide( 500 );
    $("#playersRow").show();

    $("#btnBeginGame").hide();
    $("#btnCancelGame").show();

    return false;
}

function cancelGame() {
    $("#setupRow").show( 500 );
    $("#playersRow").hide();

    $("#btnBeginGame").show();
    $("#btnCancelGame").hide();

    /* We get rid of the canceled game points */
    $("#playersRow").empty();
}

function endGame(player) {
    /* Update and show the players games won data */
    currentPlayers[player].wins = Number(currentPlayers[player].wins) + 1;
    updateUsersTable();

    $("#setupRow").show( 500 );
    $("#btnBeginGame").show();
    $("#btnCancelGame").hide();

    /* We hide these buttons so no-one can win twice by mistake, we don't hide
       the results div because we want to show the last winner */
    $("#btnEndGame").hide();
    $("#btnContinue").hide();

    /* We also want to show the last game player stats, but they shouldn't be modifiable */
    $(".txtLevelPoints").prop("disabled", true);
    $(".txtItemPoints").prop("disabled", true);
}

function continueGame() {
    $("#resultsRow").hide();
}
