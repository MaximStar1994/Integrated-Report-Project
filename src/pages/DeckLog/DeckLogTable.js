import React from 'react'
import { Container, Row, Col, Card, FormControl, Button, Form, Spinner } from 'react-bootstrap'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableFooter, TableRow, Paper } from '@material-ui/core';

import { withRouter } from "react-router-dom"
import { Formik } from "formik";
import * as Yup from "yup";
import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'
import { withAuthManager } from '../../Helper/Auth/auth'
import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner'
import moment from 'moment-timezone';
import SignatureCanvas from 'react-signature-canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faEdit, faFilePdf } from '@fortawesome/free-solid-svg-icons';

import DeckLogInput from './DeckLogInput';
import { GeneralInfoList, HourlyEntriesList, FourHourlyEntriesList, AdditionalEntriesAtNoonList, OnceInADayList, AdditionalColumnForDailyMiscellaneousEntriesList, FireAndSafetyRounds_UMSList, hourlyIntervalsList, fourHourlyIntervalsList } from './DeckLogData';

import DeckLog from '../../model/DeckLog'
import './DeckLog.css'
import config from '../../config/config';
import watermark from '../../assets/VesselCare-Lite_logo/0x/logo.png'

const berthOrAnchorage = {
    lyingHour: '',
    totalLyingHour: '',
    shipClockAhDOrBK: { h: '', m: '' },
    shipClockTotal: { h: '', m: '' },
    shipClockRemain: { h: '', m: '' },
    hrsDiffFromUTC: { prefix: '', h: '', m: '' }
}

const totalUpToDate = {
    hoursUnderwaySeaSteaming: '',
    hoursUnderwayStopEtc: '',
    hoursUnderwayHrSteaming: '',
    distanceRunSeaSteaming: '',
    distanceRunHrSteaming: '',
    seaSteamingAvgSpeed: '',
    sunrise: '',
    sunset: '',
}
    
let generalInfoTemplate = {};
let hourlyEntriesTemplate = {};
let fourHourlyTemplate = {};
let CONAndWatchChangeOverTimeAndOfficerDetailsTemplate = {};
let TestingOfPropulsionAndSteeringTemplate = {};
let Gyro_MagneticTemplate = {};
let TimingRelatedToMomentOfVesselTemplate = {};
let BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignatureTemplate = {};
let onceInADayTemplate = {};
let additionalEntriesAtNoonTemplate = {};
let weeklyAndMonthlyInspectionAndTestingOfLSAEquipmentTemplate = {};
let entriesOfVariousDrillsAndTrainingsTemplate = {};
let resultsOfPreArrivalCargoChecksAndTestsTemplate = {};
let recordsOfVariousMeetingCarriedOutTemplate = {};
let fireAndSafetyRoundsTemplate = {}
let UMSTemplate = {}

const dataSet = {
    chiefOfficer: '',
    captain: '',
    from: '',
    to: '',
    lyingAt: '',
    logs: {
        general: [],
        hourly: [],
        fourHourly: [],
        fourHourlyHeader: {},
        CONAndWatchChangeOverTimeAndOfficerDetails: [],
        TestingOfPropulsionAndSteering: [],
        Gyro_Magnetic: [],
        TimingRelatedToMomentOfVessel: [],
        BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature: [],
        noon: {},
        daily: {},
        additionalCol: [],
        weeklyAndMonthlyInspectionAndTestingOfLSAEquipment: [],
        entriesOfVariousDrillsAndTrainings: [],
        resultsOfPreArrivalCargoChecksAndTests: [],
        recordsOfVariousMeetingCarriedOut: [],
        saved: {
            general: false,
            hourly: false,
            fourHourly: false,
            daily: false,
            noon: false,
            additionalCol: false
        }
        // additionalColumnForDailyMiscellaneousEntries: [],
        // berthOrAnchorage: {...berthOrAnchorage},
        // totalUpToDate: {...totalUpToDate},
        // fireAndSafetyRounds: [],
        // UMS: [],
    }
}

class DeckLogTable extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loaded: false,
            todayDate: '',
            canSubmit: false,
            isSubmit: false,
            pastLogs: [],
            from: '',
            to: '',
            lyingAt: '',
            captainSignAllowed: false,
            captainPassword: '',
            captainPasswordError: '',
            chiefOfficerSignAllowed: false,
            chiefOfficerPassword: '',
            chiefOfficerPasswordError: '',
            ...dataSet
        };
        this.chiefOfficerCanvas = null
        this.captainCanvas = null
        this.validationSchema = Yup.object().shape({
            chiefOfficer: Yup.string().required('Please input Chief Officer\'s Name'),
            captain: Yup.string().required('Please input Captain\'s Name'),
        });
        this.labelProps={style : {color : "white"}}

        this.DeckLogApi = new DeckLog();
        this.timezone = this.DeckLogApi.timezone
    }

    savedDeckLogToDisplayDeckLog = deckLog => {
        let returnData = {};
        returnData.general = deckLog.general;
        returnData.hourly = deckLog.hourly;
        returnData.Gyro_Magnetic = deckLog.Gyro_Magnetic;
        returnData.noon = deckLog.noon;
        returnData.daily = deckLog.daily;
        returnData.saved = deckLog.saved;
        returnData.fourHourly = [];
        returnData.fourHourlyHeader = {
            CONAndWatchChangeOverTimeAndOfficerDetails: {},
            TestingOfPropulsionAndSteering: {},
            TimingRelatedToMomentOfVessel: {},
        };
        returnData.CONAndWatchChangeOverTimeAndOfficerDetails = [];
        returnData.TestingOfPropulsionAndSteering = [];
        returnData.Gyro_Magnetic = [];
        returnData.TimingRelatedToMomentOfVessel = [];
        returnData.BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature = [];
        returnData.additionalCol = [];
        returnData.weeklyAndMonthlyInspectionAndTestingOfLSAEquipment = [];
        returnData.entriesOfVariousDrillsAndTrainings = [];
        returnData.resultsOfPreArrivalCargoChecksAndTests = [];
        returnData.recordsOfVariousMeetingCarriedOut = [];
        // let temp = deckLog.fourHourly.filter(data => data.name==="CONAndWatchChangeOverTimeAndOfficerDetails")[0];
        // for(let x of temp.info){
        //     returnData.CONAndWatchChangeOverTimeAndOfficerDetails.push({...x.info, timeInterval: x.timeInterval});
        // }
        let temp = deckLog.fourHourly.filter(data => data.name==="CONAndWatchChangeOverTimeAndOfficerDetails")[0];
        for(let x of temp.info){
            let temp2 = {}, i = 0;
            for(let [key, value] of Object.entries(x.info)){
                temp2[`column_${i+1}`] = value;
                returnData.fourHourlyHeader.CONAndWatchChangeOverTimeAndOfficerDetails[`column_${i+1}`] = temp.headers[i];
                i++;
            }
            returnData.CONAndWatchChangeOverTimeAndOfficerDetails.push({...temp2, timeInterval: x.timeInterval});
        }
        temp = deckLog.fourHourly.filter(data => data.name==="TestingOfPropulsionAndSteering")[0];
        for(let x of temp.info){
            let temp2 = {}, i = 0;
            for(let [key, value] of Object.entries(x.info)){
                temp2[`column_${i+1}`] = value;
                returnData.fourHourlyHeader.TestingOfPropulsionAndSteering[`column_${i+1}`] = temp.headers[i];
                i++;
            }
            returnData.TestingOfPropulsionAndSteering.push({...temp2, timeInterval: x.timeInterval});
        }
        temp = deckLog.fourHourly.filter(data => data.name==="Gyro_Magnetic")[0];
        for(let x of temp.info){
            returnData.Gyro_Magnetic.push({...x.info, timeInterval: x.timeInterval});
        }
        temp = deckLog.fourHourly.filter(data => data.name==="TimingRelatedToMomentOfVessel")[0];
        for(let x of temp.info){
            let temp2 = {}, i = 0;
            for(let [key, value] of Object.entries(x.info)){
                temp2[`column_${i+1}`] = value;
                returnData.fourHourlyHeader.TimingRelatedToMomentOfVessel[`column_${i+1}`] = temp.headers[i];
                i++;
            }
            returnData.TimingRelatedToMomentOfVessel.push({...temp2, timeInterval: x.timeInterval});
        }
        temp = deckLog.fourHourly.filter(data => data.name==="BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature")[0];
        for(let x of temp.info){
            returnData.BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature.push({...x.info, timeInterval: x.timeInterval});
        }

        temp = deckLog.additionalCol.filter(data => data.name==="weeklyAndMonthlyInspectionAndTestingOfLSAEquipment")[0];
        if(temp){
            for(let x of temp.info){
                let temp2 = {}, i = 1;
                for(let [key, value] of Object.entries(x.info)){
                    temp2[`column_${i}`] = value;
                    i++;
                }
                returnData.weeklyAndMonthlyInspectionAndTestingOfLSAEquipment.push({...temp2, timeInterval: x.timeInterval});
            }
        }
        temp = deckLog.additionalCol.filter(data => data.name==="entriesOfVariousDrillsAndTrainings")[0];
        if(temp){
            for(let x of temp.info){
                let temp2 = {}, i = 1;
                for(let [key, value] of Object.entries(x.info)){
                    temp2[`column_${i}`] = value;
                    i++;
                }
                returnData.entriesOfVariousDrillsAndTrainings.push({...temp2, timeInterval: x.timeInterval});
            }
        }
        temp = deckLog.additionalCol.filter(data => data.name==="resultsOfPreArrivalCargoChecksAndTests")[0];
        if(temp){
            for(let x of temp.info){
                let temp2 = {}, i = 1;
                for(let [key, value] of Object.entries(x.info)){
                    temp2[`column_${i}`] = value;
                    i++;
                }
                returnData.resultsOfPreArrivalCargoChecksAndTests.push({...temp2, timeInterval: x.timeInterval});
            }
        }
        temp = deckLog.additionalCol.filter(data => data.name==="recordsOfVariousMeetingCarriedOut")[0];
        if(temp){
            for(let x of temp.info){
                let temp2 = {}, i = 1;
                for(let [key, value] of Object.entries(x.info)){
                    temp2[`column_${i}`] = value;
                    i++;
                }
                returnData.recordsOfVariousMeetingCarriedOut.push({...temp2, timeInterval: x.timeInterval});
            }
        }
        return returnData;
    }

    DeckLogStart = () => {
        this.setState({ canSubmit: true, loaded: true });
        this.DeckLogApi.CanViewDeckLogPage((value, error) => {
            if(value===true||value==="true"){
                this.DeckLogApi.CanSubmitDeckLog((canSubmit,err) => {
                    console.log("can submit decklog ? ",canSubmit);
                    this.setState({ canSubmit: canSubmit });
                })
                this.DeckLogApi.ForceSyncDeckLog((deckLogs,err) => {
                    this.DeckLogApi.GetOpenDeckLog((data)=> {
                        let tempData = { 
                            logs: data&&moment(data.generatedDate).format('DD/MM/YYYY')===moment().format('DD/MM/YYYY')?{...this.savedDeckLogToDisplayDeckLog(data)}:this.state.logs, 
                            loaded: true, 
                            todayDate: moment().format() 
                        };
                        if(!data){
                            tempData.logs.saved = {
                                general: false,
                                hourly: false,
                                fourHourly: false,
                                daily: false,
                                noon: false,
                                additionalCol: false
                            }
                        }
                        this.setState({...tempData });
                        this.DeckLogApi.ListDeckLog((eLogs,err) => {
                            console.log("Past elogs ",eLogs)
                            this.setState({ pastLogs: eLogs });
                        })
                    });
                })
            }
            else{
                this.props.setMessages([{type : "danger", message : "Another device is currently in use!"}]);
                this.props.history.push(`/operation`)
            }
        })
    }
    constructTemplates = () => {
        let temp = [];
        for (const key of GeneralInfoList) {
            temp = temp.concat([...GeneralInfoList]);
        }
        generalInfoTemplate = temp.reduce((a,b)=> (a[b]='',a),{});

        temp = [];
        for (const [key, value] of Object.entries(HourlyEntriesList)) {
            temp = temp.concat([...HourlyEntriesList[key]]);
        }
        hourlyEntriesTemplate = temp.reduce((a,b)=> (a[b]='',a),{});

        temp = [];
        for (const key of FourHourlyEntriesList.CONAndWatchChangeOverTimeAndOfficerDetails) {
            temp = temp.concat(key);
        }
        CONAndWatchChangeOverTimeAndOfficerDetailsTemplate = temp.reduce((a,b)=> (a[b]='',a),{});

        temp = [];
        for (const key of FourHourlyEntriesList.TestingOfPropulsionAndSteering) {
            temp = temp.concat(key);
        }
        TestingOfPropulsionAndSteeringTemplate = temp.reduce((a,b)=> (a[b]='',a),{});

        temp = [];
        for (const key of FourHourlyEntriesList.Gyro_Magnetic) {
            temp = temp.concat(key);
        }
        Gyro_MagneticTemplate = temp.reduce((a,b)=> (a[b]='',a),{});

        temp = [];
        for (const key of FourHourlyEntriesList.TimingRelatedToMomentOfVessel) {
            temp = temp.concat(key);
        }
        TimingRelatedToMomentOfVesselTemplate = temp.reduce((a,b)=> (a[b]='',a),{});

        temp = [];
        for (const key of FourHourlyEntriesList.BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature) {
            temp = temp.concat(key);
        }
        BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignatureTemplate = temp.reduce((a,b)=> (a[b]='',a),{});

        // temp = [];
        // for (const [key, value] of Object.entries(FourHourlyEntriesList)) {
        //     temp = temp.concat([...FourHourlyEntriesList[key]]);
        // }
        // fourHourlyTemplate = temp.reduce((a,b)=> (a[b]='',a),{});

        // temp = {};
        // temp.CONAndWatchChangeOverTimeAndOfficerDetails = FourHourlyEntriesList.CONAndWatchChangeOverTimeAndOfficerDetails.reduce((a,b)=> (a[b]='',a),{});
        // temp.TestingOfPropulsionAndSteering = FourHourlyEntriesList.TestingOfPropulsionAndSteering.reduce((a,b)=> (a[b]='',a),{});
        // temp.TimingRelatedToMomentOfVessel = FourHourlyEntriesList.TimingRelatedToMomentOfVessel.reduce((a,b)=> (a[b]='',a),{});
        // let temp2 = this.state.logs;
        // temp2.fourHourlyHeader = temp;
        // this.setState({ logs: temp2 });

        temp = [];
        for (const key of AdditionalEntriesAtNoonList) {
            temp = temp.concat([...AdditionalEntriesAtNoonList]);
        }
        additionalEntriesAtNoonTemplate = temp.reduce((a,b)=> (a[b]='',a),{});

        // temp = [];
        // for (const [key, value] of Object.entries(OnceInADayList)) {
        //     temp = temp.concat([...OnceInADayList[key]]);
        // }
        // onceInADayTemplate = temp.reduce((a,b)=> (a[b]='',a),{});
        onceInADayTemplate = {...OnceInADayList};

        temp = [];
        for (const key of AdditionalColumnForDailyMiscellaneousEntriesList.WeeklyAndMonthlyInspectionAndTestingOfLSAEquipment) {
            temp = temp.concat(key);
        }
        weeklyAndMonthlyInspectionAndTestingOfLSAEquipmentTemplate = temp.reduce((a,b)=> (a[b]='',a),{});

        temp = [];
        for (const key of AdditionalColumnForDailyMiscellaneousEntriesList.EntriesOfVariousDrillsAndTrainings) {
            temp = temp.concat(key);
        }
        entriesOfVariousDrillsAndTrainingsTemplate = temp.reduce((a,b)=> (a[b]='',a),{});

        temp = [];
        for (const key of AdditionalColumnForDailyMiscellaneousEntriesList.ResultsOfPreArrivalCargoChecksAndTests) {
            temp = temp.concat(key);
        }
        resultsOfPreArrivalCargoChecksAndTestsTemplate = temp.reduce((a,b)=> (a[b]='',a),{});

        temp = [];
        for (const key of AdditionalColumnForDailyMiscellaneousEntriesList.RecordsOfVariousMeetingCarriedOut) {
            temp = temp.concat(key);
        }
        recordsOfVariousMeetingCarriedOutTemplate = temp.reduce((a,b)=> (a[b]='',a),{});
        
        temp = [];
        for (const key of FireAndSafetyRounds_UMSList.FireAndSafetyRound) {
            temp = temp.concat(key);
        }
        fireAndSafetyRoundsTemplate = temp.reduce((a,b)=> (a[b]='',a),{});

        temp = [];
        for (const key of FireAndSafetyRounds_UMSList.UMS) {
            temp = temp.concat(key);
        }
        UMSTemplate = temp.reduce((a,b)=> (a[b]='',a),{});
    }
    // DeckLogStart = () => {
    //     this.setState({ canSubmit: true, loaded: true, todayDate: moment().format() });
    // }
    componentDidMount(){
        this.constructTemplates();
        let tempLogs = (this.state.logs);
        tempLogs.noon = {...additionalEntriesAtNoonTemplate};
        tempLogs.daily = {...onceInADayTemplate};
        let temp = [];
        for (const [key, value] of Object.entries(hourlyIntervalsList)) {
            temp.push({...hourlyEntriesTemplate, timeInterval: parseInt(key)});
        }
        tempLogs.hourly = temp;

        temp = [];
        for (const [key, value] of Object.entries(fourHourlyIntervalsList)) {
            temp.push({...CONAndWatchChangeOverTimeAndOfficerDetailsTemplate, timeInterval: parseInt(key)});
        }
        tempLogs.CONAndWatchChangeOverTimeAndOfficerDetails = temp;
        temp = [];
        for (const [key, value] of Object.entries(fourHourlyIntervalsList)) {
            temp.push({...TestingOfPropulsionAndSteeringTemplate, timeInterval: parseInt(key)});
        }
        tempLogs.TestingOfPropulsionAndSteering = temp;
        temp = [];
        for (const [key, value] of Object.entries(fourHourlyIntervalsList)) {
            temp.push({...Gyro_MagneticTemplate, timeInterval: parseInt(key)});
        }
        tempLogs.Gyro_Magnetic = temp;
        temp = [];
        for (const [key, value] of Object.entries(fourHourlyIntervalsList)) {
            temp.push({...TimingRelatedToMomentOfVesselTemplate, timeInterval: parseInt(key)});
        }
        tempLogs.TimingRelatedToMomentOfVessel = temp;
        temp = [];
        for (const [key, value] of Object.entries(fourHourlyIntervalsList)) {
            temp.push({...BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignatureTemplate, timeInterval: parseInt(key)});
        }
        tempLogs.BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature = temp;

        temp = {};
        temp.CONAndWatchChangeOverTimeAndOfficerDetails = FourHourlyEntriesList.CONAndWatchChangeOverTimeAndOfficerDetails.reduce((a,b)=> (a[b]='',a),{});
        temp.TestingOfPropulsionAndSteering = FourHourlyEntriesList.TestingOfPropulsionAndSteering.reduce((a,b)=> (a[b]='',a),{});
        temp.TimingRelatedToMomentOfVessel = FourHourlyEntriesList.TimingRelatedToMomentOfVessel.reduce((a,b)=> (a[b]='',a),{});
        tempLogs.fourHourlyHeader = temp;
        // tempLogs.fourHourly = [{...fourHourlyTemplate}, {...fourHourlyTemplate}, {...fourHourlyTemplate}, {...fourHourlyTemplate}, {...fourHourlyTemplate}, {...fourHourlyTemplate}];
        this.setState({ logs: tempLogs });
        this.DeckLogStart();
    }
    componentWillUnmount(){
        this.DeckLogApi.UnlockDeckLogPage((data, error) => {
            console.log(data, error);
        });
    }
    UnlockCaptainSignature = (value) =>{
        value==='Captain@987'?this.setState({ captainSignAllowed: true, captainPasswordError: ''}):this.setState({ captainSignAllowed: false, captainPasswordError: 'Invalid Password, Try Again!'});
    }
    UnlockChiefEngineerSignature = (value) => {
        value==='Chief@654'?this.setState({ chiefOfficerSignAllowed: true, chiefOfficerPasswordError: ''}):this.setState({ chiefOfficerSignAllowed: false, chiefOfficerPasswordError: 'Invalid Password, Try Again!'});
    }
    AddWaterMark = async (signatureCanvas) => {
        var cnvs = signatureCanvas.getCanvas()
        var ctx = cnvs.getContext("2d")
        var watermarkImg = new Image(cnvs.width, cnvs.height)
        var signature = new Image(cnvs.width, cnvs.height)
        watermarkImg.src = watermark
        signature.src = signatureCanvas.toDataURL('image/png')
        let myPromise = new Promise(function(myResolve, myReject) {
            var imagesLoaded = 0
            signature.onload = () => {
                imagesLoaded += 1
                if (imagesLoaded == 2) {
                    ctx.clearRect(0,0,cnvs.width, cnvs.height)
                    ctx.drawImage(watermarkImg,0,0,cnvs.width, cnvs.height)
                    ctx.drawImage(signature,0,0,cnvs.width, cnvs.height)
                    myResolve(signatureCanvas.toDataURL('image/png'))
                }
            }
            watermarkImg.onload = () => {
                imagesLoaded += 1
                if (imagesLoaded == 2) {
                    ctx.clearRect(0,0,cnvs.width, cnvs.height)
                    ctx.drawImage(watermarkImg,0,0,cnvs.width, cnvs.height)
                    ctx.drawImage(signature,0,0,cnvs.width, cnvs.height)
                    myResolve(signatureCanvas.toDataURL('image/png'))
                }
            }
        });
        return await myPromise
    }
    renderForm() {
        let init = { ...this.state };
        delete init.loaded;
        delete init.todayDate;
        delete init.canSubmit;
        delete init.isSubmit;
        delete init.captainSignAllowed;
        return (
            <Formik
            initialValues={init}
            validationSchema={this.validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                if(!this.chiefOfficerCanvas || !this.captainCanvas || this.chiefOfficerCanvas.isEmpty() || this.captainCanvas.isEmpty()){
                    this.props.setMessages([{type : "danger", message : "Signatures are mandatory to submit!"}]);
                    window.scrollTo(0,0);
                }
                else{
                    this.setState({ isSubmit: true });
                    this.DeckLogApi.GetOpenDeckLog(async (data)=> {
                        if(data&&moment(data.generatedDate).format('DD/MM/YYYY')===moment().format('DD/MM/YYYY')){
                            data.chiefOfficerSignature= await this.AddWaterMark(this.chiefOfficerCanvas)
                            data.captainSignature=await this.AddWaterMark(this.captainCanvas)
                            data.chiefOfficerName=values.chiefOfficer;
                            data.captainName=values.captain;
                            delete data.saved;
                            let temp = data.fourHourly.filter(data => data.name==="CONAndWatchChangeOverTimeAndOfficerDetails")[0];
                            for(let counter=0; counter<temp.headers.length; counter++){
                                if(temp.headers[counter]==="" || temp.headers[counter]===null){
                                    temp.headers[counter] = `column_${counter+1}`;
                                }
                            }
                            for(let x of temp.info){
                                let temp2={}
                                    temp2[`${temp.headers[0]}`] = x.info['column_1'];
                                    temp2[`${temp.headers[1]}`] = x.info['column_2'];
                                    temp2[`${temp.headers[2]}`] = x.info['column_3'];
                                    temp2[`${temp.headers[3]}`] = x.info['column_4'];
                                    temp2[`${temp.headers[4]}`] = x.info['column_5'];
                                    temp2[`${temp.headers[5]}`] = x.info['column_6'];
                                    temp2[`${temp.headers[6]}`] = x.info['column_7'];
                                    x.info=temp2;
                            }
                            temp = data.fourHourly.filter(data => data.name==="TestingOfPropulsionAndSteering")[0];
                            for(let counter=0; counter<temp.headers.length; counter++){
                                if(temp.headers[counter]==="" || temp.headers[counter]===null){
                                    temp.headers[counter] = `column_${counter+1}`;
                                }
                            }
                            for(let x of temp.info){
                                let temp2={}
                                    temp2[`${temp.headers[0]}`] = x.info['column_1'];
                                    temp2[`${temp.headers[1]}`] = x.info['column_2'];
                                    temp2[`${temp.headers[2]}`] = x.info['column_3'];
                                    temp2[`${temp.headers[3]}`] = x.info['column_4'];
                                    temp2[`${temp.headers[4]}`] = x.info['column_5'];
                                    temp2[`${temp.headers[5]}`] = x.info['column_6'];
                                    temp2[`${temp.headers[6]}`] = x.info['column_7'];
                                    x.info=temp2;
                            }
                            temp = data.fourHourly.filter(data => data.name==="TimingRelatedToMomentOfVessel")[0];
                            for(let counter=0; counter<temp.headers.length; counter++){
                                if(temp.headers[counter]==="" || temp.headers[counter]===null){
                                    temp.headers[counter] = `column_${counter+1}`;
                                }
                            }
                            for(let x of temp.info){
                                let temp2={}
                                    temp2[`${temp.headers[0]}`] = x.info['column_1'];
                                    temp2[`${temp.headers[1]}`] = x.info['column_2'];
                                    temp2[`${temp.headers[2]}`] = x.info['column_3'];
                                    temp2[`${temp.headers[3]}`] = x.info['column_4'];
                                    temp2[`${temp.headers[4]}`] = x.info['column_5'];
                                    temp2[`${temp.headers[5]}`] = x.info['column_6'];
                                    temp2[`${temp.headers[6]}`] = x.info['column_7'];
                                    x.info=temp2;
                            }
                            this.DeckLogApi.SaveDeckLogForToday(data,() => {
                                this.DeckLogApi.SubmitDeckLogForToday((data, err) =>{
                                    this.setState({ isSubmit: false });
                                    // if(!err){
                                        this.props.setMessages([{type : "success", message : "Submitted!"}])
                                        window.scrollTo(0,0);
                                        this.DeckLogStart();
                                        values.captain = "";
                                        values.chiefOfficer = "";
                                        this.captainCanvas.clear();
                                        this.chiefOfficerCanvas.clear();
                                        this.setState({ captainSignAllowed: false, captainPasswordError: '', chiefOfficerSignAllowed: false, chiefOfficerPasswordError: '' })
                                    // }
                                });
                            })
                        }
                        else{
                            this.props.setMessages([{type : "danger", message : "No data available to submit!"}]);
                            window.scrollTo(0,0);
                            this.setState({ isSubmit: false });
                        }    
                    });
                }
                setSubmitting(false)
            }}
            >
                {({values,errors,touched,handleChange,setFieldValue,handleSubmit,isSubmitting,setSubmitting})=> 
                ( 
                    <Form onSubmit={handleSubmit} className="mx-auto">
                        <input type="hidden" value="prayer" />
                        <Container>
                            <Row style={{ backgroundColor: '#032A39', padding: '20px' }}>
                                <Col>
                                    <Row style={{ backgroundColor: '#04384C', padding: '20px' }}>
                                        <Col>
                                            <Row style={{ color: '#067FAA', justifyContent: 'center', fontSize: '1.2em', paddingBottom: '15px' }}>
                                                <Col xs={9}>
                                                    <Row style={{ color: '#067FAA', justifyContent: 'center', fontSize: '1.2em', paddingBottom: '15px' }}>
                                                        {`DECK & BRIDGE LOG`}
                                                    </Row>
                                                    <Card style={{ border: '2px solid #067FAA', borderRadius: '15px', backgroundColor: 'rgba(0,0,0,0)' }}>
                                                        <Card.Body>
                                                            <Row>
                                                                <Col style={{ display: 'flex', alignItems: 'center', marginLeft: '15px', marginRight: '15px' }}>
                                                                    <span style={{ marginRight: 'auto', visibility: 'hidden' }}></span>
                                                                    <span style={{ fontSize: '1.6em' }}>{moment(this.state.todayDate).format('DD/MM/YYYY')}</span>
                                                                    <span style={{ marginLeft: 'auto' }}>
                                                                        <Button variant="contained" type={'submit'} color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', color: 'white', display: 'flex', alignItems: 'center' }} 
                                                                        disabled={!(this.state.canSubmit && !this.state.isSubmit && (this.state.logs.saved.general===true||this.state.logs.saved.hourly===true||this.state.logs.saved.fourHourly===true||this.state.logs.saved.daily===true||this.state.logs.saved.noon===true||this.state.logs.saved.additionalCol===true)) || !this.props.user.apps.includes(config.apps.OPERATION)}
                                                                        > 
                                                                            {this.state.isSubmit?<Spinner animation="border" variant="light" size='sm' />: ' '}    
                                                                            <span className="material-icons">send</span> 
                                                                            <span style={{ marginLeft: '5px' }}>Submit</span>
                                                                        </Button>
                                                                    </span>
                                                                </Col>
                                                            </Row>
                                                            
                                                            <div className='DeckLogLineHeading' />

                                                            <Row style={{ marginTop: '20px' }}>
                                                                <Col xs={4}>
                                                                    <div className='DeckLogTimeIntervals'>
                                                                        <span className='ButtonTextTimeInterval'>
                                                                        <Button variant="contained" color="primary" 
                                                                                className='EditButtonDeckLogTable' 
                                                                                disabled={!this.state.canSubmit || !this.props.user.apps.includes(config.apps.OPERATION)} 
                                                                                onClick={()=> {
                                                                                    if(this.props.user.apps.includes(config.apps.OPERATION)){
                                                                                        this.props.history.push({
                                                                                            pathname: `/decklogeditform`, 
                                                                                            state: {
                                                                                                todayDate: this.state.todayDate, 
                                                                                                log: this.state.logs,
                                                                                                title: 'General Info',
                                                                                                template: generalInfoTemplate
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }}>
                                                                                <FontAwesomeIcon icon={faEdit} size='lg'/> 
                                                                            </Button>
                                                                        </span>
                                                                        <span className='EditButtonTextDeckLogTable'>General Info</span>
                                                                        <span style={{ display: 'flex', flexGrow: '1' }}></span>
                                                                        <FontAwesomeIcon icon={faCircle} size={'sm'} style={this.state.logs.saved.general===true?{ color: '#66ff00' }: { color: '#067FAA' }} />
                                                                    </div>
                                                                </Col>
                                                                <Col xs={4}>
                                                                    <div className='DeckLogTimeIntervals'>
                                                                        <span className='ButtonTextTimeInterval'>
                                                                        <Button variant="contained" color="primary" 
                                                                                className='EditButtonDeckLogTable' 
                                                                                disabled={!this.state.canSubmit || !this.props.user.apps.includes(config.apps.OPERATION)} 
                                                                                onClick={()=> {
                                                                                    if(this.props.user.apps.includes(config.apps.OPERATION)){
                                                                                        this.props.history.push({
                                                                                            pathname: `/decklogeditform`, 
                                                                                            state: {
                                                                                                todayDate: this.state.todayDate, 
                                                                                                log: this.state.logs,
                                                                                                title: 'Hourly Entries',
                                                                                                template: hourlyEntriesTemplate
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }}>
                                                                                <FontAwesomeIcon icon={faEdit} size='lg'/> 
                                                                            </Button>
                                                                        </span>
                                                                        <span className='EditButtonTextDeckLogTable'>Hourly Entries</span>
                                                                        <span style={{ display: 'flex', flexGrow: '1' }}></span>
                                                                        <FontAwesomeIcon icon={faCircle} size={'sm'} style={this.state.logs.saved.hourly===true?{ color: '#66ff00' }: { color: '#067FAA' }} />
                                                                    </div>
                                                                </Col>
                                                                <Col xs={4}>
                                                                    <div className='DeckLogTimeIntervals'>
                                                                        <span className='ButtonTextTimeInterval'>
                                                                        <Button variant="contained" color="primary" 
                                                                                className='EditButtonDeckLogTable' 
                                                                                disabled={!this.state.canSubmit || !this.props.user.apps.includes(config.apps.OPERATION)} 
                                                                                onClick={()=> {
                                                                                    if(this.props.user.apps.includes(config.apps.OPERATION)){
                                                                                        this.props.history.push({
                                                                                            pathname: `/decklogeditform`, 
                                                                                            state: {
                                                                                                todayDate: this.state.todayDate, 
                                                                                                log: this.state.logs,
                                                                                                title: 'Four Hourly Entries',
                                                                                                template: null
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }}>
                                                                                <FontAwesomeIcon icon={faEdit} size='lg'/> 
                                                                            </Button>
                                                                        </span>
                                                                        <span className='EditButtonTextDeckLogTable'>Four Hourly Entries</span>
                                                                        <span style={{ display: 'flex', flexGrow: '1' }}></span>
                                                                        <FontAwesomeIcon icon={faCircle} size={'sm'} style={this.state.logs.saved.fourHourly===true?{ color: '#66ff00' }: { color: '#067FAA' }} />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row style={{ marginTop: '20px' }}>
                                                                <Col xs={4}>
                                                                    <div className='DeckLogTimeIntervals'>
                                                                        <span className='ButtonTextTimeInterval'>
                                                                        <Button variant="contained" color="primary" 
                                                                                className='EditButtonDeckLogTable' 
                                                                                disabled={!this.state.canSubmit || !this.props.user.apps.includes(config.apps.OPERATION)} 
                                                                                onClick={()=> {
                                                                                    if(this.props.user.apps.includes(config.apps.OPERATION)){    
                                                                                        this.props.history.push({
                                                                                            pathname: `/decklogeditform`, 
                                                                                            state: {
                                                                                                todayDate: this.state.todayDate, 
                                                                                                log: this.state.logs,
                                                                                                title: 'Additional Entries At Noon',
                                                                                                template: null
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }}>
                                                                                <FontAwesomeIcon icon={faEdit} size='lg'/> 
                                                                            </Button>
                                                                        </span>
                                                                        <span className='EditButtonTextDeckLogTable'>Additional Entries At Noon</span>
                                                                        <span style={{ display: 'flex', flexGrow: '1' }}></span>
                                                                        <FontAwesomeIcon icon={faCircle} size={'sm'} style={this.state.logs.saved.noon===true?{ color: '#66ff00' }: { color: '#067FAA' }} />
                                                                    </div>
                                                                </Col>
                                                                <Col xs={4}>
                                                                    <div className='DeckLogTimeIntervals'>
                                                                        <span className='ButtonTextTimeInterval'>
                                                                        <Button variant="contained" color="primary" 
                                                                                className='EditButtonDeckLogTable' 
                                                                                disabled={!this.state.canSubmit || !this.props.user.apps.includes(config.apps.OPERATION)} 
                                                                                onClick={()=> {
                                                                                    if(this.props.user.apps.includes(config.apps.OPERATION)){
                                                                                        this.props.history.push({
                                                                                            pathname: `/decklogeditform`, 
                                                                                            state: {
                                                                                                todayDate: this.state.todayDate, 
                                                                                                log: this.state.logs,
                                                                                                title: 'Once in 24 Hours',
                                                                                                template: null
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }}>
                                                                                <FontAwesomeIcon icon={faEdit} size='lg'/> 
                                                                            </Button>
                                                                        </span>
                                                                        <span className='EditButtonTextDeckLogTable'>Once in 24 Hours</span>
                                                                        <span style={{ display: 'flex', flexGrow: '1' }}></span>
                                                                        <FontAwesomeIcon icon={faCircle} size={'sm'} style={this.state.logs.saved.daily===true?{ color: '#66ff00' }: { color: '#067FAA' }} />
                                                                    </div>
                                                                </Col>
                                                                <Col xs={4}>
                                                                    <div className='DeckLogTimeIntervals'>
                                                                        <span className='ButtonTextTimeInterval'>
                                                                        <Button variant="contained" color="primary" 
                                                                                className='EditButtonDeckLogTable' 
                                                                                disabled={!this.state.canSubmit || !this.props.user.apps.includes(config.apps.OPERATION)} 
                                                                                onClick={()=> {
                                                                                    if(this.props.user.apps.includes(config.apps.OPERATION)){
                                                                                        this.props.history.push({
                                                                                            pathname: `/decklogeditform`, 
                                                                                            state: {
                                                                                                todayDate: this.state.todayDate, 
                                                                                                log: this.state.logs,
                                                                                                title: 'Additional Column For Daily Miscellaneous Entries',
                                                                                                template: {
                                                                                                    weeklyAndMonthlyInspectionAndTestingOfLSAEquipmentTemplate: weeklyAndMonthlyInspectionAndTestingOfLSAEquipmentTemplate,
                                                                                                    entriesOfVariousDrillsAndTrainingsTemplate: entriesOfVariousDrillsAndTrainingsTemplate,
                                                                                                    resultsOfPreArrivalCargoChecksAndTestsTemplate: resultsOfPreArrivalCargoChecksAndTestsTemplate,
                                                                                                    recordsOfVariousMeetingCarriedOutTemplate: recordsOfVariousMeetingCarriedOutTemplate
                                                                                                }
                                                                                                // template: additionalColumnForDailyMiscellaneousEntriesTemplate
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }}>
                                                                                <FontAwesomeIcon icon={faEdit} size='lg'/> 
                                                                            </Button>
                                                                        </span>
                                                                        <span className='EditButtonTextDeckLogTable'>Additional Column For Daily Miscellaneous Entries</span>
                                                                        <span style={{ display: 'flex', flexGrow: '1' }}></span>
                                                                        <FontAwesomeIcon icon={faCircle} size={'sm'} style={this.state.logs.saved.additionalCol===true?{ color: '#66ff00' }: { color: '#067FAA' }} />
                                                                    </div>
                                                                </Col>
                                                                {/* <Col xs={3}>
                                                                    <div className='DeckLogTimeIntervals'>
                                                                        <span className='ButtonTextTimeInterval'>
                                                                        <Button variant="contained" color="primary" 
                                                                                className='EditButtonDeckLogTable' 
                                                                                disabled={!this.state.canSubmit || !this.props.user.apps.includes(config.apps.OPERATION)} 
                                                                                onClick={()=> {
                                                                                    if(this.props.user.apps.includes(config.apps.OPERATION)){
                                                                                        this.props.history.push({
                                                                                            pathname: `/decklogeditform`, 
                                                                                            state: {
                                                                                                todayDate: this.state.todayDate, 
                                                                                                log: this.state.logs,
                                                                                                title: 'Total Up To Date',
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }}>
                                                                                <FontAwesomeIcon icon={faEdit} size='lg'/> 
                                                                            </Button>
                                                                        </span>
                                                                        <span className='EditButtonTextDeckLogTable'>Total Up To Date</span>
                                                                        <span style={{ display: 'flex', flexGrow: '1' }}></span>
                                                                        <FontAwesomeIcon icon={faCircle} size={'sm'} style={this.state.logIndication.totalUpToDate?{ color: '#66ff00' }: { color: '#067FAA' }} />
                                                                    </div>
                                                                </Col>
                                                                <Col xs={3}>
                                                                    <div className='DeckLogTimeIntervals'>
                                                                        <span className='ButtonTextTimeInterval'>
                                                                        <Button variant="contained" color="primary" 
                                                                                className='EditButtonDeckLogTable' 
                                                                                disabled={!this.state.canSubmit || !this.props.user.apps.includes(config.apps.OPERATION)} 
                                                                                onClick={()=> {
                                                                                    if(this.props.user.apps.includes(config.apps.OPERATION)){
                                                                                        this.props.history.push({
                                                                                            pathname: `/decklogeditform`, 
                                                                                            state: {
                                                                                                todayDate: this.state.todayDate, 
                                                                                                log: this.state.logs,
                                                                                                title: 'Berth Or Anchorage'
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }}>
                                                                                <FontAwesomeIcon icon={faEdit} size='lg'/> 
                                                                            </Button>
                                                                        </span>
                                                                        <span className='EditButtonTextDeckLogTable'>Berth Or Anchorage</span>
                                                                        <span style={{ display: 'flex', flexGrow: '1' }}></span>
                                                                        <FontAwesomeIcon icon={faCircle} size={'sm'} style={this.state.logIndication.berthOrAnchorage?{ color: '#66ff00' }: { color: '#067FAA' }} />
                                                                    </div>
                                                                </Col>
                                                                <Col xs={3}>
                                                                    <div className='DeckLogTimeIntervals'>
                                                                        <span className='ButtonTextTimeInterval'>
                                                                        <Button variant="contained" color="primary" 
                                                                                className='EditButtonDeckLogTable' 
                                                                                disabled={!this.state.canSubmit || !this.props.user.apps.includes(config.apps.OPERATION)} 
                                                                                onClick={()=> {
                                                                                    if(this.props.user.apps.includes(config.apps.OPERATION)){
                                                                                        this.props.history.push({
                                                                                            pathname: `/decklogeditform`, 
                                                                                            state: {
                                                                                                todayDate: this.state.todayDate, 
                                                                                                log: this.state.logs,
                                                                                                title: 'Fire and Safety Round, UMS',
                                                                                                template: {
                                                                                                    fireAndSafetyRoundsTemplate: fireAndSafetyRoundsTemplate,
                                                                                                    UMSTemplate: UMSTemplate
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }}>
                                                                                <FontAwesomeIcon icon={faEdit} size='lg'/> 
                                                                            </Button>
                                                                        </span>
                                                                        <span className='EditButtonTextDeckLogTable'>Fire and Safety Round, UMS</span>
                                                                        <span style={{ display: 'flex', flexGrow: '1' }}></span>
                                                                        <FontAwesomeIcon icon={faCircle} size={'sm'} style={this.state.logIndication.fireAndSafetyRound?{ color: '#66ff00' }: { color: '#067FAA' }} />
                                                                    </div>
                                                                </Col> */}
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col xs={3}>
                                                    <Paper style={{ width: '100%', backgroundColor: '#067FAA' }} >
                                                        <TableContainer >
                                                            <Table stickyHeader aria-label="sticky table" size={'small'}>
                                                                <TableHead style={{ backgroundColor: '#067FAA'}}>
                                                                    <TableRow>
                                                                        <TableCell style={{ backgroundColor: '#067FAA', color: '#fff', borderBottom: '3px solid #067FAA'  }} align="center"><span> Date </span></TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    
                                                                {this.state.pastLogs.slice(0, 5).map(row => (
                                                                    <TableRow hover  style={{ width: '100%', borderRadius: '15px' }}  tabIndex={-1} style={{ marginBottom: '55px' }} key={row.generatedDate}>
                                                                        <TableCell className='ReportsTable'  align="center"  onClick={()=> window.open(`${window.RIGCAREBACKENDURL}/${row.filePath}`, '_blank')}>
                                                                        <span style={{ color: 'rgb(4,102,255)', paddingRight: '10px' }}><FontAwesomeIcon icon={faFilePdf} /></span> <span style={{ color: '#fff' }}>{moment(row.generatedDate).tz(this.timezone).format('DD / MM / YYYY')}</span>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}  
                                                                </TableBody>
                                                                <TableFooter style={{ backgroundColor: '#067FAA'}}>
                                                                    <TableRow>
                                                                        <TableCell className='cursorPointer' style={{ backgroundColor: '#067FAA', color: '#fff', borderBottom: '3px solid #067FAA'  }} align="center" onClick={()=>{this.props.history.push('/operation/document')}}><span> {'MORE >>'} </span></TableCell>
                                                                    </TableRow>
                                                                </TableFooter>
                                                            </Table>
                                                        </TableContainer>
                                                    </Paper>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <Row>
                                                        <Col>
                                                            <Card style={{ border: '0px', backgroundColor: '#04384C', color: '#067FAA', padding: '5px' }}>
                                                                <Card.Header style={{ textAlign: 'center', border: '0px', backgroundColor: 'rgba(0,0,0,0)' }}>
                                                                    ACKNOWLEDGEMENTS
                                                                </Card.Header>
                                                                <Row>
                                                                    <Col xs={12} xl={6}>
                                                                        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px', paddingBottom: '20px'}}>
                                                                            <Card.Header style={{ border: '0px', color: '#067FAA', backgroundColor: '#032A39', textAlign: 'center', paddingBottom: '0px'}}>
                                                                                CHIEF OFFICER
                                                                            </Card.Header>
                                                                            <Card.Body style={{ border: '0px', paddingBottom: '0px' }}>
                                                                                <Row>
                                                                                    <Col  style={{ textAlign: 'center' }}>
                                                                                        <div style={{ textAlign: 'center', display: 'inline-flex', position: "relative", width: '400px', height: '100px'}}>
                                                                                            {this.state.chiefOfficerSignAllowed?
                                                                                            (
                                                                                            <div style={{ position: 'absolute', backgroundColor : "white"}}>
                                                                                                <SignatureCanvas 
                                                                                                canvasProps={{width: '400', height: '100'}}
                                                                                                ref={(ref) => { this.chiefOfficerCanvas = ref }}
                                                                                                />
                                                                                            </div>):
                                                                                            <div style={{ position: 'absolute', height: '100px', width: '400px', backgroundColor: 'rgba(28, 64, 76, 100)' }}>
                                                                                                <div style={{ paddingTop: '7px', paddingLeft: '40px', paddingRight: '40px' }}>
                                                                                                    <FormControl
                                                                                                        type="password"
                                                                                                        id='chiefOfficerPassword' 
                                                                                                        aria-describedby='chiefOfficerPassword' 
                                                                                                        value={values.chiefOfficerPassword}
                                                                                                        onChange={handleChange}
                                                                                                        name='chiefOfficerPassword'
                                                                                                        className={"ELogInputBox"}
                                                                                                        disabled={!this.state.canSubmit || !this.props.user.apps.includes(config.apps.OPERATION)}
                                                                                                        placeholder = 'PASSWORD'
                                                                                                        autoComplete="new-password"
                                                                                                    />
                                                                                                </div>
                                                                                                <div className={"ErrorMessage"}>
                                                                                                    {this.state.chiefOfficerPasswordError}
                                                                                                </div>
                                                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3px' }}>
                                                                                                    <Button variant="contained" color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', color: 'white', display: 'flex', alignItems: 'center', fontSize: '12px' }} disabled={!this.state.canSubmit || !this.props.user.apps.includes(config.apps.OPERATION)} onClick={()=>{this.UnlockChiefEngineerSignature(values.chiefOfficerPassword); values.chiefOfficerPassword=""}}>
                                                                                                        <span style={{ marginLeft: '5px' }}>Unlock</span>
                                                                                                    </Button>
                                                                                                </div>
                                                                                            </div>
                                                                                            }
                                                                                             {this.state.chiefOfficerSignAllowed?
                                                                                                <div style={{ position: "absolute", right: '0px' }}>
                                                                                                    <span className="material-icons"  onClick={()=>{this.chiefOfficerCanvas.clear()}}>
                                                                                                        settings_backup_restore
                                                                                                    </span>
                                                                                                    <span className="material-icons"  onClick={()=>{this.setState({chiefOfficerSignAllowed: false})}}>
                                                                                                        lock_open
                                                                                                    </span>
                                                                                                </div>:
                                                                                                <div style={{ position: "absolute", right: '0px' }}>
                                                                                                    <span className="material-icons">
                                                                                                        lock
                                                                                                    </span>
                                                                                                </div>
                                                                                            }
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>
                                                                                <Row style={{ margin: '10px', justifyContent: 'center', verticalAlign: 'center' }}>
                                                                                    <div style={{ width: '400px' }}>
                                                                                        <Row>
                                                                                            <Col xs={1}>
                                                                                            </Col>
                                                                                            <Col xs={3}>
                                                                                                Name
                                                                                            </Col>
                                                                                            <Col xs={6}>
                                                                                                    <FormControl
                                                                                                        type="text"
                                                                                                        id='chiefOfficer' 
                                                                                                        aria-describedby='chiefOfficer' 
                                                                                                        value={values.chiefOfficer}
                                                                                                        onChange={handleChange}
                                                                                                        name='chiefOfficer'
                                                                                                        className={(touched.chiefOfficer && errors.chiefOfficer) !==undefined? "ELogInputBoxError" : "ELogInputBox"}
                                                                                                        disabled={!this.state.canSubmit || !this.props.user.apps.includes(config.apps.OPERATION)} 
                                                                                                    />
                                                                                                    <div className={"ErrorMessage"}>
                                                                                                    {(touched.chiefOfficer && errors.chiefOfficer) !== undefined? touched.chiefOfficer && errors.chiefOfficer:<br/>}  
                                                                                                    </div>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </Col>

                                                                    <Col xs={12} xl={6}>
                                                                        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px', paddingBottom: '20px'}}>
                                                                            <Card.Header style={{ border: '0px', color: '#067FAA', backgroundColor: '#032A39', textAlign: 'center', paddingBottom: '0px'}}>
                                                                                CAPTAIN
                                                                            </Card.Header>
                                                                            <Card.Body style={{ border: '0px', paddingBottom: '0px' }}>
                                                                                <Row>
                                                                                    <Col  style={{ textAlign: 'center' }}>
                                                                                        <div style={{ textAlign: 'center', display: 'inline-flex', position: "relative", width: '400px', height: '100px'}}>
                                                                                            {this.state.captainSignAllowed?
                                                                                                (<div style={{ position: 'absolute',backgroundColor : "white"}}>
                                                                                                    <SignatureCanvas 
                                                                                                    canvasProps={{width: '400', height: '100'}}
                                                                                                    ref={(ref) => { this.captainCanvas = ref }}
                                                                                                    />
                                                                                                </div>):
                                                                                                <div style={{ position: 'absolute', height: '100px', width: '400px', backgroundColor: 'rgba(28, 64, 76, 100)' }}>
                                                                                                    <div style={{ paddingTop: '7px', paddingLeft: '40px', paddingRight: '40px' }}>
                                                                                                        <FormControl
                                                                                                            type="password"
                                                                                                            id='captainPassword' 
                                                                                                            aria-describedby='captainPassword' 
                                                                                                            value={values.captainPassword}
                                                                                                            onChange={handleChange}
                                                                                                            name='captainPassword'
                                                                                                            className={"DeckLogInputBox"}
                                                                                                            disabled={!this.state.canSubmit || !this.props.user.apps.includes(config.apps.OPERATION)}
                                                                                                            placeholder = 'PASSWORD'
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className={"ErrorMessage"}>
                                                                                                        {this.state.captainPasswordError}
                                                                                                    </div>
                                                                                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3px' }}>
                                                                                                        <Button variant="contained" color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', color: 'white', display: 'flex', alignItems: 'center', fontSize: '12px' }} disabled={!this.state.canSubmit || !this.props.user.apps.includes(config.apps.OPERATION)} onClick={()=>{this.UnlockCaptainSignature(values.captainPassword); values.captainPassword=""}}>
                                                                                                            <span style={{ marginLeft: '5px' }}>Unlock</span>
                                                                                                        </Button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            }
                                                                                            
                                                                                            
                                                                                            {this.state.captainSignAllowed?
                                                                                                <div style={{ position: "absolute", right: '0px' }}>
                                                                                                    <span className="material-icons"  onClick={()=>{this.captainCanvas.clear()}}>
                                                                                                        settings_backup_restore
                                                                                                    </span>
                                                                                                    <span className="material-icons"  onClick={()=>{this.setState({captainSignAllowed: false})}}>
                                                                                                        lock_open
                                                                                                    </span>
                                                                                                </div>:
                                                                                                <div style={{ position: "absolute", right: '0px' }}>
                                                                                                    <span className="material-icons">
                                                                                                        lock
                                                                                                    </span>
                                                                                                </div>
                                                                                            }
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>
                                                                                <Row style={{ margin: '10px', justifyContent: 'center', verticalAlign: 'center' }}>
                                                                                    <div style={{ width: '400px' }}>
                                                                                        <Row>
                                                                                            <Col xs={1}>
                                                                                            </Col>
                                                                                            <Col xs={3}>
                                                                                                Name
                                                                                            </Col>
                                                                                            <Col xs={6}>
                                                                                                <FormControl
                                                                                                    type="text"
                                                                                                    id='captain' 
                                                                                                    aria-describedby='captain' 
                                                                                                    value={values.captain}
                                                                                                    onChange={handleChange}
                                                                                                    name='captain'
                                                                                                    className={(touched.captain && errors.captain) !==undefined? "ELogInputBoxError" : "ELogInputBox"}
                                                                                                    disabled={!this.state.canSubmit || !this.props.user.apps.includes(config.apps.OPERATION)} 
                                                                                                />
                                                                                                <div className={"ErrorMessage"}>
                                                                                                    {(touched.captain && errors.captain) !== undefined? touched.captain && errors.captain:<br/>}  
                                                                                                </div>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>
                                                                                </Row>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </Col>
                                                                </Row>
                                                            </Card>
                                                        </Col>
                                                    </Row>    
                                                </Col>    
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                    </Form>)}
                </Formik>
                )

    }
    render() {
        if (this.props.user.loading) {
            return (<FullScreenSpinner />)
        }
        return(
            <div>
                {!this.state.loaded && <FullScreenSpinner />}
                {this.state.loaded && this.renderForm()}
            </div>
        );
    }
}

export default withRouter(withAuthManager(withMessageManager(withLayoutManager(DeckLogTable))));