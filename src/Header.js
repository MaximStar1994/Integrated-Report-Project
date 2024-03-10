import React from 'react';
import {withRouter} from 'react-router-dom';
import { Badge } from '@material-ui/core';
import smalllogo from './assets/RigCareLogo/RigCare2.0-Small.png';
import vesselCareLogo from './assets/VesselCare-Lite_logo/2x/logo.png'
import contactUsLogo from './assets/Keppel_ContactUs_Media.png';
import profileLogo from './assets/Keppel_User_Media.png';
import exitLogo from './assets/exit_logo.png'
import SlantedRibbon from './components/SlantedRibbon/SlantedRibbon'
import Dropdown from './components/Dropdown/Dropdown'
import { logout } from './Helper/Auth/auth'
import { Row, Col, Container} from 'react-bootstrap'
import SideBar from './components/SideBar/SideBar'
import FullScreen from './FullScreen.js'
import EmailButton from './Email.js'
import Tooltip from '@material-ui/core/Tooltip';

import './css/App.css';
import './css/TopNavBar.css';
import MenuIcon from './assets/menuIcon.png'
import HomeLogo from './assets/Keppel_Home_Menu_Media.png'
import OperationLogo from './assets/Keppel_Operation_Menu_Media.png'
import InsightLogo from './assets/Keppel_Enhance_Menu_Media.png'
import AssetManagementLogo from './assets/Keppel_AssetManagement_Menu_Media.png'
import AssetMaintenanceLogo from './assets/Keppel_AssetMaintenance_Menu_Media.png'
import AnalyticsLogo from './assets/Keppel_Analytics_Menu_Media.png'

import {withLayoutManager} from './Helper/Layout/layout'

import { withAuthManager } from './Helper/Auth/auth';
import Chat from './pages/Chat/Chat';
import ChatApi from './model/Chat';
import UnlockAppApi from './model/UnlockAppApi';
import IdleTimer from './components/IdleTimer/IdleTimer';
class NavHeader extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.unlockAppApi = new UnlockAppApi();
        this.state = { 
            organization : "Grupo R",
            project : localStorage.getItem("project") || "B357",
            renderFor : props.renderFor,
            showSubMenu : false,
            selectedModule : 1,
            vesselList: [],
            selectedVessel: {},
            accountType: '',
            showChat: false,
            chatNotifications: [],
            totalNotifications: 0
        };
        this.chatApi = new ChatApi();
    }

    organizationOptions = { 
        2: "Grupo R",
    }

    projectOptions = { 
        1: "B356",
        2: "B357"
    }

    onOrganizationSelcted = (key, event) => {
        var newState = this.state
        newState.organization = this.organizationOptions[key]
        this.setState(newState)
    }
    onProjectSelcted = (key, event) => {
        var newState = this.state
        newState.project = this.projectOptions[key]
        localStorage.setItem("project",this.projectOptions[key])
        window.location.reload()
        this.setState(newState)
    }

    moduleOptions = { 
        1: { title :"Home", logo : HomeLogo },
        2: { title :"Asset Maintenance", logo : AssetMaintenanceLogo ,
            //  options : [{display : "Work Order", key : "/assetmaintenance/workOrderSummary"}]
        },
        3: { title :"Asset Management", logo : AssetManagementLogo },
        4: { title :"Analytics", logo : AnalyticsLogo },
        5: { title :"Operation", logo : OperationLogo },
        6: { title :"CLASS Insight", logo : InsightLogo, 
            // options : [{display : "Support Report", key : "/insight/supportreport"},{display : "Real Time Alarm", key : "/insight/realtimealarm"}]
        }
    }   

    onModuleSelected = (key) => {
        // if (key == "6") {
        //     this.props.history.push('/insight')
        // }
        if (key == "5") {
            if(this.props.selectedVessel.vessel_id!=="0"){
                this.props.history.push('/operation')
            }
        }
        if (key == "4") {
            if(this.props.user.accountType==='admin'||this.props.user.accountType==='management'){
                if(this.props.selectedVessel.vessel_id==="0"){
                    this.props.history.push('/analytics')
                }
            }
        }
        if (key === "3") {
            this.props.history.push('/assetmanagement')
        }
        if (key === "2") {
            if(this.props.user.accountType==='admin'||this.props.user.accountType==='management'){
                if(this.props.selectedVessel.vessel_id==="0"){
                    this.props.history.push('/assetmaintenance')
                }
            }
            else{
                this.props.history.push('/assetmaintenance')
            }
        }
        if (key == "1") {
            if(this.props.user.accountType==='admin'||this.props.user.accountType==='management'){
                localStorage.setItem('selectedVessel', JSON.stringify(this.props.user.vesselList[0]));
                this.props.setSelectedVessel(this.props.user.vesselList[0])
            }
            this.props.history.push('/')
        }
        this.setState({selectedModule : key, showSubMenu : false})
    }

    onVesselSelected = key => {
        let userData = this.props.user;
        if(userData?.vesselList){
            localStorage.setItem('selectedVessel', JSON.stringify(userData.vesselList.filter(element => element.vessel_id === key)[0]));
            this.setState({ selectedVessel:  userData.vesselList.filter(element => element.vessel_id === key)[0] })
            this.props.setSelectedVessel(userData.vesselList.filter(element => element.vessel_id === key)[0])
            if(key==="0")
                this.props.history.push('/')
            else
                this.props.history.push('/vesseldashboard')
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.renderFor !== state.renderFor) {
            state.renderFor = props.renderFor
            return state
        } else {
            return null
        }
    }

    getChatNotifications = async () => {
        let chatNotifications = await this.chatApi.GetNewMsg(this.props.user.accountId);
        let tempTotalNotification = 0;
        chatNotifications.forEach(element => {
            tempTotalNotification +=element.newMsgs;    
        });
        this.setState({ chatNotifications: chatNotifications, totalNotifications: tempTotalNotification });
    }

    componentDidMount(){
        let userData = this.props.user;
        let vesselList = [];
        let selectedVessel = {};
        if(userData?.vesselList){
            vesselList = userData.vesselList;
        }
        if(userData?.accountType==='admin' || userData?.accountType==='management'){
            if(isNaN(JSON.parse(localStorage.getItem('selectedVessel'))?.vessel_id)===false){
                selectedVessel = JSON.parse(localStorage.getItem('selectedVessel'));
            }
            else if(userData.vesselList instanceof Array && userData.vesselList.length>0){
                selectedVessel = userData.vesselList[0];
            }
        }
        else{
            if(userData?.vessels instanceof Array && userData?.vessels.length>0)
                selectedVessel={vessel_id: userData.vessels[0].vesselId, name: userData.vessels[0].name}
        }
        localStorage.setItem('selectedVessel', JSON.stringify(selectedVessel));
        this.setState({ vesselList: vesselList, selectedVessel: selectedVessel, accountType: userData?.accountType });
        this.props.setSelectedVessel(selectedVessel);
        this.getChatNotifications();
        let chatInterval = setInterval(()=>{
            this.getChatNotifications();
        }, 5000);

        const timer = new IdleTimer({
            timeout: window.LOGOUT_TIMER,
            onTimeout: ()=>{
                this.unlockLockedScreens();
                logout(()=> {
                    console.log(this.props.setUser)
                    this.props.setUser({ isAuthenticated: false, loading: false });
                    this.props.history.push('/login')
                })
            }
        })

    }

    unlockLockedScreens = async() => {
        try {
            var vesselId    = JSON.parse(localStorage.getItem('selectedVessel'))?.vessel_id;
            var accountType = JSON.parse(localStorage.getItem('user')).accountType.toLowerCase();
            var currentUser = JSON.parse(localStorage.getItem('selectedVessel'))?.name;
            if (vesselId && accountType && currentUser) {
                await this.unlockAppApi.UnlockAppBrowserTabClose(vesselId, accountType, currentUser);
                localStorage.removeItem("VesselReportLock");
                localStorage.removeItem("DailyLogLock");
                localStorage.removeItem("CrewTemperatureLock");
                localStorage.removeItem("VesselDisinfectionLock");
            }
        }
        catch(error){
            console.log(error);
        }
    }
    
    render() {
        var logo = vesselCareLogo
        var items = []
        for(var key in this.moduleOptions) {
            let module = this.moduleOptions[key];
            let mykey = JSON.parse(JSON.stringify(key))
            var isSelected = mykey == this.state.selectedModule; 
            items.push(
                <div key={key}>
                <Row key={key} className= {isSelected ? "ModuleSelected clickable" : "clickable"} onClick={() => {
                    this.onModuleSelected(mykey)}}>
                    <Col xs={4} md={3}>
                        <div style={{padding : "10px 10%"}}>
                            <img src={module.logo} alt="logo"></img>
                        </div>
                    </Col>
                    <Col className="moduleNavbarTitle" style={{alignItems : "center", display : "flex"}}>
                        {module.title}
                    </Col>
                </Row>
                { module.options && module.options.map(option => 
                    <Row key={option.key}>
                        <Col onClick={() => {
                            this.props.history.push(option.key)
                        }}>
                            <div className="moduleNavbarTitle" >
                                {option.display}
                            </div>
                        </Col>
                    </Row>
                )}
                {/* { key == 3 && this.state.renderFor !== 0 && (<SideBar onAssetSelected ={()=>{this.onModuleSelected(mykey)}}></SideBar>)} */}
                </div>);
        }
        if (this.state.renderFor !== 0) {
            return (
                <div className="background">
                <Container fluid={true} >
                    <Row>
                        <Col xs={4} style={{display: 'flex'}}>
                            <img src={MenuIcon} alt="menu" style={{alignSelf : "center"}} onClick={()=>{this.setState({showSubMenu : !this.state.showSubMenu})}}></img>
                            {this.state.showSubMenu && (
                                <div className="ModuleNavBar" style={{position : "absolute", top : "100%", left : "0",zIndex : 100}}>
                                    {items}
                                    <Row key={key} className= {isSelected ? "ModuleSelected clickable" : "clickable"} onClick={() => this.setState({ showChat: true })}>
                                        <Col xs={4} md={3}>
                                            <div style={{padding : "10px 10%"}}>
                                                <img src={contactUsLogo} alt="Support"></img>
                                            </div>
                                            <div style={{ position: 'absolute', color: '#364bfd', top: '0rem', right: '0.5rem', backgroundColor: '#90caf9', padding: '2px', borderRadius: '30%' }}>
                                                {this.state.totalNotifications}
                                            </div>
                                        </Col>
                                        <Col className="moduleNavbarTitle" style={{alignItems : "center", display : "flex"}}>
                                            {`Support`}
                                        </Col>
                                    </Row>
                                    <div key={'Logout'}>
                                        <Row key={key} className={isSelected ? "ModuleSelected clickable" : "clickable"} onClick={() => {
                                            this.unlockLockedScreens();
                                            logout(() => {
                                                this.props.setUser({ isAuthenticated: false, loading: false });
                                                this.props.history.push('/login')
                                            })      
                                        }}>
                                        <Col xs={4} md={3}>
                                            <div style={{padding : "10px 10%"}}>
                                                <img src={profileLogo} alt="Log Out"></img>
                                            </div>
                                        </Col>
                                        <Col className="moduleNavbarTitle" style={{alignItems : "center", display : "flex"}}>
                                            {`${this.props.user.username} Logout`  }
                                        </Col>
                                    </Row>
                                    { module.options && module.options.map(option => 
                                        <Row key={option.key}>
                                            <Col onClick={() => {
                                                this.props.history.push(option.key)
                                            }}>
                                                <div className="moduleNavbarTitle" >
                                                    {option.display}
                                                </div>
                                            </Col>
                                        </Row>
                                    )}
                                    {/* { key == 3 && this.state.renderFor !== 0 && (<SideBar onAssetSelected ={()=>{this.onModuleSelected(mykey)}}></SideBar>)} */}
                                    </div>
                                </div>
                            )}
                        </Col>
                        <Col xs={4} style={{height: '100%', textAlign : "center"}}>
                            <img src = {logo} alt="logo" className="img-responsive pad10" style ={{float:'left'}}/>
                        </Col>
                        <Col xs={4} style={{margin: "auto", height: '100%', paddingLeft: ''}}>
                            <Row noGutters={true} >
                                <Col xs={12} sm={6}>
                                    <Row>
                                        <Col xs={2} ><SlantedRibbon /></Col>
                                        <Col xs={9}>
                                            {/* {this.props.user && this.props.user.projects && (this.props.user.projects.includes("B357") || this.props.user.projects.includes("B356")) &&
                                            <Dropdown title={this.state.organization}
                                                options={this.organizationOptions}
                                                id = "dropdownOrgHeader"
                                                onSelect={this.onOrganizationSelcted}/>} */}
                                            {this.state.accountType==='admin'||this.state.accountType==='management'?
                                                <Dropdown title={this.props.selectedVessel.name}
                                                options={this.state.vesselList}
                                                id = "vessel_id"
                                                onSelect={this.onVesselSelected}
                                                />
                                            :
                                                <div style={{ color: '#fff' }}>{this.state.selectedVessel.name}</div>
                                            }
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Row>
                                        <Col xs={2} ><SlantedRibbon /></Col>
                                        <Col xs={9} style={{ }}>
                                            {this.props.user && this.props.user.projects && (this.props.user.projects.includes("B357") || this.props.user.projects.includes("B356")) &&
                                            <Dropdown title={this.state.project}
                                                options={this.projectOptions}
                                                id = "dropdownProjHeader"
                                                onSelect={this.onProjectSelcted}/>}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Chat show={this.state.showChat} hide={()=>this.setState({ showChat: false })} chatNotifications={this.state.chatNotifications} />
                </Container>
                </div>
            )
        }
        return (
            <div className="background">
            <Container fluid={true} >
                <Row>
                    <Col xs={6} md={5} lg={1} style={{height: '100%'}}>
                        <img src = {logo} alt="logo" className="img-responsive pad10" style ={{float:'left'}}/>
                    </Col>
                    <Col xs={{span : 2, offset: 3}} md={{span :6, offset: 3}} lg={{span :3, offset: 0}} style={{margin: "auto", height: '100%', paddingLeft: ''}}>
                        <Row noGutters={true} >
                            <Col xs={12}>
                                <Row>
                                    <Col xs={1} ><SlantedRibbon /></Col>
                                    <Col xs={10}>
                                        {/* {this.props.user && this.props.user.projects && (this.props.user.projects.includes("B357") || this.props.user.projects.includes("B356")) &&
                                        <Dropdown title={this.state.organization}
                                            options={this.organizationOptions}
                                            id = "dropdownOrgHeader"
                                            onSelect={this.onOrganizationSelcted}/>} */}
                                            {this.state.accountType==='admin'||this.state.accountType==='management'?
                                                <Dropdown title={this.props.selectedVessel.name}
                                                options={this.state.vesselList}
                                                id = "vessel_id"
                                                onSelect={this.onVesselSelected}
                                                />
                                            :
                                                <div style={{ color: '#fff' }}>{this.state.selectedVessel.name}</div>
                                            }
                                    </Col>
                                    <Col xs={1} ><SlantedRibbon /></Col>
                                </Row>
                            </Col>
                            {/* <Col xs={6}>
                                <Row>
                                    <Col xs={2} ><SlantedRibbon /></Col>
                                    <Col xs={9} style={{ }}>
                                        {this.props.user && this.props.user.projects && (this.props.user.projects.includes("B357") || this.props.user.projects.includes("B356")) &&
                                        <Dropdown title={this.state.project}
                                            options={this.projectOptions}
                                            id = "dropdownProjHeader"
                                            onSelect={this.onProjectSelcted}/>}
                                    </Col>
                                </Row>
                            </Col> */}
                        </Row>
                    </Col>
                    <Col xs={{span : 4, offset : 0}}  md={{span : 6, offset : 0}} lg={{span : 2, offset : 5}} >
                        <Row noGutters={true} >
                            <Col xs={3} style={{height: '100%'}}><FullScreen handle={this.props.handle}/></Col>
                            <Col xs={3} style={{height: '100%'}}><EmailButton/></Col>
                            <Col xs={{span : 3, offset : 0}} style={{height: '100%'}}>
                                <Tooltip title="Call us at +65 68635261 / Email us at assetcare_serv@keppelom.com" placement="bottom">
                                    <div style={{ position: 'relative' }}>
                                        <img src = {contactUsLogo} alt="Contact Us" className="top-icon img-responsive pad10 inverted" onClick={()=>this.setState({ showChat: true })} />
                                        <div style={{ position: 'absolute', color: '#364bfd', top: '0rem', right: '0.5rem', backgroundColor: '#90caf9', padding: '2px', borderRadius: '30%' }}>
                                            {this.state.totalNotifications}
                                        </div>
                                    </div>
                                    {/* <Badge badgeContent={4} color="primary" style={{ marginTop: '1rem', marginRight: '1rem', position: 'absolute' }}>
                                    </Badge> */}

                                </Tooltip>
                                <Chat show={this.state.showChat} hide={()=>this.setState({ showChat: false })} chatNotifications={this.state.chatNotifications} />
                            </Col>
                            <Col xs={3} style={{height: '100%'}}>
                                <Tooltip title={`${this.props.user.name} Logout`} placement="bottom">
                                    <img 
                                        src = {profileLogo} 
                                        alt="Log out" 
                                        className="top-icon img-responsive pad10 inverted clickable" 
                                        onClick={() => {
                                            this.unlockLockedScreens();
                                            logout(()=> {
                                                this.props.setUser({ isAuthenticated: false, loading: false });
                                                this.props.history.push('/login')
                                            })
                                        }}/>
                                </Tooltip>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            </div>)
    }
  }

export default withAuthManager(withLayoutManager( withRouter(NavHeader)));
