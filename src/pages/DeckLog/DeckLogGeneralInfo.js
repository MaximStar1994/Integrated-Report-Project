import React from 'react';
import { Row, Col, Card, FormControl, Table, Button } from 'react-bootstrap'
import '../../css/App.css';
import '../../css/Dashboard.css';

import { GeneralInfoList } from './DeckLogData'

import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'

const DeckLogGeneralInfo = props => {
    return(
        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px', border: '4px solid #04384c'}}>
            <Card.Body style={{ border: '0px' }}>
                <Row>
                    <Col style={{ padding: '1.7rem', paddingTop: '0px' }}>
                        <Card style={{ width: '100%', color: '#067FAA', backgroundColor: '#032a39', border: '0px' }}>
                            <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                                <Row>
                                    <Col xs={12}>
                                        <Row style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                            <Table responsive className='DeckLogTable'>
                                                <thead>
                                                    <tr>
                                                        <th key={0}>From</th>
                                                        <th key={1}>To</th>
                                                        <th key={2}>Lying At</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {props.data.map((row, idx)=>(
                                                        <tr key={idx}>
                                                            {GeneralInfoList.map((col, index) => (
                                                                <td key={`${idx}-${col}`}>
                                                                    {<FormControl
                                                                            type='text'
                                                                            id={`general[${idx}].${col}`} 
                                                                            aria-describedby={`general[${idx}].${col}`} 
                                                                            value={props.data[idx][col]===null?'':props.data[idx][col]}
                                                                            onChange={props.handleChange}
                                                                            name={`general[${idx}].${col}`}
                                                                            className={"DeckLogTableInputBox"}
                                                                    />}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Button onClick={props.addGeneralInfo} style={{ width: '100%' }}>+ Add Row</Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Card.Body>
        </Card>

    );
}
export default withMessageManager(withLayoutManager(DeckLogGeneralInfo));