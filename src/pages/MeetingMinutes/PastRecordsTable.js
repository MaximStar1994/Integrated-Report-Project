import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@material-ui/core';
import Pagination from 'react-bootstrap/Pagination'
import moment from 'moment';
import { withRouter } from "react-router-dom"
import Form from 'react-bootstrap/Form'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faFilePdf } from '@fortawesome/free-solid-svg-icons'
import { withMeetingMinutes } from './MeetingMinutesContext';
import { Spinner } from 'react-activity';
import './MeetingMinutes.css'
const rowsPerPage = 10;
class PastRecordsTable extends React.Component {

    state={
        page: 0,
        paginationList: [],
    }

    componentDidMount(){
        this.props.getPastMeetingMinutes((result, error) => {
            let i=0;
            let paginationList = [];
            if(this.props.pastMeetingMinutes){
                for(i=0; i < parseInt(this.props.pastMeetingMinutes.length/rowsPerPage); i++) {
                    paginationList.push(i);
                }
                if(this.props.pastMeetingMinutes%rowsPerPage!==0) {
                    paginationList.push(i);
                }
            }
            else
                paginationList = [1];
            this.setState({ paginationList : paginationList });
        });
    }

    componentWillUnmount() {
        this.props.resetPastMeetingMinutes();
    }

    render(){
            return (
                <Paper style={{ width: '100%', borderRadius: '15px', backgroundColor: '#067FAA' }} >
                    <TableContainer >
                        <Table stickyHeader aria-label="sticky table" size={'small'} style={{ borderTopRightRadius: '10px' }}>
                            <TableHead style={{ backgroundColor: '#067FAA'}}>
                                <TableRow>
                                    <TableCell style={{ backgroundColor: '#067FAA', color: '#fff', borderTopLeftRadius: '10px', borderBottom: '3px solid #067FAA'  }} align="center">Status</TableCell>
                                    <TableCell style={{ backgroundColor: '#067FAA', color: '#fff', borderBottom: '3px solid #067FAA' }} align="center">Name of Vessel</TableCell>
                                    <TableCell style={{ backgroundColor: '#067FAA', color: '#fff', borderBottom: '3px solid #067FAA' }} align="center">Location</TableCell>
                                    <TableCell style={{ backgroundColor: '#067FAA', color: '#fff', borderBottom: '3px solid #067FAA' }} align="center">{"Date & Time"}</TableCell>
                                    <TableCell style={{ backgroundColor: '#067FAA', color: '#fff', borderTopRightRadius: '10px', borderBottom: '3px solid #067FAA' }} align="center">Edit</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.props.MMTableLoaded===true?
                                (this.props.pastMeetingMinutes!==null?this.props.pastMeetingMinutes.slice(this.state.page * rowsPerPage, this.state.page * rowsPerPage + rowsPerPage).map((row,idx) => (
                                    <TableRow hover  style={{ width: '100%', borderRadius: '15px' }} key={idx}  tabIndex={-1} style={{ marginBottom: '55px' }}>
                                        <TableCell style={{ backgroundColor: '#04384C', color: '#067FAA', fontSize: '1.2em', borderBottom: '3px solid #067FAA' }}  align="center">
                                            <FontAwesomeIcon icon={faCircle} size={'sm'} style={row.issubmitted===true?{ color: '#66ff00' }: { color: '#067FAA' }} />
                                        </TableCell>
                                        <TableCell style={{ backgroundColor: '#04384C', color: '#067FAA', fontSize: '1.2em', borderBottom: '3px solid #067FAA' }} align="center">{row.name}</TableCell>
                                        <TableCell style={{ backgroundColor: '#04384C', color: '#067FAA', fontSize: '1.2em', borderBottom: '3px solid #067FAA' }} align="center">{row.location}</TableCell>
                                        <TableCell style={{ backgroundColor: '#04384C', color: '#067FAA', fontSize: '1.2em', borderBottom: '3px solid #067FAA' }} align="center">{row.datetime}</TableCell>
                                        {row.issubmitted===true?
                                            <TableCell style={{ backgroundColor: '#04384C', color: '#067FAA', fontSize: '1.2em', borderBottom: '3px solid #067FAA' }} align="center">
                                                <Button variant="contained" color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)' }} onClick={() => window.open(`${window.RIGCAREBACKENDURL}/${row.filepath}`, '_blank')}> View</Button>
                                            </TableCell>
                                            :
                                            <TableCell style={{ backgroundColor: '#04384C', color: '#067FAA', fontSize: '1.2em', borderBottom: '3px solid #067FAA' }} align="center">
                                                <Button variant="contained" color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)' }} onClick={()=>{this.props.history.push(`/meetingminutes/${row.meetingminuteid}/form`)}}>Edit</Button>
                                            </TableCell>
                                        }
                                    </TableRow>
                                )): null):
                                (
                                    <TableRow hover  style={{ width: '100%', borderRadius: '15px' }} tabIndex={-1} style={{ marginBottom: '55px' }}>
                                        <TableCell colSpan={5} style={{ backgroundColor: '#04384C', color: '#067FAA', fontSize: '1.2em', borderBottom: '3px solid #067FAA' }}  align="center">
                                            <Spinner color="#727981" size={32} speed={1} animating={true} />
                                        </TableCell>
                                    </TableRow>
                                )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {this.props.pastMeetingMinutes!==null?
                    <div className="MMPagination">
                    <Pagination style={{ backgroundColor: '#067FAA', justifyContent: 'center' }}>
                        <Pagination.Item onClick={()=>this.setState({page: this.state.paginationList[0]})}>{'<<'}</Pagination.Item>
                        <Pagination.Item disabled={this.state.page===this.state.paginationList[0]} onClick={()=>this.setState({ page: this.state.page-1 })}>{'<'}</Pagination.Item>
                        {this.state.paginationList.map(page => <Pagination.Item key={page} active={page===this.state.page} onClick={()=> { this.setState({ page: page })}}>{page+1}</Pagination.Item>)}
                        <Pagination.Item disabled={this.state.page===this.state.paginationList[this.state.paginationList.length-1]} onClick={()=>this.setState({page: this.state.page+1})}>{'>'}</Pagination.Item>
                        <Pagination.Item onClick={()=>this.setState({page: this.state.paginationList[this.state.paginationList.length-1]})}>{'>>'}</Pagination.Item>
                    </Pagination></div>:null
                    }
                </Paper>
            );
    }
}

export default withRouter(withMeetingMinutes(PastRecordsTable));
