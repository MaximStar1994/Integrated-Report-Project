import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DashboardCard from '../../components/DashboardCard/DashboardCard'
import RigApi from '../../model/Rig'
import MyBarChart from '../../components/BarChart/BarChart';

class ActiveAlarmCard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            activeAlarmCount : 0,
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
        this.rigApi.GetAlarmTrend((trend) => {
            if (trend === null) {
                return
            }
            var data = []
            trend.forEach((trendIt) => {
                data.push({
                    name : trendIt.month,
                    value : trendIt.activeAlarm 
                })
            });
            this.setState({barchartData : data})
        })
        this.rigApi.GetActiveAlarmCount((data) => {
            if (data === null) {
                return
            }
            this.setState({activeAlarmCount : data.Active_Alarm_count})
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
        var totalActiveAlarm = this.state.activeAlarmCount 
        if (totalActiveAlarm === undefined) {
            totalActiveAlarm = 0
        }
        return (
            <DashboardCard >
                <Row style={{alignItems : "center", height: "100%"}}>
                    <Col style={{height : "100%", display : "flex", flexDirection : "column"}}>
                        <Row>
                            <Col xs={12} style={{textAlign : "center"}}>
                                <div className = "blueHeading5">
                                    Total Active Alarm
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} style={{textAlign : "center"}}>
                                <div className = "whiteHeading3">
                                    {totalActiveAlarm}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} style={{textAlign : "center"}}>
                                <div className = "blueSubHeading2">
                                    Current Alarm Count
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
