var ref = new Firebase("https://sportnetwork.firebaseio.com");

function getStff() {
    loggedIn();

    document.getElementById("login").addEventListener("click", checkiflogged);
    document.getElementById("loginButton").addEventListener("click", loginFirebase);
    document.getElementById("signupButton").addEventListener("click", createafirebaseacc);
    document.getElementById("signupButton2").addEventListener("click", createafirebaseacc);
    document.getElementById("submit_Create").addEventListener("click", createUser);

    document.getElementById("imgurInfoButton").onclick = function () { 
        swal("Upload a photo to imgur.com!", "It's pretty simple. Go to imgur.com and select upload image. Once you've it has been uploaded succesfully, copy the image URl. Then paste it in here!"); 
    };
}

function loggedIn() {
    var ref = new Firebase("https://sportnetwork.firebaseio.com");
    function authDataCallback(authData) {
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
            document.getElementById("login").innerHTML = "Logout";
            var thisref = new Firebase('https://sportnetwork.firebaseio.com/Users/' + authData.uid);
            thisref.once("value", function(snap) {

                document.getElementById("userImage").src = snap.val().AWS_Photo_URL;
                document.getElementById("userNameTop").innerHTML = snap.val().Full_Name;
            });
        } else {
            console.log("User is logged out");
            document.getElementById("login").innerHTML = "Login";

        }
    }
    ref.onAuth(authDataCallback);
}

function createUser(e) {
    e.preventDefault()
    var ref = new Firebase("https://sportnetwork.firebaseio.com");
    var userEmail = document.getElementById("email1").value;
    var userPass = document.getElementById("pass1").value;
    var imgururl = document.getElementById("imgururl1").value;
    var soon = imgururl.split(":");
    var HTTPSurl = "https:"+soon[1];
//http://imgur.com/a/ZFf1B
//https://imgur.com/a/ZFf1B
    
    ref.createUser({
        email: userEmail,
        password: userPass
    }, function(error, userData) {
        if (error) {
            switch (error.code) {
                case "EMAIL_TAKEN":
                    console.log("The new user account cannot be created because the email is already in use.");
                    break;
                case "INVALID_EMAIL":
                    console.log("The specified email is not a valid email.");
                    break;
                default:
                    console.log("Error creating user:", error);
            }
        } else {
            console.log("Successfully created user account with uid:", userData.uid);
            createUserFirebase(userData.uid,HTTPSurl);
            console.log("plss bbyz:" + HTTPSurl);
            swal("Yay!", "succesfull created user :" + userEmail, "success")
            $('#pop_background').fadeOut();
            $('#pop_box1').fadeOut();
        }
    });
}

function createUserFirebase(thisuid,thisphotourl) {
    var ref = new Firebase("https://sportnetwork.firebaseio.com");
    var userRef = ref.child("Users");

    var email1 = document.getElementById("email1").value;
    var fullname1 = document.getElementById("fullname1").value;
    var pass1 = document.getElementById("pass1").value;

    var newRef = userRef.child(thisuid);

    newRef.set({
        AWS_Photo_URL: thisphotourl,
        Email: email1,
        Full_Name: fullname1,
        Password: pass1,
    });
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
        //this is when the inner html is logout!!!
        logoutFirebase();

        document.getElementById("login").innerHTML = "Login";
        document.getElementById("userImage").src = "nouser.png";
        document.getElementById("userNameTop").innerHTML = "Not logged in";
    }
    $('#pop_background').click(function() {

        $('#pop_background').fadeOut();
        $('#pop_box').fadeOut();
        document.getElementById("login").innerHTML = "Login";
    });
}

function createafirebaseacc() {
    $('#pop_background').fadeIn();
    $('#pop_box1').fadeIn();
    $('#pop_background').click(function() {
        $('#pop_background').fadeOut();
        $('#pop_box1').fadeOut();
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
            

            if (authData) {
                console.log("Authenticated user with uid:", authData.uid);
            } else {
                //this guy is not logged in!
            }

            $('#pop_background').fadeOut();
            $('#pop_box').fadeOut();
            document.getElementById("login").innerHTML = "Logout";
        }
    }
}

window.onload = getStff
