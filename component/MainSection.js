import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'

const MainSectionStyle = styled.section`
background-color: #F1F1F177;
box-sizing: border-box;
${(props) => { return props.bgColor && `background-color: ${props.bgColor};` }}
${(props) => { return props.color && `color: ${props.color};` }}
position: fixed;
overflow-y: scroll;
`;

class MainSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parentWidth: -1
        }
    }
    componentDidMount() {
        if (this.props.isRendered) {
            this.setState({
                parentWidth: ReactDOM.findDOMNode(this._me).parentNode.offsetWidth
            })
            let _this = this;
            window.addEventListener("resize", () => {
                if (ReactDOM.findDOMNode(_this._me)) {
                    this.setState({
                        parentWidth: ReactDOM.findDOMNode(_this._me).parentNode.offsetWidth
                    })
                }
            })
        }
    }

    render() {
        const { bgColor, color, offsetHeight, height } = this.props;
        return (
            <PerfectScrollbar>
                <MainSectionStyle bgColor={bgColor} color={color} ref={(me) => this._me = me} style={{
                    width: `${this.state.parentWidth}px`,
                    marginTop: `${offsetHeight}`,
                    height: `${height}`
                }}>
                    
                        {this.props.children}
                </MainSectionStyle>
            </PerfectScrollbar>
        );
    }
}

export default MainSection;
