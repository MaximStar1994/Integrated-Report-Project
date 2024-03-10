import React from 'react';
import VesselReportHeader from './VesselReportHeader';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Select, MenuItem } from '@material-ui/core';
import config from '../../../../config/config';
import './VesselReportItems.css';

import DailyAcknowledgement from './DailyAcknowledgement';

import { DatePicker } from "@material-ui/pickers";
import InputAdornment from "@material-ui/core/InputAdornment";
import moment from 'moment-timezone';

const DailyLogAcknowledgement = props => (
    <React.Fragment>
        <VesselReportHeader dailyLog={true} isSubmit={props.isSubmit} submitButton={true} saveForm={props.saveForm} submit={props.submit} touched={props.touched} errors={props.errors} validateForm={props.validateForm} setTouched={props.setTouched} saved={props.saved} webUrl={props.webUrl} />
        {props.webUrl === true ? (
      <Col>
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
        </Col>
        ) : (<Container />)}
        <Container fluid>
            <div style={{ paddingTop: "10px", textAlign: 'center', color: '#04588e', fontSize: '1.2em', paddingBottom: '15px', fontWeight: '900' }}>ACKNOWLEDGEMENTS</div>
            <Row>
                <Col>
                    <DailyAcknowledgement ack={props.captain.ack} values={props.captain.value} touched={props.touched} errors={props.errors} handleChange={props.handleChange} unlock={props.captain.unlock}/>
                </Col>
                <Col>
                    <DailyAcknowledgement ack={props.chiefEngineer.ack} values={props.chiefEngineer.value} touched={props.touched} errors={props.errors} handleChange={props.handleChange} unlock={props.chiefEngineer.unlock}/>
                </Col>
            </Row>
        </Container>
    </React.Fragment>
);

export default DailyLogAcknowledgement;