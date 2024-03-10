import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DashboardCard from '../../components/DashboardCard/DashboardCard'
import RigApi from '../../model/Rig'
import RigElevated from '../../assets/RigElevated.png'
import RigAfloat from '../../assets/RigAfloat.png'
class ActiveAlarmCard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            currentStatus : {currentStatus : "" , status : -1}
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
        this.rigApi.GetRigStatus((data) => {
            if (data === null) {
                return
            }
            this.setState({currentStatus : data})
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
        return (
            <DashboardCard >
                <Row style={{alignItems : "center", height: "100%"}}>
                    <Col style={{height : "100%", display : "flex", flexDirection : "column"}}>
                        <Row style={{marginTop : "15px"}}>
                            <Col xs={12} style={{textAlign : "center"}}>
                                <div className = "blueHeading2">
                                   Rig State
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} style={{textAlign : "center"}}>
                                <div className = "whiteHeading2" style={{textAlign : "center",padding : "20px"}}>
                                    {this.state.currentStatus.currentStatus}
                                </div>
                            </Col>
                        </Row>
                        <Row >
                            <Col xs={{span : 12}}>
                                {this.state.currentStatus == "Afloat" ? 
                                <img alt="Rig Afloat" src={RigAfloat} className="img-responsive"/>
                                :
                                <img alt="Rig elevated" src={RigElevated} className="img-responsive"/>}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </DashboardCard>
        )
    }
  }

export default ActiveAlarmCard;
