import React from 'react';
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';
import './DrillingOverview.css'
import SemiCircleGauge from '../../components/Gauge/SemiCircleGauge'
import {withLayoutManager} from '../../Helper/Layout/layout'
class VFDGauges extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        var data = this.props.data
        if (this.props.renderFor === 2) {
            return (
                <div className="cardBG">
                <Row>
                    <Col xs={{span : 12, offset : 0}}>
                        <Row >
                            <Col>
                                <div style={{paddingLeft : "10%", width : "90%", paddingTop : "10px"}}>
                                    <SemiCircleGauge minVal={-100} maxVal={100} data={[{value : data.power, color : "#d2d5db"}]}/>
                                </div>
                            </Col>
                            <Col>
                                <div  style={{paddingLeft : "10%", width : "90%", paddingTop : "10px"}}>
                                    <SemiCircleGauge minVal={-3000} maxVal={3000} data={[{value : data.speedRef, color : "#d2d5db"}]}/>
                                </div>
                            </Col>
                            <Col>
                                <div  style={{paddingLeft : "10%", width : "90%", paddingTop : "10px"}}>
                                    <SemiCircleGauge minVal={-3000} maxVal={3000} data={[{value : data.actualSpeed, color : "#d2d5db"}]}/>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{textAlign : "center", 
                            fontSize : "0.8rem", 
                            lineHeight : "0.8rem"}}>
                            <Col>
                                %
                            </Col>
                            <Col>
                                RPM
                            </Col>
                            <Col>
                                RPM
                            </Col>
                        </Row>
                        <Row style={{textAlign : "center", paddingBottom : "10px", marginTop : "5px", 
                                    fontSize : "0.8rem", 
                                    lineHeight : "0.8rem"}
                        }>
                            <Col>
                                Actual Power 
                            </Col>
                            <Col>
                                Speed Ref
                            </Col>
                            <Col>
                                Motor Actual Speed
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={{span : 4, offset : 2}}>
                                <div  style={{paddingLeft : "10%", width : "90%", paddingTop : "10px"}}>
                                    <SemiCircleGauge minVal={0} maxVal={100} data={[{value : data.torque, color : "#d2d5db"}]}/>
                                </div>
                            </Col>
                            <Col xs={4}>
                                <div  style={{paddingLeft : "10%", width : "90%", paddingTop : "10px"}}>
                                    <SemiCircleGauge minVal={0} maxVal={300} data={[{value : data.temperature, color : "#d2d5db"}]}/>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{textAlign : "center", 
                            fontSize : "0.8rem", 
                            lineHeight : "0.8rem"}}>
                            <Col xs={{span : 4, offset : 2}}>
                                %
                            </Col>
                            <Col xs={4}>
                                &#8451;
                            </Col>
                        </Row>
                        <Row style={{textAlign : "center", paddingBottom : "10px", marginTop : "5px", 
                                    fontSize : "0.8rem", 
                                    lineHeight : "0.8rem"}
                        }>
                            <Col xs={{span : 4, offset : 2}}>
                                Motor Actual Torque
                            </Col>
                            <Col xs={4}>
                                Motor 1 Actual Temperature
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>)
        }
        return (
            <div className="cardBG">
            <Row>
                <Col sm={{span : 10, offset : 1}} xs={{span : 12, offset : 0}}>
                    <Row >
                        <Col>
                            <div style={{paddingLeft : "10%", width : "90%", paddingTop : "10px"}}>
                                <SemiCircleGauge minVal={-100} maxVal={100} data={[{value : data.power, color : "#d2d5db"}]}/>
                            </div>
                        </Col>
                        <Col>
                            <div  style={{paddingLeft : "10%", width : "90%", paddingTop : "10px"}}>
                                <SemiCircleGauge minVal={-3000} maxVal={3000} data={[{value : data.speedRef, color : "#d2d5db"}]}/>
                            </div>
                        </Col>
                        <Col>
                            <div  style={{paddingLeft : "10%", width : "90%", paddingTop : "10px"}}>
                                <SemiCircleGauge minVal={-3000} maxVal={3000} data={[{value : data.actualSpeed, color : "#d2d5db"}]}/>
                            </div>
                        </Col>
                        <Col>
                            <div  style={{paddingLeft : "10%", width : "90%", paddingTop : "10px"}}>
                                <SemiCircleGauge minVal={0} maxVal={100} data={[{value : data.torque, color : "#d2d5db"}]}/>
                            </div>
                        </Col>
                        <Col>
                            <div  style={{paddingLeft : "10%", width : "90%", paddingTop : "10px"}}>
                                <SemiCircleGauge minVal={0} maxVal={300} data={[{value : data.temperature, color : "#d2d5db"}]}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{textAlign : "center", 
                        fontSize : "0.8rem", 
                        lineHeight : "0.8rem"}}>
                        <Col>
                            %
                        </Col>
                        <Col>
                            RPM
                        </Col>
                        <Col>
                            RPM
                        </Col>
                        <Col>
                            %
                        </Col>
                        <Col>
                            &#8451;
                        </Col>
                    </Row>
                    <Row style={{textAlign : "center", paddingBottom : "10px", marginTop : "5px", 
                                fontSize : "0.8rem", 
                                lineHeight : "0.8rem"}
                    }>
                        <Col>
                            Actual Power 
                        </Col>
                        <Col>
                            Speed Ref
                        </Col>
                        <Col>
                            Motor Actual Speed
                        </Col>
                        <Col>
                            Motor Actual Torque
                        </Col>
                        <Col>
                            Motor 1 Actual Temperature
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>)
    }
}

export default withLayoutManager(VFDGauges);
