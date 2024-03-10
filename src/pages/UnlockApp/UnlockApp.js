import React, {Component} from 'react';
import './UnlockApp.css';
import UnlockAppApi from '../../model/UnlockAppApi';
import { Container, Row, Col, Form, Card, FormControl } from 'react-bootstrap';
import { Select, MenuItem } from '@material-ui/core';
import Spinner from 'react-bootstrap/Spinner'
import { Button } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import config from '../../config/config';
import {withMessageManager} from '../../Helper/Message/MessageRenderer'
import { withRouter } from "react-router-dom"
import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner';
const IsEmpty = val => {
    return val == undefined || val == null || val.toString() == '' || (val instanceof Array && val.length===0) || val ==={}
}
class UnlockApp extends Component {
    constructor(){
        super();
        this.unlockAppApi = new UnlockAppApi();
        this.state={
            vesselList: [],
            appsList: [],
            activeVesselId: '',
            activeApp: '',
            loaded: false,
            unlocking: false
        }
    }
    async getData(){
        this.setState({ loaded: false })
        try{
            let temp = await this.unlockAppApi.GetVesselAndAppsList();
            this.setState({ vesselList: [...temp.vessels], appsList: [...temp.apps], loaded: true });
        }
        catch(e){
            console.log(e);
            this.props.setMessages([{type : "danger", message : "Unable to load Unlock App! No internet!"}]);
            this.props.history.push('/assetmanagement');
        }

    }
    onVesselChange(vesselId){
        this.setState({ activeVesselId: vesselId });
    }
    onAppSelection(app){
        if(app==="CREWWORKANDRESTHOUR" || app==="CREWPLANNING"){
            this.setState({ activeApp: app, activeVesselId: '' });
        }
        else{
            this.setState({ activeApp: app });
        }
    }
    componentDidMount(){
        this.getData();
    }
    unlockApp = async() => {
        this.setState({ unlocking: true })
        try{
            let temp = await this.unlockAppApi.UnlockApp(this.state.activeVesselId, this.state.activeApp);
            if(temp === true){
                this.props.setMessages([{type : "success", message : "Unlocked!"}]);
            }
            this.setState({ unlocking: false });
        }
        catch(e){
            console.log(e);
            this.setState({ unlocking: false });
            this.props.setMessages([{type : "danger", message : "Unable to Unlock App!"}]);
        }
    }
    render(){
        return(
            this.state.loaded===true?
            <Container fluid className='UnlockApp'>
                <Row>
                    <Col style={{ padding: '0px' }}>
                        <div className='UnlockAppHeaderBase'>
                            <div  className="UnlockAppHeaderBackground">
                                <div className="UnlockAppHeading">
                                Unlock App
                                </div>
                            </div>
                        </div> 
                    </Col>
                </Row>
                <Row className="UnlockAppMain">
                    <Col>
                        <Row>
                            <Col>
                                <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Name of App</Form.Label>
                            </Col>
                            <Col>
                                <div style={{ width: '100%' }} className="UnlockAppSelectionBox">
                                    <Select style={{ color: config.KSTColors.MAIN }} 
                                        type='selection' 
                                        disableUnderline 
                                        id={"Name of App"} 
                                        aria-describedby={"Name of App"} 
                                        value={this.state.activeApp===null?"":this.state.activeApp}
                                        onChange={e=> this.onAppSelection(e.target.value)}
                                        className="UnlockAppSelectionFillableBox"   
                                    >
                                        <MenuItem value={''} key={''}> ALL</MenuItem>
                                        {this.state.appsList.map(element => <MenuItem value={element} key={element}> {element}</MenuItem>)}
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '10px' }}>
                            <Col>
                                <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Name of Vessel</Form.Label>
                            </Col>
                            <Col>
                                <div style={{ width: '100%' }} className="UnlockAppSelectionBox">
                                    <Select style={{ color: config.KSTColors.MAIN }} 
                                        type='selection' 
                                        disableUnderline 
                                        id={"Name of Vessel"} 
                                        aria-describedby={"Name of Vessel"} 
                                        value={this.state.activeVesselId===null?"":this.state.activeVesselId}
                                        onChange={e=> this.onVesselChange(e.target.value)}
                                        className="UnlockAppSelectionFillableBox"   
                                    >
                                        <MenuItem value={''} key={''}> ALL</MenuItem>
                                        {!(this.state.activeApp==="CREWWORKANDRESTHOUR" || this.state.activeApp==="CREWPLANNING")&&this.state.vesselList.map(element => <MenuItem value={element.vessel_id} key={element.vessel_id}> {element.name}</MenuItem>)}
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        
                    </Col>
                    <Col xs={0} md={4}/>
                    <Col>
                        <Row style={{ height: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} disabled={this.state.unlocking===true} onClick={this.unlockApp} >
                                    {this.state.unlocking===true?
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                                    :
                                        <SendIcon style={{ color: config.KSTColors.ICON }}/>
                                    }
                                    <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Unlock</span>
                                </Button>
                            </div>
                        </Row>
                    </Col>
                </Row>
                <Row className="UnlockAppMain">
                    *CREWPLANNING APP does not require vessel selection.<br /><br />
                    *CREWWORKANDRESTHOUR APP does not need unlocking.
                </Row>
            </Container>
            :
            <FullScreenSpinner text={"Loading..."}/>
        );
    }

}

export default withRouter(withMessageManager(UnlockApp));