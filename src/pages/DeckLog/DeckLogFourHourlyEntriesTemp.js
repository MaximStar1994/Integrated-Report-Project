import React from 'react';
import { Row, Col, Card, FormControl, Table, Tab, Nav } from 'react-bootstrap'
import '../../css/App.css';
import '../../css/Dashboard.css';
import { FourHourlyEntriesList, fourHourlyIntervalsList } from './DeckLogData';

import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'
import SignatureCanvas from 'react-signature-canvas';

const DeckLogFourHourlyEntries = props => (
        <React.Fragment>
            <Row>
                <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                    <Card.Body style={{ border: '0px', paddingTop: '0px', paddingBottom: '0px' }}>
                        <Tab.Container defaultActiveKey="CONAndWatchChangeOverTimeAndOfficerDetails" transition={false} id="deckLogFourHourlyEntriesTabs" className='DeckLogEditTabs'>
                            <Row>
                                <Col xs={2}>
                                <Nav variant="pills" className="flex-column" style={{ marginTop: '20px' }}>
                                    <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="CONAndWatchChangeOverTimeAndOfficerDetails">CON And Watch Change Over Time And Officer Details</Nav.Link></Nav.Item>
                                    <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="TestingOfPropulsionAndSteering">Testing Of Propulsion And Steering</Nav.Link></Nav.Item>
                                    <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="Gyro_Magnetic">Gyro Error, Magnetic Variation and Deviation</Nav.Link></Nav.Item>
                                    <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="TimingRelatedToMomentOfVessel">Timing Related To Moment Of Vessel</Nav.Link></Nav.Item>
                                    <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature">Bridge Watch Level, BNWAS, Security Level, Officer Signature</Nav.Link></Nav.Item>
                                </Nav>
                                </Col>
                                <Col xs={10}>
                                    <Tab.Content>

                                        <Tab.Pane eventKey="CONAndWatchChangeOverTimeAndOfficerDetails" title="CON And Watch Change Over Time And Officer Details">
                                            <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', borderLeft: '5px solid #04384c' }}>
                                                <Card.Body style={{ border: '0px' }}>
                                                    <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px' }}>CON And Watch Change Over Time And Officer Details</div>
                                                    <Table responsive className='DeckLogTable'>
                                                        <thead>
                                                            <tr>
                                                                <th key={0}>Time / Header</th>
                                                                {Object.keys(props.headers.CONAndWatchChangeOverTimeAndOfficerDetails).map((header, idx) => (
                                                                    <th key={`header${idx}`}>
                                                                        {<FormControl
                                                                            type='text'
                                                                            id={`fourHourlyHeader.CONAndWatchChangeOverTimeAndOfficerDetails.${header}`} 
                                                                            aria-describedby={`fourHourlyHeader.CONAndWatchChangeOverTimeAndOfficerDetails.${header}`} 
                                                                            value={props.headers.CONAndWatchChangeOverTimeAndOfficerDetails[header]===null?'':(props.headers.CONAndWatchChangeOverTimeAndOfficerDetails[header]===`column_${idx+1}`?'':props.headers.CONAndWatchChangeOverTimeAndOfficerDetails[header])}
                                                                            onChange={props.handleChange}
                                                                            name={`fourHourlyHeader.CONAndWatchChangeOverTimeAndOfficerDetails.${header}`}
                                                                            className={"DeckLogTableInputBox"}
                                                                        />}
                                                                    </th>
                                                                ))}
                                                            </tr>

                                                        </thead>
                                                        <tbody>
                                                            {props.dataCONAndWatchChangeOverTimeAndOfficerDetails.map((row, idx)=>(
                                                                <tr key={idx}>
                                                                    <td className={'DeckLogTableTimeIntervalBox'}>{fourHourlyIntervalsList[row.timeInterval]}</td>
                                                                    {FourHourlyEntriesList.CONAndWatchChangeOverTimeAndOfficerDetails.map((col, index) => (
                                                                        <td key={`${idx}-${col}`}>
                                                                            {<FormControl
                                                                                    type='text'
                                                                                    id={`CONAndWatchChangeOverTimeAndOfficerDetails[${idx}].${col}`} 
                                                                                    aria-describedby={`CONAndWatchChangeOverTimeAndOfficerDetails[${idx}].${col}`} 
                                                                                    value={props.dataCONAndWatchChangeOverTimeAndOfficerDetails[idx][col]===null?'':props.dataCONAndWatchChangeOverTimeAndOfficerDetails[idx][col]}
                                                                                    onChange={props.handleChange}
                                                                                    name={`CONAndWatchChangeOverTimeAndOfficerDetails[${idx}].${col}`}
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
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="TestingOfPropulsionAndSteering" title="Testing Of Propulsion And Steering">
                                            <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', borderLeft: '5px solid #04384c' }}>
                                                <Card.Body style={{ border: '0px' }}>
                                                    <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px' }}>Testing Of Propulsion And Steering</div>
                                                    <Table responsive className='DeckLogTable'>  
                                                        <thead>
                                                            <tr>
                                                                <th key={0}>Time / Header</th>
                                                                {Object.keys(props.headers.TestingOfPropulsionAndSteering).map((header, idx) => (
                                                                    <th key={`header${idx}`}>
                                                                        {<FormControl
                                                                            type='text'
                                                                            id={`fourHourlyHeader.TestingOfPropulsionAndSteering.${header}`} 
                                                                            aria-describedby={`fourHourlyHeader.TestingOfPropulsionAndSteering.${header}`} 
                                                                            value={props.headers.TestingOfPropulsionAndSteering[header]===null?'':(props.headers.TestingOfPropulsionAndSteering[header]===`column_${idx+1}`?'':props.headers.TestingOfPropulsionAndSteering[header])}
                                                                            onChange={props.handleChange}
                                                                            name={`fourHourlyHeader.TestingOfPropulsionAndSteering.${header}`}
                                                                            className={"DeckLogTableInputBox"}
                                                                        />}
                                                                    </th>
                                                                ))}
                                                            </tr>

                                                        </thead>                                          
                                                        <tbody>
                                                            {props.dataTestingOfPropulsionAndSteering.map((row, idx)=>(
                                                                <tr key={idx}>
                                                                    <td className={'DeckLogTableTimeIntervalBox'}>{fourHourlyIntervalsList[row.timeInterval]}</td>
                                                                    {FourHourlyEntriesList.TestingOfPropulsionAndSteering.map((col, index) => (
                                                                        <td key={`${idx}-${col}`}>
                                                                            {<FormControl
                                                                                    type='text'
                                                                                    id={`TestingOfPropulsionAndSteering[${idx}].${col}`} 
                                                                                    aria-describedby={`TestingOfPropulsionAndSteering[${idx}].${col}`} 
                                                                                    value={props.dataTestingOfPropulsionAndSteering[idx][col]===null?'':props.dataTestingOfPropulsionAndSteering[idx][col]}
                                                                                    onChange={props.handleChange}
                                                                                    name={`TestingOfPropulsionAndSteering[${idx}].${col}`}
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
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="Gyro_Magnetic" title="Gyro Error, Magnetic Variation and Deviation">
                                            <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', borderLeft: '5px solid #04384c' }}>
                                                <Card.Body style={{ border: '0px' }}>
                                                    <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px' }}>Gyro Error, Magnetic Variation and Deviation</div>
                                                    <Table responsive className='DeckLogTable'>   
                                                        <thead>
                                                            <tr>
                                                                <th key={0}>Time Interval</th>
                                                                <th key={1}>Gyro Error</th>
                                                                <th key={2}>Magnetic Variation</th>
                                                                <th key={3}>Magnetic Deviation</th>
                                                            </tr>
                                                        </thead>                                         
                                                        <tbody>
                                                            {props.dataGyro_Magnetic.map((row, idx)=>(
                                                                <tr key={idx}>
                                                                    <td className={'DeckLogTableTimeIntervalBox'}>{fourHourlyIntervalsList[row.timeInterval]}</td>
                                                                    {FourHourlyEntriesList.Gyro_Magnetic.map((col, index) => (
                                                                        <td key={`${idx}-${col}`}>
                                                                            {<FormControl
                                                                                    type='text'
                                                                                    id={`Gyro_Magnetic[${idx}].${col}`} 
                                                                                    aria-describedby={`Gyro_Magnetic[${idx}].${col}`} 
                                                                                    value={props.dataGyro_Magnetic[idx][col]===null?'':props.dataGyro_Magnetic[idx][col]}
                                                                                    onChange={props.handleChange}
                                                                                    name={`Gyro_Magnetic[${idx}].${col}`}
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
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="TimingRelatedToMomentOfVessel" title="Timing Related To Moment Of Vessel">
                                            <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', borderLeft: '5px solid #04384c' }}>
                                                <Card.Body style={{ border: '0px' }}>
                                                    <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px' }}>Timing Related To Moment Of Vessel</div>
                                                    <Table responsive className='DeckLogTable'>    
                                                        <thead>
                                                            <tr>
                                                                <th key={0}>Time / Header</th>
                                                                {Object.keys(props.headers.TimingRelatedToMomentOfVessel).map((header, idx) => (
                                                                    <th key={`header${idx}`}>
                                                                        {<FormControl
                                                                            type='text'
                                                                            id={`fourHourlyHeader.TimingRelatedToMomentOfVessel.${header}`} 
                                                                            aria-describedby={`fourHourlyHeader.TimingRelatedToMomentOfVessel.${header}`} 
                                                                            value={props.headers.TimingRelatedToMomentOfVessel[header]===null?'':(props.headers.TimingRelatedToMomentOfVessel[header]===`column_${idx+1}`?'':props.headers.TimingRelatedToMomentOfVessel[header])}
                                                                            onChange={props.handleChange}
                                                                            name={`fourHourlyHeader.TimingRelatedToMomentOfVessel.${header}`}
                                                                            className={"DeckLogTableInputBox"}
                                                                        />}
                                                                    </th>
                                                                ))}
                                                            </tr>

                                                        </thead>                                        
                                                        <tbody>
                                                            {props.dataTimingRelatedToMomentOfVessel.map((row, idx)=>(
                                                                <tr key={idx}>
                                                                    <td className={'DeckLogTableTimeIntervalBox'}>{fourHourlyIntervalsList[row.timeInterval]}</td>
                                                                    {FourHourlyEntriesList.TimingRelatedToMomentOfVessel.map((col, index) => (
                                                                        <td key={`${idx}-${col}`}>
                                                                            {<FormControl
                                                                                    type='text'
                                                                                    id={`TimingRelatedToMomentOfVessel[${idx}].${col}`} 
                                                                                    aria-describedby={`TimingRelatedToMomentOfVessel[${idx}].${col}`} 
                                                                                    value={props.dataTimingRelatedToMomentOfVessel[idx][col]===null?'':props.dataTimingRelatedToMomentOfVessel[idx][col]}
                                                                                    onChange={props.handleChange}
                                                                                    name={`TimingRelatedToMomentOfVessel[${idx}].${col}`}
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
                                        </Tab.Pane>                     
                                        <Tab.Pane eventKey="BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature" title="Bridge Watch Level, BNWAS, Security Level, Officer Signature">
                                            <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', borderLeft: '5px solid #04384c' }}>
                                                <Card.Body style={{ border: '0px' }}>
                                                    <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px' }}>Bridge Watch Level, BNWAS, Security Level, Officer Signature</div>
                                                    <Table responsive className='DeckLogTable'>
                                                        <thead>
                                                            <tr>
                                                                <th key={0}>Time Interval</th>
                                                                <th key={1}>Bridge Watch Level</th>
                                                                <th key={2}>BNWAS</th>
                                                                <th key={3}>Security Level</th>
                                                                <th key={4}>Officer Signature</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {props.dataBridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature.map((row, idx)=>(
                                                                <tr key={idx}>
                                                                    <td className={'DeckLogTableTimeIntervalBox'}>{fourHourlyIntervalsList[row.timeInterval]}</td>
                                                                    {FourHourlyEntriesList.BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature.map((col, index) => (
                                                                        <td key={`${idx}-${col}`}>
                                                                            {col==="officerSignature"?(
                                                                                <div style={{ textAlign: 'center', display: 'inline-flex', position: "relative", width: '400px', height: '100px'}}>
                                                                                    <div style={{ position: 'absolute' }}>
                                                                                        <SignatureCanvas 
                                                                                        canvasProps={{width: '400', height: '100'}}
                                                                                        // backgroundColor={"rgba(28,64,76,100)"}
                                                                                        // penColor= 'white'
                                                                                        backgroundColor={"rgba(255, 255, 255, 100)"}
                                                                                        ref={(ref)=>props.setRef(ref, idx)}
                                                                                        />
                                                                                    </div>
                                                                                    <div style={{ position: "absolute", right: '0px' }}>
                                                                                        <span className="material-icons"  onClick={()=>props.clearCanvas(idx)}>
                                                                                            settings_backup_restore
                                                                                        </span>
                                                                                        
                                                                                    </div>
                                                                                </div>
                                                                            ):
                                                                            (<FormControl
                                                                                    type='text'
                                                                                    id={`BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature[${idx}].${col}`} 
                                                                                    aria-describedby={`BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature[${idx}].${col}`} 
                                                                                    value={props.dataBridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature[idx][col]===null?'':props.dataBridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature[idx][col]}
                                                                                    onChange={props.handleChange}
                                                                                    name={`BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature[${idx}].${col}`}
                                                                                    className={"DeckLogTableInputBox"}
                                                                            />)}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </Table>
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
export default withMessageManager(withLayoutManager(DeckLogFourHourlyEntries));