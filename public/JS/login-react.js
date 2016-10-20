/**
 * Created by Sherif on 10/4/2016.
 */
// import SkyLight from 'react-skylight'
import React from 'react'
import ReactDOM from 'react-dom'
import {Modal, Button, Input, Row} from 'react-materialize'


//---------------------------------------------------------------------
// var config = {
//     apiKey: "AIzaSyCtdy0Gf8tNWQC4bS6QcnH3X-vknhfY3R8",
//     authDomain: "foodshare-1474316972332.firebaseapp.com",
//     databaseURL: "https://foodshare-1474316972332.firebaseio.com",
//     storageBucket: "foodshare-1474316972332.appspot.com",
//     messagingSenderId: "151948214475"
// };
//
// firebase.initializeApp(config);

var foodshareRef = firebase.database().ref("foodshare");

var signedIn = false;
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

class NavBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {email: "", password: "", showError: false, error: "",
            success: "", showSuccess: false, showLoginBox: true,
            loginState: false, currentUser: ""};

        this.loginHandler = this.loginHandler.bind(this);
        this.registerHandler = this.registerHandler.bind(this);

        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);

        this.handleLogout = this.handleLogout.bind(this);

        this.hideError = this.hideError.bind(this);
        this.hideSuccess = this.hideSuccess.bind(this);
    }

    setDefaultState(){
        this.state = {
            email: "", password: "", showError: false, error: "",
            success: "", showSuccess: false, showLoginBox: true,
            loginState: false, currentUser: ""};
    };

    onEmailChange(value){
        this.setState({email: value});
    }

    onPasswordChange(value){
        this.setState({password: value});
    }

    loginHandler(e) {
        var stateObj = this;
        var success = true;
        firebase.auth().signInWithEmailAndPassword(stateObj.state.email, stateObj.state.password)
            .catch(function(error) {
                success = false;
                //Use error.code to get the type of error.
                if(error.code == "auth/wrong-password"){
                    stateObj.setState({error: " Invalid password. Please try again.",
                        showError: true});
                }
                else if(error.code == "auth/user-not-found"){
                    stateObj.setState({error: " This email has not yet been registered",
                        showError: true});
                }
            })
            .then(function(authData) {
                if(success) {
                    console.log("SUCCESS LOGIN");
                    stateObj.setState({showError: false, success: " Signed in!", showSuccess: true});

                    // need to keep track that user is logged in
                    // and also Hide the login box
                    console.log($('#modal1').html());
                    $('#modal1').closeModal();


                    stateObj.setState({loginState: true, showLoginBox: false, currentUser: stateObj.state.email});
                }
            });
    }

    registerHandler(e) {
        var stateObj = this;
        var success = true;
        firebase.auth().createUserWithEmailAndPassword(stateObj.state.email, stateObj.state.password)
            .catch(function(error) {
                success = false;
                //Use error.code to get the type of error.
                if(error.code == "auth/email-already-in-use"){
                    stateObj.setState({error: " This email is already in use.", showError: true});
                }
            })
            .then(function(authData) {
                if(success) {
                    console.log("SUCCESS REGISTER");
                    stateObj.setState({showError: false, success: " Registered! Please check your e-mail to verify" +
                    " your account.", showSuccess: true});

                    //send verification email
                    firebase.auth().currentUser.sendEmailVerification().then(function() {
                        //email sent
                    }, function(error) {
                        //an error occurred
                    });

                    // //    1. Reset the states to be blank
                    // stateObj.setDefaultState();
                    // //    2. Hide the login box
                    // stateObj.setState({showLoginBox: false})
                }
            });
    }

    handleLogout(e){
        var stateObj = this;
        firebase.auth().signOut().then(function() {
            console.log("logout success");
            // Reset the login box to default
            stateObj.setDefaultState();
            //for some reason I need to set the login state to false
            //even though setDefaultState() already does it.
            //loginbox won't show otherwise
            stateObj.setState({loginState: false});
        }, function(error) {
            console.log("error");
        });
    }

    hideError(){
        this.setState({showError: false});
    }
    hideSuccess(){
        this.setState({showSuccess: false});
    }

    render() {
        return(
            <div>
                <nav className="navbar navbar-light bg-faded">
                    <ul className="nav navbar-nav">
                        <li className="nav-item active">
                            {this.state.loginState ?
                                <a className="nav-link whitetext" onClick={this.handleLogout}>
                                    {this.state.currentUser} (Logout)
                                </a>
                            :
                                <Modal id="modal1"
                                    modalOptions={{test:67,age:50}}
                                header='Login and Registration'
                                trigger={
                                <Button waves='light'>Login and Registration</Button>
                                }>
                                <LoginBox loginHandler = {this.loginHandler} registerHandler = {this.registerHandler}
                                          email={this.state.email} onEmailChange={this.onEmailChange}
                                          password={this.state.password} onPasswordChange={this.onPasswordChange}
                                          showError={this.state.showError} error={this.state.error}
                                          showSuccess={this.state.showSuccess}
                                          showLoginBox={this.state.showLoginBox}
                                          success={this.state.success}
                                          hideError={this.hideError}
                                          hideSuccess={this.hideSuccess}>
                                </LoginBox>
                                </Modal>
                            }

                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}


class LoginBox extends React.Component{
    constructor(props) {
        super(props);
        this.state = {email: "", password: "", showError: false, error: "",
            success: "", showSuccess: false, showLoginBox: true,
            loginState: false, currentUser: ""};
    };

    handleOnEmailChange(e){
        this.props.onEmailChange(e.target.value);
    }
    handleOnPasswordChange(e){
        this.props.onPasswordChange(e.target.value);
    }

    onHideError(e){
        e.preventDefault();
        this.props.hideError();
    }
    onHideSuccess(e){
        e.preventDefault();
        this.props.hideSuccess();
    }

    onLoginHandler(e){
        this.props.loginHandler(e);
    }

    render() {
        return(
            <Row>
                <form className="col s12">
                    <Row>
                        {/*<Input placeholder="Placeholder" s={6} label="First Name" />*/}
                        {/*<Input s={6} label="Last Name" />*/}
                        <Input onChange={this.handleOnEmailChange.bind(this)} type="email" label="Email" s={12} />
                        <Input onChange={this.handleOnPasswordChange.bind(this)} type="password" label="password" s={12} />
                    </Row>
                    <Row>
                        { this.props.showError ?
                            <Button onClick={this.onHideError.bind(this)} className="red col s12">{this.props.error}</Button>
                            : null}
                        { this.props.showSuccess ?
                            <Button onClick={this.onHideSuccess.bind(this)} className="green col s12">{this.props.success}</Button>
                            : null}
                    </Row>
                    <Row>
                        <Button className="col s12 cyan lighten-2" onClick={this.onLoginHandler.bind(this)} type="button">LOGIN</Button>
                    </Row>
                    <Row>
                        <Button className="col s12 orange accent-4" onClick={this.props.registerHandler.bind(this)} type="button">REGISTER</Button>
                    </Row>
                </form>
            </Row>
        );
    }
}

ReactDOM.render(
    <NavBar/>,
    document.getElementById('login')
);

