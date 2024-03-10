import React from 'react';
import '../../css/App.css';
import { Row,Col } from 'react-bootstrap';
import GeneratorStatus from './GeneratorStatus'
import BreakerClosed from '../../assets/Power/Breaker_Close.png'
import BreakerOpened from '../../assets/Power/Breaker_Opened.png'
import BreakerTripped from '../../assets/Power/Breaker_Tripped.png'
import {withLayoutManager} from '../../Helper/Layout/layout'
class Breaker extends React.Component {
    padDigits(number, digits) {
        return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
    }
    render() {
        var data = this.props.data
        var status = "off"
        if (data.running) {
            status="on"
        } else if (data.ready) {
            status="ready"
        }
        var breakerSrc = BreakerClosed
        if (data.breakerStatus == "open") {
            breakerSrc = BreakerOpened
        }
        if (data.breakerStatus == "tripped") {
            breakerSrc = BreakerTripped
        }
        var rowStyle = {
            paddingTop: this.props.renderFor === 0 ? "10px" : "5px", 
            paddingBottom : this.props.renderFor === 0 ? "10px" : ""
        }
        if (this.props.renderFor === 2) {
            return(
            <Row>
                <Col xs={{span : 12 }} >
                    <Row noGutters={true} style={{textAlign : "center"}}>
                        <Col xs={6} sm={8} lg={8} style={{alignSelf : "center"}}>
                            <Row noGutters={true} style={rowStyle}>
                                <Col xs={8} style={{ color : "#2d63f7"}} className="powerGaugeValue">
                                    {this.padDigits(data.frequency.toFixed(0),2)}
                                </Col>
                                <Col xs={4} className="powerGaugeUnit">
                                    Hz
                                </Col>
                            </Row>
                            <Row noGutters={true} style={{paddingBottom : "10px"}}>
                                <Col xs={8} style={{ color : "#2d63f7"}} className="powerGaugeValue">
                                    {this.padDigits(data.volt.toFixed(0),4)}
                                </Col>
                                <Col xs={4} className="powerGaugeUnit">
                                    Volt
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={6} sm={4} lg={4} style={{padding : this.props.renderFor === 0 ? "10px" : "5px"}}>
                            <GeneratorStatus name={this.props.name} status={status} />
                        </Col>
                    </Row>
                    <Row noGutters={true} className="powerGaugeUnit" style={{textAlign : "center", marginTop : "-10px"}}>
                        <Col xs={{span : 6, offset : 6}} style={{padding : "0 10px"}}>
                            <img src={breakerSrc} />
                        </Col>
                    </Row>
                </Col>
            </Row>)
        }
        return (
            <Row>
                <Col xs={{span : 12 }} >
                    <Row noGutters={true} style={{textAlign : "center"}}>
                        <Col xs={6} sm={8} lg={8} style={{alignSelf : "center"}}>
                            <Row style={rowStyle}>
                                <Col xs={8} style={{ color : "#2d63f7"}} className="powerGaugeValue">
                                    {this.padDigits(data.frequency.toFixed(0),2)}
                                </Col>
                                <Col xs={4} className="powerGaugeUnit">
                                    Hz
                                </Col>
                            </Row>
                            <Row  style={{paddingBottom : "10px"}}>
                                <Col xs={8} style={{ color : "#2d63f7"}} className="powerGaugeValue">
                                    {this.padDigits(data.volt.toFixed(0),4)}
                                </Col>
                                <Col xs={4} className="powerGaugeUnit">
                                    Volt
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={6} sm={4} lg={4} style={{padding : this.props.renderFor === 0 ? "10px" : "5px"}}>
                            <GeneratorStatus name={this.props.name} status={status} />
                        </Col>
                    </Row>
                    <Row noGutters={true} className="powerGaugeUnit" style={{textAlign : "center", marginTop : "-10px"}}>
                        <Col xs={{span : 4, offset : 8}} style={{padding : "0 10px"}}>
                            <img src={breakerSrc} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}

export default withLayoutManager(Breaker);
