import React, {Component} from 'react';
import { Container, Row, Col, Table, Form } from 'react-bootstrap';
import { Button,Select, MenuItem, Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';
import './VesselBreakdown.css';
import config from '../../config/config';
import { withLayoutManager } from '../../Helper/Layout/layout'
import { withRouter } from "react-router-dom"
import { withVesselBreakdown } from './VesselBreakdownContext';
import { withMessageManager } from '../../Helper/Message/MessageRenderer';
import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner';
import SendIcon from '@material-ui/icons/Send';
import { withAuthManager } from '../../Helper/Auth/auth';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from "@material-ui/icons/Edit";

const getDifferenceDays = (start, end) => {
    let days = moment(end).diff(moment(start), 'days');
    let daysInSeconds = days*24*60*60;
    let secondsLeft = moment(end).diff(moment(start), 'seconds');
    days = parseFloat((days + (secondsLeft-daysInSeconds)/(24*60*60)).toFixed(2));
    return days;
}
class VesselBreakdown extends Component {
    state={
        vesselId: '',
        vesselName: '',
        events: [],
        loaded: false,
        totalDays: 0,
        totalHours: 0,
        isManagement: (this.props.match.params.isManagement === "true"),
        statusList: ["open", "closed"],
        vesselList: [],
        activeVesselId: "",
    }
    isEmpty(element){
        if(element===undefined || element===null || element==='')
            return true;
        else
            return false;
    }
    getData = async() =>{
        if(this.props.selectedVessel.vessel_id==='0'){
            this.props.setMessages([{type : "danger", message : "Invalid Vessel Selected"}]);
        }
        if(isNaN(this.props.selectedVessel.vessel_id)===true||this.props.selectedVessel.vessel_id==='0'){
            this.setState({ loaded: true });
        }
        else{
            let vesselBreakdownList = await this.props.getVesselBreakdownList(parseInt(this.props.selectedVessel.vessel_id),this.state.isManagement);
            if(vesselBreakdownList.success===true){
                let totalDays = 0;
                let totalHours = 0;
                vesselBreakdownList.events.forEach(event => {
                    if(this.isEmpty(event.backToOperationDatetime)===false && this.isEmpty(event.breakdownDatetime)===false){
                        totalDays = totalDays + getDifferenceDays(event.breakdownDatetime, event.backToOperationDatetime);
                        totalHours = totalHours + moment(event.backToOperationDatetime).diff(moment(event.breakdownDatetime), 'hours');
                    }
                });
                totalDays = totalDays.toFixed(2);
                this.setState({ vesselId: vesselBreakdownList.vesselId, vesselName: vesselBreakdownList.vesselName, events: vesselBreakdownList.events, totalDays: totalDays, totalHours: totalHours, loaded :true });
            }
            else{
                this.props.setMessages([{type : "danger", message : vesselBreakdownList.error}]);
                window.scrollTo(0,0);
                this.props.history.push('/operation');
            }
        }
    }

    deleteForm = async (eventId) => {
        try {
            let result = await this.props.deleteVesselBreakdown(eventId);
            if(result.success===true){
                this.props.setMessages([{type : "success", message : "Deleted successfully!"}]);
                await this.getData();
            }
            else{
                this.props.setMessages([{type : "danger", message : "Unable to Delete!"}]);
            }
        } catch (error) {
            this.props.setMessages([{type : "danger", message : "Unable to Delete! Try again later with Internet Connectivity!"}]);
            console.log("Save Error", error);
        }
    }

    vesselDowntimeStatusChange = async (event) => {
        try {
            let result = await this.props.vesselDowntimeStatusChange(event);
            if(result.success===true){
                this.props.setMessages([{type : "success", message : "Status changed successfully!"}]);
                await this.onVesselChange(this.state.vesselId);
            }
            else{
                this.props.setMessages([{type : "danger", message : "Unable to Change Status!"}]);
            }
        } catch (error) {
            this.props.setMessages([{type : "danger", message : "Unable to Change Status! Try again later with Internet Connectivity!"}]);
            console.log("Status change Error", error);
        }
    }

    async onVesselChange(vesselId) {
        let vesselBreakdownList = await this.props.getVesselBreakdownList(parseInt(vesselId),this.state.isManagement);
        if(vesselBreakdownList.success===true){
            this.setState({ vesselId: vesselBreakdownList.vesselId, vesselName: vesselBreakdownList.vesselName, events: vesselBreakdownList.events, loaded :true, activeVesselId: vesselId });
        } else {
            this.props.setMessages([{type : "danger", message : vesselBreakdownList.error}]);
            window.scrollTo(0,0);
            // this.props.history.push('/operation');
        }
    }

    async getVesselList() {
        try {
            let vesselListFromLocalStorage = JSON.parse(localStorage.getItem("user")).vesselList;
              vesselListFromLocalStorage.shift();
              this.setState({
                vesselList: [...vesselListFromLocalStorage],
                loaded: true,
              });
        } catch (error) {
            this.props.setMessages([{type : "danger", message : "Unable to get vessel data!"}]);
            console.log("Onload get vessel data Error", error);
        }
    }

    componentDidMount(){
        if (this.state.isManagement) {
            this.getVesselList();
        } else {
            this.getData();
        }
    }
    componentDidUpdate(prevProps) {
        if (!this.state.isManagement) {
            if (prevProps.selectedVessel.vessel_id !== this.props.selectedVessel.vessel_id && this.props.selectedVessel.vessel_id !== '0') {
                this.setState({ loaded: false });
                this.getData(parseInt(this.props.selectedVessel.vessel_id));
            }
            if (this.props.selectedVessel.vessel_id === '0' && prevProps.selectedVessel.vessel_id !== this.props.selectedVessel.vessel_id) {
                this.props.setMessages([{ type: "danger", message: "Invalid Vessel Selected" }]);
                this.setState({ loaded: true });
            }
        }
    }
    render(){
        return(
            <React.Fragment>
                {this.state.loaded===true?
                    <Container fluid className="KSTBreakdownBackground">
                        <Row>
                            <Col>
                                <div className="VesselReportHeaderBase">
                                    <div className="VesselReportHeaderBackground">
                                        <div className="VesselReportHeading">{this.state.isManagement ? "VESSEL DOWNTIME CONTROL APP" : "VESSEL DOWNTIME RECORD FORM"}</div>
                                    </div>
                                    {((this.props.user?.accountType==='admin' || this.props.user?.accountType==='management')&&this.props.selectedVessel.vessel_id!=='0'&& !this.state.isManagement)&&
                                        <div style={{ marginLeft: 'auto', paddingRight: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button variant="contained" 
                                                style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px' }} 
                                                onClick={()=> this.props.history.push({pathname: `${this.props.VESSELBREAKDOWNIDENTIFIER}/new/${this.state.isManagement}`})}>
                                                    <SendIcon style={{ color: config.KSTColors.ICON }}/>
                                                <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Create</span>
                                            </Button>
                                        </div>
                                    }
                                </div>
                            </Col>
                        </Row>
                        {this.state.isManagement ?
                        <Row>
                            <Col xs={4} lg={2}>
                                <Form.Label style={{color: config.KSTColors.MAIN,height: "100%",display: "flex",alignItems: "center"}}>
                                    Name of Vessel
                                </Form.Label>
                            </Col>
                            <Col xs={6} lg={3}>
                                <div style={{ width: "100%",paddingBlock: "30px" }} className="AuthorizedControlAppSelectionBox">
                                    <Select
                                        style={{ color: config.KSTColors.MAIN }}
                                        type="selection"
                                        disableUnderline
                                        id={"Name of Vessel"}
                                        aria-describedby={"Name of Vessel"}
                                        value={
                                        this.state.activeVesselId === null
                                            ? ""
                                            : this.state.activeVesselId
                                        }
                                        onChange={(e) => this.onVesselChange(e.target.value)}
                                        className="AuthorizedControlAppSelectionFillableBox"
                                    >
                                        {/* <MenuItem value={""} key={""}>
                                        {" "}
                                        ALL
                                        </MenuItem> */}
                                        {this.state.vesselList.map((element) => (
                                        <MenuItem
                                            value={element.vessel_id}
                                            key={element.vessel_id}
                                        >
                                            {" "}
                                            {element.name}
                                        </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                            </Col>        
                        </Row>
                        :
                        <Row>
                            <Col>
                                <div className="breakdownSummary">
                                    <div>
                                        <div>TOTAL HOURS DOWN</div>
                                        <div className="breakdownSummaryCounterBox">{this.state.totalHours}</div>
                                    </div>
                                    <div>
                                        <div>TOTAL DAYS DOWN</div>
                                        <div className="breakdownSummaryCounterBox">{this.state.totalDays}</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>}
                        <Row>
                            <Col>
                                <div className={'BreakdownTable'}>
                                    <Table bordered>
                                        <thead>
                                            <tr>
                                                <th>Vessel Condition</th>
                                                <th>Tech Categories</th>
                                                <th>Breakdown Date</th>
                                                <th>Back to Operation</th>
                                                <th>Hours Down</th>
                                                <th>Days Down</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.events.map((event, idx)=>{
                                                let tempHours = '';
                                                let tempDays = '';
                                                if(this.isEmpty(event.backToOperationDatetime)===false && this.isEmpty(event.breakdownDatetime)===false){
                                                    tempHours = moment(event.backToOperationDatetime).diff(moment(event.breakdownDatetime), 'hours')
                                                    tempDays = getDifferenceDays(event.breakdownDatetime, event.backToOperationDatetime).toFixed(2);
                                                }
                                                return(
                                                    <tr key={idx}
                                                        style={{ cursor: event.status==='open' && !this.state.isManagement && (this.props.user?.accountType==='admin' || this.props.user?.accountType==='management')?'pointer':'auto' }} 
                                                        onClick={()=>{
                                                            if(event.status==='open' && !this.state.isManagement && (this.props.user?.accountType==='admin' || this.props.user?.accountType==='management'))
                                                                this.props.history.push({pathname: `${this.props.VESSELBREAKDOWNIDENTIFIER}/${event.eventId}/${this.state.isManagement}`})
                                                        }}
                                                    >
                                                        <td>{event.support.vesselCondition}</td>
                                                        <td>{event?.support?.category}</td>
                                                        <td>{!this.isEmpty(event.breakdownDatetime)&&moment(event.breakdownDatetime).format('DD-MM-YYYY')}</td>
                                                        <td>{!this.isEmpty(event.backToOperationDatetime)&&moment(event.backToOperationDatetime).format('DD-MM-YYYY')}</td>
                                                        <td>{tempHours}</td>
                                                        <td>{tempDays}</td>
                                                        {!this.state.isManagement ? 
                                                        <td style={{ color: event.status === 'open' ? 'red' : '' }}>{ event.is_editable === true ? 'ReOpened' : event.status === 'open' ? 'Open' : event.status === 'closed' && 'Closed'}</td>
                                                        : <td>
                                                                <div style={{width: "100%"}} className="DowntimeControlAppSelectionBox">
                                                                    <Select style={{ color: config.KSTColors.MAIN }} type="selection" disableUnderline id={"Status"} aria-describedby={"Status"} value={event.status} className="DowntimeControlAppSelectionFillableBox"
                                                                        onChange={(e) => {
                                                                            e.stopPropagation();
                                                                            event.status = e.target.value;
                                                                            this.setState({ events: this.state.events })
                                                                            console.log(this.state.events);
                                                                        }}>
                                                                        {this.state.statusList.map((status) => (
                                                                            <MenuItem value={status} key={status}>
                                                                                {" "}
                                                                                {status}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </div>    
                                                          </td>
                                                        }
                                                        <td>
                                                            {event.status === 'open' && !this.state.isManagement && event.is_editable === false ? 
                                                                <Tooltip title="Delete" placement="bottom">
                                                                    <DeleteForeverIcon
                                                                    onClick={(e) => {e.stopPropagation(); this.deleteForm(event.eventId);}}
                                                                    style={{color: config.KSTColors.REDDOT, cursor: "pointer"}} />
                                                                </Tooltip>
                                                            : event.status === 'open' && this.state.isManagement ?
                                                                <Button
                                                                    style={{backgroundColor: config.KSTColors.MAIN,borderRadius: "8px",color: config.KSTColors.ICON,marginTop: "3px",padding: "3px"}}
                                                                    onClick={(e) => {e.stopPropagation(); this.vesselDowntimeStatusChange(event)}}>
                                                                    <SendIcon style={{ color: config.KSTColors.ICON, fontSize: "10px" }} />
                                                                    <span style={{color: config.KSTColors.WHITE,paddingLeft: "5px"}}>Save</span>
                                                                </Button>  
                                                            : event.status === 'open' && !this.state.isManagement && event.is_editable === true ?
                                                                // <Tooltip title="Edit" placement="bottom">
                                                                //     <EditIcon
                                                                //         onClick={(e) => {
                                                                //             e.stopPropagation();
                                                                //             this.props.history.push({pathname: `${this.props.VESSELBREAKDOWNIDENTIFIER}/${event.eventId}/${this.state.isManagement}`})
                                                                //         }}        
                                                                //         style={{ color: config.KSTColors.GREENDOT, cursor: "pointer"}} />        
                                                                // </Tooltip>    
                                                                <Tooltip title="Delete" placement="bottom">
                                                                    <DeleteForeverIcon
                                                                    onClick={(e) => {e.stopPropagation(); this.deleteForm(event.eventId);}}
                                                                    style={{color: config.KSTColors.REDDOT, cursor: "pointer"}} />
                                                                </Tooltip>
                                                            :   <div />}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>

                        </Row>
                    </Container>
                    :
                    <FullScreenSpinner />
                }
            </React.Fragment>
        );
    }
}

export default withAuthManager(withRouter(withLayoutManager(withVesselBreakdown(withMessageManager(VesselBreakdown)))));