import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DashboardCard from '../../components/DashboardCard/DashboardCard'
import CompositionCircleProgressBar from '../../components/CircularProgressBar/CompositionCircleProgressBar'
import RigApi from '../../model/Rig'
class ActiveAlarmCard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            currentStatus : {currentStatus : "" , status : -1},
            renderFor : 0
        };
        this.rigApi = new RigApi()
    }
    parseInput(input) {
        if (input === undefined) {
            return 0 
        }
        return input.toFixed(2)
    }
    updateSize = () => {
        var width = window.innerWidth
        if (window.orientation === 90) {
            if (navigator.userAgent.match(/Android/) === null) {
                // android's innerheight has issues
                width = window.innerHeight
            }
        }
        if (width >= 1200) {
            this.setState({ renderFor : 0})
        } else if (width >= 768) {
            this.setState({ renderFor : 1})
        } else {
            this.setState({ renderFor : 2})
        }
    }
    componentDidMount() {
        this.updateSize()
        window.addEventListener('resize', this.updateSize);
        window.addEventListener("orientationchange", this.updateSize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateSize);
        window.removeEventListener('orientationchange', this.updateSize);
    }
    render() {
        return (
            <DashboardCard >
                <Row style={{alignItems : "center", height: "100%"}}>
                    <Col style={{height : "100%", display : "flex", flexDirection : "column"}}>
                        <Row style={{marginTop : "15px"}}>
                            <Col xs={12} style={{textAlign : "center"}}>
                                <div className = "blueHeading2">
                                   Survey State
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} style={{textAlign : "center"}}>
                                <div className = "blueHeading1" 
                                style={{textAlign : "center",padding : this.state.renderFor == 0 ? "20px" : "5px"}}>
                                    Digital Class Survey
                                </div>
                            </Col>
                        </Row>
                        <Row >
                            <Col xs={{span : 10, offset : 1}}>
                                <CompositionCircleProgressBar dataArr={[]}>
                                        <div style={{backgroundColor : "#0a182a", width : "100%", borderRadius : "50%", padding : "30px", marginBottom : "5px"}}>
                                        </div>
                                        <div className = "blueHeading2" style={{textAlign : "center"}}>
                                            Last Surveyed
                                        </div>
                                </CompositionCircleProgressBar>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} style={{textAlign : "center"}}>
                                <div className = "blueSubHeading" style={{textAlign : "center", padding: this.state.renderFor == 0 ? "20px" : "5px"}}>
                                    Smart Notation MHM
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </DashboardCard>
        )
    }
  }

export default ActiveAlarmCard;
