var finalcoords = [0, 0];

/*  <option value="single">Single Day</option>
                <option value="recurring">Every XX</option>
                <option value="league">League Event</option>*/

/* NOTESSS!!

CREATE LOCAL VARIABELS TO STORE THE CONOSLE.LOG SO THE PRESSON CAN TYP1222 BUT NOTHING W
*/

var finNumPLa = 0;
var finNumTea = 0;
var finGPW = 0;
var finWTPO = 0;

function eventTypeDropDown(selectValue) {
    cleanupTheDivsOfEvents();
    if (selectValue == "Recurring") {

        var days = ["Every Monday", "Every Tuesday", "Every Wednesday", "Every Thursday", "Every Friday", "Every Saturday", "Every Sunday"];
        var select = document.createElement('select');
        select.setAttribute('multiple', '');
        for (i = 0; i < days.length; i++) {
            var x = document.createElement('option');
            x.text = days[i];
            select.appendChild(x);

        }


        document.getElementById("leagueForm").appendChild(select);

    }

    if (selectValue == "League") {
        var numPlayer = document.createElement('input');
        numPlayer.setAttribute('type', 'text');
        numPlayer.setAttribute('id', 'numPlayer');
        numPlayer.setAttribute('placeholder', 'Enter total amoutn of players!!?? #numberonly');

        numPlayer.onkeypress = function() {
            if (event.charCode >= 48 && event.charCode <= 57) {
                numPlayer.onkeyup = function() {
                    if (this.value != "") {
                        finNumPLa = parseInt(this.value);
                    }
                };
            };
            return event.charCode >= 48 && event.charCode <= 57;
        };


        var numTeams = document.createElement('input');
        numTeams.setAttribute('type', 'text');
        numTeams.setAttribute('id', 'numTeams');
        numTeams.setAttribute('placeholder', 'Enter total amount of teams  #numberonly');

        numTeams.onkeypress = function() {
            if (event.charCode >= 48 && event.charCode <= 57) {
                numTeams.onkeyup = function() {
                    if (this.value != "") {
                        if (limit12(this.value)) {
                            finNumTea = parseInt(this.value);
                            checkall4notempty();
                        }
                    }
                };
            };
            return event.charCode >= 48 && event.charCode <= 57;
        };

        var gamesPerWeek = document.createElement('input');
        gamesPerWeek.setAttribute('type', 'text');
        gamesPerWeek.setAttribute('id', 'gamesPerWeek');
        gamesPerWeek.setAttribute('placeholder', 'Enter games per each week #numberonly');

        gamesPerWeek.onkeypress = function() {
            if (event.charCode >= 48 && event.charCode <= 57) {
                gamesPerWeek.onkeyup = function() {
                    if (this.value != "") {
                        if (limit12(this.value)) {
                            finGPW = parseInt(this.value);
                            checkall4notempty();
                        }
                    }
                };
            };
            return event.charCode >= 48 && event.charCode <= 57;
        };

        var weeksTillPlayoff = document.createElement('input');
        weeksTillPlayoff.setAttribute('type', 'text');
        weeksTillPlayoff.setAttribute('id', 'weeksTillPlayoff');
        weeksTillPlayoff.setAttribute('placeholder', 'Enter weeks until playoffs');

        weeksTillPlayoff.onkeypress = function() {
            if (event.charCode >= 48 && event.charCode <= 57) {
                weeksTillPlayoff.onkeyup = function() {
                    if (this.value != "") {
                        if (limit12(this.value)) {
                            finWTPO = parseInt(this.value);
                            checkall4notempty();
                        }
                    }
                };
            };
            return event.charCode >= 48 && event.charCode <= 57;
        };




        document.getElementById("leagueForm").appendChild(numPlayer);
        document.getElementById("leagueForm").appendChild(numTeams);
        document.getElementById("leagueForm").appendChild(gamesPerWeek);
        document.getElementById("leagueForm").appendChild(weeksTillPlayoff);


    }



}

function limit12(stringNum) {

    var num = parseInt(stringNum);
    if (num < 13) {
        return true;
    }
    return false;
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

function schedule(totalPlayer, numTeams, gamesWeek, totalWeeks) {
    //output: 
    var gameCycle = combinations(numTeams, 2);
    var weekCycle = gameCycle / gamesWeek;


    var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];
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

    teamCombo = shuffle(teamCombo);

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


function cleanupTheDivsOfEvents() {
    var container = document.getElementById("leagueForm");
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    while (schedtable.hasChildNodes()) {
        schedtable.removeChild(schedtable.lastChild);
    }

}

function checkall4notempty() {
    if (finNumPLa > 0 && finNumTea > 0 && finGPW > 0 && finWTPO) {
        var a = schedule(finNumPLa, finNumTea, finGPW, finWTPO);

        while (schedtable.hasChildNodes()) {
            schedtable.removeChild(schedtable.lastChild);
        }


        //FIRST ROW SPECIAL
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
        document.getElementById("schedtable").appendChild(htmlrow0);

        //ALL OTHER Rows
        for (var row = 0; row < finGPW; row++) {

            var htmlrow = document.createElement('tr');
            var htmlcol = document.createElement('td');
            htmlcol.innerHTML = "Game" + (row + 1);
            htmlrow.appendChild(htmlcol);
            for (var col = 1; col < (finWTPO + 2); col++) {

                var htmlcol = document.createElement('td');
                if (col == finWTPO + 1) {
                    htmlcol.innerHTML = "Undertermined";
                    htmlrow.appendChild(htmlcol);
                } else {
                    htmlcol.innerHTML = a[col - 1][row];
                }
                htmlrow.appendChild(htmlcol);

            }

            document.getElementById("schedtable").appendChild(htmlrow);
        }




    }

}


function getStff() {
    //login nav bar code
    loggedIn();




    document.getElementById("login").addEventListener("click", checkiflogged);
    document.getElementById("loginButton").addEventListener("click", loginFirebase);
    document.getElementById("Create_Event").addEventListener("click", createEvent);
    mapboxgl.accessToken = 'pk.eyJ1IjoidHlyYW5pdGFyODk4IiwiYSI6ImNpa2wwejE3aDBmZHV2dGttdmZ2ZTRrNGIifQ.SyupoKOS5h9mTNrmiUQ78g';
    var map = new mapboxgl.Map({
        container: 'map',
        center: [121.276029722167, 31.2069089106785],
        zoom: 12,
        style: 'mapbox://styles/mapbox/streets-v8',

    });
    var Long = 0;
    var Lat = 0;
    var isDragging;

    // Is the cursor over a point? if this
    // flag is active, we listen for a mousedown event.
    var isCursorOverPoint;

    var coordinates = document.getElementById('dafdaf');


    var canvas = map.getCanvasContainer();

    var initialLng = 121.276029722167;
    var initialLat = 31.2069089106785;
    var geojson = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [initialLng, initialLat]
            }
        }]
    };

    coordinates.innerHTML = 'Longitude: ' + initialLng + '<br />Latitude: ' + initialLat;

    function mouseDown(e) {
        if (!isCursorOverPoint) return;

        isDragging = true;

        // Set a cursor indicator
        canvas.style.cursor = 'grab';

        // Mouse events
        map.on('mousemove', onMove);
        map.on('mouseup', onUp);
    }

    function onMove(e) {
        if (!isDragging) return;
        var coords = e.lngLat;

        // Set a UI indicator for dragging.
        canvas.style.cursor = 'grabbing';

        // Update the Point feature in `geojson` coordinates
        // and call setData to the source layer `point` on it.
        geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
        map.getSource('point').setData(geojson);
    }

    function onUp(e) {
        if (!isDragging) return;
        var coords = e.lngLat;

        // Print the coordinates of where the point had
        // finished being dragged to on the map.
        coordinates.style.display = 'block';
        coordinates.innerHTML = 'Longitude: ' + coords.lng + '<br />Latitude: ' + coords.lat;
        canvas.style.cursor = '';
        isDragging = false;
        finalcoords = [coords.lng, coords.lat];
    }

    map.on('load', function() {

        // Add a single point to the map
        map.addSource('point', {
            "type": "geojson",
            "data": geojson
        });

        map.addLayer({
            "id": "point",
            "type": "circle",
            "source": "point",
            "paint": {
                "circle-radius": 10,
                "circle-color": "#3887be"
            }
        });

        // If a feature is found on map movement,
        // set a flag to permit a mousedown events.
        map.on('mousemove', function(e) {
            var features = map.queryRenderedFeatures(e.point, { layers: ['point'] });

            // Change point and cursor style as a UI indicator
            // and set a flag to enable other mouse events.
            if (features.length) {
                map.setPaintProperty('point', 'circle-color', '#3bb2d0');
                canvas.style.cursor = 'move';
                isCursorOverPoint = true;
                map.dragPan.disable();
            } else {
                map.setPaintProperty('point', 'circle-color', '#3887be');
                canvas.style.cursor = '';
                isCursorOverPoint = false;
                map.dragPan.enable();
            }
        });

        // Set `true` to dispatch the event before other functions call it. This
        // is necessary for disabling the default map dragging behaviour.
        map.on('mousedown', mouseDown, true);
    });
}





function createEvent(e) {
    console.log(finalcoords);
    e.preventDefault()
    var ref = new Firebase("https://sportnetwork.firebaseio.com");
    var eventRef = ref.child("Events");


    var authData = ref.getAuth();
    if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);

        var name = document.getElementById("Event_Name").value;
        var type = document.getElementById("Event_Type").value;
        var spot = document.getElementById("Event_Spot").value;
        var intSpot = parseInt(spot);
        var eventClass = document.getElementById("eventClass").value;
        var loc = document.getElementById("Event_Location").value;
        var tim = document.getElementById("Event_Time").value;
        var des = document.getElementById("Event_Description").value;
        var objectName = name.toLowerCase();
        // cahnging the fucking time cuz IOS and WEb are fucktarded
        var finaltim = new Date(tim);
        var thisDateString = finaltim.toUTCString();

        var indexOfColon = thisDateString.indexOf(":");
        var hourSubString = thisDateString.substring(indexOfColon - 2, indexOfColon);
        //        console.log(hourSubString);
        var minuteSubString = thisDateString.substring(indexOfColon + 1, indexOfColon + 3);
        //        console.log(minuteSubString);
        var time = convertTime24to12(hourSubString + ":" + minuteSubString);
        //"2016 Jun/21 12:05 AM"
        var year = thisDateString.substring(12, 16);
        var month = thisDateString.substring(8, 11);
        var day = thisDateString.substring(5, 7);
        var yaydate = year + " " + month + "/" + day + " " + time;






        if (name == "" || eventClass == "" || type == "" || spot == "" || loc == "" || tim == "" || des == "" || finalcoords[0] == 0) {
            swal("Missing", "You are missing a required field inorder to create an event!")
        } else {
            var insideleague = {};
            if (eventClass == "League") {


                var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];
                insideleague["fuckbrandon"]={'totalPlayer':finNumPLa,'totalTeams':finNumTea,'gamesPerWeek':finGPW,'weeksTillPlayoff':finWTPO}
                for (x = 0; x < finNumTea; x++) { //umber of teams times

                    var teams = "Team " + letters[x].toUpperCase();
                    insideleague[letters[x]] = { 'win': 0, 'tie': 0, 'lose': 0,'name':teams };



                }
            }






            var newRef = eventRef.child(objectName);
            console.log(eventClass);

            newRef.set({
                EventDescription: des,
                Longitude: finalcoords[0],
                Latitude: finalcoords[1],
                Location: loc,
                Name: name,
                Type: type,
                Time: yaydate,
                TotalSpotsAvaliable: intSpot,
                EventClass: eventClass,
                UsersInEvent: {
                    0: authData.uid,
                    1: "N/A",
                    2: "N/A",
                    3: "N/A",
                    4: "N/A",
                    5: "N/A",
                    6: "N/A",
                    7: "N/A",
                    8: "N/A",
                    9: "N/A",
                    10: "N/A",
                    11: "N/A",
                    12: "N/A",
                    13: "N/A",
                    14: "N/A",
                    15: "N/A",
                    16: "N/A",
                    17: "N/A",
                    18: "N/A",
                    19: "N/A",
                    20: "N/A",
                },
                League: insideleague,

            });
            console.log("You've created an Event:" + name + "\nTell your freinds to check it out!");
            swal("Good job!", "You've created an Event:" + name + "\nTell your freinds to check it out!", "success")
                //document.location.href = "account.html";

        }

    } else {
        console.log("User is logged out");
        swal("Not logged in", "You must be logged in to create an event!")


    }



}




//log in code
function loggedIn() {
    var ref = new Firebase("https://sportnetwork.firebaseio.com");

    function authDataCallback(authData) {
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
            document.getElementById("login").innerHTML = "Logout";

        } else {
            console.log("User is logged out");
            document.getElementById("login").innerHTML = "Login";

        }
    }



    ref.onAuth(authDataCallback);
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
    }
    $('#pop_background').click(function() {

        $('#pop_background').fadeOut();
        $('#pop_box').fadeOut();
        document.getElementById("login").innerHTML = "Login";

    });
}

function logoutFirebase() {
    var rootref = new Firebase('https://sportnetwork.firebaseio.com');
    rootref.unauth();
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
            console.log("Login Failed!", error);
            $("#pop_box").effect("shake", { times: 4 }, 800);


        } else {
            console.log("Authenticated successfully with payload:", authData);

            $('#pop_background').fadeOut();
            $('#pop_box').fadeOut();
            document.getElementById("login").innerHTML = "Logout";
        }

    }

}

//end of log in code
function convertTime24to12(time24) {
    var tmpArr = time24.split(':'),
        time12;
    if (+tmpArr[0] == 12) {
        time12 = tmpArr[0] + ':' + tmpArr[1] + ' PM';
    } else {
        if (+tmpArr[0] == 00) {
            time12 = '12:' + tmpArr[1] + ' AM';
        } else {
            if (+tmpArr[0] > 12) {
                time12 = (+tmpArr[0] - 12) + ':' + tmpArr[1] + ' AM';
            } else {
                time12 = (+tmpArr[0]) + ':' + tmpArr[1] + ' PM';
            }
        }
    }
    return time12;
}


window.onload = getStff
