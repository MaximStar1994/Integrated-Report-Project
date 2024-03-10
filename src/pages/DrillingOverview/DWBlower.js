import React from 'react';
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';
import './DrillingOverview.css'

import InactiveIcon from '../../assets/Icon/PowerInactiveIcon.png'
import ReadyIcon from '../../assets/Icon/PowerReadyIcon.png'
import RunningIcon from '../../assets/Icon/PowerRunningIcon.png'
class DWBlower extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        var data = this.props.data
        var blower = InactiveIcon
        if (data.blowerReady) {
            if (data.blowerRunning) {
                blower = RunningIcon
            } else {
                blower = ReadyIcon
            }
        }
        return (
            <div className="cardBG" style={{padding : "10px", height : "100%", display : "flex", alignItems : "center"}}>
                <div>
                    <Row style={{marginTop : "5px"}}>
                        <Col xs={4} sm={3} lg={{span : 2, offset : 1}}><img src={blower} className="img-responsive" style={{width:"80%", paddingLeft :"20%"}}/></Col>
                        <Col xs={8} sm={9} lg={9}><div style={{display : "flex", height : "100%", alignItems : "center"}}>Motor Blower</div></Col>
                    </Row>
                </div>
            </div>)
    }
}

export default DWBlower;
