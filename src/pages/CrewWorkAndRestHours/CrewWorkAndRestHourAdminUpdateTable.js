import React, {Component} from 'react';
import './CrewWorkAndRestHour.css';
import CrewWorkAndRestHourApi from '../../model/CrewWorkAndRestHour';
import { Container, Row, Col } from 'react-bootstrap';
import { TableContainer, Table, TableHead, TableBody, Paper, TableRow, TableCell } from '@material-ui/core';
import { Button } from '@material-ui/core';
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
class CrewWorkAndRestHourAdminUpdateTable extends Component {
    constructor(){
        super();
        this.crewWorkAndRestHourApi = new CrewWorkAndRestHourApi();
        this.state={
            adminUpdateList: [],
            month: null,
            year: null,
            loaded: false
        }
    }
    async getData(){
        this.setState({ loaded: false })
        try{
            let month = moment().month();
            let year = moment().year();
            if(month===0){
                month = 11
                year = year-1;
            }
            else{
                month = month-1
            } 
            let temp = await this.crewWorkAndRestHourApi.GetCrewRestAndWorkHourAdminUpdateData(month, year);
            this.setState({ adminUpdateList: [...temp], month: month, year: year, loaded: true });
        }
        catch(e){
            console.log(e);
            this.props.setMessages([{type : "danger", message : "Unable to load Crew Work and Rest Hours Update! No internet!"}]);
            this.props.history.push('/assetmanagement');
        }

    }
    componentDidMount(){
        this.getData();
    }
    getIsWorking(status){
        if(status===1||status==='1'){
            return "Working"
        }
        else if(status===2||status==='2'){
            return "Resting"
        }
        else{
            return ""
        }
    }
    getShift(shift){
        if(shift==="1"||shift===1){
            return 'Morning Shift (0730-1930)';
        }
        else if(shift==="2"||shift===2){
            return 'Evening Shift (1930-0730)';
        }
        else{
            return "";
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
                        <div style={{ marginLeft: 'auto', paddingRight: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} onClick={()=> this.props.history.push(`/crewworkandresthourupdateform/`)}>
                                    <SendIcon style={{ color: config.KSTColors.ICON }}/>
                                    <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Create</span>
                                </Button>
                        </div>
                    </Col>
                </Row>
                <Row className="CrewWorkAndRestHourMain">
                    <Col>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="update table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Crew Name</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                    <TableCell align="right">Shift</TableCell>
                                    <TableCell align="right">Working / Resting</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {this.state.adminUpdateList.map(row => (
                                    <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <TableCell component="th" scope="row">{row.crewName}</TableCell>
                                    <TableCell align="right">{`${row.date}-${monthsList[parseInt(row.month)]}-${row.year}`}</TableCell>
                                    <TableCell align="right">{this.getShift(row.shift)}</TableCell>
                                    <TableCell align="right">{this.getIsWorking(row.isWorking)}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Col>
                </Row>
            </Container>
            :
            <FullScreenSpinner text={"Loading..."}/>
        );
    }

}

export default withRouter(withMessageManager(CrewWorkAndRestHourAdminUpdateTable));