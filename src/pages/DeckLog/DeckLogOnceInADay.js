import React from 'react';
import { Row, Col, Card, FormControl, Table, Tab, Nav } from 'react-bootstrap'
import '../../css/App.css';
import '../../css/Dashboard.css';
import { OnceInADayMap } from './DeckLogData';

import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'

const DeckLogOnceInADay = props => (
        <React.Fragment>
            <Row>
                <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                    <Card.Body style={{ border: '0px', paddingTop: '0px', paddingBottom: '0px' }}>
                        <Tab.Container defaultActiveKey="CargoTankStatus" transition={false} id="deckLogCargoTankStatusTabs" className='DeckLogEditTabs'>
                            <Row>
                                <Col sm={2}>
                                    <Nav variant="pills" className="flex-column" style={{ marginTop: '20px' }}>
                                        <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="CargoTankStatus">Cargo Tank Status</Nav.Link></Nav.Item>
                                        <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="SoundingOfBalastTanks">Sounding Of All Balast Tanks</Nav.Link></Nav.Item>
                                        <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="SoundingOfVoidSpaces">Sounding Of Void Spaces</Nav.Link></Nav.Item>
                                        <Nav.Item className={'DeckLogNavLink'}><Nav.Link eventKey="VesselDraft">Vessel's Draft</Nav.Link></Nav.Item>
                                    </Nav>
                                </Col>
                                <Col sm={10}>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="CargoTankStatus" title="Cargo Tank Status">
                                            <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', borderLeft: '5px solid #04384c'}}>
                                                <Card.Body style={{ border: '0px' }}>
                                                    <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px' }}>Cargo Tank Status</div>
                                                    <Row style={{margin: "20px"}}>
                                                        <Col xl={6} xs={12}>
                                                            <Row style={{ marginTop: '20px' }}>
                                                                <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                                                                    <Card.Header style={{ fontSize: '1.2em', padding: '10px', border: '0px', color: '#067FAA', backgroundColor: '#032a39'}}>Cargo Tank 1</Card.Header>
                                                                    <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                                                                        <Row>
                                                                            {Object.keys(OnceInADayMap.cargoTank1Status).map((col, idx)=>(
                                                                                <Col key={`1-${idx}`} xs={12} xl={3} style={{paddingRight: '10px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                                                                                    <label style={{ flexGrow: 1 }}> {OnceInADayMap.cargoTank1Status[col]}</label>
                                                                                    <div>
                                                                                        <FormControl
                                                                                            type='text' 
                                                                                            id={`daily_tank1${col}`} 
                                                                                            aria-describedby={`daily.tank1.${col}`} 
                                                                                            value={props.data.tank1[col]===null?'':props.data.tank1[col]}
                                                                                            onChange={props.handleChange}
                                                                                            name={`daily.tank1.${col}`}
                                                                                            className="DeckLogInputBox"
                                                                                        />
                                                                                    </div>
                                                                                </Col>
                                                                            ))}
                                                                        </Row>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Row>
                                                        </Col>
                                                        <Col xl={6} xs={12}>
                                                            <Row style={{ marginTop: '20px' }} className='CentralGridPaddingOnXL'>
                                                                <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                                                                    <Card.Header style={{ fontSize: '1.2em', padding: '10px', border: '0px', color: '#067FAA', backgroundColor: '#032a39'}}>Cargo Tank 2</Card.Header>
                                                                    <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                                                                        <Row>
                                                                            {Object.keys(OnceInADayMap.cargoTank2Status).map((col, idx)=>(
                                                                                <Col key={`2-${idx}`} xs={12} xl={3} style={{paddingRight: '10px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                                                                                    <label style={{ flexGrow: 1 }}> {OnceInADayMap.cargoTank2Status[col]}</label>
                                                                                    <div>
                                                                                        <FormControl
                                                                                            type='text' 
                                                                                            id={`daily_tank2${col}`} 
                                                                                            aria-describedby={`daily.tank2.${col}`} 
                                                                                            value={props.data.tank2[col]===null?'':props.data.tank2[col]}
                                                                                            onChange={props.handleChange}
                                                                                            name={`daily.tank2.${col}`}
                                                                                            className="DeckLogInputBox"
                                                                                        />
                                                                                    </div>
                                                                                </Col>
                                                                            ))}
                                                                        </Row>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="SoundingOfBalastTanks" title="Sounding Of All Balast Tanks">
                                            <div style={{ borderLeft: '5px solid #04384c', paddingLeft: '5px', paddingBottom: '5px' }}>
                                                <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px', paddingTop: '17px' }}>Sounding Of All Balast Tanks</div>
                                                <Row style={{ marginTop: '20px' }}>
                                                    <Col xs={6}>
                                                        <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                                                            <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                                                                <Table responsive className='DeckLogTable'>
                                                                    <tbody>
                                                                        {Object.keys(OnceInADayMap.soundingInBallastWaterTankC).map((col, idx)=>(
                                                                            <tr key={`3-${idx}`}>
                                                                                <td key={`3.1-${idx}`}>
                                                                                    {OnceInADayMap.soundingInBallastWaterTankC[col]}
                                                                                </td>
                                                                                <td key={`3.2-${idx}`}>
                                                                                    {<FormControl
                                                                                            type='text'
                                                                                            id={`daily.sounding.${col}`} 
                                                                                            aria-describedby={`daily.sounding.${col}`} 
                                                                                            value={props.data.sounding[col]===null?'':props.data.sounding[col]}
                                                                                            onChange={props.handleChange}
                                                                                            name={`daily.sounding.${col}`}
                                                                                            className={"DeckLogTableInputBox"}
                                                                                    />}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </Table>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: '20px' }}>
                                                    <Col xs={6}>
                                                        <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                                                            <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                                                                <Table responsive className='DeckLogTable'>
                                                                    <tbody>
                                                                        {Object.keys(OnceInADayMap.soundingInBallastWaterTankP).map((col, index) => (
                                                                            <tr key={`4-${col}`}>
                                                                                <td key={`4.1-${index}`}>
                                                                                    {OnceInADayMap.soundingInBallastWaterTankP[col]}
                                                                                </td>
                                                                                <td key={`4.2-${index}`}>
                                                                                    {<FormControl
                                                                                            type='text'
                                                                                            id={`daily.sounding.${col}`} 
                                                                                            aria-describedby={`daily.sounding.${col}`} 
                                                                                            value={props.data.sounding[col]===null?'':props.data.sounding[col]}
                                                                                            onChange={props.handleChange}
                                                                                            name={`daily.sounding.${col}`}
                                                                                            className={"DeckLogTableInputBox"}
                                                                                    />}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </Table>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                                                            <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                                                                <Table responsive className='DeckLogTable'>
                                                                    <tbody>
                                                                        {Object.keys(OnceInADayMap.soundingInBallastWaterTankS).map((col, index) => (
                                                                            <tr key={`5-${col}`}>
                                                                                <td key={`5.1-${index}`}>
                                                                                    {OnceInADayMap.soundingInBallastWaterTankS[col]}
                                                                                </td>
                                                                                <td key={`5.2-${index}`}>
                                                                                    {<FormControl
                                                                                            type='text'
                                                                                            id={`daily.sounding.${col}`} 
                                                                                            aria-describedby={`daily.sounding.${col}`} 
                                                                                            value={props.data.sounding[col]===null?'':props.data.sounding[col]}
                                                                                            onChange={props.handleChange}
                                                                                            name={`daily.sounding.${col}`}
                                                                                            className={"DeckLogTableInputBox"}
                                                                                    />}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </Table>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="SoundingOfVoidSpaces" title="Sounding Of Void Spaces">
                                            <div style={{ borderLeft: '5px solid #04384c', paddingLeft: '5px', paddingBottom: '5px' }}>
                                                <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px', paddingTop: '17px' }}>Sounding Of Void Spaces</div>
                                                <Row style={{ marginTop: '20px' }}>
                                                    <Col xs={6}>
                                                        <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                                                            <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                                                                <Table responsive className='DeckLogTable'>
                                                                    <tbody>
                                                                        {Object.keys(OnceInADayMap.soundingInVoidSpacesC).map((col, idx)=>(
                                                                            <tr key={`6-${col}`}>
                                                                                <td key={`6.1-${idx}`}>
                                                                                    {OnceInADayMap.soundingInVoidSpacesC[col]}
                                                                                </td>
                                                                                <td key={`6.2-${idx}`}>
                                                                                    {<FormControl
                                                                                            type='text'
                                                                                            id={`daily.voidspaceSounding.${col}`} 
                                                                                            aria-describedby={`daily.voidspaceSounding.${col}`} 
                                                                                            value={props.data.voidspaceSounding[col]===null?'':props.data.voidspaceSounding[col]}
                                                                                            onChange={props.handleChange}
                                                                                            name={`daily.voidspaceSounding.${col}`}
                                                                                            className={"DeckLogTableInputBox"}
                                                                                    />}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </Table>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: '20px' }}>
                                                    <Col xs={6}>
                                                        <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                                                            <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                                                                <Table responsive className='DeckLogTable'>
                                                                    <tbody>
                                                                        {Object.keys(OnceInADayMap.soundingInVoidSpacesP).map((col, index) => (
                                                                            <tr key={`7-${col}`}>
                                                                                <td key={`7.1-${index}`}>
                                                                                    {OnceInADayMap.soundingInVoidSpacesP[col]}
                                                                                </td>
                                                                                <td key={`7.2-${index}`}>
                                                                                    {<FormControl
                                                                                            type='text'
                                                                                            id={`daily.voidspaceSounding.${col}`} 
                                                                                            aria-describedby={`daily.voidspaceSounding.${col}`} 
                                                                                            value={props.data.voidspaceSounding[col]===null?'':props.data.voidspaceSounding[col]}
                                                                                            onChange={props.handleChange}
                                                                                            name={`daily.voidspaceSounding.${col}`}
                                                                                            className={"DeckLogTableInputBox"}
                                                                                    />}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </Table>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                                                            <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                                                                <Table responsive className='DeckLogTable'>
                                                                    <tbody>
                                                                        {Object.keys(OnceInADayMap.soundingInVoidSpacesS).map((col, index) => (
                                                                            <tr key={`8-${col}`}>
                                                                                <td key={`8.1-${index}`}>
                                                                                    {OnceInADayMap.soundingInVoidSpacesS[col]}
                                                                                </td>
                                                                                <td key={`8.2-${index}`}>
                                                                                    {<FormControl
                                                                                            type='text'
                                                                                            id={`daily.voidspaceSounding.${col}`} 
                                                                                            aria-describedby={`daily.voidspaceSounding.${col}`} 
                                                                                            value={props.data.voidspaceSounding[col]===null?'':props.data.voidspaceSounding[col]}
                                                                                            onChange={props.handleChange}
                                                                                            name={`daily.voidspaceSounding.${col}`}
                                                                                            className={"DeckLogTableInputBox"}
                                                                                    />}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </Table>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="VesselDraft" title="Vessel's Draft">
                                            <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', borderLeft: '5px solid #04384c'}}>
                                                <Card.Body style={{ border: '0px' }}>
                                                    <div style={{ textAlign: 'center', fontSize: '1.4rem', paddingBottom: '10px' }}>Vessel's Draft</div>
                                                    <Row style={{margin: "20px"}}>
                                                        <Col xl={6} xs={12}>
                                                            <Row style={{ marginTop: '20px' }}>
                                                                <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                                                                    <Card.Header style={{ fontSize: '1.2em', padding: '10px', border: '0px', color: '#067FAA', backgroundColor: '#032a39'}}>Arrival</Card.Header>
                                                                    <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                                                                        <Row>
                                                                            {Object.keys(OnceInADayMap.vesselDraftArrival).map((col, idx)=>(
                                                                                <Col key={`9-${idx}`} xs={12} xl={3} style={{paddingRight: '10px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                                                                                    <label style={{ flexGrow: 1 }}> {OnceInADayMap.vesselDraftArrival[col]}</label>
                                                                                    <div>
                                                                                        <FormControl
                                                                                            type='text' 
                                                                                            id={`daily_draft${col}`} 
                                                                                            aria-describedby={`daily.draft${col}`} 
                                                                                            value={props.data.draft[col]===null?'':props.data.draft[col]}
                                                                                            onChange={props.handleChange}
                                                                                            name={`daily.draft.${col}`}
                                                                                            className="DeckLogInputBox"
                                                                                        />
                                                                                    </div>
                                                                                </Col>
                                                                            ))}
                                                                        </Row>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{margin: "20px"}}>
                                                        <Col xl={6} xs={12}>
                                                            <Row style={{ marginTop: '20px' }}>
                                                                <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                                                                    <Card.Header style={{ fontSize: '1.2em', padding: '10px', border: '0px', color: '#067FAA', backgroundColor: '#032a39'}}>Sailing</Card.Header>
                                                                    <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                                                                        <Row>
                                                                            {Object.keys(OnceInADayMap.vesselDraftSailing).map((col, idx)=>(
                                                                                <Col key={`10-${idx}`} xs={12} xl={3} style={{paddingRight: '10px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                                                                                    <label style={{ flexGrow: 1 }}> {OnceInADayMap.vesselDraftSailing[col]}</label>
                                                                                    <div>
                                                                                        <FormControl
                                                                                            type='text' 
                                                                                            id={`daily_draft${col}`} 
                                                                                            aria-describedby={`daily.draft${col}`} 
                                                                                            value={props.data.draft[col]===null?'':props.data.draft[col]}
                                                                                            onChange={props.handleChange}
                                                                                            name={`daily.draft.${col}`}
                                                                                            className="DeckLogInputBox"
                                                                                        />
                                                                                    </div>
                                                                                </Col>
                                                                            ))}
                                                                        </Row>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Row>
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
export default withMessageManager(withLayoutManager(DeckLogOnceInADay));