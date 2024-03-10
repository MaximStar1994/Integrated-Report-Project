import React from 'react';
import SideBar from '../../../components/SideBar/SideBar'
import { Row, Col, Container} from 'react-bootstrap'
import Asset from '../../../model/Asset.js'
import SemiCircleGauge from '../../../components/Gauge/SemiCircleGauge'
import SimpleValueCard from './SimpleValueCard'

import LEDGreen from '../../../assets/Icon/LEDGreen.png'
import LEDBlue from '../../../assets/Icon/LEDBlue.png'
import AlarmOff from '../../../assets/Icon/ClearRoundIndicator.png'
import AlarmOn from '../../../assets/Icon/RedRoundIndicator.png'
import InactiveIcon from '../../../assets/Icon/PowerInactiveIcon.png'
import ReadyIcon from '../../../assets/Icon/PowerReadyIcon.png'
import RunningIcon from '../../../assets/Icon/PowerRunningIcon.png'

import {withLayoutManager} from '../../../Helper/Layout/layout'
import Rig from '../../../model/Rig';
// mudpumpNo
class MudPumpDrive extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.mudpumpNo = this.props.match.params.mudpumpNo
        this.state = {};
        this.assetController = new Asset()
        this.rigApi = new Rig()
    }

    componentDidMount() {
        this.rigApi.GetMudpumpVFDs((vfds,err) => {
            if (vfds !== null) {
                this.setState({
                    data : vfds[`mp${this.mudpumpNo}`],
                })
            }
        })
    }

    renderAlarmsRow() {
        if (this.state.data === undefined) {
            return (<></>)
        }
        var mudPumpData = this.state.data
        var auxillaries = [
            {display : "Chain Lub Oil Pump", imgSrc : mudPumpData.aux.chainLubOilPump.running ? RunningIcon : mudPumpData.aux.chainLubOilPump.ready ? ReadyIcon : InactiveIcon},
            {display : "Liner Wash Pump", imgSrc : mudPumpData.aux.linearWashPump.running ? RunningIcon : mudPumpData.aux.linearWashPump.ready ? ReadyIcon : InactiveIcon},
            {display : "Mud Charging Pump", imgSrc : mudPumpData.aux.mudChargingPump.running ? RunningIcon : mudPumpData.aux.mudChargingPump.ready ? ReadyIcon : InactiveIcon},
            {display : "Mud Mixing Pump", imgSrc : mudPumpData.aux.mudMixingPump.running ? RunningIcon : mudPumpData.aux.mudMixingPump.ready ? ReadyIcon : InactiveIcon},
            {display : `Mudpump ${this.mudpumpNo}A Blower`, imgSrc : mudPumpData.aux.ABlower.running ? RunningIcon : mudPumpData.aux.ABlower.ready ? ReadyIcon : InactiveIcon},
            {display : `Mudpump ${this.mudpumpNo}B Blower`, imgSrc : mudPumpData.aux.BBlower.running ? RunningIcon : mudPumpData.aux.BBlower.ready ? ReadyIcon : InactiveIcon},
        ]
        return (
            <Row noGutters={true} style={{marginTop : "10px"}}>
                <Col sm={12} lg={10}>
                    <Row noGutters={true}>
                        <Col>
                            <div className="containerBGcolor" style={{marginLeft : "10px", marginRight : "10px", padding : "10px"}}>
                            <Row>
                                <Col>
                                    <img src={mudPumpData.dsu.running ? LEDGreen : LEDBlue} alt="" style={{width : "10%"}}></img>
                                    <span className="whiteSubHeading1" style={{paddingLeft : "5px"}}>DSU</span>
                                </Col>
                            </Row>
                            <Row noGutters={true} style={{marginTop : "10px"}}>
                                <Col lg={6} sm={7} style={{textAlign : "center", alignSelf : "center"}}>
                                    <Row noGutters={true} style={{alignItems : "center"}}>
                                        <Col className="whiteSubHeading2">
                                            Main AC Voltage
                                        </Col>
                                        <Col className="whiteSubHeading2">
                                            DC Voltage
                                        </Col>
                                        <Col className="whiteSubHeading2">
                                            Actual Power
                                        </Col>
                                    </Row>
                                    <Row noGutters={true}>
                                        <Col className="blueSubHeading3">
                                            {mudPumpData.dsu.ACVoltage}
                                        </Col>
                                        <Col className="blueSubHeading3">
                                            {mudPumpData.dsu.DCVoltage}
                                        </Col>
                                        <Col className="blueSubHeading3">
                                            {mudPumpData.dsu.power}
                                        </Col>
                                    </Row>
                                    <Row noGutters={true}>
                                        <Col className="whiteSubHeading3">
                                            Volts
                                        </Col>
                                        <Col className="whiteSubHeading3">
                                            VDC
                                        </Col>
                                        <Col className="whiteSubHeading3">
                                            kW
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm={5} lg={6} className="whiteSubHeading2" style={{paddingLeft : "15px"}}>
                                    <Row noGutters={true} style={{marginTop : "10px"}}>
                                        <Col lg={2} sm={2} style={{alignSelf : "center"}}>
                                            <img src={mudPumpData.dsu.alarm ? AlarmOn : AlarmOff} alt="" style={{padding : "0 5px"}}></img>
                                        </Col>
                                        <Col style={{alignSelf : "center"}}>
                                            DSU Alarm
                                        </Col>
                                    </Row>
                                    <Row noGutters={true} style={{marginTop : "10px"}}>
                                        <Col lg={2} sm={2} style={{alignSelf : "center"}}>
                                            <img src={mudPumpData.dsu.tripped ? AlarmOn : AlarmOff} alt="" style={{padding : "0 5px"}}></img>
                                        </Col>
                                        <Col style={{alignSelf : "center"}}>
                                            DSU Tripped
                                        </Col>
                                    </Row>
                                    <Row noGutters={true} style={{marginTop : "10px", marginBottom : "10px"}}>
                                        <Col lg={2} sm={2} style={{alignSelf : "center"}}>
                                            <img src={mudPumpData.dsu.faulted ? AlarmOn : AlarmOff} alt="" style={{padding : "0 5px"}}></img>
                                        </Col>
                                        <Col style={{alignSelf : "center"}}>
                                            DSU Drivebus Common Fault
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            </div>
                        </Col>
                        <Col>
                            <div className="containerBGcolor" style={{marginLeft : "10px", marginRight : "10px", padding : "10px", height : "100%", display : "flex", flexDirection : "column"}}>
                            <Row>
                                <Col>
                                    <img src={mudPumpData.inverter.inverterARuning ? LEDGreen : LEDBlue} alt="" style={{width : "20%"}}></img>
                                    <span className="whiteSubHeading1" style={{paddingLeft : "5px"}}>Inverter {this.mudpumpNo}A</span>
                                </Col>
                                <Col>
                                    <img src={mudPumpData.inverter.inverterBRuning  ? LEDGreen : LEDBlue} alt="" style={{width : "20%"}}></img>
                                    <span className="whiteSubHeading1" style={{paddingLeft : "5px"}}>Inverter {this.mudpumpNo}B</span>
                                </Col>
                            </Row>
                            <Row style={{flexGrow : 1, alignContent : "center"}}>
                                <Col className="whiteSubHeading2" style={{paddingLeft : "15px"}}>
                                    <Row noGutters={true} style={{marginTop : "10px"}}>
                                        <Col lg={2} sm={2} style={{alignSelf : "center"}}>
                                            <img src={mudPumpData.inverter.inverterAAlarm  ? AlarmOn : AlarmOff} alt="" style={{padding : "0 5px"}}></img>
                                        </Col>
                                        <Col style={{alignSelf : "center"}}>
                                            MP{this.mudpumpNo}A Inverter Alarm
                                        </Col>
                                    </Row>
                                    <Row noGutters={true} style={{marginTop : "10px", marginBottom : "10px"}}>
                                        <Col lg={2} sm={2} style={{alignSelf : "center"}}>
                                            <img src={mudPumpData.inverter.inverterATripped ? AlarmOn : AlarmOff} alt="" style={{padding : "0 5px"}}></img>
                                        </Col>
                                        <Col style={{alignSelf : "center"}}>
                                            MP{this.mudpumpNo}A Inverter Tripped
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className="whiteSubHeading2" style={{paddingLeft : "15px"}}>
                                    <Row noGutters={true} style={{marginTop : "10px"}}>
                                        <Col lg={2} sm={2} style={{alignSelf : "center"}}>
                                            <img src={mudPumpData.inverter.inverterBAlarm ? AlarmOn : AlarmOff} alt="" style={{padding : "0 5px"}}></img>
                                        </Col>
                                        <Col style={{alignSelf : "center"}}>
                                            MP{this.mudpumpNo}B Inverter Alarm
                                        </Col>
                                    </Row>
                                    <Row noGutters={true} style={{marginTop : "10px", marginBottom : "10px"}}>
                                        <Col lg={2} sm={2} style={{alignSelf : "center"}}>
                                            <img src={mudPumpData.inverter.inverterBTripped ? AlarmOn : AlarmOff} alt="" style={{padding : "0 5px"}}></img>
                                        </Col>
                                        <Col style={{alignSelf : "center"}}>
                                            MP{this.mudpumpNo}B Inverter Tripped
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row noGutters={true} style={{marginTop : "10px"}}>
                        <Col>
                            <div className="containerBGcolor" style={{marginLeft : "10px", marginRight : "10px", padding : "10px"}}>
                                <Row>
                                    <Col className="whiteSubHeading1">
                                        <div>Common Auxillaries</div>
                                    </Col>
                                </Row>
                                <Row className="whiteSubHeading2" style={{marginTop : "10px"}}>
                                    <Col>
                                        <Row noGutters={true}>
                                            {auxillaries.map((aux,i) => 
                                                <Col key={i}>
                                                    <Row noGutters={true}>
                                                        <Col xs={2} style={{alignSelf : "center"}}>
                                                            <img src={aux.imgSrc}></img>
                                                        </Col>
                                                        <Col style={{alignSelf : "center"}}>
                                                            <div style={{paddingLeft : "10px", paddingRight : "10px"}}>
                                                            {aux.display}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            )}
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col sm={12} lg={2} style={{marginTop : this.props.renderFor != 0 ? "10px" : ""}}>
                <div className="containerBGcolor" style={{marginLeft : "10px", marginRight : "10px", padding : "10px", height : "100%"}}>
                    <Row style={{height : "100%", alignContent : "center"}}>
                        <Col sm={6} lg={12} style={{alignSelf : "center"}}>
                            <Row>
                                <Col className="whiteSubHeading1">
                                    <div>Power Alarm</div>
                                </Col>
                            </Row>
                            <Row className="whiteSubHeading2" noGutters={true} style={{marginTop : "10px", marginBottom : "30px"}}>
                                <Col lg={2} sm={1} style={{alignSelf : "center"}}>
                                    <img src={mudPumpData.alarms.powerOk ? AlarmOff : AlarmOn} alt="" style={{padding : "0 5px"}}></img>
                                </Col>
                                <Col style={{alignSelf : "center"}}>
                                    MP IO Power OK
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={6} lg={12} style={{alignSelf : "center"}}>
                            <Row>
                                <Col className="whiteSubHeading1">
                                    <div>Communication Link Alarm</div>
                                </Col>
                            </Row>
                            <Row className="whiteSubHeading2" noGutters={true} style={{marginTop : "10px", marginBottom : "10px"}}>
                                <Col lg={2} sm={1} style={{alignSelf : "center"}}>
                                    <img src={mudPumpData.alarms.busACommFault ? AlarmOn : AlarmOff} alt="" style={{padding : "0 5px"}}></img>
                                </Col>
                                <Col style={{alignSelf : "center"}}>
                                    MP {this.mudpumpNo}A DriveBus Common Fault
                                </Col>
                            </Row>
                            <Row className="whiteSubHeading2" noGutters={true} style={{marginTop : "10px", marginBottom : "10px"}}>
                                <Col lg={2} sm={1} style={{alignSelf : "center"}}>
                                    <img src={mudPumpData.alarms.busBCommFault ? AlarmOn : AlarmOff} alt="" style={{padding : "0 5px"}}></img>
                                </Col>
                                <Col style={{alignSelf : "center"}}>
                                    MP {this.mudpumpNo}B DriveBus Common Fault
                                </Col>
                            </Row>
                            <Row className="whiteSubHeading2" noGutters={true} style={{marginTop : "10px", marginBottom : "10px"}}>
                                <Col lg={2} sm={1} style={{alignSelf : "center"}}>
                                    <img src={mudPumpData.alarms.dcdaFault ? AlarmOn : AlarmOff} alt="" style={{padding : "0 5px"}}></img>
                                </Col>
                                <Col style={{alignSelf : "center"}}>
                                    DCDA Common Fault
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                </Col>
            </Row>
        )
    }

    renderGaugesRow() {
        if (this.state.data === undefined) {
            return (<></>)
        }
        var mudpumpData = this.state.data[`mp${this.mudpumpNo}a`]
        var mudpumpbData = this.state.data[`mp${this.mudpumpNo}b`]
        var rowData = []
        var rowDataB = []
        var rowIndex = ["power", "speed","motorSpeed","motorTorque","motorTemp"]
        var rowUnit = ["%", "RPM","RPM","%",'\u2103']
        var rowLabel = ["Power", "Speed Ref","Motor Speed","Motor Torque","Motor Temperature"]
        rowIndex.forEach((idx,i) => {
            var max = 1600
            var min = 0
            if (idx === "power") {
                max = 100
            }
            if (idx === "motorTorque") {
                max = 100
            }
            if (idx === "motorTemp") {
                max = 300
            }
            rowData.push(
                {
                    max : max,
                    min : min,
                    data : [{value: parseFloat(mudpumpData[idx]), color : "black"}]
                }
            )
            rowDataB.push({
                max : max,
                min : min,
                data : [{value: parseFloat(mudpumpbData[idx]), color : "black"}]
            })
        })
        return (
            <>
            <Row style={{marginTop : "10px"}}>
                <Col>
                    <div className="containerBGcolor" style={{marginLeft : "10px", marginRight : "10px", paddingTop : "10px", paddingBottom : "10px"}}>
                    <Row>
                        <Col className="whiteHeading2" style={{paddingLeft : "30px", color : "white", marginBottom : "5px"}}>
                            Mud Pump {this.mudpumpNo}A
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={{span : 10, offset : 1}}>
                            <Row>
                                {rowData.map((gaugeData,idx) => 
                                    <Col key={idx} style={{maxWidth : this.props.renderFor == 2 ? "20%" : ""}}>
                                        <Row>
                                            <Col>
                                            <SemiCircleGauge data={gaugeData.data} maxVal={gaugeData.max} minVal={gaugeData.min}></SemiCircleGauge>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="whiteSubHeading2" style={{textAlign : "center", padding : "5px"}}>{rowUnit[idx]}</Col>
                                        </Row>
                                        <Row>
                                            <Col className={this.props.renderFor == 2 ? "whiteSubHeading2": "whiteSubHeading1"} style={{textAlign : "center", padding : this.props.renderFor == 2 ? "0px" : ""}}>{rowLabel[idx]}</Col>
                                        </Row>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                    </div>
                </Col>
            </Row>
            <Row style={{marginTop : "10px"}}>
                <Col>
                    <div className="containerBGcolor" style={{marginLeft : "10px", marginRight : "10px", paddingTop : "10px", paddingBottom : "10px"}}>
                    <Row>
                        <Col className="whiteHeading2" style={{paddingLeft : "30px", color : "white", marginBottom : "5px"}}>
                            Mud Pump {this.mudpumpNo}B
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{span : 10, offset : 1}}>
                            <Row>
                                {rowDataB.map((gaugeData,idx) => 
                                    <Col key={idx} style={{maxWidth : this.props.renderFor == 2 ? "20%" : ""}}>
                                        <Row>
                                            <Col>
                                            <SemiCircleGauge data={gaugeData.data} maxVal={gaugeData.max} minVal={gaugeData.min}></SemiCircleGauge>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="whiteSubHeading2" style={{textAlign : "center", padding : "5px"}}>{rowUnit[idx]}</Col>
                                        </Row>
                                        <Row>
                                            <Col  className={this.props.renderFor == 2 ? "whiteSubHeading2": "whiteSubHeading1"} style={{textAlign : "center", padding : this.props.renderFor == 2 ? "0px" : ""}}>{rowLabel[idx]}</Col>
                                        </Row>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                    </div>
                </Col>
            </Row>
        </>
        )
    }
    
    render() {
        if (this.props.renderFor !== 0) {
            return (
                <>
                <Row>
                    <Col> <div className="whiteHeading1" style={{textAlign : "center"}}>VARIABLE FREQUENCY DRIVES - MUDPUMP {this.mudpumpNo}</div></Col>
                </Row>
                {this.renderGaugesRow()}
                {this.renderAlarmsRow()}
                </>
            )
        }
        return (
            <div className="content-inner-all">
            <Container fluid={true}>
            <SideBar>
                <Row>
                    <Col> <div className="whiteHeading1" style={{textAlign : "center"}}>VARIABLE FREQUENCY DRIVES - MUDPUMP {this.mudpumpNo}</div></Col>
                </Row>
                {this.renderGaugesRow()}
                {this.renderAlarmsRow()}
            </SideBar>
            </Container>
            </div>
        );
    }
}

export default withLayoutManager(MudPumpDrive);
