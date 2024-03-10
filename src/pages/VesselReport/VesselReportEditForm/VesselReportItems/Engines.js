import React from 'react';
import VesselReportHeader from './VesselReportHeader';
import { Container, Row, Col, Card, Form, Tabs, Tab } from 'react-bootstrap';
import config from '../../../../config/config';
import { MainEngine11Structure, MainEngine11LNGStructure, MainEngine12Structure, MainEngine13Structure, MainEngine21Structure, MainEngine31Structure, MainEngine32Structure, MainEngine41Structure, MainEngine42Structure, AE11Structure, AE12Structure, AE13Structure ,AE21Structure } from '../VesselReportFormStructure';
import EnginesCard from './EnginesCard';

const Engines = props => {
    const getValue = (engine, index, item) => props[engine][index][item];
    return(
        <React.Fragment>
            <VesselReportHeader notes="Note: Please key in '0' for malfunction sensor" heading="Engines" saveForm={props.saveForm} saved={props.saved}  isSubmit={props.isSubmit} webUrl={props.webUrl} />
            <Container fluid className="Engines">
                    <Tabs defaultActiveKey={`${props.engines[0].engineIdentifier} Main Engine`} id={`${props.engines[0].engineIdentifier} Main Engine`}>
                        {props.engines.map((item, index)=>(
                            <Tab key={index} eventKey={`${item.engineIdentifier} Main Engine`} title={`${item.engineIdentifier} Main Engine`}>
                                <Row>
                                    <Col lg={3} xs={12} sm={6}  style={{ paddingRight: '0px' }} key={1}>
                                        {/* <Row>
                                            <Col>
                                                <EnginesCard type='engines' item={item} getValue={getValue} index={index} structure={props.LNGProperties?MainEngine11LNGStructure:MainEngine11Structure} identifier='engineIdentifier' touched={props.touched} errors={props.errors} handleChange={props.handleChange} setFieldValue={props.setFieldValue} />
                                            </Col>
                                        </Row> */}
                                        <Row>
                                            <Col>
                                                <EnginesCard type='engines' item={item} index={index} structure={MainEngine12Structure} identifier='engineIdentifier' touched={props.touched} errors={props.errors} handleChange={props.handleChange} />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg={3} xs={12} sm={6} style={{ paddingRight: '0px' }} key={2}>
                                        <EnginesCard type='engines' item={item} index={index} structure={MainEngine21Structure} identifier='engineIdentifier' touched={props.touched} errors={props.errors} handleChange={props.handleChange} />
                                    </Col>
                                    <Col lg={3} xs={12} sm={6}  style={{ paddingRight: '0px' }} key={3}>
                                        <Row>
                                            <Col>
                                                <EnginesCard type='engines' item={item} index={index} structure={MainEngine31Structure} identifier='engineIdentifier' touched={props.touched} errors={props.errors} handleChange={props.handleChange} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <EnginesCard type='engines' item={item} index={index} structure={MainEngine32Structure} identifier='engineIdentifier' touched={props.touched} errors={props.errors} handleChange={props.handleChange} />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg={3} xs={12} sm={6} key={4}>
                                        <Row>
                                            <Col>
                                                <EnginesCard type='engines' item={item} index={index} structure={MainEngine41Structure} identifier='engineIdentifier' touched={props.touched} errors={props.errors} handleChange={props.handleChange} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <EnginesCard type='engines' item={item} index={index} structure={MainEngine42Structure} identifier='engineIdentifier' touched={props.touched} errors={props.errors} handleChange={props.handleChange} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card style={{ padding: '10px', borderRadius: '10px', marginBottom: '10px'}}>
                                            {Object.entries(MainEngine13Structure).map(([element, elementDetail], idx) => (
                                                <Form.Group  as={Row} key={idx} style={{ marginBottom: '2px' }}>
                                                    <Form.Label column xs={7} style={{ color: config.KSTColors.MAIN, fontSize: '0.8rem' }}>{`${item.engineIdentifier}.${elementDetail.title}`}</Form.Label>
                                                    {elementDetail.type==='textarea'&&
                                                        <Col xs={12}>
                                                            <div style={{ display: 'flex' }}>
                                                                <Form.Control 
                                                                    className={(props?.touched?.engines?.[index]?.[element] && props?.errors?.engines?.[index]?.[element]) !== undefined?"VesselReportFillableErrorBox":"VesselReportFillableBox"} 
                                                                    as={elementDetail.type} 
                                                                    rows={5} 
                                                                    id={`engines[${index}].${element}`} 
                                                                    aria-describedby={`engines[${index}].${element}`} 
                                                                    value={item[element]===null?'':item[element]}
                                                                    onChange={props.handleChange}
                                                                    name={`engines[${index}].${element}`}
                                                                />
                                                            </div>
                                                        </Col>
                                                    }
                                                </Form.Group>
                                            ))
                                            }
                                        </Card>
                                    </Col>
                                </Row>
                            </Tab>                    
                        ))}

                        {/* Generators starts here */}
                        {props.generators.map((item, index)=>(
                            <Tab key={index} eventKey={`${item.generatorIdentifier}`} title={`${item.generatorIdentifier}`}>
                                <Row>
                                    <Col sm={6} xs={12} style={{ paddingRight: '0px' }} key={1}>
                                        {/* <Row>
                                            <Col>
                                                <EnginesCard type='generators' item={item} getValue={getValue} index={index} structure={AE11Structure} identifier='generatorIdentifier' touched={props.touched} errors={props.errors} handleChange={props.handleChange} setFieldValue={props.setFieldValue} />
                                            </Col>
                                        </Row> */}
                                        <Row>
                                            <Col>
                                                <EnginesCard type='generators' item={item} index={index} structure={AE12Structure} identifier='generatorIdentifier' touched={props.touched} errors={props.errors} handleChange={props.handleChange} />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col sm={6} xs={12} key={2}>
                                        <EnginesCard type='generators' item={item} index={index} structure={AE21Structure} identifier='generatorIdentifier' touched={props.touched} errors={props.errors} handleChange={props.handleChange} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={6} xs={12} style={{ paddingRight: '0px' }}>
                                        <Card style={{ padding: '10px', borderRadius: '10px', marginBottom: '10px', height:'99%'}}>
                                            {Object.entries(AE13Structure).map(([element, elementDetail], idx) => (
                                                <Form.Group  as={Row} key={idx} style={{ marginBottom: '2px' }}>
                                                    <Form.Label column xs={7} style={{ color: config.KSTColors.MAIN, fontSize: '0.8rem' }}>{`${item.generatorIdentifier} ${elementDetail.title}`}</Form.Label>
                                                    {elementDetail.type==='textarea'&&
                                                        <Col xs={12}>
                                                            <div style={{ display: 'flex' }}>
                                                                <Form.Control
                                                                    className={(props?.touched?.generators?.[index]?.[element] && props?.errors?.generators?.[index]?.[element]) !== undefined?"VesselReportFillableErrorBox":(item[element]===null||item[element]===''||elementDetail.min===undefined || elementDetail.max===undefined || (item[element]>=elementDetail.min && item[element]<=elementDetail.max))?"VesselReportFillableBox":"VesselReportFillableBoxOutOfRange"}  
                                                                    as={elementDetail.type} 
                                                                    rows={5} 
                                                                    id={`generators[${index}].${element}`} 
                                                                    aria-describedby={`generators[${index}].${element}`} 
                                                                    value={item[element]===null?'':item[element]}
                                                                    onChange={props.handleChange}
                                                                    name={`generators[${index}].${element}`}
                                                                />
                                                            </div>
                                                        </Col>
                                                    }
                                                </Form.Group>
                                            ))
                                            }
                                        </Card>
                                    </Col>
                                </Row>
                            </Tab>
                        ))}
                    </Tabs>
            </Container>
        </React.Fragment>
    );
}

export default Engines;