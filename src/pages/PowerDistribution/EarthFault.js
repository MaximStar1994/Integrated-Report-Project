import React from 'react';

import {withLayoutManager} from '../../Helper/Layout/layout'
class EarthFault extends React.Component {
    render() {
        var color = "white"
        if (this.props.faulted) {
            color = "red"
        }
        var fontSizeStyle={
            fontSize : this.props.renderFor === 2 ? "0.5rem" : this.props.renderFor === 1 ? "0.5rem" : "1rem",
            lineHeight : this.props.renderFor === 2 ? "0.5rem" : this.props.renderFor === 1 ? "0.5rem" : "1rem",
            fontWeight : this.props.renderFor === 2 ? "500" : this.props.renderFor === 1 ? "bold" : "bold",
        }
        return (
            <div style={{borderRadius : "15px", backgroundColor : "black", padding : this.props.renderFor === 2 ? "5px" : this.props.renderFor === 1 ? "5px" : "10px", color : color}}>
                <div style={fontSizeStyle}>EARTH FAULT</div>
            </div>
        )
    }
}
export default withLayoutManager(EarthFault);