import React from 'react';
import './StatusLight.css'

//props :
// status : string
// height : string
class StatusBox extends React.Component {
    map = {
        "marginal" : "amber",
        "satisfactory" : "green",
        "unsatisfactory" : "red",
        "default" : "default"
    }

    render() {
        return (
            <div className="" style={{padding:'10px'}} style={{width : this.props.width, height : this.props.height, margin : "auto"}}>
                <div className={this.map[this.props.status]} style={{width : "100%", height : "100%"}}> </div>
            </div>
        );
    }
}

export default StatusBox