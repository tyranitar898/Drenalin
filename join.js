var currentUserUID = "";
var currentName;
var TP;
var TT;
var GPW;
var WTPO;
var realnameArray;
var leaguesched;
var currentEvent;
var ListOfImgurUrl_OBJ = new Object();
var CommentsofEvent;
var totalSpot = 0;

var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

var listOfNameincurrentEvent = [];
var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];
var currentEventOBJ;

var listOfUid;

var thisEventLeage;
//create callback fucntion that dsiables THE 

// start fucntion that gets all infor from event node
function getStff() {
    var rootRef = new Firebase('https://sportnetwork.firebaseio.com')
    myEvent = document.getElementById('events');

    //var currentUserUID = loggedIn();


    rootRef.onAuth(authDataCallback);
    var authData = rootRef.getAuth();
    if (authData) {
        //console.log("Authenticated user with uid:", authData.uid);
        var thisref = new Firebase('https://sportnetwork.firebaseio.com/Users/' + authData.uid);
        thisref.once("value", function(snap) {
            currentName = snap.val().Full_Name;
            document.getElementById("userImage").src = snap.val().AWS_Photo_URL;
            document.getElementById("userNameTop").innerHTML = snap.val().Full_Name;
        });
        //logged in, check if he is in any events and load accordigly
        console.log("Logged in as   " + authData.uid)
        loadEventInfo(authData.uid);
        currentUserUID = authData.uid;

    } else {
        //this guy is not logged in!
        loadEventInfo("");
    }


    document.getElementById("login").addEventListener("click", checkiflogged);
    document.getElementById("loginButton").addEventListener("click", loginFirebase);



}
//loads the list view of each event.
function loadEventInfo(ID) {

    var rootRef = new Firebase('https://sportnetwork.firebaseio.com')



    eventRef = rootRef.child('Events')
    eventRef.on("child_added", function(snapshot, prevChildKey) {
        var newPost = snapshot.val();
        name = newPost.Name;
        //list of people in each event
        namesofppl = newPost.UsersInEvent;
        var NamesofPPLinthisEvent = convertLeagueArraytoUIDonly(namesofppl);

        var eventtime = newPost.Time;
        var eventname = newPost.Name;
        //creates elements
        //left
        var leftDiv = document.createElement('div');
        var newEvent = document.createElement('article');
        var nameOfEvent = document.createElement('h1');
        var locationOfEvent = document.createElement('p');
        var typeOfEvent = document.createElement('p');
        var spotsOfEvent = document.createElement('p');

        //right
        var rightDiv = document.createElement('div');
        var joinImage = document.createElement('img');
        var status = document.createElement('p');
        var referName = document.createElement('p');

        //adds tags
        newEvent.setAttribute('class', 'event');
        newEvent.setAttribute('id', newPost.Name);
        leftDiv.setAttribute('id', "leftDiv");
        rightDiv.setAttribute('id', "rightDiv");

        if (ID == "") {
            // not logged in, so all events will hvae a unclicked join button
            joinImage.setAttribute('src', 'Joinbutton_unclicked.png');
            joinImage.setAttribute('onmouseover', "this.src='Joinbutton_unclick_hover.png'");
            joinImage.setAttribute('onmouseout', "this.src='Joinbutton_unclicked.png'");
            joinImage.setAttribute('id', eventname + "JIB");

        } else {
            //this guy is logged in.
            if (NamesofPPLinthisEvent.indexOf(ID) > -1) {
                //joined
                joinImage.setAttribute('src', 'Joinbutton_clicked.png');
                joinImage.setAttribute('onmouseover', "this.src='Joinbutton_clicked_hover.png'");
                joinImage.setAttribute('onmouseout', "this.src='Joinbutton_clicked.png'");
                joinImage.setAttribute('id', eventname + "JIB");
                //joinButton Change from join to un join.

            } else {
                //not joined
                joinImage.setAttribute('src', 'Joinbutton_unclicked.png');
                joinImage.setAttribute('onmouseover', "this.src='Joinbutton_unclick_hover.png'");
                joinImage.setAttribute('onmouseout', "this.src='Joinbutton_unclicked.png'");
                joinImage.setAttribute('id', eventname + "JIB");
            }

        };


        referName.setAttribute('id', 'referName');

        joinImage.onclick = displayeventDetail;

        spotsOfEvent.setAttribute('id', "spotsRemainingHTML");


        //copies from fire base to text of elements
        nameOfEvent.textContent = newPost.Name;
        locationOfEvent.textContent = "Location: " + newPost.Location;
        typeOfEvent.textContent = "Time of Event: " + newPost.Time;
        spotsOfEvent.textContent = "Spots left: " + newPost.TotalSpotsAvaliable;
        referName.textContent = newPost.Name;


        status.setAttribute('id', "timeRemaining");


        var hoursleft = (getTimeRemaining(eventtime).days) * 24 + getTimeRemaining(eventtime).hours;
        var minutesleft = (getTimeRemaining(eventtime).minutes);

        if (getTimeRemaining(eventtime).total < 0) {
            status.textContent = "Game in Progress";
        } else {
            status.textContent = hoursleft + "h " + minutesleft + "m";
        }


        //appends elements to leftdiv
        leftDiv.appendChild(nameOfEvent);
        leftDiv.appendChild(locationOfEvent);
        leftDiv.appendChild(typeOfEvent);
        leftDiv.appendChild(spotsOfEvent);


        //appends elements to rightdiv

        rightDiv.appendChild(status);
        rightDiv.appendChild(referName);
        rightDiv.appendChild(joinImage);


        //appends divs to article
        newEvent.appendChild(leftDiv);
        newEvent.appendChild(rightDiv);


        //appends article to html
        document.getElementById("article_holder").appendChild(newEvent);


    });


}

function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

//array of people NOT including "N/A" in the event you click on


//
var fullListofPeopleinCurrentEvent = new Array();
var currentEvent = "";
var FullEventName = "";


//creates a elague schuelde table using the 4 input numbers.
function createTableUsingSched(a, realTN, finGPW, finWTPO) {
    $('#leagueSched').empty();
    //FIRST COL SPECIAL
    var htmlrow0 = document.createElement('tr');
    for (var col = 0; col < (finWTPO + 2); col++) {
        var htmlcol = document.createElement('td');
        if (col == 0) {
            htmlcol.innerHTML = "";
        } else if (col == finWTPO + 1) {
            htmlcol.innerHTML = "Playoffs";
        } else {
            htmlcol.innerHTML = "Week" + col;
        }
        htmlrow0.appendChild(htmlcol);
    }
    document.getElementById("leagueSched").appendChild(htmlrow0);

    //ALL OTHER COLs
    for (var row = 0; row < finGPW; row++) {
        var htmlrow = document.createElement('tr');
        var htmlcol = document.createElement('td');

        htmlcol.innerHTML = "Game " + (row + 1);
        htmlrow.appendChild(htmlcol);



        var winLoseInput = document.createElement('input');
        //teamsName.setAttribute('type', 'text');

        for (var col = 1; col < (finWTPO + 2); col++) {

            var htmlcol = document.createElement('td');
            if (col == finWTPO + 1) {
                htmlcol.innerHTML = "Undertermined";
                htmlrow.appendChild(htmlcol);
            } else {
                var battle = a[col - 1][row];
                var team1 = battle.substring(0, 1);
                var team2 = battle.substring(1, 2);
                //

                htmlcol.innerHTML = realTN[team1] + "  vs.\n" + realTN[team2];

            }
            htmlrow.appendChild(htmlcol);

        }

        document.getElementById("leagueSched").appendChild(htmlrow);
    }
}
//fucntion to submit a new team name for a leauge
function updateTeamNameToFirebase(updateTeamLetter, newTeamName) {
    if (newTeamName == "") {
        return;
    }
    updateTeamNameRef = new Firebase('https://sportnetwork.firebaseio.com/Events/' + currentEvent + '/League/' + updateTeamLetter);

    updateTeamNameRef.update({
        "name": newTeamName
    });
    // console.log(currentLeagueOBJ);
    var RT = getRealNameArrayFromFirebase(currentEventOBJ.League);
    $('#leagueSched').empty();
    createTableUsingSched(leaguesched, RT, GPW, WTPO);

    return false;
}

//displays the place to edit the team anmes
function leagueTeamNameSubmitDisplay(totalTeams, team) {
    $('#leagueTeam').empty();
    //var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];

    var maxWidth = 0;
    for (var i = 0; i < totalTeams; i++) {
        var teamName = thisEventLeage[letters[i]]["name"];
        var teamNameLen = teamName.length;
        var width = teamNameLen * 1.5;
        if (maxWidth < width) {
            maxWidth = width;
        }
    }

    for (var x = 0; x < totalTeams; x++) {
        var teams = document.createElement('p');
        var teamName = thisEventLeage[letters[x]]["name"];
        teams.textContent = teamName;
        var teamNameLen = teamName.length;
        var width = 20;
        var width2 = 100 - width - maxWidth;
        teams.setAttribute('style', 'width: ' + maxWidth + '%;');

        var joinTeamSubmit = document.createElement('input');
        joinTeamSubmit.setAttribute('name', letters[x]);
        joinTeamSubmit.setAttribute('type', 'submit');
        joinTeamSubmit.setAttribute('value', 'Join this Team!');
        joinTeamSubmit.setAttribute('onclick', 'joinLeagueEvent(this.name)');
        joinTeamSubmit.className = "join_team";
        joinTeamSubmit.setAttribute('style', 'width: ' + width + '%; margin-right: ' + width2 + '%;');
        //firebaseupdate people in the teams #joining

        document.getElementById("leagueTeam").appendChild(teams);

        if (team == letters[x]) {
            displayTeamSubmit(x, width);
        } else {
            document.getElementById("leagueTeam").appendChild(joinTeamSubmit);
        }

    }

}

//displays the place players can change team name
function displayTeamSubmit(index, width) {
    var teamsName = document.createElement('input');
    teamsName.setAttribute('type', 'text');
    teamsName.setAttribute('id', 'teamName');
    teamsName.setAttribute('placeholder', 'Enter Team Name here');

    var teamSubmit = document.createElement('input');
    teamSubmit.setAttribute('name', letters[index]);
    teamSubmit.setAttribute('type', 'submit');
    teamSubmit.setAttribute('onclick', 'updateTeamNameToFirebase(this.name,this.previousSibling.value)');
    teamSubmit.className = "submit_team";
    var width2 = 100 - width - 50 - 10;
    teamSubmit.setAttribute('style', 'width: 10%; margin-right: ' + width2 + '%;')

    document.getElementById("leagueTeam").appendChild(teamsName);
    document.getElementById("leagueTeam").appendChild(teamSubmit);
}

//no paramenter cuz its based on currentEvent variable!
// gets the real name of the teams from the firebase league OBJ
function getRealNameArrayFromFirebase(thisEventLeage) {
    //var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];
    realnameArray = [];


    for (var x = 0; x < TT; x++) {
        var almost = thisEventLeage[letters[x]];

        var RN = almost["name"];

        realnameArray[letters[x]] = RN;

    }
    return realnameArray;
}



//change teams names form Team A.... to Team Aamz!


function displayLeaguePPLName(amountofTeam, pplArray, isLeagueOrNot) {

    leagueTeamPPL = document.getElementById('leaguePPL');
    leagueTeamPPL.className = "empty"

    if (isLeagueOrNot) {

        //var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];
        leagueTeamPPL.innerHTML = "";

        var pplwithoutNA = new Array();
        var pplTeamOnly = new Array();



        for (var x = 0; x < pplArray.length; x++) {
            if (pplArray[x] != "N/A") {
                var uid_Team = pplArray[x] + '';
                var fi = uid_Team.split(":");

                pplwithoutNA.push(fi[0]);

                if (fi[1] == undefined) {
                    pplTeamOnly.push("NoTeam");
                } else {
                    pplTeamOnly.push(fi[1]);
                }
            }

        }



        for (var x = 0; x < amountofTeam; x++) {
            var displayingARR = new Array();

            var htmlr = document.createElement('tr');
            htmlr.setAttribute('id', letters[x]);

            var htmlc0 = document.createElement('td');
            var teamName = thisEventLeage[letters[x]]["name"];
            htmlc0.innerHTML = teamName + "("+letters[x].toUpperCase() + ")";
            htmlr.appendChild(htmlc0);

            var emptySpotsPerTeam = (10);
            for (var y = 0; y < emptySpotsPerTeam; y++) {
                var htmlc = document.createElement('td');
                htmlc.innerHTML = "";
                htmlr.appendChild(htmlc);
            }
            //console.log(displayingARR);
            leagueTeamPPL.appendChild(htmlr);
            leagueTeamPPL.className = "not_empty";

        }
    }
}

function convertOBJtoARR(obj) {
    var finallist = new Array();
    $.each(obj, function(index, value) {
        finallist.push(value);
    });
    return finallist;
}

function postMatchResult(e) {
	e.preventDefault();
    var comment = document.getElementById('matchText').value;
    var winloseteamarr = comment.toLowerCase().split(",")
    var winT = winloseteamarr[0];
    var loseT = winloseteamarr[1];


    var winteam = thisEventLeage[winloseteamarr[0]];
    var loseteam = thisEventLeage[winloseteamarr[1]];

    var winningTeamNewWins = winteam.win + 1;
    var losingTeamNewLose = loseteam.lose + 1;
    

    
    updateMatchRef0 = new Firebase('https://sportnetwork.firebaseio.com/Events/' + currentEvent + '/League/' + winloseteamarr[0]);

    updateMatchRef0.update({
        "win": winningTeamNewWins,
    });
    updateMatchRef1 = new Firebase('https://sportnetwork.firebaseio.com/Events/' + currentEvent + '/League/' + winloseteamarr[1]);

    updateMatchRef1.update({
        "lose": losingTeamNewLose,
    });

    

}

function postComment(e) {
    var comment = document.getElementById('commentText').value;
    var n = new Date();

    var y = n.getFullYear();
    var m = n.getMonth();
    var d = n.getDate();
    var h = n.getHours();
    var min = n.getMinutes();
    if (min < 10) {
        min = "0" + min;
    }
    var finalCom = CommentsofEvent + "On " + monthNames[m] + "/" + d + " " + h + ":" + min + " " + currentName + " said \"" + comment + "\",";
    updateCommentRef = new Firebase('https://sportnetwork.firebaseio.com/Events/' + currentEvent);

    updateCommentRef.update({
        "Comments": finalCom,
    });
    e.preventDefault();

}

//displays the event detail window
function displayeventDetail() {

    userListDiv = document.getElementById('usersInEvent');
    leagueSchedDiv = document.getElementById('leagueSched');
    leagueSchedDiv.className = "empty"
    leagueTeamPPL = document.getElementById('leaguePPL');

    userListDiv.innerHTML = "";
    leagueSchedDiv.innerHTML = "";
    FullEventName = "";
    fullListofPeopleinCurrentEvent = [];
    currentEvent = "";

    leagueTeamPPL.innerHTML = "";

    currentEventOBJ = new Object();

    var joinimagefilestring = this.src;
    var almost = this.previousSibling.innerHTML;


    document.getElementById("joinEventButton").addEventListener("click", joinEvent);


    var clickedEventName = almost.toLowerCase();
    currentEvent = almost.toLowerCase();
    FullEventName = almost;

    $('#pop_background').fadeIn();
    $('#pop_box2').fadeIn();


    var rootRef = new Firebase('https://sportnetwork.firebaseio.com');

    eventRef = rootRef.child('Events');
    clickedRef = eventRef.child(clickedEventName);
    clickedRef.on("value", function(snapshot) {
        ListOfImgurUrl_OBJ = new Object();
        document.getElementById('eventdetail_eventname').innerHTML = snapshot.val().Name;
        document.getElementById('eventdetail_eventdescription').innerHTML = "Event Description: " + snapshot.val().EventDescription;
        document.getElementById('eventdetail_Location').innerHTML = "Location: " + snapshot.val().Location;
        document.getElementById('eventdetail_Type').innerHTML = "Type of Event: " + snapshot.val().Type;
        document.getElementById('eventdetail_Class').innerHTML = "This is a " + snapshot.val().EventClass + " event";
        document.getElementById('eventdetail_Time').innerHTML = "Time of Event: " + snapshot.val().Time;
        document.getElementById('eventdetail_TotalSpotsAvaliable').innerHTML = "Spots left: " + snapshot.val().TotalSpotsAvaliable;


        var firebaseComment = snapshot.val().Comments.split(",");
        var finalcommentstring = "";
        for (var x = 0; x < firebaseComment.length; x++) {
            finalcommentstring = finalcommentstring + firebaseComment[x] + "<br>";
        }


        document.getElementById('eventComment').innerHTML = finalcommentstring;

        CommentsofEvent = snapshot.val().Comments;
        totalSpot = snapshot.val().TotalSpotsAvaliable;
        thisEventLeage = snapshot.val().League;
        currentEventOBJ = snapshot.val();
        ListOfImgurUrl_OBJ = snapshot.val().UsersInEvent;
        console.log("this Events firebase data has been fucked with")

        listOfUid = ListOfImgurUrl_OBJ;
        var finalAPPLARR = convertOBJtoARR(listOfUid);

        var team;
        if (currentUserUID == null) {
            team = '0';
        } else {
            for (var u = 0; u < listOfUid.length; u++) {
                var current = listOfUid[u];
                var temp = current.split(":");
                if (current == "N/A") {
                    break;
                } else if (temp[0] == currentUserUID) {
                    team = temp[1];
                }
            }
        }


        // a league event
        if (thisEventLeage != undefined) {
            console.log("this is a league event");

            TP = thisEventLeage["zzzfuckbrandon"]["totalPlayer"];
            TT = thisEventLeage["zzzfuckbrandon"]["totalTeams"];
            GPW = thisEventLeage["zzzfuckbrandon"]["gamesPerWeek"];
            WTPO = thisEventLeage["zzzfuckbrandon"]["weeksTillPlayoff"];
            console.log(TP + " / " + TT + " / " + GPW + " / " + WTPO + " / ");
            console.log("leaue has been touched");
            leaguesched = schedule(TP, TT, GPW, WTPO);

            displayorderedLeagueStandings(thisEventLeage);


            var RT = getRealNameArrayFromFirebase(thisEventLeage);
            createTableUsingSched(leaguesched, RT, GPW, WTPO);
            leagueTeamNameSubmitDisplay(TT, team);
            leagueSchedDiv.className = "not_empty"

            document.getElementById('commentSubmit').addEventListener("click", postComment);


            //order the wins and loses by has most wins by array since firebase is asycnhronus

        } else {
            //not a league event
            console.log("this is NOT a league event");
            $('#leagueTeam').empty();
            $('#pplLeagueTitle').empty();
        }

        //league PPL name display
        var isLeagueORN = (currentEventOBJ.League != undefined);
        displayUsersInEvent(finalAPPLARR);
        displayLeaguePPLName(TT, finalAPPLARR, isLeagueORN);

        //comment button func!
        document.getElementById('matchSubmit').addEventListener("click", postMatchResult);

        var without = convertLeagueArraytoUIDonly(finalAPPLARR);

        if (without.indexOf(currentUserUID) > -1) {
            //this guy is in this event
            //console.log("this guy is in the event")

            document.getElementById("joinEventButton").value = "Leave this event";
        } else {
            //this guy is not in this event
            //console.log("this guy is NOT in the event")
            document.getElementById("joinEventButton").value = "Join this event";
        }

    });


    $('#pop_background').click(function() {

        $('#pop_background').fadeOut();
        $('#pop_box2').fadeOut();
        userListDiv.innerHTML = "";
        leagueSchedDiv.innerHTML = "";
        FullEventName = "";
        fullListofPeopleinCurrentEvent = [];
        currentEvent = "";
        ListOfImgurUrl_OBJ = new Object();
        leagueTeamPPL.innerHTML = "";
        listOfNameincurrentEvent = [];


    });

}

function sortNumber(a, b) {
    return a.win - b.win;
}

function displayorderedLeagueStandings(LeagueOBJ) {
	$('#leagueRanking').empty();
    var leagueARR = convertOBJtoARR(LeagueOBJ);
    leagueARR.pop();


    console.log(leagueARR);
    var orderedstandings = new Array();
    //create for loop that goes backwards and prints out the team with most wins.
    for (var x = 0; x < leagueARR.length; x++) {
        var currentTeam = leagueARR[x];

        var temp = currentTeam.win / (currentTeam.win + currentTeam.lose);
        if (isNaN(temp)) {
            temp = 0;
        }
        currentTeam.winrate = temp;
        orderedstandings.push(currentTeam);
    }
    console.log(orderedstandings);


    orderedstandings.sort(function(a, b) {
        return b.winrate - a.winrate
    });
    console.log(orderedstandings);
    var rankingDiv = document.getElementById("leagueRanking");

    for (var i = 0; i < orderedstandings.length; i++) {
        var teamnames = document.createElement('p');
        var temp = "Rank "+ (i+1)+" : "+orderedstandings[i].name + ' ' + (" wins: " + orderedstandings[i].win) + ("  loses: " + orderedstandings[i].lose);
        teamnames.textContent = temp
        rankingDiv.appendChild(teamnames);

    }





}
//displays the picture of the users who are in this event.
function displayUsersInEvent(listOfUid) {
    $('#usersInEvent').empty();

    console.log(listOfUid)

    var userListDiv = document.getElementById("usersInEvent");

    for (var i = 0; i < listOfUid.length; i++) {
        var x = listOfUid[i] + "";
        var realUID;
        if (x.indexOf(":") > -1) {
            //league -ed person
            var y = x.split(":");
            realUID = y[0]
        } else {
            realUID = x;
        }

        if (realUID != "N/A") {
            //prints each user in the event
            var userRef = new Firebase('https://sportnetwork.firebaseio.com/Users/' + realUID);
            userRef.off();
            userRef.once("value", function(snapshot, prevChildKey) {

                var uid = snapshot.key();
                var name = snapshot.val().Full_Name;
                listOfNameincurrentEvent.push(uid + ";" + name);

                var userDiv = document.createElement('div');
                userDiv.setAttribute('id', 'userDiv');

                var userImage = document.createElement('img');
                userImage.setAttribute('src', snapshot.val().AWS_Photo_URL);
                var userName = document.createElement('p');
                userName.textContent = name;

                userDiv.appendChild(userImage);
                userDiv.appendChild(userName);
                userListDiv.appendChild(userDiv);

                if (currentEventOBJ.League != undefined) {
                    var team = -1;
                    leagueTeamPPL = document.getElementById('leaguePPL');
                    for (var i = 0; i < ListOfImgurUrl_OBJ.length; i++) {
                        temp = ListOfImgurUrl_OBJ[i].split(":");
                        if (temp[0] == uid) {
                            team = temp[1];
                        }
                    }
                    if (team != undefined) {
                        letters.indexOf(team)
                        row = leagueTeamPPL.rows[letters.indexOf(team)].cells;

                        for (var c = 1; c < row.length; c++) {
                            if (row[c].innerHTML == "") {
                                row[c].innerHTML = name;
                                break;
                            }
                        }
                    }
                }

            });

        }
    }



    //console.log(listOfNameincurrentEvent)
}

function product_Range(a, b) {
    var prd = a,
        i = a;

    while (i++ < b) {
        prd *= i;
    }
    return prd;
}

function combinations(n, r) {
    if (n == r) {
        return 1;
    } else {
        r = (r < n - r) ? n - r : r;
        return product_Range(r + 1, n) / product_Range(1, n - r);
    }
}

function combinationArray(str) {
    var fn = function(active, rest, a) {
        if (!active && !rest)
            return;
        if (!rest) {
            a.push(active);
        } else {
            fn(active + rest[0], rest.slice(1), a);
            fn(active, rest.slice(1), a);
        }
        return a;
    }
    return fn("", str, []);
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
//the fucntion that reutrsn the array of the league scheudle.
function schedule(totalPlayer, numTeams, gamesWeek, totalWeeks) {
    //output: 
    var gameCycle = combinations(numTeams, 2);
    var weekCycle = gameCycle / gamesWeek;
    //var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];
    var teamsString = "";
    for (var i = 0; i < numTeams; i++) {
        teamsString = teamsString + letters[i];
    }

    var c = combinationArray(teamsString)
    var teamCombo = []

    for (var i = 0; i < c.length; i++) {
        if (c[i].length == 2) {
            teamCombo.push(c[i])
        }
    }

    //teamCombo = shuffle(teamCombo);

    //return teamCombo;
    var sched = [];
    var index = 0;
    for (var i = 0; i < totalWeeks; i++) {
        sched.push([]);
        for (var j = 0; j < gamesWeek; j++) {
            var game = teamCombo[index % teamCombo.length];
            sched[i].push(game);
            index += 1;
        }
    }

    return sched;
}


function authDataCallback(authData) {
    if (authData) {

        document.getElementById("login").innerHTML = "Logout";

    } else {
        //console.log("User is logged out");
        document.getElementById("login").innerHTML = "Login";

    }
}

function checkiflogged() {
    var button_id = this.id;


    if (button_id == "login") {
        document.getElementById("titletext").innerHTML = "Log in with your Drenalin ID";
    }


    if (document.getElementById("login").innerHTML == "Login") {


        $('#pop_background').fadeIn();
        $('#pop_box').fadeIn();



    } else {
        logoutFirebase();
        document.getElementById("login").innerHTML = "Login";
        document.getElementById("userImage").src = "nouser2.png";
        document.getElementById("userNameTop").innerHTML = "Not logged In";
    }
    $('#pop_background').click(function() {

        $('#pop_background').fadeOut();
        $('#pop_box').fadeOut();
        document.getElementById("login").innerHTML = "Login";

    });
}

function loginFirebase(e) {
    e.preventDefault()
    var rootref = new Firebase('https://sportnetwork.firebaseio.com')

    var userEmail = document.getElementById("email").value;
    var userPass = document.getElementById("pass").value;

    rootref.authWithPassword({
        email: userEmail,
        password: userPass
    }, authHandler);



    function authHandler(error, authData) {

        if (error) {
            //console.log("Login Failed!", error);
            $("#pop_box").effect("shake", { times: 4 }, 800);


        } else {
            //console.log("Authenticated successfully with payload:", authData);
            var thisref = new Firebase('https://sportnetwork.firebaseio.com/Users/' + authData.uid);
            thisref.once("value", function(snap) {

                document.getElementById("userImage").src = snap.val().AWS_Photo_URL;
                document.getElementById("userNameTop").innerHTML = snap.val().Full_Name;
            });

            $('#pop_background').fadeOut();
            $('#pop_box').fadeOut();
            document.getElementById("login").innerHTML = "Logout";
            location.reload();

        }

    }

}


function logoutFirebase() {
    var rootref = new Firebase('https://sportnetwork.firebaseio.com');
    rootref.unauth();
    location.reload();
}
//conversts the people list into UID + Team 
function convertLeagueArraytoUIDonly(inputArray) {
    var fullListofPeopleinCurrentEvent = new Array();
    $.each(inputArray, function(index, value) {
        fullListofPeopleinCurrentEvent.push(value);
    });


    for (var i = 0; i < fullListofPeopleinCurrentEvent.length; i++) {
        //sometimes you may be displaying an league event and the data has both their UID and their team besdie it.
        var x = fullListofPeopleinCurrentEvent[i] + '';
        var realUID = x.split(":");

        fullListofPeopleinCurrentEvent[i] = realUID[0]

    }
    return fullListofPeopleinCurrentEvent
}
//joins the event
function joinEvent(e) {
    e.preventDefault();
    var rootref = new Firebase('https://sportnetwork.firebaseio.com');
    var authData = rootref.getAuth();
    var x = document.getElementById("eventdetail_eventname").innerHTML;
    var current_event = x.toLowerCase();
    if (authData == null) {
        swal("Not logged in", "You must be logged in to join an event!")

    } else {

        //UR LOGGED IN

        usersinEventRef = new Firebase('https://sportnetwork.firebaseio.com/Events/' + current_event + '/UsersInEvent');


        var buttonStringValue = this.value;
        var x = 0
        if (buttonStringValue == "Leave this event") {

            var converted = convertLeagueArraytoUIDonly(ListOfImgurUrl_OBJ);

            var indexOfLeavingSpot = converted.indexOf(currentUserUID);

            //update the guy who is joinging with the coreresponding firebase spot
            usersinEventRef = new Firebase('https://sportnetwork.firebaseio.com/Events/' + currentEvent + '/UsersInEvent');
            var theGuyWhoIsLeaving = {};
            theGuyWhoIsLeaving[indexOfLeavingSpot] = "N/A";
            //update total spots left in firebase
            usersinEventRef.update(theGuyWhoIsLeaving);
            //console.log(indexOfLeavingSpot)
            thisEventRef = new Firebase('https://sportnetwork.firebaseio.com/Events/' + currentEvent);
            thisEventRef.update({
                "TotalSpotsAvaliable": totalSpot + 1
            });
            usersinEventRef = new Firebase('https://sportnetwork.firebaseio.com/Events/' + current_event + '/UsersInEvent');

            var urlARR = convertOBJtoARR(ListOfImgurUrl_OBJ);

            displayUsersInEvent(urlARR);

            var isLeagueORN = (currentEventOBJ.League != undefined);

            displayLeaguePPLName(TT, urlARR, isLeagueORN);

            document.getElementById("joinEventButton").value = "Join this event";

            var thisEventJoinImageButton = document.getElementById(currentEventOBJ.Name + "JIB");
            thisEventJoinImageButton.setAttribute('src', 'Joinbutton_unclicked.png');
            thisEventJoinImageButton.setAttribute('onmouseover', "this.src='Joinbutton_unclick_hover.png'");
            thisEventJoinImageButton.setAttribute('onmouseout', "this.src='Joinbutton_unclicked.png'");


        }
        if (buttonStringValue == "Join this event") {
            var converted = convertLeagueArraytoUIDonly(ListOfImgurUrl_OBJ);
            var indexOfEmptySpot = converted.indexOf("N/A");
            //update the guy who is joinging with the coreresponding firebase spot
            usersinEventRef = new Firebase('https://sportnetwork.firebaseio.com/Events/' + current_event + '/UsersInEvent');
            var theGuyWhoIsJoining = {};
            theGuyWhoIsJoining[indexOfEmptySpot] = authData.uid;
            usersinEventRef.update(theGuyWhoIsJoining);
            //update the total spot count
            thisEventRef = new Firebase('https://sportnetwork.firebaseio.com/Events/' + current_event);
            thisEventRef.update({
                "TotalSpotsAvaliable": totalSpot - 1
            });
            usersinEventRef = new Firebase('https://sportnetwork.firebaseio.com/Events/' + current_event + '/UsersInEvent');
            var urlARR = convertOBJtoARR(ListOfImgurUrl_OBJ);
            displayUsersInEvent(urlARR);



            var isLeagueORN = (currentEventOBJ.League != undefined);
            displayLeaguePPLName(TT, urlARR, isLeagueORN);

            document.getElementById("joinEventButton").value = "Leave this event"

            var thisEventJoinImageButton = document.getElementById(currentEventOBJ.Name + "JIB");
            thisEventJoinImageButton.setAttribute('src', 'Joinbutton_clicked.png');
            thisEventJoinImageButton.setAttribute('onmouseover', "this.src='Joinbutton_clicked_hover.png'");
            thisEventJoinImageButton.setAttribute('onmouseout', "this.src='Joinbutton_clicked.png'");

        }
    }
}

//joins a specific league team
function joinLeagueEvent(joiningTeamName) {
    var rootref = new Firebase('https://sportnetwork.firebaseio.com');
    var authData = rootref.getAuth();
    var x = document.getElementById("eventdetail_eventname").innerHTML;
    var current_event = x.toLowerCase();

    if (authData == null) {
        swal("Not logged in", "You must be logged in to join an event!")

    } else {
        //UR LOGGED IN

        //join succesful
        usersinEventRef = new Firebase('https://sportnetwork.firebaseio.com/Events/' + current_event + '/UsersInEvent');
        var userarray = convertLeagueArraytoUIDonly(ListOfImgurUrl_OBJ);

        var indexOfCurrentSpot = userarray.indexOf(authData.uid);
        if (indexOfCurrentSpot == -1) {
            swal("Join event", "You must join the event first!");
        }
        //he is in the event and he is picking a team for the first time
        if (indexOfCurrentSpot > -1) {
            var theGuyWhoIsJoiningALeague = {};
            theGuyWhoIsJoiningALeague[indexOfCurrentSpot] = authData.uid + ":" + joiningTeamName;
            usersinEventRef.update(theGuyWhoIsJoiningALeague);
        }

        var urlARR = convertOBJtoARR(ListOfImgurUrl_OBJ);
        displayLeaguePPLName(TT, urlARR, true);

    }

    return false;
}

window.onload = getStff
