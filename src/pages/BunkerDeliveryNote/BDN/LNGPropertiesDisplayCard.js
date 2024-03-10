import React from 'react';
import {Card, Row, Col} from 'react-bootstrap';
import DisplayCard from './DisplayCard';
import './BDN.css';

const LNGPropertiesDisplayCard = props => (
    <React.Fragment>
        <DisplayCard header="LNG PROPERTIES" data={props.data} handleChange={props.handleChange} />
        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#04384C', borderRadius: '0px', border: '0px'}}>
            <Card.Body>
                <Row style={{ border: '1px solid #067FAA', paddingTop :'5px', paddingBottom: '5px' }}>
                    <Col xs={3}>
                        Heating Value
                    </Col>
                    <div style={{ borderLeft: '1px solid #067FAA', marginTop: '-5px', marginBottom: '-5px'}} />
                    <Col style={{ textAlign: 'center' }}>
                        Gross
                    </Col>
                    <div style={{ borderLeft: '1px solid #067FAA', marginTop: '-5px', marginBottom: '-5px'}} />
                    <Col style={{ textAlign: 'center' }}>
                        Net
                    </Col>
                </Row>
                <Row style={{ border: '1px solid #067FAA', borderTop: '0px'}}>
                    <Col>
                        <Row style={{ paddingTop: '5px', paddingBottom: '5px'}}>
                            <Col xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                                Mass Based:
                            </Col>
                            <Col>
                                <Row>
                                    <div style={{ borderLeft: '1px solid #067FAA', marginTop: '-5px', marginBottom: '-5px'}} />
                                    <Col>
                                        <div style={props.data.grossHeatingValueMass.value?{ backgroundColor: '#04425A', padding: '5px'}:{ backgroundColor: '#04425A', padding: '10px' }}>
                                                {props.data.grossHeatingValueMass.value}
                                        </div>
                                    </Col>
                                    <Col>
                                        {props.data.grossHeatingValueMass.suffix}
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <div style={{ borderLeft: '1px solid #067FAA', marginTop: '-5px', marginBottom: '-5px'}} />
                                    <Col>
                                        <div style={props.data.netHeatingValueMass.value?{ backgroundColor: '#04425A', padding: '5px'}:{ backgroundColor: '#04425A', padding: '10px' }}>
                                                {props.data.netHeatingValueMass.value}
                                        </div>
                                    </Col>
                                    <Col>
                                        {props.data.netHeatingValueMass.suffix}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>


                        <Row style={{ paddingTop: '5px', paddingBottom: '5px' }}>
                            <Col xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                                Volume Based:
                            </Col>
                            <Col>
                                <Row>
                                    <div style={{ borderLeft: '1px solid #067FAA', marginTop: '-5px', marginBottom: '-5px'}} />
                                    <Col>
                                        <div style={props.data.grossHeatingValueVol.value?{ backgroundColor: '#04425A', padding: '5px'}:{ backgroundColor: '#04425A', padding: '10px' }}>
                                                {props.data.grossHeatingValueVol.value}
                                        </div>
                                    </Col>
                                    <Col>
                                        {props.data.grossHeatingValueVol.suffix}
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <div style={{ borderLeft: '1px solid #067FAA', marginTop: '-5px', marginBottom: '-5px'}} />
                                    <Col>
                                        <div style={props.data.netHeatingValueVol.value?{ backgroundColor: '#04425A', padding: '5px'}:{ backgroundColor: '#04425A', padding: '10px' }}>
                                                {props.data.netHeatingValueVol.value}
                                        </div>
                                    </Col>
                                    <Col>
                                        {props.data.netHeatingValueVol.suffix}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ border: '1px solid #067FAA', borderTop: '0px', paddingTop: '5px', paddingBottom: '5px'}}>
                    <Col xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                        Wobbe Index
                    </Col>
                    <Col>
                        <Row>
                            <div style={{ borderLeft: '1px solid #067FAA', marginTop: '-5px', marginBottom: '-5px'}} />
                            <Col>
                                <div style={props.data.grossWobbeIndex.value?{ backgroundColor: '#04425A', padding: '5px'}:{ backgroundColor: '#04425A', padding: '10px' }}>
                                        {props.data.grossWobbeIndex.value}
                                </div>
                            </Col>
                            <Col>
                                {props.data.grossWobbeIndex.suffix}
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <div style={{ borderLeft: '1px solid #067FAA', marginTop: '-5px', marginBottom: '-5px'}} />
                            <Col>
                                <div style={props.data.netWobbeIndex.value?{ backgroundColor: '#04425A', padding: '5px'}:{ backgroundColor: '#04425A', padding: '10px' }}>
                                        {props.data.netWobbeIndex.value}
                                </div>
                            </Col>
                            <Col>
                                {props.data.netWobbeIndex.suffix}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
        {/* <Card style={{ margin: '0px', padding: '0px', color: '#067FAA', backgroundColor: '#04384C', borderRadius: '0px', border: '0px'}}>
            <Card.Body>
                <Row className="timelineContainer2">
                    <Col xs={1} style={{display : "flex", flexDirection : "column"}}>
                    </Col>
                    <Col xs={11}>
                        <div>Arrival</div>
                    </Col>
                </Row>
                <Row className="timelineContainer2">
                    <Col xs={1} style={{display : "flex", flexDirection : "column"}}>
                        <div className={'VerticalTimelineEvents'}>
                            <div style={{alignSelf : 'center'}}>
                                <div className="TimelineLine" >
                                </div>
                                <div className='VerticalTimelineEventsDot' />
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <Row>
                            <Col style={{ display: 'flex', alignItems: 'center' }}>
                                Vapor Pressure
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <div style={props.data.arrivalVaporPressure.value?{ backgroundColor: '#04425A', padding: '5px'}:{ backgroundColor: '#04425A', padding: '10px' }}>
                                                {props.data.arrivalVaporPressure.value}
                                        </div>
                                    </Col>
                                    <Col>
                                        {props.data.arrivalVaporPressure.suffix}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="timelineContainer2">
                    <Col xs={1} style={{display : "flex", flexDirection : "column"}}>
                        <div className={'VerticalTimelineEvents'}>
                            <div style={{alignSelf : 'center'}}>
                                <div className="TimelineLine" >
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col xs={11}>
                        <div style={{paddingTop : "10px"}}>Delivered</div>
                    </Col>
                </Row>
                <Row className="timelineContainer2">
                    <Col xs={1} style={{display : "flex", flexDirection : "column"}}>
                        <div className={'VerticalTimelineEvents'}>
                            <div style={{alignSelf : 'center'}}>
                                <div className="TimelineLine" >
                                </div>
                                <div className='VerticalTimelineEventsDot' />
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <Row>
                            <Col style={{ display: 'flex', alignItems: 'center' }}>
                                LNG Temperature
                            </Col>
                            <Col>
                                <Row>                          
                                    <Col>
                                        <div style={props.data.lngTemperatureDelivered.value?{ backgroundColor: '#04425A', padding: '5px'}:{ backgroundColor: '#04425A', padding: '10px' }}>
                                            {props.data.lngTemperatureDelivered.value}
                                        </div>
                                    </Col>
                                    <Col>
                                        {props.data.lngTemperatureDelivered.suffix}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                
            </Card.Body>
        </Card> */}
    </React.Fragment>

);
    // // <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#04384C', borderRadius: '0px', border: '0px'}}>
    // //     {props.header?
    // //         <Card.Header style={{ border: '0px', color: '#067FAA', backgroundColor: '#032a39'}}>
    // //             {props.header}
    // //         </Card.Header>
    // //     :null}
    // //     <Card.Body style={{ border: '0px' }}>
    // //         {/* Methane Number */}
    // //             <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#04384C', borderRadius: '0px', border: '0px'}}>
    // //                 <Card.Body style={{ padding: '0px 0px 15px 0px', verticalAlign: 'center' }}>
    // //                     <Row>
    // //                         <Col style={{ display: 'flex', alignItems: 'center' }}>
    // //                                 Methane Number
    // //                         </Col>
    // //                         <Col>
    // //                         <div style={{ backgroundColor: '#04425A', padding: '10px' }}>
    // //                             {props.data.methaneNumber.value}
    // //                         </div>
    // //                         </Col>
    // //                         <Col style={{ display: 'flex', alignItems: 'center' }}>
    // //                             {props.data.methaneNumber.suffix}
    // //                         </Col>
    // //                     </Row>

    // //                 </Card.Body>
    // //             </Card>

    // //             {/* Density */}
    // //             <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#04384C', borderRadius: '0px', border: '0px'}}>
    // //                 <Card.Body style={{ padding: '0px 0px 15px 0px', verticalAlign: 'center' }}>
    // //                     <Row>
    // //                         <Col style={{ display: 'flex', alignItems: 'center' }}>
    // //                                 Density
    // //                         </Col>
    // //                         <Col>
    // //                         <div style={{ backgroundColor: '#04425A', padding: '10px' }}>
    // //                             {props.data.density.value}
    // //                         </div>
    // //                         </Col>
    // //                         <Col style={{ display: 'flex', alignItems: 'center' }}>
    // //                             {props.data.density.suffix}
    // //                         </Col>
    // //                     </Row>

    // //                 </Card.Body>
    // //             </Card>
    //     </Card.Body>
    // </Card>
// );

export default LNGPropertiesDisplayCard;