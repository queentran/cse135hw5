function toggleSignIn() {
    if (!firebase.auth().currentUser) {
        // [START createprovider]
        var provider = new firebase.auth.GoogleAuthProvider();
        // [END createprovider]
        // [START addscopes]
        provider.addScope('https://www.googleapis.com/auth/plus.login');
        // [END addscopes]
        // [START signin]
        firebase.auth().signInWithRedirect(provider);
        // [END signin]
    } else {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    }
    // [START_EXCLUDE]
    document.getElementById('quickstart-sign-in').disabled = true;
    // [END_EXCLUDE]
}
/**

   * initApp handles setting up UI event listeners and registering Firebase auth listeners:

   *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or

   *    out, and that is where we update the UI.

   *  - firebase.auth().getRedirectResult(): This promise completes when the user gets back from

   *    the auth redirect flow. It is where you can get the OAuth access token from the IDP.

   */

  function initApp() {

    // Result from Redirect auth flow.

    // [START getidptoken]

    firebase.auth().getRedirectResult().then(function(result) {

      // The signed-in user info.

      var user = result.user;

    }).catch(function(error) {

      // Handle Errors here.

      var errorCode = error.code;

      var errorMessage = error.message;

      // The email of the user's account used.

      var email = error.email;

      // The firebase.auth.AuthCredential type that was used.

      var credential = error.credential;

      // [START_EXCLUDE]

      if (errorCode === 'auth/account-exists-with-different-credential') {

        alert('You have already signed up with a different auth provider for that email.');

        // If you are using multiple auth providers on your app you should handle linking

        // the user's accounts here.

      } else {

        console.error(error);

      }

      // [END_EXCLUDE]

    });

    // [END getidptoken]



    // Listening for auth state changes.

    // [START authstatelistener]

    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {
            // get user info
            var userName = user.displayName;
            var userEmail = user.email;
            var userVerify = user.emailVerified;
            // go to dashboard page
            window.location = './dashboard.html';
           
        } else{
            console.log('You are not logged in');
        }

      // [START_EXCLUDE]

      document.getElementById('quickstart-sign-in').disabled = false;

      // [END_EXCLUDE]

    });

    // [END authstatelistener]



    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);

  }



  window.onload = function() {

    initApp();

  };