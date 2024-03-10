import React from 'react'
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap'
import { Button } from '@material-ui/core';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner'

import { withLayoutManager } from '../../../Helper/Layout/layout'
import {withMessageManager} from '../../../Helper/Message/MessageRenderer'
import FullScreenSpinner from '../../../components/FullScreenSpinner/FullScreenSpinner'

import { withRouter } from "react-router-dom"
import { Formik } from "formik";
import * as Yup from "yup";
import moment from 'moment';
import './MeetingMinutesForm.css';
import { MMDatastructure, MMTitleAndLabels } from '../MeetingMinuteDataSet';
import AgendaForm from './AgendaForm';
import GeneralForm from './GeneralForm';
import { withMeetingMinutes } from '../MeetingMinutesContext';

class MeetingMinutesForm extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isSaving: false,
            isSubmitting: false
        };
        this.validationSchema = Yup.object().shape({
        });
        this.labelProps={style : {color : "white"}}
    }
    componentDidMount() {
        var meetingMinuteId = this.props.match.params.id
        this.props.getMeetingMinutes(meetingMinuteId);
    }
    componentWillUnmount() {
        this.props.resetMeetingMinutes();
    }

    updateSignatures = (values) => {
        if(this.props.signAllowed.master===true)
            this.props.updateSignature('masterSignatureCanvas');
        if(this.props.signAllowed.chiefEngineer===true)
            this.props.updateSignature('chiefEngineerSignatureCanvas');
        if(this.props.signAllowed.chiefOfficer===true)
            this.props.updateSignature('chiefOfficerSignatureCanvas');
        if(this.props.signAllowed.secondOfficer===true)
            this.props.updateSignature('secondOfficerSignatureCanvas');
        values.general.masterSignature = this.props.meetingMinutes.general.masterSignature;
        values.general.chiefOfficerSignature = this.props.meetingMinutes.general.chiefOfficerSignature;
        values.general.chiefEngineerSignature = this.props.meetingMinutes.general.chiefEngineerSignature;
        values.general.secondOfficerSignature = this.props.meetingMinutes.general.secondOfficerSignature;
    }

    handleSave(values) {
        values.isSubmitted = false;
        this.setState({ isSaving: true });
        this.updateSignatures(values);
        this.props.postMeetingMinutes(values, (result, error) => {
            this.setState({ isSaving: false });
            if(!error){
                this.props.setMessages([{type : "success", message : "Saved!"}]);
                this.props.history.push('/meetingminutes');
            }
            else{
                this.props.setMessages([{type : "danger", message : "Unable to save the form!"}]);
            }
        });
    }

    handleSubmit(values) {
        values.isSubmitted = true;
        console.log(values);
        this.setState({ isSubmitting: true });
        this.props.postMeetingMinutes(values, (result, error) => {
            this.setState({ isSubmitting: false });
            if(!error){
                this.props.setMessages([{type : "success", message : "Submitted!"}]);
                this.props.history.push('/meetingminutes');
            }
            else{
                this.props.setMessages([{type : "danger", message : "Unable to submit the form!"}]);
            }
        });
    }

    checkSignatures(values){
        console.log('cehcking', values);
        if(values.general.masterSignature===null||values.general.chiefOfficerSignature===null||values.general.chiefEngineerSignature===null||values.general.secondOfficerSignature===null){
            this.props.setMessages([{type : "danger", message : "All Signatures are mandatory to submit the form"}]);
            return false;
        }
        return true;
    }

    renderForm() {
        return (
            <Formik
            initialValues={this.props.meetingMinutes}
            validationSchema={this.validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                this.updateSignatures(values);
                if(this.checkSignatures(values)===true)
                    this.handleSubmit(values);
            }}
            >
                {({values,errors,touched,handleChange,setFieldValue,handleSubmit,isSubmitting,setSubmitting})=>{
                    return( 
                        <Form onSubmit={handleSubmit} className="mx-auto">
                            <Row style={{ padding: '20px', margin: '10px' }}>
                                <Col>
                                    <Row style={{ color: '#067FAA', fontSize: '1.2em', paddingBottom: '15px' }}>
                                        <Col style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ marginRight: 'auto', visibility: 'hidden' }}></div>
                                            <div style={{ fontSize: '1.4rem' }}>
                                                MINUTES OF SHIPBOARD SAFETY COMMITTEE MEETING
                                            </div>
                                            <div style={{ marginLeft: 'auto' }}>
                                                <Button variant="contained" color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', paddingLeft: '10px', paddingRight: '10px' }} onClick={()=>{
                                                    this.handleSave(values)
                                                }}> 
                                                    {this.state.isSaving?<Spinner animation="border" variant="light" size='sm' />: ' '} 
                                                    Save
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row style={{ backgroundColor: '#04384C', padding: '20px' }}>
                                        <Col>
                                            <Row>
                                                <Col xs={12}>
                                                    <Tab.Container defaultActiveKey="general" transition={false} id="MMFormTabs">
                                                        <Row>
                                                            <Col xs={2}>
                                                                <Nav variant="pills" className="flex-column" style={{ marginTop: '20px', paddingRight: '5px' }}>
                                                                    <Nav.Item className={'MMFormNavLinks'}><Nav.Link eventKey="general">{'General'}</Nav.Link></Nav.Item>
                                                                    <Nav.Item className={'MMFormNavLinks'}><Nav.Link eventKey="safetySharing">{MMTitleAndLabels.safety.title}</Nav.Link></Nav.Item>
                                                                    <Nav.Item className={'MMFormNavLinks'}><Nav.Link eventKey="resultOrStatusOfLastMeeting">{MMTitleAndLabels.lastmeetingstatus.title}</Nav.Link></Nav.Item>
                                                                    <Nav.Item className={'MMFormNavLinks'}><Nav.Link eventKey="arisingMatters">{MMTitleAndLabels.arisingMatters.title}</Nav.Link></Nav.Item>
                                                                    <Nav.Item className={'MMFormNavLinks'}><Nav.Link eventKey="awarenessOfSMSLegislativeAndRegulatoryChanges">{MMTitleAndLabels.regulation.title}</Nav.Link></Nav.Item>
                                                                    <Nav.Item className={'MMFormNavLinks'}><Nav.Link eventKey="suggestionForContinualImprovement">{MMTitleAndLabels.suggestion.title}</Nav.Link></Nav.Item>
                                                                    <Nav.Item className={'MMFormNavLinks'}><Nav.Link eventKey="monthlyAuditInspectionInternalExternal">{MMTitleAndLabels.audit.title}</Nav.Link></Nav.Item>
                                                                    <Nav.Item className={'MMFormNavLinks'}><Nav.Link eventKey="statusOfCorrectiveAndPreventiveActions">{MMTitleAndLabels.correctivePreventiveAction.title}</Nav.Link></Nav.Item>
                                                                    <Nav.Item className={'MMFormNavLinks'}><Nav.Link eventKey="analysisOfShipboardDrillsAndExercise">{MMTitleAndLabels.drillsAndExercise.title}</Nav.Link></Nav.Item>
                                                                    <Nav.Item className={'MMFormNavLinks'}><Nav.Link eventKey="otherMatters">{MMTitleAndLabels.other.title}</Nav.Link></Nav.Item>
                                                                    <Nav.Item className={'MMFormNavLinks'}><Nav.Link eventKey="tentativeDateForNextMeetingReview">{MMTitleAndLabels.nextMeeting.title}</Nav.Link></Nav.Item>
                                                                </Nav>
                                                            </Col>
                                                            <Col xs={10}>
                                                                <Tab.Content>
                                                                    <Tab.Pane eventKey="general" title={'General'}><GeneralForm isSubmitting={this.state.isSubmitting} data={values.general} prefix={'general'} handleChange={handleChange}/></Tab.Pane>
                                                                    <Tab.Pane eventKey="safetySharing" title={MMTitleAndLabels.safety.title}><AgendaForm data={values.safety} prefix={'safety'} handleChange={handleChange}/></Tab.Pane>
                                                                    <Tab.Pane eventKey="resultOrStatusOfLastMeeting" title={MMTitleAndLabels.lastmeetingstatus.title}><AgendaForm data={values.lastmeetingstatus} prefix={'lastmeetingstatus'} handleChange={handleChange}/></Tab.Pane>
                                                                    <Tab.Pane eventKey="arisingMatters" title={MMTitleAndLabels.arisingMatters.title}><AgendaForm data={values.arisingMatters} prefix={'arisingMatters'} handleChange={handleChange}/></Tab.Pane>
                                                                    <Tab.Pane eventKey="awarenessOfSMSLegislativeAndRegulatoryChanges" title={MMTitleAndLabels.regulation.title}><AgendaForm data={values.regulation} prefix={'regulation'} handleChange={handleChange}/></Tab.Pane>
                                                                    <Tab.Pane eventKey="suggestionForContinualImprovement" title={MMTitleAndLabels.suggestion.title}><AgendaForm data={values.suggestion} prefix={'suggestion'} handleChange={handleChange}/></Tab.Pane>
                                                                    <Tab.Pane eventKey="monthlyAuditInspectionInternalExternal" title={MMTitleAndLabels.audit.title}><AgendaForm data={values.audit} prefix={'audit'} handleChange={handleChange}/></Tab.Pane>
                                                                    <Tab.Pane eventKey="statusOfCorrectiveAndPreventiveActions" title={MMTitleAndLabels.correctivePreventiveAction.title}><AgendaForm data={values.correctivePreventiveAction} prefix={'correctivePreventiveAction'} handleChange={handleChange}/></Tab.Pane>
                                                                    <Tab.Pane eventKey="analysisOfShipboardDrillsAndExercise" title={MMTitleAndLabels.drillsAndExercise.title}><AgendaForm data={values.drillsAndExercise} prefix={'drillsAndExercise'} handleChange={handleChange}/></Tab.Pane>
                                                                    <Tab.Pane eventKey="otherMatters" title={MMTitleAndLabels.other.title}><AgendaForm data={values.other} prefix={'other'} handleChange={handleChange}/></Tab.Pane>
                                                                    <Tab.Pane eventKey="tentativeDateForNextMeetingReview" title={MMTitleAndLabels.nextMeeting.title}><AgendaForm data={values.nextMeeting} prefix={'nextMeeting'} handleChange={handleChange}/></Tab.Pane>
                                                                </Tab.Content>
                                                            </Col>
                                                        </Row>
                                                    </Tab.Container>
                                                </Col>    
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    )
                }}
            </Formik>
        )

    }
    render() {
        return(
            <div style={{ fontSize: '14px' }}>
                {!this.props.MMLoaded===true && <FullScreenSpinner />}
                {this.props.MMLoaded===true && this.renderForm()}
            </div>
        );
    }
}

export default withRouter(withMessageManager(withLayoutManager(withMeetingMinutes(MeetingMinutesForm))));