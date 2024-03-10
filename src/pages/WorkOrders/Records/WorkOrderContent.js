import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import { FormControl } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import MultipleImageUploadComponent from '../../../components/ImageUpload/MultipleImageUploadComponent'
// import Thumbnails from '../../../components/Thumbnails/Thumbnails'
import ActionTaken from './ActionTaken.js'
import Link from '@material-ui/core/Link';
import '../workorder.css'
import moment from 'moment';
function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: '70vw',
        borderRadius: 20,
        backgroundColor: '#02404f',
        margin: 'auto',
        padding: theme.spacing(2, 2, 2, 2),
    },
    cell: {
        borderBottom: 'none',
    }
}));

const CssTextField = withStyles(theme => ({
    root: {
        '& label.Mui-focused': {
            color: '#0b8dbe',
            verticalAlign: 'top'
        },
        '& .MuiInputLabel-outlined': {
            color: '#0b8dbe',
            fontSize: '1rem',
            fontWeight: 300,
            verticalAlign: 'top'
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#dee2e6',
            color: '#0b8dbe',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#dee2e6',
                color: '#0b8dbe',
                width: '20vw',
                height: '150px',
                verticalAlign: 'top',
                [theme.breakpoints.down(1024)]: {
                    height: '80px',
                }
            },
            '&:hover fieldset': {
                borderColor: '#dee2e6',
                color: '#0b8dbe',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#dee2e6',
                color: '#0b8dbe'
            },
        },
    },
}))(TextField);

export default function WorkOrderDetail(props) {
    const classes = useStyles();
    const row = props.data
    const [modalStyle] = React.useState(getModalStyle);
    const [checkgrp, setCheckgrp] = React.useState({
        clean: row.action == 'clean' ? true : false,
        serviced: row.action == 'serviced' ? true : false,
        replaced: row.action == 'replaced' ? true : false,
    })
    
    return (
        <div style={modalStyle} className={classes.paper}>
            <Table >
                <TableBody>
                    <TableRow><TableCell className={classes.cell} ><div className="BlueFont1halfrem" >Details</div></TableCell></TableRow>
                    <TableRow>
                        <TableCell >
                            <div className="BlueFont1rem">Work Order ID</div>
                            <div className="WhiteFont1tworem">{row.workorder}</div>
                        </TableCell>
                        <TableCell className={classes.cell} />
                        <TableCell>
                            <div className="BlueFont1rem">Job Type</div>
                            <div className="WhiteFont1tworem">{row.jobtype}</div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <div className="BlueFont1rem">Equipment</div>
                            <div className="WhiteFont1tworem">{row.equipment}</div>
                        </TableCell>
                        <TableCell className={classes.cell} />
                        <TableCell>
                            <div className="BlueFont1rem">Part Group</div>
                            <div className="WhiteFont1tworem">{row.partgroup}</div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <div className="BlueFont1rem">Reason</div>
                            <div className="WhiteFont1tworem">{row.reason}</div>
                        </TableCell>
                        <TableCell className={classes.cell} />
                        <TableCell>
                            <div className="BlueFont1rem">Recommended Action</div>
                            <div className="WhiteFont1tworem">{row.recommended}</div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <div className="BlueFont1rem">Scheduled Date</div>
                            <div className="WhiteFont1tworem">{moment(row.scheduleddate).format('DD-MM-YYYY')}</div>
                        </TableCell>
                        <TableCell className={classes.cell} />
                        <TableCell>
                            <div className="BlueFont1rem">Work Order Type</div>
                            <div className="WhiteFont1tworem">{row.workordertype}</div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <div className="BlueFont1rem">Completion Date</div>
                            <div className="WhiteFont1tworem">{moment(row.completiondate).format('DD-MM-YYYY')}</div>
                        </TableCell>
                        <TableCell className={classes.cell} />
                        <TableCell>
                            <div className="BlueFont1rem">Status</div>
                            <div className="WhiteFont1tworem">{row.status}</div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.cell} style={{ verticalAlign: 'top' }} >
                            <CssTextField
                                className={classes.margin}
                                label="Description / Procedure / Notes:"
                                required
                                variant="outlined"
                                id="validation-outlined-input"
                                value={props.description}
                            />
                        </TableCell>
                        <TableCell className={classes.cell} />
                        <TableCell className={classes.cell} style={{width:'32vw'}} >
                            {/* <Thumbnails /> */}
                            <MultipleImageUploadComponent/>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.cell}>
                            <div className="BlueFont1rem">Action Taken</div>
                            <div>
                                <ActionTaken data={checkgrp} />
                            </div>
                        </TableCell>
                        <TableCell className={classes.cell} />
                        <TableCell className={classes.cell}>
                            <div >
                                <Link style={{ color: "#dee2e6" }} href="#" >
                                    Document 1
                                </Link>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}