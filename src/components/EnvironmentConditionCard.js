import React from 'react';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import KeppelGauge from './Gauge/Gauge.js'

import Tag from '../model/Tag.js'
class EnvironmentConditionCard extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { 
            waveMaxHeight : 2.87,
            windDirection : 62.0,
            currentDirection : 0,
            waveSpeed : 3.0,
            currSpeed : 0,
            wavePeriod : 1.81,
            windSpeed : 4.0,
        };
        this.tagController = new Tag()
        this.tagController.MonitorValue("ns=2;s=TestChannel.Device1.TestTag",(data) => {
            let oldState = this.state
            oldState.currentDirection = data
            this.setState(oldState)
        })
        this.tagController.MonitorValue("ns=2;s=TestChannel.Device1.CurrSpeed",(data) => {
            let oldState = this.state
            oldState.currSpeed = data
            this.setState(oldState)
        })
        this.tagController.MonitorValue("ns=2;s=TestChannel.Device1.TestTag2",(data) => {
            let oldState = this.state
            oldState.windDirection = data
            this.setState(oldState)
        })
        this.tagController.MonitorValue("ns=2;s=TestChannel.Device1.WaveMaxHeight",(data) => {
            let oldState = this.state
            oldState.waveMaxHeight = data
            this.setState(oldState)
        })
        this.tagController.MonitorValue("ns=2;s=TestChannel.Device1.WavePeriod",(data) => {
            let oldState = this.state
            oldState.wavePeriod = data
            this.setState(oldState)
        })
        this.tagController.MonitorValue("ns=2;s=TestChannel.Device1.WindSpeed",(data) => {
            let oldState = this.state
            oldState.windSpeed = data
            this.setState(oldState)
        })
    }
    
    ParseNumber = (num) => {
        return num.toFixed(2)
    }

    render() {
      return (<Container>
                <Row style={{paddingTop : "10px"}}>
                    <Col xs={4} className = "EnvironmenConditionHeader">
                        Wave Max. Height
                    </Col>
                    <Col xs={4} className = "EnvironmenConditionHeader SelectedEnvironment">
                        Wind Direction
                    </Col>
                    <Col xs={4} className = "EnvironmenConditionHeader CurrDirectionEnvironmentLabel">
                        Current Direction
                    </Col>
                </Row>
                <Row>
                    <Col xs={4} className="EnvironmentConditionVal">
                        {this.ParseNumber(this.state.waveMaxHeight)}m
                    </Col>
                    <Col xs={4} className="EnvironmentConditionVal">
                        {this.ParseNumber(this.state.windDirection)}{'\u00b0'}
                    </Col>
                    <Col xs={4} className="EnvironmentConditionVal">
                        {this.ParseNumber(this.state.currentDirection)}{'\u00b0'}
                    </Col>
                </Row>
                <Row>
                    <Col xs={{span : 8, offset : 2}}>
                        <KeppelGauge maxVal={360} minVal={0} 
                                    data={[ {value : this.state.currentDirection , color : "#11a1a1"},
                                            {value : this.state.windDirection , color : "#8400ff"}]}>
                        </KeppelGauge>
                    </Col>
                </Row>
                <Row style={{paddingTop : "10px"}}>
                    <Col xs={4} className = "EnvironmenConditionHeader">
                        Wave Period
                    </Col>
                    <Col xs={4} className = "EnvironmenConditionHeader">
                        Wind Speed
                    </Col>
                    <Col xs={4} className = "EnvironmenConditionHeader">
                        Current Speed
                    </Col>
                </Row>
                <Row style={{paddingBottom : "10px"}}>
                    <Col xs={4} className="EnvironmentConditionVal">
                        {this.ParseNumber(this.state.wavePeriod)}s
                    </Col>
                    <Col xs={4} className="EnvironmentConditionVal">
                        {this.ParseNumber(this.state.windSpeed)}kts
                    </Col>
                    <Col xs={4} className="EnvironmentConditionVal">
                        {this.ParseNumber(this.state.currSpeed)}
                    </Col>
                </Row>
                </Container>        
                )
    }
  }

export default EnvironmentConditionCard;