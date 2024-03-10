import React, {Component} from 'react';
import './CrewWorkAndRestHour.css';
import CrewWorkAndRestHourApi from '../../model/CrewWorkAndRestHour';
import { Container, Row, Col, Form, Card, FormControl } from 'react-bootstrap';
import SignatureCanvas from 'react-signature-canvas';
import { Button, Select, MenuItem } from '@material-ui/core';
import Spinner from 'react-bootstrap/Spinner'
import SendIcon from '@material-ui/icons/Send';
import moment from 'moment';
import config from '../../config/config';
import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner';
import {withMessageManager} from '../../Helper/Message/MessageRenderer'
import { withRouter } from "react-router-dom"
const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
class CrewWorkAndRestHour extends Component {
    constructor(){
        super();
        this.crewWorkAndRestHourApi = new CrewWorkAndRestHourApi();
        this.state={
            vesselName: '',
            crewName: '',
            rank: '',
            month: null,
            year: null,
            overnight: false,
            watchkeeper: null,
            crewWorkingData: {},
            authorisedPersonName: '',
            seafarerName: '',
            authorisedPersonSignature: '',
            seafarerSignature: '',
            loaded: false,
            isSubmit: false,
            date: null,
            startCell: null,
            endCell: null,
            totalRestHours: 0,
            isWorking: 0,
            dateList: [],
            cellList: [],
            masterSignAllowed: false,
            masterPassword: '',
            masterPasswordError: ''
        }
        this.authorisedPersonSignatureCanvas = null;
        this.seafarerCanvas = null;
    }
    unlockMasterSign = () => {
        if(this.state.masterPassword===window.CAPTAIN){
            this.setState({ masterSignAllowed: true, masterPassword: '', masterPasswordError: '' });
        }
        else{
            this.setState({ masterSignAllowed: false, masterPassword: '', masterPasswordError: 'Invalid Password, Try Again!' });
        }

    }
    isEmpty = (element) =>{
        if(element===undefined || element===null)
            return true;
        else if(typeof(element) === 'string'){
            if(element.trim()===''){
                return true
            }
            else{
                return false
            }
        }
        else
            return false;
    }
    async getData(month, year){
        let dateList = [];
        for(let i=1; i<=moment().set('year', year).set('month', month).endOf('month').date(); i++){
            dateList.push(i);
        }
        let cellList = [];
        for(let c=0; c<=48; c++){
            if(c%2===0){
                cellList.push({display: `${c/2<10===true?'0':''}${(c/2).toFixed(0)}00hrs`, value: c});
            }
            else{
                cellList.push({display: `${c/2<10===true?'0':''}${(c/2).toFixed(0)-1}30hrs`, value: c});
            }
        }
        this.setState({ loaded: false, dateList: dateList, cellList: cellList });
        let temp = this.props.match.params.id;
        if(this.isEmpty(temp)===true){
            this.props.setMessages([{type : "danger", message : "Invalid Crew"}]);
            this.props.history.push('/crewworkandresthour');
        }
        else{
            try{
                try{
                    let prevSubmission = await this.crewWorkAndRestHourApi.GetPreviousSubmission(temp,month,year);
                    if(prevSubmission===false){
                        let data = await this.crewWorkAndRestHourApi.GetCrewRestAndWorkHourData(temp,month,year)
                        this.setState({ ...data.crewVesselData, crewWorkingData: data.crewWorkingData, totalRestHours: data.totalRestHours, loaded: true });
                    }
                    else{
                        this.props.setMessages([{type : "danger", message : `Crew Work and Rest Hour Form already submitted for this Crew for ${monthsList[month]}, ${year}!`}]);
                        window.scrollTo(0,0);
                        this.props.history.push('/crewworkandresthour');
                    }
                }
                catch(err){
                    this.props.setMessages([{type : "danger", message : err}]);
                    this.props.history.push('/crewworkandresthour');
                }
            }
            catch(err){
                console.log(err);
                this.props.setMessages([{type : "danger", message : "Unable to load Crew Work And Rest Hours! No internet!"}]);
                this.props.history.push('/crewworkandresthour');
            }
        }
    }
    componentDidMount(){
        this.setState({ month: this.props.match.params.month, year: this.props.match.params.year })
        this.getData(this.props.match.params.month, this.props.match.params.year);
    }
    getBlock(shift, value){
        let temp = [];
        let blockCounter = 0
        if(shift===1){
            blockCounter = 13;
        }
        else if(shift===2){
            blockCounter = 24;
        }
        else if(shift===3){
            blockCounter = 11
        }
        for(let i=0; i<blockCounter; i++){
            temp.push(<div style={{ backgroundColor: value===true?config.KSTColors.GREENDOT:'', flexBasis: '200px', textAlign: 'center', border: '1px solid lightgrey', color: config.KSTColors.MAIN, height: '20px' }}></div>)
        }
        return temp;
    }
    getHeader(){
        let temp = [];
        for(let i=1; i<=24; i++){
            temp.push(<div key={i} style={{ backgroundColor: config.KSTColors.NAVITEM, flexBasis: '200px', textAlign: 'center', border: '1px solid lightgrey', color: config.KSTColors.MAIN, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i}</div>)
        }
        temp.push(<div key={24} style={{ backgroundColor: config.KSTColors.NAVITEM, flexBasis: '200px', textAlign: 'center', border: '1px solid lightgrey', color: config.KSTColors.MAIN, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Hours of Rest in 24 Hrs</div>)
        return temp;
    }
    validateForm(){
        if((!this.authorisedPersonSignatureCanvas && (this.state.authorisedPersonSignature==='' || this.state.authorisedPersonSignature===null)) || 
            (this.authorisedPersonSignatureCanvas && this.authorisedPersonSignatureCanvas.isEmpty()) || !this.seafarerCanvas || this.seafarerCanvas.isEmpty()){
            this.props.setMessages([{type : "danger", message : "Signatures are mandatory to submit!"}]);
            window.scrollTo(0,0);
            return false;
        }
        else if(typeof(this.state.authorisedPersonName)==='string' && this.state.authorisedPersonName.length===0){
            this.props.setMessages([{type : "danger", message : "Authorized Person Name input is missing!"}]);
            window.scrollTo(0,0);
            return false;
        }
        else if(typeof(this.state.seafarerName)==='string' && this.state.seafarerName.length===0){
            this.props.setMessages([{type : "danger", message : "Seafarer Name input is missing!"}]);
            window.scrollTo(0,0);
            return false;
        }
        else if(this.state.watchkeeper===null || this.state.watchkeeper===undefined || this.state.watchkeeper==="" ){
            this.props.setMessages([{type : "danger", message : "Watchkeeper input is missing!"}]);
            window.scrollTo(0,0);
            return false;
        }
        return true;
    }
    submitCrewWorkAndRestHour = async() => {
        this.setState({ isSubmit: true });
        if(this.validateForm()===true){
            try{
                let temp = {...this.state};
                delete temp.loaded;
                delete temp.isSubmit;
                if(this.authorisedPersonSignatureCanvas){
                    temp.authorisedPersonSignature = this.authorisedPersonSignatureCanvas.toDataURL('image/png');
                }
                temp.seafarerSignature = this.seafarerCanvas.toDataURL('image/png')
                temp.dateSubmitted = new Date();
                await this.crewWorkAndRestHourApi.PostCrewRestAndWorkHourData({crewWorkAndRestData: temp});
                this.props.setMessages([{type : "success", message : "Submitted!"}]);
                this.props.history.push('/crewworkandresthour');
            }
            catch(err){
                this.props.setMessages([{type : "danger", message : "Unable to submit! Try again later with Internet Connectivity!"}]);
                console.log("Error at submitting crew data: ", err);
            }
        }
        this.setState({ isSubmit: false });
    }
    submitCrewWorkAndRestHourUpdate = async() => {
        if(this.state.date===null||this.state.date===""){
            this.props.setMessages([{type : "danger", message : "Date input is missing!"}]);
        }
        else if(this.state.startCell===null||this.state.startCell===""){
            this.props.setMessages([{type : "danger", message : "Start Time input is missing!"}]);
        }
        else if(this.state.endCell===null||this.state.endCell===""){
            this.props.setMessages([{type : "danger", message : "End Time input is missing!"}]);
        }
        else if(this.state.endCell<=this.state.startCell && this.state.overnight===false){
            this.props.setMessages([{type : "danger", message : "End Time cannot be less or equal to Start Time input!"}]);
        }
        else if(this.state.isWorking===null||this.state.isWorking===""||this.state.isWorking===0){
            this.props.setMessages([{type : "danger", message : "Working / Resting input is missing!"}]);
        }
        else{
            this.setState({isSubmit: true});
            try{
                let temp = {
                    employeeNo: this.state.employeeNo,
                    crewName: this.state.crewName,
                    crewId: this.state.crewId,
                    month: this.state.month,
                    year: this.state.year,
                    date: this.state.date,
                    startCell: this.state.startCell,
                    endCell: this.state.endCell,
                    isWorking: this.state.isWorking,
                    overnight: this.state.overnight
                }
                temp.dateSubmitted = new Date();
                await this.crewWorkAndRestHourApi.PostCrewRestAndWorkHourUpdateData({crewWorkAndRestUpdateData: temp})
                this.setState({isSubmit: false});
                this.props.setMessages([{type : "success", message : "Updated!"}]);
                this.getData(this.state.month, this.state.year);
            }
            catch(err){
                this.setState({isSubmit: false});
                this.props.setMessages([{type : "danger", message : "Unable to update! Try again later with Internet Connectivity!"}]);
                console.log("Error at submitting data: ", err);
            }
        }
    }
    render(){
        return(
            this.state.loaded===true?
            <Container fluid className='CrewWorkAndRestHour'>
                <Row>
                <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginLeft: '20px', marginTop: '10px', color: config.KSTColors.ICON }} 
                    onClick={()=> {this.props.history.push('/crewworkandresthour')}}>
                    <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Back</span>
                </Button>
                </Row>
                <Row>
                    <Col style={{ padding: '0px' }}>
                        <div className='crewWorkAndRestHourHeaderBase'>
                            <div  className="crewWorkAndRestHourHeaderBackground">
                                <div className="crewWorkAndRestHourHeading">
                                        SEAFARER'S RECORD OF HOURS OF REST
                                </div>
                            </div>
                        </div> 
                    </Col>
                </Row>
                <Row className="CrewWorkAndRestHourMain">
                    <Col xs={0} md={4}>
                        <Row>
                            <Col>
                                <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Day</Form.Label>
                            </Col>
                            <Col>
                                <div style={{ width: '100%' }} className="CrewWorkAndRestHourSelectionBox">
                                    <Select style={{ color: config.KSTColors.MAIN }} 
                                        type='selection' 
                                        disableUnderline 
                                        id={"Date"} 
                                        aria-describedby={"Date"} 
                                        value={this.state.date===null?"":this.state.date}
                                        onChange={e=> this.setState({ date: e.target.value })}
                                        className="CrewWorkAndRestHourSelectionFillableBox"   
                                    >
                                        {this.state.dateList.map(element => <MenuItem value={element} key={element}> {element}</MenuItem>)}
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Start Time</Form.Label>
                            </Col>
                            <Col>
                                <div style={{ width: '100%' }} className="CrewWorkAndRestHourSelectionBox">
                                    <Select style={{ color: config.KSTColors.MAIN }} 
                                        type='selection' 
                                        disableUnderline 
                                        id={"StartTime"} 
                                        aria-describedby={"StartTime"} 
                                        value={this.state.startCell===null?"":this.state.startCell}
                                        onChange={e=> this.setState({ startCell: e.target.value })}
                                        className="CrewWorkAndRestHourSelectionFillableBox"   
                                    >
                                        {this.state.cellList.map(element => <MenuItem value={element.value} key={element.value}> {element.display}</MenuItem>)}
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        
                    </Col>
                    <Col xs={0} md={4}>
                        <Row>
                            <Col>
                                <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Working / Resting</Form.Label>
                            </Col>
                            <Col>
                                <div style={{ width: '100%' }} className="CrewWorkAndRestHourSelectionBox">
                                    <Select style={{ color: config.KSTColors.MAIN }} 
                                        type='selection' 
                                        disableUnderline 
                                        id={"Working_Resting"} 
                                        aria-describedby={"Working_Resting"} 
                                        value={this.state.isWorking===null?"":this.state.isWorking}
                                        onChange={e=> this.setState({isWorking: e.target.value})}
                                        className="CrewWorkAndRestHourSelectionFillableBox"   
                                    >
                                        <MenuItem value={0}>Select Working/Resting</MenuItem>
                                            <MenuItem value={1}>Working</MenuItem>
                                            <MenuItem value={2}>Resting</MenuItem>
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>End Time</Form.Label>
                            </Col>
                            <Col>
                                <div style={{ width: '100%' }} className="CrewWorkAndRestHourSelectionBox">
                                    <Select style={{ color: config.KSTColors.MAIN }} 
                                        type='selection' 
                                        disableUnderline 
                                        id={"EndTime"} 
                                        aria-describedby={"EndTime"} 
                                        value={this.state.endCell===null?"":this.state.endCell}
                                        onChange={e=> this.setState({ endCell: e.target.value })}
                                        className="CrewWorkAndRestHourSelectionFillableBox"   
                                    >
                                        {this.state.cellList.map(element => <MenuItem value={element.value} key={element.value}> {element.display}</MenuItem>)}
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={0} md={4}>
                        <Row style={{ height: '100%' }}>
                            <div  style={{ color: config.KSTColors.MAIN, fontWeight: '10', backgroundColor: 'rgba(0,0,0,0)', marginBottom: '5px' }} >
                                <Form.Check inline type={'checkbox'} checked={this.state.overnight===true} onClick={()=> {this.setState({ overnight: !this.state.overnight })}}/> Overnight
                            </div>
                            <div style={{ marginLeft: 'auto', paddingRight: '20px', display: 'flex', justifyContent: 'flex-end', height: '100%' }}>
                            <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} onClick={()=> {this.submitCrewWorkAndRestHourUpdate()}} disabled={this.state.isSubmit}>
                                {this.state.isSubmit===true?
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                                :
                                    <SendIcon style={{ color: config.KSTColors.ICON }}/>
                                }
                                <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Save</span>
                            </Button>
                            </div>
                        </Row>
                    </Col>
                </Row>
                
                <Row className="CrewWorkAndRestHourMain">
                    <Col xs={0} md={4}>
                        <Row>
                            <Col>
                                <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Name of Vessel</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control 
                                    style={{ color: config.KSTColors.MAIN, fontWeight: '10', backgroundColor: 'rgba(0,0,0,0)', border: '1px solid #707070', marginBottom: '5px' }} 
                                    type="text"
                                    id="Name of Vessel"
                                    aria-describedby="Name of Vessel"
                                    value={this.state.vesselName}
                                    disabled={true}
                                    name={"Name of Vessel"}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Name of Crew</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control 
                                    style={{ color: config.KSTColors.MAIN, fontWeight: '10', backgroundColor: 'rgba(0,0,0,0)', border: '1px solid #707070', marginBottom: '5px' }} 
                                    type="text"
                                    id="Name of Crew"
                                    aria-describedby="Name of Crew"
                                    value={this.state.crewName}
                                    disabled={true}
                                    name={"Name of Crew"}
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '10px' }}>
                            <Col>
                                <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Watchkeeper</Form.Label>
                            </Col>
                            <Col style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <div  style={{ color: config.KSTColors.MAIN, fontWeight: '10', backgroundColor: 'rgba(0,0,0,0)', marginBottom: '5px' }} >
                                    Yes <Form.Check inline type={'checkbox'} checked={this.state.watchkeeper===true} onClick={()=> {if(this.state.watchkeeper===true){this.setState({watchkeeper: null})} else{this.setState({watchkeeper: true})}}}/>
                                </div>
                                <div  style={{ color: config.KSTColors.MAIN, fontWeight: '10', backgroundColor: 'rgba(0,0,0,0)', marginBottom: '5px' }} >
                                    No <Form.Check  inline type={'checkbox'} checked={this.state.watchkeeper===false} onClick={()=> {if(this.state.watchkeeper===false){this.setState({watchkeeper: null})} else{this.setState({watchkeeper: false})}}}/>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={0} md={4}/>
                    <Col xs={0} md={4}>
                        <Row>
                            <Col>
                                <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Month & Year</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control 
                                    style={{ color: config.KSTColors.MAIN, fontWeight: '10', backgroundColor: 'rgba(0,0,0,0)', border: '1px solid #707070', marginBottom: '5px' }} 
                                    type="text"
                                    id="MonthAndYear"
                                    aria-describedby="MonthAndYear"
                                    value={`${monthsList[this.state.month]}, ${this.state.year}`}
                                    disabled={true}
                                    name={"MonthAndYear"}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Rank</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control 
                                    style={{ color: config.KSTColors.MAIN, fontWeight: '10', backgroundColor: 'rgba(0,0,0,0)', border: '1px solid #707070', marginBottom: '5px' }} 
                                    type="text"
                                    id="Rank"
                                    aria-describedby="Rank"
                                    value={this.state.rank}
                                    disabled={true}
                                    name={"Rank"}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="CrewWorkAndRestHourMain">
                    <Col>
                        <div>
                            <div style={{ display: 'flex', width: '100%'}}>
                                <div style={{ backgroundColor: config.KSTColors.NAVITEM, flexBasis: '200px', textAlign: 'center', border: '1px solid lightgrey', color: config.KSTColors.MAIN }}>Hours <hr style={{ margin: '0px' }} /> Date</div>
                                {this.getHeader()}    
                            </div>
                            {Object.entries(this.state.crewWorkingData).map(([key, element])=>{
                                return(
                                <div style={{ display: 'flex', width: '100%'}} key={key}>
                                    <div style={{ backgroundColor: config.KSTColors.NAVITEM, flexBasis: '410px', textAlign: 'center', border: '1px solid lightgrey', color: config.KSTColors.MAIN, height: '20px' }}> Day {key}</div>
                                    {Object.entries(element).map(([key2, value2]) =>(
                                        key2!=='totalRestHours'&&<div style={{ backgroundColor: value2===true?'':config.KSTColors.GREENDOT, flexBasis: '200px', textAlign: 'center', border: '1px solid lightgrey', color: config.KSTColors.MAIN, height: '20px' }}></div>
                                        ))}
                                    <div style={{ flexBasis: '410px', textAlign: 'center', border: '1px solid lightgrey', color: element['totalRestHours']<11?'red':config.KSTColors.MAIN, height: '20px' }}>{element['totalRestHours']}</div>
                                </div>
                                );
                            }
                            )}
                            <div style={{ display: 'flex', width: '100%'}}>
                                <div style={{ flexBasis: '10010px', paddingRight: '5rem', textAlign: 'end', border: '1px solid lightgrey', color: config.KSTColors.MAIN, height: '20px' }}>Total Hours of Rest</div>
                                <div style={{ flexBasis: '410px', textAlign: 'center', border: '1px solid lightgrey', color: config.KSTColors.MAIN, height: '20px' }}>{this.state.totalRestHours}</div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="CrewWorkAndRestHourMain">
                    <div style={{ paddingBottom: '10px' }}>I agree that this record is an accurate of the hours of rest of the seafarer concerned</div>
                </div>
                <Row>
                    <Col>
                        <Card>
                            <Row>
                                <Col xs={12} xl={6} style={{ padding: '0px' }}>
                                    <Card style={{ margin: '0px', color: config.KSTColors.MAIN, backgroundColor: '#eeeff5', borderRadius: '0px', border: '0px', paddingBottom: '20px'}}>
                                        <Card.Header style={{ border: '0px', color: config.KSTColors.MAIN, backgroundColor: '#eeeff5', textAlign: 'center', paddingBottom: '0px'}}>
                                            Master or Authorized Person
                                        </Card.Header>
                                        <Card.Body style={{ border: '0px', paddingBottom: '0px' }}>
                                            <Row>
                                                <Col  style={{ textAlign: 'center' }}>
                                                    <div style={{ textAlign: 'center', display: 'inline-flex', position: "relative", width: '400px', height: '100px'}}>
                                                        {this.state.masterSignAllowed?
                                                        (<div style={{ position: 'absolute', backgroundColor : "white", border: '1px solid lightgrey'}}>
                                                            <SignatureCanvas 
                                                            canvasProps={{width: '400', height: '100'}}
                                                            ref={(ref) => {
                                                                if (this.state.authorisedPersonSignature!=='' && ref) {
                                                                    if (ref.isEmpty()) {
                                                                        ref.fromDataURL(this.state.authorisedPersonSignature);
                                                                    }
                                                                }
                                                                this.authorisedPersonSignatureCanvas = ref 
                                                            }}/>
                                                        </div>):
                                                        <div style={{ position: 'absolute', height: '100px', width: '400px', backgroundColor: 'rgba(0, 0, 0, 0)' }}>
                                                            <div style={{ paddingTop: '7px', paddingLeft: '40px', paddingRight: '40px' }}>
                                                                <FormControl
                                                                    type="password"
                                                                    id={'masterPassword'} 
                                                                    aria-describedby={'masterPassword'} 
                                                                    value={this.state.masterPassword}
                                                                    onChange={e=>this.setState({ masterPassword: e.target.value })}
                                                                    name={'masterPassword'}
                                                                    className={"VesselReportAckInputBox"}
                                                                    placeholder = 'PASSWORD'
                                                                    autoComplete="new-password"
                                                                />
                                                            </div>
                                                            <div className={"VesselReportError"}>
                                                                {this.state.masterPasswordError}
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3px' }}>
                                                                <Button variant="contained" color="primary" style={{ backgroundColor: '#04588e', color: 'white', display: 'flex', alignItems: 'center', fontSize: '12px' }} 
                                                                onClick={this.unlockMasterSign}>
                                                                    <span style={{ marginLeft: '5px' }}>Unlock</span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        }
                                                        {this.state.masterSignAllowed?
                                                            <div style={{ position: "absolute", right: '0px' }}>
                                                                    <span className="material-icons"  onClick={()=>{this.authorisedPersonSignatureCanvas.clear()}}>
                                                                        settings_backup_restore
                                                                    </span>
                                                                <span className="material-icons"  onClick={()=>{
                                                                    if (this.authorisedPersonSignatureCanvas.isEmpty()) {
                                                                        this.setState({ authorisedPersonSignature: '' });
                                                                    } else {
                                                                        this.setState({ authorisedPersonSignature: this.authorisedPersonSignatureCanvas.toDataURL("image/png") });
                                                                    }
                                                                    this.setState({ masterSignAllowed: false, masterPassword: '', masterPasswordError: '' });
                                                                }}>
                                                                    lock_open
                                                                </span>
                                                            </div>:
                                                            <div style={{ position: "absolute", right: '0px' }}>
                                                                <span className="material-icons">
                                                                    lock
                                                                </span>
                                                            </div>
                                                        }
                                                        
                                                        
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row style={{ margin: '10px', justifyContent: 'center', verticalAlign: 'center' }}>
                                                <div style={{ width: '400px' }}>
                                                    <Row>
                                                        <Col xs={1}>
                                                        </Col>
                                                        <Col xs={3}>
                                                            Name
                                                        </Col>
                                                        <Col xs={6}>
                                                                <FormControl
                                                                    type="text"
                                                                    id='authorisedPersonName' 
                                                                    aria-describedby='authorisedPersonName' 
                                                                    value={this.state.authorisedPersonName}
                                                                    onChange={(e)=>{
                                                                        let temp = {...this.state}
                                                                        temp.authorisedPersonName = e.target.value
                                                                        this.setState(temp);
                                                                    }}
                                                                    name='authorisedPersonName'
                                                                />
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={12} xl={6} style={{ padding: '0px' }}>
                                    <Card style={{ margin: '0px', color: config.KSTColors.MAIN, backgroundColor: '#eeeff5', borderRadius: '0px', border: '0px', paddingBottom: '20px'}}>
                                        <Card.Header style={{ border: '0px', color: config.KSTColors.MAIN, backgroundColor: '#eeeff5', textAlign: 'center', paddingBottom: '0px'}}>
                                            Seafarer
                                        </Card.Header>
                                        <Card.Body style={{ border: '0px', paddingBottom: '0px' }}>
                                            <Row>
                                                <Col  style={{ textAlign: 'center' }}>
                                                    <div style={{ textAlign: 'center', display: 'inline-flex', position: "relative", width: '400px', height: '100px'}}>
                                                        <div style={{ position: 'absolute', backgroundColor : "white", border: '1px solid lightgrey'}}>
                                                            <SignatureCanvas 
                                                            canvasProps={{width: '400', height: '100'}}
                                                            ref={(ref) => { this.seafarerCanvas = ref }}
                                                            />
                                                        </div>
                                                        <div style={{ position: "absolute", right: '0px' }}>
                                                            <span className="material-icons"  onClick={()=>{this.seafarerCanvas.clear()}}>
                                                                settings_backup_restore
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row style={{ margin: '10px', justifyContent: 'center', verticalAlign: 'center' }}>
                                                <div style={{ width: '400px' }}>
                                                    <Row>
                                                        <Col xs={1}>
                                                        </Col>
                                                        <Col xs={3}>
                                                            Name
                                                        </Col>
                                                        <Col xs={6}>
                                                                <FormControl
                                                                    type="text"
                                                                    id='seafarerName' 
                                                                    aria-describedby='seafarerName' 
                                                                    value={this.state.seafarerName}
                                                                    onChange={(e)=>{
                                                                        let temp = {...this.state}
                                                                        temp.seafarerName = e.target.value
                                                                        this.setState(temp);
                                                                    }}
                                                                    name='seafarerName'
                                                                />
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <div style={{ marginLeft: 'auto', paddingRight: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} onClick={()=> {this.submitCrewWorkAndRestHour()}} disabled={this.state.isSubmit}>
                        {this.state.isSubmit===true?
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                        :
                            <SendIcon style={{ color: config.KSTColors.ICON }}/>
                        }
                        <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Submit</span>
                    </Button>
                </div>
                <div className="CrewWorkAndRestHourMain">
                    <div style={{ paddingBottom: '10px' }}>All duty tug handlers are to be sufficiently rested before taking over their duties.</div>
                    <div style={{ paddingBottom: '10px' }}>Refer to ILO-MLC Regulations 2.3 - Hours of Work and Hours of rest, as follows</div>
                    <div style={{ paddingBottom: '10px' }}>Minimum hours of rest shall not be less than:</div>
                    <div style={{ paddingBottom: '10px', paddingLeft: '40px' }}>(i) Ten hours in any 24-hour period: and</div>
                    <div style={{ paddingBottom: '10px', paddingLeft: '40px' }}>(ii) 77 hours in any seven-day period.</div>
                    <div style={{ paddingBottom: '10px' }}>Hours of rest may be divided into no more than two periods, one of which shall be at least 6 hours in length, and the interval between consecutive periods of rest shall not exceed 14 hours</div>
                    <div style={{ paddingBottom: '10px' }}>MLC 08/02 Revision A (Effective Date: 09/07/2013)</div>
                </div>

            </Container>
        :
            <FullScreenSpinner text={"Loading..."}/>
        );
    }

}

export default withRouter(withMessageManager(CrewWorkAndRestHour));