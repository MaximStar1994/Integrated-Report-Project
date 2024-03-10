import React from 'react';
import Container from 'react-bootstrap/Container'
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';
import Rig from '../../model/Rig.js'
import SideBar from '../../components/SideBar/SideBar'
import DashboardCardWithHeader from '../../components/DashboardCard/DashboardCardWithHeader'
import ValueCard from './ValueCard.js'
import ValueCard2 from './ValueCard2.js'
import BrakeGauge from './BrakeGauge.js'
import TopDrive from '../../assets/Background/TopDrive.png'
import Derrick from '../../assets/Background/Derrick.png'
import './DrillingOperation.css'

import {withLayoutManager} from '../../Helper/Layout/layout'

class DrillingOperation extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
        };
        this.rigApi = new Rig()
        this.interval = undefined
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.rigApi.GetDrillingOperations((value,error) => {
                this.setState({data : value})
            })
        }, 10000);
        this.rigApi.GetDrillingOperations((value,error) => {
            this.setState({data : value})
        })
    }
    componentWillUnmount() {
        if (this.interval !== undefined) {
            clearInterval(this.interval)
        }
    }
    renderDerrick() {
        if (this.state.data === undefined || this.state.data === null) {
            return (<></>)
        }
        var data = this.state.data.derrick
        return(
            <div class="MainCardBG">
                <Row>
                    <Col style={{textAlign : "center", padding:"20px"}}>
                        HOOKLOAD
                    </Col>
                </Row>
                <Row >
                    <Col xs={{span:10, offset : 1}} style={{paddingLeft : "30px", paddingRight : "30px"}}>
                        <ValueCard label="" value={data.hookLoad} unit="Kn" />
                    </Col>
                </Row>
                <Row>
                    <Col xs={2} style={{display : "flex"}}>
                        <div style={{
                            position : "relative",
                            marginTop : "25px",
                            marginBottom : "25px",
                            marginLeft : "5px",
                            marginRight : "-15px", 
                            borderRadius : "15px",
                            border : "2px solid #045473",
                            flexGrow: 1, 
                            backgroundColor : "black"}}>
                                <div style={{position : "absolute", left : "0", right : "0", bottom : data.topOfBlock + "%"}}>
                                    <div style={{
                                        borderRadius : "50%",
                                        backgroundColor : "#ec1fde",
                                    }}>
                                        &nbsp;
                                    </div>
                                </div>
                                <div style={{position : "absolute", left : "0", right : "0", bottom : data.elevator + "%"}}>
                                    <div style={{
                                        borderRadius : "50%",
                                        backgroundColor : "#83407e",
                                    }}>
                                        &nbsp;
                                    </div>
                                </div>
                        </div>
                    </Col>
                    <Col xs={10} style={{padding : "25px"}}>
                        <img src={Derrick} style={{width : "100%"}}/>
                        <div 
                        style={{position  :"absolute" , top : "10%", left : "15%", right : "15%", paddingLeft : "15px", paddingRight : "15px"}} >
                            <ValueCard label="Top of the Block" value={data.topOfBlock} unit="m" />
                        </div>
                        <div 
                        style={{position  :"absolute" , top : this.props.renderFor === 0 ? "40%" : "45%", left : "15%", right : "15%", paddingLeft : "15px", paddingRight : "15px"}} >
                            <ValueCard label="Block Speed" value={data.blockSpeed} unit="M/M" />
                        </div>
                        <div 
                        style={{position  :"absolute" , top : "75%", left : "15%", right : "15%", paddingLeft : "15px", paddingRight : "15px"}} >
                            <ValueCard label="Elevator" value={data.elevator} unit="M" />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
    renderMudpumps() {
        if (this.state.data === undefined || this.state.data === null) {
            return (<></>)
        }
        var data = this.state.data.mudpump
        var border1, border2, border3 = ""
        if (data.mp1.active) {
            border1 = "5px solid green"
        }
        if (data.mp2.active) {
            border2 = "5px solid green"
        }
        if (data.mp3.active) {
            border3 = "5px solid green"
        }
        var styleForMD = {
            marginBottom : "5px"
        }
        var styleForLG = {
            paddingLeft : "30px", paddingRight : "30px", marginBottom : "5px"
        }
        return(
            <div className="MainCardBG" style={{marginTop:"5px"}}>
                <Row>
                    <Col style={{textAlign : "center", padding:"5px"}}>
                        MUD PUMPS
                    </Col>
                </Row>
                <Row>
                    <Col xs={{span:10, offset : 1}} style={this.props.renderFor === 0 ? styleForLG : styleForMD}>
                        <Row>
                            <Col style={{border : border1, alignSelf : "center"}}>
                                <div >
                                    <ValueCard label="MP1" value={data.mp1.spm} unit="SPM" />
                                </div>
                            </Col>
                            <Col style={{border : border2, marginRight : "15px", marginLeft : "15px", alignSelf : "center"}}>
                                <div >
                                    <ValueCard label="MP2" value={data.mp2.spm} unit="SPM" />
                                </div>
                            </Col>
                            <Col style={{border : border3, alignSelf : "center"}}>
                                <div >
                                    <ValueCard label="MP3" value={data.mp3.spm} unit="SPM" />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
    renderAux() {
        if (this.state.data === undefined || this.state.data === null) {
            return (<></>)
        }
        var data = this.state.data.auxilary
        return(
            <div className="MainCardBG" style={{marginTop:"5px"}}>
                <Row>
                    <Col style={{textAlign : "center", padding:"5px"}}>
                        AUXILLARY
                    </Col>
                </Row>
                <Row>
                    <Col lg={{span:10, offset : 1}} xs={{span:12, offset:0}} 
                    style={{paddingLeft : "30px", paddingRight : "30px", marginBottom : "5px"}}>
                        <Row>
                            <Col>
                                <div style={{paddingRight : "5px", paddingLeft : "5px"}}>
                                    <ValueCard label="HPU Pressure" value={data.HPUPressure} unit="BAR" />
                                </div>
                            </Col>
                            <Col>
                                <div style={{paddingRight : "5px", paddingLeft : "5px"}}>
                                    <ValueCard label="Rig Air Pressure" value={data.RigAirPressure} unit="PSI" />
                                </div>
                            </Col>
                            <Col>
                                <div style={{paddingLeft : "5px", paddingRight : "5px"}}>
                                    <ValueCard label="Cathead Pull Force" value={data.CatheadPullForce} unit="kN" />
                                </div>
                            </Col>
                            <Col>
                                <div style={{paddingLeft : "5px", paddingRight : "5px"}}>
                                    <ValueCard label="Rotary Table Speed" value={data.RotaryTableSpeed} unit="RPM" />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
    renderDrawworks(onlyTorqueValues = false) {
        if (this.state.data === undefined || this.state.data === null) {
            return (<></>)
        }
        var data = this.state.data.drawworks
        var border1, border2, border3 = ""
        if (data.torque['1'].active) {
            border1 = "5px solid green"
        }
        if (data.torque['2'].active) {
            border2 = "5px solid green"
        }
        if (data.torque['3'].active) {
            border3 = "5px solid green"
        }
        return(
            <div className="MainCardBG" style={{paddingBottom : "10px"}}>
                <Row>
                    <Col style={{textAlign : "center", padding: this.props.renderFor === 0 ? "20px" : "5px"}}>
                        DRAWWORKS
                    </Col>
                </Row>
                {((this.props.renderFor !== 0 && !onlyTorqueValues) || (this.props.renderFor == 0) ) && 
                <Row>
                    <Col xs={{span:12, offset : 0}} sm={{span:10, offset : 1}} 
                        style={{paddingLeft : this.props.renderFor == 2 ? "45px" : "30px", paddingRight : this.props.renderFor == 2 ? "45px" : "30px"}}>
                        <Row noGutters={true}>
                            <Col>
                                <Row>
                                    <Col style={{textAlign : "center"}}>
                                        <div className="valueOuterCard">
                                        Service Brake
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="cardBG" style={{display : "flex", flexDirection : "column"}}>
                                            <Row style={{marginTop : "10px"}}>
                                                <Col xs={{span : 6, offset : 3}} style={{paddingLeft : "30px", paddingRight : "30px"}}>
                                                    <Row>
                                                        <Col xs={{span :6}} style={{textAlign : "center", padding : "0"}}>
                                                            B1
                                                        </Col>
                                                        <Col xs={{span : 6, offset : 0}} style={{textAlign : "center", padding : "0"}}>
                                                            B2
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={{span : 6, offset : 3}}>
                                                    <BrakeGauge data={[50,50]} labels={["B1","B2"]}/>
                                                </Col>
                                            </Row>
                                            <Row style={{marginTop : "10px",marginRight : "unset",marginLeft : "unset"}}>
                                                <Col xs={{span : 12, offset : 0}} sm={{span : 10, offset : 1}}>
                                                    <ValueCard2 label="Average" value={data.serviceBrake.average} unit="PSI" />
                                                </Col>
                                            </Row>
                                            <Row style={{marginTop : "10px", marginBottom : "5px",marginRight : "unset",marginLeft : "unset"}}>
                                                <Col xs={{span : 12, offset : 0}} sm={{span : 10, offset : 1}}>
                                                    <ValueCard2 label="Deviation" value={data.serviceBrake.deviation} unit="PSI" />
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col style={{display : "flex"}}>
                                <Row style={{alignSelf : "center", height : "25%", width : "100%", margin : "0"}}>
                                    <Col className="cardBG" style={{paddingLeft : "15px", paddingRight : "15px"}}>
                                    </Col>
                                </Row>
                                <Row style={{position: "absolute", alignSelf : "center", width : "90%", marginLeft : "5%"}}>
                                    <Col style={{display : "flex", flexDirection : "column"}}>
                                        <Row>
                                            <Col className="valueOuterCard" style={{textAlign : "center"}}>
                                                Drum Speed
                                            </Col>
                                        </Row>
                                        <Row style={{flexGrow : 1}}>
                                            <Col className="cardBG" style={{height : "100%", paddingBottom : "10px"}}>
                                                <ValueCard2 style={{alignItems : "center", height : "100%"}} label="" value={data.drumspeed} unit="RPM" />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Col style={{textAlign : "center"}}>
                                        <div className="valueOuterCard">
                                        Parking Brake
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <div className="cardBG" style={{display : "flex", flexDirection : "column"}}>
                                        <Row style={{marginTop : "10px"}}>
                                            <Col xs={{span : 6, offset : 3}} style={{paddingLeft : "30px", paddingRight : "30px"}}>
                                                <Row>
                                                    <Col xs={{span :6}} style={{textAlign : "center", padding : "0"}}>
                                                        B1
                                                    </Col>
                                                    <Col xs={{span : 6, offset : 0}} style={{textAlign : "center", padding : "0"}}>
                                                        B2
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row >
                                            <Col xs={{span : 6, offset : 3}}>
                                                <BrakeGauge data={[50,50]} labels={["B1","B2"]}/>
                                            </Col>
                                        </Row>
                                        <Row style={{marginTop : "10px", marginRight : "unset",marginLeft : "unset"}}>
                                            <Col xs={{span : 12, offset : 0}} sm={{span : 10, offset : 1}}>
                                                <ValueCard2 label="Average" value={data.parkingBrake.average} unit="PSI" />
                                            </Col>
                                        </Row>
                                        <Row style={{marginTop : "10px", marginBottom : "5px", marginRight : "unset",marginLeft : "unset"}}>
                                            <Col xs={{span : 12, offset : 0}} sm={{span : 10, offset : 1}}>
                                                <ValueCard2 label="Deviation" value={data.parkingBrake.deviation} unit="PSI" />
                                            </Col>
                                        </Row>
                                    </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                }
                {((this.props.renderFor !== 0 && onlyTorqueValues) || (this.props.renderFor == 0) ) && 
                <Row>
                    <Col xs={{span:10, offset : 1}} 
                        style={{paddingLeft : this.props.renderFor === 0 ? "30px" : "15px", paddingRight : this.props.renderFor === 0 ? "30px" : "15px", marginTop : "10px"}}>
                        <Row>
                            <Col style={{marginRight : this.props.renderFor === 0 ? "15px" : "0", border : border1}}>
                                <div >
                                    <ValueCard label="Torque A" value={data.torque['1'].value} unit="Nm" />
                                </div>
                            </Col>
                            <Col style={{marginRight : "15px", marginLeft : "15px", border : border2}}>
                                <div >
                                    <ValueCard label="Torque B" value={data.torque['2'].value} unit="Nm" />
                                </div>
                            </Col>
                            <Col style={{marginLeft : this.props.renderFor === 0 ? "15px" : "0", border : border3}}>
                                <div >
                                    <ValueCard label="Torque C" value={data.torque['3'].value} unit="Nm" />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>}
            </div>
        )
    }
    renderTopDrive() {
        if (this.state.data === undefined || this.state.data === null) {
            return (<></>)
        }
        var data = this.state.data.topdrive
        return(
            <>
            <div style={{padding : "0 15px"}}> 
                <img src={TopDrive} style={{width : "100%", height : "100%"}}/>
            </div>
            <div 
            className ="cardBG"
            style={{position  :"absolute" , top : "2%", left : "15px", right : "15px", 
                textAlign : "center",
                padding : "10px"}} >
                TOP DRIVE   
            </div>
            <div style={{
                position : "absolute", top : "9%", left :"10%", width : "25th%",paddingLeft : "15px", paddingRight : "15px" 
            }}>
                <ValueCard label="Make Up Torque" value={data.makeupTorque} unit="Nm" />
            </div>
            <div style={{
                position : "absolute", top : "9%", left :"37.5%", width : "25%", paddingLeft : "15px", paddingRight : "15px"
            }}>
                <ValueCard label="Throttle" value={data.throttle} unit="&nbsp;" />
            </div>
            <div style={{
                position : "absolute", top : "9%", right :"10%", width : "25%", paddingLeft : "15px", paddingRight : "15px"
            }}>
                <ValueCard label="Delta Pressure" value={data.deltaP} unit="PSI" />
            </div>
            <div style={{
                position : "absolute", top : "23%", left :"30%", width : "40%", paddingLeft : "15px", paddingRight : "15px"
            }}>
                <ValueCard label="Weight on Bit" value={data.weightOnBit} unit="kN" />
            </div>
            <div style={{
                position : "absolute", top : "38.5%", left :"33.33%", width : "33.33%", paddingLeft : "15px", paddingRight : "15px"
            }}>
                <ValueCard label="Torque" value={data.torque} unit="kNm" />
            </div>
            <div style={{
                position : "absolute", top : "54%", left :"33.33%", width : "33.33%", paddingLeft : "15px", paddingRight : "15px"
            }}>
                <ValueCard label="Drill Speed" value={data.drillSpeed} unit="RPM" />
            </div>
            <div style={{
                position : "absolute", top : "68%", left :"33.33%", width : "33.33%", paddingLeft : "15px", paddingRight : "15px"
            }}>
                <ValueCard label="Rate of Penetration" value={data.rateOfPenetration} unit="M/H" />
            </div>
            <div style={{
                position : "absolute", top : "83%", left :"19%", width : "30%", paddingLeft : "15px", paddingRight : "15px"
            }}>
                <ValueCard label="Total Depth" value={data.totalDepth} unit="M" />
            </div>
            <div style={{
                position : "absolute", top : "83%", left :"50%", width : "30%", paddingLeft : "15px", paddingRight : "15px"
            }}>
                <ValueCard label="Bit Depth" value={data.bitDepth} unit="M" />
            </div>
            </>
        )
    }
    renderLG() {
        return(
            <SideBar>
                <DashboardCardWithHeader title="Drilling Operation">
                    <Row>
                        <Col xs={6}>
                            {this.renderDrawworks()}
                            {this.renderMudpumps()}
                            {this.renderAux()}
                        </Col>
                        <Col xs={2}>
                            {this.renderDerrick()}
                        </Col>
                        <Col xs={4}>
                            {this.renderTopDrive()}
                        </Col>
                    </Row>
                </DashboardCardWithHeader>
            </SideBar>
        )
    }
    renderMD() {
        return (
            <>
                <DashboardCardWithHeader title="Drilling Operation">
                    <Row style={{marginBottom : "10px"}}>
                        <Col xs={6}>
                            {this.renderDrawworks(true)}
                        </Col>
                        <Col xs={6}>
                            {this.renderMudpumps()}
                        </Col>
                    </Row>
                    <Row style={{marginBottom : "10px"}}>
                        <Col xs={9} style={{alignSelf : "center"}}>
                            {this.renderDrawworks(false)}
                        </Col>
                        <Col xs={3}>
                            {this.renderAux()}
                            
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>
                            {this.renderDerrick()}
                        </Col>
                        <Col xs={8}>
                            {this.renderTopDrive()}
                        </Col>
                    </Row>
                </DashboardCardWithHeader>
            </>
        )
    }
    renderSM() {
        return (
            <>
                <DashboardCardWithHeader title="Drilling Operation">
                    <Row style={{marginBottom : "10px"}}>
                        <Col xs={12}>
                            {this.renderDrawworks(true)}
                        </Col>
                    </Row>
                    <Row style={{marginBottom : "10px"}}>
                        <Col xs={12}>
                            {this.renderMudpumps()}
                        </Col>
                    </Row>
                    <Row style={{marginBottom : "10px"}}>
                        <Col xs={12} style={{alignSelf : "center"}}>
                            {this.renderDrawworks(false)}
                        </Col>
                    </Row>
                    <Row style={{marginBottom : "10px"}}>
                        <Col xs={12} style={{alignSelf : "center"}}>
                            {this.renderAux()}
                        </Col>
                    </Row>
                    <Row style={{marginBottom : "10px"}}>
                        <Col xs={{span : 8, offset : 2}}>
                            {this.renderDerrick()}
                        </Col>
                    </Row>
                    <Row style={{marginBottom : "10px"}}>
                        <Col xs={12}>
                            {this.renderTopDrive()}
                        </Col>
                    </Row>
                </DashboardCardWithHeader>
            </>
        )
    }
    render() {
        var contents = this.renderLG()
        if (this.props.renderFor === 1) {
            contents = this.renderMD()
        }
        if (this.props.renderFor === 2) {
            contents = this.renderSM()
        }
        return (
            <div className="content-inner-all">
                <Container fluid={true}>
                    {contents}
                </Container>
            </div>)
    }
}

export default withLayoutManager(DrillingOperation);
