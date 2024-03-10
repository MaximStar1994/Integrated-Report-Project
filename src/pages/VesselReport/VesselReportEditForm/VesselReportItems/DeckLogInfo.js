import React from 'react';
import VesselReportHeader from './VesselReportHeader';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Select, MenuItem } from '@material-ui/core';

import { DeckLogStructure, statusSelections } from '../VesselReportFormStructure';
import config from '../../../../config/config';
import './VesselReportItems.css';

import { DateTimePicker } from "@material-ui/pickers";
import InputAdornment from '@material-ui/core/InputAdornment';
import moment from 'moment';

const DeckLogInfo = props => {
    return(
        <React.Fragment>
            <VesselReportHeader heading="Deck Log Info" saveForm={props.saveForm} saved={props.saved}  isSubmit={props.isSubmit} webUrl={props.webUrl}/>
            <Container fluid>
                <Row>
                    {Object.entries(DeckLogStructure).map(([element, elementDetail], idx) => (
                        <Col xs={6} key={idx}>
                            <Form.Group>
                                <Form.Label style={{ color: config.KSTColors.MAIN }}>{elementDetail.title}</Form.Label>
                                        {(elementDetail.type==='text'||elementDetail.type==="number")&&
                                            <React.Fragment>
                                                <Form.Control 
                                                    className={(props?.touched?.decklogs?.[0]?.[element] && props?.errors?.decklogs?.[0]?.[element]) !== undefined?"VesselReportFillableErrorBox":"VesselReportFillableBox"}   
                                                    type={elementDetail.type} 
                                                    id={`decklogs[0].${element}`} 
                                                    aria-describedby={`decklogs[0].${element}`} 
                                                    value={props.data[element]===null?'':props.data[element]}
                                                    onChange={props.handleChange}
                                                    name={`decklogs[0].${element}`}
                                                />
                                                {(props?.touched?.decklogs?.[0]?.[`${element}`] && props?.errors?.decklogs?.[0]?.[`${element}`]) !== undefined&& <span className="VesselReportError">{props.errors.decklogs[0][`${element}`]}</span>}
                                            </React.Fragment>
                                        }
                                {elementDetail.type==='selection'&&
                                    <React.Fragment>
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ width: elementDetail.othersAllowed===true?'50%':'100%' }} className="VesselReportSelectionBox">
                                                <Select style={{ color: config.KSTColors.MAIN }} 
                                                    type={elementDetail.type} 
                                                    disableUnderline 
                                                    id={`decklogs[0].${element}`} 
                                                    aria-describedby={`decklogs[0].${element}`} 
                                                    value={props.data[element]===null?'':props.data[element]}
                                                    onChange={props.handleChange}
                                                    name={`decklogs[0][${element}]`}
                                                    className={(props?.touched?.decklogs?.[0]?.[element] && props?.errors?.decklogs?.[0]?.[element]) !== undefined?"VesselReportFillableErrorBox":"VesselReportFillableBox"}   
                                                >
                                                    {Object.entries(elementDetail.options).map(([option, optionText]) => <MenuItem value={option} key={option}> {optionText.text}</MenuItem>)}
                                                </Select>
                                            </div>
                                        {elementDetail.othersAllowed===true&&
                                            <React.Fragment>
                                                <div style={{ display: 'flex', flexGrow: '1' }} />
                                                <div style={{ width: '49%', 
                                                    display: statusSelections[props.data[element]].enableOthers===true?'block':'none'
                                                }}>
                                                    <Form.Control 
                                                        style={{ color: config.KSTColors.MAIN, fontWeight: '10' }} 
                                                        type='text' 
                                                        id={`decklogs[0].${elementDetail.other}`} 
                                                        aria-describedby={`decklogs[0].${elementDetail.other}`} 
                                                        value={props.data[elementDetail.other]===null?'':props.data[elementDetail.other]}
                                                        onChange={props.handleChange}
                                                        name={`decklogs[0][${elementDetail.other}]`}
                                                        
                                                    />
                                                </div>
                                            </React.Fragment>
                                        }
                                        </div>
                                        {(props?.touched?.decklogs?.[0]?.[`${element}`] && props?.errors?.decklogs?.[0]?.[`${element}`]) !== undefined&& <span className="VesselReportError">{props.errors.decklogs[0][`${element}`]}</span>}
                                    </React.Fragment>
                                }
                                {elementDetail.type==='datetime'&&
                                    <React.Fragment>
                                        <div className="TimePicker">
                                            <DateTimePicker
                                                id={`decklogs[0].${element}`} 
                                                aria-describedby={`decklogs[0].${element}`} 
                                                value={props.data[element]===null?null:moment(props.data[element])}
                                                onChange={e => props.setFieldValue(`decklogs[0].${element}`, moment(e).format())}
                                                name={`decklogs[0].${element}`}
                                                format="dd / MM / yyyy HH:mm"
                                                InputProps={{
                                                    endAdornment: (
                                                    <InputAdornment position="end" style={{ paddingRight: '5px', color: '#067FAA' }}>
                                                        <span className="material-icons">date_range</span>
                                                    </InputAdornment>
                                                    )
                                                }}
                                                className={(props?.touched?.decklogs?.[0]?.[element] && props?.errors?.decklogs?.[0]?.[element]) !== undefined?"VesselReportFillableErrorBox":"VesselReportFillableBox"}   
                                            />
                                        </div>
                                        {(props?.touched?.decklogs?.[0]?.[`${element}`] && props?.errors?.decklogs?.[0]?.[`${element}`]) !== undefined&& <span className="VesselReportError">{props.errors.decklogs[0][`${element}`]}</span>}
                                    </React.Fragment>
                                }
                            </Form.Group>
                        </Col>
                    ))
                    }
                </Row>
            </Container>
        </React.Fragment>

    );
}

export default DeckLogInfo;