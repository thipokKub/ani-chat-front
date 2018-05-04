import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router'
import Head from 'next/head';
import enhancedComponent from '../hoc/enhancedComponent';
import stylesheet from './style/index.scss';
import { Card, AppBar, MainSection, GroupList, ChatRoom } from '../component';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import io from 'socket.io-client';
import axios from 'axios';

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

const getStr = (str) => {
    return typeof(str) === "string" ? str : '';
}

const IndexStyled = styled.section`
display: flex;
height: 100vh;
.sideNav {
    width: 350px;
    max-width: 350px;
    min-width: 350px;
    height: 100%;
}
.MainApp {
    width: 100%;
    height: 100%;
}
`;

const LoginFailed = styled.section`
display: flex;
flex-direction: column;
height: 100vh;
justify-content: center;
align-items: center;
h1 {
    margin: 5px 0px;
}
span {
    font-size: 1.2em;
}
`

const TransparentSection = styled.section`
section.content {
    position: fixed;
    width: 100vw;
}
section.background {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background-image: url('/static/resources/bg2.jpg');
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
    transform: scale(1.1);
    filter: blur(5px);
}
`;

let callbackRedirect = null;

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navHeight: -1,
            isNoUserFound: false,
            redirectedDot: 0,
            redirectedInterval: -1,
            selectedChatIndex: -1,
            isCreating: false,
            socket: io("http://localhost:3001")
        }
        callbackRedirect = () => {
            setTimeout(() => {
                if (this._isMounted) {
                    this.onInit();
                }
            }, 50);
        }
    }
    onChangeSelectedIndex = (idx) => {
        // var socket = io("http://localhost:3001");
        // const packet = {
        //     userId: this.props.map.UserStat.username,
        //     groupId: "5ad5cabd39686d49b8a2331b"
        // }
        // socket.emit('connectGroup',packet ,function(result) {
        //     console.log(result);
        // })
        return () => {
            if (this.state.selectedChatIndex === idx) {
                this.setState({
                    selectedChatIndex: -1
                })
            } else {
                this.setState({
                    selectedChatIndex: idx,
                    isCreating: false
                })
            }
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if(typeof _.get(this.props, 'map.ChatStore.groupList.data', null) === "undefined" ||
            _.get(this.props, 'map.ChatStore.groupList.data', null) === null
        ) {
            this.onInit();
        }
    }
    onFetchChatList = () => {
        setTimeout(async () => {
            try {
                const { userId } = this.props.map.UserStat;
                const { location } = this.props.map.Page;
                let response = await axios.get(`${location.data}/chat/all?id=${userId.data}`);
                response = response.data;
                this.props.updateMapId("ChatStore", "groupList", {
                    data: response
                });
            } catch (e) {
                console.error(e);
            }
        }, 0);
    }
    onInit = () => {
        if (!this.props.map.UserStat
            || !this.props.map.UserStat.username
            || !this.props.map.UserStat.password
            || _.get(this.props, 'map.UserStat.username.data', '').length === 0
            || _.get(this.props, 'map.UserStat.password.data', '').length === 0
        ) {
            setTimeout(() => {
                clearInterval(this.state.redirectedInterval)
                Router.push({
                    pathname: '/'
                });
            }, 3000);

            let _this = this;
            this.setState({
                isNoUserFound: true,
                redirectedDot: 0,
                redirectedInterval: setInterval(() => {
                    _this.setState({
                        redirectedDot: (_this.state.redirectedDot + 1) % 3
                    })
                }, 300)
            })
        } else {
            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({
                        navHeight: ReactDOM.findDOMNode(this._nav).offsetHeight
                    })
                    let _this = this;
                    window.addEventListener("resize", () => {
                        if (ReactDOM.findDOMNode(_this._nav)) {
                            this.setState({
                                navHeight: ReactDOM.findDOMNode(_this._nav).offsetHeight
                            })
                        }
                    })
                }
            }, 10)
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.onInit();
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    onClickCreate = () => {
        this.setState({ isCreating: true })
    }
    onCloseCreate = () => {
        this.setState({ isCreating: false })
    }
    onToggleCreate = () => {
        this.setState({
            isCreating: !this.state.isCreating,
            selectedChatIndex: -1
        })
    }
    render() {
        const propsFunc = {
            initMapId: this.props.initMapId,
            updateMapId: this.props.updateMapId,
            replaceMapId: this.props.replaceMapId,
            errorMapId: this.props.errorMapId
        }

        const { isNoUserFound, redirectedDot, selectedChatIndex } = this.state;

        if(isNoUserFound) {
            return (
                <LoginFailed>
                    <h1>Login failed</h1>
                    <span>Redirecting<span></span>{
                        Array.from(Array(redirectedDot).keys()).map((it) => <span key={it}>.</span>)
                    }</span>
                </LoginFailed>
            );
        }

        let sharedStore = {
            groupList: [],
            username: this.props.map.UserStat ? this.props.map.UserStat.username : "",
            password: this.props.map.UserStat ? this.props.map.UserStat.password : "",
            userId: this.props.map.UserStat ? this.props.map.UserStat.userId : "",
            picture: _.get(this.props.map, 'UserStat.picture.data', -1),
            url: _.get(this.props.map, 'Page.location.data', '')
        }

        if(this.props.map.ChatStore) {
            sharedStore.groupList = this.props.map.ChatStore.groupList.data
        }

        let TitleName = 'Chat';
        if (selectedChatIndex !== -1) {
            TitleName = sharedStore.groupList[selectedChatIndex].name
        }

        return (
            <TransparentSection>
                <section className="content">
                    <IndexStyled>
                        <section className="sideNav">
                            <AppBar
                                text={'Chat List'}
                                icon={'fa fa-users'}
                                bgColor={'#FFFFFFCC'}
                                color={'#333'}
                                ref={(nav) => this._nav = nav}
                                isRendered={!isNoUserFound}
                                sharedStore={sharedStore}
                            />
                            <MainSection
                                offsetHeight={`${this.state.navHeight}px`}
                                height={`calc(100vh - ${this.state.navHeight}px)`}
                                bgColor={'#FFFFFF33'}
                                isRendered={!isNoUserFound}
                                sharedStore={sharedStore}
                                zIndex={900}
                            >
                                <GroupList
                                    isRendered={!isNoUserFound}
                                    sharedStore={sharedStore}
                                    onSelectedIndex={this.onChangeSelectedIndex}
                                    onToggleCreate={this.onToggleCreate}
                                    isCreating={this.state.isCreating}
                                    onCloseCreate={this.onCloseCreate}
                                />
                            </MainSection>
                        </section>
                        <section className="MainApp">
                            <AppBar
                                text={TitleName}
                                icon={'fa fa-comments-o'}
                                isMain={true}
                                bgColor={'#FFFFFFBB'}
                                propsFunc={propsFunc}
                                isRendered={!isNoUserFound}
                                sharedStore={sharedStore}
                                onFetchChatList={this.onFetchChatList}
                                selectedChat={_.get(this.props, `map.ChatStore.groupList.data[${this.state.selectedChatIndex}]`, null)}
                                socket={this.state.socket}
                                oProps={this.props}
                            />
                            <MainSection
                                offsetHeight={`${this.state.navHeight}px`}
                                height={`calc(100vh - ${this.state.navHeight}px)`}
                                bgColor={'#FFFFFF40'}
                                isRendered={!isNoUserFound}
                                sharedStore={sharedStore}
                                zIndex={800}
                            >
                                <ChatRoom
                                    isRendered={!isNoUserFound}
                                    sharedStore={sharedStore}
                                    selectedIndex={this.state.selectedChatIndex}
                                    selectedChat={_.get(this.props, `map.ChatStore.groupList.data[${this.state.selectedChatIndex}]`, null)}
                                    onClickCreate={this.onClickCreate}
                                    onCloseCreate={this.onCloseCreate}
                                    isCreating={this.state.isCreating}
                                    onFetchChatList={this.onFetchChatList}
                                    socket={this.state.socket}
                                    propsFunc={propsFunc}
                                />
                            </MainSection>
                        </section>
                    </IndexStyled>
                </section>
                <section className="background" />
            </TransparentSection>
        );
    }
}

export default enhancedComponent(Index, {
    enableRedux: true,
    headOption: [{
        tag: 'title',
        content: 'Chat Project'
    }],
    styleUrls: [stylesheet],
    callbackDone: callbackRedirect
})
