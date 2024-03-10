
import React from 'react';
import { Row, Col} from 'react-bootstrap'
import DashboardCard from '../../../components/DashboardCard/DashboardCard'
import FullScreenSpinner from '../../../components/FullScreenSpinner/FullScreenSpinner'
import Divider from '@material-ui/core/Divider';
import vesselImage from '../../../assets/FuelLngDashboard/fuelLNGDashVesselpict.jpg'
import reliabilityIcon from '../../../assets/FuelLngDashboard/reliabilityIcon.jpg'
import CompositionCircleProgressBar from '../../../components/CircularProgressBar/CompositionCircleProgressBar'
import FuelLng from '../../../model/FuelLng';
import './Operation.css'
class ReliabilityCard extends React.Component {
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
                        <div style={{paddingTop : "15px"}}>RELIABILITY</div>
                    </Col>
                </Row>
                <Row className="grow">
                    <Col>
                        <div className="contentBGColor" style={{padding : "10px", margin : "5px 10px", textAlign : "center", display : "flex", width: "100%"}}>
                            <Row className="grow">
                                <Col xs={7}>
                                    <Row noGutters={true}>
                                        <Col className="column" style={{justifyContent : "center"}}>
                                            <img src={reliabilityIcon} style={{maxWidth : "40%", alignSelf : "center"}}></img>
                                        </Col>
                                        <Col className="column">
                                            <Row><Col className="cardHeader">Cargo operation monthly stoppages</Col></Row>
                                            <Row className="grow"><Col className="cardValue column">{kpis.cargoOperationMonthlyStopage.toFixed(0)}</Col></Row>
                                        </Col>
                                    </Row>
                                </Col>
                                <Divider orientation="vertical" flexItem className="secondaryBlueColor"/>
                                <Col className="column">
                                    <Row><Col className="cardHeader">Downtime during navigation</Col></Row>
                                    <Row className="grow"><Col className="cardValue column">{kpis.downtimeDuringNavigation.toFixed(2)}%</Col></Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row className="grow">
                    <Col className="column">
                        <Row><Col className="cardHeader" style={{textAlign : "center", padding : "10px"}}>Vessel Availability</Col></Row>
                        <Row className="grow">
                            <Col>
                            <div style={{position:"absolute", width : "20%", left : "15%", top : "0", height : "100%", display : "flex", alignItems : "center"}}>
                                <CompositionCircleProgressBar 
                                dataArr={[
                                    {percentage : kpis.vesselAvailability, color : "#14C3CE"}
                                ]}>
                                    <div className = "cardValue cardValueSmaller" style={{textAlign: 'center', padding : "10px"}}>
                                        {kpis.vesselAvailability.toFixed(2)}%
                                    </div>
                                </CompositionCircleProgressBar>
                            </div>
                            <img src={vesselImage} style={{maxWidth : "100%"}}></img>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="grow">
                    <Col className="column">
                        <div className="contentBGColor grow justifyStart column" style={{padding : "10px", margin : "5px 10px", textAlign : "center"}}>
                            <Row className="grow">
                                <Col className="cardHeader column">Monthly overdue PMS items</Col>
                                <Col className="cardValue column">{kpis.monthlyOverduePMSItems.toFixed(2)}%</Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row className="grow" noGutters={true}>
                    <Col>
                        <div className="contentBGColor justifyStart column" style={{padding : "10px", margin : "5px 10px", textAlign : "center", display : "flex", width : "100%"}}>
                            <Row>
                                <Col style={{display : "flex", justifyContent : "center"}}>
                                    <div className="grow" style={{display : "flex"}}><Divider className="fullWidthDivider secondaryBlueColor"/></div>
                                    <div className="cardHeader">TMSA3</div>
                                    <div className="grow" style={{display : "flex"}}><Divider className="fullWidthDivider secondaryBlueColor"/></div>
                                </Col>
                            </Row>
                            <Row style={{marginTop : "10px", flexGrow : 1}}>
                                <Col style={{display : "flex"}}>
                                    <Row className="grow" noGutters={true}>
                                        <Col className="column">
                                            <Row><Col className="cardHeader">Element 4 and 4A</Col></Row>
                                            <Row className="grow"><Col className="cardValue cardValueSmaller column">{kpis.tmsaElm4}</Col></Row>
                                        </Col>
                                        <Divider orientation="vertical" flexItem className="secondaryBlueColor"/>
                                        <Col className="column">
                                            <Row><Col className="cardHeader">Element 5</Col></Row>
                                            <Row className="grow"><Col className="cardValue cardValueSmaller column">{kpis.tmsaElm5}</Col></Row>
                                        </Col>
                                        <Divider orientation="vertical" flexItem className="secondaryBlueColor"/>
                                        <Col className="column">
                                            <Row><Col className="cardHeader">Element 6 and 6A</Col></Row>
                                            <Row className="grow"><Col className="cardValue cardValueSmaller column">{kpis.tmsaElm6}</Col></Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                </div>
            </DashboardCard>
        )
    }
}
export default ReliabilityCard