import React from 'react';
import { withRouter } from 'react-router-dom';
import { withAuthManager } from '../../Helper/Auth/auth'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import ModuleContainer from './ModuleContainer'
import HomeLogo from '../../assets/Keppel_Home_Menu_Media.png'
import OperationLogo from '../../assets/Keppel_Operation_Menu_Media.png'
import InsightLogo from '../../assets/Keppel_Enhance_Menu_Media.png'
import AssetManagementLogo from '../../assets/Keppel_AssetManagement_Menu_Media.png'
import AssetMaintenanceLogo from '../../assets/Keppel_AssetMaintenance_Menu_Media.png'
import AnalyticsLogo from '../../assets/Keppel_Analytics_Menu_Media.png'
import StatusOfflineLogo from '../../assets/StatusOffline.png'
import StatusOnlineLogo from '../../assets/StatusAvailable.png'
import '../../css/ModuleNavBar.css';

class ModuleHeader extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            selectedModule : 1,
            status : {status : 'offline', logo : StatusOfflineLogo}
        };
    }

    moduleOptions = { 
        1: { title :"Home", logo : HomeLogo },
        2: { title :"Asset Maintenance", logo : AssetMaintenanceLogo },
        3: { title :"Asset Management", logo : AssetManagementLogo },
        4: { title :"Analytics", logo : AnalyticsLogo },
        5: { title :"Operation", logo : OperationLogo },
        6: { title :"CLASS Insight", logo : InsightLogo }
    }   

    onModuleSelected = (key) => {
        var newState = this.state
        newState.selectedModule = key
        var shouldupdateState = true
        if (key == "6") {
            // this.props.history.push('/insight')
            shouldupdateState = false
        }
        if (key == "5") {
            if(this.props.selectedVessel.vessel_id!=="0"){
                this.props.history.push('/operation')
            }
            else{
                shouldupdateState = false
            }
        }
        if (key == "4") {
            if(this.props.user.accountType==='admin'||this.props.user.accountType==='management'){
                if(this.props.selectedVessel.vessel_id==="0"){
                    this.props.history.push('/analytics')
                }
                else{
                    shouldupdateState = false
                }
            }
            else{
                shouldupdateState = false
            }
        }
        if (key === "3") {
            this.props.history.push('/assetmanagement')
        }
        if (key === "2") {
            // this.props.history.push('/assetmaintenance')
            if(this.props.user.accountType==='admin'||this.props.user.accountType==='management'){
                if(this.props.selectedVessel.vessel_id==="0"){
                    this.props.history.push('/assetmaintenance')
                }
                else{
                    shouldupdateState = false
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
        if (shouldupdateState) {
            this.setState(newState)
        }
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

    GetCurentStatus = () => {
        var newState = this.state
        newState.status = { status : 'offline', logo : StatusOfflineLogo}
        this.setState(newState)
    }

    GetModules = () => {
        var items = [];
        var isSelected = false;
        for(var key in this.moduleOptions) {
            let module = this.moduleOptions[key];
            isSelected = key === this.state.selectedModule; 
            items.push(
                <Col key={key} xs={2}>
                    <ModuleContainer title={module.title} 
                        disabled={key == "6" || (this.props.selectedVessel.vessel_id==="0" && key == "5") || (this.props.selectedVessel.vessel_id!=="0" && key == "2" && (this.props.user.accountType==='admin'||this.props.user.accountType==='management')) || (this.props.selectedVessel.vessel_id!=="0" && key == "4")}
                        logo={module.logo} 
                        selected={isSelected} 
                        selectHandler={this.onModuleSelected} 
                        eventKey={key} />
                </Col>);
        }
        return items
    }

    render() {
        if (this.state.renderFor !== 0) {
            return (<></>)
        }
        return (
            <div className="ModuleNavBar">
            <Container fluid={true} >
                <Row >
                    <Col xs={12} lg={10} style={{height: '100%'}}>
                        <Row noGutters={true} style={{padding : '10px'}}>
                            { this.GetModules()}
                        </Row>
                    </Col>
                    <Col lg={{span : 1, offset : 1}} xs={{span: 2, offset : 10}} style={{display : "flex", alignContent : "center"}}>
                        <Row noGutters={true} >
                            <Col xs={3} style={{margin : "auto"}}>
                                {navigator.onLine===true?
                                    <img style={{margin : "auto"}} src={StatusOnlineLogo} alt="Status" className="img-responsive"/>
                                :
                                    <img style={{margin : "auto"}} src={StatusOfflineLogo} alt="Status" className="img-responsive"/>
                                }
                            </Col>
                            <Col xs={9} style={{margin : "auto"}}>
                                <div className="statusLabel" >
                                    {navigator.onLine===true?
                                        "Online"
                                    :
                                        "Offline"
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            </div>)
    }
  }

export default withRouter(withAuthManager(ModuleHeader));