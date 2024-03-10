import React from 'react';
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';
import './DrillingOverview.css'

import ClearRoundIcon from '../../assets/Icon/ClearRoundIndicator.png'
import RedRoundIcon from '../../assets/Icon/RedRoundIndicator.png'
import BlueLED from '../../assets/Icon/LEDBlue.png'
import GreenLED from '../../assets/Icon/LEDGreen.png'
class Inverter extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        var data = this.props.data
        var 
            inverterTripped = ClearRoundIcon,
            inverterAlarm = ClearRoundIcon
        var inverterRunning = BlueLED
        if (data.inverterRunning) {
            inverterRunning = GreenLED
        }
        if (data.inverterTripped) {
            inverterTripped = RedRoundIcon
        }
        if (data.inverterAlarm) {
            inverterAlarm = RedRoundIcon
        }
        return (
        <div className="cardBG" style={{padding : "10px", height : "100%"}}>
            <Row>
                <Col xs={4} sm={3} lg={{span : 2, offset : 0}}>
                    <img src={inverterRunning} className="img-responsive" />
                </Col>
                <Col xs={8} sm={9} lg={9} >
                    <div style={{display : "flex", height : "100%", alignItems : "center"}}>Inverter</div>
                </Col>
            </Row>
            <Row style={{marginTop : "15px", marginBottom : "5px"}}>
                <Col xs={4} sm={3} lg={{span : 2, offset : 1}}><img src={inverterTripped} className="img-responsive" style={{paddingLeft : "20%"}}/></Col>
                <Col xs={8} sm={9} lg={9}><div style={{display : "flex", height : "100%", alignItems : "center"}}>Inverter Tripped</div></Col>
            </Row>
            <Row>
                <Col xs={4} sm={3} lg={{span : 2, offset : 1}}><img src={inverterAlarm} className="img-responsive" style={{paddingLeft : "20%"}}/></Col>
                <Col xs={8} sm={9} lg={9}><div style={{display : "flex", height : "100%", alignItems : "center"}}>Inverter Alarm</div></Col>
            </Row>
        </div>)
    }
}

export default Inverter;
