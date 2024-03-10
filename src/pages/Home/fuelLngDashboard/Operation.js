
import React from 'react';
import { Row, Col} from 'react-bootstrap'
import DashboardCard from '../../../components/DashboardCard/DashboardCard'
import FullScreenSpinner from '../../../components/FullScreenSpinner/FullScreenSpinner'
import Divider from '@material-ui/core/Divider';
import './Operation.css'
import operationLogo from '../../../assets/FuelLngDashboard/operationIcon.jpg'
import FuelLng from '../../../model/FuelLng';
class OperationCard extends React.Component {
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
                        <div style={{paddingTop : "15px"}}>OPERATION</div>
                    </Col>
                </Row>
                <Row className="grow">
                    <Col>
                        <div className="contentBGColor" style={{padding : "10px", margin : "10px", textAlign : "center", display : "flex"}}>
                            <Row className="grow">
                                <Col xs={7}>
                                    <Row noGutters={true}>
                                        <Col className="column" style={{justifyContent : "center"}}>
                                            <img src={operationLogo} style={{maxWidth : "50%", alignSelf : "center"}}></img>
                                        </Col>
                                        <Col className="column">
                                            <Row><Col className="cardHeader">Monthly percentage of deliveries on time</Col></Row>
                                            <Row className="grow"><Col className="cardValue column">{kpis.monthlyDeliveriesOnTime.toFixed(2)}%</Col></Row>
                                        </Col>
                                    </Row>
                                </Col>
                                <Divider orientation="vertical" flexItem className="secondaryBlueColor"/>
                                <Col className="column">
                                    <Row><Col className="cardHeader">Monthly percentage of deliveries in full</Col></Row>
                                    <Row className="grow"><Col className="cardValue column">{kpis.monthlyDeliveryInFull.toFixed(2)}%</Col></Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row className="grow">
                    <Col className="column">
                        <div className="contentBGColor grow justifyStart column" style={{padding : "10px", margin : "0 10px", textAlign : "center"}}>
                            <Row><Col className="cardHeader">Delivery Temperature Met</Col></Row>
                            <Row className="grow"><Col className="cardValue column">{kpis.deliveryTempMet.toFixed(2)}%</Col></Row>
                        </div>
                    </Col>
                </Row>
                <Row className="grow" noGutters={true}>
                    <Col>
                        <div className="contentBGColor justifyStart column" style={{padding : "10px", margin : "10px", textAlign : "center"}}>
                            <Row><Col className="cardHeader">Monthly percentage of bunkering speeds met</Col></Row>
                            <Row className="grow"><Col className="cardValue column">{kpis.monthlyBunkeringSpeedMet.toFixed(2)}%</Col></Row>
                        </div>
                    </Col>
                    <Col>
                        <div className="contentBGColor justifyStart column" style={{padding : "10px", margin : "10px", textAlign : "center"}}>
                            <Row><Col className="cardHeader">Monthly percentage of loading pumping speeds met</Col></Row>
                            <Row className="grow"><Col className="cardValue column">{kpis.monthlyLoadingPumpingSpeedMet.toFixed(2)}%</Col></Row>
                        </div>
                    </Col>
                </Row>
                <Row className="grow" noGutters={true}>
                    <Col>
                        <div className="contentBGColor justifyStart column" style={{padding : "10px", margin : "0 10px 10px 10px", textAlign : "center"}}>
                            <Row><Col className="cardHeader">Timeliness of delivery of bunkering report</Col></Row>
                            <Row className="grow"><Col className="cardValue column">{kpis.timlinessOfBDNDelivery.toFixed(2)}%</Col></Row>
                        </div>
                    </Col>
                    <Col>
                        <div className="contentBGColor justifyStart column" style={{padding : "10px", margin : "0 10px 10px 10px", textAlign : "center"}}>
                            <Row><Col className="cardHeader">Loadings perform within terminal booked berthing slot</Col></Row>
                            <Row className="grow"><Col className="cardValue column">{kpis.loadingsPerformedWithinBookedSlot.toFixed(2)}%</Col></Row>
                        </div>
                    </Col>
                </Row>
                </div>
            </DashboardCard>
        )
    }
}
export default OperationCard