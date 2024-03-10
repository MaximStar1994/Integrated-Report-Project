import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap';
import { withLayoutManager } from '../../Helper/Layout/layout'
import VesselReportLogo from '../../assets/KST/VesselReport.png'
import VesselDisinfectionLogo from '../../assets/KST/Disinfection.png'
import CrewTempLogo from '../../assets/KST/TemperatureReport.png'
import VesselBreakdownLogo from '../../assets/KST/VesselBreakdown.png'
import CrewWorkRestLogo from '../../assets/KST/CrewWorkAndRestHour.png';
import { withAuthManager } from '../../Helper/Auth/auth';
import AuthorizedBackDatedApi from "../../model/AuthorizedBackDatedApi";
import './Home.css'
import { Link } from "react-router-dom";
class OperationHomeDash extends React.Component {
    constructor() {
        super();
        this.authorizedBackDatedApi = new AuthorizedBackDatedApi();
        this.state = {
            backDatedVesselReportObj: {
                title: "Back Dated Vessel Report",
                category: "Operation",
                imgUrl: VesselReportLogo,
                desc: "BackDated Vessel Report Form",
                redirectUrl: `/vesselreport/true`,
              },
            managementAppList: [
                {
                    title: 'Vessel Downtime',
                    category: 'Operation',
                    imgUrl: VesselBreakdownLogo,
                    desc: 'Vessel Downtime Record Form',
                    redirectUrl: '/vesselbreakdowntable/false'
                }
            ],
            vesselAppList: [
                {
                    title: 'Vessel Report',
                    category: 'Operation',
                    imgUrl: VesselReportLogo,
                    desc: 'Vessel Report Form',
                    redirectUrl: '/vesselreport/false'
                },
                {
                    title: 'Daily Temperature Report',
                    category: 'Operation',
                    imgUrl: CrewTempLogo,
                    desc: 'Crew Daily Temperature Report Form',
                    redirectUrl: '/crewtemperaturereport'
                },
                {
                    title: 'Vessel Disinfection Record',
                    category: 'Operation',
                    imgUrl: VesselDisinfectionLogo,
                    desc: 'Vessel Disinfection Record Form',
                    redirectUrl: '/disinfectionrecord'
                },
                {
                    title: 'Vessel Downtime',
                    category: 'Operation',
                    imgUrl: VesselBreakdownLogo,
                    desc: 'Vessel Downtime Record Form',
                    redirectUrl: '/vesselbreakdowntable/false'
                },
                {
                    title: 'Seafarer\'s Hours Of Rest',
                    category: 'Asset Management',
                    imgUrl: CrewWorkRestLogo,
                    desc: 'Seafarer\'s Record Of Hours Of Rest',
                    redirectUrl: '/crewworkandresthour'
                },
                {
                    title: 'Offline Vessel Report',
                    category: 'Operation',
                    imgUrl: VesselReportLogo,
                    desc: 'Offline Workflow',
                    redirectUrl: '/offlinevesselreport'
                }
            ]
        }
    }

    getList = () => {
        if(JSON.parse(localStorage.getItem('user')).accountType.toLowerCase() === 'management'){
            if(this.props.selectedVessel.vessel_id!=="0"){
                return this.state.managementAppList;
            }
            else{
                return [];
            }
        }
        else if(JSON.parse(localStorage.getItem('user')).accountType.toLowerCase() === 'vessel'){
            return this.state.vesselAppList;
        }
        else if(JSON.parse(localStorage.getItem('user')).accountType.toLowerCase() === 'admin'){
            return this.state.managementAppList.concat(this.state.vesselAppList);
        }
        else{
            return [];
        }
    }
    componentDidMount() {
        //Commenting now Backdated App screen for production and enable to UAT
        this.isAuthorizedBackDatedDataAvailable();
    }
    
    isAuthorizedBackDatedDataAvailable = async () => {
        try {
          var vesselId = JSON.parse(localStorage.getItem("user")).vessels[0].vesselId;
          var fetchBackDatedListByVesselId = await this.authorizedBackDatedApi.isAuthorizedBackDatedDataAvailable(vesselId);
    
          if (fetchBackDatedListByVesselId.length > 0) {
            this.state.vesselAppList.push(this.state.backDatedVesselReportObj);
            this.setState({
              vesselAppList: [...this.state.vesselAppList],
            });
          }
        } catch (error) {
          console.log(error);
        }
    };
    render() {
        return (
            <Container fluid className="appContainer">
                <Row>
                    {this.getList().map((post, i) =>
                        <Col sm={4} md={4} lg={3} xl={2} key={i} >
                            <Link to={post.redirectUrl}>
                                <Card className="appCard" style={{backgroundColor: post.redirectUrl === '/offlinevesselreport' ? "#000" : post.redirectUrl === '/vesselreport/true' ? '#ed7d31' : "#04588e"}}>
                                    <div>
                                        <div className="app_cat" ><span>{post.category}</span></div>
                                        <div className="app_title">{post.title}</div>
                                        <img className="app_img" src={post.imgUrl} alt={post.title} style={{ backgroundSize: 'contain' }} />
                                        <div className="app_desc" >{post.desc}</div>
                                    </div>
                                </Card>
                            </Link>
                        </Col>
                    )}
                </Row>
            </Container>)
    }

}
export default withAuthManager(withLayoutManager(OperationHomeDash))