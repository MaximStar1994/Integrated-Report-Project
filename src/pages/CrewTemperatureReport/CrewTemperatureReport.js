import React, { Component } from 'react';
import CrewTemperatureReportApi from '../../model/CrewTemperatureReport';
import './CrewTemperatureReport.css';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import { DatePicker } from "@material-ui/pickers";
import InputAdornment from '@material-ui/core/InputAdornment';
import Spinner from 'react-bootstrap/Spinner'
import SendIcon from '@material-ui/icons/Send';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner';
import { withLayoutManager } from '../../Helper/Layout/layout';
import { withMessageManager } from '../../Helper/Message/MessageRenderer';
import config from '../../config/config';

class CrewTemperatureReport extends Component {
    constructor(){
        super();
        this.crewTemperatureReportAPI = new CrewTemperatureReportApi();
        this.state={
            loaded: false,
            vesselId:null,
            vesselName: '',
            crew: [],
            activeCrew: 0,
            submitting: false,
            saving: false
        }
    }
    
    IsEmpty = val => val == undefined || val == null || val.toString() == '';

    getData = async () => {
        try{
            this.setState({ loaded: false });
            // await this.crewTemperatureReportAPI.ForceSyncCrewTemperatureReport();
            this.crewTemperatureReportAPI.CanViewCrewTemperaturePage( async (value, err) => {
                if(!err){
                    if (value === true || value === 'true') {
                        try{
                            let checkForToday = await this.crewTemperatureReportAPI.CheckSubmissionForToday();
                            if(checkForToday===false){
                                let crewPlanningData = await this.crewTemperatureReportAPI.GetOpenCrewTemperatureReportForToday();
                                if(crewPlanningData instanceof Array && crewPlanningData.length>0){
                                    this.setState(crewPlanningData[0]);
                                }
                                else{
                                    let vesselData = await this.crewTemperatureReportAPI.GetVesselData();
                                    let crewTemplate = [];
                                    vesselData.crew.forEach(element => {
                                        if(!this.IsEmpty(element.name)){
                                            crewTemplate.push({
                                                crewId: element.crew_id,
                                                employeeNo: element.employee_no,
                                                name: element.name,
                                                temp1: null,
                                                temp2: null,
                                                symptomsInLast14Days: false,
                                                symptoms: null,
                                                firstARISymptoms: null,
                                                contactWithSuspected: null,
                                                testDate: null,
                                                pcr: null,
                                                art: null,
                                            })
                                        }
                                    });
                                    this.setState({vesselId: parseInt(vesselData.id), vesselName: vesselData.name, crew: crewTemplate});
                                }
                            }
                            else if(checkForToday===true){
                                this.props.setMessages([{type : "danger", message : "Crew Temperature already submitted for today!"}]);
                                window.scrollTo(0,0);
                                this.props.history.push('/operation');
                            }
                            this.setState({ loaded: true });

                        }catch(err){
                            this.props.setMessages([{type : "danger", message : "No Internet!"}]);
                            window.scrollTo(0,0);
                            this.props.history.push('/operation');
                        }
                    }
                    else if(value===false){
                        this.props.setMessages([{type : "danger", message : "Another Device using the Crew Temperature Record Form"}]);
                        window.scrollTo(0,0);
                        this.props.history.push('/operation');
                    }
                }
                else{
                    this.props.setMessages([{type : "danger", message : "No Internet!"}]);
                    window.scrollTo(0,0);
                    this.props.history.push('/operation');
                }
            });
        }
        catch(err){
            console.log(err);
            this.props.setMessages([{type : "danger", message : "Unable to load Crew Temperature Report! No internet!"}]);
            this.props.history.push('/operation');
        }
    }
    componentDidMount(){
        this.getData();
    }
    componentWillUnmount(){
        this.crewTemperatureReportAPI.UnlockCrewTemperatureReport((value, err)=> {
            console.log('Tying to unlock: ', value, err);
            localStorage.removeItem("CrewTemperatureLock");
        });
    }
    saveCrewTemperatureData = async() => {
        this.setState({ saving: true });
        let temp = {...this.state};
        delete temp.loaded;
        delete temp.activeCrew;
        delete temp.submitting;
        delete temp.saving;
        try{
            await this.crewTemperatureReportAPI.SaveCrewTemperatureReport(temp);
            this.props.setMessages([{type : "success", message : "Saved!"}]);
            this.props.history.push('/operation');
        }
        catch(err){
            this.props.setMessages([{type : "danger", message : "Unable to save!"}]);
            console.log("Error at saving crew temperature data: ", err);
        }
        this.setState({ saving: false });
        
    }
    validateForm = () =>{
        let valid = true;
        let missingElementCrewName = '';
        let missingElementKey = '';
        let reason = '';
        this.state.crew.every((element) => {
            if(this.IsEmpty(element.temp1)){
                valid = false;
                missingElementKey = 'Temperature 1';
                missingElementCrewName = element.name;
                reason = "Missing";
            }
            else if(parseFloat(element.temp1)<35 || parseFloat(element.temp1)>45){
                valid = false;
                missingElementKey = 'Temperature 1';
                missingElementCrewName = element.name;
                reason = "Invalid";
            }
            else if(this.IsEmpty(element.temp2)){
                valid = false;
                missingElementKey = 'Temperature 2';
                missingElementCrewName = element.name;
                reason = "Missing";
            }
            else if(parseFloat(element.temp2)<35 || parseFloat(element.temp2)>45){
                valid = false;
                missingElementKey = 'Temperature 2';
                missingElementCrewName = element.name;
                reason = "Invalid";
            }
            else if(this.IsEmpty(element.symptomsInLast14Days)){
                valid = false;
                missingElementKey = '"Do you have any of the following symptoms now or within the last 14 days"';
                missingElementCrewName = element.name;
                reason = "Missing";
            }
            return valid;
        })
        if(valid===false){
            if(reason==='Missing'){
                this.props.setMessages([{type : "danger", message : `Missing ${missingElementKey} for ${missingElementCrewName}`}]);
                console.log(`Missing ${missingElementKey} for ${missingElementCrewName}`);
            }
            else if(reason==='Invalid'){
                this.props.setMessages([{type : "danger", message : `Invalid ${missingElementKey} for ${missingElementCrewName}. It needs to be between 35 and 45`}]);
                console.log(`Invalid ${missingElementKey} for ${missingElementCrewName}. It needs to be between 35 and 45`);
            }
        }
        return valid;
    }
    submitCrewTemperatureData = async() => {
        this.setState({ submitting: true });
        if(this.validateForm()===true){
            try{
                let temp = {...this.state};
                delete temp.loaded;
                delete temp.activeCrew;
                delete temp.submitting;
                delete temp.saving;
                temp.dateSubmitted = new Date();
                await this.crewTemperatureReportAPI.SaveCrewTemperatureReport(temp);
                await this.crewTemperatureReportAPI.SubmitCrewTemperatureReport(temp.dateSubmitted);
                this.props.setMessages([{type : "success", message : "Submitted!"}]);
                this.props.history.push('/operation');
            }
            catch(err){
                this.props.setMessages([{type : "danger", message : "Unable to submit! Try again later with Internet Connectivity!"}]);
                console.log("Error at submitting crew data: ", err);
            }
        }
        this.setState({ submitting: false });
    }
    changeCrewTemperatureReport = (key, value) => {
        let temp = this.state.crew;
        temp[this.state.activeCrew][key] = value;
        this.setState({ crew: temp });
    }
    render(){
        return(
            <React.Fragment>
                {this.state.loaded===true?
                    <Container fluid className='Disinfection'>
                        <Row>
                            <Col style={{ padding: '0px' }}>
                                <div className='crewTemperatureHeaderBase'>
                                    <div  className="crewTemperatureHeaderBackground">
                                        <div className="VesselReportHeading">
                                                CREW DAILY TEMPERATURE REPORT
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', paddingRight: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} onClick={()=> {this.submitCrewTemperatureData()}} disabled={this.state.submitting||this.state.saving}>
                                            {this.state.submitting===true?
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                                            :
                                                <SendIcon style={{ color: config.KSTColors.ICON }}/>
                                            }
                                            <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Submit</span>
                                        </Button>
                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} onClick={()=> {this.saveCrewTemperatureData()}} disabled={this.state.submitting||this.state.saving}>
                                            {this.state.saving===true?
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                                            :
                                                <SaveAltIcon style={{ color: config.KSTColors.ICON }}/>
                                            }
                                            <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Save</span>
                                        </Button>
                                    </div>
                                </div> 
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} xs={12} className='CrewTempCard'>
                                <div className='CrewInTempReport'>
                                    <div className='CrewNameHeading'>
                                        Crew Names
                                    </div>
                                    {this.state.crew.map((crewElement, idx) => {
                                        if(crewElement.name!==null && crewElement.name!==''){
                                            return(
                                            crewElement.name!==null&&<div className='CrewDetail' key={idx}>
                                                <div className={`CrewName ${this.state.activeCrew===idx?'CrewNameActive':'CrewNameNormal'}`} onClick={()=>this.setState({activeCrew: idx})}>
                                                        {crewElement.name}
                                                </div>
                                                <div className='Indicators'>
                                                    {crewElement.temp1!==null&&crewElement.temp1!==""?<div className='Indicator1'/>:<div className='NoIndicator'/>}
                                                    {crewElement.temp2!==null&&crewElement.temp2!==""?<div className='Indicator1' style={{ marginLeft: '30px' }}/>:<div className='NoIndicator' style={{ marginLeft: '30px' }}/>}

                                                </div>
                                            </div>
                                            )
                                        }
                                        else {
                                            return null;
                                        }
                                    })}
                                </div>
                            </Col>
                            <Col xs={12} md={6} className='CrewTempCard'>
                                <div className='Temperatures'>
                                    <div className="Temperature">
                                        <Form.Group>
                                            <Form.Label>Temperature 1</Form.Label>
                                            <InputGroup style={{ alignItems: 'center' }}>
                                                <Form.Control 
                                                    style={{ color: config.KSTColors.MAIN, fontWeight: '10' }} 
                                                    type='number'
                                                    id='temp1' 
                                                    aria-describedby='temp1' 
                                                    value={this.state.crew[this.state.activeCrew]['temp1']===null?"":this.state.crew[this.state.activeCrew]['temp1']}
                                                    onChange={e => this.changeCrewTemperatureReport('temp1', e.target.value)}
                                                    name='temp1'
                                                />
                                                &deg;C
                                            </InputGroup>
                                        </Form.Group>
                                    </div>
                                    <div className="Temperature">
                                        <Form.Group style={{ color: config.KSTColors.MAIN }}>
                                            <Form.Label>Temperature 2</Form.Label>
                                            <InputGroup style={{ alignItems: 'center' }}>
                                                <Form.Control 
                                                    style={{ color: config.KSTColors.MAIN, fontWeight: '10' }} 
                                                    type='number'
                                                    id='temp2' 
                                                    aria-describedby='temp2' 
                                                    value={this.state.crew[this.state.activeCrew]['temp2']===null?"":this.state.crew[this.state.activeCrew]['temp2']}
                                                    onChange={e => this.changeCrewTemperatureReport('temp2', e.target.value)}
                                                    name='temp2'
                                                />
                                                &deg;C
                                            </InputGroup>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className='TempFormElement'>
                                    <div style={{ width: '70%', display: 'flex', alignItems: 'center' }}>
                                        Do you have any of the following symptoms now or within the last 14 days: Cough, smell/taste impairment, fever, breathing difficulties, body aches, headaches, fatigue, sore throat, diarrhoea, and/ or running nose (even if your symptoms are mild)?
                                    </div>
                                    <div style={{ border: '1px solid #707070', width :'30%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Form.Check
                                            type='radio' 
                                            style={{ color: config.KSTColors.MAIN, fontWeight: '10' }}  
                                            id={'symptomsInLast14Days-Yes'} 
                                            aria-describedby={'symptomsInLast14Days-Yes'} 
                                            checked={this.state.crew[this.state.activeCrew]['symptomsInLast14Days']===true}
                                            onChange={()=>this.changeCrewTemperatureReport('symptomsInLast14Days', true)}
                                            name={'symptomsInLast14Days-Yes'}
                                            label={'Yes'}
                                            inline
                                        />
                                        <Form.Check
                                            type='radio' 
                                            style={{ color: config.KSTColors.MAIN, fontWeight: '10' }}  
                                            id={'symptomsInLast14Days-No'} 
                                            aria-describedby={'symptomsInLast14Days-No'} 
                                            checked={this.state.crew[this.state.activeCrew]['symptomsInLast14Days']===false}
                                            onChange={()=>this.changeCrewTemperatureReport('symptomsInLast14Days', false)}
                                            name={'symptomsInLast14Days-No'}
                                            label={'No'}
                                            inline
                                        />
                                    </div>
                                </div>
                                {this.state.crew[this.state.activeCrew]['symptomsInLast14Days']===true&&
                                <React.Fragment>
                                    <div className='TempFormElement'>
                                        <div style={{ width: '70%', display: 'flex', alignItems: 'center' }}>
                                        <React.Fragment>
                                                    <Form.Control 
                                                        style={{ border: '1px solid #707070', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0px', color: '#04588E' }}
                                                        as='textarea' 
                                                        rows={4}
                                                        id={`symptoms`} 
                                                        aria-describedby={`symptoms`} 
                                                        value={this.state.crew[this.state.activeCrew]['symptoms']===null?'':this.state.crew[this.state.activeCrew]['symptoms']}
                                                        onChange={(e)=>this.changeCrewTemperatureReport('symptoms', e.target.value)}
                                                        name={`symptoms`}
                                                        placeholder='If yes, please provide all acute respiratory infection (ARI) symptoms below.'
                                                    />
                                            </React.Fragment>
                                        </div>
                                    </div>
                                    <div className='TempFormElement'>
                                        <div style={{ width: '70%', display: 'flex', alignItems: 'center' }}>
                                            When did you first experience the first acute respiratory infection (ARI) symptoms?
                                        </div>
                                        <div style={{ border: '1px solid #707070', width :'30%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div className="TimePicker" style={{width: '100%'}}>
                                                <DatePicker
                                                    id={`firstARISymptoms`} 
                                                    aria-describedby={`firstARISymptoms`} 
                                                    value={this.state.crew[this.state.activeCrew]['firstARISymptoms']===null?null:this.state.crew[this.state.activeCrew]['firstARISymptoms']}
                                                    onChange={e => this.changeCrewTemperatureReport('firstARISymptoms', e)}
                                                    name={`firstARISymptoms`}
                                                    format="dd / MM / yyyy"
                                                    InputProps={{
                                                        endAdornment: (
                                                        <InputAdornment position="end" style={{ paddingRight: '5px', color: '#067FAA' }}>
                                                            <span className="material-icons">date_range</span>
                                                        </InputAdornment>
                                                        )
                                                    }}
                                                    className={"VesselReportFillableBox"}   
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='TempFormElement'>
                                        <div style={{ width: '70%', display: 'flex', alignItems: 'center'}}>
                                            Have you been in contact with anyone who is suspected to have or/has been diagnosed with COVID-19 within the last 14 days?
                                        </div>
                                        <div style={{ width :'30%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Form.Check
                                                type='radio' 
                                                style={{ color: config.KSTColors.MAIN, fontWeight: '10' }}  
                                                id={'contactWithSuspected-Yes'} 
                                                aria-describedby={'contactWithSuspected-Yes'} 
                                                checked={this.state.crew[this.state.activeCrew]['contactWithSuspected']===true}
                                                onChange={()=>this.changeCrewTemperatureReport('contactWithSuspected', true)}
                                                name={'contactWithSuspected-Yes'}
                                                label={'Yes'}
                                                inline
                                            />
                                            <Form.Check
                                                type='radio' 
                                                style={{ color: config.KSTColors.MAIN, fontWeight: '10' }}  
                                                id={'contactWithSuspected-No'} 
                                                aria-describedby={'contactWithSuspected-No'} 
                                                checked={this.state.crew[this.state.activeCrew]['contactWithSuspected']===false}
                                                onChange={()=>this.changeCrewTemperatureReport('contactWithSuspected', false)}
                                                name={'contactWithSuspected-No'}
                                                label={'No'}
                                                inline
                                            />
                                        </div>
                                    </div>
                                    <div className='TempFormElement'>
                                        <div style={{ width: '70%', display: 'flex', alignItems: 'center' }}>
                                            Please indicate below the latest results of your PCR & ART test.
                                        </div>
                                        <div style={{ border: '1px solid #707070', width :'30%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div className="TimePicker" style={{width: '100%'}}>
                                                <DatePicker
                                                    id={`testDate`} 
                                                    aria-describedby={`testDate`} 
                                                    value={this.state.crew[this.state.activeCrew]['testDate']===null?null:this.state.crew[this.state.activeCrew]['testDate']}
                                                    onChange={e => this.changeCrewTemperatureReport('testDate', e)}
                                                    name={`testDate`}
                                                    format="dd / MM / yyyy"
                                                    InputProps={{
                                                        endAdornment: (
                                                        <InputAdornment position="end" style={{ paddingRight: '5px', color: '#067FAA' }}>
                                                            <span className="material-icons">date_range</span>
                                                        </InputAdornment>
                                                        )
                                                    }}
                                                    className={"VesselReportFillableBox"}   
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='TempFormElement'>
                                        <div style={{ width: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        </div>
                                        <div style={{ width :'10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                Not Taken
                                        </div>
                                        <div style={{ width :'10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                Positive
                                        </div>
                                        <div style={{ width :'10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                Negative
                                        </div>
                                    </div>
                                    <div className='TempFormElement'>
                                        <div style={{ width: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            PCR TEST Results
                                        </div>
                                        <div style={{ width :'10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>  
                                            <Form.Check
                                                type='radio' 
                                                style={{ color: config.KSTColors.MAIN, fontWeight: '10' }}  
                                                id={'PCR-Not Taken'} 
                                                aria-describedby={'PCR-Not Taken'} 
                                                checked={this.state.crew[this.state.activeCrew]['pcr']===null}
                                                onChange={()=>this.changeCrewTemperatureReport('pcr', null)}
                                                name={'PCR-Not Taken'}
                                                inline
                                            />
                                        </div>
                                        <div style={{ width :'10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>  
                                            <Form.Check
                                                type='radio' 
                                                style={{ color: config.KSTColors.MAIN, fontWeight: '10' }}  
                                                id={'PCR-Yes'} 
                                                aria-describedby={'PCR-Yes'} 
                                                checked={this.state.crew[this.state.activeCrew]['pcr']===true}
                                                onChange={()=>this.changeCrewTemperatureReport('pcr', true)}
                                                name={'PCR-Yes'}
                                                inline
                                            />
                                        </div>
                                        <div style={{ width :'10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>  
                                            <Form.Check
                                                type='radio' 
                                                style={{ color: config.KSTColors.MAIN, fontWeight: '10' }}  
                                                id={'pcr-No'} 
                                                aria-describedby={'pcr-No'} 
                                                checked={this.state.crew[this.state.activeCrew]['pcr']===false}
                                                onChange={()=>this.changeCrewTemperatureReport('pcr', false)}
                                                name={'pcr-No'}
                                                inline
                                            />
                                        </div>
                                    </div>
                                    <div className='TempFormElement'>
                                        <div style={{ width: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            ART TEST Results
                                        </div>
                                        <div style={{ width :'10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>  
                                            <Form.Check
                                                type='radio' 
                                                style={{ color: config.KSTColors.MAIN, fontWeight: '10' }}  
                                                id={'art-Not Taken'} 
                                                aria-describedby={'art-Not Taken'} 
                                                checked={this.state.crew[this.state.activeCrew]['art']===null}
                                                onChange={()=>this.changeCrewTemperatureReport('art', null)}
                                                name={'art-Not Taken'}
                                                inline
                                            />
                                        </div>
                                        <div style={{ width :'10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>  
                                            <Form.Check
                                                type='radio' 
                                                style={{ color: config.KSTColors.MAIN, fontWeight: '10' }}  
                                                id={'art-Yes'} 
                                                aria-describedby={'art-Yes'} 
                                                checked={this.state.crew[this.state.activeCrew]['art']===true}
                                                onChange={()=>this.changeCrewTemperatureReport('art', true)}
                                                name={'art-Yes'}
                                                inline
                                            />
                                        </div>
                                        <div style={{ width :'10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>  
                                            <Form.Check
                                                type='radio' 
                                                style={{ color: config.KSTColors.MAIN, fontWeight: '10' }}  
                                                id={'art-No'} 
                                                aria-describedby={'art-No'} 
                                                checked={this.state.crew[this.state.activeCrew]['art']===false}
                                                onChange={()=>this.changeCrewTemperatureReport('art', false)}
                                                name={'art-No'}
                                                inline
                                            />
                                        </div>
                                    </div>
                                </React.Fragment>
                                }
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

export default withLayoutManager(withMessageManager(CrewTemperatureReport));
