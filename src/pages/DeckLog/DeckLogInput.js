import React from 'react';

import { FormControl } from 'react-bootstrap';

import { DateTimePicker } from "@material-ui/pickers";
import { Field } from "formik";
import { createMuiTheme, InputAdornment, Radio } from "@material-ui/core";
import { ThemeProvider, withStyles } from "@material-ui/styles";

const BlueEventsDateTimePicker = createMuiTheme({
    overrides: {
        MuiFormControl: {
            root: {
                backgroundColor: '#032A39',
                border: '1px solid #067FAA',
                borderRadius: '5px',  
                paddingLeft: '5px',
                width: '100%'        
            }
        },
        MuiInputBase: {
            root: {
                color: '#00bbff',
                fontWeight: 'bold'
            }
        },
        MuiSvgIcon: {
            root: {
                color: '#067FAA',
                backgroundColor: '#032A39'
            }
        },
      MuiPickersToolbar: {
        toolbar: {
          backgroundColor: '#032A39',
        },
      },
      MuiPickerDTTabs: {
        tabs: {
            backgroundColor: '#032A39'
        }
      },
      MuiPickersDay: {
        day: {
          color: '#067FAA',
        },
        daySelected: {
          backgroundColor: '#032A39',
        },
        dayDisabled: {
          color: '#067FAA',
        },
        current: {
          color: '#067FAA',
        },
      },
      MuiPickersClockNumber: {
          clockNumberSelected: {
                color: '#067FAA',
                backgroundColor: '#032A39'
            }
      },
      MuiPickersClockPointer:{
        thumb: {
            color: '#067FAA',
            backgroundColor: '#032A39'
        }
      }
    },
});

const DatePickerField = ({ field, form, ...other }) => {
    const currentError = form.errors[field.name];
    return (
        <ThemeProvider theme={BlueEventsDateTimePicker}>
            <DateTimePicker
                name={field.name}
                value={field.value}
                format="dd/MM/yyyy hh:mm a"
                helperText={currentError}
                error={Boolean(currentError)}
                onError={error => {
                if (error !== currentError) {
                    form.setFieldError(field.name, error);
                }
                }}
                onChange={date => form.setFieldValue(field.name, date, false)}
                {...other}
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end" style={{ paddingRight: '5px', color: '#067FAA' }}>
                        <span className="material-icons">date_range</span>
                    </InputAdornment>
                )
                }}
            />
        </ThemeProvider>
    );
};

const MyRadio = withStyles({
    root: {
      color: '#00bbff',
      '&$checked': {
        color: '#00bbff',
      },
    },
    checked: {
        
    },
})((props) => <Radio color="default" {...props} />);

const DeckLogInput = props => (
    <React.Fragment>
        {(props.data.type==='number'||props.data.type==='text')?
            <React.Fragment>
                <label style={props.data.calender?{}:{ flexGrow: 1 }}> {props.data.label}</label>   
                <div>
                    {props.data.calender?
                    <Field name={props.data.field} component={DatePickerField} />
                    :(props.data.options?
                        <React.Fragment>
                        {props.data.optionsList.map((option, idx) =>(
                            <React.Fragment key={idx}>
                                <MyRadio
                                checked={props.data.value===option}
                                onChange={(e) => {
                                    props.setFieldValue(props.data.field,option)
                                }}
                                name={props.data.field}
                                id={props.data.field}
                                inputProps={{ 'aria-label': option }}
                            /> {option}
                            </React.Fragment>
                        ))}
                        </React.Fragment>
                        :
                        <FormControl
                            disabled={props.data.disabled}
                            type={props.data.type} 
                            id={props.data.field} 
                            aria-describedby={props.data.field} 
                            value={props.data.value===null?'':props.data.value}
                            onChange={props.handleChange}
                            name={props.data.field}
                            className={props.data.autoFill?"DeckLogInputBoxAutoFill":"DeckLogInputBox"}
                        />
                        )
                    }
                    {props.data.suffix?<div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%'}}>{props.data.suffix}</div>: <br />}
                </div>
            </React.Fragment>
        :null}
    </React.Fragment>
);

export default DeckLogInput;