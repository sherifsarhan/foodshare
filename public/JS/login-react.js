/**
 * Created by Sherif on 10/4/2016.
 */
//Display that a user is logged in
// class Username extends React.Component{
//     render() {
//         var {username, age} = this.props;
//         return(
//             <div>
//                 <h1>{username}</h1>
//                 <h2>{age}</h2>
//             </div>
//         )
//     }
// }
//
// ReactDOM.render(
//     <Username username="sherif" age={52}/>,
//     document.getElementById('login')
// );


var config = {
    apiKey: "AIzaSyCtdy0Gf8tNWQC4bS6QcnH3X-vknhfY3R8",
    authDomain: "foodshare-1474316972332.firebaseapp.com",
    databaseURL: "https://foodshare-1474316972332.firebaseio.com",
    storageBucket: "foodshare-1474316972332.appspot.com",
    messagingSenderId: "151948214475"
};

firebase.initializeApp(config);

var foodshareRef = firebase.database().ref("foodshare");

var uid = "test";
//get user info if they're signed in
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        uid = user.uid;
    } else {
        // No user is signed in.
    }
});

class LoginBox extends React.Component{
    constructor(props) {
        super(props);
        this.state = {email: "", password: "", error: "", showError: false, success: "", showSuccess: false};
    }

    loginAction() {
        var stateObj = this;
        var success = true;
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch(function(error) {
                success = false;
                //Use error.code to get the type of error.
                if(error.code == "auth/wrong-password"){
                    stateObj.setState({error: "The password is invalid or the user does not have a password.",
                     showError: true});
                }
                else if(error.code == "auth/user-not-found"){
                    stateObj.setState({error: "There is no record corresponding to this identifier. The user may have been deleted.",
                        showError: true});
                }
            })
            .then(function(authData) {
                if(success) {
                    console.log("SUCCESS LOGIN");
                    stateObj.setState({showError: false, success: "Signed in!", showSuccess: true});
                }
            });
    }

    registerAction() {
        var stateObj = this;
        var success = true;
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .catch(function(error) {
                success = false;
                //Use error.code to get the type of error.
                if(error.code == "auth/email-already-in-use"){
                    stateObj.setState({error: "The email address is already in use by another account.", showError: true});
                }
            })
            .then(function(authData) {
                if(success) {
                    console.log("SUCCESS REGISTER");
                    stateObj.setState({showError: false, success: "Registered!", showSuccess: true});
                }
            });
    }

    onEmailChange(e) {
        this.setState({email: e.target.value});
    }
    onPasswordChange(e) {
        this.setState({password: e.target.value});
    }

    render() {
        return(
            <div className="container">
                <div className="col-lg-8">
                    <div className="jumbotron">
                        <label className="whitetext"><b>Email</b></label>
                        <input value={this.state.email} onChange={this.onEmailChange.bind(this)} id="uname" type="text" placeholder="Enter Email"></input>

                        <label className="whitetext"><b>Password</b></label>
                        <input value={this.state.password} onChange={this.onPasswordChange.bind(this)}id="pword" type="password" placeholder="Enter Password"></input>

                        { this.state.showError ?
                            <a className="btn btn-block btn-error"><span className="glyphicon glyphicon-minus-sign"></span>{this.state.error}</a> : null}
                        { this.state.showSuccess ?
                            <a className="btn btn-block btn-success"><span className="glyphicon glyphicon-plus-sign"></span>{this.state.success}</a> : null}


                        <button onClick={this.loginAction.bind(this)} type="button" id="loginbtn" className="col-lg-6 col-md-6 col-sm-6 btn btn-login">LOGIN</button>
                        <button onClick={this.registerAction.bind(this)} type="button" id="regbtn" className="col-lg-6 col-md-6 col-sm-6 btn btn-warning">REGISTER</button>
                        <p><br></br></p>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <LoginBox/>,
    document.getElementById('login')
);

