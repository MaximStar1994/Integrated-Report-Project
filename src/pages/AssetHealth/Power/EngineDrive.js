import React from 'react';
import SideBar from '../../../components/SideBar/SideBar'
import { Row , Col, Container} from 'react-bootstrap'
import Asset from '../../../model/Asset.js'
import SemiCircleGauge from '../../../components/Gauge/SemiCircleGauge'
import SimpleValueCard from './SimpleValueCard'

import LEDGreen from '../../../assets/Icon/LEDGreen.png'
import LEDBlue from '../../../assets/Icon/LEDBlue.png'
import AlarmOff from '../../../assets/Icon/ClearRoundIndicator.png'
import AlarmOn from '../../../assets/Icon/RedRoundIndicator.png'

import {withLayoutManager} from '../../../Helper/Layout/layout'
// engineNo
class EngineDrive extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.engineNo = this.props.match.params.engineNo
        this.state = {};
        this.assetController = new Asset()
    }

    componentDidMount() {
        this.assetController.GetEngineDetails(this.engineNo, (data,err)=>{
            this.setState({
                data : data,
                engineReadyImg : data.ready ? LEDGreen : LEDBlue
            })
        })
    }

    renderAlarmsRow() {
        if (this.state.data === undefined) {
            return (<></>)
        }
        var engineData = this.state.data
        return (
            <Row style={{marginTop : "10px"}}>
                <Col>
                <div className="containerBGcolor" style={{marginLeft : "10px", marginRight : "10px", padding : "10px"}}>
                    <Row>
                        <Col>
                            <div style={{textAlign : "center"}} className="blueHeading3">
                                <img src={this.state.engineReadyImg} alt="" style={{width : "5%"}}></img>
                                <span style={{paddingLeft : "5px"}}>Engine Ready</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {engineData.alarms.map((alarm,i) => 
                        <Col key={i} xs={3}>
                            <div style={{padding : "10px 0", display : "flex"}} className="blueSubHeading3">
                                <img src={alarm.value ? AlarmOn : AlarmOff} alt="" style={{width : "10%", alignSelf : "start"}}></img>
                                <span style={{paddingLeft : "5px", alignSelf : "center"}}>{alarm.display}</span>
                            </div>
                        </Col>
                        )}
                    </Row>
                </div>
                </Col>
            </Row>
        )
    }

    renderDetailRow() {
        if (this.state.data === undefined) {
            return (<></>)
        }
        var engineData = this.state.data
        return (
            <Row style={{marginTop : "10px"}}>
                <Col xs={4}>
                <div className="containerBGcolor" style={{marginLeft : "10px", paddingTop : "10px", paddingBottom : "10px", height : "100%"}}>                    
                    <Row noGutters={true} style={{height: "100%", alignContent : "center"}}>
                        {engineData.details.map((detail,i) => 
                        <Col key={i} xs={6} style={{paddingTop : "5px", paddingBottom : "5px", paddingLeft : "10px", paddingRight : "10px",  display : "flex", flexDirection : "column"}}>
                           <SimpleValueCard label={detail.display} value={detail.value} unit={detail.units} dp={detail.value > 10000000 ? 5 : 2} toExponentialForm={detail.value > 10000000}/>
                        </Col>
                        )}
                    </Row>
                </div>
                </Col>
                <Col xs={5}>
                <div className="containerBGcolor" style={{paddingLeft : "10px", paddingRight : "10px", paddingTop : "10px", paddingBottom : "10px",height : "100%"}}>                    
                    <Row style={{marginLeft : "-10px", marginRight : "-10px", height: "100%", alignContent : "center"}}>
                        {engineData.pressure.map((pressure,i) => 
                        <Col xs={4} key={i} style={{paddingTop : "5px", paddingBottom : "5px", display : "flex", flexDirection : "column"}}>
                           <SimpleValueCard label={pressure.display} value={pressure.value} unit={pressure.units} dp={3}/>
                        </Col>
                        )}
                        <div className="flex-grow-2" style={{flexGrow : 1}}></div>
                    </Row>
                </div>
                </Col>
                <Col xs={3}>
                <div className="containerBGcolor" style={{marginRight : "10px",  paddingTop : "10px", paddingBottom : "10px", height : "100%"}}>                    
                    <Row noGutters={true}>
                        {engineData.turbo.map((turbo,i) => 
                        <Col key={i} xs={12} style={{paddingTop : "5px", paddingBottom : "5px", paddingLeft : "10px", paddingRight : "10px", alignSelf : "flex-end"}}>
                           <SimpleValueCard label={turbo.display} value={turbo.value} unit={turbo.units}/>
                        </Col>
                        )}
                    </Row>
                </div>
                </Col>
            </Row>
        )
    }

    renderTemperatureRow() {
        if (this.state.data === undefined) {
            return (<></>)
        }
        var engineData = this.state.data
        return (
            <Row style={{marginTop : "10px"}}>
                <Col xs={3}>
                <div className="containerBGcolor" style={{marginLeft : "10px", paddingTop : "10px", paddingBottom : "10px", height : "100%"}}>                    
                    <Row noGutters={true}>
                        {engineData.temperatureSumary.map((tempSummary,i) => 
                        <Col key={i} xs={6} style={{paddingTop : "5px", paddingBottom : "5px", paddingLeft : "10px", paddingRight : "10px", alignSelf : "flex-end"}}>
                           <SimpleValueCard label={tempSummary.display} value={tempSummary.value} unit={'\u2103'}/>
                        </Col>
                        )}
                    </Row>
                </div>
                </Col>
                <Col xs={9}>
                <div className="containerBGcolor" style={{paddingLeft : "10px", paddingRight : "10px", marginRight : "10px", paddingTop : "10px", paddingBottom : "10px"}}>                    
                    <Row style={{marginLeft : "-10px", marginRight : "-10px"}}>
                        {this.props.renderFor === 0 ? engineData.temperatures.filter((temp) => {return temp.display !== "Thermocouple 00"}).map((temp,i) => 
                        <div key={i} style={{paddingTop : "5px", paddingBottom : "5px", paddingLeft : "10px", paddingRight : "10px", width : "11.111%", alignSelf : "flex-end"}}>
                           <SimpleValueCard label={temp.display} value={temp.value} unit={'\u2103'}/>
                        </div>
                        ) : engineData.temperatures.filter((temp) => {return temp.display !== "Thermocouple 00"}).map((temp,i) => 
                        <div key={i} style={{paddingTop : "5px", paddingBottom : "5px", paddingLeft : "10px", paddingRight : "10px", width : "20%", alignSelf : "flex-end"}}>
                           <SimpleValueCard label={temp.display} value={temp.value} unit={'\u2103'}/>
                        </div>)
                        }
                        <div className="flex-grow-2" style={{flexGrow : 1}}></div>
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
        var engineData = this.state.data
        var rowData = []
        var rowIndex = ["activePower", "reactivePower","voltage","speed","frequency"]
        var rowUnit = ["kW", "kVAR","Volt","RPM","Hz"]
        var rowLabel = ["Active Power", "Reactive Power","Voltage","Speed","Frequency"]
        rowIndex.forEach((idx,i) => {
            var max = 2000
            var min = 0
            if (idx === "voltage") {
                max = 800
            }
            if (idx === "speed") {
                max = 1600
            }
            if (idx === "frequency") {
                max = 67
                min = 55
            }
            rowData.push(
                {
                    max : max,
                    min : min,
                    data : [{value: parseFloat(engineData[idx]), color : "black"}]
                }
            )
        })
        return (
            <Row style={{marginTop : "10px"}}>
                <Col>
                    <div className="containerBGcolor" style={{marginLeft : "10px", marginRight : "10px", paddingTop : "10px", paddingBottom : "10px"}}>
                    <Row>
                        <Col xs={{span : 10, offset : 1}}>
                            <Row>
                                {rowData.map((gaugeData,idx) => 
                                    <Col key={idx}>
                                        <Row>
                                            <Col>
                                            <SemiCircleGauge data={gaugeData.data} maxVal={gaugeData.max} minVal={gaugeData.min}></SemiCircleGauge>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="whiteSubHeading2" style={{textAlign : "center", padding : "5px"}}>{rowUnit[idx]}</Col>
                                        </Row>
                                        <Row>
                                            <Col className="whiteSubHeading1" style={{textAlign : "center"}}>{rowLabel[idx]}</Col>
                                        </Row>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                    </div>
                </Col>
            </Row>
        )
    }
    
    render() {
        if (this.props.renderFor !== 0) {
            return (
                <>
                <Row>
                    <Col> <div className="whiteHeading1" style={{textAlign : "center"}}>Generator {this.engineNo}</div></Col>
                </Row>
                {this.renderGaugesRow()}
                {this.renderAlarmsRow()}
                {this.renderTemperatureRow()}
                {this.renderDetailRow()}
                </>
            )
        }
        return (
            <div className="content-inner-all">
            <Container fluid={true}>
            <SideBar>
                <Row>
                    <Col> <div className="whiteHeading1" style={{textAlign : "center"}}>Generator {this.engineNo}</div></Col>
                </Row>
                {this.renderGaugesRow()}
                {this.renderAlarmsRow()}
                {this.renderTemperatureRow()}
                {this.renderDetailRow()}
            </SideBar>
            </Container>
            </div>
        );
    }
}

export default withLayoutManager(EngineDrive);
