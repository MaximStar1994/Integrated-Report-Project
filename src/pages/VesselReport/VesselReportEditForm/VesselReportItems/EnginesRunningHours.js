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
            <VesselReportHeader notes="Note: Please key in '0' for malfunction sensor" heading="Engine Running Hours" saveForm={props.saveForm} saved={props.saved}  isSubmit={props.isSubmit} dailyLog={true} webUrl={props.webUrl}/>
            <Container fluid className="Engines">
                    <Tabs defaultActiveKey={`${props.engines[0].engineIdentifier} Main Engine`} id={`${props.engines[0].engineIdentifier} Main Engine`}>
                        {props.engines.map((item, index)=>(
                            <Tab key={index} eventKey={`${item.engineIdentifier} Main Engine`} title={`${item.engineIdentifier} Main Engine`}>
                                <Row>
                                    <Col xs={12} sm={6}  style={{ paddingRight: '0px' }} key={1}>
                                        <Row>
                                            <Col>
                                                <EnginesCard type='engines' item={item} getValue={getValue} index={index} structure={props.LNGProperties?MainEngine11LNGStructure:MainEngine11Structure} identifier='engineIdentifier' touched={props.touched} errors={props.errors} handleChange={props.handleChange} setFieldValue={props.setFieldValue} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Tab>                    
                        ))}

                        {/* Generators starts here */}
                        {props.generators.map((item, index)=>(
                            <Tab key={index} eventKey={`${item.generatorIdentifier}`} title={`${item.generatorIdentifier}`}>
                                <Row>
                                    <Col sm={6} xs={12} style={{ paddingRight: '0px' }} key={1}>
                                        <Row>
                                            <Col>
                                                <EnginesCard type='generators' item={item} getValue={getValue} index={index} structure={AE11Structure} identifier='generatorIdentifier' touched={props.touched} errors={props.errors} handleChange={props.handleChange} setFieldValue={props.setFieldValue} />
                                            </Col>
                                        </Row>
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