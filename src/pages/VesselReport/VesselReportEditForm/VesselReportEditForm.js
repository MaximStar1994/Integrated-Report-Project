
import React, { Component } from 'react';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import { withLayoutManager } from '../../../Helper/Layout/layout';
import { withVesselReport } from '../VesselReportContext';
import './VesselReportEditForm.css';
import { Formik } from "formik";
import * as Yup from "yup";

import CrewOnBoard from './VesselReportItems/CrewOnBoard';
import DeckLogInfo from './VesselReportItems/DeckLogInfo';
import Engines from './VesselReportItems/Engines';
import AzimuthThruster from './VesselReportItems/AzimuthThruster';
import AirConditioning from './VesselReportItems/AirConditioning';
import ActivitiesRemarks from './VesselReportItems/ActivittiesRemarks';
import { MORNINGIDENTIFIER, VESSELREPORTTABLEIDENTIFIER } from './VesselReportFormStructure';
import AuthorizedBackDatedApi from "../../../model/AuthorizedBackDatedApi";

import FullScreenSpinner from '../../../components/FullScreenSpinner/FullScreenSpinner';
import { withMessageManager } from '../../../Helper/Message/MessageRenderer';
import deepCopy from '../../../Helper/GeneralFunc/deepCopy';
import config from '../../../config/config';
import moment from 'moment';

class VesselReportEditForm extends Component {
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
            allCrews: Yup.array().of(
                Yup.object().shape({
                    workingResting: Yup.number().required('Required*').nullable().positive('Required*')
                })
            ),
            // decklogs: Yup.array().of(
            //     Yup.object().shape({
            //         startLocation : Yup.string().required('Required*'),
            //         endLocation : Yup.string().required('Required*'),
            //         starttime : Yup.string().required('Required*').nullable(),
            //         endtime : Yup.string().required('Required*').nullable(),
            //         status : Yup.string().required('Required*'),
            //         typeOfJob : Yup.string().required('Required*'),
            //         tugPosition : Yup.string().required('Required*'),
            //         noOfTugs : Yup.number().required('Required*').nullable(),
            //     }),
            // ),
            engines: Yup.array().of(
                Yup.object().shape({
                    // carryForwardRunningHour : Yup.number().required("Required*").nullable(),
                    // runningHour : Yup.number().required("Required*").nullable(),
                    rpm : Yup.number().required("Required*").nullable(),
                    propellerRpm : Yup.number().required("Required*").nullable(),
                    cppPitch : Yup.number().required("Required*").nullable(),
                    fuelrack : Yup.string().required("Required*"),
                    lubOilPressure : Yup.number().required("Required*").nullable(),
                    freshwaterPressure : Yup.number().required("Required*").nullable(),
                    seawaterPressure : Yup.number().required("Required*").nullable(),
                    chargeAirPressure : Yup.number().required("Required*").nullable(),
                    turboChargerLubOilPressure : Yup.number().required("Required*").nullable(),
                    fuelOilPressure : Yup.number().required("Required*").nullable(),
                    lubOilTempBfCooler : Yup.number().required("Required*").nullable(),
                    lubOilTempAfCooler : Yup.number().required("Required*").nullable(),
                    freshwaterTempIn : Yup.number().required("Required*").nullable(),
                    freshwaterTempOut : Yup.number().required("Required*").nullable(),
                    seawaterTempIn : Yup.number().required("Required*").nullable(),
                    seawaterTempOut : Yup.number().required("Required*").nullable(),
                    turboChargerRpm : Yup.number().required("Required*").nullable(),
                    turboChargerExhaustTempIn : Yup.number().required("Required*").nullable(),
                    turboChargerExhaustTempOut : Yup.number().required("Required*").nullable(),
                    chargeAirTemp : Yup.number().required("Required*").nullable(),
                    cylinder1PeakPressure : Yup.number().required("Required*").nullable(),
                    cylinder1ExhaustTemp : Yup.number().required("Required*").nullable(),
                    cylinder2PeakPressure : Yup.number().required("Required*").nullable(),
                    cylinder2ExhaustTemp : Yup.number().required("Required*").nullable(),
                    cylinder3PeakPressure : Yup.number().required("Required*").nullable(),
                    cylinder3ExhaustTemp : Yup.number().required("Required*").nullable(),
                    cylinder4PeakPressure : Yup.number().required("Required*").nullable(),
                    cylinder4ExhaustTemp : Yup.number().required("Required*").nullable(),
                    cylinder5PeakPressure : Yup.number().required("Required*").nullable(),
                    cylinder5ExhaustTemp : Yup.number().required("Required*").nullable(),
                    cylinder6PeakPressure : Yup.number().required("Required*").nullable(),
                    cylinder6ExhaustTemp : Yup.number().required("Required*").nullable(),
                    cylinder7PeakPressure : Yup.number().required("Required*").nullable(),
                    cylinder7ExhaustTemp : Yup.number().required("Required*").nullable(),
                    cylinder8PeakPressure : Yup.number().required("Required*").nullable(),
                    cylinder8ExhaustTemp : Yup.number().required("Required*").nullable()
                })
            ),
            generators: Yup.array().of(
                Yup.object().shape({
                    // carryForwardRunningHour : Yup.number().required("Required*").nullable(),
                    // runningHour : Yup.number().required("Required*").nullable(),
                    voltage : Yup.number().required("Required*").nullable(),
                    frequency : Yup.number().required("Required*").nullable(),
                    current : Yup.number().required("Required*").nullable(),
                    power : Yup.number().required("Required*").nullable(),
                    foPressue : Yup.number().required("Required*").nullable(),
                    loPressure : Yup.number().required("Required*").nullable(),
                    loTemp : Yup.number().required("Required*").nullable(),
                    loLevel : Yup.string().required("Required*"),
                    coolingWaterTempIn : Yup.number().required("Required*").nullable(),
                    coolingWaterTempOut : Yup.number().required("Required*").nullable(), 
                    exhaustTemp : Yup.number().required("Required*").nullable(),
                })
            ),
            zpClutch: Yup.array().of(
                Yup.object().shape({
                    zpLoLevel : Yup.string().required('Required*'),
                    zpLoPressure : Yup.number().required('Required*').nullable().nullable(),
                    zpChargeOilPressure : Yup.number().required('Required*').nullable(),
                    zpLoTemp : Yup.number().required('Required*').nullable(),
                    zpHoLevel : Yup.string().required('Required*'),
                    zpHoTempIn : Yup.number().required('Required*').nullable(),
                    zpHoTempOut : Yup.number().required('Required*').nullable(),
                    clutchOilPressure : Yup.number().required('Required*').nullable(),
                })
            ),
            aircons: Yup.array().of(
                Yup.object().shape({
                    compressorCurrent : Yup.number().required('Required*').nullable(),
                    compressorSuctionPressure : Yup.number().required('Required*').nullable(), 
                    compressorDischargePressure : Yup.number().required('Required*').nullable(), 
                    loPressure : Yup.number().required('Required*').nullable(), 
                    coolingWaterPressure : Yup.number().required('Required*').nullable(),
                })
            ),
        });
    }
    componentDidMount() {
        this.props.getVesselReport(
          this.props.match.params.backdated,
          parseInt(this.props.match.params.shift),
          (reportstatus, message) => {
            if (reportstatus === false) {
              this.props.setMessages([{ type: "danger", message: message }]);
              this.props.history.push(`${VESSELREPORTTABLEIDENTIFIER}/${this.props.match.params.backdated === "false" ? false : true}`);
            }
          }
        );
      }

    componentWillUnmount(){
        this.props.resetVesselReport();
        this.props.unlockVesselReport();
    };

    render(){
        return (
            <React.Fragment>
                {this.props.VesselReportLoaded===true?
                    <React.Fragment>
                    <Formik
                    initialValues={{...this.state, 
                        ...this.props.VesselReport
                    }}
                    validationSchema={this.validationSchema}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        let temp = {};
                        this.props.updateSignatures();
                        values.captainSignature = this.props.VesselReport.captainSignature;
                        values.chiefEngineerSignature = this.props.VesselReport.chiefEngineerSignature;
                        // let tempStartTime = moment(values.decklogs[0].starttime);
                        // let tempEndTime = moment(values.decklogs[0].endtime);
                        if(values.captainSignature===null || values.chiefEngineerSignature===null){
                            this.props.setMessages([{type : "danger", message : "Signatures are mandatory to submit!"}]);
                            window.scrollTo(0,0);
                        }
                        // else if(tempEndTime.isBefore(tempStartTime)){
                        //     this.props.setMessages([{type : "danger", message : "End Time cannot be less than Start Time in Deck Log Info"}]);
                        //     window.scrollTo(0,0);
                        // }
                        else{
                            temp = deepCopy(values);
                            temp.captainName = temp.captain.name;
                            temp.chiefEngineerName = temp.chiefEngineer.name;
                            // temp.engines.forEach(engine => {
                            //     engine.totalRunningHour = engine.carryForwardRunningHour + engine.runningHour;
                            //     engine.totalLNGRunningHour = (engine.LNGcarryForwardRunningHour||0) + (engine.LNGrunningHour||0);
                            // });
                            // temp.generators.forEach(generator => {
                            //     generator.totalRunningHour = generator.carryForwardRunningHour + generator.runningHour;
                            // });
                            temp.crew.resting = [];
                            temp.crew.working = [];

                            temp.allCrews.forEach(element => {
                                if(element.workingResting===1){
                                    temp.crew.working.push({
                                        crewId: element.crewId,
                                        employeeNo: element.employeeNo,
                                        name: element.name,
                                        rank: element.rank,
                                        isWorking: 1
                                    })
                                }
                                else if(element.workingResting===2){
                                    temp.crew.resting.push({
                                        crewId: element.crewId,
                                        employeeNo: element.employeeNo,
                                        name: element.name,
                                        rank: element.rank,
                                        isWorking: 2
                                    })
                                }
                            })
                            // delete temp.chiefEngineer;
                            // delete temp.captain;
                            temp.chiefEngineer.password = ""
                            temp.chiefEngineer.passwordError = ""
                            temp.captain.password = ""
                            temp.captain.passwordError = ""
                            // temp.decklogs[0].starttime = tempStartTime.format();
                            // temp.decklogs[0].endtime = tempEndTime.format();
                            temp.is_backdated = this.state.is_backdated;
                            if(this.props.match.params.backdated === "true") {
                                temp.reportDate = this.state.reportDate;
                            }
                            try{
                                this.setState({ isSubmit: true });
                                await this.props.saveVesselReport(temp);
                                const submitValue = await this.props.submitVesselReport(temp.reportDate, temp.shift);
                                if (this.state.is_backdated) {
                                    //Authorized backdated db status update to complete
                                    let vesselId = JSON.parse(localStorage.getItem("user")).vessels[0].vesselId;
                                    var form = "";
                                    if ( parseInt(this.props.match.params.shift) === MORNINGIDENTIFIER) {
                                      form = "MORNINGSHIFT";
                                    } else {
                                      form = "EVENINGSHIFT";
                                    }
                                    await this.authorizedBackDatedApi.statusCompleteAuthorizedBackDatedData(vesselId, form, this.state.reportDate);
                                }

                                this.props.setMessages([{type : "success", message : "Submitted!"}]);
                                window.scrollTo(0,0);
                                this.props.history.push( `${VESSELREPORTTABLEIDENTIFIER}/${ this.props.match.params.backdated === "false" ? false : true }` );
                                this.setState({ isSubmit: false });
                            }
                            catch (err) {
                                console.log("Submit Error: ", err);
                                this.props.setMessages([{type : "danger", message : "Unable to submit Vessel Report Form! Try again later with Internet Connectivity!"}]);
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
                                values.captainSignature = this.props.VesselReport.captainSignature;
                                values.chiefEngineerSignature = this.props.VesselReport.chiefEngineerSignature;
                                values.saved = true;
                                await this.props.saveVesselReport(values);
                                this.props.history.push(`/vesselreport/${ this.props.match.params.backdated === "false" ? false : true }`);
                            }
                            return(
                                <Container fluid>
                                    <Row>
                                        <Col style={{ padding: '0px' }}>
                                            <Tab.Container id="VesselReportTabs" defaultActiveKey="CrewOnBoardTab">
                                                <Row>
                                                    <Col xs={2} className="VesselReportTabs">
                                                    <Nav variant="pills" className="flex-column">
                                                        <Nav.Item>
                                                            <Nav.Link eventKey="CrewOnBoardTab">Crew On Board</Nav.Link>
                                                        </Nav.Item>
                                                        {/* <Nav.Item>
                                                            <Nav.Link eventKey="DeckLogInfoTab">Deck Log Info</Nav.Link>
                                                        </Nav.Item> */}
                                                        <Nav.Item>
                                                            <Nav.Link eventKey="EnginesTab">Engines</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link eventKey="AzimuthThrusterTab">Azimuth Thruster</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link eventKey="AirConditioningTab">Air Conditioning</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link eventKey="ActivitiesRemarksTab">Engine Dept. Activities / Remarks</Nav.Link>
                                                        </Nav.Item>
                                                    </Nav>
                                                    </Col>
                                                    <Col xs={10} className="VesselReportContent">
                                                    <Tab.Content>
                                                        <Tab.Pane eventKey="CrewOnBoardTab">
                                                            <CrewOnBoard crewData={values.allCrews} handleChange={handleChange} touched={touched} errors={errors}
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
                                                        {/* <Tab.Pane eventKey="DeckLogInfoTab">
                                                            <DeckLogInfo data={values.decklogs[0]} handleChange={handleChange} setFieldValue={setFieldValue} saveForm={saveForm} touched={touched} errors={errors} saved={values.saved} isSubmit={this.state.isSubmit} webUrl={JSON.parse(this.props.match.params.backdated)}/>
                                                        </Tab.Pane> */}
                                                        <Tab.Pane eventKey="EnginesTab">
                                                            <Engines engines={values.engines} generators={values.generators} LNGProperties={this.props.VesselReport.LNGProperties} handleChange={handleChange} setFieldValue={setFieldValue} saveForm={saveForm} touched={touched} errors={errors} saved={values.saved} isSubmit={this.state.isSubmit} webUrl={JSON.parse(this.props.match.params.backdated)}/>
                                                        </Tab.Pane>
                                                        <Tab.Pane eventKey="AzimuthThrusterTab">
                                                            <AzimuthThruster data={values.zpClutch}  handleChange={handleChange} saveForm={saveForm} touched={touched} errors={errors} saved={values.saved} isSubmit={this.state.isSubmit} webUrl={JSON.parse(this.props.match.params.backdated)} />
                                                        </Tab.Pane>
                                                        <Tab.Pane eventKey="AirConditioningTab">
                                                            <AirConditioning data={values.aircons[0]}  handleChange={handleChange} saveForm={saveForm} touched={touched} errors={errors} saved={values.saved} isSubmit={this.state.isSubmit} webUrl={JSON.parse(this.props.match.params.backdated)} />
                                                        </Tab.Pane>
                                                        <Tab.Pane eventKey="ActivitiesRemarksTab">
                                                            <ActivitiesRemarks data={values.remark}  handleChange={handleChange} saveForm={saveForm} saved={values.saved} isSubmit={this.state.isSubmit} webUrl={JSON.parse(this.props.match.params.backdated)}/>
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

export default withLayoutManager(withVesselReport(withMessageManager(VesselReportEditForm)));