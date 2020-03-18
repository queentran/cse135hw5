var firebaseConfig = {
  apiKey: "AIzaSyCoy8PJSZzkOPiFu5wi8cGIyGWXemqBZ5s",
  authDomain: "cse135hw5-7d7b0.firebaseapp.com",
  databaseURL: "https://cse135hw5-7d7b0.firebaseio.com",
  projectId: "cse135hw5-7d7b0",
  storageBucket: "cse135hw5-7d7b0.appspot.com",
  messagingSenderId: "194867213159",
  appId: "1:194867213159:web:8d9d3fe6e4c5dd55f175c2",
  measurementId: "G-WZQJL8ZRF9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


var logoutID = document.getElementById("logoutPage");
logoutID.addEventListener('click', logoutUser);

function logoutUser() {
    firebase.auth().signOut();
    window.location = '/login.html';
}