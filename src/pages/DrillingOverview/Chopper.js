import React from 'react';
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';
import './DrillingOverview.css'

import ClearRoundIcon from '../../assets/Icon/ClearRoundIndicator.png'
import RedRoundIcon from '../../assets/Icon/RedRoundIndicator.png'
import {withLayoutManager} from '../../Helper/Layout/layout'

class Chopper extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        var data = this.props.data
        var 
            chopperTripped = ClearRoundIcon,
            chopperAlarm = ClearRoundIcon,
            chopperTempHigh = ClearRoundIcon,
            chopperBraking = ClearRoundIcon,
            chopperDriveBus = ClearRoundIcon,
            chopperAirFlow = ClearRoundIcon
        if (data.chopperTripped) {
            chopperTripped = RedRoundIcon
        }
        if (data.chopperAlarm) {
            chopperAlarm = RedRoundIcon
        }
        if (data.chopperTempHigh) {
            chopperTempHigh = RedRoundIcon
        }
        if (data.chopperBraking) {
            chopperBraking = RedRoundIcon
        }
        if (data.chopperDriveBus) {
            chopperDriveBus = RedRoundIcon
        }
        if (data.chopperAirFlow) {
            chopperAirFlow = RedRoundIcon
        }
        var imgStyleProps = {
            padding : this.props.renderFor !== 0 ? "5px" : "",
            alignSelf : "center"
        }
        return (
            <div className="cardBG" style={{padding : "10px", height : "100%"}}>
            <Row >
                <Col>
                   Chopper
                </Col>
            </Row>
            <Row style={{textAlign : "center", marginTop : "15px"}}>
                <Col xs={{span : 4, offset : 2}}>
                    <Row>
                        <Col className="vfdlabel">
                            DC Voltage
                        </Col>
                    </Row>
                    <Row>
                        <Col className="vfdvalue">
                           {data.chopperDCVoltage}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="vfdunit">
                            VDC
                        </Col>
                    </Row>
                </Col>
                <Col xs={{span : 4, offset : 0}}>
                    <Row>
                        <Col className="vfdlabel">
                            Power
                        </Col>
                    </Row>
                    <Row>
                        <Col className="vfdvalue">
                           {data.chopperPower}
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
                <Col xs={{span : 10, offset : 1}} lg={{span : 6, offset : 0}}>
                    <Row style={{marginTop : "5px", marginBottom : "5px"}}>
                        <Col xs={3} sm={2} lg={3} style={imgStyleProps}><img src={chopperTripped} className="img-responsive" style={{paddingLeft : "20%"}}/></Col>
                        <Col xs={9} sm={10} lg={9}><div style={{display : "flex", height : "100%", alignItems : "center"}}>Chopper Tripped</div></Col>
                    </Row>
                    <Row style={{marginTop : "5px", marginBottom : "5px"}}>
                        <Col xs={3} sm={2} lg={3} style={imgStyleProps}><img src={chopperAlarm} className="img-responsive" style={{paddingLeft : "20%"}}/></Col>
                        <Col xs={9} sm={10} lg={9}><div style={{display : "flex", height : "100%", alignItems : "center"}}>Chopper Alarm</div></Col>
                    </Row>
                    <Row style={{marginTop : "5px", marginBottom : "5px"}}>
                        <Col xs={3} sm={2} lg={3} style={imgStyleProps}><img src={chopperTempHigh} className="img-responsive" style={{paddingLeft : "20%"}}/></Col>
                        <Col xs={9} sm={10} lg={9}><div style={{display : "flex", height : "100%", alignItems : "center"}}>Resistor Temperature High</div></Col>
                    </Row>
                </Col>
                <Col xs={{span : 10, offset : 1}} lg={{span : 6, offset : 0}}>
                    <Row style={{marginTop : "5px", marginBottom : "5px"}}>
                        <Col xs={3} sm={2} lg={3} style={imgStyleProps}><img src={chopperBraking} className="img-responsive" style={{paddingLeft : "20%"}}/></Col>
                        <Col xs={9} sm={10} lg={9}><div style={{display : "flex", height : "100%", alignItems : "center"}}>Chopper Braking</div></Col>
                    </Row>
                    <Row style={{marginTop : "5px", marginBottom : "5px"}}>
                        <Col xs={3} sm={2} lg={3} style={imgStyleProps}><img src={chopperDriveBus} className="img-responsive" style={{paddingLeft : "20%"}}/></Col>
                        <Col xs={9} sm={10} lg={9}><div style={{display : "flex", height : "100%", alignItems : "center"}}>Chopper Drivebus Common Fault</div></Col>
                    </Row>
                    <Row style={{marginTop : "5px", marginBottom : "5px"}}>
                        <Col xs={3} sm={2} lg={3} style={imgStyleProps}><img src={chopperAirFlow} className="img-responsive" style={{paddingLeft : "20%"}}/></Col>
                        <Col xs={9} sm={10} lg={9}><div style={{display : "flex", height : "100%", alignItems : "center"}}>BRU Fan Air Flow Lo</div></Col>
                    </Row>
                </Col>
            </Row>
        </div>)
    }
}

export default withLayoutManager(Chopper);
