import React from 'react';
import { Row, Col, Card, FormControl, Table, Button, Tabs, Tab } from 'react-bootstrap'
import '../../css/App.css';
import '../../css/Dashboard.css';
import { FireAndSafetyRounds_UMSList } from './DeckLogData';

import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'

const DeckLogFireAndSafetyRounds_UMS = props => (
        <React.Fragment>
            <Row>
                <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                    <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                        <Tabs defaultActiveKey="FireAndSafetyRounds" transition={false} id="FireAndSafetyRoundsTabs" className='DeckLogEditTabs'>
                            <Tab eventKey="FireAndSafetyRounds" title="Fire And Safety Rounds">
                                <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
                                    <Card.Body style={{ border: '0px' }}>
                                        <Table responsive className='DeckLogTable'>
                                            <thead>
                                                <tr>
                                                    <th key={0}>From</th>
                                                    <th key={1}>To</th>
                                                    <th key={2}>By</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.dataFASR.map((row, idx)=>(
                                                    <tr key={idx}>
                                                        {FireAndSafetyRounds_UMSList.FireAndSafetyRound.map((col, index) => (
                                                            <td key={`${idx}-${col}`}>
                                                                {<FormControl
                                                                        type='text'
                                                                        id={`fireAndSafetyRounds[${idx}].${col}`} 
                                                                        aria-describedby={`fireAndSafetyRounds[${idx}].${col}`} 
                                                                        value={props.dataFASR[idx].col===null?'':props.dataFASR[idx].col}
                                                                        onChange={props.handleChange}
                                                                        name={`fireAndSafetyRounds[${idx}].${col}`}
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
                                                <Button onClick={props.addFASR} style={{ width: '100%' }}>+ Add Row</Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Tab>
                            <Tab eventKey="UMS" title="UMS">
                                <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
                                    <Card.Body style={{ border: '0px' }}>
                                        <Table responsive className='DeckLogTable'>
                                            <thead>
                                                <tr>
                                                    <th key={0}>Start Time</th>
                                                    <th key={1}>End Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.dataUMS.map((row, idx)=>(
                                                    <tr key={idx}>
                                                        {FireAndSafetyRounds_UMSList.UMS.map((col, index) => (
                                                            <td key={`${idx}-${col}`}>
                                                                {<FormControl
                                                                        type='text'
                                                                        id={`UMS[${idx}].${col}`} 
                                                                        aria-describedby={`UMS[${idx}].${col}`} 
                                                                        value={props.dataUMS[idx].col===null?'':props.dataUMS[idx].col}
                                                                        onChange={props.handleChange}
                                                                        name={`UMS[${idx}].${col}`}
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
                                                <Button onClick={props.addUMS} style={{ width: '100%' }}>+ Add Row</Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </Row>
        </React.Fragment>
    );
export default withMessageManager(withLayoutManager(DeckLogFireAndSafetyRounds_UMS));

// import React from 'react';
// import { Row, Col, Card, FormControl } from 'react-bootstrap'
// import '../../css/App.css';
// import '../../css/Dashboard.css';

// import { withLayoutManager } from '../../Helper/Layout/layout'
// import {withMessageManager} from '../../Helper/Message/MessageRenderer'

// const DeckLogFireAndSafetyRounds = props => {
//     return(
//         <React.Fragment>
//         <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c' }}>
//             <Card.Body style={{ border: '0px' }}>
//                 <Row style={{margin: "20px", marginTop: '0px'}}>
//                     <Col xl={12}>
//                         <Row>
//                             <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
//                                 <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
//                                     <Row>
//                                         <Col xs={12} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
//                                             <span style={{ marginRight: '5px', display: 'block', width: '100%', textAlign: 'center' }}>From</span>
//                                             <span style={{ marginRight: '5px', display: 'block', width: '100%', textAlign: 'center' }}>To</span>
//                                             <span style={{ marginRight: '5px', display: 'block', width: '100%', textAlign: 'center' }}>By</span>
//                                         </Col>
//                                     </Row>
//                                     <Row>
//                                         <Col xs={12} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                         </Col>
//                                     </Row>
//                                     <Row>
//                                         <Col xs={12} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                         </Col>
//                                     </Row>
//                                     <Row>
//                                         <Col xs={12} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                         </Col>
//                                     </Row>
//                                     <Row>
//                                         <Col xs={12} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                         </Col>
//                                     </Row>
//                                     <Row>
//                                         <Col xs={12} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                         </Col>
//                                     </Row>
//                                     <Row>
//                                         <Col xs={12} style={{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                             <span style={{ marginRight: '5px' }}>
//                                                 <FormControl
//                                                     type='number' 
//                                                     id={props.data.lyingHour.field} 
//                                                     aria-describedby={props.data.lyingHour.field} 
//                                                     value={props.data.lyingHour.value===null?'':props.data.lyingHour.value}
//                                                     onChange={props.handleChange}
//                                                     name={props.data.lyingHour.field}
//                                                     className={"DeckLogInputBox"}
//                                                 />
//                                             </span>
//                                         </Col>
//                                     </Row>
//                                 </Card.Body>
//                             </Card>
//                         </Row>
//                     </Col>
//                 </Row>
//             </Card.Body>
//         </Card>
//         </React.Fragment>
//     );
// }
// export default withMessageManager(withLayoutManager(DeckLogFireAndSafetyRounds));