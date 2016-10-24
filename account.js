var thisguyskey = "";
var thisguyurl = "";

function getStff() {

    myEvent = document.getElementById('events');
    loggedIn();
    document.getElementById("open").addEventListener("click", check);
    document.getElementById("loginButton").addEventListener("click", loginFirebase);
    loadAcc();



}

function loadAcc() {

    var rootRef = new Firebase('https://sportnetwork.firebaseio.com')
    userRef = rootRef.child('Users')
    userRef.on("child_added", function(snapshot, prevChildKey) {
        var newPost = snapshot.val();
        var objectID = snapshot.key(); //url adress



        if (thisguyskey == objectID) {
            thisguyurl = newPost.AWS_Photo_URL;
            thisguyname = newPost.Full_Name;
            thisguyemail = newPost.Email;
            console.log("this url is -----" + thisguyurl);
            createAcc(thisguyurl, thisguyname, thisguyemail);
        }

    });
}

function loggedIn() {
    var rootRef = new Firebase('https://sportnetwork.firebaseio.com')

    function authDataCallback(authData) {
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);

            thisguyskey = authData.uid;
            document.getElementById("open").innerHTML = "Logout";

        } else {
            console.log("User is logged out");
            document.getElementById("open").innerHTML = "Login";

        }
    }
    rootRef.onAuth(authDataCallback);
}

function createAcc(url_of_image, nameofdude, emailofdude) {
    var src = url_of_image,
        img = document.createElement('img'),
        name = document.createElement('p'),
        email = document.createElement('p');


    img.src = src;
    name.textContent = "Name:    " + nameofdude;
    email.textContent = "Email:    " + emailofdude;

    img.setAttribute("id", "acc_img");
    document.getElementById('picture').appendChild(img);
    document.getElementById('picture').appendChild(name);
    document.getElementById('picture').appendChild(email);
}

function check() {
    if (document.getElementById("open").innerHTML == "Login") {


        $('#pop_background').fadeIn();
        $('#pop_box').fadeIn();

        $('#pop_background').click(function() {

            $('#pop_background').fadeOut();
            $('#pop_box').fadeOut();
            document.getElementById("open").innerHTML = "Login";

        });


    } else {

        logoutFirebase();
        document.getElementById("open").innerHTML = "Login";
        location.reload();

    }



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
            document.getElementById("open").innerHTML = "Logout";
            console.log(authData);
            location.reload();
        }

    }

}




window.onload = getStff
