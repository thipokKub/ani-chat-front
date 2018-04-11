import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router'
import Head from 'next/head';
import enhancedComponent from '../hoc/enhancedComponent';
import stylesheet from './style/index.scss';
import { Card, AppBar, MainSection, GroupList, ChatRoom } from '../component';
import styled from 'styled-components';
import ReactDOM from 'react-dom';

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

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navHeight: -1,
            isNoUserFound: false,
            redirectedDot: 0,
            redirectedInterval: -1
        }
    }
    componentDidMount() {
        this._isMounted = true
        if(!this.props.map.UserStat
            || !this.props.map.UserStat.username
            || !this.props.map.UserStat.password
            || this.props.map.UserStat.username.data.length === 0
            || this.props.map.UserStat.password.data.length === 0
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
                        redirectedDot: (_this.state.redirectedDot + 1)%3
                    })
                }, 300)
            })
        } else {
            setTimeout(() => {
                if(this._isMounted) {
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
                    if (!this.props.map["ChatStore"]) {
                        this.props.initMapId("ChatStore", "groupList")
                        this.props.updateMapId("ChatStore", "groupList", {
                            data: [{
                                name: "Distributed System",
                                _id: "abcdef",
                                chatId: "1234abcd",
                                members: ["TPK", "TM", "Pol", "Fair", "Gam", "Golf"]
                            }, {
                                name: "Database",
                                _id: "abcdff",
                                chatId: "1234abce",
                                members: ["TPK", "TM", "Pol", "Fair", "Golf"]
                            }, {
                                name: "System Analysis and Design",
                                _id: "abce00",
                                charId: "1234abcf",
                                members: ["TPK", "TM", "Pol", "Fair", "Golf", "Nick"]
                            }]
                        })
                        this.props.initMapId("ChatStore", "chatList")
                        this.props.updateMapId("ChatStore", "chatList", {
                            data: {
                                "1234abcd": [],
                                "abcdff": [],
                                "abce00": []
                            }
                        })
                    }
                }
            }, 10)
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        const propsFunc = {
            initMapId: this.props.initMapId,
            updateMapId: this.props.updateMapId,
            replaceMapId: this.props.replaceMapId,
            errorMapId: this.props.errorMapId
        }

        const { isNoUserFound, redirectedDot } = this.state;

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
            password: this.props.map.UserStat ? this.props.map.UserStat.password : ""
        }

        if(this.props.map.ChatStore) {
            sharedStore.groupList = this.props.map.ChatStore.groupList.data
        }

        return (
            <TransparentSection>
                <section className="content">
                    <IndexStyled>
                        <section className="sideNav">
                            <AppBar
                                text={'Group List'}
                                icon={'fa fa-users'}
                                bgColor={'#FFFFFFCC'}
                                color={'#777'}
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
                                />
                            </MainSection>
                        </section>
                        <section className="MainApp">
                            <AppBar
                                text={'Chat'}
                                icon={'fa fa-comments-o'}
                                isMain={true}
                                bgColor={'#FFFFFFBB'}
                                propsFunc={propsFunc}
                                isRendered={!isNoUserFound}
                                sharedStore={sharedStore}
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
    styleUrls: [stylesheet]
})