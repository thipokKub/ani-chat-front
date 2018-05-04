import React, { Component } from 'react';
import enhancedComponent from '../hoc/enhancedComponent';
import styled from 'styled-components';
import { setCookie, getCookie, deleteCookie } from '../function/general';
import Router from 'next/router';
import axios from 'axios';
import _ from 'lodash';

const CardStyle = styled.form`

&> div {
    display: flex;
    flex-direction: column;
    width: 100vw;
    max-width: 500px;
    box-shadow: 0px 3px 10px #00000085;
    box-sizing: border-box;
    padding: 30px 20px 20px 20px;
    border-radius: 10px 40px 10px 40px;
    align-items: center;
    background-color: #FFFFFF60;
    color: #FFF;

    &> * {
        flex: 1;
        width: 100%;
    }

    & > div {
        margin: 20px 0px 0px 0px;
        input {
            margin: 5px 0px;
            font-size: 0.8rem;
        }
    }
}

h1, h2, h3, h4 {
    margin: 10px 0px 3px 30px;
}

img {
    width: 200px;
}

input:not([type="checkbox"]) {
    width: 100%;
    box-sizing: border-box;
    padding: 0px 15px;
    height: 40px;
    border-radius: 20px;
    outline: none;
    border: 2px solid #FFFFFF;
    background-color: #FFFFFF30;
    color: #FFFFFF;

    &::placeholder {
        color: #FFFFFF;
        opacity: 0.7;
    }
}

.remember-div {
    display: flex;
    align-items: center;
    margin: 10px 0px 0px 10px;
}

.btn-div {
    display: flex;
    margin: 20px 0px 10px 0px;
    &> * {
        flex: 1;
        margin: 0px 5px;
        outline: none;
    }

    .login {
        background-color: #97F77E;
        color: #FFF;
    }

    .register {
        background-color: #F75656;
        color: #FFF;
    }
}

.styled-checkbox {
    position: absolute; // take it out of document flow
    opacity: 0; // hide it

    & + label {
        position: relative;
        cursor: pointer;
        padding: 0;
    }

    // Box.
    & + label:before {
        content: '';
        margin-right: 10px;
        display: inline-block;
        vertical-align: text-top;
        width: 20px;
        height: 20px;
        background: white;
    }

    // Box hover
    &:hover + label:before {
        background: #f35429;
    }

    // Box focus
    &:focus + label:before {
        box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.12);
    }

    // Box checked
    &:checked + label:before {
        background: #f35429;
    }

    // Disabled state label.
    &:disabled + label {
        color: #b8b8b8;
        cursor: auto;
    }

    // Disabled box.
    &:disabled + label:before {
        box-shadow: none;
        background: #ddd;
    }

    // Checkmark. Could be replaced with an image
    &:checked + label:after {
        content: '';
        position: absolute;
        left: 5px;
        top: 9px;
        background: white;
        width: 2px;
        height: 2px;
        box-shadow:
        2px 0 0 white,
        4px 0 0 white,
        4px -2px 0 white,
        4px -4px 0 white,
        4px -6px 0 white,
        4px -8px 0 white;
        transform: rotate(45deg);
    }
}

.avatar-select-container {
    overflow-x: scroll;
    overflow-y: hidden;
    height: calc(2*10px + 100px);
}

ul.avatar-select {
    list-style-type: none;
    padding: 0px;
    margin: 0px;
    width: calc(4*(2*10px + 100px));
    li {
        width: 100px;
        height: 100px;
        display: inline-block;
        margin: 10px;

        &.active {
            background-color: #6BFF71;
        }

        &:hover {
            box-shadow: 0px 0px 20px #4AACF7FF;
        }

        &:active {
            filter: brightness(0.8);
            box-shadow: 0px 0px 10px #4AACF7FF;
        }
    }
}

.login-card {
    display: ${(props) => {
            return props.isAtRegister && `none !important;`
        }
    }
}

.register-card {
    display: ${(props) => !props.isAtRegister && `none !important;`}
}

.status {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #B7250E;
    background-color: rgba(255, 255, 255, 0.7);

    &.success {
        color: #51C45A;
    }
}
`;

const LoginPageStyle = styled.section`
.content {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    min-width: 100vw;
    position: fixed;
    overflow: hidden;
}
.background {
    overflow: hidden;
    position: fixed;
    min-width: 100vw;
    min-height: 100vh;
    background-image: url('/static/resources/bg.jpg');
    background-size: cover;
    background-position: center;
    z-index: -1;
    filter: blur(3px) brightness(0.8);
    transform: scale(1.2);
}
`;

const avatarImages = [
    "/static/resources/avatar/a-01.png",
    "/static/resources/avatar/a-02.png",
    "/static/resources/avatar/a-03.png",
    "/static/resources/avatar/a-04.png",
];

const FieldName = "UserStat"

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAtRegister: false,
            selectIndex: -1,
            loginUser: "",
            loginPassword: "",
            registerName:"",
            registerUser: "",
            registerPassword1: "",
            registerPassword2: "",
            registerStatus: "",
            isRemembered: false
        }
    }

    onToggleRegister = () => {
        if (this.state.isAtRegister && this.state.registerStatus === "Success") {
            this.setState({
                isAtRegister: !this.state.isAtRegister,
                registerName:"",
                registerUser: "",
                registerPassword1: "",
                registerPassword2: "",
                registerStatus: "",
                selectIndex: -1
            })
        } else {
            this.setState({
                isAtRegister: !this.state.isAtRegister,
            })
        }
    }

    onUpdateSelectIndex = (index) => {
        return () => {
            if(this.state.selectIndex === index) {
                this.setState({
                    selectIndex: -1
                })
            } else {
                this.setState({
                    selectIndex: index
                })
            }
        }
    }

    onHandleStateChange(field, isCheckbox = false) {
        return (e) => {
            const value = (isCheckbox) ? e.target.checked : e.target.value
            this.setState((prevState) => {
                let newState = {
                    ...prevState
                }
                newState[field] = value;
                return newState;
            })
        }
    }

    onRegisterSubmit = async () => {
        this.setState((prevState) => {
            let newState = {
                ...prevState
            }
            if(
                prevState.registerUser.length === 0 ||
                prevState.registerPassword1.length === 0 ||
                prevState.registerPassword2.length === 0
            ) {
                newState.registerStatus = "Missing field(s)"
                return newState;
            }
            if(prevState.registerPassword1 !== prevState.registerPassword2) {
                newState.registerStatus = "Passwords mismatch"
                return newState;
            }
            if(prevState.selectIndex === -1) {
                newState.registerStatus = "No selected avatar image"
                return newState;
            }
            newState.registerStatus = "Success"
            return newState;
        })
        try {
            const response = await axios.post('http://localhost:3001/user/register',{
                name: this.state.registerName,
                username: this.state.registerUser,
                password: this.state.registerPassword1
            });
            console.log(response);
          } catch (error) {
            console.error(error);
          }
    }

    onLogin = async () => {
        const { isRemembered, loginUser, loginPassword } = this.state;
        if(isRemembered) {
            setCookie({
                name: "username",
                hours: 3,
                value: loginUser
            })
            setCookie({
                name: "password",
                hours: 3,
                value: loginPassword
            })
        } else {
            deleteCookie("username")
            deleteCookie("password")
        }
        this.props.updateMapId(FieldName, "username", {
            data: loginUser
        });
        this.props.updateMapId(FieldName, "password", {
            data: loginPassword
        });
        
        try {
            const response = await axios.post('http://localhost:3001/user/login',{
                username: this.state.loginUser,
                password: this.state.loginPassword
            });
            if (_.get(response, ['data', 'error'] , null) === null){
                this.props.updateMapId(FieldName, "userId", {
                    data: response.data.id
                });
                Router.push({
                    pathname: '/chat'
                });
            } else {
                alert('Login fail!');
            }
            console.log(response);
        } catch (error) {
        console.error(error);
        }
    }

    componentDidMount() {
        if (getCookie("username").length !== 0 && getCookie("password").length !== 0) {
            this._user.value = getCookie("username")
            this._pass.value = getCookie("password")
            this.setState({
                isRemembered: true,
                loginUser: getCookie("username"),
                loginPassword: getCookie("password")
            })
        } else {
            deleteCookie("username")
            deleteCookie("password")
        }
        if (!this.props.map[FieldName]) {
            this.props.initMapId(FieldName, "username")
            this.props.initMapId(FieldName, "password")
            this.props.initMapId(FieldName, "userId")
        }
    }

    render() {
        const { isAtRegister,
            selectIndex,
            registerStatus,
            isRemembered,
            registerName,
            registerUser,
            registerPassword1,
            registerPassword2
        } = this.state;

        return (
            <LoginPageStyle onSubmit={(e) => {
                e.preventDefault();
                return false;
            }}>
                <section className="content">
                    <CardStyle isAtRegister={isAtRegister}>
                        <div className="login-card">
                            <img src="static/resources/logo/light.png" />
                            <div>
                                <input
                                    placeholder="Username"
                                    onChange={this.onHandleStateChange("loginUser")}
                                    ref={(me) => this._user = me}
                                    maxLength={10}
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    onChange={this.onHandleStateChange("loginPassword")}
                                    ref={(me) => this._pass = me}
                                />
                                <div className="remember-div">
                                    <input
                                        className="styled-checkbox"
                                        id="remember-login"
                                        type="checkbox"
                                        onChange={this.onHandleStateChange("isRemembered", true)}
                                        checked={isRemembered}
                                    />
                                    <label htmlFor="remember-login">Remember me</label>
                                </div>
                            </div>
                            <div className="btn-div">
                                <button className="btn login" onClick={this.onLogin}>Login</button>
                                <button className="btn register" onClick={this.onToggleRegister} >Register</button>
                            </div>
                        </div>
                        <div className="register-card">
                            <h2>Register</h2>
                            <hr />
                            <div>
                                <input
                                    placeholder="Name"
                                    onChange={this.onHandleStateChange("registerName")}
                                    value={registerName}
                                />
                                <input
                                    placeholder="Username"
                                    onChange={this.onHandleStateChange("registerUser")}
                                    value={registerUser}
                                    maxLength={10}
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    onChange={this.onHandleStateChange("registerPassword1")}
                                    value={registerPassword1}
                                />
                                <input
                                    type="password"
                                    placeholder="Verify Password"
                                    onChange={this.onHandleStateChange("registerPassword2")}
                                    value={registerPassword2}
                                />
                                <h3>Avatar</h3>
                                <div className="avatar-select-container">
                                    <ul className="avatar-select">
                                        {
                                            avatarImages.map((src, idx) => {
                                                return (
                                                    <li key={idx} className={`avatar-container ${selectIndex === idx ? 'active' : ''}`} onClick={this.onUpdateSelectIndex(idx)}>
                                                        <p>
                                                            <img src={src} />
                                                        </p>
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className={`status ${registerStatus === "Success" ? "success" : ""}`}>
                                    {registerStatus}
                                </div>
                            </div>
                            <div className="btn-div">
                                <button className="btn login" onClick={this.onToggleRegister}>Back</button>
                                <button className="btn register" onClick={this.onRegisterSubmit} >Submit</button>
                            </div>
                        </div>
                    </CardStyle>
                </section>
                <section className="background"></section>
            </LoginPageStyle>
        );
    }
}

export default enhancedComponent(LoginPage, {
    enableRedux: true,
    headOption: [{
        tag: 'title',
        content: 'Login Page'
    }]
})
