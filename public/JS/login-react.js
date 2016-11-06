/**
 * Created by Sherif on 10/4/2016.
 */
import React from 'react'
import ReactDOM from 'react-dom'
import {Modal, Button, Input, Row} from 'react-materialize'
var ReactTestUtils = require('react-addons-test-utils');

// var config = {
//     apiKey: "AIzaSyCtdy0Gf8tNWQC4bS6QcnH3X-vknhfY3R8",
//     authDomain: "foodshare-1474316972332.firebaseapp.com",
//     databaseURL: "https://foodshare-1474316972332.firebaseio.com",
//     storageBucket: "foodshare-1474316972332.appspot.com",
//     messagingSenderId: "151948214475"
// };
//
// firebase.initializeApp(config);
//
// var foodshareRef = firebase.database().ref("foodshare");

var signedIn = false;
var uid = "testa";
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

        this.closeModal = this.closeModal.bind(this);
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
                    stateObj.closeModal();
                }
            });
    }

    closeModal(){
        $('#modal1').closeModal();
        this.setState({loginState: true, showLoginBox: false, currentUser: this.state.email});
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
            <div style={{height:"100%"}}>
                <nav className="navbar navbar-light bg-faded">
                    <ul className="nav navbar-nav" style={{height:"100%", position: "relative"}}>
                        <li className="nav-item" style={{height:"100%"}}>
                            {this.state.loginState ?
                                <a style={{position: "absolute", top: "50%", transform: "translateY(-50%)"}}
                                   className="nav-link whitetext" onClick={this.handleLogout}>
                                    {this.state.currentUser} (Logout)
                                </a>
                            :
                                <Modal className="loginModal" id="modal1"
                                header='Login and Registration'
                                trigger={
                                <Button style={{position: "absolute", top: "50%", transform: "translateY(-50%)"}}
                                        ref="lgnRegBtn" className="lgnRegBtn" waves='light'>Login and Registration</Button>
                                }>
                                <LoginBox closeModal={this.closeModal} loginState={this.state.loginState} currentUser={this.state.currentUser}
                                          loginHandler={this.loginHandler} registerHandler = {this.registerHandler}
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

var provider = new firebase.auth.GoogleAuthProvider();
class LoginBox extends React.Component{
    constructor(props) {
        super(props);
        this.state = {email: "", password: "", showError: false, error: "",
            success: "", showSuccess: false, showLoginBox: true,
            loginState: false, currentUser: ""};
        this.onLoginHandler = this.onLoginHandler.bind(this);
        this.onRegisterHandler = this.onRegisterHandler.bind(this);
        this.onGoogleSignin = this.onGoogleSignin.bind(this);
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
    onRegisterHandler(e){
        this.props.registerHandler(e);
    }
    onGoogleSignin(e){
        var stateObj = this;
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log(user);
            stateObj.props.onEmailChange(user.email);
            stateObj.props.closeModal();
            // $('#modal1').closeModal();

            // ...
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
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
                        <Button className="lgnBtn col s12 cyan lighten-2" onClick={this.onLoginHandler} type="button">LOGIN</Button>
                    </Row>
                    <Row>
                        <Button className="regBtn col s12 orange accent-4" onClick={this.onRegisterHandler} type="button">REGISTER</Button>
                    </Row>
                    <Row>
                        <Button className="col s12 orange accent-4" onClick={this.onGoogleSignin} type="button">Google Signin</Button>
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

// describe('NavBar', function () {
//
//     var navBarComponent, loginBoxComponent, element;
//     beforeEach(function () {
//         element = React.createElement(NavBar);
//         navBarComponent = ReactTestUtils.renderIntoDocument(element);
//         navBarComponent.setState({email: "abc@def.com", password: "123"});
//         var buttonLgnReg = ReactTestUtils.findRenderedDOMComponentWithClass(navBarComponent, "lgnRegBtn");
//         ReactTestUtils.Simulate.click(buttonLgnReg);
//     });
//     it("Has a Login/Registration button", function() {
//         let buttons = ReactTestUtils.scryRenderedDOMComponentsWithClass(navBarComponent, "lgnRegBtn");
//         expect(buttons[0]).not.toBeUndefined();
//         expect(buttons[0].innerHTML).toBe("<!-- react-text: 6 -->Login and Registration<!-- /react-text -->");
//     });
//     it("Has a LoginBox component", function() {
//         expect(function () {
//             //tests to see if child component exists when rendered
//             ReactTestUtils.scryRenderedComponentsWithType(navBarComponent, LoginBox);
//         }).not.toThrow();
//     });
//     describe("Login button", function () {
//         beforeEach(function () {
//             spyOn(navBarComponent, 'loginHandler');
//         });
//         it("Causes the login handler to be called", function () {
//             loginBoxComponent = ReactTestUtils.renderIntoDocument(
//                 <LoginBox loginHandler={navBarComponent.loginHandler} registerHandler = {navBarComponent.registerHandler}
//                     email={navBarComponent.state.email} onEmailChange={navBarComponent.onEmailChange}
//                     password={navBarComponent.state.password} onPasswordChange={navBarComponent.onPasswordChange}
//                     showError={navBarComponent.state.showError} error={navBarComponent.state.error}
//                     showSuccess={navBarComponent.state.showSuccess}
//                     showLoginBox={navBarComponent.state.showLoginBox}
//                     success={navBarComponent.state.success}
//                     hideError={navBarComponent.hideError}
//                     hideSuccess={navBarComponent.hideSuccess}>
//             </LoginBox>);
//
//             var buttonLgn = ReactTestUtils.findRenderedDOMComponentWithClass(loginBoxComponent, "lgnBtn");
//             ReactTestUtils.Simulate.click(buttonLgn);
//             $('#modal1').closeModal();
//             expect(navBarComponent.loginHandler).toHaveBeenCalled();
//         });
//     });
//     describe("Register button", function () {
//         beforeEach(function () {
//             spyOn(navBarComponent, 'registerHandler');
//         });
//         it("Causes the register handler to be called", function () {
//             loginBoxComponent = ReactTestUtils.renderIntoDocument(
//                 <LoginBox loginHandler={navBarComponent.loginHandler} registerHandler = {navBarComponent.registerHandler}
//                           email={navBarComponent.state.email} onEmailChange={navBarComponent.onEmailChange}
//                           password={navBarComponent.state.password} onPasswordChange={navBarComponent.onPasswordChange}
//                           showError={navBarComponent.state.showError} error={navBarComponent.state.error}
//                           showSuccess={navBarComponent.state.showSuccess}
//                           showLoginBox={navBarComponent.state.showLoginBox}
//                           success={navBarComponent.state.success}
//                           hideError={navBarComponent.hideError}
//                           hideSuccess={navBarComponent.hideSuccess}>
//                 </LoginBox>);
//
//             var buttonReg = ReactTestUtils.findRenderedDOMComponentWithClass(loginBoxComponent, "regBtn");
//             ReactTestUtils.Simulate.click(buttonReg);
//             $('#modal1').closeModal();
//             expect(navBarComponent.registerHandler).toHaveBeenCalled();
//         });
//     });
// });
