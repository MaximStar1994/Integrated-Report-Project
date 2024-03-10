import React from 'react';
import VesselReportHeader from './VesselReportHeader';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';
import { Select, MenuItem } from '@material-ui/core';
import config from '../../../../config/config';
import { AzimuthThrusterStructure } from '../VesselReportFormStructure';

const AzimuthThruster = props => {
    return(
        <React.Fragment>
            <VesselReportHeader notes="Note: Please key in '0' for malfunction sensor" heading="Azimuth Thruster" saveForm={props.saveForm} saved={props.saved}  isSubmit={props.isSubmit} webUrl={props.webUrl}/>
            <Container fluid>
                    <Row>
                        {props.data.map((item, index)=>(
                            <Col sm={6} xs={12} key={index}>
                                <Card style={{ padding: '10px', borderRadius: '10px' }}>
                                    {Object.entries(AzimuthThrusterStructure).map(([element, elementDetail], idx) => (
                                        <Form.Group  as={Row} key={idx}>
                                            <Form.Label column xs={4} style={{ color: config.KSTColors.MAIN, fontSize: '0.8rem' }}>{`${item.identifier}.${elementDetail.title}`}</Form.Label>
                                            {(elementDetail.type==='text' || elementDetail.type==='number')&&
                                                <Col xs={8}>
                                                    <div style={{ display: 'flex' }}>
                                                        <Form.Control 
                                                            className={(props?.touched?.zpClutch?.[index]?.[element] && props?.errors?.zpClutch?.[index]?.[element]) !== undefined?"VesselReportFillableErrorBox":(item[element]===null||item[element]===''||elementDetail.min===undefined || elementDetail.max===undefined || (item[element]>=elementDetail.min && item[element]<=elementDetail.max))?"VesselReportFillableBox":"VesselReportFillableBoxOutOfRange"}   
                                                            type={elementDetail.type} 
                                                            id={`zpClutch[${index}].${element}`} 
                                                            aria-describedby={`zpClutch[${index}].${element}`} 
                                                            value={item[element]===null?'':item[element]}
                                                            onChange={props.handleChange}
                                                            name={`zpClutch[${index}].${element}`}
                                                        />
                                                        <div style={{ width: '20px', marginLeft: '10px', color: config.KSTColors.MAIN, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{elementDetail.suffix}</div>
                                                    </div>
                                                    {(props?.touched?.zpClutch?.[index]?.[`${element}`] && props?.errors?.zpClutch?.[index]?.[`${element}`]) !== undefined&& <span className="VesselReportError">{props.errors.zpClutch[index][`${element}`]}</span>}
                                                </Col>
                                            }
                                            {elementDetail.type==='textarea'&&
                                                <Col xs={8}>
                                                    <div style={{ display: 'flex' }}>
                                                        <Form.Control 
                                                            className={(props?.touched?.zpClutch?.[index]?.[element] && props?.errors?.zpClutch?.[index]?.[element]) !== undefined?"VesselReportFillableErrorBox":"VesselReportFillableBox"}    
                                                            as={elementDetail.type} 
                                                            rows={5} 
                                                            id={`zpClutch[${index}].${element}`} 
                                                            aria-describedby={`zpClutch[${index}].${element}`} 
                                                            value={item[element]===null?'':item[element]}
                                                            onChange={props.handleChange}
                                                            name={`zpClutch[${index}].${element}`}
                                                        />
                                                        <div style={{ width: '20px', marginLeft: '10px', color: config.KSTColors.MAIN, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{elementDetail.suffix}</div>
                                                    </div>
                                                    {(props?.touched?.zpClutch?.[index]?.[`${element}`] && props?.errors?.zpClutch?.[index]?.[`${element}`]) !== undefined&& <span className="VesselReportError">{props.errors.zpClutch[index][`${element}`]}</span>}
                                                </Col>
                                            }
                                            {elementDetail.type==='selection'&&
                                            <Col xs={8}>
                                                <div style={{ display: 'flex' }}>
                                                    <div style={{ width: elementDetail.othersAllowed===true?'50%':'100%' }} className="VesselReportSelectionBox">
                                                        <Select style={{ color: config.KSTColors.MAIN }} 
                                                            type={elementDetail.type} 
                                                            disableUnderline
                                                            id={`zpClutch[${index}].${element}`} 
                                                            aria-describedby={`zpClutch[${index}].${element}`} 
                                                            value={item[element]===null?'':item[element]}
                                                            onChange={props.handleChange}
                                                            name={`zpClutch[${index}].${element}`}
                                                            className={(props?.touched?.zpClutch?.[index]?.[element] && props?.errors?.zpClutch?.[index]?.[element]) !== undefined?"VesselReportFillableErrorBox":"VesselReportFillableBox"}   
                                                        >
                                                            {Object.entries(elementDetail.options).map(([option, optionText]) => <MenuItem value={option} key={option}> {optionText.text}</MenuItem>)}
                                                        </Select>
                                                    </div>
                                                    <div style={{ width: '20px', marginLeft: '10px', color: config.KSTColors.MAIN, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{elementDetail.suffix}</div>
                                                </div>
                                                {(props?.touched?.zpClutch?.[index]?.[`${element}`] && props?.errors?.zpClutch?.[index]?.[`${element}`]) !== undefined&& <span className="VesselReportError">{props.errors.zpClutch[index][`${element}`]}</span>}
                                            </Col>
                                            }
                                        </Form.Group>
                                    ))
                                    }
                                </Card>
                            </Col>
                        ))}
                    </Row>

                </Container>
            </React.Fragment>
    );
}

export default AzimuthThruster;