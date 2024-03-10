import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    formControl: {
        color: '#0b8dbe'
    },
}));

export default function CheckboxesGroup(props) {
    const classes = useStyles();
    const [state, setState] = React.useState(props.data); 
    const [allowSelection, setAllowSelection] = React.useState(props.allowSelection ? true : false)

    const handleChange = (event) => {
        const newState = {
            clean: false,
            serviced: false,
            replaced: false,
        }
        Object.entries(newState).map(([key, value]) => {

            if (key == event.target.name) {
                setState({ ...newState, [event.target.name]: event.target.checked });
                props.handleActionTaken(event.target.name)
            }
        })

    };

    const { clean, serviced, replaced } = state;
    
    return (
        <div className={classes.root}>
            <FormControl component="fieldset" className={classes.formControl} >
                <FormLabel component="legend"></FormLabel>
                <FormGroup row  >
                    <FormControlLabel
                        control={<Checkbox checked={clean} onChange={handleChange} name="clean" />}
                        label="Clean" disabled={props.allowSelection ? false : true}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={serviced} onChange={handleChange} name="serviced" />}
                        label="Serviced" disabled={props.allowSelection ? false : true}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={replaced} onChange={handleChange} name="replaced" />}
                        label="Replaced" disabled={props.allowSelection ? false : true}
                    />
                </FormGroup>
            </FormControl>
        </div>
    );
}
