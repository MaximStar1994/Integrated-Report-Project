import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DashboardCard from '../../components/DashboardCard/DashboardCard'
import CompositionCircleProgressBar from '../../components/CircularProgressBar/CompositionCircleProgressBar'
import RigApi from '../../model/Rig'

class HealthProjectionCard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            projection : 0
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
        this.rigApi.GetRigHealthProjection((val,err) => {
            if (val !== null) {
                this.setState({projection : val.value})
            }
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
        return (
            <DashboardCard >
                <Row style={{alignItems : "center", height: "100%"}}>
                    <Col>
                        <Row>
                            <Col xs={12} style={{textAlign : "center"}}>
                                <div className = "blueHeading2" style={{padding : "10px"}}>
                                    Health Projection
                                </div>
                            </Col>
                        </Row>
                        <Row >
                            <Col xs={{span : 12}}>
                                <div style={{padding: "20px 20px 20px 20px"}}>
                                    <CompositionCircleProgressBar 
                                    dataArr={[
                                        {percentage : 0, color : "#00ff00"}
                                    ]}>
                                        <div className = "whiteHeading1" style={{textAlign: 'center', padding : "10px"}}>
                                            {this.state.projection}%
                                        </div>
                                        <div className="blueHeading3" style={{textAlign : "center"}}>
                                            Assets With Extended Overhaul Possibility
                                        </div>
                                    </CompositionCircleProgressBar>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </DashboardCard>
        )
    }
  }

export default HealthProjectionCard;
