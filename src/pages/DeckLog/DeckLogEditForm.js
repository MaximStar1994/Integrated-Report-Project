import React, { Component } from 'react'
import { Row, Col, Form, Spinner} from 'react-bootstrap'
import { Button } from '@material-ui/core';

import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'
import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner'

import { withRouter } from "react-router-dom"
import { Formik } from "formik";
import * as Yup from "yup";
import moment from 'moment';
import './DeckLog.css'

import DeckLogGeneralInfo from './DeckLogGeneralInfo';
import DeckLogHourlyEntries from './DeckLogHourlyEntriesTemp';
import DeckLogFourHourlyEntries from './DeckLogFourHourlyEntriesTemp';
import DeckLogAdditionalEntriesAtNoonData from './DeckLogAdditionalEntriesAtNoonData';
import DeckLogOnceInADay from './DeckLogOnceInADay';
import DeckLogAdditionalColumns from './DeckLogAdditionalColumns';
import DeckLogBerthOrAnchorage from './DeckLogBerthOrAnchorage';
import DeckLogTotalUpToDate from './DeckLogTotalUpToDate';
import DeckLogFireAndSafetyRounds_UMS from './DeckLogFireAndSafetyRounds_UMS';

import DeckLog from '../../model/DeckLog';

class DeckLogEditForm extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            loaded: false,
            todayDate: '',
            showSaveSpinner: false,
            // ...dataSet
        };
        this.officerSignatureCanvases = [{}, {}, {}, {}, {}, {}];
        this.validationSchema = Yup.object().shape({});
        this.labelProps={style : {color : "white"}}
        this.DeckLogApi = new DeckLog();
    }
    componentDidMount() {
            let tempData = null
            tempData = {
                ...this.props.location.state.log,
                loaded: true,
                todayDate: this.props.location.state.todayDate,
                title: this.props.location.state.title,
                template: this.props.location.state.template
            };
        this.setState({ ...tempData });
    }
    setRef = (ref, idx) => {
        if(this.props?.location?.state?.log?.BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature[idx]?.officerSignature && ref){
            if(ref.isEmpty())
                ref.fromDataURL(this.props.location.state.log.BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature[idx].officerSignature);
        }
        this.officerSignatureCanvases[idx] = ref;
    }
    clearCanvas = idx => {
        this.officerSignatureCanvases[idx].clear();
    }
    checkForSaving = (data, title) => {
        console.log(data, title);
        if(title === "General Info"){
            if(data.general.length<=0)
                return false;
            else{
                for(let x of data.general){
                    if((x.infoFrom!==null && x.infoFrom!=="")||(x.infoTo!==null && x.infoTo!=="")||(x.lyingAt!==null && x.lyingAt!==""))
                        return true;
                }
                return false;
            }
        }
        else if(title==="Hourly Entries"){
            for(let x of data.hourly){
                if((x.lat!==null && x.lat!=="")||(x.lng!==null && x.lng!=="")||(x.trueCourse!==null && x.trueCourse!=="")||(x.gyro!==null && x.gyro!=="")||(x.mag!==null && x.mag!=="")||
                (x.windForce!==null && x.windForce!=="")||(x.windDirection!==null && x.windDirection!=="")||(x.seaCondition!==null && x.seaCondition!=="")||(x.visibility!==null && x.visibility!=="")||
                (x.swellDirection!==null && x.swellDirection!=="")||(x.swellHeight!==null && x.swellHeight!=="")||(x.dryTemp!==null && x.dryTemp!=="")||(x.wetTemp!==null && x.wetTemp!=="")||
                (x.barometricPressure!==null && x.barometricPressure!=="")||(x.engineRoomWatchStatus!==null && x.engineRoomWatchStatus!=="")||(x.courseAlteration!==null && x.courseAlteration!==""))
                    return true;
            }
            return false;
        }
        else if(title==="Four Hourly Entries"){
            for(let x of data.fourHourly){
                if(x.name==="Gyro_Magnetic"){
                    for(let y of x.info){
                        if((y.info.gyroError!==null&&y.info.gyroError!=="")||(y.info.magneticDeviation!==null&&y.info.magneticDeviation!=="")||(y.info.magneticVariation!==null&&y.info.magneticVariation!==""))
                            return true;
                    }
                }
                else if(x.name==="BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature"){
                    for(let y of x.info){
                        if((y.info.BNWAS!==null&&y.info.BNWAS!=="")||(y.info.bridgeWatchLevel!==null&&y.info.bridgeWatchLevel!=="")||(y.info.securityLevel!==null&&y.info.securityLevel!==""))
                            return true;
                    }
                }
                else {
                    for(let h of x.headers){
                        if(h!==null&&h!=="")
                            return true;
                    }
                    for(let y of x.info){
                        if((y.info.column_1!==null&&y.info.column_1!=="")||(y.info.column_2!==null&&y.info.column_2!=="")||(y.info.column_3!==null&&y.info.column_3!=="")||(y.info.column_4!==null&&y.info.column_4!=="")||(y.info.column_5!==null&&y.info.column_5!=="")||(y.info.column_6!==null&&y.info.column_6!=="")||(y.info.column_7!==null&&y.info.column_7!==""))
                            return true;
                    }
                }
            }
            return false;
        }
        else if(title==="Additional Entries At Noon"){
            if((data.noon.lat!==null && data.noon.lat!=="")||(data.noon.lng!==null && data.noon.lng!=="")||(data.noon.avgSpeed!==null && data.noon.avgSpeed!=="")||(data.noon.distanceRunSeaStreaming!==null && data.noon.distanceRunSeaStreaming!=="")||(data.noon.distanceRunHRStreaming!==null && data.noon.distanceRunHRStreaming!==""))
                return true;
            return false;
        }
        else if(title==="Once in 24 Hours"){
            if((data.daily.tank1.liquidTemp!==null && data.daily.tank1.liquidTemp!=="")||(data.daily.tank1.pressure!==null && data.daily.tank1.pressure!=="")||(data.daily.tank1.sounding!==null && data.daily.tank1.sounding!=="")||(data.daily.tank1.vaporTemp!==null && data.daily.tank1.vaporTemp!=="")||
            (data.daily.tank2.liquidTemp!==null && data.daily.tank2.liquidTemp!=="")||(data.daily.tank2.pressure!==null && data.daily.tank2.pressure!=="")||(data.daily.tank2.sounding!==null && data.daily.tank2.sounding!=="")||(data.daily.tank2.vaporTemp!==null && data.daily.tank2.vaporTemp!=="")||
            (data.daily.sounding.tank1c!==null && data.daily.sounding.tank1c!=="")||(data.daily.sounding.tank2p!==null && data.daily.sounding.tank2p!=="")||(data.daily.sounding.tank3p!==null && data.daily.sounding.tank3p!=="")||(data.daily.sounding.tank4p!==null && data.daily.sounding.tank4p!=="")||(data.daily.sounding.tank5p!==null && data.daily.sounding.tank5p!=="")||(data.daily.sounding.tank6p!==null && data.daily.sounding.tank6p!=="")||(data.daily.sounding.tank7p!==null && data.daily.sounding.tank7p!=="")||(data.daily.sounding.tank8p!==null && data.daily.sounding.tank8p!=="")||(data.daily.sounding.tank9p!==null && data.daily.sounding.tank9p!=="")||(data.daily.sounding.tank10p!==null && data.daily.sounding.tank10p!=="")||(data.daily.sounding.tank21p!==null && data.daily.sounding.tank21p!=="")||
            (data.daily.sounding.tank2s!==null && data.daily.sounding.tank2s!=="")||(data.daily.sounding.tank3s!==null && data.daily.sounding.tank3s!=="")||(data.daily.sounding.tank4s!==null && data.daily.sounding.tank4s!=="")||(data.daily.sounding.tank5s!==null && data.daily.sounding.tank5s!=="")||(data.daily.sounding.tank6s!==null && data.daily.sounding.tank6s!=="")||(data.daily.sounding.tank7s!==null && data.daily.sounding.tank7s!=="")||(data.daily.sounding.tank8s!==null && data.daily.sounding.tank8s!=="")||(data.daily.sounding.tank9s!==null && data.daily.sounding.tank9s!=="")||(data.daily.sounding.tank10s!==null && data.daily.sounding.tank10s!=="")||(data.daily.sounding.tank21s!==null && data.daily.sounding.tank21s!=="")||
            (data.daily.voidspaceSounding.tank1p!==null && data.daily.voidspaceSounding.tank1p!=="")||(data.daily.voidspaceSounding.tank1s!==null && data.daily.voidspaceSounding.tank1s!=="")||(data.daily.voidspaceSounding.tank4p!==null && data.daily.voidspaceSounding.tank4p!=="")||(data.daily.voidspaceSounding.tank4s!==null && data.daily.voidspaceSounding.tank4s!=="")||(data.daily.voidspaceSounding.tank5p!==null && data.daily.voidspaceSounding.tank5p!=="")||(data.daily.voidspaceSounding.tank5s!==null && data.daily.voidspaceSounding.tank5s!=="")||(data.daily.voidspaceSounding.tank6c!==null && data.daily.voidspaceSounding.tank6c!=="")||
            (data.daily.draft.arrivalAft!==null && data.daily.draft.arrivalAft!=="")||(data.daily.draft.arrivalForward!==null && data.daily.draft.arrivalForward!=="")||(data.daily.draft.sailingAft!==null && data.daily.draft.sailingAft!=="")||(data.daily.draft.sailingForward!==null && data.daily.draft.sailingForward!==""))
                return true;
            return false;
        }
        else if(title==="Additional Column For Daily Miscellaneous Entries"){
            console.log(data.additionalCol.length);
            if(data.additionalCol.length<=0)
                return false;
            else{
                for(let x of data.additionalCol){
                    for(let y of x.info){
                        if((y.info.column_1!==null && y.info.column_1!=="")||(y.info.column_2!==null && y.info.column_2!=="")||(y.info.column_3!==null && y.info.column_3!=="")||(y.info.column_4!==null && y.info.column_4!=="")||(y.info.column_5!==null && y.info.column_5!=="")||(y.info.column_6!==null && y.info.column_6!=="")||(y.info.column_7!==null && y.info.column_7!==""))
                            return true;
                    }
                }
                return false;
            }
        }

    }
    checkFourHourlyHeading = (data, title) => {
        if(title==="Four Hourly Entries"){
            for(let x of data.fourHourly){
                if(x.name!=="Gyro_Magnetic" && x.name!=="BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature"){
                    for(let i=0; i<x.headers.length; i++){
                        for(let j=i+1; j<x.headers.length; j++){
                            if(x.headers[i]!==null && x.headers[i]!=="" && x.headers[j]!==null && x.headers[j]!=="" && x.headers[i]===x.headers[j])
                                return `Headers cannot be duplicate for ${x.name}`;
                        }   
                    }
                }
            }
            return true;
        }
        else{
            return true;
        }

    }

    renderForm() {
        let init = { ...this.state };
        delete init.loaded;
        delete init.todayDate;
        delete init.showSaveSpinner;

        return (
            <Formik
            initialValues={init}
            validationSchema={this.validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                values.fourHourly=[];
                values.additionalCol =[];
                let fourHourlyInfo=[];
                for(let x of values.CONAndWatchChangeOverTimeAndOfficerDetails){
                    let temp = {}
                    temp['column_1'] = x.column_1;
                    temp['column_2'] = x.column_2;
                    temp['column_3'] = x.column_3;
                    temp['column_4'] = x.column_4;
                    temp['column_5'] = x.column_5;
                    temp['column_6'] = x.column_6;
                    temp['column_7'] = x.column_7;
                    fourHourlyInfo.push({timeInterval: x.timeInterval, info: temp});
                };
                
                values.fourHourly.push({name: 'CONAndWatchChangeOverTimeAndOfficerDetails', headers: Object.values(values.fourHourlyHeader.CONAndWatchChangeOverTimeAndOfficerDetails), info: fourHourlyInfo});

                fourHourlyInfo=[];
                for(let x of values.TestingOfPropulsionAndSteering){
                    let temp = {}
                    temp['column_1'] = x.column_1;
                    temp['column_2'] = x.column_2;
                    temp['column_3'] = x.column_3;
                    temp['column_4'] = x.column_4;
                    temp['column_5'] = x.column_5;
                    temp['column_6'] = x.column_6;
                    temp['column_7'] = x.column_7;
                    fourHourlyInfo.push({timeInterval: x.timeInterval, info: temp});
                };
                values.fourHourly.push({name: 'TestingOfPropulsionAndSteering', headers: Object.values(values.fourHourlyHeader.TestingOfPropulsionAndSteering), info: fourHourlyInfo});

                fourHourlyInfo=[];
                for(let x of values.Gyro_Magnetic){
                    let temp = x.timeInterval;
                    let temp2 = Object.assign({}, x);
                    delete temp2.timeInterval;
                    fourHourlyInfo.push({timeInterval: temp, info: temp2});
                    
                };
                values.fourHourly.push({name: 'Gyro_Magnetic', headers: Object.keys(values.Gyro_Magnetic[0]), info: fourHourlyInfo});

                fourHourlyInfo=[];
                for(let x of values.TimingRelatedToMomentOfVessel){
                    let temp = {}
                    temp['column_1'] = x.column_1;
                    temp['column_2'] = x.column_2;
                    temp['column_3'] = x.column_3;
                    temp['column_4'] = x.column_4;
                    temp['column_5'] = x.column_5;
                    temp['column_6'] = x.column_6;
                    temp['column_7'] = x.column_7;
                    fourHourlyInfo.push({timeInterval: x.timeInterval, info: temp});

                };
                values.fourHourly.push({name: 'TimingRelatedToMomentOfVessel', headers: Object.values(values.fourHourlyHeader.TimingRelatedToMomentOfVessel), info: fourHourlyInfo});
                
                fourHourlyInfo=[];
                for(let x of values.BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature){
                    let temp = x.timeInterval;
                    let temp2 = Object.assign({}, x);
                    if(values.title==="Four Hourly Entries"){
                        temp2.officerSignature = this.officerSignatureCanvases[x.timeInterval].toDataURL('image/png')||"";
                    }
                    delete temp2.timeInterval;
                    fourHourlyInfo.push({timeInterval: temp, info: temp2});

                };
                values.fourHourly.push({name: 'BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature', headers: Object.keys(values.BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature[0]), info: fourHourlyInfo});

                let additionalColGroupInfo=[];
                if(values.weeklyAndMonthlyInspectionAndTestingOfLSAEquipment.length>0){
                    for(let x of values.weeklyAndMonthlyInspectionAndTestingOfLSAEquipment){
                        let temp = {}
                        temp['column_1'] = x.column_1;
                        temp['column_2'] = x.column_2;
                        temp['column_3'] = x.column_3;
                        temp['column_4'] = x.column_4;
                        temp['column_5'] = x.column_5;
                        temp['column_6'] = x.column_6;
                        temp['column_7'] = x.column_7;
                        additionalColGroupInfo.push({info: temp});
    
                    };
                    values.additionalCol.push({name: 'weeklyAndMonthlyInspectionAndTestingOfLSAEquipment', headers: Object.keys(additionalColGroupInfo[0].info), info: additionalColGroupInfo});
                }

                if(values.entriesOfVariousDrillsAndTrainings.length>0){
                    additionalColGroupInfo=[];
                    for(let x of values.entriesOfVariousDrillsAndTrainings){
                        let temp = {}
                        temp['column_1'] = x.column_1;
                        temp['column_2'] = x.column_2;
                        temp['column_3'] = x.column_3;
                        temp['column_4'] = x.column_4;
                        temp['column_5'] = x.column_5;
                        temp['column_6'] = x.column_6;
                        temp['column_7'] = x.column_7;
                        additionalColGroupInfo.push({info: temp});
    
                    };
                    values.additionalCol.push({name: 'entriesOfVariousDrillsAndTrainings', headers: Object.keys(additionalColGroupInfo[0].info), info: additionalColGroupInfo});
                }

                if(values.resultsOfPreArrivalCargoChecksAndTests.length>0){
                    additionalColGroupInfo=[];
                    for(let x of values.resultsOfPreArrivalCargoChecksAndTests){
                        let temp = {}
                        temp['column_1'] = x.column_1;
                        temp['column_2'] = x.column_2;
                        temp['column_3'] = x.column_3;
                        temp['column_4'] = x.column_4;
                        temp['column_5'] = x.column_5;
                        temp['column_6'] = x.column_6;
                        temp['column_7'] = x.column_7;
                        additionalColGroupInfo.push({info: temp});
    
                    };
                    values.additionalCol.push({name: 'resultsOfPreArrivalCargoChecksAndTests', headers: Object.keys(additionalColGroupInfo[0].info), info: additionalColGroupInfo});
                }

                if(values.recordsOfVariousMeetingCarriedOut.length>0){
                    additionalColGroupInfo=[];
                    for(let x of values.recordsOfVariousMeetingCarriedOut){
                        let temp = {}
                        temp['column_1'] = x.column_1;
                        temp['column_2'] = x.column_2;
                        temp['column_3'] = x.column_3;
                        temp['column_4'] = x.column_4;
                        temp['column_5'] = x.column_5;
                        temp['column_6'] = x.column_6;
                        temp['column_7'] = x.column_7;
                        additionalColGroupInfo.push({info: temp});
    
                    };
                    values.additionalCol.push({name: 'recordsOfVariousMeetingCarriedOut', headers: Object.keys(additionalColGroupInfo[0].info), info: additionalColGroupInfo});
                }

                let submitData = Object.assign({}, values);
                delete submitData.BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature;
                delete submitData.CONAndWatchChangeOverTimeAndOfficerDetails;
                delete submitData.Gyro_Magnetic;
                delete submitData.TestingOfPropulsionAndSteering;
                delete submitData.TimingRelatedToMomentOfVessel;
                delete submitData.fourHourlyHeader;

                delete submitData.weeklyAndMonthlyInspectionAndTestingOfLSAEquipment;
                delete submitData.entriesOfVariousDrillsAndTrainings;
                delete submitData.resultsOfPreArrivalCargoChecksAndTests;
                delete submitData.recordsOfVariousMeetingCarriedOut;
                if(submitData.template || submitData.template===null)
                    delete submitData.template;
                if(submitData.title)
                    delete submitData.title;
                    
                if(this.checkForSaving(submitData, values.title)===true){
                    let checkFourHourlyHeadingResult = this.checkFourHourlyHeading(submitData, values.title);
                    if(checkFourHourlyHeadingResult===true){
                        if(values.title==="General Info") submitData.saved.general = true;
                        if(values.title==="Hourly Entries") submitData.saved.hourly = true;
                        if(values.title==="Four Hourly Entries") submitData.saved.fourHourly = true;
                        if(values.title==="Additional Entries At Noon") submitData.saved.noon = true;
                        if(values.title==="Once in 24 Hours") submitData.saved.daily = true;
                        if(values.title==="Additional Column For Daily Miscellaneous Entries") submitData.saved.additionalCol = true;
                        this.DeckLogApi.SaveDeckLogForToday(submitData, (result, err)=>{
                            console.log(result, err);
                            if(!err){
                                this.setState({ showSaveSpinner: false });
                                this.props.setMessages([{type : "success", message : "Logs Saved!"}])
                                    window.scrollTo(0,0);
                                    this.props.history.push('/decklog');
                            }
                        });
                        this.setState({ showSaveSpinner: true });

                    }
                    else{
                        this.props.setMessages([{type : "danger", message : checkFourHourlyHeadingResult}]);
                    }
                }
                else {
                    this.props.setMessages([{type : "danger", message : "No data to save!"}]);
                }
            }}
            >
                {({values,errors,touched,handleChange,setFieldValue,handleSubmit,isSubmitting,setSubmitting})=>{

                    let additionalEntriesAtNoonData = {
                        noonPosition: [
                            {'label': "Latitude", type: 'text', value: values.noon.lat, field: 'noon.lat'},
                            {'label': "Longitude", type: 'text', value: values.noon.lng, field: 'noon.lng'},
                        ],
                        distanceRun: [
                            {'label': "Sea steaming", options: true, type: 'text', value: values.noon.distanceRunSeaStreaming, field: 'noon.distanceRunSeaStreaming', optionsList: ['OG', 'LOG']},
                            {'label': "Hr steaming", options: true,  type: 'text', value: values.noon.distanceRunHRStreaming, field: 'noon.distanceRunHRStreaming', optionsList: ['OG', 'LOG']},
                        ],
                        averageSpeed: [
                            {'label': "Average Speed", type: 'text', value: values.noon.avgSpeed, field: 'noon.avgSpeed'},
                        ]
                    }

                    // let totalUpToDate = {
                    //     hoursUnderway: [
                    //         {'label': "Sea Steaming", type: 'text', value: values.totalUpToDate.hoursUnderwaySeaSteaming, field: 'totalUpToDate.hoursUnderwaySeaSteaming'},
                    //         {'label': "(Stop etc)", type: 'text', value: values.totalUpToDate.hoursUnderwayStopEtc, field: 'totalUpToDate.hoursUnderwayStopEtc'},
                    //         {'label': "Hr steaming", type: 'text', value: values.totalUpToDate.hoursUnderwayHrSteaming, field: 'totalUpToDate.hoursUnderwayHrSteaming'},
                    //     ],
                    //     distanceRun: [
                    //         {'label': "Sea steaming", options: true, type: 'text', value: values.totalUpToDate.distanceRunSeaSteaming, field: 'totalUpToDate.distanceRunSeaSteaming'},
                    //         {'label': "Hr steaming", options: true,  type: 'text', value: values.totalUpToDate.distanceRunHrSteaming, field: 'totalUpToDate.distanceRunHrSteaming'},
                    //     ],
                    //     rightBox: [
                    //         {'label': "Sea Steaming Avg. Speed", type: 'text', value: values.totalUpToDate.seaSteamingAvgSpeed, field: 'totalUpToDate.seaSteamingAvgSpeed'},
                    //         {'label': "Sunrise", type: 'text', value: values.totalUpToDate.sunrise, field: 'totalUpToDate.sunrise'},
                    //         {'label': "Sunset", type: 'text', value: values.totalUpToDate.sunset, field: 'totalUpToDate.sunset'},
                    //     ]
                    // }

                    // let berthOrAnchorage = {
                    //     lyingHour: {'label': "Lying Hour", value: values.berthOrAnchorage.lyingHour, field: 'berthOrAnchorage.lyingHour'},
                    //     totalLyingHour: {'label': "Total Lying Hour", value: values.berthOrAnchorage.totalLyingHour, field: 'berthOrAnchorage.totalLyingHour'},
                    //     shipClockAhDOrBKH: {'label': "Ah'd or B'k", value: values.berthOrAnchorage.shipClockAhDOrBK.h, field: 'berthOrAnchorage.shipClockAhDOrBK.h'},
                    //     shipClockAhDOrBKM: {'label': "Ah'd or B'k", value: values.berthOrAnchorage.shipClockAhDOrBK.m, field: 'berthOrAnchorage.shipClockAhDOrBK.m'},
                    //     shipClockTotalH: {'label': "Total", value: values.berthOrAnchorage.shipClockTotal.h, field: 'berthOrAnchorage.shipClockTotal.h'},
                    //     shipClockTotalM: {'label': "Total", value: values.berthOrAnchorage.shipClockTotal.m, field: 'berthOrAnchorage.shipClockTotal.m'},
                    //     shipClockRemainH: {'label': "Remain", value: values.berthOrAnchorage.shipClockRemain.h, field: 'berthOrAnchorage.shipClockRemain.h'},
                    //     shipClockRemainM: {'label': "Remain", value: values.berthOrAnchorage.shipClockRemain.m, field: 'berthOrAnchorage.shipClockRemain.m'},
                    //     hrsDiffFromUTCP: {'label': "Hrs diff from UTC", value: values.berthOrAnchorage.hrsDiffFromUTC.prefix, field: 'berthOrAnchorage.hrsDiffFromUTC.prefix'},
                    //     hrsDiffFromUTCH: {'label': "Hrs diff from UTC", value: values.berthOrAnchorage.hrsDiffFromUTC.h, field: 'berthOrAnchorage.hrsDiffFromUTC.h'},
                    //     hrsDiffFromUTCM: {'label': "Hrs diff from UTC", value: values.berthOrAnchorage.hrsDiffFromUTC.m, field: 'berthOrAnchorage.hrsDiffFromUTC.m'},
                    // }

                    let addGeneralInfo = () => {
                        setFieldValue('general', [...values.general, {...this.state.template}], false)
                    }

                    let addWAMIATOLSAE = () => {
                        setFieldValue('weeklyAndMonthlyInspectionAndTestingOfLSAEquipment', [...values.weeklyAndMonthlyInspectionAndTestingOfLSAEquipment, {...this.state.template.weeklyAndMonthlyInspectionAndTestingOfLSAEquipmentTemplate}], false)
                    }

                    let addEOVDAT = () => {
                        setFieldValue('entriesOfVariousDrillsAndTrainings', [...values.entriesOfVariousDrillsAndTrainings, {...this.state.template.entriesOfVariousDrillsAndTrainingsTemplate}], false)
                    }

                    let addROPACCAT = () => {
                        setFieldValue('resultsOfPreArrivalCargoChecksAndTests', [...values.resultsOfPreArrivalCargoChecksAndTests, {...this.state.template.resultsOfPreArrivalCargoChecksAndTestsTemplate}], false)
                    }

                    let addROVMCO = () => {
                        setFieldValue('recordsOfVariousMeetingCarriedOut', [...values.recordsOfVariousMeetingCarriedOut, {...this.state.template.recordsOfVariousMeetingCarriedOutTemplate}], false)
                    }
                    
                    // let addFireAndSafetyRounds = () => {
                    //     setFieldValue('fireAndSafetyRounds', [...values.fireAndSafetyRounds, {...this.state.template.fireAndSafetyRoundsTemplate}], false)
                    // }

                    // let addUMS = () => {
                    //     setFieldValue('UMS', [...values.UMS, {...this.state.template.UMSTemplate}], false)
                    // }

                    return( 
                        <Form onSubmit={handleSubmit} className="mx-auto">
                            <Row style={{ padding: '20px', margin: '5px' }}>
                                <Col>
                                    <Row style={{ color: '#067FAA', fontSize: '1.2em', paddingBottom: '15px' }}>
                                        <Col style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ marginRight: 'auto', visibility: 'hidden' }}></div>
                                            <div style={{ fontSize: '1.4rem' }}>
                                                {moment(this.state.todayDate).format('DD MMM YYYY').toUpperCase()}, {this.state.title}
                                            </div>
                                            <div style={{ marginLeft: 'auto' }}>
                                                <Button variant="contained" type={'submit'} color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', paddingLeft: '30px', paddingRight: '30px' }} disabled={this.state.showSaveSpinner}> 
                                                {this.state.showSaveSpinner?<Spinner animation="border" variant="light" size='sm' />: ' '} Save
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row style={{ backgroundColor: '#04384C', padding: '0px', width: '100%'}}>
                                        <Col xs={12} style={{ padding: '0px' }}>
                                            {{
                                                'General Info': <DeckLogGeneralInfo data={values.general} addGeneralInfo={addGeneralInfo} handleChange={handleChange} setFieldValue={setFieldValue} />,
                                                'Hourly Entries': <DeckLogHourlyEntries data={values.hourly} handleChange={handleChange} setFieldValue={setFieldValue} />,
                                                'Four Hourly Entries': <DeckLogFourHourlyEntries setRef={this.setRef} clearCanvas={this.clearCanvas} dataCONAndWatchChangeOverTimeAndOfficerDetails={values.CONAndWatchChangeOverTimeAndOfficerDetails} dataTestingOfPropulsionAndSteering={values.TestingOfPropulsionAndSteering} dataGyro_Magnetic={values.Gyro_Magnetic} dataTimingRelatedToMomentOfVessel={values.TimingRelatedToMomentOfVessel} dataBridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature={values.BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature} headers={values.fourHourlyHeader} handleChange={handleChange} setFieldValue={setFieldValue} />,
                                                'Additional Entries At Noon': <DeckLogAdditionalEntriesAtNoonData data={additionalEntriesAtNoonData} handleChange={handleChange} setFieldValue={setFieldValue} />,
                                                'Once in 24 Hours': <DeckLogOnceInADay data={values.daily} handleChange={handleChange} setFieldValue={setFieldValue} />,
                                                'Additional Column For Daily Miscellaneous Entries': <DeckLogAdditionalColumns addWAMIATOLSAE = {addWAMIATOLSAE} addEOVDAT = {addEOVDAT} addROPACCAT = {addROPACCAT} addROVMCO = {addROVMCO} dataWAMIATOLSAE={values.weeklyAndMonthlyInspectionAndTestingOfLSAEquipment} dataEOVDAT={values.entriesOfVariousDrillsAndTrainings} dataROPACCAT={values.resultsOfPreArrivalCargoChecksAndTests} dataROVMCO={values.recordsOfVariousMeetingCarriedOut} handleChange={handleChange} setFieldValue={setFieldValue} />,
                                                // 'Berth Or Anchorage': <DeckLogBerthOrAnchorage data={berthOrAnchorage} handleChange={handleChange} setFieldValue={setFieldValue} />,
                                                // 'Total Up To Date': <DeckLogTotalUpToDate data={totalUpToDate} handleChange={handleChange} setFieldValue={setFieldValue} />,
                                                // 'Fire and Safety Round, UMS': <DeckLogFireAndSafetyRounds_UMS addFASR={addFireAndSafetyRounds} addUMS={addUMS} dataFASR={values.fireAndSafetyRounds} dataUMS={values.UMS} handleChange={handleChange} setFieldValue={setFieldValue} />,
                                                }[this.state.title]}
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
                {!this.state.loaded && <FullScreenSpinner />}
                {this.state.loaded && this.renderForm()}

            </div>
        );
    }
}

export default withRouter(withMessageManager(withLayoutManager(DeckLogEditForm)));