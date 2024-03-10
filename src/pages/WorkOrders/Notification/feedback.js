import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import { FormControl, Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import MultipleImageUploadComponent from '../../../components/ImageUpload/MultipleImageUploadComponent'
import ActionTaken from '../Records/ActionTaken.js'
import Link from '@material-ui/core/Link';
import { getDB, updateLogs } from '../../../model/WorkOrder.js'
import '../workorder.css'
import moment from 'moment';
import { useIndexedDB } from 'react-indexed-db';
import { WorkOrderSchema, UpdateButton } from '../WordOrderConfig.js'


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
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    cell: {
        borderBottom: 'none',
    },
    val: {
        color: '#dee2e6',
        fontSize: '1.2rem',
        fontWeight: 300
    }
}));



const CssTextField = withStyles(theme => ({
    root: {
        '& label.Mui-focused': {
            color: '#0b8dbe',
            verticalAlign: 'top'
        },
        '& .MuiOutlinedInput-input': {
            color: '#dee2e6',
            fontSize: '1.2rem',
            fontWeight: 300
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
                width: '28vw',
                height: '100px',
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
    const [modalStyle] = React.useState(getModalStyle);
    const [state, setState] = React.useState(props.data);
    const [allowSubmit, setAllowSubmit] = React.useState(state.completiondate == null ? true : false)
    const [checkgrp, setCheckgrp] = React.useState({
        clean: state.action == 'clean' ? true : false,
        serviced: state.action == 'serviced' ? true : false,
        replaced: state.action == 'replaced' ? true : false,
    })

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };

    const handleActionTaken = (name) => {
        setState({ ...state, "action": name, "completiondate": new Date(),"status":'For Review' });
    };


    return (
        <div style={modalStyle} className={classes.paper}>
            <form className={classes.root} noValidate autoComplete="off">
                <Table >
                    <TableBody>
                        <TableRow><TableCell className={classes.cell} ><div className="BlueFont1halfrem" >Feedback</div></TableCell></TableRow>
                        <TableRow>
                            <TableCell >
                                <div className="BlueFont1rem">Work Order ID</div>
                                <div className="WhiteFont1tworem">{state.workorder}</div>
                            </TableCell>
                            <TableCell className={classes.cell} />
                            <TableCell>
                                <div className="BlueFont1rem">Job Type</div>
                                <div className="WhiteFont1tworem">{state.jobtype}</div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className="BlueFont1rem">Equipment</div>
                                <div className="WhiteFont1tworem">{state.equipment}</div>
                            </TableCell>
                            <TableCell className={classes.cell} />
                            <TableCell>
                                <div className="BlueFont1rem">Part Group</div>
                                <div className="WhiteFont1tworem">{state.partgroup}</div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className="BlueFont1rem">Reason</div>
                                <div className="WhiteFont1tworem">{state.reason}</div>
                            </TableCell>
                            <TableCell className={classes.cell} />
                            <TableCell>
                                <div className="BlueFont1rem">Recommended Action</div>
                                <div className="WhiteFont1tworem">{state.recommended}</div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className="BlueFont1rem">Scheduled Date</div>
                                <div className="WhiteFont1tworem">{moment(state.scheduleddate).format('DD-MM-YYYY')}</div>
                            </TableCell>
                            <TableCell className={classes.cell} />
                            <TableCell rowSpan={3} className={classes.cell} style={{ width: '32vw' }} >
                                {/* <Thumbnails /> */}
                                <MultipleImageUploadComponent allowUpload={true} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.cell} style={{ verticalAlign: 'top' }} >
                                <FormControl required >
                                    <input type="hidden" name="id" id="id" value={state.id} />
                                    {/* <input type="hidden" name="completiondate" id="completiondate" value={new Date()} /> */}
                                    <CssTextField
                                        className={classes.margin}
                                        label="Description / Procedure / Notes:"
                                        required
                                        variant="outlined"
                                        id="description"
                                        name="description"
                                        className={classes.label}
                                        onChange={handleChange}
                                        defaultValue={state.description}
                                    />
                                </FormControl>
                            </TableCell>
                            <TableCell className={classes.cell} />
                            <TableCell className={classes.cell} >
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.cell}>
                                <div className="BlueFont1rem">Action Taken *</div>
                                <div>
                                    <FormControl  >
                                        <ActionTaken data={checkgrp} allowSelection={true} handleActionTaken={handleActionTaken} />
                                    </FormControl>
                                </div>
                            </TableCell>
                            <TableCell className={classes.cell} />
                            <TableCell className={classes.cell}>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                {allowSubmit ?
                    <div style={{ float: 'right', marginRight: '10px' }} >
                        <UpdateButton data={state} onClose={props.onClose} />
                    </div>
                    :
                    <></>}

            </form>
        </div>
    )
}