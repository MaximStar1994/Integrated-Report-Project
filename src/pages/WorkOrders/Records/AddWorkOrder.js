import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, Select, Button, MenuItem } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import PublishIcon from '@material-ui/icons/Publish';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Link from '@material-ui/core/Link';
import { WorkOrderSchema, AddNewWorkOrder } from '../WordOrderConfig.js';
import moment from 'moment';
import '../workorder.css'

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
    fileupload: {
        backgroundColor: 'black',
        justifyContent: 'center',
        height: '5vh',
        border: '1px solid #0b8dbe',
        display: 'flex',
        color: '#0b8dbe'
    },
    upload: {
        justifyContent: 'center',
        height: '5vh',
        display: 'flex',
        color: '#0b8dbe',
        float: 'right', marginRight: '10px'
    }
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



export default function AddWorkOrder(props) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [state, setState] = React.useState(WorkOrderSchema);
    const [errors,setError] = React.useState('');
  
    const handleErrorchange = (error) =>{
        setError(error)
    }
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setState({
            ...state,
            ["scheduleddate"]: date,
        });
    };

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };
    

    let errorMsg = (<></>)
    if(errors.length>0){
        errorMsg = (<InputLabel style={{color:'red'}} >{errors}</InputLabel>)
    }
    return (
        <div style={modalStyle} className={classes.paper}>
            <InputLabel className={classes.header} >Add Work Order</InputLabel>
            {errorMsg}
            <form className={classes.root} noValidate autoComplete="off">
                <div>
                    <FormControl required className={classes.formControl}>
                        <InputLabel className={classes.label} htmlFor="workordertype">Work Order Type</InputLabel>
                        <Select
                            inputProps={{
                                name: 'workordertype',
                                id: 'workordertype',
                                classes: { root: classes.value }
                            }}
                            required
                            value={state.workordertype}
                            onChange={handleChange}
                            displayEmpty
                            className={classes.selectEmpty}
                        >
                            <MenuItem value="">
                            </MenuItem>
                            <MenuItem value="Condition Based">Condition Based</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl required className={classes.formControl}>
                        <InputLabel className={classes.label} htmlFor="jobtype">Job Type</InputLabel>
                        <Select
                            value={state.jobtype}
                            onChange={handleChange}
                            inputProps={{
                                name: 'jobtype',
                                id: 'jobtype',
                                classes: { root: classes.value }
                            }}
                            displayEmpty
                            className={classes.selectEmpty}
                        >
                            <MenuItem aria-label="" value="" />
                            <MenuItem value="Inspection">Inspection</MenuItem>
                            <MenuItem value="Replace">Replace</MenuItem>
                            <MenuItem value="Service">Service</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl required className={classes.formControl}>
                        <InputLabel className={classes.label} className={classes.label} htmlFor="system">System Name</InputLabel>
                        <Select
                            displayEmpty
                            className={classes.selectEmpty}
                            value={state.system}
                            onChange={handleChange}
                            inputProps={{
                                name: 'system',
                                id: 'system',
                                classes: { root: classes.value }
                            }}
                        >
                            <MenuItem aria-label="" value="" />
                            <MenuItem value="Drill Water">Drill Water</MenuItem>
                            <MenuItem value="Radiator">Radiator</MenuItem>
                            <MenuItem value="Cantilever skidding system">Cantilever skidding system</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl required className={classes.formControl}>
                        <InputLabel className={classes.label} htmlFor="equipment">Equipment</InputLabel>
                        <Select
                            displayEmpty
                            className={classes.selectEmpty}
                            value={state.equipment}
                            onChange={handleChange}
                            inputProps={{
                                name: 'equipment',
                                id: 'equipment',
                                classes: { root: classes.value }
                            }}
                        >
                            <MenuItem aria-label="None" value="" />
                            <MenuItem value="Drill Water Pump #2">Drill Water Pump #2</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl required className={classes.formControl}>
                        <InputLabel className={classes.label} className={classes.label} htmlFor="partgroup">Part Group</InputLabel>
                        <Select
                            displayEmpty
                            className={classes.selectEmpty}
                            value={state.partgroup}
                            onChange={handleChange}
                            inputProps={{
                                name: 'partgroup',
                                id: 'partgroup',
                                classes: { root: classes.value }
                            }}
                        >
                            <MenuItem aria-label="None" value="" />
                            <MenuItem value="PUMP">PUMP</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl required className={classes.formControl}>
                        <InputLabel className={classes.label} htmlFor="priority">Priority</InputLabel>
                        <Select
                            displayEmpty
                            className={classes.selectEmpty}
                            value={state.priority}
                            onChange={handleChange}
                            inputProps={{
                                name: 'priority',
                                id: 'priority',
                                classes: { root: classes.value }
                            }}

                        >
                            <MenuItem aria-label="None" value="" />
                            <MenuItem value="HIGH">HIGH</MenuItem>
                            <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                            <MenuItem value="LOW">LOW</MenuItem>
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
                            id="scheduleddate"
                            name="scheduleddate"
                            label="Scheduled Date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </FormControl>
                    <FormControl required className={classes.formControl}>
                        <TextField required
                            id="recommended"
                            name="recommended"
                            label="Recommended Action"
                            InputProps={{ classes: { root: classes.value } }}
                            InputLabelProps={{ classes: { root: classes.label } }}
                            multiline
                            rows={4}
                            onChange={handleChange}
                            value={state.recommended}
                            variant="outlined"
                        />
                    </FormControl>
                </div>
                <div>
                    <FormControl className={classes.formControl}>
                        <div className={classes.fileupload} >
                            <PublishIcon style={{ height: '50%', margin: 'auto' }} />
                            <StyledButton
                                variant="contained"
                                component="label"
                            >
                                <input
                                    type="file"
                                    multiple
                                    style={{ color: '#0b8dbe' }}
                                />

                            </StyledButton>

                        </div>

                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <div className={classes.upload}>
                            <Button variant="contained" color="default" style={{ margin: 'auto', height: '50%' }} >
                                Upload
                        </Button></div>
                    </FormControl>
                </div>
                <div style={{ float: 'right', marginRight: '10px' }} >
                    
                    <AddNewWorkOrder  data={state} onClose={props.onClose} handleErrorchange={handleErrorchange}  />
                </div>
            </form>
        </div>
    )
}