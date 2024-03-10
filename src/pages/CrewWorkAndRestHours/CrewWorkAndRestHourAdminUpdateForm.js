import React, {Component} from 'react';
import './CrewWorkAndRestHour.css';
import CrewWorkAndRestHourApi from '../../model/CrewWorkAndRestHour';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Select, MenuItem } from '@material-ui/core';
import { Button } from '@material-ui/core';
import Spinner from 'react-bootstrap/Spinner'
import SendIcon from '@material-ui/icons/Send';
import moment from 'moment';
import config from '../../config/config';
import {withMessageManager} from '../../Helper/Message/MessageRenderer'
import { withRouter } from "react-router-dom"
import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner';
const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const IsEmpty = val => {
    return val == undefined || val == null || val.toString() == '' || (val instanceof Array && val.length===0) || val ==={}
}
class CrewWorkAndRestHourAdminUpdateForm extends Component {
    constructor(){
        super();
        this.crewWorkAndRestHourApi = new CrewWorkAndRestHourApi();
        this.state={
            vesselList: [],
            crewList: [],
            activeCrewList: [],
            dateList: [],
            activeVesselId: null,
            activeCrewEmployeeNo: null,
            month: null,
            year: null,
            date: null,
            shift: null,
            isWorking: 0,
            loaded: false,
            isSubmit: false,
        }
    }
    async getData(){
        this.setState({ loaded: false })
        try{
            let temp = await this.crewWorkAndRestHourApi.GetCrewList();
            let activeVesselId = null;
            let activeCrewEmployeeNo = null;
            let activeCrewList = [...temp.crew];
            let month = moment().month();
            let year = moment().year();
            if(month===0){
                month = 11
                year = year-1;
            }
            else{
                month = month-1
            } 
            let dateList = [];
            for(let i=1; i<=moment().set('year', year).set('month', month).endOf('month').date(); i++){
                dateList.push(i);
            }
            this.setState({ vesselList: [...temp.vessel], crewList: [...temp.crew], activeCrewList: activeCrewList, activeVesselId: activeVesselId, activeCrewEmployeeNo: activeCrewEmployeeNo, month: month, year: year, dateList: dateList, loaded: true });
        }
        catch(e){
            console.log(e);
            this.props.setMessages([{type : "danger", message : "Unable to load Crew Work and Rest Hours Update Form! No internet!"}]);
            this.props.history.push('/assetmanagement');
        }

    }
    onVesselChange(vesselId){
        if(IsEmpty(vesselId)){
            this.setState({ activeCrewList: [...this.state.crewList] })
        }
        else{
            let temp = [...this.state.crewList];
            temp = temp.filter(element=>element.vesselId===vesselId)
            this.setState({ activeVesselId: vesselId, activeCrewList: temp, activeCrewIndex: null });
        }
    }
    onCrewChange(activeCrewEmployeeNo){
        this.setState({ activeCrewEmployeeNo: activeCrewEmployeeNo });
    }
    componentDidMount(){
        this.getData();
    }
    submitForm = async() => {
        if(this.state.activeCrewEmployeeNo===undefined||this.state.activeCrewEmployeeNo===null){
            this.props.setMessages([{type : "danger", message : "Crew Name input is missing!"}]);
        }
        else if(typeof(this.state.activeCrewEmployeeNo)==='string'&&this.state.activeCrewEmployeeNo.trim()===""){
            this.props.setMessages([{type : "danger", message : "Crew Name input is missing!"}]);
        }
        else if(this.state.date===null||this.state.date===""){
            this.props.setMessages([{type : "danger", message : "Date input is missing!"}]);
        }
        else if(this.state.shift===null||this.state.shift===""){
            this.props.setMessages([{type : "danger", message : "Shift input is missing!"}]);
        }
        else if(this.state.isWorking===null||this.state.isWorking===""||this.state.isWorking===0){
            this.props.setMessages([{type : "danger", message : "Working / Resting input is missing!"}]);
        }
        else{
            this.setState({isSubmit: true});
            try{
                let temp = {
                    employeeNo: this.state.activeCrewEmployeeNo,
                    crewName: this.state.crewList.filter(element=>element.employeeNo===this.state.activeCrewEmployeeNo)[0].crewName,
                    crewId: this.state.crewList.filter(element=>element.employeeNo===this.state.activeCrewEmployeeNo)[0].crewId,
                    month: this.state.month,
                    year: this.state.year,
                    date: this.state.date,
                    shift: this.state.shift,
                    isWorking: this.state.isWorking
                }
                temp.dateSubmitted = new Date();
                await this.crewWorkAndRestHourApi.PostCrewRestAndWorkHourAdminUpdateData({crewWorkAndRestAdminUpdateData: temp})
                this.setState({isSubmit: false});
                this.props.setMessages([{type : "success", message : "Submitted!"}]);
                this.props.history.push('/crewworkandresthourupdate');
            }
            catch(err){
                this.setState({isSubmit: false});
                this.props.setMessages([{type : "danger", message : "Unable to submit! Try again later with Internet Connectivity!"}]);
                console.log("Error at submitting data: ", err);
            }
        }
    }
    render(){
        return(
            this.state.loaded===true?
            <Container fluid className='CrewWorkAndRestHour'>
                <Row>
                    <Col style={{ padding: '0px' }}>
                        <div className='crewWorkAndRestHourHeaderBase'>
                            <div  className="crewWorkAndRestHourHeaderBackground">
                                <div className="crewWorkAndRestHourHeading">
                                        CREW WORK AND REST HOURS UPDATE RECORDS
                                </div>
                            </div>
                        </div> 
                    </Col>
                </Row>
                <Row className="CrewWorkAndRestHourMain">
                    <Col>
                        <Row>
                            <Col>
                                <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Name of Vessel</Form.Label>
                            </Col>
                            <Col>
                                <div style={{ width: '100%' }} className="CrewWorkAndRestHourSelectionBox">
                                    <Select style={{ color: config.KSTColors.MAIN }} 
                                        type='selection' 
                                        disableUnderline 
                                        id={"Name of Vessel"} 
                                        aria-describedby={"Name of Vessel"} 
                                        value={this.state.activeVesselId===null?"":this.state.activeVesselId}
                                        onChange={e=> this.onVesselChange(e.target.value)}
                                        className="CrewWorkAndRestHourSelectionFillableBox"   
                                    >
                                        {this.state.vesselList.map(element => <MenuItem value={element.vesselId} key={element.vesselId}> {element.vesselName}</MenuItem>)}
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '10px' }}>
                            <Col>
                                <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Name of Crew</Form.Label>
                            </Col>
                            <Col>
                                <div style={{ width: '100%' }} className="CrewWorkAndRestHourSelectionBox">
                                    <Select style={{ color: config.KSTColors.MAIN }} 
                                        type='selection' 
                                        disableUnderline 
                                        id={"Name of Crew"} 
                                        aria-describedby={"Name of Crew"} 
                                        value={this.state.activeCrewEmployeeNo===null?"":this.state.activeCrewEmployeeNo}
                                        onChange={e=> this.onCrewChange(e.target.value)}
                                        className="CrewWorkAndRestHourSelectionFillableBox"   
                                    >
                                        {this.state.activeCrewList.map(element => <MenuItem value={element.employeeNo} key={element.employeeNo}> {element.crewName}</MenuItem>)}
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '10px' }}>
                            <Col>
                                <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Shift</Form.Label>
                            </Col>
                            <Col>
                                <div style={{ width: '100%' }} className="CrewWorkAndRestHourSelectionBox">
                                    <Select style={{ color: config.KSTColors.MAIN }} 
                                        type='selection' 
                                        disableUnderline 
                                        id={"Shift"} 
                                        aria-describedby={"Shift"} 
                                        value={this.state.shift===null?"":this.state.shift}
                                        onChange={e=> this.setState({shift: e.target.value})}
                                        className="CrewWorkAndRestHourSelectionFillableBox"   
                                    >
                                        <MenuItem value={1}>Morning Shift (0730 - 1930)</MenuItem>
                                        <MenuItem value={2}>Evening Shift (1930 - 0730)</MenuItem>
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={0} md={4}/>
                    <Col>
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
                                <Form.Label style={{ color: config.KSTColors.MAIN, height: '100%', display: 'flex', alignItems: 'center' }}>Date</Form.Label>
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
                        <Row style={{ marginTop: '10px' }}>
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
                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '10px' }}>
                                <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} onClick={this.submitForm} disabled={this.state.isSubmit}>
                                    {this.state.isSubmit===true?
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                                    :
                                        <SendIcon style={{ color: config.KSTColors.ICON }}/>
                                    }
                                    <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Submit</span>
                                </Button>
                            </div>
                        </Row>
                    </Col>
                </Row>
            </Container>
            :
            <FullScreenSpinner text={"Loading..."}/>
        );
    }

}

export default withRouter(withMessageManager(CrewWorkAndRestHourAdminUpdateForm));