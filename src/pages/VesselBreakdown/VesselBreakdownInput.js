import React from 'react';
import { Form } from 'react-bootstrap';
import { Select, MenuItem } from '@material-ui/core';
import config from '../../config/config';
import { DatePicker, TimePicker, DateTimePicker } from "@material-ui/pickers";
import InputAdornment from '@material-ui/core/InputAdornment';
import moment from 'moment';
const VesselBreakdownInput = props => {
    return(
        <Form.Group style={{ marginBottom: '2px', marginRight: '0px' }}>
                <Form.Label column xs={7} style={{ color: config.KSTColors.MAIN, fontSize: '1rem', paddingRight: '0px', paddingBottom: '0px'}}>{props.title}</Form.Label>
                    {(props.type==='text' || props.type==='number')&&
                        <React.Fragment>
                            <div style={{ paddingLeft: '5px', paddingRight: '5px', display: 'flex', alignItems: 'center', flexFlow: 'column' }}>
                                <Form.Control
                                    type={props.type} 
                                    id={props.id} 
                                    aria-describedby={props.id} 
                                    value={props.value===null?'':props.value}
                                    onChange={props.handleChange}
                                    name={props.id}
                                    className={(props?.touched?.[`${props.id}`] && props?.errors?.[`${props.id}`]) !== undefined?"VesselReportFillableErrorBox":props.editable===false?"VesselReportNonFillableBox":"VesselReportFillableBox"}
                                    style={{ padding: '5px' }}
                                    disabled={props.editable===false}
                                />
                                {props.support===true?
                                    (props.touched?.['event']?.['support']?.[props.errorId] && props.errors?.['event']?.['support']?.[props.errorId]) !== undefined&&<span className="VesselReportError">{props.errors?.['event']?.['support']?.[props.errorId]}</span>
                                    :
                                    (props.touched?.['event']?.[props.errorId] && props.errors?.['event']?.[props.errorId]) !== undefined&&<span className="VesselReportError">{props.errors?.['event']?.[props.errorId]}</span>
                                }
                            </div>
                        </React.Fragment>
                    }
                    {props.type==='selection'&&
                        <React.Fragment>
                            <div style={{ paddingLeft: '5px', paddingRight: '5px', display: 'flex', alignItems: 'center', flexFlow: 'column' }}>
                                <div style={{ width: '100%' }} className="VesselReportSelectionBox">
                                    <Select
                                        type={props.type} 
                                        id={`${props.id}`} 
                                        name={`${props.id}`} 
                                        aria-describedby={props.id} 
                                        value={props.value===null?'':props.value}
                                        onChange={props.handleChange}
                                        className={(props?.touched?.[`${props.id}`] && props?.errors?.[`${props.id}`]) !== undefined?"VesselReportFillableErrorBox":"VesselReportFillableBox"}   
                                        style={{ padding: '5px', color: '#04588e', fontWeight: '500' }}
                                        disableUnderline
                                    >
                                        {props.options.map((option, idx) => {
                                            if(option==='')
                                                return(<MenuItem value={option} key={idx}> Select {props.title}</MenuItem>)
                                            else
                                                return(<MenuItem value={option} key={idx}>{option}</MenuItem>)
                                        })}
                                    </Select>
                                </div>
                                {props.support===true?
                                    (props.touched?.['event']?.['support']?.[props.errorId] && props.errors?.['event']?.['support']?.[props.errorId]) !== undefined&&<span className="VesselReportError">{props.errors?.['event']?.['support']?.[props.errorId]}</span>
                                    :
                                    (props.touched?.['event']?.[props.errorId] && props.errors?.['event']?.[props.errorId]) !== undefined&&<span className="VesselReportError">{props.errors?.['event']?.[props.errorId]}</span>
                                }
                            </div>
                        </React.Fragment>
                    }
                    {props.type==='datetime'&&
                        <React.Fragment>
                            <div className="TimePicker">
                                <DateTimePicker
                                    disableFuture={props.disableFutureDates ? true : false }
                                    id={props.id} 
                                    aria-describedby={props.id} 
                                    value={props.value===null?null:moment(props.value)}
                                    onChange={e => props.setFieldValue(props.id, moment(e).format())}
                                    name={props.id}
                                    format="dd / MM / yyyy HH:mm"
                                    InputProps={{
                                        endAdornment: (
                                        <InputAdornment position="end" style={{ paddingRight: '5px', color: '#067FAA' }}>
                                            <span className="material-icons">date_range</span>
                                        </InputAdornment>
                                        )
                                    }}
                                    className={(props?.touched?.[props.id] && props?.errors?.[props.id]) !== undefined?"VesselReportFillableErrorBox":"VesselReportFillableBox"}
                                />
                            </div>
                            {props.support===true?
                                (props.touched?.['event']?.['support']?.[props.errorId] && props.errors?.['event']?.['support']?.[props.errorId]) !== undefined&&<span className="VesselReportError">{props.errors?.['event']?.['support']?.[props.errorId]}</span>
                                :
                                (props.touched?.['event']?.[props.errorId] && props.errors?.['event']?.[props.errorId]) !== undefined&&<span className="VesselReportError">{props.errors?.['event']?.[props.errorId]}</span>
                            }
                        </React.Fragment>
                    }
                    {props.type==='date'&&
                        <React.Fragment>
                            <div className="TimePicker">
                                <DatePicker
                                    id={props.id} 
                                    aria-describedby={props.id} 
                                    value={props.value===null?null:moment(props.value)}
                                    onChange={e => props.setFieldValue(props.id, moment(e).format())}
                                    name={props.id}
                                    format="dd / MM / yyyy"
                                    InputProps={{
                                        endAdornment: (
                                        <InputAdornment position="end" style={{ paddingRight: '5px', color: '#067FAA' }}>
                                            <span className="material-icons">date_range</span>
                                        </InputAdornment>
                                        )
                                    }}
                                    className={(props?.touched?.[props.id] && props?.errors?.[props.id]) !== undefined?"VesselReportFillableErrorBox":"VesselReportFillableBox"}
                                />
                            </div>
                            {props.support===true?
                                (props.touched?.['event']?.['support']?.[props.errorId] && props.errors?.['event']?.['support']?.[props.errorId]) !== undefined&&<span className="VesselReportError">{props.errors?.['event']?.['support']?.[props.errorId]}</span>
                                :
                                (props.touched?.['event']?.[props.errorId] && props.errors?.['event']?.[props.errorId]) !== undefined&&<span className="VesselReportError">{props.errors?.['event']?.[props.errorId]}</span>
                            }
                        </React.Fragment>
                    }
                    {props.type==='time'&&
                        <React.Fragment>
                            <div className="TimePicker">
                                <TimePicker
                                    id={props.id} 
                                    aria-describedby={props.id} 
                                    value={props.value===null?null:moment(props.value)}
                                    onChange={e => props.setFieldValue(props.id, moment(e).format())}
                                    name={props.id}
                                    format="HH:mm"
                                    InputProps={{
                                        endAdornment: (
                                        <InputAdornment position="end" style={{ paddingRight: '5px', color: '#067FAA' }}>
                                            <span className="material-icons">access_time</span>
                                        </InputAdornment>
                                        )
                                    }}
                                    className={(props?.touched?.[props.id] && props?.errors?.[props.id]) !== undefined?"VesselReportFillableErrorBox":"VesselReportFillableBox"}
                                />
                            </div>
                            {props.support===true?
                                (props.touched?.['event']?.['support']?.[props.errorId] && props.errors?.['event']?.['support']?.[props.errorId]) !== undefined&&<span className="VesselReportError">{props.errors?.['event']?.['support']?.[props.errorId]}</span>
                                :
                                (props.touched?.['event']?.[props.errorId] && props.errors?.['event']?.[props.errorId]) !== undefined&&<span className="VesselReportError">{props.errors?.['event']?.[props.errorId]}</span>
                            }
                        </React.Fragment>
                    }
                    {props.type==="textarea"&&
                        <Form.Group>
                            <Form.Control 
                                style={{ color: config.KSTColors.MAIN, fontWeight: '10' }} 
                                as={props.type}
                                rows={10} 
                                id={props.id} 
                                aria-describedby={props.id} 
                                value={props.value===null?'':props.value}
                                onChange={props.handleChange}
                                name={props.id}
                            />
                            {props.support===true?
                                (props.touched?.['event']?.['support']?.[props.errorId] && props.errors?.['event']?.['support']?.[props.errorId]) !== undefined&&<span className="VesselReportError">{props.errors?.['event']?.['support']?.[props.errorId]}</span>
                                :
                                (props.touched?.['event']?.[props.errorId] && props.errors?.['event']?.[props.errorId]) !== undefined&&<span className="VesselReportError">{props.errors?.['event']?.[props.errorId]}</span>
                            }
                        </Form.Group>
                    }
                </Form.Group>
    );
}

export default VesselBreakdownInput;