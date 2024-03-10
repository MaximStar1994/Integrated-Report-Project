import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap';
import { withLayoutManager } from '../../Helper/Layout/layout'
import CrewPlannerLogo from '../../assets/KST/CrewPlanner.png';
import SignupLogo from '../../assets/KST/Info.png';
import ChatManagerLogo from '../../assets/Keppel_ContactUs_Media.png';
import HealthCheckLogo from '../../assets/KST/HealthCheck.png';
import UnlockLogo from '../../assets/KST/unlock.png'
import UnlockAppApi from '../../model/UnlockAppApi';
import ConfirmUnlock from './ConfirmUnlock';
import './Home.css';
import { Link } from "react-router-dom";
import { withAuthManager } from '../../Helper/Auth/auth';
import { withMessageManager } from '../../Helper/Message/MessageRenderer';
import BackDatedLogo from "../../assets/KST/VesselReport.png";
import VesselBreakdownLogo from "../../assets/KST/VesselBreakdown.png";

class AssetManagementHomePage extends React.Component {
    constructor() {
        super();
        this.unlockAppApi = new UnlockAppApi();
        this.state = {
            confirmStatus: false,
            showConfirm: false,
            adminAppList: [
                {
                    title: 'Signup',
                    category: 'Asset Management',
                    imgUrl: SignupLogo,
                    desc: 'User Management',
                    redirect: true,
                    redirectUrl: '/signup'
                },
                {
                    title: 'Chat Manager',
                    category: 'Asset Management',
                    imgUrl: ChatManagerLogo,
                    desc: 'Chat Management',
                    redirect: true,
                    redirectUrl: '/chatmanager'
                },
                {
                    title: 'Health Check',
                    category: 'Asset Management',
                    imgUrl: HealthCheckLogo,
                    desc: 'Health Check App',
                    redirect: true,
                    redirectUrl: '/healthcheck'
                },
                {
                    title: 'Unlock App',
                    category: 'Asset Management',
                    imgUrl: UnlockLogo,
                    desc: 'Unlock App',
                    redirect: true,
                    redirectUrl: '/unlockapp'
                },
            ],
            managementAppList: [
                {
                    title: 'Crew Planning',
                    category: 'Asset Management',
                    imgUrl: CrewPlannerLogo,
                    desc: 'Crew Planning Form',
                    redirect: true,
                    redirectUrl: '/crewplanning'
                },
                // {
                //     title: "Backdated control",
                //     category: "Asset Management",
                //     imgUrl: BackDatedLogo,
                //     desc: "Backdated control app",
                //     redirect: true,
                //     redirectUrl: "/backdatedcontrol",
                //   }
                // {
                //     title: 'Crew Work and Rest Hour Update',
                //     category: 'Asset Management',
                //     imgUrl: CrewWorkRestUpdateLogo,
                //     desc: 'Crew Work and Rest Hour Update',
                //     redirectUrl: '/crewworkandresthourupdate'
                // },
                // {
                //     title: 'Crew Work and Rest Hour',
                //     category: 'Asset Management',
                //     imgUrl: CrewWorkRestLogo,
                //     desc: 'Crew Work and Rest Hour',
                //     redirectUrl: '/crewworkandresthour'
                // }
            ],
            vesselAppList: [
                {
                    title: 'Unlock Vessel Report',
                    category: 'Asset Management',
                    imgUrl: UnlockLogo,
                    desc: 'Unlock Vessel Report Form',
                    redirect: false,
                    trigger: this.unlockVesselReportApp
                },
            ],
            backdatedControlApp: [
                {
                  title: "Backdated vessel report",
                  category: "Asset Management",
                  imgUrl: BackDatedLogo,
                  desc: "Vessel report control app",
                  redirect: true,
                  redirectUrl: "/backdatedcontrol",
                }
            ],
            vesselDowntimeControlApp: [
                {
                    title: 'Vessel downtime control',
                    category: 'Asset Management',
                    imgUrl: VesselBreakdownLogo,
                    desc: 'Vessel downtime control app',
                    redirect: true,
                    redirectUrl: '/vesselbreakdowntable/true'
                },
            ]
        }
    }

    unlockVesselReportApp = async() => {
        this.setState({ confirmStatus: true })
        try{
            let temp = await this.unlockAppApi.UnlockApp(this.props.selectedVessel.vessel_id, 'VESSELREPORT');
            if(temp === true){
                let temp2 = await this.unlockAppApi.UnlockApp(this.props.selectedVessel.vessel_id, 'DAILYLOG');
                if(temp2 === true){
                    this.props.setMessages([{type : "success", message : "Unlocked!"}]);
                }
            }
            this.setState({ confirmStatus: false });
        }
        catch(e){
            console.log(e);
            this.setState({ confirmStatus: false });
            this.props.setMessages([{type : "danger", message : "Unable to Unlock App!"}]);
        }
    }
    
    getList = () => {
        if (JSON.parse(localStorage.getItem("user")).accountType.toLowerCase() === "management") {
            var accountApps = JSON.parse(localStorage.getItem("user")).accountApps;
            var managementApps = this.state.managementAppList;
            //Currently commenting backdated control apps for management users as informed by mani na for production and enable to UAT
            if (accountApps && accountApps.length > 0) {
                if (accountApps.filter((acc) => acc.app === 'Vessel Breakdown').length > 0) {
                    managementApps = managementApps.concat(this.state.vesselDowntimeControlApp)
                }
                if (accountApps.filter((acc) => acc.app === 'Vessel Report').length > 0) {
                    managementApps = managementApps.concat(this.state.backdatedControlApp)
                }
          }
          return managementApps;
        } else if (JSON.parse(localStorage.getItem("user")).accountType.toLowerCase() ==="vessel") {
          return this.state.vesselAppList;
        } else if (JSON.parse(localStorage.getItem("user")).accountType.toLowerCase() === "admin") {
            //Currently commenting backdated control app for admin users as informed by mani na for production and enable to UAT
            return this.state.adminAppList.concat(this.state.managementAppList.concat(this.state.vesselAppList.concat(this.state.backdatedControlApp.concat(this.state.vesselDowntimeControlApp))));
            // return this.state.adminAppList.concat(this.state.managementAppList.concat(this.state.vesselAppList));
        } else {
          return [];
        }
      };

    render() {
        // if(this.state.confirmStatus===false)
            return (
                <Container fluid className="appContainer">
                    <Row>
                        {this.getList().map((post, i) =>
                            <Col sm={4} md={4} lg={3} xl={2} key={i} >
                                {post.redirect===true?
                                    <Link to={post.redirectUrl}>
                                        <Card className="appCard">
                                            <div>
                                                <div className="app_cat" ><span>{post.category}</span></div>
                                                <div className="app_title">{post.title}</div>
                                                <img className="app_img" src={post.imgUrl} alt={post.title} />
                                                <div className="app_desc" >{post.desc}</div>
                                            </div>
                                        </Card>
                                    </Link>
                                :    
                                    <Card className="appCard">
                                        <div onClick={()=>{ this.setState({ showConfirm: true }) }}>
                                            <div className="app_cat" ><span>{post.category}</span></div>
                                            <div className="app_title">{post.title}</div>
                                            <img className="app_img" src={post.imgUrl} alt={post.title} />
                                            <div className="app_desc" >{post.desc}</div>
                                        </div>
                                        <ConfirmUnlock show={this.state.showConfirm} hide={()=>this.setState({ showConfirm: false })} submit={post.trigger} 
                                            confirmStatus={this.state.confirmStatus}  setConfirmStatus={(val)=>{this.setState({ confirmStatus: val })}} />
                                    </Card>
                                }
                            </Col>
                        )}
                    </Row>
                </Container>
            )
        // else
        //     return <FullScreenSpinner />
    }

}
export default withAuthManager(withMessageManager(withLayoutManager(AssetManagementHomePage)))