import React from 'react';
import { Row, Col, Card, FormControl, Table, Tab, Nav } from 'react-bootstrap'
import { Select, MenuItem } from '@material-ui/core';
import '../../css/App.css';
import '../../css/Dashboard.css';
import { HourlyEntriesList, hourlyIntervalsList } from './DeckLogData';

import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'

const DeckLogHourlyEntries = props => (
        <React.Fragment>
            <Row>
                <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                    <Card.Body style={{ border: '0px', paddingTop: '0px', paddingBottom: '0px' }}>
                        <Tab.Container defaultActiveKey="GPS_CourseOfVessel" transition={false} id="deckLogHourlyEntriesTabs" className='DeckLogEditTabs'>
                            <Row>
                            <Col sm={2}>
                            <Nav variant="pills" className="flex-column" style={{ marginTop: '20px' }}>
                                <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="GPS_CourseOfVessel">GPS Position Of Vessel, Course of Vessel</Nav.Link></Nav.Item>
                                <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="Wind_SeaCondition_Visibility">Wind, Sea Condition, Visibility</Nav.Link></Nav.Item>
                                <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="Swell_Temperature">Swell, Temperature</Nav.Link></Nav.Item>
                                <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="BarometricPressure_EngineRoomWatchStatus_CourseAlteration">Barometric Pressure, Engine Room Watch Status, Course Alteration</Nav.Link></Nav.Item>
                            </Nav>
                            </Col>
                            <Col sm={10}>
                                <Tab.Content>

                                    <Tab.Pane eventKey="GPS_CourseOfVessel" title="GPS Position Of Vessel, Course of Vessel">
                                        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', borderLeft: '5px solid #04384c' }}>
                                            <Card.Body style={{ border: '0px' }}>
                                                <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px' }}>GPS Position Of Vessel, Course of Vessel</div>
                                                <Table responsive className='DeckLogTable'>
                                                    <thead>
                                                        <tr>
                                                            <th key={'1-0'} colSpan={1} style={{ borderBottom: '0px' }}></th>
                                                            <th key={'1-1'} colSpan={2}>GPS Position Of Vessel</th>
                                                            <th key={'1-2'} colSpan={3}>Course Of Vessel</th>
                                                        </tr>
                                                        <tr>
                                                            <th key={'2-0'} style={{ borderTop: '0px' }}>Time Interval</th>
                                                            <th key={'2-1'}>Latitude</th>
                                                            <th key={'2-2'}>Longitude</th>
                                                            <th key={'2-3'}>True</th>
                                                            <th key={'2-4'}>Gyro</th>
                                                            <th key={'2-5'}>Mag</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {props.data.map((row, idx)=>(
                                                            <tr key={idx}>
                                                                <td className={'DeckLogTableTimeIntervalBox'}>{hourlyIntervalsList[row.timeInterval]}</td>
                                                                {HourlyEntriesList.GPSPositionOfVessel_CourseOfVessel.map((col, index) => (
                                                                        <td key={`${idx}-${col}`}>
                                                                            {<FormControl
                                                                                    type='text'
                                                                                    id={`hourly[${idx}].${col}`} 
                                                                                    aria-describedby={`hourly[${idx}].${col}`} 
                                                                                    value={props.data[idx][col]===null?'':props.data[idx][col]}
                                                                                    onChange={props.handleChange}
                                                                                    name={`hourly[${idx}].${col}`}
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
                                    <Tab.Pane eventKey="Wind_SeaCondition_Visibility" title="Wind, Sea Condition, Visibility">
                                        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', borderLeft: '5px solid #04384c' }}>
                                            <Card.Body style={{ border: '0px' }}>
                                                <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px' }}>Wind, Sea Condition, Visibility</div>
                                                <Table responsive className='DeckLogTable'>
                                                    <thead>
                                                        <tr>
                                                            <th key={'3-0'} colSpan={1} style={{ borderBottom: '0px' }}></th>
                                                            <th key={'3-1'} colSpan={2}>Wind</th>
                                                            <th key={'3-2'} colSpan={1} style={{ borderBottom: '0px' }}></th>
                                                            <th key={'3-3'} colSpan={1} style={{ borderBottom: '0px' }}></th>
                                                        </tr>
                                                        <tr>
                                                            <th key={'4-0'} style={{ borderTop: '0px' }}>Time Interval</th>
                                                            <th key={'4-1'}>Force</th>
                                                            <th key={'4-2'}>Direction</th>
                                                            <th key={'4-3'} style={{ borderTop: '0px' }}>Sea Condition</th>
                                                            <th key={'4-4'} style={{ borderTop: '0px' }}>Visibility</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {props.data.map((row, idx)=>(
                                                            <tr key={idx}>
                                                                <td className={'DeckLogTableTimeIntervalBox'}>{hourlyIntervalsList[row.timeInterval]}</td>
                                                                {HourlyEntriesList.Wind_SeaCondition_Visibility.map((col, index) => (
                                                                        <td key={`${idx}-${col}`}>
                                                                            {<FormControl
                                                                                    type='text'
                                                                                    id={`hourly[${idx}].${col}`} 
                                                                                    aria-describedby={`hourly[${idx}].${col}`} 
                                                                                    value={props.data[idx][col]===null?'':props.data[idx][col]}
                                                                                    onChange={props.handleChange}
                                                                                    name={`hourly[${idx}].${col}`}
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
                                    <Tab.Pane eventKey="Swell_Temperature" title="Swell, Temperature">
                                        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', borderLeft: '5px solid #04384c' }}>
                                            <Card.Body style={{ border: '0px' }}>
                                                <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px' }}>Swell, Temperature</div>
                                                <Table responsive className='DeckLogTable'>
                                                    <thead>
                                                        <tr>
                                                            <th key={'5-0'} colSpan={1} style={{ borderBottom: '0px' }}></th>
                                                            <th key={'5-1'} colSpan={2}>Swell</th>
                                                            <th key={'5-2'} colSpan={2}>Temperature</th>
                                                        </tr>
                                                        <tr>
                                                            <th key={'6-0'} style={{ borderTop: '0px' }}>Time Interval</th>
                                                            <th key={'6-1'}>Direction</th>
                                                            <th key={'6-2'}>Height</th>
                                                            <th key={'6-3'}>Dry</th>
                                                            <th key={'6-4'}>Wet</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {props.data.map((row, idx)=>(
                                                            <tr key={idx}>
                                                                <td className={'DeckLogTableTimeIntervalBox'}>{hourlyIntervalsList[row.timeInterval]}</td>
                                                                {HourlyEntriesList.Swell_Temperature.map((col, index) => (
                                                                        <td key={`${idx}-${col}`}>
                                                                            {<FormControl
                                                                                    type='text'
                                                                                    id={`hourly[${idx}].${col}`} 
                                                                                    aria-describedby={`hourly[${idx}].${col}`} 
                                                                                    value={props.data[idx][col]===null?'':props.data[idx][col]}
                                                                                    onChange={props.handleChange}
                                                                                    name={`hourly[${idx}].${col}`}
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
                                    <Tab.Pane eventKey="BarometricPressure_EngineRoomWatchStatus_CourseAlteration" title="Barometric Pressure, Engine Room Watch Status, Course Alteration">
                                        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', borderLeft: '5px solid #04384c' }}>
                                            <Card.Body style={{ border: '0px' }}>
                                                <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px' }}>Barometric Pressure, Engine Room Watch Status, Course Alteration</div>
                                                <Table responsive className='DeckLogTable'>
                                                    <thead>
                                                        <tr>
                                                            <th key={'7-0'} style={{ borderTop: '0px' }}>Time Interval</th>
                                                            <th key={'7-1'}>Barometric Pressure</th>
                                                            <th key={'7-2'}>Engine Room Watch Status</th>
                                                            <th key={'7-3'} colSpan={5}>Course Alteration</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {props.data.map((row, idx)=>(
                                                            <tr key={idx}>
                                                                <td className={'DeckLogTableTimeIntervalBox'}>{hourlyIntervalsList[row.timeInterval]}</td>
                                                                {HourlyEntriesList.BarometricPressure_CourseAlteration_EngineRoomWatchStatus.map((col, index) => (
                                                                    <td key={`${idx}-${col}`} colSpan={col==='courseAlteration'?5:1}>
                                                                        {
                                                                            col==='engineRoomWatchStatus'?(
                                                                                <Select style={{ width: '100%', paddingLeft: '5px' }} 
                                                                                    labelId={`hourly[${idx}].${col}`} 
                                                                                    id={`hourly[${idx}].${col}`} 
                                                                                    name ={`hourly[${idx}].${col}`} 
                                                                                    value={props.data[idx][col]} 
                                                                                    onChange={props.handleChange} 
                                                                                    className={"InputBox"} 
                                                                                    displayEmpty>
                                                                                    <MenuItem value={''}> <em> Select </em> </MenuItem>
                                                                                    <MenuItem value={'Manned'}>Manned</MenuItem>
                                                                                    <MenuItem value={'Unmanned'}>Unmanned</MenuItem>
                                                                                </Select>
                                                                            ):(
                                                                                <FormControl
                                                                                    type='text'
                                                                                    id={`hourly[${idx}].${col}`} 
                                                                                    aria-describedby={`hourly[${idx}].${col}`} 
                                                                                    value={props.data[idx][col]===null?'':props.data[idx][col]}
                                                                                    onChange={props.handleChange}
                                                                                    name={`hourly[${idx}].${col}`}
                                                                                    className={"DeckLogTableInputBox"}
                                                                                />    
                                                                            )
                                                                        }
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
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
export default withMessageManager(withLayoutManager(DeckLogHourlyEntries));