import React, { Component } from 'react';
import styled from 'styled-components';
import AutoSizeTextArea from './AutoTextArea';
import moment from 'moment';
import Lorem from './LoremIpsum';
import _ from 'lodash';
import Loader from './Loader';
import $ from 'jquery';

const bottomChatHeight = 50;

const ChatRoomStyle = styled.div`
height: 100%;
box-sizing: border-box;
width: 100%;
overflow-x: hidden;
position: relative;

.middle {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

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


const GenerateBubble = (isMe, item, idx) => {
    return (
        <div className={`chatBox ${isMe ? 'right' : ''}`} key={idx}>
            {
                (!isMe && (
                    <div className="Profile">
                        <img src="http://via.placeholder.com/100x100" />
                        <span>{item.userName}</span>
                        <span className="time">{item.time}</span>
                    </div>
                ))
            }
            <div>
                <div className={`MessageDialogue ${isMe ? 'right blue' : 'left'}`}>
                    <span>
                        {item.message}
                    </span>
                </div>
            </div>
            {
                (isMe && (
                    <div className="Profile">
                        <img src="http://via.placeholder.com/100x100" />
                        <span>{item.userName}</span>
                        <span className="time">{item.time}</span>
                    </div>
                ))
            }
        </div>
    );
}

class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: -1,
            chat: [],
            isLoading: false
        }
    }

    scrollToBottom = () => {
        const elem = $(".chatRoom")[0];
        $(".chatRoom").animate({
            scrollTop: elem.scrollHeight
        }, 200)
    }

    onUpdateMessage = (newMessage) => {
        this.setState({
            chat: this.state.chat.concat([newMessage])
        })
    }

    onUpdateMessages = (newMessages) => {
        this.setState({
            chat: this.state.chat.concat(newMessages)
        })
    }

    onSubmit = async (e) => {
        e.preventDefault();
        try {
            const Message = this._Message.value;
            if(Message.trim().length > 0) {
                //Do some api logic here
                const response = await new Promise(
                    (res) => {
                        setTimeout(() => {
                            res({
                                "status": 1
                            })
                        }, 300)
                    })
                
                //Internal update
                this.setState({
                    chat: this.state.chat.concat([{
                        userName: _.get(this.props, "sharedStore.username.data", ""),
                        userId: -1,
                        message: Message.trim(),
                        time: moment().locale("en").format('Do MMMM YYYY, h:mm:ss a')
                    }])
                }, () => {
                    this._Message.value = '';
                    this.scrollToBottom();
                })
            }
        } catch(e) {

        }
        
        return false;
    }

    onFetchChat = (chatId) => {
        this.setState({ isLoading: true })
        setTimeout(() => {
            this.setState({
                chat: Array.from(new Array(5).keys()).map((idx) => {
                    const randomP = Math.floor(Math.random() * 2);
                    return ({
                        userName: randomP == 1 ? "Person A" : "Person B",
                        userId: randomP,
                        message: Lorem.getSentence(),
                        time: moment().locale("en").format('Do MMMM YYYY, h:mm:ss a')
                    });
                }),
                isLoading: false
            }, () => {
                const elem = $(".chatRoom")[0];
                elem.scrollTop = elem.scrollHeight
            })
        }, Math.floor(Math.random()*1.5*1000 + 500));
    }

    onRejectRequest = () => {
        alert("SAD")
    }

    onRequestJoin = () => {
        this.setState({ isLoading: true })
        setTimeout(() => {
            alert("Your request had been rejected");
            this.setState({ isLoading: false })
        }, 1500);
    }

    componentDidMount() {
        this._isMounted = true
        setTimeout(() => {
            if(this._isMounted) {
                this.setState({ width: $(".chatRoom")[0].offsetWidth });

                let _this = this;
                window.addEventListener("resize", () => {
                    _this.setState({ width: $(".chatRoom")[0].offsetWidth });
                })
            }
        }, 10);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (_.get(prevProps, 'selectedChat.chatId', '') !== _.get(this.props, 'selectedChat.chatId', '')) {
            this.onFetchChat(_.get(this.props, 'selectedChat.chatId', ''))
            if (prevProps.selectedIndex !== this.props.selectedIndex) {
                this.setState({ isLoading: true, chat: [] })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onRequestNewChat = (e) => {
        e.preventDefault();
        if ($($(e.target).children()[0]).is("input")) {
            $(e.target).children()[0].value = '';
        } else if ($($(e.target).siblings()[0]).is("input")) {
            $(e.target).siblings()[0].value = '';
        }
        return true;
    }

    render() {
        const { selectedIndex, selectedChat, isCreating } = this.props;
        const { chat, isLoading } = this.state;

        if (isLoading && selectedIndex !== -1) {
            return (
                <ChatRoomStyle width={this.state.width} className="chatRoom">
                    <div className="middle">
                        <Loader scale={2} />
                    </div>
                </ChatRoomStyle>
            );
        }

        if (isCreating) {
            return (
                <ChatRoomStyle width={this.state.width} className="chatRoom">
                    <div className="center">
                        <img src="/static/resources/logo/light.png" />
                        <span>Ceate New Chat</span>
                        <form onSubmit={this.onRequestNewChat}>
                            <div style={{ display: 'flex'}}>
                                <input placeholder="Chat Name"/>
                                <button
                                    type="submit"
                                    style={{
                                        borderRadius: '20px'
                                    }}
                                    onClick={this.onRequestNewChat}
                                ><i className="fa fa-paper-plane" /></button>
                            </div>
                        </form>
                    </div>
                </ChatRoomStyle>
            );
        }

        const Default = (
            <ChatRoomStyle width={this.state.width} className="chatRoom">
                <div className="center">
                    <img src="/static/resources/logo/light.png" />
                    <span>No Chat Selected</span>
                </div>
            </ChatRoomStyle>
        );

        const NotMember = (
            <ChatRoomStyle width={this.state.width} className="chatRoom">
                <div className="center">
                    <img src="/static/resources/logo/light.png" />
                    <span>You are not a member. Do you want to join?</span>
                    <div>
                        <button onClick={this.onRequestJoin}>Yes</button>
                        <button onClick={this.onRejectRequest}>No</button>
                    </div>
                </div>
            </ChatRoomStyle>
        )

        if(selectedIndex === -1) {
            return Default;
        }

        if (_.get(selectedChat, 'members', []).indexOf(_.get(this.props, "sharedStore.username.data", "")) === -1) {
            return NotMember;
        }


        return (
            <ChatRoomStyle
                width={this.state.width}
                style={{ paddingBottom: '30px'}}
                className="chatRoom"
            >
                <div className="chat-list">
                    {chat.map((item, idx) => {
                        return GenerateBubble(item.userName === _.get(this.props, "sharedStore.username.data", ""), item, idx)
                    })}
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