import React from 'react';
import './StatusLight.css'

//props :
// status : string
// width : string
class StatusLight extends React.Component {
    map = {
        "marginal" : "amber",
        "satisfactory" : "green",
        "unsatisfactory" : "red",
        "default" : "default"
    }

    render() {
        var borderWidth = "5px"
        if (this.props.width !== undefined) {
            borderWidth = this.props.width
        }
        return (
            <div className="statusLight" style={{margin:'auto'}}>
                <div style={{borderWidth : borderWidth}} className={this.map[this.props.status] + " innerButtonLight"} > </div>
            </div>
        );
    }
}

export default StatusLight