import React from 'react';
import { Row, Col, Card, FormControl, Table, Button, Tab, Nav } from 'react-bootstrap'
import '../../css/App.css';
import '../../css/Dashboard.css';
import { AdditionalColumnForDailyMiscellaneousEntriesList } from './DeckLogData';

import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'

const DeckLogAdditionalColumns = props => (
        <React.Fragment>
            <Row>
                <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                    <Card.Body style={{ border: '0px', paddingTop: '0px', paddingBottom: '0px' }}>
                        <Tab.Container defaultActiveKey="WeeklyAndMonthlyInspectionAndTestingOfLSAEquipment" transition={false} id="deckLogWeeklyAndMonthlyInspectionAndTestingOfLSAEquipmentTabs" className='DeckLogEditTabs'>
                        <Row>
                            <Col sm={2}>
                                <Nav variant="pills" className="flex-column" style={{ marginTop: '20px', paddingBottom: '10px' }}>
                                    <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="WeeklyAndMonthlyInspectionAndTestingOfLSAEquipment">Weekly And Monthly Inspection And Testing Of LSA Equipment</Nav.Link></Nav.Item>
                                    <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="EntriesOfVariousDrillsAndTrainings">Entries Of Various Drills And Trainings</Nav.Link></Nav.Item>
                                    <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="ResultsOfPreArrivalCargoChecksAndTests">Results Of Pre Arrival Cargo Checks And Tests</Nav.Link></Nav.Item>
                                    <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="RecordsOfVariousMeetingCarriedOut">Records Of Various Meeting Carried Out</Nav.Link></Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={10}>
                                <Tab.Content style={{ height: '100%' }}>
                                    <Tab.Pane eventKey="WeeklyAndMonthlyInspectionAndTestingOfLSAEquipment" title="Weekly And Monthly Inspection And Testing Of LSA Equipment" style={{ height: '100%' }}>
                                        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', borderLeft: '5px solid #04384c', height: '100%' }}>
                                            <Card.Body style={{ border: '0px' }}>
                                                <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px' }}>Weekly And Monthly Inspection And Testing Of LSA Equipment</div>
                                                <Table responsive className='DeckLogTable'>
                                                    <tbody>
                                                        {props.dataWAMIATOLSAE.map((row, idx)=>(
                                                            <tr key={idx}>
                                                                {AdditionalColumnForDailyMiscellaneousEntriesList.WeeklyAndMonthlyInspectionAndTestingOfLSAEquipment.map((col, index) => (
                                                                    <td key={`${idx}-${col}`}>
                                                                        {<FormControl
                                                                                type='text'
                                                                                id={`weeklyAndMonthlyInspectionAndTestingOfLSAEquipment[${idx}].${col}`} 
                                                                                aria-describedby={`weeklyAndMonthlyInspectionAndTestingOfLSAEquipment[${idx}].${col}`} 
                                                                                value={props.dataWAMIATOLSAE[idx][col]===null?'':props.dataWAMIATOLSAE[idx][col]}
                                                                                onChange={props.handleChange}
                                                                                name={`weeklyAndMonthlyInspectionAndTestingOfLSAEquipment[${idx}].${col}`}
                                                                                className={"DeckLogTableInputBox"}
                                                                        />}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                                <Row>
                                                    <Col>
                                                        <Button onClick={props.addWAMIATOLSAE} style={{ width: '100%' }}>+ Add Row</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="EntriesOfVariousDrillsAndTrainings" title="Entries Of Various Drills And Trainings" style={{ height: '100%' }}>
                                        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', borderLeft: '5px solid #04384c', height: '100%' }}>
                                            <Card.Body style={{ border: '0px' }}>
                                                <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px' }}>Entries Of Various Drills And Trainings</div>
                                                <Table responsive className='DeckLogTable'>
                                                    <tbody>
                                                        {props.dataEOVDAT.map((row, idx)=>(
                                                            <tr key={idx}>
                                                                {AdditionalColumnForDailyMiscellaneousEntriesList.EntriesOfVariousDrillsAndTrainings.map((col, index) => (
                                                                    <td key={`${idx}-${col}`}>
                                                                        {<FormControl
                                                                                type='text'
                                                                                id={`entriesOfVariousDrillsAndTrainings[${idx}].${col}`} 
                                                                                aria-describedby={`entriesOfVariousDrillsAndTrainings[${idx}].${col}`} 
                                                                                value={props.dataEOVDAT[idx][col]===null?'':props.dataEOVDAT[idx][col]}
                                                                                onChange={props.handleChange}
                                                                                name={`entriesOfVariousDrillsAndTrainings[${idx}].${col}`}
                                                                                className={"DeckLogTableInputBox"}
                                                                        />}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                                <Row>
                                                    <Col>
                                                        <Button onClick={props.addEOVDAT} style={{ width: '100%' }}>+ Add Row</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="ResultsOfPreArrivalCargoChecksAndTests" title="Results Of Pre Arrival Cargo Checks And Tests" style={{ height: '100%' }}>
                                        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', borderLeft: '5px solid #04384c', height: '100%' }}>
                                            <Card.Body style={{ border: '0px' }}>
                                                <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px' }}>Results Of Pre Arrival Cargo Checks And Tests</div>
                                                <Table responsive className='DeckLogTable'>
                                                    <tbody>
                                                        {props.dataROPACCAT.map((row, idx)=>(
                                                            <tr key={idx}>
                                                                {AdditionalColumnForDailyMiscellaneousEntriesList.ResultsOfPreArrivalCargoChecksAndTests.map((col, index) => (
                                                                        <td key={`${idx}-${col}`}>
                                                                            {<FormControl
                                                                                    type='text'
                                                                                    id={`resultsOfPreArrivalCargoChecksAndTests[${idx}].${col}`} 
                                                                                    aria-describedby={`resultsOfPreArrivalCargoChecksAndTests[${idx}].${col}`} 
                                                                                    value={props.dataROPACCAT[idx][col]===null?'':props.dataROPACCAT[idx][col]}
                                                                                    onChange={props.handleChange}
                                                                                    name={`resultsOfPreArrivalCargoChecksAndTests[${idx}].${col}`}
                                                                                    className={"DeckLogTableInputBox"}
                                                                            />}
                                                                        </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                                <Row>
                                                    <Col>
                                                        <Button onClick={props.addROPACCAT} style={{ width: '100%' }}>+ Add Row</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="RecordsOfVariousMeetingCarriedOut" title="Records Of Various Meeting Carried Out" style={{ height: '100%' }}>
                                        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', borderLeft: '5px solid #04384c', height: '100%' }}>
                                            <Card.Body style={{ border: '0px' }}>
                                                <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px' }}>Records Of Various Meeting Carried Out</div>
                                                <Table responsive className='DeckLogTable'>
                                                    <tbody>
                                                        {props.dataROVMCO.map((row, idx)=>(
                                                            <tr key={idx}>
                                                                {AdditionalColumnForDailyMiscellaneousEntriesList.RecordsOfVariousMeetingCarriedOut.map((col, index) => (
                                                                        <td key={`${idx}-${col}`}>
                                                                        {<FormControl
                                                                                type='text'
                                                                                id={`recordsOfVariousMeetingCarriedOut[${idx}].${col}`} 
                                                                                aria-describedby={`recordsOfVariousMeetingCarriedOut[${idx}].${col}`} 
                                                                                value={props.dataROVMCO[idx][col]===null?'':props.dataROVMCO[idx][col]}
                                                                                onChange={props.handleChange}
                                                                                name={`recordsOfVariousMeetingCarriedOut[${idx}].${col}`}
                                                                                className={"DeckLogTableInputBox"}
                                                                        />}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                                <Row>
                                                    <Col>
                                                        <Button onClick={props.addROVMCO} style={{ width: '100%' }}>+ Add Row</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                        </Tab.Container>
                    </Card.Body>
                </Card>
            </Row>
        </React.Fragment>
    );
export default withMessageManager(withLayoutManager(DeckLogAdditionalColumns));