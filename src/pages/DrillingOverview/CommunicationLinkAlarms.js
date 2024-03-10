import React from 'react';
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';
import './DrillingOverview.css'

import ClearRoundIcon from '../../assets/Icon/ClearRoundIndicator.png'
import RedRoundIcon from '../../assets/Icon/RedRoundIndicator.png'

class CommunicationLinkAlarms extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        var data = this.props.data
        var 
            profibusCommonFaultSrc = ClearRoundIcon,
            drivebusCommonFaultSrc = ClearRoundIcon
        if (data.profibusCommonFault) {
            profibusCommonFaultSrc = RedRoundIcon
        }
        if (data.drivebusCommonFault) {
            drivebusCommonFaultSrc = RedRoundIcon
        }
        return (
        <Row style={{marginTop : "5px"}}>
            <Col>
                <div className="cardBG" style = {{padding : "10px"}}>
                    <Row>
                        <Col style={{paddingBottom : "15px"}}>
                            Communication Link Alarms
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6} xs ={12}>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col xs={4} sm={2} lg={2} ><img src={profibusCommonFaultSrc} /></Col>
                                        <Col xs={8} sm={10} lg={10} style={{alignSelf : "center"}}>Profibus Common Fault</Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col xs={4} sm={2} lg={2}><img src={drivebusCommonFaultSrc} /></Col>
                                        <Col xs={8} sm={10} lg={10} style={{alignSelf : "center"}}>Drivebus Common Fault</Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>)
    }
}

export default CommunicationLinkAlarms;
