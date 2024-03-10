import React from 'react';
import VesselReportHeader from './VesselReportHeader';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Select, MenuItem } from '@material-ui/core';
import config from '../../../../config/config';
import './VesselReportItems.css';

import Acknowledgement from './Acknowledgement';
import { DatePicker } from "@material-ui/pickers";
import InputAdornment from "@material-ui/core/InputAdornment";
import moment from 'moment-timezone';

const CrewOnBoard = props => (
    <React.Fragment>
        <VesselReportHeader notes={"Contact Office if crew names are not reflected properly"} isSubmit={props.isSubmit} heading="Crew on Board" submitButton={true} saveForm={props.saveForm} submit={props.submit} touched={props.touched} errors={props.errors} validateForm={props.validateForm} setTouched={props.setTouched} saved={props.saved} webUrl={props.webUrl} />
        <Container fluid>
            <Row>
                <Col>
                    {props.webUrl === true ? (
                        <div>
                            <span style={{ color: config.KSTColors.MAIN }}>Report Date</span>
                            <div
                                style={{
                                    color: config.KSTColors.MAIN,
                                    fontWeight: "10",
                                    backgroundColor: "rgba(0,0,0,0)",
                                    border: "1px solid #707070",
                                    marginBottom: "15px",
                                    marginTop: "7px",
                                    padding: "6px",
                                    borderRadius: "3px",
                                    width: "48.7%"
                                }}
                            >{props.reportDate}</div>
                        </div>
                    ) : (<Container />)}
                    <Form.Group>
                        <Form.Label style={{ color: config.KSTColors.MAIN }}>Crew Names</Form.Label>
                        {props.crewData.map((crew, index) => (
                            <Row key={index}>
                                <Col xs={6}>
                                    <Form.Control
                                        style={{ color: config.KSTColors.MAIN, fontWeight: '10', backgroundColor: 'rgba(0,0,0,0)', border: '1px solid #707070', marginBottom: '5px' }}
                                        type="text"
                                        value={`${crew.rank} - ${crew.name}`}
                                        disabled
                                    />
                                </Col>
                                <Col className="VesselReportSelectionBox" lg={3} xs={6}>
                                    <div>
                                        <Select style={{ color: config.KSTColors.MAIN, width: '100%' }}
                                            type="selection"
                                            disableUnderline
                                            id={`allCrews[${index}][workingResting]`}
                                            aria-describedby={`allCrews[${index}].workingResting`}
                                            value={crew['workingResting'] === null ? '' : crew['workingResting']}
                                            onChange={props.handleChange}
                                            name={`allCrews[${index}][workingResting]`}
                                            className={(props?.touched?.allCrews?.[index]?.['workingResting'] && props?.errors?.allCrews?.[index]?.['workingResting']) !== undefined ? "VesselReportFillableErrorBox" : "VesselReportFillableBox"}
                                        >
                                            <MenuItem value={0}>Select Working/Resting</MenuItem>
                                            <MenuItem value={1}>Working</MenuItem>
                                            <MenuItem value={2}>Resting</MenuItem>
                                        </Select>
                                    </div>
                                    {(props?.touched?.allCrews?.[index]?.['workingResting'] && props?.errors?.allCrews?.[index]?.['workingResting']) !== undefined && <span className="VesselReportError">{props.errors.allCrews[index]['workingResting']}</span>}
                                </Col>
                            </Row>
                        ))}
                    </Form.Group>
                </Col>
            </Row>
            <div style={{ textAlign: 'center', color: '#04588e', fontSize: '1.2em', paddingBottom: '15px', fontWeight: '900' }}>ACKNOWLEDGEMENTS</div>
            <Row>
                <Col>
                    <Acknowledgement ack={props.captain.ack} values={props.captain.value} touched={props.touched} errors={props.errors} handleChange={props.handleChange} unlock={props.captain.unlock} />
                </Col>
                <Col>
                    <Acknowledgement ack={props.chiefEngineer.ack} values={props.chiefEngineer.value} touched={props.touched} errors={props.errors} handleChange={props.handleChange} unlock={props.chiefEngineer.unlock} />
                </Col>
            </Row>
        </Container>
    </React.Fragment>
);

export default CrewOnBoard;