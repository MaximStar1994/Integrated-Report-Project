import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DashboardCardWithHeader from '../../components/DashboardCard/DashboardCardWithHeader'
import RigApi from '../../model/Rig'

import RigImage from '../../assets/RigLogo.png'
class RigDurationCard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            onSiteDurationHrs : 0,
            drillOperationHours : 0,
            renderFor : 0
        };
        this.rigApi = new RigApi()
        this.interval = undefined
    }
    parseInput(input) {
        if (input === undefined) {
            return 0 
        }
        return input.toFixed(0)
    }
    updateValues() {
        this.rigApi.GetRigDuration((val,err) => {
            if (val=== null) {
                return
            }
            this.setState({
                onSiteDurationHrs : this.parseInput(val.onSiteDurationHrs),
                drillOperationHours : this.parseInput(val.drillOperationHours)
            })
        })
    }
    componentDidMount() {
        this.updateValues()
        this.interval = setInterval(this.updateValues.bind(this), 1000 * 60 * 60);
        this.updateSize();
        window.addEventListener('resize', this.updateSize);
        window.addEventListener("orientationchange", this.updateSize);
    }
    componentWillUnmount() {
        if (this.interval !== undefined) {
            clearInterval(this.interval);
        }
        window.removeEventListener('resize', this.updateSize);
        window.removeEventListener('orientationchange', this.updateSize);
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
    render() {
        var drillingPer = (this.state.drillOperationHours / this.state.onSiteDurationHrs * 100).toFixed(2)
        return (
            <DashboardCardWithHeader title="Site Duration Performance">
                <Row style={{display: "flex", alignItems : "center", height : "100%"}}>
                    <Col xs={{span : 6, offset : 0}} >
                        <img src={RigImage} alt="Rig" style={{ marginLeft : "40%", width : "120%", maxWidth : "none", marginTop : this.state.renderFor == 2 ? "20px" : "", marginBottom : this.state.renderFor == 2 ? "20px" : ""}}/>
                    </Col>
                    <Col xs={{span : 6, offset : 0}} style={{paddingLeft : "30px"}}>
                        <Row>
                            <Col>
                                <div className = "whiteHeading1">
                                    {drillingPer}%
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="whiteHeading2" style={{paddingTop : this.state.renderFor == 2 ? "20px" : "50px"}}>
                                    {this.state.drillOperationHours}hrs
                                </div>
                                <div className="blueSubHeading" style={{textAlign : "left", paddingTop : "10px"}}>
                                    Drilling Operation
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="whiteHeading2" style={{paddingTop : "30px"}}>
                                    {this.state.onSiteDurationHrs}hrs
                                </div>
                                <div className="blueSubHeading" style={{textAlign : "left", paddingTop : "10px"}}>
                                    On Site Duration
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </DashboardCardWithHeader>
        )
    }
  }

export default RigDurationCard;
