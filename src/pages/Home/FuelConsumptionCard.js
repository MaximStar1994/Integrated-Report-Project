import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DashboardCard from '../../components/DashboardCard/DashboardCard'
import RigApi from '../../model/Rig'
import MyBarChart from '../../components/BarChart/BarChart';
import "./Home.css"
//import '../../css/Dashboard.css';

class ActiveAlarmCard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            currentFuel : 0,
            barchartData : []
        };
        this.rigApi = new RigApi()
        this.interval = undefined
    }
    parseInput(input) {
        if (input === undefined) {
            return 0 
        }
        return input.toFixed(2)
    }

    updateValues() {
        this.rigApi.GetFuelTrend((trend) => {
            if (trend === null) {
                return
            }
            var data = []
            trend.forEach((trendIt) => {
                data.push({
                    name : trendIt.day,
                    value : trendIt.fuelConsumed 
                })
            });
            this.setState({barchartData : data})
        })
        this.rigApi.GetRigEnvironment((data) => {
            if (data === null) {
                return
            }
            this.setState({currentFuel : data.Current_Month_Fuel_Consumption})
        })
    }
    componentDidMount() {
        this.updateValues()
        this.interval = setInterval(this.updateValues.bind(this), 1000 * 60 * 60);
    }
    componentWillUnmount() {
        if (this.interval !== undefined) {
            clearInterval(this.interval);
        }
    }
    render() {
        var currentFuelConsumption = this.state.currentFuel 
        if (currentFuelConsumption === undefined) {
            currentFuelConsumption = 0
        }
        return (
            <DashboardCard >
                <Row style={{alignItems : "center", height: "100%"}}>
                    <Col style={{height : "100%", display : "flex", flexDirection : "column"}}>
                        <Row> 
                            <Col xs={12} style={{textAlign : "center"}}>
                                <div className = "blueHeading5">
                                    Engine Fuel Consumption (L)
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} style={{textAlign : "center"}}>
                                <div className = "whiteHeading3">
                                    {currentFuelConsumption}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} style={{textAlign : "center"}}>
                                <div className = "blueSubHeading2">
                                    Today's Consumption
                                </div>
                            </Col>
                        </Row>
                        <Row className="flex-grow-1">
                            <Col xs={{span : 12}}>
                                <MyBarChart data={this.state.barchartData} ></MyBarChart>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </DashboardCard>
        )
    }
  }

export default ActiveAlarmCard;
