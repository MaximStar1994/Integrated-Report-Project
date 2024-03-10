import React from 'react';
import { Row, Col, Card, FormControl, Table, Button, Tabs, Tab } from 'react-bootstrap'
import { Select, MenuItem } from '@material-ui/core';
import '../../css/App.css';
import '../../css/Dashboard.css';
import { HourlyEntriesList } from './DeckLogData';

import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'

const DeckLogHourlyEntries = props => (
        <React.Fragment>
            <Row>
                <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                    <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                        <Tabs defaultActiveKey="GPS_CourseOfVessel" transition={false} id="deckLogHourlyEntriesTabs" className='DeckLogEditTabs'>
                            <Tab eventKey="GPS_CourseOfVessel" title="GPS Position Of Vessel, Course of Vessel">
                                <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
                                    <Card.Body style={{ border: '0px' }}>
                                        <Table responsive className='DeckLogTable'>
                                            <thead>
                                                <tr>
                                                    <th key={0} colSpan={1} style={{ borderBottom: '0px' }}>Time Interval</th>
                                                    <th key={1} colSpan={2}>GPS Position Of Vessel</th>
                                                    <th key={2} colSpan={3}>Course Of Vessel</th>
                                                </tr>
                                                <tr>
                                                    <th key={0} style={{ borderTop: '0px' }}></th>
                                                    <th key={1}>Latitude</th>
                                                    <th key={2}>Longitude</th>
                                                    <th key={3}>True</th>
                                                    <th key={4}>Gyro</th>
                                                    <th key={5}>Mag</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.data.map((row, idx)=>(
                                                    <tr key={idx}>
                                                        <td className={'DeckLogTableTimeIntervalBox'}>{row.timeInterval}</td>
                                                        {HourlyEntriesList.GPSPositionOfVessel_CourseOfVessel.map((col, index) => (
                                                                <td key={`${idx}-${col}`}>
                                                                    {<FormControl
                                                                            type='text'
                                                                            id={`hourly[${idx}].${col}`} 
                                                                            aria-describedby={`hourly[${idx}].${col}`} 
                                                                            value={props.data[idx].col===null?'':props.data[idx].col}
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
                            </Tab>
                            <Tab eventKey="Wind_SeaCondition_Visibility" title="Wind, Sea Condition, Visibility">
                                <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
                                    <Card.Body style={{ border: '0px' }}>
                                        <Table responsive className='DeckLogTable'>
                                            <thead>
                                                <tr>
                                                    <th key={0} colSpan={1} style={{ borderBottom: '0px' }}>Time Interval</th>
                                                    <th key={1} colSpan={2}>Wind</th>
                                                    <th key={2} colSpan={2}></th>
                                                </tr>
                                                <tr>
                                                    <th key={0} style={{ borderTop: '0px' }}></th>
                                                    <th key={0}>Force</th>
                                                    <th key={1}>Direction</th>
                                                    <th key={2}>Sea Condition</th>
                                                    <th key={3}>Visibility</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.data.map((row, idx)=>(
                                                    <tr key={idx}>
                                                        <td className={'DeckLogTableTimeIntervalBox'}>{row.timeInterval}</td>
                                                        {HourlyEntriesList.Wind_SeaCondition_Visibility.map((col, index) => (
                                                                <td key={`${idx}-${col}`}>
                                                                    {<FormControl
                                                                            type='text'
                                                                            id={`hourly[${idx}].${col}`} 
                                                                            aria-describedby={`hourly[${idx}].${col}`} 
                                                                            value={props.data[idx].col===null?'':props.data[idx].col}
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
                            </Tab>
                            <Tab eventKey="Swell_Temperature" title="Swell, Temperature">
                                <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
                                    <Card.Body style={{ border: '0px' }}>
                                        <Table responsive className='DeckLogTable'>
                                            <thead>
                                                <tr>
                                                    <th key={0} colSpan={1} style={{ borderBottom: '0px' }}>Time Interval</th>
                                                    <th key={1} colSpan={2}>Swell</th>
                                                    <th key={2} colSpan={2}>Temperature</th>
                                                </tr>
                                                <tr>
                                                    <th key={0} style={{ borderTop: '0px' }}></th>
                                                    <th key={0}>Direction</th>
                                                    <th key={1}>Height</th>
                                                    <th key={2}>Dry</th>
                                                    <th key={3}>Wet</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.data.map((row, idx)=>(
                                                    <tr key={idx}>
                                                        <td className={'DeckLogTableTimeIntervalBox'}>{row.timeInterval}</td>
                                                        {HourlyEntriesList.Swell_Temperature.map((col, index) => (
                                                                <td key={`${idx}-${col}`}>
                                                                    {<FormControl
                                                                            type='text'
                                                                            id={`hourly[${idx}].${col}`} 
                                                                            aria-describedby={`hourly[${idx}].${col}`} 
                                                                            value={props.data[idx].col===null?'':props.data[idx].col}
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
                            </Tab>
                            <Tab eventKey="BarometricPressure_EngineRoomWatchStatus_CourseAlteration" title="Barometric Pressure, Engine Room Watch Status, Course Alteration">
                                <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
                                    <Card.Body style={{ border: '0px' }}>
                                        <Table responsive className='DeckLogTable'>
                                            <thead>
                                                <tr>
                                                    <th key={0} style={{ borderTop: '0px' }}></th>
                                                    <th key={1}>Barometric Pressure</th>
                                                    <th key={2}>Engine Room Watch Status</th>
                                                    <th key={3} colSpan={5}>Course Alteration</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.data.map((row, idx)=>(
                                                    <tr key={idx}>
                                                        <td className={'DeckLogTableTimeIntervalBox'}>{row.timeInterval}</td>
                                                        {HourlyEntriesList.BarometricPressure_CourseAlteration_EngineRoomWatchStatus.map((col, index) => (
                                                            <td key={`${idx}-${col}`} colSpan={col==='courseAlteration'?5:1}>
                                                                {
                                                                    col==='engineRoomWatchStatus'?(
                                                                        <Select style={{ width: '100%', paddingLeft: '5px' }} 
                                                                            labelId={`hourly[${idx}].${col}`} 
                                                                            id={`hourly[${idx}].${col}`} 
                                                                            name ={`hourly[${idx}].${col}`} 
                                                                            value={props.data[idx].col} 
                                                                            onChange={props.handleChange} 
                                                                            className={"InputBox"} 
                                                                            displayEmpty>
                                                                            <MenuItem value={''||null||undefined}> <em> Select </em> </MenuItem>
                                                                            <MenuItem value={'Manned'}>Manned</MenuItem>
                                                                            <MenuItem value={'Unmanned'}>Unmanned</MenuItem>
                                                                        </Select>
                                                                    ):(
                                                                        <FormControl
                                                                            type='text'
                                                                            id={`hourly[${idx}].${col}`} 
                                                                            aria-describedby={`hourly[${idx}].${col}`} 
                                                                            value={props.data[idx].col===null?'':props.data[idx].col}
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
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </Row>
        </React.Fragment>
    );
export default withMessageManager(withLayoutManager(DeckLogHourlyEntries));