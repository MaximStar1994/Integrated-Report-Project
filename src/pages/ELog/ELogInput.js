import React from 'react';

import { FormControl } from 'react-bootstrap';

import { DateTimePicker } from "@material-ui/pickers";
import InputAdornment from '@material-ui/core/InputAdornment';
import { Field } from "formik";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

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

const ELogInput = props => (
    <React.Fragment>
        {
            (props.meta.labels[props.title]['type']==='number'||props.meta.labels[props.title]['type']==='text')?
                <React.Fragment>
                    <label style={props.meta.labels[props.title]['calender']?{}:{ flexGrow: 1 }}> {props.meta.labels[props.title]['title']}</label>   
                    <div>
                        {/* {props.data.calender?
                        <Field name={props.data.field} component={DatePickerField} />
                        : */}
                            <FormControl
                                disabled={props.meta.labels[props.title]['disabled']}
                                type={props.meta.labels[props.title]['type']} 
                                id={`${props.meta.labels[props.title]['prefix']}.${props.title}`} 
                                aria-describedby={`${props.meta.labels[props.title]['prefix']}.${props.title}`} 
                                value={props.value===null?'':props.value}
                                onChange={props.handleChange}
                                name={`${props.meta.labels[props.title]['prefix']}.${props.title}`}
                                className={props.meta.labels[props.title]['autoFill']?"ELogInputBoxAutoFill":"ELogInputBox"}
                            />
                        {/* } */}
                        {props.meta.labels[props.title]['unit']?<div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%'}}>{props.meta.labels[props.title]['unit']}</div>: <br />}
                    </div>
                </React.Fragment>
            :null
        }
    </React.Fragment>
);

export default ELogInput;