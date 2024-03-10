import React from 'react';
import { Row, Col, Form, Card } from 'react-bootstrap';
import config from '../../../../config/config';
import { ROBStructure } from '../VesselReportFormStructure';

const ConsumableROBCard = props => (
    <Card style={{ padding: '10px', borderRadius: '10px', marginBottom: '10px'}}>
        {Object.entries(ROBStructure).map(([element, elementDetail], idx) => (
            <Form.Group  as={Row} key={idx} style={{ marginBottom: '2px' }}>
                <Form.Label column xs={7} style={{ color: config.KSTColors.MAIN, fontSize: '0.8rem' }}>{`${props.data.identifier} ${elementDetail.title}`}</Form.Label>
                {(elementDetail.type==='text' || elementDetail.type==='number')&&
                    <Col xs={5}>
                        <div style={{ display: 'flex' }}>
                            <Form.Control 
                                style={{ color: config.KSTColors.MAIN, fontWeight: '10' }}
                                className={(props?.touched?.rob?.[props.index]?.[element] && props?.errors?.rob?.[props.index]?.[element]) !== undefined?"VesselReportFillableErrorBox":elementDetail.editable===false?"VesselReportNonFillableBox":"VesselReportFillableBox"}
                                type={elementDetail.type} 
                                id={`rob[${props.index}].${element}`} 
                                aria-describedby={`rob[${props.index}].${element}`} 
                                value={element==='rob'?props.data['carryForward']+props.data['received']-props.data['consumed']:props.data[element]===null?'':props.data[element]}
                                onChange={props.handleChange}
                                name={`rob[${props.index}].${element}`}
                                disabled={elementDetail.editable===false}
                            />
                            <div style={{ width: '20px', marginLeft: '10px', color: config.KSTColors.MAIN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'MonteCarlo', fontWeight: '900' }}>{props.data.identifier==='LNG'?elementDetail.suffix[0]:elementDetail.suffix[1]}</div>
                        </div>
                        {(props?.touched?.rob?.[props.index]?.[`${element}`] && props?.errors?.rob?.[props.index]?.[`${element}`]) !== undefined&& <span className="VesselReportError">{props.errors.rob[props.index][`${element}`]}</span>}
                    </Col>
                }
            </Form.Group>
        ))
        }
    </Card>

);

export default ConsumableROBCard;