function start() {
    loggedIn();
    document.getElementById("login").addEventListener("click", checkiflogged);
    document.getElementById("loginButton").addEventListener("click", loginFirebase);

}

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
            $("#pop_box").effect( "shake", {times:4}, 800 );


        } else {
            console.log("Authenticated successfully with payload:", authData);

            $('#pop_background').fadeOut();
            $('#pop_box').fadeOut();
            document.getElementById("login").innerHTML = "Logout";
        }

    }

}

window.onload = start
