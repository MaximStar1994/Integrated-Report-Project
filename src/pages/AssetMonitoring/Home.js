import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Rig from '../../model/Rig'
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import SideBar from '../../components/SideBar/SideBar'
import WeightGauge from '../../components/Gauge/WeightGauge'
import LegLoadGauge from './LegLoadGauge'

import '../../css/App.css';
import './AssetMonitoring.css'

import infoIcon from '../../assets/Icon/info-white.png'
import MotorOnIcon from '../../assets/Icon/MotorOnIcon.png'
import MotorOffIcon from '../../assets/Icon/MotorOffIcon.png'
import MotorFaultIcon from '../../assets/Icon/MotorFaultIcon.png'
import BrakeOnIcon from '../../assets/Icon/BrakeOnIcon.png'
import BrakeOffIcon from '../../assets/Icon/BrakeOffIcon.png'
import BrakeFaultIcon from '../../assets/Icon/BrakeFaultIcon.png'
import AlarmIcon from '../../assets/Icon/AlarmIcon.png'
import LegBG from '../../assets/Background/MotorLegBG.png'
import BlueLED from '../../assets/Icon/LEDBlue.png'
import RedLED from '../../assets/Icon/LEDRed.png'
import AlarmOn from '../../assets/Icon/RedRoundIndicator.png'
import AlarmOff from '../../assets/Icon/ClearRoundIndicator.png'
import Inclinometer from '../../assets/Inclinometer.png'

import {withLayoutManager} from '../../Helper/Layout/layout'
const HtmlTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

class AssetManagement extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            renderFor : 0, // 0 for desktop, 1 for ipad, 2 for mobile 
            data : undefined,
            show : false,
            tagname : ""
        };
        this.rigApi = new Rig()
    }

    componentDidMount() {
        this.rigApi.GetRigAssetMonitoring((val) => {
            if (val !== null) {
                val['motorJam'] = false
                val['motorCircuitBreak'] = false
                val['motorOverload'] = false
                val['motorOverheat'] = false
                val['brakeOLOH'] = false
                val['brakeFail'] = false
                for (let [idx, value] of Object.entries(val)) {
                    if (idx.includes("MOTOR_JAM") && value === "true") {
                        val['motorJam'] = true
                    }
                    if (idx.includes("CONTACTOR_AND_BREAKER_TRIP") && value === "true") {
                        val['motorCircuitBreak'] = true
                    }
                    if (idx.includes("OVERLOAD") && !idx.includes("BRAKE") && value === "true") {
                        val['motorOverload'] = true
                    }
                    if (idx.includes("OVER_TEMPERATURE") && value === "true") {
                        val['motorOverheat'] = true
                    }
                    if (idx.includes("BRAKE_FAIL") && value === "true") {
                        val['brakeFail'] = true
                    }
                    if (idx.includes("BRAKE_OVERLOAD_OVERHEAT") && value === "true") {
                        val['brakeOLOH'] = true
                    }
                }
                this.setState({data : val})
            }
        })
    }
   
    renderWeightGauge(forLeg) {
        if (this.state.data === undefined) {
            return (<></>)
        }
        var data = this.state.data
        var dataVal = data[forLeg+'_LEG_MCC_KW']
        if (this.props.renderFor != 0) {
            return (
                <Col>
                    <div className="blueHeading2" style={{textAlign : "center", padding : "10px"}}>{forLeg} LEG</div>
                    <WeightGauge  maxVal={1500} minVal={-1500} data={[{value : dataVal, color : "black"}]}/>
                </Col>
            )
        }
        if (forLeg === "PORT") {
            return (
                <div style={{position : "absolute", top:0,right:"77%",left:"2%",bottom:"50%", textAlign:"center"}}>
                    <WeightGauge  maxVal={1500} minVal={-1500} data={[{value : dataVal, color : "black"}]}/>
                    <h5 style={{color : "white"}}>{forLeg} LEG</h5>
                </div>
            )
        }
        return (
            <div style={{position : "absolute", top:0,right:"2%",left:"77%",bottom:"50%", textAlign:"center"}}>
                <WeightGauge  maxVal={1500} minVal={-1500} data={[{value : dataVal, color : "black"}]}/>
                <h5 style={{color : "white"}}>{forLeg} LEG</h5>
            </div>
        )
    }
    renderMotorStatusModal() {
        if (this.state.data === undefined) {
            return (<></>)
        }
        var data = this.state.data
        var tagname = this.state.tagname
        var motorStatus = 'on'
        if (data[tagname+'_RUNNING'] === 'false') {
            motorStatus = 'off'
        }
        if (
            data[tagname+'_MOTOR_CONTACTOR_AND_BREAKER_TRIP'] === 'true' || 
            data[tagname+'_MOTOR_JAM'] === 'true' || 
            data[tagname+'_OVER_TEMPERATURE'] === 'true' || 
            data[tagname+'_OVERLOAD'] === 'true'
        ) {
            motorStatus = 'fault'
        }
        var brakeStatus = 'on'
        if (data[tagname+'_BRAKE_ON'] === 'false') {
            brakeStatus = 'off'
        }
        if (
            data[tagname+'_BRAKE_OVERLOAD_OVERHEAT'] === 'true' || 
            data[tagname+'_BRAKE_FAIL'] === 'true'
        ) {
            brakeStatus = 'fault'
        }
        return(
            <Modal 
            size={"lg"} 
            aria-labelledby="contained-modal-title-vcenter"
            centered 
            show={this.state.show} 
            onHide={() => {this.setState({show : false})}}>
                <Modal.Header closeButton>
                    <Modal.Title style={{textAlign : "center"}}>Motor and Brake Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row style={{marginBottom : "15px"}}>
                        <Col>
                            <Row>
                                <Col style={{textAlign : "center"}}>
                                    <h3>Motor</h3>
                                </Col>
                            </Row>
                            {this.renderStatusLEDForModal(tagname+'_MOTOR_JAM','Jam')}
                            {this.renderStatusLEDForModal(tagname+'_OVER_TEMPERATURE','Over Temperature')}
                            {this.renderStatusLEDForModal(tagname+'_OVERLOAD','Overload')}
                            {this.renderStatusLEDForModal(tagname+'_MOTOR_CONTACTOR_AND_BREAKER_TRIP','Contactor and Breaker Trip')}
                        </Col>
                        <Col>{this.renderMotorBrakeImg(motorStatus,brakeStatus)}</Col>
                        <Col>
                            <Row>
                                <Col style={{textAlign : "center"}}>
                                    <h3>Brake</h3>
                                </Col>
                            </Row>
                            {this.renderStatusLEDForModal(tagname+'_BRAKE_FAIL','Fail')}
                            {this.renderStatusLEDForModal(tagname+'_BRAKE_OVERLOAD_OVERHEAT','Overload or Overheat')}
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        )
    }
    renderMotorBrakeImg(motorStatus, brakeStatus) {
        var motorImgSrc = MotorOnIcon
        var brakeImgSrc = BrakeOnIcon
        var shouldDisplayAlarm = false
        if (motorStatus === "off") {
            motorImgSrc = MotorOffIcon
        } 
        if (motorStatus === "fault") {
            motorImgSrc = MotorFaultIcon
            shouldDisplayAlarm = true
        }
        if (brakeStatus === "off") {
            brakeImgSrc = BrakeOffIcon
        } 
        if (brakeStatus === "fault") {
            brakeImgSrc = BrakeFaultIcon
            shouldDisplayAlarm = true
        }
        var faultAlarmElm = <></>
        if (shouldDisplayAlarm) {
            faultAlarmElm = (<img src={AlarmIcon} style={{margin : "auto", width : "20%"}} alt="motor alarm"/>)
        }
        return (
            <div style={{position : "relative", textAlign : "center"}}>
                <img src = {motorImgSrc}  />
                <img src = {brakeImgSrc}  style={{position : "absolute", top : 0, left : 0, right :0, bottom : 0}}/>
                {faultAlarmElm}
            </div>)
    }
    renderMotorBrake(motorStatus, brakeStatus, tagname) {
        var motorImgSrc = MotorOnIcon
        var brakeImgSrc = BrakeOnIcon
        var shouldDisplayAlarm = false
        if (motorStatus === "off") {
            motorImgSrc = MotorOffIcon
        } 
        if (motorStatus === "fault") {
            motorImgSrc = MotorFaultIcon
            shouldDisplayAlarm = true
        }
        if (brakeStatus === "off") {
            brakeImgSrc = BrakeOffIcon
        } 
        if (brakeStatus === "fault") {
            brakeImgSrc = BrakeFaultIcon
            shouldDisplayAlarm = true
        }
        var faultAlarmElm = <></>
        if (shouldDisplayAlarm) {
            faultAlarmElm = (<img src={AlarmIcon} style={{margin : "auto", width : "40%", zIndex : 10}} alt="motor alarm"/>)
        }
        return (
        <div className="clickable" onClick={() => {
            this.setState({show : true, tagname : tagname})
        }} style={{position : "absolute", top : 0, left : 0, right :0, bottom : 0}}>
            <div style={{position : "relative", textAlign : "center"}} >
                <img src = {motorImgSrc} />
                <img src = {brakeImgSrc}  style={{position : "absolute", top : 0, left : 0, right :0, bottom : 0}}/>
                {faultAlarmElm}
            </div>
        </div>)
    }
    renderStatusLEDForModal(key, label) {
        var data = this.state.data
        var imgSrc = AlarmOff
        if (data[key] && data[key] !== "false") {
            imgSrc = AlarmOn
        }
        return (
            <Row style={{paddingTop : "5px", paddingBottom : "5px"}}>
                <Col xs={{span : 3, offset : 1}} style={{alignSelf : "center"}}>
                    <img src={imgSrc} />
                </Col>
                <Col xs={7} style={{alignSelf : "center"}}> 
                    {label}
                </Col>
            </Row>
        )
    }
    renderStatusLED(key, label) {
        var data = this.state.data
        var imgSrc = BlueLED
        if (data[key]) {
            imgSrc = RedLED
        }
        return (
            <Row noGutters={this.props.renderFor == 2}>
                <Col xs={6}>
                    <img src={imgSrc} />
                </Col>
                <Col>
                    {label}
                </Col>
            </Row>
        )
    }
    renderBrakeStatusOverview() {
        if (this.props.renderFor != 0) {
            return (<div style={{flexDirection : "column", alignSelf : "flex-end"}}>
            <Row>
            <Col style={{backgroundColor : "#d2d5db", textAlign : "center", padding : "15px"}}>
                Brake Status Overview
            </Col>
            </Row>
            <Row>
                <Col style={{backgroundColor : "whitesmoke"}}>
                    <Row>
                        <Col xs={6} style={{padding : "10px"}}>{this.renderStatusLED("brakeOLOH", "Brake OL/OH")}</Col>
                        <Col xs={6} style={{padding : "10px"}}>{this.renderStatusLED("brakeFail", "Brake Fail")}</Col>
                    </Row>
                </Col>
            </Row>
            </div>)
        }
        return (<div style={{flexDirection : "column", alignSelf : "flex-end"}}>
        <Row>
            <Col style={{backgroundColor : "#d2d5db", textAlign : "center", padding : "15px"}}>
                Brake Status Overview
            </Col>
        </Row>
        <Row>
            <Col style={{backgroundColor : "whitesmoke"}}>
                <Row>
                    <Col xs={{span : 5, offset : 1}} style={{padding : "10px"}}>{this.renderStatusLED("brakeOLOH", "Brake OL/OH")}</Col>
                    <Col xs={5} style={{padding : "10px"}}>{this.renderStatusLED("brakeFail", "Brake Fail")}</Col>
                </Row>
            </Col>
        </Row>
        </div>)
    }
    renderMotorStatusOverview() {
        if (this.props.renderFor != 0) {
            return (<div style={{flexDirection : "column", alignSelf : "flex-end"}}>
            <Row>
                <Col style={{backgroundColor : "#d2d5db", textAlign : "center", padding : "15px"}}>
                    Motor Status Overview
                </Col>
            </Row>
            <Row>
                <Col style={{backgroundColor : "whitesmoke"}}>
                    <Row noGutters={this.props.renderFor == 2}>
                        <Col xs={6} style={{padding : "10px"}}>{this.renderStatusLED("motorJam", "Motor Jam")}</Col>
                        <Col xs={6} style={{padding : "10px"}}>{this.renderStatusLED("motorCircuitBreak", "Motor CB")}</Col>
                    </Row>
                    <Row noGutters={this.props.renderFor == 2}>
                        <Col xs={6} style={{padding : "10px"}}>{this.renderStatusLED("motorOverload", "Motor OL")}</Col>
                        <Col xs={6} style={{padding : "10px"}}>{this.renderStatusLED("motorOverheat", "Motor OH")}</Col>
                    </Row>
                </Col>
            </Row>
            </div>)
        }
        return (<div style={{flexDirection : "column", alignSelf : "flex-end"}}>
        <Row>
            <Col style={{backgroundColor : "#d2d5db", textAlign : "center", padding : "15px"}}>
                Motor Status Overview
            </Col>
        </Row>
        <Row>
            <Col style={{backgroundColor : "whitesmoke"}}>
                <Row>
                    <Col xs={{span : 5, offset : 1}} style={{padding : "10px"}}>{this.renderStatusLED("motorJam", "Motor Jam")}</Col>
                    <Col xs={5} style={{padding : "10px"}}>{this.renderStatusLED("motorCircuitBreak", "Motor CB")}</Col>
                </Row>
                <Row>
                    <Col xs={{span : 5, offset : 1}} style={{padding : "10px"}}>{this.renderStatusLED("motorOverload", "Motor OL")}</Col>
                    <Col xs={5} style={{padding : "10px"}}>{this.renderStatusLED("motorOverheat", "Motor OH")}</Col>
                </Row>
            </Col>
        </Row>
        </div>)
    }
    renderFwdLeg() {
        if (this.state.data === undefined) {
            return (<></>)
        }
        var data = this.state.data
        var motor1Status = 'on'
        if (data.FWD_LEG_MOTOR_1_RUNNING === 'false') {
            motor1Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_1_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.FWD_LEG_MOTOR_1_MOTOR_JAM === 'true' || 
            data.FWD_LEG_MOTOR_1_OVER_TEMPERATURE === 'true' || 
            data.FWD_LEG_MOTOR_1_OVERLOAD === 'true'
        ) {
            motor1Status = 'fault'
        }
        var brake1Status = 'on'
        if (data.FWD_LEG_MOTOR_1_BRAKE_ON === 'false') {
            brake1Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_1_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.FWD_LEG_MOTOR_1_BRAKE_FAIL === 'true'
        ) {
            brake1Status = 'fault'
        }

        var motor2Status = 'on'
        if (data.FWD_LEG_MOTOR_2_RUNNING === 'false') {
            motor2Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_2_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.FWD_LEG_MOTOR_2_MOTOR_JAM === 'true' || 
            data.FWD_LEG_MOTOR_2_OVER_TEMPERATURE === 'true' || 
            data.FWD_LEG_MOTOR_2_OVERLOAD === 'true'
        ) {
            motor2Status = 'fault'
        }
        var brake2Status = 'on'
        if (data.FWD_LEG_MOTOR_2_BRAKE_ON === 'false') {
            brake2Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_2_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.FWD_LEG_MOTOR_2_BRAKE_FAIL === 'true'
        ) {
            brake2Status = 'fault'
        }
        
        var motor3Status = 'on'
        if (data.FWD_LEG_MOTOR_3_RUNNING === 'false') {
            motor3Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_3_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.FWD_LEG_MOTOR_3_MOTOR_JAM === 'true' || 
            data.FWD_LEG_MOTOR_3_OVER_TEMPERATURE === 'true' || 
            data.FWD_LEG_MOTOR_3_OVERLOAD === 'true'
        ) {
            motor3Status = 'fault'
        }
        var brake3Status = 'on'
        if (data.FWD_LEG_MOTOR_3_BRAKE_ON === 'false') {
            brake3Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_3_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.FWD_LEG_MOTOR_3_BRAKE_FAIL === 'true'
        ) {
            brake3Status = 'fault'
        }

        var motor4Status = 'on'
        if (data.FWD_LEG_MOTOR_4_RUNNING === 'false') {
            motor4Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_4_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.FWD_LEG_MOTOR_4_MOTOR_JAM === 'true' || 
            data.FWD_LEG_MOTOR_4_OVER_TEMPERATURE === 'true' || 
            data.FWD_LEG_MOTOR_4_OVERLOAD === 'true'
        ) {
            motor4Status = 'fault'
        }
        var brake4Status = 'on'
        if (data.FWD_LEG_MOTOR_4_BRAKE_ON === 'false') {
            brake4Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_4_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.FWD_LEG_MOTOR_4_BRAKE_FAIL === 'true'
        ) {
            brake4Status = 'fault'
        }
        var motor5Status = 'on'
        if (data.FWD_LEG_MOTOR_5_RUNNING === 'false') {
            motor5Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_5_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.FWD_LEG_MOTOR_5_MOTOR_JAM === 'true' || 
            data.FWD_LEG_MOTOR_5_OVER_TEMPERATURE === 'true' || 
            data.FWD_LEG_MOTOR_5_OVERLOAD === 'true'
        ) {
            motor5Status = 'fault'
        }
        var brake5Status = 'on'
        if (data.FWD_LEG_MOTOR_5_BRAKE_ON === 'false') {
            brake5Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_5_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.FWD_LEG_MOTOR_5_BRAKE_FAIL === 'true'
        ) {
            brake5Status = 'fault'
        }
        var motor6Status = 'on'
        if (data.FWD_LEG_MOTOR_6_RUNNING === 'false') {
            motor6Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_6_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.FWD_LEG_MOTOR_6_MOTOR_JAM === 'true' || 
            data.FWD_LEG_MOTOR_6_OVER_TEMPERATURE === 'true' || 
            data.FWD_LEG_MOTOR_6_OVERLOAD === 'true'
        ) {
            motor6Status = 'fault'
        }
        var brake6Status = 'on'
        if (data.FWD_LEG_MOTOR_6_BRAKE_ON === 'false') {
            brake6Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_6_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.FWD_LEG_MOTOR_6_BRAKE_FAIL === 'true'
        ) {
            brake6Status = 'fault'
        }
        var motor7Status = 'on'
        if (data.FWD_LEG_MOTOR_7_RUNNING === 'false') {
            motor7Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_7_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.FWD_LEG_MOTOR_7_MOTOR_JAM === 'true' || 
            data.FWD_LEG_MOTOR_7_OVER_TEMPERATURE === 'true' || 
            data.FWD_LEG_MOTOR_7_OVERLOAD === 'true'
        ) {
            motor7Status = 'fault'
        }
        var brake7Status = 'on'
        if (data.FWD_LEG_MOTOR_7_BRAKE_ON === 'false') {
            brake7Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_7_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.FWD_LEG_MOTOR_7_BRAKE_FAIL === 'true'
        ) {
            brake7Status = 'fault'
        }
        var motor8Status = 'on'
        if (data.FWD_LEG_MOTOR_8_RUNNING === 'false') {
            motor8Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_8_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.FWD_LEG_MOTOR_8_MOTOR_JAM === 'true' || 
            data.FWD_LEG_MOTOR_8_OVER_TEMPERATURE === 'true' || 
            data.FWD_LEG_MOTOR_8_OVERLOAD === 'true'
        ) {
            motor8Status = 'fault'
        }
        var brake8Status = 'on'
        if (data.FWD_LEG_MOTOR_8_BRAKE_ON === 'false') {
            brake8Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_8_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.FWD_LEG_MOTOR_8_BRAKE_FAIL === 'true'
        ) {
            brake8Status = 'fault'
        }
        var motor9Status = 'on'
        if (data.FWD_LEG_MOTOR_9_RUNNING === 'false') {
            motor9Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_9_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.FWD_LEG_MOTOR_9_MOTOR_JAM === 'true' || 
            data.FWD_LEG_MOTOR_9_OVER_TEMPERATURE === 'true' || 
            data.FWD_LEG_MOTOR_9_OVERLOAD === 'true'
        ) {
            motor9Status = 'fault'
        }
        var brake9Status = 'on'
        if (data.FWD_LEG_MOTOR_9_BRAKE_ON === 'false') {
            brake9Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_9_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.FWD_LEG_MOTOR_9_BRAKE_FAIL === 'true'
        ) {
            brake9Status = 'fault'
        }
        var motor10Status = 'on'
        if (data.FWD_LEG_MOTOR_10_RUNNING === 'false') {
            motor10Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_10_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.FWD_LEG_MOTOR_10_MOTOR_JAM === 'true' || 
            data.FWD_LEG_MOTOR_10_OVER_TEMPERATURE === 'true' || 
            data.FWD_LEG_MOTOR_10_OVERLOAD === 'true'
        ) {
            motor10Status = 'fault'
        }
        var brake10Status = 'on'
        if (data.FWD_LEG_MOTOR_10_BRAKE_ON === 'false') {
            brake10Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_10_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.FWD_LEG_MOTOR_10_BRAKE_FAIL === 'true'
        ) {
            brake10Status = 'fault'
        }
        var motor11Status = 'on'
        if (data.FWD_LEG_MOTOR_11_RUNNING === 'false') {
            motor11Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_11_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.FWD_LEG_MOTOR_11_MOTOR_JAM === 'true' || 
            data.FWD_LEG_MOTOR_11_OVER_TEMPERATURE === 'true' || 
            data.FWD_LEG_MOTOR_11_OVERLOAD === 'true'
        ) {
            motor11Status = 'fault'
        }
        var brake11Status = 'on'
        if (data.FWD_LEG_MOTOR_11_BRAKE_ON === 'false') {
            brake11Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_11_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.FWD_LEG_MOTOR_11_BRAKE_FAIL === 'true'
        ) {
            brake11Status = 'fault'
        }
        var motor12Status = 'on'
        if (data.FWD_LEG_MOTOR_12_RUNNING === 'false') {
            motor12Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_12_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.FWD_LEG_MOTOR_12_MOTOR_JAM === 'true' || 
            data.FWD_LEG_MOTOR_12_OVER_TEMPERATURE === 'true' || 
            data.FWD_LEG_MOTOR_12_OVERLOAD === 'true'
        ) {
            motor12Status = 'fault'
        }
        var brake12Status = 'on'
        if (data.FWD_LEG_MOTOR_12_BRAKE_ON === 'false') {
            brake12Status = 'off'
        }
        if (
            data.FWD_LEG_MOTOR_12_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.FWD_LEG_MOTOR_12_BRAKE_FAIL === 'true'
        ) {
            brake12Status = 'fault'
        }

        motor1Status = 'fault'
        brake1Status = 'fault'
        return (
            <>
            {this.props.renderFor == 0 && this.renderWeightGauge("FWD")}
            <div style={{position : "absolute", top : "3%", left : "35%", right : "55%"}} >
                {this.renderMotorBrake(motor1Status,brake1Status,'FWD_LEG_MOTOR_1')}
            </div>
            <div style={{position : "absolute", top : "3%", left : "55%", right : "35%"}} >
                {this.renderMotorBrake(motor2Status,brake2Status,'FWD_LEG_MOTOR_2')}
            </div>
            <div style={{position : "absolute", top : "25%", left : "35%", right : "55%"}} >
                {this.renderMotorBrake(motor3Status,brake3Status,'FWD_LEG_MOTOR_3')}
            </div>
            <div style={{position : "absolute", top : "25%", left : "55%", right : "35%"}} >
                {this.renderMotorBrake(motor4Status,brake4Status,'FWD_LEG_MOTOR_4')}
            </div>

            <div style={{position : "absolute", top : "55%", left : "10%", right : "80%"}} >
                {this.renderMotorBrake(motor5Status,brake5Status,'FWD_LEG_MOTOR_5')}
            </div>
            <div style={{position : "absolute", top : "55%", left : "30%", right : "60%"}} >
                {this.renderMotorBrake(motor6Status,brake6Status,'FWD_LEG_MOTOR_6')}
            </div>
            <div style={{position : "absolute", top : "80%", left : "10%", right : "80%"}} >
                {this.renderMotorBrake(motor7Status,brake7Status,'FWD_LEG_MOTOR_7')}
            </div>
            <div style={{position : "absolute", top : "80%", left : "30%", right : "60%"}} >
                {this.renderMotorBrake(motor8Status,brake8Status,'FWD_LEG_MOTOR_8')}
            </div>

            <div style={{position : "absolute", top : "55%", left : "60%", right : "30%"}} >
                {this.renderMotorBrake(motor9Status,brake9Status,'FWD_LEG_MOTOR_9')}
            </div>
            <div style={{position : "absolute", top : "55%", left : "80%", right : "10%"}} >
                {this.renderMotorBrake(motor10Status,brake10Status,'FWD_LEG_MOTOR_10')}
            </div>
            <div style={{position : "absolute", top : "80%", left : "60%", right : "30%"}} >
                {this.renderMotorBrake(motor11Status,brake11Status,'FWD_LEG_MOTOR_11')}
            </div>
            <div style={{position : "absolute", top : "80%", left : "80%", right : "10%"}} >
                {this.renderMotorBrake(motor12Status,brake12Status,'FWD_LEG_MOTOR_12')}
            </div>
            </>
        )
    }
    renderPortLeg() {
        if (this.state.data === undefined) {
            return (<></>)
        }
        var data = this.state.data
        var motor1Status = 'on'
        if (data.PORT_LEG_MOTOR_1_RUNNING === 'false') {
            motor1Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_1_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.PORT_LEG_MOTOR_1_MOTOR_JAM === 'true' || 
            data.PORT_LEG_MOTOR_1_OVER_TEMPERATURE === 'true' || 
            data.PORT_LEG_MOTOR_1_OVERLOAD === 'true'
        ) {
            motor1Status = 'fault'
        }
        var brake1Status = 'on'
        if (data.PORT_LEG_MOTOR_1_BRAKE_ON === 'false') {
            brake1Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_1_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.PORT_LEG_MOTOR_1_BRAKE_FAIL === 'true'
        ) {
            brake1Status = 'fault'
        }
    
        var motor2Status = 'on'
        if (data.PORT_LEG_MOTOR_2_RUNNING === 'false') {
            motor2Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_2_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.PORT_LEG_MOTOR_2_MOTOR_JAM === 'true' || 
            data.PORT_LEG_MOTOR_2_OVER_TEMPERATURE === 'true' || 
            data.PORT_LEG_MOTOR_2_OVERLOAD === 'true'
        ) {
            motor2Status = 'fault'
        }
        var brake2Status = 'on'
        if (data.PORT_LEG_MOTOR_2_BRAKE_ON === 'false') {
            brake2Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_2_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.PORT_LEG_MOTOR_2_BRAKE_FAIL === 'true'
        ) {
            brake2Status = 'fault'
        }
        
        var motor3Status = 'on'
        if (data.PORT_LEG_MOTOR_3_RUNNING === 'false') {
            motor3Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_3_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.PORT_LEG_MOTOR_3_MOTOR_JAM === 'true' || 
            data.PORT_LEG_MOTOR_3_OVER_TEMPERATURE === 'true' || 
            data.PORT_LEG_MOTOR_3_OVERLOAD === 'true'
        ) {
            motor3Status = 'fault'
        }
        var brake3Status = 'on'
        if (data.PORT_LEG_MOTOR_3_BRAKE_ON === 'false') {
            brake3Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_3_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.PORT_LEG_MOTOR_3_BRAKE_FAIL === 'true'
        ) {
            brake3Status = 'fault'
        }
    
        var motor4Status = 'on'
        if (data.PORT_LEG_MOTOR_4_RUNNING === 'false') {
            motor4Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_4_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.PORT_LEG_MOTOR_4_MOTOR_JAM === 'true' || 
            data.PORT_LEG_MOTOR_4_OVER_TEMPERATURE === 'true' || 
            data.PORT_LEG_MOTOR_4_OVERLOAD === 'true'
        ) {
            motor4Status = 'fault'
        }
        var brake4Status = 'on'
        if (data.PORT_LEG_MOTOR_4_BRAKE_ON === 'false') {
            brake4Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_4_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.PORT_LEG_MOTOR_4_BRAKE_FAIL === 'true'
        ) {
            brake4Status = 'fault'
        }
        var motor5Status = 'on'
        if (data.PORT_LEG_MOTOR_5_RUNNING === 'false') {
            motor5Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_5_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.PORT_LEG_MOTOR_5_MOTOR_JAM === 'true' || 
            data.PORT_LEG_MOTOR_5_OVER_TEMPERATURE === 'true' || 
            data.PORT_LEG_MOTOR_5_OVERLOAD === 'true'
        ) {
            motor5Status = 'fault'
        }
        var brake5Status = 'on'
        if (data.PORT_LEG_MOTOR_5_BRAKE_ON === 'false') {
            brake5Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_5_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.PORT_LEG_MOTOR_5_BRAKE_FAIL === 'true'
        ) {
            brake5Status = 'fault'
        }
        var motor6Status = 'on'
        if (data.PORT_LEG_MOTOR_6_RUNNING === 'false') {
            motor6Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_6_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.PORT_LEG_MOTOR_6_MOTOR_JAM === 'true' || 
            data.PORT_LEG_MOTOR_6_OVER_TEMPERATURE === 'true' || 
            data.PORT_LEG_MOTOR_6_OVERLOAD === 'true'
        ) {
            motor6Status = 'fault'
        }
        var brake6Status = 'on'
        if (data.PORT_LEG_MOTOR_6_BRAKE_ON === 'false') {
            brake6Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_6_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.PORT_LEG_MOTOR_6_BRAKE_FAIL === 'true'
        ) {
            brake6Status = 'fault'
        }
        var motor7Status = 'on'
        if (data.PORT_LEG_MOTOR_7_RUNNING === 'false') {
            motor7Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_7_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.PORT_LEG_MOTOR_7_MOTOR_JAM === 'true' || 
            data.PORT_LEG_MOTOR_7_OVER_TEMPERATURE === 'true' || 
            data.PORT_LEG_MOTOR_7_OVERLOAD === 'true'
        ) {
            motor7Status = 'fault'
        }
        var brake7Status = 'on'
        if (data.PORT_LEG_MOTOR_7_BRAKE_ON === 'false') {
            brake7Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_7_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.PORT_LEG_MOTOR_7_BRAKE_FAIL === 'true'
        ) {
            brake7Status = 'fault'
        }
        var motor8Status = 'on'
        if (data.PORT_LEG_MOTOR_8_RUNNING === 'false') {
            motor8Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_8_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.PORT_LEG_MOTOR_8_MOTOR_JAM === 'true' || 
            data.PORT_LEG_MOTOR_8_OVER_TEMPERATURE === 'true' || 
            data.PORT_LEG_MOTOR_8_OVERLOAD === 'true'
        ) {
            motor8Status = 'fault'
        }
        var brake8Status = 'on'
        if (data.PORT_LEG_MOTOR_8_BRAKE_ON === 'false') {
            brake8Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_8_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.PORT_LEG_MOTOR_8_BRAKE_FAIL === 'true'
        ) {
            brake8Status = 'fault'
        }
        var motor9Status = 'on'
        if (data.PORT_LEG_MOTOR_9_RUNNING === 'false') {
            motor9Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_9_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.PORT_LEG_MOTOR_9_MOTOR_JAM === 'true' || 
            data.PORT_LEG_MOTOR_9_OVER_TEMPERATURE === 'true' || 
            data.PORT_LEG_MOTOR_9_OVERLOAD === 'true'
        ) {
            motor9Status = 'fault'
        }
        var brake9Status = 'on'
        if (data.PORT_LEG_MOTOR_9_BRAKE_ON === 'false') {
            brake9Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_9_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.PORT_LEG_MOTOR_9_BRAKE_FAIL === 'true'
        ) {
            brake9Status = 'fault'
        }
        var motor10Status = 'on'
        if (data.PORT_LEG_MOTOR_10_RUNNING === 'false') {
            motor10Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_10_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.PORT_LEG_MOTOR_10_MOTOR_JAM === 'true' || 
            data.PORT_LEG_MOTOR_10_OVER_TEMPERATURE === 'true' || 
            data.PORT_LEG_MOTOR_10_OVERLOAD === 'true'
        ) {
            motor10Status = 'fault'
        }
        var brake10Status = 'on'
        if (data.PORT_LEG_MOTOR_10_BRAKE_ON === 'false') {
            brake10Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_10_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.PORT_LEG_MOTOR_10_BRAKE_FAIL === 'true'
        ) {
            brake10Status = 'fault'
        }
        var motor11Status = 'on'
        if (data.PORT_LEG_MOTOR_11_RUNNING === 'false') {
            motor11Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_11_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.PORT_LEG_MOTOR_11_MOTOR_JAM === 'true' || 
            data.PORT_LEG_MOTOR_11_OVER_TEMPERATURE === 'true' || 
            data.PORT_LEG_MOTOR_11_OVERLOAD === 'true'
        ) {
            motor11Status = 'fault'
        }
        var brake11Status = 'on'
        if (data.PORT_LEG_MOTOR_11_BRAKE_ON === 'false') {
            brake11Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_11_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.PORT_LEG_MOTOR_11_BRAKE_FAIL === 'true'
        ) {
            brake11Status = 'fault'
        }
        var motor12Status = 'on'
        if (data.PORT_LEG_MOTOR_12_RUNNING === 'false') {
            motor12Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_12_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.PORT_LEG_MOTOR_12_MOTOR_JAM === 'true' || 
            data.PORT_LEG_MOTOR_12_OVER_TEMPERATURE === 'true' || 
            data.PORT_LEG_MOTOR_12_OVERLOAD === 'true'
        ) {
            motor12Status = 'fault'
        }
        var brake12Status = 'on'
        if (data.PORT_LEG_MOTOR_12_BRAKE_ON === 'false') {
            brake12Status = 'off'
        }
        if (
            data.PORT_LEG_MOTOR_12_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.PORT_LEG_MOTOR_12_BRAKE_FAIL === 'true'
        ) {
            brake12Status = 'fault'
        }
        return (
            <>
            {this.props.renderFor == 0 && this.renderWeightGauge("PORT")}
            <div style={{position : "absolute", top : "3%", left : "35%", right : "55%"}} >
                {this.renderMotorBrake(motor1Status,brake1Status,'PORT_LEG_MOTOR_1')}
            </div>
            <div style={{position : "absolute", top : "3%", left : "55%", right : "35%"}} >
                {this.renderMotorBrake(motor2Status,brake2Status,'PORT_LEG_MOTOR_2')}
            </div>
            <div style={{position : "absolute", top : "25%", left : "35%", right : "55%"}} >
                {this.renderMotorBrake(motor3Status,brake3Status,'PORT_LEG_MOTOR_3')}
            </div>
            <div style={{position : "absolute", top : "25%", left : "55%", right : "35%"}} >
                {this.renderMotorBrake(motor4Status,brake4Status,'PORT_LEG_MOTOR_4')}
            </div>
    
            <div style={{position : "absolute", top : "55%", left : "10%", right : "80%"}} >
                {this.renderMotorBrake(motor5Status,brake5Status,'PORT_LEG_MOTOR_5')}
            </div>
            <div style={{position : "absolute", top : "55%", left : "30%", right : "60%"}} >
                {this.renderMotorBrake(motor6Status,brake6Status,'PORT_LEG_MOTOR_6')}
            </div>
            <div style={{position : "absolute", top : "80%", left : "10%", right : "80%"}} >
                {this.renderMotorBrake(motor7Status,brake7Status,'PORT_LEG_MOTOR_7')}
            </div>
            <div style={{position : "absolute", top : "80%", left : "30%", right : "60%"}} >
                {this.renderMotorBrake(motor8Status,brake8Status,'PORT_LEG_MOTOR_8')}
            </div>
    
            <div style={{position : "absolute", top : "55%", left : "60%", right : "30%"}} >
                {this.renderMotorBrake(motor9Status,brake9Status,'PORT_LEG_MOTOR_9')}
            </div>
            <div style={{position : "absolute", top : "55%", left : "80%", right : "10%"}} >
                {this.renderMotorBrake(motor10Status,brake10Status,'PORT_LEG_MOTOR_10')}
            </div>
            <div style={{position : "absolute", top : "80%", left : "60%", right : "30%"}} >
                {this.renderMotorBrake(motor11Status,brake11Status,'PORT_LEG_MOTOR_11')}
            </div>
            <div style={{position : "absolute", top : "80%", left : "80%", right : "10%"}} >
                {this.renderMotorBrake(motor12Status,brake12Status,'PORT_LEG_MOTOR_12')}
            </div>
            </>
        )
    }
    renderStbdLeg() {
        if (this.state.data === undefined) {
            return (<></>)
        }
        var data = this.state.data
        var motor1Status = 'on'
        if (data.STBD_LEG_MOTOR_1_RUNNING === 'false') {
            motor1Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_1_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.STBD_LEG_MOTOR_1_MOTOR_JAM === 'true' || 
            data.STBD_LEG_MOTOR_1_OVER_TEMPERATURE === 'true' || 
            data.STBD_LEG_MOTOR_1_OVERLOAD === 'true'
        ) {
            motor1Status = 'fault'
        }
        var brake1Status = 'on'
        if (data.STBD_LEG_MOTOR_1_BRAKE_ON === 'false') {
            brake1Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_1_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.STBD_LEG_MOTOR_1_BRAKE_FAIL === 'true'
        ) {
            brake1Status = 'fault'
        }
    
        var motor2Status = 'on'
        if (data.STBD_LEG_MOTOR_2_RUNNING === 'false') {
            motor2Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_2_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.STBD_LEG_MOTOR_2_MOTOR_JAM === 'true' || 
            data.STBD_LEG_MOTOR_2_OVER_TEMPERATURE === 'true' || 
            data.STBD_LEG_MOTOR_2_OVERLOAD === 'true'
        ) {
            motor2Status = 'fault'
        }
        var brake2Status = 'on'
        if (data.STBD_LEG_MOTOR_2_BRAKE_ON === 'false') {
            brake2Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_2_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.STBD_LEG_MOTOR_2_BRAKE_FAIL === 'true'
        ) {
            brake2Status = 'fault'
        }
        
        var motor3Status = 'on'
        if (data.STBD_LEG_MOTOR_3_RUNNING === 'false') {
            motor3Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_3_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.STBD_LEG_MOTOR_3_MOTOR_JAM === 'true' || 
            data.STBD_LEG_MOTOR_3_OVER_TEMPERATURE === 'true' || 
            data.STBD_LEG_MOTOR_3_OVERLOAD === 'true'
        ) {
            motor3Status = 'fault'
        }
        var brake3Status = 'on'
        if (data.STBD_LEG_MOTOR_3_BRAKE_ON === 'false') {
            brake3Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_3_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.STBD_LEG_MOTOR_3_BRAKE_FAIL === 'true'
        ) {
            brake3Status = 'fault'
        }
    
        var motor4Status = 'on'
        if (data.STBD_LEG_MOTOR_4_RUNNING === 'false') {
            motor4Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_4_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.STBD_LEG_MOTOR_4_MOTOR_JAM === 'true' || 
            data.STBD_LEG_MOTOR_4_OVER_TEMPERATURE === 'true' || 
            data.STBD_LEG_MOTOR_4_OVERLOAD === 'true'
        ) {
            motor4Status = 'fault'
        }
        var brake4Status = 'on'
        if (data.STBD_LEG_MOTOR_4_BRAKE_ON === 'false') {
            brake4Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_4_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.STBD_LEG_MOTOR_4_BRAKE_FAIL === 'true'
        ) {
            brake4Status = 'fault'
        }
        var motor5Status = 'on'
        if (data.STBD_LEG_MOTOR_5_RUNNING === 'false') {
            motor5Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_5_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.STBD_LEG_MOTOR_5_MOTOR_JAM === 'true' || 
            data.STBD_LEG_MOTOR_5_OVER_TEMPERATURE === 'true' || 
            data.STBD_LEG_MOTOR_5_OVERLOAD === 'true'
        ) {
            motor5Status = 'fault'
        }
        var brake5Status = 'on'
        if (data.STBD_LEG_MOTOR_5_BRAKE_ON === 'false') {
            brake5Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_5_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.STBD_LEG_MOTOR_5_BRAKE_FAIL === 'true'
        ) {
            brake5Status = 'fault'
        }
        var motor6Status = 'on'
        if (data.STBD_LEG_MOTOR_6_RUNNING === 'false') {
            motor6Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_6_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.STBD_LEG_MOTOR_6_MOTOR_JAM === 'true' || 
            data.STBD_LEG_MOTOR_6_OVER_TEMPERATURE === 'true' || 
            data.STBD_LEG_MOTOR_6_OVERLOAD === 'true'
        ) {
            motor6Status = 'fault'
        }
        var brake6Status = 'on'
        if (data.STBD_LEG_MOTOR_6_BRAKE_ON === 'false') {
            brake6Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_6_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.STBD_LEG_MOTOR_6_BRAKE_FAIL === 'true'
        ) {
            brake6Status = 'fault'
        }
        var motor7Status = 'on'
        if (data.STBD_LEG_MOTOR_7_RUNNING === 'false') {
            motor7Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_7_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.STBD_LEG_MOTOR_7_MOTOR_JAM === 'true' || 
            data.STBD_LEG_MOTOR_7_OVER_TEMPERATURE === 'true' || 
            data.STBD_LEG_MOTOR_7_OVERLOAD === 'true'
        ) {
            motor7Status = 'fault'
        }
        var brake7Status = 'on'
        if (data.STBD_LEG_MOTOR_7_BRAKE_ON === 'false') {
            brake7Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_7_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.STBD_LEG_MOTOR_7_BRAKE_FAIL === 'true'
        ) {
            brake7Status = 'fault'
        }
        var motor8Status = 'on'
        if (data.STBD_LEG_MOTOR_8_RUNNING === 'false') {
            motor8Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_8_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.STBD_LEG_MOTOR_8_MOTOR_JAM === 'true' || 
            data.STBD_LEG_MOTOR_8_OVER_TEMPERATURE === 'true' || 
            data.STBD_LEG_MOTOR_8_OVERLOAD === 'true'
        ) {
            motor8Status = 'fault'
        }
        var brake8Status = 'on'
        if (data.STBD_LEG_MOTOR_8_BRAKE_ON === 'false') {
            brake8Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_8_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.STBD_LEG_MOTOR_8_BRAKE_FAIL === 'true'
        ) {
            brake8Status = 'fault'
        }
        var motor9Status = 'on'
        if (data.STBD_LEG_MOTOR_9_RUNNING === 'false') {
            motor9Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_9_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.STBD_LEG_MOTOR_9_MOTOR_JAM === 'true' || 
            data.STBD_LEG_MOTOR_9_OVER_TEMPERATURE === 'true' || 
            data.STBD_LEG_MOTOR_9_OVERLOAD === 'true'
        ) {
            motor9Status = 'fault'
        }
        var brake9Status = 'on'
        if (data.STBD_LEG_MOTOR_9_BRAKE_ON === 'false') {
            brake9Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_9_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.STBD_LEG_MOTOR_9_BRAKE_FAIL === 'true'
        ) {
            brake9Status = 'fault'
        }
        var motor10Status = 'on'
        if (data.STBD_LEG_MOTOR_10_RUNNING === 'false') {
            motor10Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_10_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.STBD_LEG_MOTOR_10_MOTOR_JAM === 'true' || 
            data.STBD_LEG_MOTOR_10_OVER_TEMPERATURE === 'true' || 
            data.STBD_LEG_MOTOR_10_OVERLOAD === 'true'
        ) {
            motor10Status = 'fault'
        }
        var brake10Status = 'on'
        if (data.STBD_LEG_MOTOR_10_BRAKE_ON === 'false') {
            brake10Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_10_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.STBD_LEG_MOTOR_10_BRAKE_FAIL === 'true'
        ) {
            brake10Status = 'fault'
        }
        var motor11Status = 'on'
        if (data.STBD_LEG_MOTOR_11_RUNNING === 'false') {
            motor11Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_11_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.STBD_LEG_MOTOR_11_MOTOR_JAM === 'true' || 
            data.STBD_LEG_MOTOR_11_OVER_TEMPERATURE === 'true' || 
            data.STBD_LEG_MOTOR_11_OVERLOAD === 'true'
        ) {
            motor11Status = 'fault'
        }
        var brake11Status = 'on'
        if (data.STBD_LEG_MOTOR_11_BRAKE_ON === 'false') {
            brake11Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_11_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.STBD_LEG_MOTOR_11_BRAKE_FAIL === 'true'
        ) {
            brake11Status = 'fault'
        }
        var motor12Status = 'on'
        if (data.STBD_LEG_MOTOR_12_RUNNING === 'false') {
            motor12Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_12_MOTOR_CONTACTOR_AND_BREAKER_TRIP === 'true' || 
            data.STBD_LEG_MOTOR_12_MOTOR_JAM === 'true' || 
            data.STBD_LEG_MOTOR_12_OVER_TEMPERATURE === 'true' || 
            data.STBD_LEG_MOTOR_12_OVERLOAD === 'true'
        ) {
            motor12Status = 'fault'
        }
        var brake12Status = 'on'
        if (data.STBD_LEG_MOTOR_12_BRAKE_ON === 'false') {
            brake12Status = 'off'
        }
        if (
            data.STBD_LEG_MOTOR_12_BRAKE_OVERLOAD_OVERHEAT === 'true' || 
            data.STBD_LEG_MOTOR_12_BRAKE_FAIL === 'true'
        ) {
            brake12Status = 'fault'
        }
        return (
            <>
            {this.props.renderFor == 0 && this.renderWeightGauge("STBD")}
            <div style={{position : "absolute", top : "3%", left : "35%", right : "55%"}} >
                {this.renderMotorBrake(motor1Status,brake1Status,'STBD_LEG_MOTOR_1')}
            </div>
            <div style={{position : "absolute", top : "3%", left : "55%", right : "35%"}} >
                {this.renderMotorBrake(motor2Status,brake2Status,'STBD_LEG_MOTOR_2')}
            </div>
            <div style={{position : "absolute", top : "25%", left : "35%", right : "55%"}} >
                {this.renderMotorBrake(motor3Status,brake3Status,'STBD_LEG_MOTOR_3')}
            </div>
            <div style={{position : "absolute", top : "25%", left : "55%", right : "35%"}} >
                {this.renderMotorBrake(motor4Status,brake4Status,'STBD_LEG_MOTOR_4')}
            </div>
    
            <div style={{position : "absolute", top : "55%", left : "10%", right : "80%"}} >
                {this.renderMotorBrake(motor5Status,brake5Status,'STBD_LEG_MOTOR_5')}
            </div>
            <div style={{position : "absolute", top : "55%", left : "30%", right : "60%"}} >
                {this.renderMotorBrake(motor6Status,brake6Status,'STBD_LEG_MOTOR_6')}
            </div>
            <div style={{position : "absolute", top : "80%", left : "10%", right : "80%"}} >
                {this.renderMotorBrake(motor7Status,brake7Status,'STBD_LEG_MOTOR_7')}
            </div>
            <div style={{position : "absolute", top : "80%", left : "30%", right : "60%"}} >
                {this.renderMotorBrake(motor8Status,brake8Status,'STBD_LEG_MOTOR_8')}
            </div>
    
            <div style={{position : "absolute", top : "55%", left : "60%", right : "30%"}} >
                {this.renderMotorBrake(motor9Status,brake9Status,'STBD_LEG_MOTOR_9')}
            </div>
            <div style={{position : "absolute", top : "55%", left : "80%", right : "10%"}} >
                {this.renderMotorBrake(motor10Status,brake10Status,'STBD_LEG_MOTOR_10')}
            </div>
            <div style={{position : "absolute", top : "80%", left : "60%", right : "30%"}} >
                {this.renderMotorBrake(motor11Status,brake11Status,'STBD_LEG_MOTOR_11')}
            </div>
            <div style={{position : "absolute", top : "80%", left : "80%", right : "10%"}} >
                {this.renderMotorBrake(motor12Status,brake12Status,'STBD_LEG_MOTOR_12')}
            </div>
            </>
        )
    }
    renderInclinometer() {
        if (this.state.data === undefined) {
            return (<></>)
        }
        var data = this.state.data
        var inclinationY = parseFloat(data.INCLINATION_FWD_AFT)
        var inclinationX = parseFloat(data.INCLINATION_STBD_PORT)
        var len = Math.sqrt(inclinationX ** 2 + inclinationY ** 2)
        if (len > 5) {
            inclinationX = len / 25 * inclinationX
            inclinationY = len / 25 * inclinationY
        }
        inclinationY += 5
        inclinationX += 5
        var btm = (inclinationY / 10 * 100) + "%" 
        var left = (inclinationX / 10 * 100) + "%" 
        return (
            <>
            <Row>
                <Col style={
                    this.props.renderFor != 2 ? {textAlign : "center", color : "white"} : 
                        {textAlign : "center", color : "white", padding : 0, width : "fit-content"}}>
                    Inclinometer
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign : "center", padding : "0"}}>
                    <img src={Inclinometer} />
                    <div style={{position : 'absolute', left: left, bottom : btm}}>
                        <div style={{borderRadius : "50%", border : "2px solid red", marginLeft : "-2px", marginBottom : "-2px"}}></div>
                    </div>
                </Col>
            </Row>
            </>
        )
    }
    renderLegLoads() {
        if (this.state.data === undefined) {
            return (<></>)
        }
        var data = this.state.data
        var portLegData = [
            data.PORT_CHORD_LOAD_A, data.PORT_CHORD_LOAD_B, data.PORT_CHORD_LOAD_C
        ]
        var fwdLegData = [
            data.FWD_CHORD_LOAD_A, data.FWD_CHORD_LOAD_B, data.FWD_CHORD_LOAD_C
        ]
        var stbdLegData = [
            data.STBD_CHORD_LOAD_A, data.STBD_CHORD_LOAD_B, data.STBD_CHORD_LOAD_C
        ]

        return(
            <div style={
                this.props.renderFor == 0 ? {marginRight : "-150%", marginLeft : "-150%", width : "400%"} :
                    this.props.renderFor == 1 ? {} : 
                        {}
                }>
                <Row  className="blueHeading3" style={{marginTop : "10px", marginBottom : "5px"}}>
                    <Col style={{textAlign : "center"}}>PORT CHORD LOAD (kips)</Col>
                    <Col style={{textAlign : "center"}}>FWD CHORD LOAD (kips)</Col>
                    <Col style={{textAlign : "center"}}>STBD CHORD LOAD (kips)</Col>
                </Row>
                <Row>
                    <Col><LegLoadGauge data={portLegData}/></Col>
                    <Col><LegLoadGauge data={fwdLegData}/></Col>
                    <Col><LegLoadGauge data={stbdLegData}/></Col>
                </Row>  
                <Row style={{fontSize : "0.5rem"}}>
                    <Col>
                        <Row style={{color : "white"}}>
                            <Col style={{textAlign : "center"}}>A</Col>
                            <Col style={{textAlign : "center"}}>B</Col>
                            <Col style={{textAlign : "center"}}>C</Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row style={{color : "white"}}>
                            <Col style={{textAlign : "center"}}>A</Col>
                            <Col style={{textAlign : "center"}}>B</Col>
                            <Col style={{textAlign : "center"}}>C</Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row style={{color : "white"}}>
                            <Col style={{textAlign : "center"}}>A</Col>
                            <Col style={{textAlign : "center"}}>B</Col>
                            <Col style={{textAlign : "center"}}>C</Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
    renderLG() {
        if (this.state.data === undefined) {
            return (<></>)
        }
        return(
            <SideBar>
                {this.renderHeader()}
                <Row>
                    <Col xs={1} style={{marginLeft : "-3%"}}></Col>
                    <Col xs={{span : 3, offset : 0}} style={{display : "flex", marginBottom : "10px"}}>
                        {this.renderMotorStatusOverview()}
                    </Col>
                    <Col xs={5}>
                        <img src={LegBG} />
                        {this.renderFwdLeg()}
                    </Col>
                    <Col xs={3} style={{display : "flex", marginBottom : "10px"}}>
                        {this.renderBrakeStatusOverview()}
                    </Col>
                </Row>
                <Row>
                    <Col xs={1} style={{marginLeft : "-3%"}}></Col>
                    <Col xs={{span : 5, offset : 0}}>
                        <img src={LegBG} />
                        {this.renderPortLeg()}
                    </Col>
                    <Col xs={{span : 1, offset : 0}} style={{display : "flex" , flexDirection : "column"}}>
                        <Row><Col>{this.renderLegLoads()}</Col></Row>
                        <Row className="flex-grow-1"><Col style={{margin: "auto"}}>{this.renderInclinometer()}</Col></Row>
                    </Col>
                    <Col xs={{span : 5, offset : 0}}>
                        <img src={LegBG} />
                        {this.renderStbdLeg()}
                    </Col>
                </Row>
            </SideBar>
        )
    }
    renderMD() {
        if (this.state.data === undefined) {
            return (<></>)
        }
        return (
            <>
            {this.renderHeader()}
            <Row>
                <Col sm={{span : 8, offset : 2}}>
                    <Row>
                        <Col>{this.renderWeightGauge("PORT")}</Col>
                        <Col>{this.renderWeightGauge("FWD")}</Col>
                        <Col>{this.renderWeightGauge("STBD")}</Col>
                    </Row>
                    {this.renderLegLoads()}
                </Col>
            </Row>
            <Row>
                <Col sm={{span : 10, offset : 1}}>
                    <div style={{padding : "5px"}}>
                    <Row>
                        <Col xs={6} style={{display : "flex", marginBottom : "10px"}}>
                            <div style={{padding : "10px"}}>
                            {this.renderMotorStatusOverview()}
                            </div>
                        </Col>
                        <Col xs={6} style={{display : "flex", marginBottom : "10px"}}>
                            <div style={{padding : "10px"}}>
                            {this.renderBrakeStatusOverview()}
                            </div>
                        </Col>
                    </Row>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={{span:6, offset : 3}}>
                    <img src={LegBG} />
                    {this.renderFwdLeg()}
                </Col>
            </Row>
            <Row>
                <Col xs={{span : 5, offset : 0}}>
                    <img src={LegBG} />
                    {this.renderPortLeg()}
                </Col>
                <Col xs={{span : 2, offset : 0}} style={{display : "flex" , flexDirection : "column"}}>
                    <Row className="flex-grow-1"><Col style={{margin: "auto"}}>{this.renderInclinometer()}</Col></Row>
                </Col>
                <Col xs={{span : 5, offset : 0}}>
                    <img src={LegBG} />
                    {this.renderStbdLeg()}
                </Col>
            </Row>
            </>
        )
    }
    renderSM() {
        if (this.state.data === undefined) {
            return (<></>)
        }
        return (
            <>
            {this.renderHeader()}
            <Row>
                <Col sm={{span : 8, offset : 2}}>
                    <Row>
                        <Col xs={4}>{this.renderWeightGauge("PORT")}</Col>
                        <Col xs={4}>{this.renderWeightGauge("FWD")}</Col>
                        <Col xs={4}>{this.renderWeightGauge("STBD")}</Col>
                    </Row>
                    {this.renderLegLoads()}
                </Col>
            </Row>
            <Row>
                <Col sm={{span : 10, offset : 1}}>
                    <div style={{padding : "5px"}}>
                    <Row >
                        <Col xs={6} style={{display : "flex", marginBottom : "10px"}}>
                            <div style={{padding : "10px"}}>
                            {this.renderMotorStatusOverview()}
                            </div>
                        </Col>
                        <Col xs={6} style={{display : "flex", marginBottom : "10px"}}>
                            <div style={{padding : "10px"}}>
                            {this.renderBrakeStatusOverview()}
                            </div>
                        </Col>
                    </Row>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={{span:6, offset : 3}}>
                    <img src={LegBG} />
                    {this.renderFwdLeg()}
                </Col>
            </Row>
            <Row>
                <Col xs={{span : 2, offset : 5}} style={{display : "flex" , flexDirection : "column"}}>
                    <Row className="flex-grow-1"><Col style={{margin: "auto"}}>{this.renderInclinometer()}</Col></Row>
                </Col>
            </Row>
            <Row style={{marginTop : "-10%"}}>
                <Col xs={{span : 6, offset : 0}}>
                    <img src={LegBG} />
                    {this.renderPortLeg()}
                </Col>
                <Col xs={{span : 6, offset : 0}}>
                    <img src={LegBG} />
                    {this.renderStbdLeg()}
                </Col>
            </Row>
            </>
        )
    }
    renderHeader() {
        return (
        <>
        <Row>
            <Col xs={1} style={{marginLeft : "-3%"}}></Col>
            <Col xs={{span : 11, offset : 0}} className={this.props.renderFor != 2 ? "whiteHeading1" : "whiteHeading2" } style={{textAlign : "center"}}>
                JACKING SYSTEM - ASSET MONITORING
            </Col>
        </Row>
        <Row>
            <Col>
                <HtmlTooltip
                    placement = "right-start"
                        title={
                    <React.Fragment>
                        <Row>
                            <Col>
                                Motor Status
                            </Col>
                        </Row>
                        <Row noGutters={true}>
                            <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                                <img className="legendIcon" src={MotorOnIcon} alt="motor on"/>
                            </Col>
                            <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                                On
                            </Col>
                            <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                                <img className="legendIcon" src={MotorOffIcon} alt="motor off"/>
                            </Col>
                            <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                                Off
                            </Col>
                            <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                                <div style={{textAlign : "center"}}>
                                    <img className="legendIcon" src={MotorFaultIcon} alt="motor fault"/>
                                    <img src={AlarmIcon} style={{margin : "auto", width : "40%"}} alt="motor alarm"/>
                                </div>
                            </Col>
                            <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                                Fault
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                Brake Status
                            </Col>
                        </Row>
                        <Row noGutters={true}>
                            <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                                <img className="legendIcon" src={BrakeOnIcon} alt="brake on"/>
                            </Col>
                            <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                                On
                            </Col>
                            <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                                <img className="legendIcon" src={BrakeOffIcon} alt="brake off"/>
                            </Col>
                            <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                                Off
                            </Col>
                            <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                                <div style={{textAlign : "center"}}>
                                    <img className="legendIcon" src={BrakeFaultIcon} alt="brake fault"/>
                                    <img src={AlarmIcon} style={{margin : "auto", width : "40%"}} alt="brake alarm"/>
                                </div>
                            </Col>
                            <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                                Fault
                            </Col>
                        </Row>
                    </React.Fragment>
                    }
                >
                    <img src={infoIcon} alt="Information"/>
                </HtmlTooltip>
            </Col>
        </Row>
        </>
        )
    }
    render() {
        var contents = this.renderLG()
        if (this.props.renderFor == 1) {
            contents = this.renderMD()
        }
        if (this.props.renderFor == 2) {
            contents = this.renderSM()
        }
        return (
            <div className="content-inner-all">
            <Container fluid={true}>
                {contents}
                {this.renderMotorStatusModal()}
            </Container>
            </div>)
    }
}

export default withLayoutManager(AssetManagement);
