// //--------------FIREBASE-----------------
// // Initialize Firebase
// var config = {
//   apiKey: "AIzaSyCtdy0Gf8tNWQC4bS6QcnH3X-vknhfY3R8",
//   authDomain: "foodshare-1474316972332.firebaseapp.com",
//   databaseURL: "https://foodshare-1474316972332.firebaseio.com",
//   storageBucket: "foodshare-1474316972332.appspot.com",
//   messagingSenderId: "151948214475"
// };
//
// firebase.initializeApp(config);
//
// var foodshareRef = firebase.database().ref("foodshare");
//
//
// //--------------JS FUNCTIONS-----------------
//
// //Takes an ID, hides it if its currently on the page, returns bool on what happened.
// function hideIfOnPage(hideID) {
//   if ($(hideID).length){
//     ($(hideID)).hide();
//     return true;
//   }
//   return false;
// }
//
// var uid = "test";
// //get user info if they're signed in
// firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//         // User is signed in.
//         uid = user.uid;
//     } else {
//         // No user is signed in.
//     }
// });
//
// function getUid(){
//     return uid;
// }
// //-------------DOCUMENT READY----------------
// $( document ).ready(function() {
//
//   $("#ermnouser").hide();
//   $("#ermpass").hide();
//   $("#erminuse").hide();
//
//   $("#pword").blur(function() {
//     if(!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test($("#pword").val()))){
//       alert("The password must be at least 6 characters long and contain at least 1 number.");
//       this.focus();
//     }
//   });
//
//
//   $("#loginbtn").click(function() {
//     firebase.auth().signInWithEmailAndPassword($("#uname").val(), $("#pword").val())
//         .catch(function(error) {
//           //Use error.code to get the type of error.
//           if(error.code == "auth/wrong-password"){
//             $("#ermnouser").hide();
//             $("#ermpass").show();
//             $("#erminuse").hide();
//           }
//           else{
//             if(error.code == "auth/user-not-found"){
//               $("#ermnouser").show();
//               $("#ermpass").hide();
//               $("#erminuse").hide();
//             }
//           }
//
//         })
//         .then(function(authData) {
//
//         });
//   });
//
//   $("#regbtn").click(function() {
//     firebase.auth().createUserWithEmailAndPassword($("#uname").val(), $("#pword").val())
//         .catch(function(error) {
//           //Use error.code to get the type of error.
//           if(error.code == "auth/email-already-in-use"){
//             $("#ermnouser").hide();
//             $("#ermpass").hide();
//             $("#erminuse").show();
//           }
//
//         })
//         .then(function(authData) {
//
//         });
//   });
//
// });
