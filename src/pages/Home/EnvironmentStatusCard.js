import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DashboardCardWithHeader from '../../components/DashboardCard/DashboardCardWithHeader'
import RigApi from '../../model/Rig'
import KeppelGauge from '../../components/Gauge/Gauge';

class EnvironmentCondition extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            environmentData : undefined
        };
        this.rigApi = new RigApi();
        this.interval = undefined
    }
    parseInput(input) {
        if (input === undefined) {
            return 0 
        } else {
            input = parseFloat(input)
        }
        return input.toFixed(2)
    }
    updateValues() {
        this.rigApi.GetRigEnvironment((val,err) => {
            this.setState({
                environmentData : val
            })
        })
    }
    componentDidMount() {
        this.updateValues()
        this.interval = setInterval(this.updateValues.bind(this), 10000);
    }
    componentWillUnmount() {
        if (this.interval !== undefined) {
            clearInterval(this.interval);
        }
    }

    render() {
        var data = this.state.environmentData
        if (data === undefined || data === null) {
            return (<></>)
        }
        return (
            <DashboardCardWithHeader title="Environment Condition">
                <Row noGutters style={{display : "flex", alignItems: "center", height : "100%"}} >
                    <Col style={{paddingTop : "15px", paddingBottom : "15px"}}>
                        <Row noGutters style={{textAlign : "center"}}>
                            <Col>
                                <div className="blueSubHeading2">
                                    Wave Max. Height
                                </div>
                            </Col>
                            <Col>
                                <div className="blueSubHeading2" style={{border : "1px solid #8400ff"}}>
                                    Wind Direction
                                </div>
                            </Col>
                            <Col>
                                <div className="blueSubHeading2" style={{border : "1px solid #0b8aba"}}>
                                    Current Direction
                                </div>
                            </Col>
                        </Row>
                        <Row noGutters style={{textAlign : "center", paddingTop : "5px"}}>
                            <Col>
                                <div className="whiteSubHeading">
                                    {this.parseInput(data.Wave_Maximum_height)}m
                                </div>
                            </Col>
                            <Col>
                                <div className="whiteSubHeading" >
                                    {this.parseInput(data.Anemometer_1_Wind_direction)}&#176;
                                </div>
                            </Col>
                            <Col>
                                <div className="whiteSubHeading">
                                    {this.parseInput(data.Water_Current_direction)}&#176;
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={{span : 6, offset : 3}}>
                                <KeppelGauge maxVal={360} minVal={0} data={[
                                    {value : data.Anemometer_1_Wind_direction, color : "#8400ff"},
                                    {value : data.Water_Current_direction, color : "#0b8aba"}
                                ]} />
                            </Col>
                        </Row>
                        <Row noGutters style={{textAlign : "center"}}>
                            <Col>
                                <div className="blueSubHeading2">
                                    Wave Period
                                </div>
                            </Col>
                            <Col>
                                <div className="blueSubHeading2">
                                    Wind Speed
                                </div>
                            </Col>
                            <Col>
                                <div className="blueSubHeading2">
                                    Current Speed
                                </div>
                            </Col>
                        </Row>
                        <Row noGutters style={{textAlign : "center", paddingTop : "5px"}}>
                            <Col>
                                <div className="whiteSubHeading">
                                    {this.parseInput(data.Wave_period)}s
                                </div>
                            </Col>
                            <Col>
                                <div className="whiteSubHeading" >
                                    {this.parseInput(data.Anemometer_1_Wind_Speed)}kts
                                </div>
                            </Col>
                            <Col>
                                <div className="whiteSubHeading">
                                    {this.parseInput(data.Water_Current_speed)}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </DashboardCardWithHeader>
        )
    }
  }

export default EnvironmentCondition;
