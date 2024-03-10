import React, { Component } from 'react';
import VesselDisinfectionApi from '../../model/VesselDisinfection';
// import CrewPlanningTable from './CrewPlanningTable';
// import SpareCrewTable from './SpareCrewTable';
import './DisinfectionRecord.css';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import Spinner from 'react-bootstrap/Spinner'
import SendIcon from '@material-ui/icons/Send';
import moment from 'moment';

import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner';
import { withLayoutManager } from '../../Helper/Layout/layout';
import { withMessageManager } from '../../Helper/Message/MessageRenderer';

import config from '../../config/config';
import DisinfectionFormInput from './DisinfectionFormInput';

const CHECKBOXMAP = {
    wheelhouse : 'Wheelhouse',
    gallery : 'Gallery',
    messroom : 'Messroom',
    toilets : 'Toilets',
    doorknobs : 'Door Knobs',
    staircase : 'Staircase Railings',
    silentroom : 'Silent Room',
}

class DisinfectionRecord extends Component {
    constructor(){
        super();
        this.vesselDisinfectionAPI = new VesselDisinfectionApi();
        this.state={
            loaded: false,
            showConfirmSubmit: false,
            vesselName: '',
            date: moment(),
            time: '1830h',
            checkedBy: '',
            gallery : false,
            wheelhouse : false,
            messroom : false,
            toilets : false,
            doorknobs : false,
            staircase : false,
            silentroom : false,
            remarks : '',
        }
    }
    
    IsEmpty = val => val == undefined || val == null || val.toString() == '';

    getData = async () => {
        try{
            this.setState({ loaded: false });
            // await this.vesselDisinfectionAPI.ForceSyncVesselDisinfection();
            this.vesselDisinfectionAPI.CanViewVesselDisinfectionPage( async (value, err) => {
                if(!err){
                    if (value === true || value === 'true') {
                        try{
                            let checkForToday = await this.vesselDisinfectionAPI.CheckSubmissionForToday();
                            if(checkForToday===false){
                                let vesselData = await this.vesselDisinfectionAPI.GetVesselData();
                                this.setState({
                                    vesselId: vesselData.id,
                                    vesselName: vesselData.name,
                                    date: moment(),
                                    time: '1830h',
                                    checkedBy: '',
                                    gallery : false,
                                    wheelhouse : false,
                                    messroom : false,
                                    toilets : false,
                                    doorknobs : false,
                                    staircase : false,
                                    silentroom : false,
                                    remarks : '',
                                })
                                this.setState({ loaded: true });
                            }
                            else if(checkForToday===true){
                                this.props.setMessages([{type : "danger", message : "Vessel Disinfection Record already submitted for today!"}]);
                                window.scrollTo(0,0);
                                this.props.history.push('/operation');
                            }
                        }
                        catch(err){
                            this.props.setMessages([{type : "danger", message : "No Internet!"}]);
                            window.scrollTo(0,0);
                            this.props.history.push('/operation');
                            this.setState({ loaded: true });
                        }
                    }
                    else if(value===false){
                        this.props.setMessages([{type : "danger", message : "Another Device using the Vessel Disinfection Record Form"}]);
                        window.scrollTo(0,0);
                        this.props.history.push('/operation');
                        this.setState({ loaded: true });
                    }
                }
                else{
                    this.props.setMessages([{type : "danger", message : "No Internet!"}]);
                    window.scrollTo(0,0);
                    this.props.history.push('/operation');
                    this.setState({ loaded: true });
                }
            });
            
        }
        catch(err){
            this.props.setMessages([{type : "danger", message : "Unable to load Vessel Disinfection Report! No Internet!"}]);
            this.props.history.push('/operation');
            this.setState({ loaded: true });

        }
    }
    componentDidMount(){
        this.getData();
    }
    componentWillUnmount(){
        this.vesselDisinfectionAPI.UnlockVesselDisinfectionPage((value, err)=> {
            console.log('Tying to unlock: ', value, err);
            localStorage.removeItem("VesselDisinfectionLock");
        });
    }
    toggleCheck = option => {
        let temp ={};
        temp[option] = !this.state[option];
        this.setState(temp);
    }
    checkAll = () => {
        let temp ={};
        Object.keys(CHECKBOXMAP).forEach(key => temp[key] = true);
        this.setState(temp);
    }
    checkCheckbox = () => {
        let result = true;
        Object.keys(CHECKBOXMAP).forEach(key => {
            if(this.state[key]!==true){
                result = false;
            }
        });
        return result;
    }
    submitRecord = async() => {
        if(this.IsEmpty(this.state.checkedBy)){
            this.props.setMessages([{type : "danger", message : "Checked By is mandatory to submit!"}]);
        }
        else if(this.checkCheckbox()===false){
            this.props.setMessages([{type : "danger", message : "All items need to be checked before submitting!"}]);
        }
        else if(this.IsEmpty(this.state.remarks)){
            this.props.setMessages([{type : "danger", message : "Remarks are mandatory to submit!"}]);
        }
        else{
            this.setState({showConfirmSubmit: true});
            let temp = { ...this.state};
            temp.dateSubmitted = moment().format();
            temp.date = moment(temp.date).format();
            delete temp.loaded;
            delete temp.showConfirmSubmit;
            try{
                await this.vesselDisinfectionAPI.SubmitVesselDisinfection(temp);
                this.props.setMessages([{type : "success", message : "Submitted!"}]);
                this.props.history.push('/');
            }
            catch(err){
                this.props.setMessages([{type : "danger", message : "Unable to submit! Try again later with Internet Connectivity!"}]);
                console.log("Error at submitting crew data: ", err);
            }
            this.setState({showConfirmSubmit: false});
        }
    }
    render(){
        return(
            <React.Fragment>
                {this.state.loaded===true?
                    <Container fluid className='Disinfection'>
                        <Row>
                            <Col style={{ padding: '0px' }}>
                                <div className='crewPlanningHeaderBase'>
                                    <div  className="crewPlanningHeaderBackground">
                                        <div className="VesselReportHeading">
                                                VESSEL DISINFECTION RECORD FORM
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', paddingRight: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} onClick={()=> {this.submitRecord()}} disabled={this.state.showConfirmSubmit}>
                                            {this.state.showConfirmSubmit===true?
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                                            :
                                                <SendIcon style={{ color: config.KSTColors.ICON }}/>
                                            }
                                            <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Submit</span>
                                        </Button>
                                    </div>
                                </div> 
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} xs={12}>
                                <Row>
                                    <Col xs={6}>
                                    <DisinfectionFormInput id='vesselName' title="Vessel Name" disabled={true} value={this.state.vesselName} type='text' />
                                    <DisinfectionFormInput id='Date' title="Date" disabled={true} value={moment(this.state.date).format('DD / MM / YYYY')} type='text' />
                                    <DisinfectionFormInput id='Time' title="Time" disabled={true} value={this.state.time} type='text' />
                                    <DisinfectionFormInput id='CheckedBy' title="Checked By" disabled={false} value={this.state.checkedBy} handleChange={e => this.setState({checkedBy: e.target.value})} type='selection' options={['', 'Master']} />
                                    </Col>
                                    <Col xs={12} md={1} />
                                    <Col xs={12} md={3}>
                                        <div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'space-evenly', height: '100%' }}>
                                            {Object.entries(CHECKBOXMAP).map(([option, optionText]) => 
                                                <Form.Check
                                                    type='checkbox' 
                                                    style={{ color: config.KSTColors.MAIN, fontWeight: '10' }}  
                                                    id={option} 
                                                    aria-describedby={option}
                                                    checked={this.state[option]}
                                                    onChange={()=>this.toggleCheck(option)}
                                                    label={optionText}
                                                    key={option}
                                                />
                                            )}
                                            <Button style={{ backgroundColor: 'green', color: 'white', borderRadius: '25px' }} onClick={this.checkAll}>Check All</Button>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <DisinfectionFormInput id='Remarks' title="Remarks" disabled={false} value={this.state.remarks} type='textarea' placeholder="Please state the type of disinfection solution used." handleChange={e => this.setState({remarks: e.target.value})}/>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                :
                <FullScreenSpinner text={"Loading..."}/>
                }
            </React.Fragment>
        );
    }
}

export default withLayoutManager(withMessageManager(DisinfectionRecord));
