import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useIndexedDB } from 'react-indexed-db';

export const WorkOrderSchema = {
    dbId: '',
    workorder: '',
    jobtype: '',
    workordertype: '',
    system: '',
    equipment: '',
    partgroup: '',
    priority: '',
    recommended: '',
    description:'',
    status: 'open',
    action: '',
    reason:'',
    scheduleddate: new Date(),
    updateDate: new Date(),
    creationDate: new Date(),
    completiondate: null
}

function validateForm(props) {
    let isValidated = true;
    if (props.workordertype == '') {
        isValidated = false
    } else if (props.jobtype == '') {
        isValidated = false
    } else if (props.system == '') {
        isValidated = false
    } else if (props.equipment == '') {
        isValidated = false
    } else if (props.partgroup == '') {
        isValidated = false
    } else if (props.priority == '') {
        isValidated = false
    } else if (props.recommended == '') {
        isValidated = false
    }
    return isValidated
}



const useStyles = makeStyles((theme) => ({
    root: {
        "&.Mui-disabled": {
            backgroundColor: "none"
        }
    }
}));

export function UpdateButton(props) {

    const { update } = useIndexedDB('workOrderLog');
    const handleClick = () => {
        update(props.data).then(event => {
            props.onClose()
        },
        error => {
            console.log("UpdateButton error " + error);
        });
    };

    return (<><Button variant="contained" color="default" onClick={props.onClose} style={{ margin: '5px' }} >
        Cancel
            </Button>
        <Button variant="contained" color="default" onClick={handleClick}>
            Submit
        </Button></>)
}


export function AddNewWorkOrder(props) {
    const classes = useStyles();
    const { add, getAll } = useIndexedDB('workOrderLog');
    const [id, setId] = React.useState(0);
    const [len, setLen] = React.useState(0);
    useEffect(() => {
        getAll().then(obj => {
            if (obj.length > 0) {
                var lastId = obj.slice(-1)[0].id
                if (lastId) {
                    setId(lastId)
                }
                setLen(obj.length)
            }

        });
    }, []);

    const handleClick = () => {
        const data = props.data
        const isValidated = validateForm(data)
        var newLogs = data;
        if (isValidated) {
            var workorderId = `wo-${id}-${len}`
            newLogs.dbId = workorderId
            newLogs.workorder = workorderId
         
            add(data).then(
                event => {
                    props.handleErrorchange("");
                    props.onClose()
                },
                error => {
                    console.log(error);
                }
            );
        } else {
            props.handleErrorchange("*Fill in mandatory fields");
        }

    };

    return (<><Button variant="contained" color="default" onClick={props.onClose} style={{ margin: '5px' }} >
        Cancel
            </Button>
        <Button variant="contained" color="default" onClick={handleClick}>
            Submit
        </Button></>)
}

