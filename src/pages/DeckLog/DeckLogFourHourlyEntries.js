import React from 'react';
import { Row, Col, Card, FormControl, Table, Button, Tabs, Tab } from 'react-bootstrap'
import { Select, MenuItem } from '@material-ui/core';
import '../../css/App.css';
import '../../css/Dashboard.css';
import { FourHourlyEntriesList } from './DeckLogData';

import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'

const DeckLogFourHourlyEntries = props => (
        <React.Fragment>
            <Row>
                <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                    <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                        <Tabs defaultActiveKey="CONAndWatchChangeOverTimeAndOfficerDetails" transition={false} id="deckLogFourHourlyEntriesTabs" className='DeckLogEditTabs'>
                            <Tab eventKey="CONAndWatchChangeOverTimeAndOfficerDetails" title="CON And Watch Change Over Time And Officer Details">
                                <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
                                    <Card.Body style={{ border: '0px' }}>
                                        <Table responsive className='DeckLogTable'>
                                            <tbody>
                                                {props.data.map((row, idx)=>(
                                                    <tr key={idx}>
                                                        {FourHourlyEntriesList.CONAndWatchChangeOverTimeAndOfficerDetails.map((col, index) => (
                                                            <td key={`${idx}-${col}`}>
                                                                {<FormControl
                                                                        type='text'
                                                                        id={`fourHourly[${idx}].${col}`} 
                                                                        aria-describedby={`fourHourly[${idx}].${col}`} 
                                                                        value={props.data[idx].col===null?'':props.data[idx].col}
                                                                        onChange={props.handleChange}
                                                                        name={`fourHourly[${idx}].${col}`}
                                                                        className={"DeckLogTableInputBox"}
                                                                />}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Tab>
                            <Tab eventKey="TestingOfPropulsionAndSteering" title="Testing Of Propulsion And Steering">
                                <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
                                    <Card.Body style={{ border: '0px' }}>
                                        <Table responsive className='DeckLogTable'>                                            
                                            <tbody>
                                                {props.data.map((row, idx)=>(
                                                    <tr key={idx}>
                                                        {FourHourlyEntriesList.TestingOfPropulsionAndSteering.map((col, index) => (
                                                            <td key={`${idx}-${col}`}>
                                                                {<FormControl
                                                                        type='text'
                                                                        id={`fourHourly[${idx}].${col}`} 
                                                                        aria-describedby={`fourHourly[${idx}].${col}`} 
                                                                        value={props.data[idx].col===null?'':props.data[idx].col}
                                                                        onChange={props.handleChange}
                                                                        name={`fourHourly[${idx}].${col}`}
                                                                        className={"DeckLogTableInputBox"}
                                                                />}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Tab>
                            <Tab eventKey="Gyro_Magnetic" title="Gyro Error, Magnetic Variation and Deviation">
                                <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
                                    <Card.Body style={{ border: '0px' }}>
                                        <Table responsive className='DeckLogTable'>   
                                            <thead>
                                                <tr>
                                                    <th key={0}>Gyro Error</th>
                                                    <th key={1}>Magnetic Variation</th>
                                                    <th key={2}>Magnetic Deviation</th>
                                                </tr>
                                            </thead>                                         
                                            <tbody>
                                                {props.data.map((row, idx)=>(
                                                    <tr key={idx}>
                                                        {FourHourlyEntriesList.Gyro_Magnetic.map((col, index) => (
                                                            <td key={`${idx}-${col}`}>
                                                                {<FormControl
                                                                        type='text'
                                                                        id={`fourHourly[${idx}].${col}`} 
                                                                        aria-describedby={`fourHourly[${idx}].${col}`} 
                                                                        value={props.data[idx].col===null?'':props.data[idx].col}
                                                                        onChange={props.handleChange}
                                                                        name={`fourHourly[${idx}].${col}`}
                                                                        className={"DeckLogTableInputBox"}
                                                                />}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Tab>
                            <Tab eventKey="TimingRelatedToMomentOfVessel" title="Timing Related To Moment Of Vessel">
                                <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
                                    <Card.Body style={{ border: '0px' }}>
                                        <Table responsive className='DeckLogTable'>                                            
                                            <tbody>
                                                {props.data.map((row, idx)=>(
                                                    <tr key={idx}>
                                                        {FourHourlyEntriesList.TimingRelatedToMomentOfVessel.map((col, index) => (
                                                            <td key={`${idx}-${col}`}>
                                                                {<FormControl
                                                                        type='text'
                                                                        id={`fourHourly[${idx}].${col}`} 
                                                                        aria-describedby={`fourHourly[${idx}].${col}`} 
                                                                        value={props.data[idx].col===null?'':props.data[idx].col}
                                                                        onChange={props.handleChange}
                                                                        name={`fourHourly[${idx}].${col}`}
                                                                        className={"DeckLogTableInputBox"}
                                                                />}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Tab>                     
                            <Tab eventKey="BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature" title="Bridge Watch Level, BNWAS, Security Level, Officer Signature">
                                <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
                                    <Card.Body style={{ border: '0px' }}>
                                        <Table responsive className='DeckLogTable'>
                                            <thead>
                                                <tr>
                                                    <th key={0}>Bridge Watch Level</th>
                                                    <th key={1}>BNWAS</th>
                                                    <th key={2}>Security Level</th>
                                                    <th key={3}>Officer Signature</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.data.map((row, idx)=>(
                                                    <tr key={idx}>
                                                        {FourHourlyEntriesList.BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature.map((col, index) => (
                                                            <td key={`${idx}-${col}`}>
                                                                {<FormControl
                                                                        type='text'
                                                                        id={`fourHourly[${idx}].${col}`} 
                                                                        aria-describedby={`fourHourly[${idx}].${col}`} 
                                                                        value={props.data[idx].col===null?'':props.data[idx].col}
                                                                        onChange={props.handleChange}
                                                                        name={`fourHourly[${idx}].${col}`}
                                                                        className={"DeckLogTableInputBox"}
                                                                />}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </Row>
        </React.Fragment>
    );
export default withMessageManager(withLayoutManager(DeckLogFourHourlyEntries));