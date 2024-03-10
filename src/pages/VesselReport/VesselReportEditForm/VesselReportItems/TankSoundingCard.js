import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import config from '../../../../config/config';
import { TankSoundingsStructure } from '../VesselReportFormStructure';

const TankSoundingCard = props => (
    <Card style={{ padding: '10px', borderRadius: '10px', marginBottom: '10px'}}>
        <div style={{ color: config.KSTColors.MAIN, fontSize: '0.8rem', marginBottom: '10px' }}>{`${props.data.identifier}`}</div>
            {Object.entries(TankSoundingsStructure).map(([element, elementDetail], idx) => (
                <Form.Group  as={Row} key={idx} style={{ marginBottom: '2px' }}>
                        <Col xs={6} style={{ paddingRight: '0px', marginBottom: '10px' }}>
                                <Form.Control 
                                    style={{ color: config.KSTColors.MAIN, fontWeight: '10' }} 
                                    className={(props?.touched?.['tanksoundings']?.[props.index]?.[element] && props?.errors?.['tanksoundings']?.[props.index]?.[element]) !== undefined?"VesselReportFillableErrorBox":"VesselReportFillableBox"}   
                                    type={elementDetail.type} 
                                    id={`tanksoundings[${props.index}].${element}`} 
                                    aria-describedby={`tanksoundings[${props.index}].${element}`} 
                                    value={props.data[element]===null?'':props.data[element]}
                                    onChange={props.handleChange}
                                    name={`tanksoundings[${props.index}].${element}`}
                                />
                                {(props?.touched?.['tanksoundings']?.[props.index]?.[`${element}`] && props?.errors?.['tanksoundings']?.[props.index]?.[`${element}`]) !== undefined&& <span className="VesselReportError">{props?.errors?.['tanksoundings']?.[props.index]?.[`${element}`]}</span>}
                        </Col>
                        <Col xs={1} style={{ padding: '0px' }}>
                            <div style={{ marginLeft: '10px', color: config.KSTColors.MAIN, display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>{elementDetail.suffix}</div>
                        </Col>
                        <Col xs={5} style={{ paddingLeft: '0px' }}>
                            <div style={{ marginLeft: '10px', color: config.KSTColors.MAIN, display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>{`( ${props.data[`${elementDetail.max}`]===null?' - ':props.data[`${elementDetail.max}`]}`}{elementDetail.suffix}{' )'}</div>
                        </Col>
                </Form.Group>
            ))}
    </Card>
);

export default TankSoundingCard;