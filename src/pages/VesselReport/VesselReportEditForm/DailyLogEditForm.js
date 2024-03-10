
import React, { Component } from 'react';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import { withLayoutManager } from '../../../Helper/Layout/layout';
import { withDailyLog } from '../DailyLogContext';
import './VesselReportEditForm.css';
import { Formik } from "formik";
import * as Yup from "yup";

import DailyLogAcknowledgement from './VesselReportItems/DailyLogAcknowledgement';
import EnginesRunningHours from './VesselReportItems/EnginesRunningHours';
import ConsumableROB from './VesselReportItems/ConsumablesROB';
import TankSurroundings from './VesselReportItems/TankSoundings';
import ActivitiesRemarks from './VesselReportItems/ActivittiesRemarks';
import { VESSELREPORTTABLEIDENTIFIER } from './VesselReportFormStructure';

import FullScreenSpinner from '../../../components/FullScreenSpinner/FullScreenSpinner';
import { withMessageManager } from '../../../Helper/Message/MessageRenderer';
import deepCopy from '../../../Helper/GeneralFunc/deepCopy';
import config from '../../../config/config';
import AuthorizedBackDatedApi from "../../../model/AuthorizedBackDatedApi";
import moment from 'moment';

class DailyLogEditForm extends Component {
    constructor(props, context){
        super(props, context);
        this.authorizedBackDatedApi = new AuthorizedBackDatedApi();
        this.state = {
            is_backdated: this.props.match.params.backdated === "false" ? false : true,
            reportDate: this.props.match.params.backdated === "false" ? "" : this.props.match.params.reportDate,
            isSubmit: false,
            captain: {
                password: '',
                passwordError: '',
                name: ''
            },
            chiefEngineer: {
                password: '',
                passwordError: '',
                name: ''
            }
        };
        this.validationSchema = Yup.object().shape({
            captain: Yup.object().shape({
                name: Yup.string().required('Please input Captain\'s Name')
            }),
            chiefEngineer: Yup.object().shape({
                name: Yup.string().required('Please input Chief Engineer\'s Name')
            }),
            engines: Yup.array().of(
                Yup.object().shape({
                    carryForwardRunningHour : Yup.number().required("Required*").nullable(),
                    runningHour : Yup.number().required("Required*").nullable(),
            })),
            rob: Yup.array().of(
                Yup.object().shape({      
                    carryForward: Yup.number().required("Required*").nullable(),
                    received : Yup.number().required("Required*").nullable(),
                    consumed : Yup.number().required("Required*").nullable()
                })
            ),
            tanksoundings: Yup.array().of(
                Yup.object().shape({      
                    level : Yup.number().required("Required*").nullable(),
                    volume :  Yup.number().required("Required*").nullable(),
                })
            ),
        });
    }
    componentDidMount() {
        this.props.getDailyLog(this.props.match.params.backdated,(reportstatus, message) => {
          if (reportstatus === false) {
            this.props.setMessages([{ type: "danger", message: message }]);
            this.props.history.push(`${VESSELREPORTTABLEIDENTIFIER}/${ this.props.match.params.backdated === "false" ? false : true }`);
          }
        });
      }

    componentWillUnmount(){
        this.props.resetDailyLog();
        this.props.unlockDailyLog();
    };

    render(){
        return (
            <React.Fragment>
                {this.props.DailyLogLoaded===true?
                    <React.Fragment>
                    <Formik
                    initialValues={{...this.state, 
                        ...this.props.DailyLog
                    }}
                    validationSchema={this.validationSchema}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        let temp = {};
                        this.props.updateSignatures();
                        values.captainSignature = this.props.DailyLog.captainSignature;
                        values.chiefEngineerSignature = this.props.DailyLog.chiefEngineerSignature;
                        if(values.captainSignature===null || values.chiefEngineerSignature===null){
                            this.props.setMessages([{type : "danger", message : "Signatures are mandatory to submit!"}]);
                            window.scrollTo(0,0);
                        }
                        else{
                            temp = deepCopy(values);
                            temp.captainName = temp.captain.name;
                            temp.chiefEngineerName = temp.chiefEngineer.name;
                            temp.engines.forEach(engine => {
                                engine.totalRunningHour = engine.carryForwardRunningHour + engine.runningHour;
                                engine.totalLNGRunningHour = (engine.LNGcarryForwardRunningHour||0) + (engine.LNGrunningHour||0);
                            });
                            temp.generators.forEach(generator => {
                                generator.totalRunningHour = generator.carryForwardRunningHour + generator.runningHour;
                            });
                            temp.rob.forEach(consumableRob => {
                                consumableRob.rob = consumableRob.carryForward + consumableRob.received - consumableRob.consumed;
                            });
                            // delete temp.chiefEngineer;
                            // delete temp.captain;
                            temp.chiefEngineer.password = ""
                            temp.chiefEngineer.passwordError = ""
                            temp.captain.password = ""
                            temp.captain.passwordError = ""
                            temp.is_backdated = this.state.is_backdated;
                            if(this.props.match.params.backdated === "true") {
                                temp.reportDate = this.state.reportDate;
                            }

                            try{
                                this.setState({ isSubmit: true });
                                await this.props.saveDailyLog(temp);
                                const submitValue = await this.props.submitDailyLog(temp.reportDate);
                                if (this.state.is_backdated) {
                                    //Authorized backdated db status update to complete
                                    let vesselId = JSON.parse(localStorage.getItem("user")) .vessels[0].vesselId;
                                    var form = "DAILYLOG";
                                    await this.authorizedBackDatedApi.statusCompleteAuthorizedBackDatedData( vesselId,form,this.state.reportDate);
                                }
                                this.props.setMessages([{type : "success", message : "Submitted!"}]);
                                window.scrollTo(0,0);
                                this.props.history.push( `${VESSELREPORTTABLEIDENTIFIER}/${ this.props.match.params.backdated === "false" ? false : true }` );
                                this.setState({ isSubmit: false });
                            }
                            catch (err) {
                                console.log("Submit Error: ", err);
                                this.props.setMessages([{type : "danger", message : "Unable to submit Daily Log Form! Try again later with Internet Connectivity!"}]);
                                window.scrollTo(0,0);
                                this.setState({ isSubmit: false });
                            }
                        }
                    }}
                    >
                        {({values,errors,touched,handleChange,setFieldValue,handleSubmit,isSubmitting,setSubmitting, validateForm, setTouched })=>{
                            const unlockCaptainSignature = () =>{
                                if(values.captain.password===window.CAPTAIN){
                                    this.props.setSignAllowed({...this.props.signAllowed, captain: true}); 
                                    values.captain.passwordError = "";
                                    values.captain.password = "";
                                }
                                else {
                                    this.props.setSignAllowed({...this.props.signAllowed, captain: false}); 
                                    values.captain.passwordError = "Invalid Password, Try Again!";
                                    values.captain.password = "";
                                }
                            } 
                            const unlockChiefEngineerSignature = () =>{
                                if(values.chiefEngineer.password===window.CHIEFENGINEER){
                                    this.props.setSignAllowed({...this.props.signAllowed, chiefEngineer: true}); 
                                    values.chiefEngineer.passwordError = "";
                                    values.chiefEngineer.password = "";
                                }
                                else {
                                    this.props.setSignAllowed({...this.props.signAllowed, chiefEngineer: false}); 
                                    values.chiefEngineer.passwordError = "Invalid Password, Try Again!";
                                    values.chiefEngineer.password = "";
                                }
                            }
                            
                            const saveForm = async() => {
                                this.props.updateSignatures();
                                values.chiefEngineer.password = ""
                                values.chiefEngineer.passwordError = ""
                                values.captain.password = ""
                                values.captain.passwordError = ""
                                values.captainSignature = this.props.DailyLog.captainSignature;
                                values.chiefEngineerSignature = this.props.DailyLog.chiefEngineerSignature;
                                values.saved = true;
                                await this.props.saveDailyLog(values);
                                this.props.history.push(`/vesselreport/${ this.props.match.params.backdated === "false" ? false : true }`);
                            }
                            return(
                                <Container fluid>
                                    <Row>
                                        <Col style={{ padding: '0px' }}>
                                            <Tab.Container id="DailyLogTabs" defaultActiveKey="CrewOnBoardTab">
                                                <Row>
                                                    <Col xs={2} className="VesselReportTabs">
                                                    <Nav variant="pills" className="flex-column">
                                                        <Nav.Item>
                                                            <Nav.Link eventKey="CrewOnBoardTab">Acknowledgements</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link eventKey="EngineRunningHoursTab">Engine Running Hours</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link eventKey="ConsumablesROBTab">Consumables ROB</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link eventKey="TankSoundingsTab">Tank Soundings</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link eventKey="ActivitiesRemarksTab">Deck Dept. Activities / Remarks</Nav.Link>
                                                        </Nav.Item>
                                                    </Nav>
                                                    </Col>
                                                    <Col xs={10} className="VesselReportContent">
                                                    <Tab.Content>
                                                        <Tab.Pane eventKey="CrewOnBoardTab">
                                                            <DailyLogAcknowledgement handleChange={handleChange} touched={touched} errors={errors}
                                                                chiefEngineer={{unlock: unlockChiefEngineerSignature, ack:'chiefEngineer', value: values.chiefEngineer}} 
                                                                captain={{unlock: unlockCaptainSignature, ack:'captain', value: values.captain}}
                                                                saveForm={saveForm}
                                                                submit={handleSubmit}
                                                                validateForm={validateForm}
                                                                setTouched={setTouched}
                                                                saved={values.saved}
                                                                isSubmit={this.state.isSubmit}
                                                                webUrl={JSON.parse(this.props.match.params.backdated)}
                                                                reportDate={this.state.reportDate}
                                                            />
                                                        </Tab.Pane>
                                                        <Tab.Pane eventKey="EngineRunningHoursTab">
                                                            <EnginesRunningHours engines={values.engines} generators={values.generators} LNGProperties={this.props.DailyLog.LNGProperties} handleChange={handleChange} setFieldValue={setFieldValue} saveForm={saveForm} touched={touched} errors={errors} saved={values.saved} isSubmit={this.state.isSubmit} webUrl={JSON.parse(this.props.match.params.backdated)} />
                                                        </Tab.Pane>
                                                        <Tab.Pane eventKey="ConsumablesROBTab">
                                                            <ConsumableROB handleChange={handleChange} 
                                                            vesselName= {values.vesselName}
                                                            data={values.rob}
                                                            saved={values.saved}
                                                            saveForm={saveForm} touched={touched} errors={errors} isSubmit={this.state.isSubmit} webUrl={JSON.parse(this.props.match.params.backdated)}/>
                                                        </Tab.Pane>
                                                        <Tab.Pane eventKey="TankSoundingsTab">
                                                            <TankSurroundings handleChange={handleChange} 
                                                            vesselName= {values.vesselName}
                                                            data={values.tanksoundings}
                                                            saved={values.saved}
                                                            saveForm={saveForm}
                                                            touched={touched} errors={errors} isSubmit={this.state.isSubmit} webUrl={JSON.parse(this.props.match.params.backdated)}
                                                        />
                                                        </Tab.Pane>
                                                        <Tab.Pane eventKey="ActivitiesRemarksTab">
                                                            <ActivitiesRemarks dailyLog={true} data={values.remark}  handleChange={handleChange} saveForm={saveForm} saved={values.saved} isSubmit={this.state.isSubmit} webUrl={JSON.parse(this.props.match.params.backdated)}/>
                                                        </Tab.Pane>
                                                    </Tab.Content>
                                                    </Col>
                                                </Row>
                                            </Tab.Container>
                                        </Col>
                                    </Row>
                                </Container>
                            ) 
                        }}
                    </Formik>
                    </React.Fragment>
                    :
                    <FullScreenSpinner text={this.state.isSubmit===true?"Submitting...":"Loading..."}/>
                }
            </React.Fragment>
        );
    }
}

export default withLayoutManager(withDailyLog(withMessageManager(DailyLogEditForm)));