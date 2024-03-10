import React from 'react';
import {Card, Container, Row, Col, FormControl} from 'react-bootstrap';
import { DateTimePicker } from "@material-ui/pickers";
import { Field } from "formik";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import InputAdornment from '@material-ui/core/InputAdornment';
import './BDN.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShip, faTasks, faCheckSquare, faCalendar } from '@fortawesome/free-solid-svg-icons';

const BlueEventsDateTimePicker = createMuiTheme({
    overrides: {
        MuiFormControl: {
            root: {
                backgroundColor: '#032A39',
                border: '1px solid #067FAA',
                borderRadius: '5px',  
                paddingLeft: '5px'        
            }
        },
        MuiInputBase: {
            root: {
                // color: '#067FAA'
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
                    form.setFieldError(field.name, error, false);
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

const eventsCard = props => {
    return(
    <Card style={{ height :'100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
        {props.header?
            <Card.Header style={{ border: '0px', color: '#067FAA', backgroundColor: '#032a39'}}>
                {props.header}
            </Card.Header>
        :null}
        <Card.Body style={{ height: '100%', border: '0px' }}>
            <Container>
            {props.data.map((row, idx) => {
                let prevValue = idx-1;
                return(
                <React.Fragment key={idx} >
                    <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', paddingLeft: '5px' }} className="timelineContainer">
                        <Card.Body style={{ height: '100%', padding: '0px 0px 0px 0px', verticalAlign: 'center' }}>
                            <Row style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' , alignItems :'center' }}>
                                <Col>
                                    <Row>
                                        <Col xs={1} style={{display : "flex", flexDirection : "column"}}>
                                            <div className={'VerticalTimelineEvents'}>
                                                <div style={{alignSelf : 'center'}}>
                                                    <div className="TimelineLine" >
                                                    </div>
                                                    {idx===0?
                                                        (<div className='VerticalTimelineEventsDotFirst'> <FontAwesomeIcon icon={faShip} /> </div>):
                                                    (idx===props.data.length-1?
                                                        <div className='VerticalTimelineEventsDotLast'> <FontAwesomeIcon icon={faTasks} /> </div>:
                                                        (row.field==='startTransferDate'?
                                                            <FontAwesomeIcon icon={faCheckSquare} size='2x' />:
                                                            <div className='VerticalTimelineEventsDot' />
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                        {row.field==='startTransferDate'?
                                            <Col style={{ position: 'relative', backgroundColor: 'rgba(4,56,76,100)', paddingTop: '23px', paddingBottom: '23px', fontWeight: 'bold', fontSize: '1.3em', marginLeft: '15px', paddingLeft: '0px' }}>
                                                <div style={{ position: 'absolute', left: '-18px', top: '0px', width: '0px', height: '0px', borderRight: '18px solid rgba(4,56,76,100)', borderBottom: '40px solid transparent', borderTop: '40px solid transparent' }}>
                                                </div>
                                            <div style={{ }}>
                                                <div>
                                                    {row.label}
                                                </div>
                                            </div>
                                            </Col>
                                            :
                                            <Col style={{ paddingTop: '30px', paddingBottom: '17px' }}>
                                                {row.label}
                                            </Col>
                                        }
                                        <Col xs={6} style={row.field==='startTransferDate'?{ backgroundColor: 'rgba(4,56,76,100)', paddingTop: '23px', paddingBottom: '23px' }:{ paddingTop: '23px', paddingBottom: '23px' }}>
                                            <Field name={row.field} component={DatePickerField} disabled={idx!==0 && (props.data[prevValue].value===null||props.data[prevValue].value==='')}/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    </React.Fragment>
            )})}
            </Container>
        </Card.Body>
    </Card>
)
};

export default eventsCard;