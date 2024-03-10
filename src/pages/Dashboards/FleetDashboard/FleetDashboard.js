
import React, {Component} from 'react';
import './FleetDashboard.css';
import FleetDashboardApi from '../../../model/FleetDashboard';
import { Container, Row, Col, } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import {withMessageManager} from '../../../Helper/Message/MessageRenderer'
import { withRouter } from "react-router-dom"
import DailyPerformance from './DailyPerformance';
import FleetDowntime from './FleetDowntime';
import DashboardSpinner from '../DashboardSpinner';
import { withAuthManager } from '../../../Helper/Auth/auth';
import moment from 'moment';
import HelpIcon from "@material-ui/icons/HelpOutlineOutlined";
class FleetDashboard extends Component {
    constructor(){
        super();
        this.fleetDashboardApi = new FleetDashboardApi();
        this.state={
            loaded: false,
            isSubmit: false,
            dailyPerformance: {
                operation: 0,
                proceed: 0,
                standby: 0,
                date: null
            },
            downtime: {
                breakdownDataMonth: null,
                breakdownDataYear: null,
                lastMonthTopContributers: [],
                downtime: []
            },
            fleets: [
                {name: 'KST31', am: true, pm: false},
                {name: 'KST32', am: false, pm: false},
                {name: 'KST33', am: false, pm: false},
                {name: 'KST34', am: false, pm: false},
                {name: 'KST35', am: false, pm: false},
                {name: 'KST36', am: false, pm: false},
                {name: 'KST37', am: false, pm: false},
                {name: 'KST38', am: false, pm: false},
                {name: 'KST39', am: false, pm: false},
                {name: 'KST10', am: false, pm: false},
                {name: 'KST11', am: false, pm: false},
                {name: 'KST12', am: false, pm: false},
                {name: 'KST13', am: false, pm: false},
                {name: 'KST14', am: false, pm: false},
                {name: 'KST15', am: false, pm: false},
                {name: 'KST16', am: false, pm: false},
                {name: 'KST17', am: false, pm: false},
                {name: 'KST18', am: false, pm: false},
                {name: 'KST19', am: false, pm: false},
                {name: 'KST20', am: false, pm: false},
                {name: 'KST21', am: false, pm: false},
                {name: 'KST22', am: false, pm: false},
                {name: 'KST23', am: false, pm: false},
                {name: 'KST24', am: false, pm: false},
                {name: 'KST25', am: false, pm: false},
            ],
            fleetStatusDate: null,
        }
    }
    async getData(){
        let today = moment();
        if(moment().isBefore(
            moment().set('hour', 8).set('minute', 30).set('second', 0).set('millisecond', 0)
        )){
            today.subtract(1, 'day');
        }
        let data = await this.fleetDashboardApi.GetFleetDashboardData({today: today.format('DD-MM-YYYY')});
        this.setState({ dailyPerformance: data.dailyPerformance, downtime: data.downtime, fleets: data.fleets, fleetStatusDate: data.fleetStatusDate, loaded: true })
    }
    componentDidMount(){
        this.getData();
    }
    fleetReportStatusInfo = (props) => {
        const statusInfo = (
            <Popover ref={props.ref} id="statusInfoID">
                <Popover.Title style={{fontSize: "15px",textAlign: "center"}}>Status Info</Popover.Title>
                <Popover.Content>
                    <p style={{fontSize: "12px"}}>
                        &nbsp;&nbsp;The rectangle vessel box is highlighted  with red border when there is a breakdown case in open status,
                        pending management user to follow up to close it.  
                        <br /><br />
                        &nbsp;&nbsp;The AM and PM Circles indicates red to show the un-timeliness of vessel report submission. 
                        For morning shift if not submitted by 2030, AM circle will light up, till submission is received.  
                        <br /><br />
                        &nbsp;&nbsp;For evening shift if not submitted by 0730(next day), PM circle will light up,
                        till submission is received. 
                        <br /><br />
                        &nbsp;All circle indications reset at 830am every day.
                    </p>
                </Popover.Content>
            </Popover>
        );
        return statusInfo;
    };
    render(){
        return(
            <Container fluid className='FleetDashboard'>
                {this.state.loaded===true?
                    <Row>
                        <Col xs={12} lg={6}>
                            <Row>
                                <Col className="FleetDashboardCard">
                                    <DailyPerformance data={this.state.dailyPerformance} />
                                </Col>
                            </Row>
                            <Row>
                                <Col className="FleetDashboardCard">
                                    <FleetDowntime data={this.state.downtime} />
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12} lg={6} className="FleetDashboardCard">
                        <div className="Heading" style={{justifyContent: "space-between"}}>
                            <div>Fleet Reporting Status ({this.state.fleetStatusDate})</div>
                            <OverlayTrigger trigger={['hover','hover']} placement='bottom' overlay={this.fleetReportStatusInfo(this.props)}>    
                                <HelpIcon style={{ cursor: "pointer", width: "1.9rem", height: "1.9rem", color: "#7F7F7F",opacity: "0.7" }} />
                            </OverlayTrigger>        
                        </div>
                            <Row>
                                <Col lg={4} md={6}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ padding: '0.5rem 0rem', flexGrow: '1' }} />
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '2rem', width: '2rem', color: '#9B9595', backgroundColor: 'rgba(0,0,0,0)', marginRight: "10px", marginLeft: '10px' }}>AM</div>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '2rem', width: '2rem', color: '#9B9595', backgroundColor: 'rgba(0,0,0,0)' }}>PM</div>
                                    </div>    
                                </Col>
                                <Col lg={4} md={6} className="d-none d-md-block">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ padding: '0.5rem 0rem', flexGrow: '1' }} />
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '2rem', width: '2rem', color: '#9B9595', backgroundColor: 'rgba(0,0,0,0)', marginRight: "10px", marginLeft: '10px' }}>AM</div>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '2rem', width: '2rem', color: '#9B9595', backgroundColor: 'rgba(0,0,0,0)' }}>PM</div>
                                    </div>    
                                </Col>
                                <Col lg={4} className="d-none d-lg-block">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ padding: '0.5rem 0rem', flexGrow: '1' }} />
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '2rem', width: '2rem', color: '#9B9595', backgroundColor: 'rgba(0,0,0,0)', marginRight: "10px", marginLeft: '10px' }}>AM</div>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '2rem', width: '2rem', color: '#9B9595', backgroundColor: 'rgba(0,0,0,0)' }}>PM</div>
                                    </div>    
                                </Col>
                            </Row>
                            <Row>
                                {this.state.fleets.map((element, idx)=> 
                                    <Col lg={4} md={6} key={idx}>
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem', height: '80%' }}>
                                                <div className="VesselSelectionName" style={{ border: element.status===true?'3px solid #FC5151':'3px solid #9B9595', color: element.status===true?'#FC5151':'#9B9595' }} 
                                                    onClick={()=>{
                                                        let userData = this.props.user;
                                                        if(userData?.vesselList){
                                                            localStorage.setItem('selectedVessel', JSON.stringify(this.props.user.vesselList.filter(filterElement => filterElement.vessel_id === element.id)[0]));
                                                            this.props.setSelectedVessel(this.props.user.vesselList.filter(filterElement => filterElement.vessel_id === element.id)[0])
                                                            this.props.history.push('/vesselbreakdowntable/false')    
                                                        }
                                                    }
                                                }>
                                                    {element.name}
                                                </div>
                                                <div className="VesselSelectionIndication" style={{ backgroundColor: element.am===true?'#FC5151':'rgba(0,0,0,0)', marginRight: "10px", marginLeft: '10px' }} />
                                                <div className="VesselSelectionIndication" style={{ backgroundColor: element.pm===true?'#FC5151':'rgba(0,0,0,0)' }} />
                                            </div>    
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                :
                    <DashboardSpinner />
                }
            </Container>
        );
    }

}

export default withAuthManager(withRouter(withMessageManager(FleetDashboard)));