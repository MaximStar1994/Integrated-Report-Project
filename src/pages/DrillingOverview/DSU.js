import React from 'react';
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';
import './DrillingOverview.css'

import ClearRoundIcon from '../../assets/Icon/ClearRoundIndicator.png'
import RedRoundIcon from '../../assets/Icon/RedRoundIndicator.png'
import BlueLED from '../../assets/Icon/LEDBlue.png'
import GreenLED from '../../assets/Icon/LEDGreen.png'
import {withLayoutManager} from '../../Helper/Layout/layout'
class DSU extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        var data = this.props.data
        var 
            dsuTripped = ClearRoundIcon, 
            dsuAlarm = ClearRoundIcon, 
            dsuDrivebusFault = ClearRoundIcon
        var dsuRunning = BlueLED
        if (data.dsuTripped) {
            dsuTripped = RedRoundIcon
        }
        if (data.dsuAlarm) {
            dsuAlarm = RedRoundIcon
        }
        if (data.dsuDrivebusFault) {
            dsuDrivebusFault = RedRoundIcon
        }
        if (data.dsuRunning) {
            dsuRunning = GreenLED
        }
        var imageStyle={ padding : this.props.renderFor === 2 ? "5px" : "" }
        return (
        <div className="cardBG" style={{padding : "10px", height : "100%"}}>
            <Row >
                <Col xs={4} sm={3} lg={2}>
                    <img src={dsuRunning} className="img-responsive"/>
                </Col>
                <Col xs={8} sm={9} lg={10} >
                    <div style={{display : "flex", height : "100%", alignItems : "center"}}>DSU</div>
                </Col>
            </Row>
            <Row style={{textAlign : "center", marginTop : "15px"}}>
                <Col>
                    <Row>
                        <Col className="vfdlabel">
                            Main AC Voltage
                        </Col>
                    </Row>
                    <Row>
                        <Col className="vfdvalue">
                           {data.dsuACVoltage}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="vfdunit">
                            Volts
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <Col className="vfdlabel">
                            Main DC Voltage
                        </Col>
                    </Row>
                    <Row>
                        <Col className="vfdvalue">
                           {data.dsuDCVoltage}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="vfdunit">
                            VDC
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <Col className="vfdlabel">
                            Actual Power
                        </Col>
                    </Row>
                    <Row>
                        <Col  className="vfdvalue">
                           {data.dsuACVoltage}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="vfdunit">
                            kW
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row style={{marginTop : "5px"}}>
                <Col xs={{span : 10, offset : 1}}>
                    <Row style={{marginTop : "5px", marginBottom : "5px"}}>
                        <Col xs={3} sm={3} lg={2} style={imageStyle}><img src={dsuTripped} className="img-responsive"/></Col>
                        <Col xs={9} sm={9} lg={10}><div style={{display : "flex", height : "100%", alignItems : "center"}}>DSU Tripped</div></Col>
                    </Row>
                    <Row style={{marginTop : "5px", marginBottom : "5px"}}>
                        <Col xs={3} sm={3} lg={2} style={imageStyle}><img src={dsuAlarm} className="img-responsive"/></Col>
                        <Col xs={9} sm={9} lg={10}><div style={{display : "flex", height : "100%", alignItems : "center"}}>DSU Alarm</div></Col>
                    </Row>
                    <Row style={{marginTop : "5px", marginBottom : "5px"}}>
                        <Col xs={3} sm={3} lg={2} style={imageStyle}><img src={dsuDrivebusFault} className="img-responsive"/></Col>
                        <Col xs={9} sm={9} lg={10}><div style={{display : "flex", height : "100%", alignItems : "center"}}>DSU Drivebus Common Fault</div></Col>
                    </Row>
                </Col>
            </Row>
        </div>)
    }
}

export default withLayoutManager(DSU);
