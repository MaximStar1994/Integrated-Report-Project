import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Power from '../../model/Power'
import BreakerWithMotor from '../PowerGeneration/Breaker'
import Breaker from './Breaker.js'
import GeneratorStatus from '../PowerGeneration/GeneratorStatus'
import EarthFault from './EarthFault'
import SideBar from '../../components/SideBar/SideBar'

import DeltaTransformer from '../../assets/Power/TransformerDelta.png'
import StarDeltaTransformer from '../../assets/Power/TransformerY.png'
import BusTieOff from '../../assets/Power/Earth_Ready.png'
import BusTieOn from '../../assets/Power/Breaker_Close_Horizontal.png'
import helpIcon from '../../assets/Icon/helpIcon.png'
import Legend from '../PowerGeneration/Legend'
import './powerDistribution.css';
import '../../css/App.css';
import {withLayoutManager} from '../../Helper/Layout/layout'
class PowerDistribution extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            data : undefined,
            tagname : ""
        };
        this.powerApi = new Power()
    }

    refreshData = () => {
        this.powerApi.GetPowerDistribution((val,err) => {
            this.setState({data : val})
        }) 
    }
    componentDidMount() {
        this.interval = setInterval(this.refreshData, 10000);
        this.refreshData()
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }
    padDigits(number, digits) {
        return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
    }
    renderLG() {
        if (this.state.data === undefined || this.state.data === null) {
            return (<></>)
        }
        var data = this.state.data
        var bar600Color = "grey"
        if (data.bus600.hasPower) {
            bar600Color = "#66cc33"
        }
        var bus480AColor = "grey"
        if (data.bus480A.hasPower) {
            bus480AColor = "#66cc33"
        }
        var bus480BColor = "grey"
        if (data.bus480B.hasPower) {
            bus480BColor = "#66cc33"
        }
        var bus280AColor = "grey"
        if (data.busA208.hasPower) {
            bus280AColor = "#66cc33"
        }
        var bus280BColor = "grey"
        if (data.busB208.hasPower) {
            bus280BColor = "#66cc33"
        }
        var ebus480Color = "grey"
        if (data.egen.hasPower) {
            ebus480Color =  "#66cc33"
        }
        var ebus208Color = "grey"
        if (data.ebus208.hasPower) {
            ebus208Color =  "#66cc33"
        }
        var ebus280bus280Color = "grey"
        if (data.ebus208.busB.closed && data.busB280.eBus.closed) {
            ebus280bus280Color =  "#66cc33"
        }
        var ebus480bus480Color = "grey"
        if (data.egen.busB.closed && data.bus480B.egen.closed) {
            ebus480bus480Color =  "#66cc33"
        }
        console.log(data)
        return(
            <SideBar>
                <Row>
                    <Col xs={1}><Legend /> </Col>
                    <Col xs={{span : 11}} >
                        <Row>
                            <Col xs={{span : 12, offset : 0}} className="whiteHeading2" style={{textAlign : "center"}}>
                                POWER MANAGEMENT SYSTEM - POWER DISTRIBUTION
                            </Col>
                        </Row>
                        <Row style={{marginTop : "10px"}}>
                            <Col xs={{span : 12}}>
                                <div className="whiteBG" style={{backgroundColor : "white"}}>
                                    <Row>
                                        <Col><BreakerWithMotor data={data.engine1} name="G1"/></Col>
                                        <Col><BreakerWithMotor data={data.engine2} name="G2"/></Col>
                                        <Col><BreakerWithMotor data={data.engine3} name="G3"/></Col>
                                        <Col><BreakerWithMotor data={data.engine4} name="G4"/></Col>
                                        <Col><BreakerWithMotor data={data.engine5} name="G5"/></Col>
                                    </Row>
                                    <Row noGutters={true} >
                                        <Col>
                                            <div style={{position : "absolute", right : "30px", textAlign : "right", top : "10px", zIndex : 1, fontWeight : "bold"}} >
                                                <div style={{padding : "5px 10px"}}>BUS 600V</div>
                                                <EarthFault faulted={data.bus600.fault}/>
                                            </div>
                                            <div style={{height : "5px", width : "100%", backgroundColor : bar600Color, marginBottom:"0"}}>
                                                &nbsp;
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{marginTop : "0"}}>
                            <Col xs={{span : 12}}>
                                <div className="whiteBG" style={{backgroundColor : "white"}}>
                                    <Row >
                                        <Col xs={{span : 1, offset : 1}}>
                                            <Breaker closed={data.bus600.t1.closed} tripped={data.bus600.t1.tripped}/>
                                        </Col>
                                        <Col xs={{span : 1, offset : 1}}>
                                            <Breaker closed={data.bus600.jackingMcc.fwd.closed} tripped={data.bus600.jackingMcc.fwd.tripped}/>
                                        </Col>
                                        <Col xs={1}>
                                            <Breaker closed={data.bus600.jackingMcc.stbd.closed} tripped={data.bus600.jackingMcc.stbd.tripped}/>
                                        </Col>
                                        <Col xs={1}>
                                            <Breaker closed={data.bus600.jackingMcc.port.closed} tripped={data.bus600.jackingMcc.port.tripped}/>
                                        </Col>
                                        <Col xs={{span : 1, offset : 1}}>
                                            <Breaker closed={data.bus600.t2.closed} tripped={data.bus600.t1.tripped}/>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{marginTop : "0"}}>
                            <Col xs={{span : 12}}>
                                <div className="whiteBG" style={{backgroundColor : "white", textAlign : "center"}}>
                                    <Row >
                                        <Col xs={{span : 1, offset : 1}} style={{backgroundColor : "white", zIndex : 1}}>
                                            <Row noGutters={true}>
                                                <Col xs={3} style={{display : "flex", alignItems : "center"}}>T1</Col>
                                                <Col xs={6}><img src={DeltaTransformer} style={{marginTop : "-50%"}}/></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={1}  style={{display : "flex", alignItems : "center"}} className="powerGaugeUnit">
                                            <span style={{ color : "#2d63f7", marginRight : "5px"}} className="powerGaugeValue">{this.padDigits(data.t1.power.toFixed(0),4)}</span> kW
                                        </Col>
                                        <Col xs={1}>
                                            JACKING MCC FWD
                                        </Col>
                                        <Col xs={1}>
                                            JACKING MCC STBD
                                        </Col>
                                        <Col xs={1}>
                                            JACKING MCC PORT
                                        </Col>
                                        <Col xs={{span : 1, offset : 1}} style={{backgroundColor : "white", zIndex : 1}}>
                                            <Row noGutters={true}>
                                                <Col xs={3} style={{display : "flex", alignItems : "center"}}>T2</Col>
                                                <Col xs={6}><img src={DeltaTransformer} style={{marginTop : "-50%"}}/></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={1}  style={{display : "flex", alignItems : "center"}} className="powerGaugeUnit">
                                            <span style={{ color : "#2d63f7", marginRight : "5px"}} className="powerGaugeValue">{this.padDigits(data.t2.power.toFixed(0),4)}</span> kW
                                        </Col>
                                        <Col xs={{span : 1, offset : 1}}>
                                            <div style={{left : "12.5%", right : "12.5%", position : "absolute", bottom : 0}}>
                                                <GeneratorStatus name="EG" status={data.egen.status}/>
                                            </div>
                                        </Col>
                                        <Col xs={{span : 1}}>
                                            SHORE CONNECTION
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{marginTop : "0"}}>
                            <Col xs={{span : 12}}>
                                <div className="whiteBG" style={{backgroundColor : "white", textAlign : "center"}}>
                                    <Row >
                                        <Col xs={{span : 1, offset : 1}}>
                                            <div style={{marginTop : "0"}}>
                                                <Breaker closed={data.bus480A.t1.closed} tripped={data.bus480A.t1.tripped}/>
                                            </div>
                                        </Col>
                                        <Col xs={{span : 1, offset : 5}}>
                                            <div style={{marginTop : "0"}}>
                                                <Breaker closed={data.bus480B.t2.closed} tripped={data.bus480B.t2.tripped}/>
                                            </div>
                                        </Col>
                                        <Col xs={1}>
                                        <div style={{position : "absolute", top : 0, left : "50%", right : 0, backgroundColor : ebus480bus480Color, height : "3px"}} />
                                            <div style={{marginTop : "0"}}>
                                                <Breaker closed={data.bus480B.egen.closed} tripped={data.bus480B.egen.tripped}/>
                                            </div>
                                        </Col>
                                        <Col xs={1}>
                                        <div style={{position : "absolute", top : 0, right : "50%", left : 0, backgroundColor : ebus480bus480Color, height : "3px"}} />
                                            <div style={{marginTop : "0"}}>
                                                <Breaker closed={data.egen.busB.closed} tripped={data.egen.busB.tripped}/>
                                            </div>
                                        </Col>
                                        <Col xs={1}>
                                            <div style={{marginTop : "0"}}>
                                                <Breaker closed={data.egen.egen.closed} tripped={data.egen.egen.tripped}/>
                                            </div>
                                        </Col>
                                        <Col xs={1}>
                                            <div style={{marginTop : "0"}}>
                                                <Breaker closed={data.egen.shore.closed} tripped={data.egen.shore.tripped}/>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col xs={4}>
                                            <div style={{position : "absolute", right : "30px", textAlign : "right", top : "10px", zIndex : 1, fontWeight : "bold", display : this.props.renderFor !== 0 ? "flex" : ""}} >
                                                <div style={{padding : "5px 10px"}}>BUS A 480V</div>
                                                <EarthFault faulted={data.bus480A.fault}/>
                                            </div>
                                            <div style={{height : "5px", width : "100%", backgroundColor : bus480AColor, marginBottom:"0"}}>
                                                &nbsp;
                                            </div>
                                        </Col>
                                        <Col xs={1}>
                                            <div style={{marginLeft : "-30px", marginRight : "-15px", position : "absolute", top : "-45%", zIndex : 1}} >
                                                <img src={data.bus480A.busB.closed ? BusTieOn : BusTieOff} style={{marginTop : "-26%"}}/>
                                            </div>
                                        </Col>
                                        <Col xs={4}>
                                            <div style={{position : "absolute", right : "30px", textAlign : "right", top : "10px", zIndex : 1, fontWeight : "bold"}} >
                                                <div style={{padding : "5px 10px"}}>BUS B 480V</div>
                                                <EarthFault faulted={data.bus480B.fault}/>
                                            </div>
                                            <div style={{height : "5px", width : "100%", backgroundColor : bus480BColor, marginBottom:"0"}}>
                                                &nbsp;
                                            </div>
                                        </Col>
                                        <Col xs={3}>
                                            <div style={{position : "absolute", right : "0", textAlign : "right", top : "10px", zIndex : 1, fontWeight : "bold"}} >
                                                <div style={{padding : "5px 10px"}}>E-Bus 480V</div>
                                                <EarthFault faulted={data.egen.fault}/>
                                            </div>
                                            <div style={{height : "5px", width : "100%", backgroundColor : ebus480Color, marginBottom:"0"}}>
                                                &nbsp;
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{marginTop : "0"}}>
                            <Col xs={{span : 12}}>
                                <div className="whiteBG" style={{backgroundColor : "white", textAlign : "center"}}>
                                    <Row >
                                        <Col xs={{span : 1, offset : 0}}>
                                            <Breaker closed={data.bus480A.t3.closed} tripped={data.bus480A.t3.tripped}/>
                                        </Col>
                                        <Col xs={{span : 1, offset : 0}}>
                                            <Breaker closed={data.bus480A.Drillfloor.feeder.closed} tripped={false}/>
                                        </Col>
                                        <Col xs={{span : 1, offset : 3}}>
                                            <Breaker closed={data.bus480B.hvac.closed} tripped={data.bus480B.hvac.tripped}/>
                                        </Col>
                                        <Col xs={{span : 1, offset : 0}}>
                                            <Breaker closed={data.bus480B.t4.closed} tripped={data.bus480B.t4.tripped}/>
                                        </Col>
                                        <Col xs={{span : 1, offset : 3}}>
                                            <Breaker closed={data.egen.t5.closed} tripped={data.egen.t5.tripped}/>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{marginTop : "0"}}>
                            <Col xs={{span : 12}}>
                                <div className="whiteBG" style={{backgroundColor : "white", textAlign : "center"}}>
                                    <Row >
                                        <Col xs={{span : 1, offset : 0}}>
                                            <Row noGutters={true}>
                                                <Col xs={3} style={{display : "flex", alignItems : "center"}}>T3</Col>
                                                <Col xs={6} style={{backgroundColor : "white", zIndex : 1}}><img src={StarDeltaTransformer} style={{marginTop : "-50%"}}/></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={{span : 1, offset : 0}}>
                                            <div style={{marginTop : "-50%"}}>
                                                <Breaker closed={data.bus480A.Drillfloor.mcc.closed} tripped={false}/>
                                            </div>
                                        </Col>
                                        <Col xs={{span : 1, offset : 3}}>
                                            VENT MCC 480V
                                        </Col>
                                        <Col xs={{span : 1, offset : 0}}>
                                            <Row noGutters={true}>
                                                <Col xs={3} style={{display : "flex", alignItems : "center"}}>T4</Col>
                                                <Col xs={6} style={{backgroundColor : "white", zIndex : 1}}><img src={StarDeltaTransformer} style={{marginTop : "-50%"}}/></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={{span : 1, offset : 3}}>
                                            <Row noGutters={true}>
                                                <Col xs={3} style={{display : "flex", alignItems : "center"}}>T5</Col>
                                                <Col xs={6} style={{backgroundColor : "white", zIndex : 1}}><img src={StarDeltaTransformer} style={{marginTop : "-50%"}}/></Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{marginTop : "0"}}>
                            <Col xs={{span : 12}}>
                                <div className="whiteBG" style={{backgroundColor : "white", textAlign : "center"}}>
                                    <Row >
                                        <Col xs={{span : 1, offset : 0}}>
                                            <div style={{marginTop : "-50%"}}>
                                                <Breaker closed={data.busA208.t3.closed} tripped={data.busA208.t3.tripped}/>
                                            </div>
                                        </Col>
                                        <Col xs={{span : 1, offset : 0}}>
                                            DRILLFLOOR MCC 480V
                                        </Col>
                                        <Col xs={{span : 1, offset : 4}}>
                                            <div style={{marginTop : "-50%"}}>
                                                <Breaker closed={data.busB208.t4.closed} tripped={data.busB208.t4.tripped}/>
                                            </div>
                                        </Col>
                                        <Col xs={{span : 1, offset : 1}}>
                                            <div style={{marginTop : "-50%"}}>
                                                <div style={{position : "absolute", left : "50%", right : 0, backgroundColor : ebus280bus280Color, height : "3px"}} />
                                                <Breaker closed={data.busB208.busTie.closed} tripped={data.busB208.busTie.tripped}/>
                                            </div>
                                        </Col>
                                        <Col xs={{span : 1, offset : 0}}>
                                            <div style={{marginTop : "-50%"}}>
                                                <div style={{position : "absolute", right : "50%", left : 0, backgroundColor : ebus280bus280Color, height : "3px"}} />
                                                <Breaker closed={data.ebus208.busB.closed} tripped={data.ebus208.busB.tripped}/>
                                            </div>
                                        </Col>
                                        <Col xs={{span : 1, offset : 0}}>
                                            <div style={{marginTop : "-50%"}}>
                                                <Breaker closed={data.ebus208.t5.closed} tripped={data.ebus208.t5.tripped}/>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row style={{backgroundColor : "white", height : "80px"}}>
                                        <Col xs={4}>
                                            <div style={{display:"flex", flexDirection : "column", alignItems : "flex-end", position : "absolute", right : "30px", textAlign : "right", top : "10px", zIndex : 1, fontWeight : "bold"}} >
                                                <div style={{padding : "5px 10px"}}>BUS A 280/120VAC</div>
                                                <EarthFault faulted={data.busA208.fault}/>
                                            </div>
                                            <div style={{height : "5px", width : "100%", backgroundColor : bus280AColor, marginBottom:"0"}}>
                                                &nbsp;
                                            </div>
                                        </Col>
                                        <Col xs={1}>
                                            <div style={{marginLeft : "-30px", marginRight : "-15px", position : "absolute", top : "-45%", zIndex : 1}} >
                                                <img src={data.bus480A.busB.closed ? BusTieOn : BusTieOff}/>
                                            </div>
                                        </Col>
                                        <Col xs={4}>
                                            <div style={{display:"flex", flexDirection : "column", alignItems : "flex-end", position : "absolute", right : "30px", textAlign : "right", top : "10px", zIndex : 1, fontWeight : "bold"}} >
                                                <div style={{padding : "5px 10px"}}>BUS B 280/120VAC</div>
                                                <EarthFault faulted={data.busB208.fault}/>
                                            </div>
                                            <div style={{height : "5px", width : "100%", backgroundColor : bus280BColor, marginBottom:"0"}}>
                                                &nbsp;
                                            </div>
                                        </Col>
                                        <Col xs={3}>
                                            <div style={{display:"flex", flexDirection : "column", alignItems : "flex-end", position : "absolute", right : "0", textAlign : "right", top : "10px", zIndex : 1, fontWeight : "bold"}} >
                                                <div style={{padding : "5px 10px"}}>E-Bus 280/120VAC</div>
                                                <EarthFault faulted={data.ebus208.fault}/>
                                            </div>
                                            <div style={{height : "5px", width : "100%", backgroundColor : ebus208Color, marginBottom:"0"}}>
                                                &nbsp;
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </SideBar>
        )
    }
    renderMD() {
        if (this.state.data === undefined || this.state.data === null) {
            return (<></>)
        }
        var data = this.state.data
        var bar600Color = "grey"
        if (data.bus600.hasPower) {
            bar600Color = "#66cc33"
        }
        var bus480AColor = "grey"
        if (data.bus480A.hasPower) {
            bus480AColor = "#66cc33"
        }
        var bus480BColor = "grey"
        if (data.bus480B.hasPower) {
            bus480BColor = "#66cc33"
        }
        var bus280AColor = "grey"
        if (data.busA208.hasPower) {
            bus280AColor = "#66cc33"
        }
        var bus280BColor = "grey"
        if (data.busB208.hasPower) {
            bus280BColor = "#66cc33"
        }
        var ebus480Color = "grey"
        if (data.egen.hasPower) {
            ebus480Color =  "#66cc33"
        }
        var ebus208Color = "grey"
        if (data.ebus208.hasPower) {
            ebus208Color =  "#66cc33"
        }
        var ebus280bus280Color = "grey"
        if (data.ebus208.busB.closed && data.busB280.eBus.closed) {
            ebus280bus280Color =  "#66cc33"
        }
        var ebus480bus480Color = "grey"
        if (data.egen.busB.closed && data.bus480B.egen.closed) {
            ebus480bus480Color =  "#66cc33"
        }
        var fontSizeStyle={
            fontSize : this.props.renderFor === 2 ? "0.5rem" : this.props.renderFor === 1 ? "0.5rem" : "1rem",
            lineHeight : this.props.renderFor === 2 ? "0.5rem" : this.props.renderFor === 1 ? "0.5rem" : "1rem",
        }
        return (
            <>
            <Row>
                <Col xs={{span : 12}} style={fontSizeStyle}>
                    <Row>
                        <Col xs={{span : 12, offset : 0}} className="whiteHeading2" style={{textAlign : "center"}}>
                            POWER MANAGEMENT SYSTEM - POWER DISTRIBUTION
                        </Col>
                    </Row>
                    <Row style={{marginTop : "10px"}}>
                        <Col xs={{span : 12}}>
                            <div className="whiteBG" style={{backgroundColor : "white"}}>
                                <Row>
                                    <Col><BreakerWithMotor data={data.engine1} name="G1"/></Col>
                                    <Col><BreakerWithMotor data={data.engine2} name="G2"/></Col>
                                    <Col><BreakerWithMotor data={data.engine3} name="G3"/></Col>
                                    <Col><BreakerWithMotor data={data.engine4} name="G4"/></Col>
                                    <Col><BreakerWithMotor data={data.engine5} name="G5"/></Col>
                                </Row>
                                <Row noGutters={true} >
                                    <Col>
                                        <div style={{position : "absolute", right : "30px", textAlign : "right", top : "10px", zIndex : 1, fontWeight : "bold", display : this.props.renderFor !== 0 ? "flex" : ''}} >
                                            <div style={{padding : "5px 10px"}}>BUS 600V</div>
                                            <EarthFault faulted={data.bus600.fault}/>
                                        </div>
                                        <div style={{height : "5px", width : "100%", backgroundColor : bar600Color, marginBottom:"0"}}>
                                            &nbsp;
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginTop : "0"}}>
                        <Col xs={{span : 12}}>
                            <div className="whiteBG" style={{backgroundColor : "white"}}>
                                <Row >
                                    <Col xs={{span : 1, offset : 1}}>
                                        <Breaker closed={data.bus600.t1.closed} tripped={data.bus600.t1.tripped}/>
                                    </Col>
                                    <Col xs={{span : 1, offset : 1}}>
                                        <Breaker closed={data.bus600.jackingMcc.fwd.closed} tripped={data.bus600.jackingMcc.fwd.tripped}/>
                                    </Col>
                                    <Col xs={1}>
                                        <Breaker closed={data.bus600.jackingMcc.stbd.closed} tripped={data.bus600.jackingMcc.stbd.tripped}/>
                                    </Col>
                                    <Col xs={1}>
                                        <Breaker closed={data.bus600.jackingMcc.port.closed} tripped={data.bus600.jackingMcc.port.tripped}/>
                                    </Col>
                                    <Col xs={{span : 1, offset : 1}}>
                                        <Breaker closed={data.bus600.t2.closed} tripped={data.bus600.t1.tripped}/>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginTop : "0"}}>
                        <Col xs={{span : 12}}>
                            <div className="whiteBG" style={{backgroundColor : "white", textAlign : "center"}}>
                                <Row >
                                    <Col xs={{span : 1, offset : 1}} style={{backgroundColor : "white", zIndex : 1}}>
                                        <Row noGutters={true}>
                                            <Col xs={3} style={{display : "flex", alignItems : "center"}}>T1</Col>
                                            <Col xs={6}><img src={DeltaTransformer} style={{marginTop : "-50%"}}/></Col>
                                        </Row>
                                    </Col>
                                    <Col xs={1}  style={{display : "flex", alignItems : "center"}} className="powerGaugeUnit">
                                        <span style={{ color : "#2d63f7", marginRight : "5px"}} className="powerGaugeValue">{this.padDigits(data.t1.power.toFixed(0),4)}</span> kW
                                    </Col>
                                    <Col xs={1}>
                                        JACKING MCC FWD
                                    </Col>
                                    <Col xs={1}>
                                        JACKING MCC STBD
                                    </Col>
                                    <Col xs={1}>
                                        JACKING MCC PORT
                                    </Col>
                                    <Col xs={{span : 1, offset : 1}} style={{backgroundColor : "white", zIndex : 1}}>
                                        <Row noGutters={true}>
                                            <Col xs={3} style={{display : "flex", alignItems : "center"}}>T2</Col>
                                            <Col xs={6}><img src={DeltaTransformer} style={{marginTop : "-50%"}}/></Col>
                                        </Row>
                                    </Col>
                                    <Col xs={1}  style={{display : "flex", alignItems : "center"}} className="powerGaugeUnit">
                                        <span style={{ color : "#2d63f7", marginRight : "5px"}} className="powerGaugeValue">{this.padDigits(data.t2.power.toFixed(0),4)}</span> kW
                                    </Col>
                                    <Col xs={{span : 1, offset : 1}}>
                                        <div style={{left : "12.5%", right : "12.5%", position : "absolute", bottom : 0}}>
                                            <GeneratorStatus name="EG" status={data.egen.status}/>
                                        </div>
                                    </Col>
                                    <Col xs={{span : 1}}>
                                        SHORE CONNECTION
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginTop : "0"}}>
                        <Col xs={{span : 12}}>
                            <div className="whiteBG" style={{backgroundColor : "white", textAlign : "center"}}>
                                <Row >
                                    <Col xs={{span : 1, offset : 1}}>
                                        <div style={{marginTop : "0"}}>
                                            <Breaker closed={data.bus480A.t1.closed} tripped={data.bus480A.t1.tripped}/>
                                        </div>
                                    </Col>
                                    <Col xs={{span : 1, offset : 5}}>
                                        <div style={{marginTop : "0"}}>
                                            <Breaker closed={data.bus480B.t2.closed} tripped={data.bus480B.t2.tripped}/>
                                        </div>
                                    </Col>
                                    <Col xs={1}>
                                    <div style={{position : "absolute", top : 0, left : "50%", right : 0, backgroundColor : ebus480bus480Color, height : "3px"}} />
                                        <div style={{marginTop : "0"}}>
                                            <Breaker closed={data.bus480B.egen.closed} tripped={data.bus480B.egen.tripped}/>
                                        </div>
                                    </Col>
                                    <Col xs={1}>
                                    <div style={{position : "absolute", top : 0, right : "50%", left : 0, backgroundColor : ebus480bus480Color, height : "3px"}} />
                                        <div style={{marginTop : "0"}}>
                                            <Breaker closed={data.egen.busB.closed} tripped={data.egen.busB.tripped}/>
                                        </div>
                                    </Col>
                                    <Col xs={1}>
                                        <div style={{marginTop : "0"}}>
                                            <Breaker closed={data.egen.egen.closed} tripped={data.egen.egen.tripped}/>
                                        </div>
                                    </Col>
                                    <Col xs={1}>
                                        <div style={{marginTop : "0"}}>
                                            <Breaker closed={data.egen.shore.closed} tripped={data.egen.shore.tripped}/>
                                        </div>
                                    </Col>
                                </Row>
                                <Row >
                                    <Col xs={4}>
                                        <div style={{position : "absolute", right : "30px", textAlign : "right", top : "10px", zIndex : 1, fontWeight : "bold"}} >
                                            <div style={{padding : "5px 10px"}}>BUS A 480V</div>
                                            <EarthFault faulted={data.bus480A.fault}/>
                                        </div>
                                        <div style={{height : "5px", width : "100%", backgroundColor : bus480AColor, marginBottom:"0"}}>
                                            &nbsp;
                                        </div>
                                    </Col>
                                    <Col xs={1}>
                                        <div style={{marginLeft : "-30px", marginRight : "-15px", position : "absolute", top : "-45%", zIndex : 1}} >
                                            <img src={data.bus480A.busB.closed ? BusTieOn : BusTieOff} style={{marginTop : "-26%"}}/>
                                        </div>
                                    </Col>
                                    <Col xs={4}>
                                        <div style={{position : "absolute", right : "30px", textAlign : "right", top : "10px", zIndex : 1, fontWeight : "bold"}} >
                                            <div style={{padding : "5px 10px"}}>BUS B 480V</div>
                                            <EarthFault faulted={data.bus480B.fault}/>
                                        </div>
                                        <div style={{height : "5px", width : "100%", backgroundColor : bus480BColor, marginBottom:"0"}}>
                                            &nbsp;
                                        </div>
                                    </Col>
                                    <Col xs={3}>
                                        <div style={{position : "absolute", right : "0", textAlign : "right", top : "10px", zIndex : 1, fontWeight : "bold"}} >
                                            <div style={{padding : "5px 10px"}}>E-Bus 480V</div>
                                            <EarthFault faulted={data.egen.fault}/>
                                        </div>
                                        <div style={{height : "5px", width : "100%", backgroundColor : ebus480Color, marginBottom:"0"}}>
                                            &nbsp;
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginTop : "0"}}>
                        <Col xs={{span : 12}}>
                            <div className="whiteBG" style={{backgroundColor : "white", textAlign : "center"}}>
                                <Row >
                                    <Col xs={{span : 1, offset : 0}}>
                                        <Breaker closed={data.bus480A.t3.closed} tripped={data.bus480A.t3.tripped}/>
                                    </Col>
                                    <Col xs={{span : 1, offset : 0}}>
                                        <Breaker closed={data.bus480A.Drillfloor.feeder.closed} tripped={false}/>
                                    </Col>
                                    <Col xs={{span : 1, offset : 3}}>
                                        <Breaker closed={data.bus480B.hvac.closed} tripped={data.bus480B.hvac.tripped}/>
                                    </Col>
                                    <Col xs={{span : 1, offset : 0}}>
                                        <Breaker closed={data.bus480B.t4.closed} tripped={data.bus480B.t4.tripped}/>
                                    </Col>
                                    <Col xs={{span : 1, offset : 3}}>
                                        <Breaker closed={data.egen.t5.closed} tripped={data.egen.t5.tripped}/>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginTop : "0"}}>
                        <Col xs={{span : 12}}>
                            <div className="whiteBG" style={{backgroundColor : "white", textAlign : "center"}}>
                                <Row >
                                    <Col xs={{span : 1, offset : 0}}>
                                        <Row noGutters={true}>
                                            <Col xs={3} style={{display : "flex", alignItems : "center"}}>T3</Col>
                                            <Col xs={6} style={{backgroundColor : "white", zIndex : 1}}><img src={StarDeltaTransformer} style={{marginTop : "-50%"}}/></Col>
                                        </Row>
                                    </Col>
                                    <Col xs={{span : 1, offset : 0}}>
                                        <div style={{marginTop : "-50%"}}>
                                            <Breaker closed={data.bus480A.Drillfloor.mcc.closed} tripped={false}/>
                                        </div>
                                    </Col>
                                    <Col xs={{span : 1, offset : 3}}>
                                        VENT MCC 480V
                                    </Col>
                                    <Col xs={{span : 1, offset : 0}}>
                                        <Row noGutters={true}>
                                            <Col xs={3} style={{display : "flex", alignItems : "center"}}>T4</Col>
                                            <Col xs={6} style={{backgroundColor : "white", zIndex : 1}}><img src={StarDeltaTransformer} style={{marginTop : "-50%"}}/></Col>
                                        </Row>
                                    </Col>
                                    <Col xs={{span : 1, offset : 3}}>
                                        <Row noGutters={true}>
                                            <Col xs={3} style={{display : "flex", alignItems : "center"}}>T5</Col>
                                            <Col xs={6} style={{backgroundColor : "white", zIndex : 1}}><img src={StarDeltaTransformer} style={{marginTop : "-50%"}}/></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginTop : "0"}}>
                        <Col xs={{span : 12}}>
                            <div className="whiteBG" style={{backgroundColor : "white", textAlign : "center"}}>
                                <Row >
                                    <Col xs={{span : 1, offset : 0}}>
                                        <div style={{marginTop : "-50%"}}>
                                            <Breaker closed={data.busA208.t3.closed} tripped={data.busA208.t3.tripped}/>
                                        </div>
                                    </Col>
                                    <Col xs={{span : 1, offset : 0}}>
                                        DRILLFLOOR MCC 480V
                                    </Col>
                                    <Col xs={{span : 1, offset : 4}}>
                                        <div style={{marginTop : "-50%"}}>
                                            <Breaker closed={data.busB208.t4.closed} tripped={data.busB208.t4.tripped}/>
                                        </div>
                                    </Col>
                                    <Col xs={{span : 1, offset : 1}}>
                                        <div style={{marginTop : "-50%"}}>
                                            <div style={{position : "absolute", left : "50%", right : 0, backgroundColor : ebus280bus280Color, height : "3px"}} />
                                            <Breaker closed={data.busB208.busTie.closed} tripped={data.busB208.busTie.tripped}/>
                                        </div>
                                    </Col>
                                    <Col xs={{span : 1, offset : 0}}>
                                        <div style={{marginTop : "-50%"}}>
                                            <div style={{position : "absolute", right : "50%", left : 0, backgroundColor : ebus280bus280Color, height : "3px"}} />
                                            <Breaker closed={data.ebus208.busB.closed} tripped={data.ebus208.busB.tripped}/>
                                        </div>
                                    </Col>
                                    <Col xs={{span : 1, offset : 0}}>
                                        <div style={{marginTop : "-50%"}}>
                                            <Breaker closed={data.ebus208.t5.closed} tripped={data.ebus208.t5.tripped}/>
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor : "white", height : "80px"}}>
                                    <Col xs={4}>
                                        <div style={{display:"flex", flexDirection : "column", alignItems : "flex-end", position : "absolute", right : "30px", textAlign : "right", top : "10px", zIndex : 1, fontWeight : "bold"}} >
                                            <div style={{padding : "5px 10px"}}>BUS A 280/120VAC</div>
                                            <EarthFault faulted={data.busA208.fault}/>
                                        </div>
                                        <div style={{height : "5px", width : "100%", backgroundColor : bus280AColor, marginBottom:"0"}}>
                                            &nbsp;
                                        </div>
                                    </Col>
                                    <Col xs={1}>
                                        <div style={{marginLeft : "-30px", marginRight : "-15px", position : "absolute", top : "-45%", zIndex : 1}} >
                                            <img src={data.bus480A.busB.closed ? BusTieOn : BusTieOff}/>
                                        </div>
                                    </Col>
                                    <Col xs={4}>
                                        <div style={{display:"flex", flexDirection : "column", alignItems : "flex-end", position : "absolute", right : "30px", textAlign : "right", top : "10px", zIndex : 1, fontWeight : "bold"}} >
                                            <div style={{padding : "5px 10px"}}>BUS B 280/120VAC</div>
                                            <EarthFault faulted={data.busB208.fault}/>
                                        </div>
                                        <div style={{height : "5px", width : "100%", backgroundColor : bus280BColor, marginBottom:"0"}}>
                                            &nbsp;
                                        </div>
                                    </Col>
                                    <Col xs={3}>
                                        <div style={{display:"flex", flexDirection : "column", alignItems : "flex-end", position : "absolute", right : "0", textAlign : "right", top : "10px", zIndex : 1, fontWeight : "bold"}} >
                                            <div style={{padding : "5px 10px"}}>E-Bus 280/120VAC</div>
                                            <EarthFault faulted={data.ebus208.fault}/>
                                        </div>
                                        <div style={{height : "5px", width : "100%", backgroundColor : ebus208Color, marginBottom:"0"}}>
                                            &nbsp;
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            </>
        )
    }
    render() {
        var contents = this.renderLG()
        if (this.props.renderFor === 1) {
            contents = this.renderMD()
        }
        if (this.props.renderFor === 2) {
            contents = this.renderMD()
        }
        return (
            <div className="content-inner-all">
            <Container fluid={true}>
                {contents}
            </Container>
            </div>)
    }
}

export default withLayoutManager(PowerDistribution);