import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Pagination from 'react-bootstrap/Pagination'
import Popover from '@material-ui/core/Popover';
import moment from 'moment';
import { withRouter } from "react-router-dom"
import Form from 'react-bootstrap/Form'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'
import './BDNTable.css'

// const this.props.rowsPerPage = 10;

class BDNTable extends React.Component {

    state={
        page: 0,
        paginationList: [],
        anchorElSupplier: null,
        anchorElReceiver: null,
    }

    render(){
        return (
            <Paper style={{ width: '100%', borderRadius: '15px', backgroundColor: '#067FAA' }} >
                <TableContainer >
                    <Table stickyHeader aria-label="sticky table" size={'small'} style={{ borderTopRightRadius: '10px' }}>
                        <TableHead style={{ backgroundColor: '#067FAA'}}>
                            <TableRow>
                                <TableCell style={{ backgroundColor: '#067FAA', color: '#fff', borderTopLeftRadius: '10px', borderBottom: '3px solid #067FAA'  }} align="center"><span>BDN No. # <span onClick={()=> this.props.sortBDNNo()} style={{ fontSize: '1.5em', fontWeight: '900', color: '#032A39'}} className="material-icons">import_export</span></span></TableCell>
                                <TableCell style={{ backgroundColor: '#067FAA', color: '#fff', borderBottom: '3px solid #067FAA' }} align="center"><span>Date <span onClick={()=> this.props.sortDate()} style={{ fontSize: '1.5em', fontWeight: '900', color: '#032A39'}} className="material-icons">import_export</span></span></TableCell>
                                <TableCell style={{ backgroundColor: '#067FAA', color: '#fff', borderBottom: '3px solid #067FAA' }} align="center">Submitted Time</TableCell>
                                <TableCell style={{ backgroundColor: '#067FAA', color: '#fff', borderBottom: '3px solid #067FAA' }} align="center"><span> Supplier <span onClick={(event)=> this.setState({anchorElSupplier: event.currentTarget})} style={{ fontSize: '1.5em', fontWeight: '900', color: '#032A39'}} className="material-icons">filter_alt</span></span>
                                    <Popover
                                        id={Boolean(this.state.anchorElSupplier) ? 'SupplierFilter-popover' : undefined}
                                        open={Boolean(this.state.anchorElSupplier)}
                                        anchorEl={this.state.anchorElSupplier}
                                        onClose={()=>{this.setState({ anchorElSupplier: null })}}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                        }}
                                        style={{ marginTop: '15px' }}
                                    >
                                        <Form.Control size="sm" type="text" value={this.props.supplierFilter} onChange={(event)=> this.props.filterList('supplier', event)}  />
                                    </Popover>
                                </TableCell>
                                <TableCell style={{ backgroundColor: '#067FAA', color: '#fff', borderBottom: '3px solid #067FAA' }} align="center"><span> Receiver <span onClick={(event)=> this.setState({anchorElReceiver: event.currentTarget})} style={{ fontSize: '1.5em', fontWeight: '900', color: '#032A39'}} className="material-icons">filter_alt</span></span>
                                    <Popover
                                        id={Boolean(this.state.anchorElReceiver) ? 'ReceiverFilter-popover' : undefined}
                                        open={Boolean(this.state.anchorElReceiver)}
                                        anchorEl={this.state.anchorElReceiver}
                                        onClose={()=>{this.setState({ anchorElReceiver: null })}}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                        }}
                                        style={{ marginTop: '15px' }}
                                    >
                                        <Form.Control size="sm" type="text" value={this.props.receiverFilter} onChange={(event)=> this.props.filterList('receiver', event)}  />
                                    </Popover>
                                </TableCell>
                                <TableCell style={{ backgroundColor: '#067FAA', color: '#fff', borderTopRightRadius: '10px', borderBottom: '3px solid #067FAA' }} align="center">PDF</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.data!==null?this.props.data.slice(this.state.page * this.props.rowsPerPage, this.state.page * this.props.rowsPerPage + this.props.rowsPerPage).map((row,idx) => (
                                <TableRow hover  style={{ width: '100%', borderRadius: '15px' }} key={idx}  tabIndex={-1} style={{ marginBottom: '55px' }}>
                                    <TableCell style={{ backgroundColor: '#04384C', color: '#067FAA', fontSize: '1.2em', borderBottom: '3px solid #067FAA' }}  align="center">#{row.bdnNumber}</TableCell>
                                    <TableCell style={{ backgroundColor: '#04384C', color: '#067FAA', fontSize: '1.2em', borderBottom: '3px solid #067FAA' }} align="center">{moment(row.generatedDate).format("DD/MM/YYYY")}</TableCell>
                                    <TableCell style={{ backgroundColor: '#04384C', color: '#067FAA', fontSize: '1.2em', borderBottom: '3px solid #067FAA' }} align="center">{moment(row.generatedDate).format("hh:mm a")}</TableCell>
                                    <TableCell style={{ backgroundColor: '#04384C', color: '#067FAA', fontSize: '1.2em', borderBottom: '3px solid #067FAA' }} align="center">{row.supplier}</TableCell>
                                    <TableCell style={{ backgroundColor: '#04384C', color: '#067FAA', fontSize: '1.2em', borderBottom: '3px solid #067FAA' }} align="center">{row.receiver}</TableCell>
                                    {row.filepath===null?
                                        (<TableCell style={{ backgroundColor: '#04384C', color: '#067FAA', fontSize: '1.2em', borderBottom: '3px solid #067FAA' }} align="center" />):
                                        <TableCell style={{ backgroundColor: '#04384C', color: '#067FAA', fontSize: '1.2em', borderBottom: '3px solid #067FAA' }} align="center">
                                            {
                                                row.filepath===undefined?null:
                                                <Button variant="contained" color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)' }} onClick={() => window.open(`${window.RIGCAREBACKENDURL}/${row.filepath}`, '_blank')}> 
                                                <FontAwesomeIcon icon={faFilePdf} size={'lg'} /> &nbsp; View
                                                </Button>
                                            }
                                        </TableCell>
                                    }
                                </TableRow>
                            )): null}
                        </TableBody>
                    </Table>
                </TableContainer>
                {this.props.data!==null?
                <div className="BDNPagination">
                <Pagination style={{ backgroundColor: '#067FAA', justifyContent: 'center' }}>
                    <Pagination.Item onClick={()=>this.setState({page: this.props.paginationList[0]})}>{'<<'}</Pagination.Item>
                    <Pagination.Item disabled={this.state.page===this.props.paginationList[0]} onClick={()=>this.setState({ page: this.state.page-1 })}>{'<'}</Pagination.Item>
                    {this.props.paginationList.map(page => <Pagination.Item key={page} active={page===this.state.page} onClick={()=> { this.setState({ page: page })}}>{page+1}</Pagination.Item>)}
                    <Pagination.Item disabled={this.state.page===this.props.paginationList[this.props.paginationList.length-1]} onClick={()=>this.setState({page: this.state.page+1})}>{'>'}</Pagination.Item>
                    <Pagination.Item onClick={()=>this.setState({page: this.props.paginationList[this.props.paginationList.length-1]})}>{'>>'}</Pagination.Item>
                </Pagination></div>:null
                }
            </Paper>
        );
    }
}

export default withRouter(BDNTable);
