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
window.onload = loggedIn