import React, { Component } from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import AutoSizeTextArea from './AutoTextArea';
import axios from 'axios';
const bottomChatHeight = 50;

const ChatRoomStyle = styled.div`
height: 100%;
box-sizing: border-box;
width: 100%;
overflow-x: hidden;
.chatBox {
    display: flex;
    margin: 10px 20px;

    .Profile {
        display: flex;
        flex-direction: column;
        color: #FFF;

        img {
            border-radius: 50%;
            width: 70px;
            height: 70px;
        }

        span.time {
            font-size: 0.75em;
            position: relative;
            top: -3px;
        }
    }
    div {
        display: flex;
        align-items: center;
        position: relative;
    }
    &.right {
        justify-content: flex-end;
    }

    .MessageDialogue {
        flex: 1;
        position: relative;
        background-color: #9BFF91;
        padding: 10px 10px 10px 10px;
        display: block;
        max-width: ${(props) => props.width && `${props.width - 2*120}px`};

        &.left {
            left: 30px;
        }

        &.right {
            right: 30px;
            background-color: #70CEFF;
        }

        &.left:before {
            content: ' ';
            position: absolute;
            width: 0;
            height: 0;
            left: -20px;
            right: auto;
            top: 0px;
            transform: translateY(10px);
            bottom: auto;
            border: 22px solid;
            border-color: #9BFF91 transparent transparent transparent;
        }

        &.right:before {
            content: ' ';
            position: absolute;
            width: 0;
            height: 0;
            right: -20px;
            top: 0px;
            transform: translateY(10px);
            bottom: auto;
            border: 22px solid;
            border-color: #70CEFF transparent transparent transparent;
        }

        span {
            position: relative;
            z-index: 1100;
        }
    }
}

.chat-list {
    box-sizing: border-box;
    ${bottomChatHeight && `margin-bottom: ${bottomChatHeight}px;`}
}

.bottom-chat {
    position: fixed;
    ${(props) => props.width && `width: ${props.width}px;`}
    ${bottomChatHeight && `height: ${bottomChatHeight}px;`}
    bottom: 0px;
    background-color: #FFFFFFAA;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1101;

    input {
        width: calc(100% - 100px);
    }

    button {
        width: 50px;
        margin-left: 10px;
        background-color: #00C97AEE;
        font-size: 1rem;
        color: #FFF;
        width: 50px;
        height: 30px;
        outline: none;
        border: none;
        border-radius: 15px;

        &:hover {
            filter: brightness(0.9);
        }
        &:active {
            filter: brightness(0.85);
        }
    }
}

.center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: calc(100vh - 80px);
    color: #FFF;
    font-size: 1.5rem;

    span {
        width: 80%;
        text-align: center;
    }

    img {
        width: 15vw;
        min-width: 150px;
    }

    button {
        width: 70px;
        height: 30px;
        outline: none;
        background: #F35429;
        border: none;
        color: #FFF;
        font-size: 0.8rem;
        margin: 0px 5px;

        &:hover, &:active {
            color: #F35429;
            background: #FFF;
        }

        &:active {
            filter: brightness(0.9);
        }
    }
}

input, textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 5px 15px;
    min-height: 30px;
    height: 30px;
    border-radius: 20px;
    outline: none;
    border: 2px solid #FFFFFF;
    background-color: #FFFFFFBB;
    color: #777;
    font-size: 1rem;

    &::placeholder {
        color: #AAA;
        opacity: 0.7;
    }
}
`;

class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: -1
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        const Message = this._Message.value;
        this._Message.value = ''
        return false;
    }

    onRejectRequest = () => {
        alert("SAD")
    }

    onJoinRequest = async () => {
        console.log(this.props.sharedStore)
        try{
            const response = await axios.post('http://localhost:3001/chat/join',{
                groupId:"5ad5cabd39686d49b8a2331b",
                userId: this.props.sharedStore.userId.data
            });
            console.log(response);
        }catch (error) {
            console.error(error);
        }
    }

    componentDidMount() {
        this._isMounted = true
        setTimeout(() => {
            if(this._isMounted) {
                this.setState({ width: ReactDOM.findDOMNode(this).offsetWidth });

                let _this = this;
                window.addEventListener("resize", () => {
                    _this.setState({ width: ReactDOM.findDOMNode(_this).offsetWidth });
                })
            }
        }, 10);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { selectedIndex } = this.props;
        const Default = (
            <ChatRoomStyle width={this.state.width}>
                <div className="center">
                    <img src="/static/resources/logo/light.png" />
                    <span>No Chat Selected</span>
                </div>
            </ChatRoomStyle>
        );

        const NotMember = (
            <ChatRoomStyle width={this.state.width}>
                <div className="center">
                    <img src="/static/resources/logo/light.png" />
                    <span>You are not a member. Do you want to join?</span>
                    <div>
                        <button onClick={this.onJoinRequest}>Yes</button>
                        <button onClick={this.onRejectRequest}>No</button>
                    </div>
                </div>
            </ChatRoomStyle>
        )

        if(selectedIndex === -1) {
            return Math.floor(Math.random() * 1000) < 500 ? Default : NotMember;
        }


        return (
            <ChatRoomStyle width={this.state.width}>
                <div className="chat-list">
                    <div className="chatBox">
                        <div className="Profile">
                            <img src="http://via.placeholder.com/100x100" />
                            <span>Person A</span>
                            <span className="time">Time</span>
                        </div>
                        <div>
                            <div className="MessageDialogue left blue">
                                <span>
                                    Dolore sint veniam sint do exercitation reprehenderit. Et ea laborum velit ea anim pariatur nulla dolor nulla aute nulla consequat ipsum. Irure culpa laborum mollit sunt amet nulla deserunt. Magna aute excepteur eiusmod consectetur excepteur ipsum consectetur sit reprehenderit fugiat commodo esse. Proident sunt esse do eu pariatur exercitation tempor minim. Laboris nisi esse anim ad id nisi quis fugiat sunt. Ea occaecat esse fugiat aliquip velit quis. Veniam Lorem incididunt labore cupidatat enim eiusmod.
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="chatBox right">
                        <div>
                            <div className="MessageDialogue right blue">
                                <span>
                                    Test dialogue
                                </span>
                            </div>
                        </div>
                        <div className="Profile">
                            <img src="http://via.placeholder.com/100x100" />
                            <span>Person B</span>
                            <span className="time">Time</span>
                        </div>
                    </div>
                    <div className="chatBox">
                        <div className="Profile">
                            <img src="http://via.placeholder.com/100x100" />
                            <span>Person A</span>
                            <span className="time">Time</span>
                        </div>
                        <div>
                            <div className="MessageDialogue left blue">
                                <span>
                                    Test dialogue
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="chatBox right">
                        <div>
                            <div className="MessageDialogue right blue">
                                <span>
                                    Test dialogue
                                </span>
                            </div>
                        </div>
                        <div className="Profile">
                            <img src="http://via.placeholder.com/100x100" />
                            <span>Person B</span>
                            <span className="time">Time</span>
                        </div>
                    </div>
                    <div className="chatBox">
                        <div className="Profile">
                            <img src="http://via.placeholder.com/100x100" />
                            <span>Person A</span>
                            <span className="time">Time</span>
                        </div>
                        <div>
                            <div className="MessageDialogue left blue">
                                <span>
                                    Test dialogue
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="chatBox right">
                        <div>
                            <div className="MessageDialogue right blue">
                                <span>
                                    Test dialogue
                                </span>
                            </div>
                        </div>
                        <div className="Profile">
                            <img src="http://via.placeholder.com/100x100" />
                            <span>Person B</span>
                            <span className="time">Time</span>
                        </div>
                    </div>
                    <div className="chatBox">
                        <div className="Profile">
                            <img src="http://via.placeholder.com/100x100" />
                            <span>Person A</span>
                            <span className="time">Time</span>
                        </div>
                        <div>
                            <div className="MessageDialogue left blue">
                                <span>
                                    Test dialogue
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="chatBox right">
                        <div>
                            <div className="MessageDialogue right blue">
                                <span>
                                    Test dialogue
                                </span>
                            </div>
                        </div>
                        <div className="Profile">
                            <img src="http://via.placeholder.com/100x100" />
                            <span>Person B</span>
                            <span className="time">Time</span>
                        </div>
                    </div>
                    <div className="chatBox">
                        <div className="Profile">
                            <img src="http://via.placeholder.com/100x100" />
                            <span>Person A</span>
                            <span className="time">Time</span>
                        </div>
                        <div>
                            <div className="MessageDialogue left blue">
                                <span>
                                    Test dialogue
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="chatBox right">
                        <div>
                            <div className="MessageDialogue right blue">
                                <span>
                                    Test dialogue
                                </span>
                            </div>
                        </div>
                        <div className="Profile">
                            <img src="http://via.placeholder.com/100x100" />
                            <span>Person B</span>
                            <span className="time">Time</span>
                        </div>
                    </div>
                </div>
                <form
                    className="bottom-chat"
                    onSubmit={this.onSubmit}
                >
                    <input placeholder="Message" ref={(me) => this._Message = me} />
                    <button type="submit"><i className="fa fa-paper-plane" /></button>
                </form>
            </ChatRoomStyle>
        );
    }
}

export default ChatRoom;
