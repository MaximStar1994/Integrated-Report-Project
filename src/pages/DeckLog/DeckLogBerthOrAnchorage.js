import React from 'react';
import { Row, Col, Card, FormControl } from 'react-bootstrap'
import '../../css/App.css';
import '../../css/Dashboard.css';

import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'

const DeckLogNoonTotalSummary = props => {
    console.log(props)
    return(
        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
            <Card.Body style={{ border: '0px' }}>
                <Row style={{margin: "20px"}}>
                    <Col xl={6} xs={12}>
                        <Row style={{ marginTop: '20px' }}>
                            <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                                <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                                    <Row>
                                        <Col xs={12} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                                            <label style={{ flexGrow: 1 }}> {props.data.lyingHour.label}</label>
                                            <FormControl
                                                type='number' 
                                                id={props.data.lyingHour.field} 
                                                aria-describedby={props.data.lyingHour.field} 
                                                value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
                                                onChange={props.handleChange}
                                                name={props.data.lyingHour.field}
                                                className={"DeckLogInputBox"}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                                            <label style={{ flexGrow: 1 }}> {props.data.totalLyingHour.label}</label>
                                            <FormControl
                                                type='number' 
                                                id={props.data.totalLyingHour.field} 
                                                aria-describedby={props.data.totalLyingHour.field} 
                                                value={props.data.totalLyingHour.value===null?'':props.data.totalLyingHour.value}
                                                onChange={props.handleChange}
                                                name={props.data.totalLyingHour.field}
                                                className={"DeckLogInputBox"}
                                            />
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Row>
                        <Row style={{ marginTop: '20px' }}>
                            <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                            <Card.Header style={{ fontSize: '1.2em', padding: '10px', border: '0px', color: '#067FAA', backgroundColor: '#032a39'}}>Ship's Clock</Card.Header>
                                <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                                    <Row>
                                        <Col xs={6} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                                            <label style={{ flexGrow: 1 }}> {props.data.shipClockAhDOrBKH.label}</label>
                                            <FormControl
                                                type='number' 
                                                id={props.data.shipClockAhDOrBKH.field} 
                                                aria-describedby={props.data.shipClockAhDOrBKH.field} 
                                                value={props.data.shipClockAhDOrBKH.value===null?'':props.data.shipClockAhDOrBKH.value}
                                                onChange={props.handleChange}
                                                name={props.data.shipClockAhDOrBKH.field}
                                                className={"DeckLogInputBox"}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%'}}>h</div>
                                        </Col>
                                        <Col xs={6} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                                            <label style={{ flexGrow: 1 }}> </label>
                                            <FormControl
                                                type='number' 
                                                id={props.data.shipClockAhDOrBKM.field} 
                                                aria-describedby={props.data.shipClockAhDOrBKM.field} 
                                                value={props.data.shipClockAhDOrBKM.value===null?'':props.data.shipClockAhDOrBKM.value}
                                                onChange={props.handleChange}
                                                name={props.data.shipClockAhDOrBKM.field}
                                                className={"DeckLogInputBox"}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%'}}>m</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                                            <label style={{ flexGrow: 1 }}> {props.data.shipClockTotalH.label}</label>
                                            <FormControl
                                                type='number' 
                                                id={props.data.shipClockTotalH.field} 
                                                aria-describedby={props.data.shipClockTotalH.field} 
                                                value={props.data.shipClockTotalH.value===null?'':props.data.shipClockTotalH.value}
                                                onChange={props.handleChange}
                                                name={props.data.shipClockTotalH.field}
                                                className={"DeckLogInputBox"}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%'}}>h</div>
                                        </Col>
                                        <Col xs={6} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                                            <label style={{ flexGrow: 1 }}> </label>
                                            <FormControl
                                                type='number' 
                                                id={props.data.shipClockTotalM.field} 
                                                aria-describedby={props.data.shipClockTotalM.field} 
                                                value={props.data.shipClockTotalM.value===null?'':props.data.shipClockTotalM.value}
                                                onChange={props.handleChange}
                                                name={props.data.shipClockTotalM.field}
                                                className={"DeckLogInputBox"}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%'}}>m</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                                            <label style={{ flexGrow: 1 }}> {props.data.shipClockRemainH.label}</label>
                                            <FormControl
                                                type='number' 
                                                id={props.data.shipClockRemainH.field} 
                                                aria-describedby={props.data.shipClockRemainH.field} 
                                                value={props.data.shipClockRemainH.value===null?'':props.data.shipClockRemainH.value}
                                                onChange={props.handleChange}
                                                name={props.data.shipClockRemainH.field}
                                                className={"DeckLogInputBox"}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%'}}>h</div>
                                        </Col>
                                        <Col xs={6} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                                            <label style={{ flexGrow: 1 }}> </label>
                                            <FormControl
                                                type='number' 
                                                id={props.data.shipClockRemainM.field} 
                                                aria-describedby={props.data.shipClockRemainM.field} 
                                                value={props.data.shipClockRemainM.value===null?'':props.data.shipClockRemainM.value}
                                                onChange={props.handleChange}
                                                name={props.data.shipClockRemainM.field}
                                                className={"DeckLogInputBox"}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%'}}>m</div>
                                        </Col>
                                    </Row>
                                    
                                </Card.Body>
                            </Card>
                        </Row>
                    </Col>
                    <Col xl={6} xs={12}>
                        <Row style={{ marginTop: '20px' }} className='CentralGridPaddingOnXL'>
                        <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                                <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                                    <Row>
                                        <Col xs={1} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                                        <label style={{ flexGrow: 1 }}></label>
                                        <FormControl
                                                type='number' 
                                                id={props.data.hrsDiffFromUTCH.field} 
                                                aria-describedby={props.data.hrsDiffFromUTCH.field} 
                                                value={props.data.hrsDiffFromUTCH.value===null?'':props.data.hrsDiffFromUTCH.value}
                                                onChange={props.handleChange}
                                                name={props.data.hrsDiffFromUTCH.field}
                                                className={"DeckLogInputBox"}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%'}}>&nbsp;</div>
                                        </Col>
                                        <Col xs={1} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                                        <label style={{ flexGrow: 1 }}></label>
                                        <FormControl
                                                type='number' 
                                                id={props.data.hrsDiffFromUTCH.field} 
                                                aria-describedby={props.data.hrsDiffFromUTCH.field} 
                                                value={props.data.hrsDiffFromUTCH.value===null?'':props.data.hrsDiffFromUTCH.value}
                                                onChange={props.handleChange}
                                                name={props.data.hrsDiffFromUTCH.field}
                                                className={"DeckLogInputBox"}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%'}}>&nbsp;</div>
                                        </Col>
                                        <Col xs={4} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                                            <label style={{ flexGrow: 1 }}> {props.data.hrsDiffFromUTCP.label}</label>
                                            <FormControl
                                                type='number' 
                                                id={props.data.hrsDiffFromUTCH.field} 
                                                aria-describedby={props.data.hrsDiffFromUTCH.field} 
                                                value={props.data.hrsDiffFromUTCH.value===null?'':props.data.hrsDiffFromUTCH.value}
                                                onChange={props.handleChange}
                                                name={props.data.hrsDiffFromUTCH.field}
                                                className={"DeckLogInputBox"}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%'}}>h</div>
                                        </Col>
                                        <Col xs={4} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                                            <label style={{ flexGrow: 1 }}> </label>
                                            <FormControl
                                                type='number' 
                                                id={props.data.hrsDiffFromUTCM.field} 
                                                aria-describedby={props.data.hrsDiffFromUTCM.field} 
                                                value={props.data.hrsDiffFromUTCM.value===null?'':props.data.hrsDiffFromUTCM.value}
                                                onChange={props.handleChange}
                                                name={props.data.hrsDiffFromUTCM.field}
                                                className={"DeckLogInputBox"}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%'}}>m</div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card> 
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
        </Card>

    );
}
export default withMessageManager(withLayoutManager(DeckLogNoonTotalSummary));