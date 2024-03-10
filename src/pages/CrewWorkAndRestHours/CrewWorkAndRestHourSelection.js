import React, {Component} from 'react';
import './CrewWorkAndRestHour.css';
import CrewWorkAndRestHourApi from '../../model/CrewWorkAndRestHour';
import { Container, Row, Col, Form, Card, FormControl } from 'react-bootstrap';
import { Select, MenuItem } from '@material-ui/core';
import SignatureCanvas from 'react-signature-canvas';
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
class CrewWorkAndRestHourSelection extends Component {
    constructor(){
        super();
        this.crewWorkAndRestHourApi = new CrewWorkAndRestHourApi();
        this.state={
            vesselList: [],
            crewList: [],
            activeCrewList: [],
            activeVesselId: null,
            activeCrewEmployeeNo: null,
            loaded: false,
            month: null,
            year: null,
            prevMonth: false,
        }
    }
    async getData(){
        this.setState({ loaded: false })
        try{
            let temp = await this.crewWorkAndRestHourApi.GetCrewList();
            let userData = JSON.parse(localStorage.getItem('user'));
            let activeVesselId = null;
            let activeCrewEmployeeNo = null;
            let activeCrewList = [...temp.crew];
            if(userData.vessels.length>0){
                let userVesselId = parseInt(userData.vessels[0].vesselId);
                temp.vessel.forEach(element => {
                    if(element.vesselId === userVesselId){
                        activeVesselId = element.vesselId
                    }
                });
                activeCrewList = temp.crew.filter(element => element.vesselId === userVesselId);
            }
            let month = moment().month();
            let year = moment().year();
            this.setState({ vesselList: [...temp.vessel], crewList: [...temp.crew], activeCrewList: activeCrewList, activeVesselId: activeVesselId, activeCrewEmployeeNo: activeCrewEmployeeNo, month: month, year: year, loaded: true });
        }
        catch(e){
            console.log(e);
            this.props.setMessages([{type : "danger", message : "Unable to load Crew Work and Rest Hours! No internet!"}]);
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
    render(){
        return(
            this.state.loaded===true?
            <Container fluid className='CrewWorkAndRestHour'>
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
                                        {this.state.activeCrewList.map(element => <MenuItem value={element.employeeNo} key={element.crewId}> {element.crewName}</MenuItem>)}
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
                                <div style={{ width: '100%', marginBottom: '5px' }} className="CrewWorkAndRestHourSelectionBox">
                                    <Select style={{ color: config.KSTColors.MAIN }} 
                                        type='selection' 
                                        disableUnderline 
                                        id={"MonthAndYear"} 
                                        aria-describedby={"MonthAndYear"} 
                                        value={this.state.prevMonth}
                                        onChange={e=> this.setState({ prevMonth: e.target.value })}
                                        className="CrewWorkAndRestHourSelectionFillableBox"   
                                    >
                                        {moment().month()===0?
                                            <MenuItem value={true} key={`${monthsList[11]}, ${this.state.year-1}`}> {`${monthsList[11]}, ${this.state.year-1}`}</MenuItem>
                                        :
                                            <MenuItem value={true} key={`${monthsList[this.state.month-1]}, ${this.state.year}`}> {`${monthsList[this.state.month-1]}, ${this.state.year}`}</MenuItem>
                                        }
                                        <MenuItem value={false} key={`${monthsList[this.state.month]}, ${this.state.year}`}> {`${monthsList[this.state.month]}, ${this.state.year}`}</MenuItem>
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} onClick={()=> this.props.history.push(`/crewworkandresthour/${this.state.activeCrewEmployeeNo}/${this.state.prevMonth===true?this.state.month===0?11:this.state.month-1:this.state.month}/${this.state.prevMonth===true?this.state.month===0?this.state.year-1:this.state.year:this.state.year}`)} >
                                    <SendIcon style={{ color: config.KSTColors.ICON }}/>
                                    <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Proceed</span>
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

export default withRouter(withMessageManager(CrewWorkAndRestHourSelection));