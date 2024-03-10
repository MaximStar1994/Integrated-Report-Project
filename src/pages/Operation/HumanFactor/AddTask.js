import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, Select, Button, MenuItem } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import PublishIcon from '@material-ui/icons/Publish';
import { KeyboardDatePicker } from '@material-ui/pickers';
import HumanFactorApi from '../../../model/HumanFactor.js';
import Modal from '@material-ui/core/Modal';
import socketIOClient from "socket.io-client";
import './Areas.css'
import { array } from 'prop-types';

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
    },
    formControl: {
        margin: theme.spacing(2),
        minWidth: '40%',
        justifyContent: 'center'

    },
    label: {
        color: '#0b8dbe',
        fontSize: '1rem',
        fontWeight: 400
    },
    value: {
        color: '#dee2e6',
        fontSize: '1.2rem',
        fontWeight: 300
    },
    header: {
        color: '#0b8dbe',
        fontSize: '1.5rem',
        fontWeight: '600'
    },
}));

const StyledButton = withStyles({
    root: {
        height: '50%', margin: 'auto', backgroundColor: 'black',
        '&.MuiButton-contained:hover': {
            height: '50%', margin: 'auto', backgroundColor: 'black',
            color: '#0b8dbe', border: '1px solid #0b8dbe',
        }
    }
})(Button)

function validateForm(props) {
    let isValidated = true;
    if (props.equipment == '') {
        isValidated = false
    } else if (props.dueDate == '') {
        isValidated = false
    } else if (props.description == '') {
        isValidated = false
    } else if (props.assignedToCrew == '') {
        isValidated = false
    }
    else if (props.prior == '') {
        isValidated = false
    }
    return isValidated
}
const backendApi = new HumanFactorApi()
const socket = socketIOClient(backendApi.socketEndPoint, { path: `/${window.RIGCAREBACKENDSUBDIR}/socket.io` });

export default function AddTask(props) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [state, setState] = React.useState({
        equipment: '',
        smartWatchRefs: [],
        assignedTo: [],
        assignee: '',
        assignedBy: '',
        description: '',
        dueDate: new Date(),
        progress: 0,
        status: 'Open',
        prior: '',
        taskId: '',
    });
    const [errors, setError] = React.useState('');

    const handleErrorchange = (error) => {
        setError(error)
    }
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setState({
            ...state,
            ["dueDate"]: date,
        });
    };

    // const handleAssignedBy = (event)=>{
    //     var val = event.target.value
    //     let newstate = state;
    //     let assignedTo = newstate.assignedTo;
    //     assignedTo = val;
    //     newstate.assignedTo = assignedTo;
    //     setState(newstate)


    // }

    const handleChange = (event) => {
        var name = event.target.name;
        var val = event.target.value;

        setState({
            ...state,
            [name]: val,
        });
        if (name == "assignee") {
            let split = val.split("/"); 
            if (split instanceof Array && split.length > 1) { 
                let newAssignedTo = state.assignedTo
                newAssignedTo[0] = split[1]
                let newSmartwatchRefs=state.smartWatchRefs
                newSmartwatchRefs[0] = split[0]
                setState({
                    ...state,
                    assignedTo: newAssignedTo,
                    assignedBy: split[1],
                    smartWatchRefs: newSmartwatchRefs,
                    [name]: val
                });
            }


        }
        //else {
        //     setState({
        //         ...state,
        //         [name]: val,
        //     });
        // }
    };
    const handleClose = () => {
        props.handleClose()
    }
    const handleClick = () => {
        const isValidated = validateForm(state)
        if (isValidated) {

            backendApi.PostTask(state,(val) => {  
                if (val === null) {
                    return
                }         

                if(val.id!=undefined) {
                    var postBody = state
                    setState({
                        ...state,
                        'taskId': val.id,
                    });
                    postBody.taskId = val.id
                    if (val.assignedTo instanceof Array) {  
                        val.assignedTo.forEach(crew => {
                            let socketBody = {}
                            Object.assign(socketBody, postBody)
                            socketBody.crewAssigned = val.assignedTo[0].smartWatchRef
                            socket.emit('subscribe', { topic: 'Keppel/Client/'+val.assignedTo[0].smartWatchRef+'/Task', Msg:socketBody });
                        })
                    }
                }
            });
            props.handleClose()
        } else {
            handleErrorchange("*Fill in mandatory fields");
        }

    };

    if (props.openModal == false) {
        return (<></>)
    } else {
        let errorMsg = (<></>)
        if (errors.length > 0) {
            errorMsg = (<InputLabel style={{ color: 'red' }} >{errors}</InputLabel>)
        }
        // console.log("new state" + JSON.stringify(state))

        let body = (<div style={modalStyle} className={classes.paper}>
            <InputLabel className={classes.header} >Add Task</InputLabel>
            {errorMsg}
            <form className={classes.root} noValidate autoComplete="off">
                <div>
                    <FormControl required className={classes.formControl}>
                        <InputLabel className={classes.label} htmlFor="equipment">Equipment</InputLabel>
                        <Select
                            inputProps={{
                                name: 'equipment',
                                id: 'equipment',
                                classes: { root: classes.value }
                            }}
                            required
                            value={state.equipment}
                            onChange={handleChange}
                            displayEmpty
                            className={classes.equipment}
                        >
                            <MenuItem value="">
                            </MenuItem>
                            <MenuItem value="Drill Water Pump 2">Drill Water Pump #2</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl required className={classes.formControl}>
                        <InputLabel className={classes.label} htmlFor="assignee">Assign to crew</InputLabel>
                        <Select
                            value={state.assignee}
                           
                            onChange={handleChange}
                            inputProps={{
                                name: 'assignee',
                                id: 'assignee',
                                classes: { root: classes.value }
                            }}
                            displayEmpty
                            className={classes.selectEmpty}
                        >
                            <MenuItem aria-label="" key="" value="" />
                            {props.crewList.filter(crew => crew.smartWatchRef !== null).map((el) =>
                                <MenuItem key={el.smartWatchRef} value={el.smartWatchRef + "/" + el.id}>{el.name}</MenuItem>
                            )}
                            {/* <MenuItem value={1}>Crew 1</MenuItem> */}
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl required className={classes.formControl}>
                        {/* <InputLabel className={classes.label} className={classes.label} htmlFor="scheduleddate">Scheduled Date</InputLabel> */}
                        <KeyboardDatePicker
                            InputProps={{ classes: { root: classes.value } }}
                            InputLabelProps={{ classes: { root: classes.label } }}
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            id="dueDate"
                            name="dueDate"
                            label="Due Date"
                            value={state.dueDate}
                            onChange={handleDateChange}
                            disablePast
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </FormControl>
                    <FormControl required className={classes.formControl}>
                        <InputLabel className={classes.label} htmlFor="prior">Priority​​</InputLabel>
                        <Select
                            inputProps={{
                                name: 'prior',
                                id: 'prior',
                                classes: { root: classes.value }
                            }}
                            required
                            value={state.prior}
                            onChange={handleChange}
                            displayEmpty
                        // className={classes}
                        >
                            <MenuItem value="0" />
                            <MenuItem value="3">High</MenuItem>
                            <MenuItem value="2">Medium</MenuItem>
                            <MenuItem value="1">Low</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl required className={classes.formControl}>
                        <TextField required
                            id="description"
                            name="description"
                            label="Description"
                            InputProps={{ classes: { root: classes.value } }}
                            InputLabelProps={{ classes: { root: classes.label } }}
                            multiline
                            rows={4}
                            onInput={(e) => {
                                e.target.value = (e.target.value).toString().slice(0, 70)
                            }}
                            onChange={handleChange}
                            value={state.description}
                            variant="outlined"

                        />
                    </FormControl>
                </div>
                <div><Button variant="contained" color="default" onClick={handleClose} style={{ margin: '5px' }} >
                    Cancel
            </Button>
                    <Button variant="contained" color="default" onClick={handleClick}>
                        Submit
        </Button></div>

            </form>
        </div>)
        return (
            <div>
                <Modal open={props.openModal} onClose={props.handleClose}
                    aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                    {body}
                </Modal>
            </div>
        )

    }


}
