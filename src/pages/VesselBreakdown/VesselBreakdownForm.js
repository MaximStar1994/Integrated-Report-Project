
import React, { Component } from 'react';
import { Container, Row, Col, Tabs, Tab, Modal } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import { withLayoutManager } from '../../Helper/Layout/layout';
import { withVesselBreakdown } from './VesselBreakdownContext';
import './VesselBreakdown.css';
import { Formik } from "formik";
import * as Yup from "yup";

import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner';
import { withMessageManager } from '../../Helper/Message/MessageRenderer';
import deepCopy from '../../Helper/GeneralFunc/deepCopy';
import config from '../../config/config';
import SendIcon from '@material-ui/icons/Send';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import VesselBreakdownInput from './VesselBreakdownInput';
import Spinner from 'react-bootstrap/Spinner'
import moment from 'moment';
import { withAuthManager } from '../../Helper/Auth/auth';

const VESSELBREAKDOWNTEMPLATE = {
    vesselId : null,
    vesselName : '',
    breakdownDatetime : null,
    backToOperationDatetime : null,
    reason : '',
    status: '',
    is_redundant: false,
    is_editable: false,
    support: {
        superintendent : '',
        category : '',
        remarks : '',
        vesselReplacement : '',
        vesselCondition : ''
    }
}

class VesselBreakdownEditForm extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            isSubmit: false,
            isSave: false,
            loaded: false,
            vesselName: '',
            event: {},
            modalShow: false,
            isManagement: (this.props.match.params.isManagement === "true")
        };
        this.validationSchema = Yup.object().shape({
            event: Yup.object().shape({
                vesselId : Yup.number().required('Missing Vessel Data'),
                vesselName : Yup.string().required('Vessel Name is required'),
                breakdownDatetime : Yup.string().required('Breakdown Date/Time is required').nullable(),
                backToOperationDatetime : Yup.string().required('Back To Operation Date/Time is required').nullable(),
                reason : Yup.string().required('Reason is required'),
                support: Yup.object().shape({
                    superintendent : Yup.string().required('Supt Name is required'),
                    category : Yup.string().required('Tech Category is required'),
                    vesselReplacement : Yup.string().required('Vessel Replacement is required'),
                    vesselCondition : Yup.string().required('Vessel Condition is required')
                })
            })
        });
    }
    isEmpty(element){
        if(element===undefined || element===null || element==='')
            return true;
        else
            return false;
    }
    getData = async() =>{
        if(isNaN(this.props.selectedVessel.vessel_id)===true||this.props.selectedVessel.vessel_id==='0'){
            this.props.setMessages([{type : "danger", message : "Vessel not identified!"}]);
            window.scrollTo(0,0);
            this.props.history.push(`${this.props.VESSELBREAKDOWNTABLEIDENTIFIER}/${this.state.isManagement}`);
            this.setState({ loaded: true });
        }
        let selectedVesselId = this.props.selectedVessel.vessel_id;
        let canView = await this.props.canViewVesselBreakdownPage(selectedVesselId);
        if(canView.success===true){
            let vesselBreakdownList = await this.props.getVesselBreakdownList(selectedVesselId,this.state.isManagement);
            if(this.props.match.params.id==='new'){
                let temp = {...VESSELBREAKDOWNTEMPLATE};
                temp.vesselId = vesselBreakdownList.vesselId;
                temp.vesselName = vesselBreakdownList.vesselName;
                this.setState({ event: temp, loaded :true });
            }
            else{
                let temp = vesselBreakdownList.events;
                let event = {};
                let found = false;
                if(temp instanceof Array){
                    temp.forEach(element=> {
                        if(element.eventId == this.props.match.params.id){
                            event = {...element};
                            found = true;
                        }
                    })
                    if(found===true){
                        this.setState({ event: event, loaded :true });
                    }
                    else{
                        this.props.setMessages([{type : "danger", message : "Event not found!"}]);
                        window.scrollTo(0,0);
                        this.props.history.push(`${this.props.VESSELBREAKDOWNTABLEIDENTIFIER}/${this.state.isManagement}`);
                        this.setState({ loaded: true });
                    }
                }
            }
        }
        else if(canView.success===false){
            this.props.setMessages([{type : "danger", message : canView.err}]);
            window.scrollTo(0,0);
            this.props.history.push(`${this.props.VESSELBREAKDOWNTABLEIDENTIFIER}/${this.state.isManagement}`);
        }
        else{
            this.props.setMessages([{type : "danger", message : canView.err}]);
            window.scrollTo(0,0);
            this.props.history.push('/operation');
        }
    }
    componentDidMount(){
        this.getData();
        window.onbeforeunload = () => {
            this.props.resetVesselBreakdown();
            if (isNaN(this.props.selectedVessel.vessel_id) !== true && this.props.selectedVessel.vessel_id !== '0') {
                this.props.unlockVesselBreakdown(this.props.selectedVessel.vessel_id);
                localStorage.removeItem("VesselBreakdownLock");
            }
        }
    };

    componentWillUnmount(){
        this.props.resetVesselBreakdown();
        if (isNaN(this.props.selectedVessel.vessel_id) !== true && this.props.selectedVessel.vessel_id !== '0') {
            this.props.unlockVesselBreakdown(this.props.selectedVessel.vessel_id);
            localStorage.removeItem("VesselBreakdownLock");
        }
    };

    render(){
        return (
            <React.Fragment>
                {this.state.loaded===true?
                    <React.Fragment>
                        <Formik
                        initialValues={{
                            event: {...this.state.event}
                        }}
                        validationSchema={this.validationSchema}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            if(values.event.backToOperationDatetime!==null && values.event.breakdownDatetime!==null && moment(values.event.backToOperationDatetime).isSameOrAfter(moment(values.event.breakdownDatetime))===true){
                                try{
                                    this.setState({ isSubmit: true });
                                    if(values.event.filepath!==undefined)
                                        delete values.event.filepath
                                    let result = await this.props.submitVesselBreakdown(values.event);
                                        if(result.success===true){
                                            this.props.setMessages([{type : "success", message : "Submitted!"}]);
                                            window.scrollTo(0,0);
                                            this.props.history.push(`${this.props.VESSELBREAKDOWNTABLEIDENTIFIER}/${this.state.isManagement}`);
                                            this.setState({ isSubmit: false });
                                        }
                                        else{
                                            this.setState({ isSave: false });
                                            this.props.setMessages([{type : "danger", message : "Unable to Submit!"}]);
                                            window.scrollTo(0,0);
                                        }
                                        
                                }
                                catch (err) {
                                    this.setState({ isSubmit: false });
                                    this.props.setMessages([{type : "danger", message : "Unable to Submit! Try again later with Internet Connectivity!"}]);
                                    window.scrollTo(0,0);
                                    console.log("Submit Error: ", err);
                                }
                            }
                            else{
                                this.props.setMessages([{type : "danger", message : "Back to Operation Datetime cannot be less than Breakdown Datetime"}]);
                                    window.scrollTo(0,0);
                            }
                        }}
                        >
                            {({values,errors,touched,handleChange,setFieldValue,handleSubmit,isSubmitting,setSubmitting, validateForm, setTouched })=>{
                                const saveForm = async() => {
                                    try{
                                        if (values.event.backToOperationDatetime !== null && values.event.breakdownDatetime !== null && moment(values.event.backToOperationDatetime).isBefore(moment(values.event.breakdownDatetime)) === true) {
                                            this.props.setMessages([{type : "danger", message : "Back to Operation Datetime cannot be less than Breakdown Datetime"}]);
                                            window.scrollTo(0, 0);
                                            return;
                                        }
                                        this.setState({ isSave: true });
                                        let result = await this.props.saveVesselBreakdown(values.event);
                                        if(result.success===true){
                                            this.props.setMessages([{type : "success", message : "Saved!"}]);
                                            window.scrollTo(0,0);
                                            this.props.history.push(`${this.props.VESSELBREAKDOWNTABLEIDENTIFIER}/${this.state.isManagement}`);
                                            this.setState({ isSave: false });
                                        }
                                        else{
                                            this.setState({ isSave: false });
                                            this.props.setMessages([{type : "danger", message : "Unable to Save!"}]);
                                            window.scrollTo(0,0);
                                        }
                                    }
                                    catch(err){
                                        this.setState({ isSave: false });
                                        this.props.setMessages([{type : "danger", message : "Unable to Save! Try again later with Internet Connectivity!"}]);
                                        window.scrollTo(0,0);
                                        console.log("Save Error", err);
                                        
                                    }
                                }
                                return(
                                    <Container fluid className="KSTBreakdownBackground">
                                        <Row>
                                            <Col>
                                                <div className="VesselReportHeaderBase">
                                                    <div className="VesselReportHeaderBackground">
                                                        <div className="VesselReportHeading">VESSEL DOWNTIME RECORD FORM</div>
                                                    </div>
                                                    <div style={{ marginLeft: 'auto', paddingRight: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Button variant="contained" 
                                                            onClick={async ()=>{
                                                                let err = await validateForm();
                                                                if(Object.keys(err).length!==0){
                                                                    this.props.setMessages([{ type: "danger", message: "Missing input in Vessel Downtime Record Form!" }]);
                                                                    return;
                                                                }
                                                                // handleSubmit()
                                                                this.setState({ modalShow: true });

                                                            }} 
                                                            disabled={this.state.isSubmit===true || this.state.isSave===true}
                                                            style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px' }} 
                                                        >
                                                            {this.state.isSubmit===true?
                                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                                                                :
                                                                    <SendIcon style={{ color: config.KSTColors.ICON }}/>
                                                            }
                                                            <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Submit</span>
                                                        </Button>
                                                        <Button variant="contained" onClick={saveForm} disabled={this.state.isSubmit===true || this.state.isSave===true}
                                                            style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px' }}
                                                        >
                                                                {this.state.isSave===true?
                                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                                                                :
                                                                    <SaveAltIcon style={{ color: config.KSTColors.ICON }}/>
                                                                }
                                                            <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Save</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Tabs id="VesselBreakdownTab" defaultActiveKey="event" className="VesselBreakdownTab">
                                                    <Tab eventKey="event" title="Event Information" >
                                                        <Row className="VesselBreakdownTabContent">
                                                            <Col>
                                                                <VesselBreakdownInput type="text" id={"event.vesselName"} title={"Vessel Name"} handleChange={handleChange} value={values.event.vesselName} touched={touched} errors={errors} editable={false} support={false} errorId= 'vesselName'/>
                                                                <VesselBreakdownInput type="datetime" id={"event.breakdownDatetime"} title={"Breakdown Date Time"} handleChange={handleChange} value={values.event.breakdownDatetime} touched={touched} errors={errors} setFieldValue={setFieldValue}  support={false} errorId= 'breakdownDatetime' disableFutureDates={true}/>
                                                                <VesselBreakdownInput type="datetime" id={"event.backToOperationDatetime"} title={"Back To Operation Date Time"} handleChange={handleChange} value={values.event.backToOperationDatetime} touched={touched} errors={errors} setFieldValue={setFieldValue} support={false} errorId='backToOperationDatetime' disableFutureDates={true} />
                                                                <VesselBreakdownInput type="text" id={"event.support.vesselReplacement"} title={"Vessel Replacement"} handleChange={handleChange} value={values.event.support.vesselReplacement} touched={touched} errors={errors} setFieldValue={setFieldValue}  support={true} errorId='vesselReplacement'/>
                                                            </Col>
                                                            <Col>
                                                                <VesselBreakdownInput type="textarea" id={"event.reason"} title={"Reason"} handleChange={handleChange} value={values.event.reason} touched={touched} errors={errors}  support={false} errorId= 'reason'/>
                                                            </Col>
                                                        </Row>
                                                    </Tab>
                                                    <Tab eventKey="support" title="Technical Support">
                                                        <Row className="VesselBreakdownTabContent">
                                                            <Col>
                                                                <VesselBreakdownInput type="text" id={"event.support.superintendent"} title={"Supt Name"} handleChange={handleChange} value={values.event.support.superintendent} touched={touched} errors={errors} support={true} errorId='superintendent'/>
                                                                <VesselBreakdownInput type="selection" id={"event.support.category"} title={"Tech Categories"} handleChange={handleChange} value={values.event.support.category} touched={touched} errors={errors} setFieldValue={setFieldValue} options={['','Survey', 'Planned Maintenance Work', 'Machinery Breakdown', 'Incident', 'Operation', 'Crewing', 'Others']} support={true} errorId='category'/>
                                                                <VesselBreakdownInput type="selection" id={"event.support.vesselCondition"} title={"Vessel Condition"} handleChange={handleChange} value={values.event.support.vesselCondition} touched={touched} errors={errors} setFieldValue={setFieldValue} options={['', 'Operational', 'Non Operational']} support={true} errorId='vesselCondition'/>
                                                            </Col>
                                                            <Col>
                                                                <VesselBreakdownInput type="textarea" id={"event.support.remarks"} title={"Remarks"} handleChange={handleChange} value={values.event.support.remarks} touched={touched} errors={errors}  support={true} errorId='remarks'/>
                                                            </Col>
                                                        </Row>
                                                    </Tab>
                                                </Tabs>
                                            </Col>
                                        </Row>
                                        <Modal show={this.state.modalShow}>
                                            <Modal.Header>
                                                <Modal.Title>
                                                    Vessel Downtime Submission
                                                </Modal.Title>
                                            </Modal.Header> 
                                            <Modal.Body>
                                                <div>Are you sure you want to submit this page?</div>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="contained" 
                                                    onClick={() => {
                                                        this.setState({modalShow: false})
                                                    }} 
                                                    style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px' }} 
                                                >
                                                    <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Cancel</span>
                                                </Button>
                                                <Button variant="contained" 
                                                    onClick={() => {
                                                        this.setState({modalShow: false})
                                                        handleSubmit();
                                                    }} 
                                                    style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px' }} 
                                                >
                                                    <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Submit</span>
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>  
                                    </Container>
                                ) 
                            }}
                        </Formik>
                    </React.Fragment>
                    :
                    <FullScreenSpinner text={this.state.isSubmit===true?"Submitting...":this.state.isSave===true?"Saving...":"Loading..."}/>
                }
            </React.Fragment>
        );
    }
}

export default withAuthManager(withLayoutManager(withVesselBreakdown(withMessageManager(VesselBreakdownEditForm))));