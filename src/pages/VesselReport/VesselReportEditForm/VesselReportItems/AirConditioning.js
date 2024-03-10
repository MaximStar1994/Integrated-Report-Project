import React from 'react';
import VesselReportHeader from './VesselReportHeader';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';
import config from '../../../../config/config';
import { AirConditioningStructure } from '../VesselReportFormStructure';

const AirConditioning = props => {
    return(
        <React.Fragment>
            <VesselReportHeader heading="Air Conditioning" saveForm={props.saveForm} saved={props.saved}  isSubmit={props.isSubmit} webUrl={props.webUrl}/>
            <Container fluid>
                    <Row>
                        <Col sm={6} xs={12}>
                            <Card style={{ padding: '10px', borderRadius: '10px' }}>
                                {Object.entries(AirConditioningStructure).map(([element, elementDetail], idx) => (
                                    <Form.Group  as={Row} key={idx}>
                                        <Form.Label column xs={4} style={{ color: config.KSTColors.MAIN, fontSize: '0.8rem' }}>{elementDetail.title}</Form.Label>
                                        {(elementDetail.type==='text' || elementDetail.type==='number')&&
                                            <Col xs={8}>
                                                <div style={{ display: 'flex' }}>
                                                    <Form.Control 
                                                        className={(props?.touched?.aircons?.[0]?.[element] && props?.errors?.aircons?.[0]?.[element]) !== undefined?"VesselReportFillableErrorBox":"VesselReportFillableBox"}   
                                                        type={elementDetail.type} 
                                                        id={`aircons[0].${element}`} 
                                                        aria-describedby={`aircons[0].${element}`} 
                                                        value={props.data[element]===null?'':props.data[element]}
                                                        onChange={props.handleChange}
                                                        name={`aircons[0].${element}`}
                                                    />
                                                    <div style={{ width: '20px', marginLeft: '10px', color: config.KSTColors.MAIN, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{elementDetail.suffix}</div>
                                                </div>
                                                {(props?.touched?.aircons?.[0]?.[`${element}`] && props?.errors?.aircons?.[0]?.[`${element}`]) !== undefined&& <span className="VesselReportError">{props.errors.aircons[0][`${element}`]}</span>}
                                            </Col>
                                        }
                                        {elementDetail.type==='textarea'&&
                                            <Col xs={8}>
                                                <div style={{ display: 'flex' }}>
                                                    <Form.Control 
                                                        className={(props?.touched?.aircons?.[0]?.[element] && props?.errors?.aircons?.[0]?.[element]) !== undefined?"VesselReportFillableErrorBox":"VesselReportFillableBox"}    
                                                        as={elementDetail.type} 
                                                        rows={5} 
                                                        id={`aircons[${0}].${element}`} 
                                                        aria-describedby={`aircons[${0}].${element}`} 
                                                        value={props.data[element]===null?'':props.data[element]}
                                                        onChange={props.handleChange}
                                                        name={`aircons[0].${element}`}
                                                    />
                                                    <div style={{ width: '20px', marginLeft: '10px', color: config.KSTColors.MAIN, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{elementDetail.suffix}</div>
                                                </div>
                                                {(props?.touched?.aircons?.[0]?.[`${element}`] && props?.errors?.aircons?.[0]?.[`${element}`]) !== undefined&& <span className="VesselReportError">{props.errors.aircons[0][`${element}`]}</span>}
                                            </Col>
                                        }
                                    </Form.Group>
                                ))
                                }
                            </Card>
                        </Col>
                    </Row>
            </Container>
        </React.Fragment>
    );
}

export default AirConditioning;