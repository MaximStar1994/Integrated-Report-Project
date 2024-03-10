
import React from 'react';
import { Row, Col} from 'react-bootstrap'
import DashboardCard from '../../../components/DashboardCard/DashboardCard'
import FullScreenSpinner from '../../../components/FullScreenSpinner/FullScreenSpinner'
import Divider from '@material-ui/core/Divider';
import './Operation.css'

import safetyIcon from '../../../assets/FuelLngDashboard/SafetyIcon.jpg'
import accidentCountIcon from '../../../assets/FuelLngDashboard/accidentCountIcon.jpg'
import FuelLng from '../../../model/FuelLng';
class SafetyCard extends React.Component {
    constructor(props,context) {
        super(props,context)
        this.fuelLngApi = new FuelLng()
        this.state = {
            kpi : undefined
        }
    }
    componentDidMount() {
        this.fuelLngApi.GetKpi((kpi,err) => {
            if (kpi != null) {
                this.setState({kpi : kpi})
            }
        })
    }
    render() {
        var kpis = this.state.kpi 
        if (this.state.kpi == undefined) {
            return (<FullScreenSpinner />)
        }
        return (
            <DashboardCard> 
                <div className="operationCard" style={{display: "flex", flexDirection : "column"}}>
                <Row>
                    <Col style={{textAlign : "center"}}>
                        <div style={{paddingTop : "15px"}}>SAFETY</div>
                    </Col>
                </Row>
                <Row className="grow">
                    <Col>
                        <div className="contentBGColor" style={{padding : "10px", margin : "5px 10px", textAlign : "center", display : "flex", width: "100%"}}>
                            <Row className="grow" noGutters={true}>
                                <Col className="column" xs={3}>
                                    <img src={safetyIcon} style={{maxWidth : "40%", alignSelf : "center"}}></img>
                                </Col>
                                <Col className="column" xs={3}>
                                    <Row><Col className="cardHeader"><div style={{padding : "5px"}}>LTIF</div></Col></Row>
                                    <Row className="grow"><Col className="cardValue column">{kpis.LTIF.toFixed(0)}</Col></Row>
                                </Col>
                                <Divider orientation="vertical" flexItem className="secondaryBlueColor"/>
                                <Col className="column" xs={3}>
                                    <Row><Col className="cardHeader"><div style={{padding : "5px"}}>Near miss</div></Col></Row>
                                    <Row className="grow"><Col className="cardValue column">{kpis.nearMiss.toFixed(0)}</Col></Row>
                                </Col>
                                <Divider orientation="vertical" flexItem className="secondaryBlueColor"/>
                                <Col className="column">
                                    <Row><Col className="cardHeader"><div style={{padding : "5px"}}>Rate of accident</div></Col></Row>
                                    <Row className="grow"><Col className="cardValue column">{kpis.accidentRate.toFixed(0)}</Col></Row>
                                </Col>
                                
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row className="grow" noGutters={true}>
                    <Col>
                        <div className="contentBGColor justifyStart column" style={{padding : "10px", margin : "10px", textAlign : "center", width : "100%"}}>
                            <Row><Col className="cardHeader">Yearly number of internal audit</Col></Row>
                            <Row className="grow"><Col className="cardValue column">{kpis.noOfInternalAudit.toFixed(0)}</Col></Row>
                        </div>
                    </Col>
                    <Col>
                        <div className="contentBGColor justifyStart column" style={{padding : "10px", margin : "10px", textAlign : "center", width : "100%"}}>
                            <Row><Col className="cardHeader">Rate of observations per inspection</Col></Row>
                            <Row className="grow"><Col className="cardValue column">{kpis.rateOfObsPerInspection.toFixed(2)}</Col></Row>
                        </div>
                    </Col>
                </Row>
                <Row className="grow" noGutters={true}>
                    <Col xs={8}>
                        <div className="contentBGColor justifyStart column" style={{padding : "10px", margin : "10px", textAlign : "center", width : "100%"}}>
                            <Row className="grow" >
                                <Col className="column">
                                    <Row>
                                        <Col>
                                            <img src={accidentCountIcon} style={{maxWidth : "50%", alignSelf : "center"}}></img>
                                        </Col>
                                    </Row>
                                    <Row style={{marginTop : "10px"}}><Col className="cardHeader">Accident Counter</Col></Row>
                                </Col>
                                <Col className="column" >
                                    <Row className="grow">
                                        <Col className="column" >
                                            <Row><Col className="cardHeader">Cargo</Col></Row>
                                            <Row className="grow"><Col className="cardValue column">{kpis.cargoAccident.toFixed(0)}</Col></Row>
                                        </Col>
                                    </Row>
                                    <Divider className="secondaryBlueColor" style={{margin : "5px 0"}}/>
                                    <Row className="grow" >
                                        <Col className="column">
                                            <Row><Col className="cardHeader">Navigational</Col></Row>
                                            <Row className="grow"><Col className="cardValue column">{kpis.navigationalAccident.toFixed(0)}</Col></Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col>
                        <div className="contentBGColor justifyStart column" style={{padding : "10px", margin : "10px", textAlign : "center", width : "100%"}}>
                            <Row><Col className="cardHeader">Environmental Incident</Col></Row>
                            <Row className="grow"><Col className="cardValue column">{kpis.environmentalIncident}</Col></Row>
                        </div>
                    </Col>
                </Row>
                </div>
            </DashboardCard>
        )
    }
}
export default SafetyCard