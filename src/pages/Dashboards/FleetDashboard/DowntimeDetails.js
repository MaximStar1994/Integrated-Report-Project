import React from 'react';
import moment from 'moment';
import { Row, Col, Table } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'
import config from '../../../config/config';
const isEmpty = (element) =>{
    if(element===undefined || element===null || element==='')
        return true;
    else
        return false;
}
const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const getDifferenceDays = (start, end) => {
    let days = moment(end).diff(moment(start), 'days');
    let daysInSeconds = days*24*60*60;
    let secondsLeft = moment(end).diff(moment(start), 'seconds');
    days = parseFloat((days + (secondsLeft-daysInSeconds)/(24*60*60)).toFixed(2));
    return days;
}
const DowntimeDetails = props =>{
    return(
        <React.Fragment>
            <Dialog
                fullWidth={props.fullWidth}
                maxWidth={props.maxWidth}
                open={props.open}
                onClose={props.handleClose}
                PaperProps={{style: {backgroundColor: '#f2f2f2'}}}
            >
                <DialogTitle style={{ color: config.KSTColors.MAIN, textAlign: 'center' }}><div className="Heading">FLEET DOWNTIME DETAILS ({monthList[props.month-1]}, {props.year})</div></DialogTitle>
                <DialogContent>
                        <Row>
                            <Col>
                                <div className="breakdownSummary">
                                    <div>
                                        <div>TOTAL HOURS DOWN</div>
                                        <div className="breakdownSummaryCounterBox">{props.totalHours}</div>
                                    </div>
                                    <div>
                                        <div>TOTAL DAYS DOWN</div>
                                        <div className="breakdownSummaryCounterBox">{props.totalDays.toFixed(2)}</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                        <Col>
                            <div className={'BreakdownTable'}>
                                <Table bordered>
                                    <thead>
                                        <tr>
                                            <th>Vessel Name</th>
                                            <th>Reason</th>
                                            <th>Tech Categories</th>
                                            <th>Hours Down</th>
                                            <th>Days Down</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.events.map((event, idx)=>{
                                            let tempHours = '';
                                            let tempDays = '';
                                            if(isEmpty(event.backToOperationDatetime)===false && isEmpty(event.breakdownDatetime)===false){
                                                tempHours = moment(event.backToOperationDatetime).diff(moment(event.breakdownDatetime), 'hours')
                                                tempDays = getDifferenceDays(event.breakdownDatetime, event.backToOperationDatetime)
                                            }
                                            return(
                                                <tr key={idx}>
                                                    <td>{event.vesselName}</td>
                                                    <td>{event.reason}</td>
                                                    <td>{event.category}</td>
                                                    <td>{tempHours}</td>
                                                    <td>{tempDays.toFixed(2)}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                        </Row>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', color: 'white' }} onClick={props.handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
            
        </React.Fragment>
    );
}

export default DowntimeDetails;