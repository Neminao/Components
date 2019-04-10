import React from 'react';

interface PopupProps {
    myToggle: boolean,
    onClick: any
}

class PopupColorBox extends React.Component<PopupProps, {toggle: boolean}>{
    constructor(props: any) {
        super(props);
        this.state = {
            toggle: this.props.myToggle
        }
    }
    render = () => {
        const display = (this.props.myToggle) ? 'block' : 'none';

        return (
            <div>
                <button className={'colorButton'} onClick={this.props.onClick}>Click!</button>
                <div id='box' className="popup" style={{ display: display }}>
                    <label>Red:</label>
                    <input type="text" placeholder="0"></input>
                </div>
            </div>
        )
    }
}

export default PopupColorBox;