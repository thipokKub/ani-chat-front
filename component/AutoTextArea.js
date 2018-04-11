import React, { Component } from 'react';

class AutoSizeTextArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: "auto"
        }
    }

    onResize = (e) => {
        this.setState({
            height: e.target.scrollHeight + 'px'
        })
    }

    // componentDidMount() {
    //     let e = {
    //         target: this._textArea
    //     }
    //     this.onResize(e);
    // }

    render() {
        return (
            <textarea
                ref={(me) => this._textArea = me}
                onKeyDown={this.onResize}
                style={{
                    height: this.state.height
                }}
            />
        );
    }
}

export default AutoSizeTextArea;