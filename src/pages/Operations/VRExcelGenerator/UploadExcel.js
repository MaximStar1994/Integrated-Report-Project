import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import config from '../../../config/config';
import { withMessageManager } from '../../../Helper/Message/MessageRenderer';
import { Col, Modal, Row } from 'react-bootstrap';
import { dailyLogStructure,VESSELREPORTCATEGORIES } from './VesselReportExcelStaticFile'
import DailyLogAPI123 from "../../../model/DailyLog";
import * as XLSX from "xlsx";
import moment from "moment";
import { faUpload,faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VesselImportIMG from "../../../assets/KST/vessel_excel_import.png";
import VesselImportSubmitIMG from "../../../assets/KST/vessel_excel_import_submit.png";
import VesselReportAPI123 from "../../../model/VesselReport";

const IsEmpty = e => (typeof(e)==='string' && e.trim()==='')||e===null||e===undefined

const useStyles = { 
    backgroundColor: "#04384c", borderRadius: '8px', color: config.KSTColors.ICON, width: '100%', 
}
const UploadExcel = props => {
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [logsListModalOpen, setLogsListModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [uploadingStatus, setUploadingStatus] = useState(false);
    const [errors, setErrors] = useState({});
    const [fileSelected, setFileSelected] = useState('')
    const [data, setData] = useState([]);
    const [isDailyLog, setIsDailyLog] = useState(false);
    const DailyLogAPI = new DailyLogAPI123();
    const VesselReportAPI = new VesselReportAPI123();

    const selectFileHandler = event => {
        var acceptedFormat = ['xls', 'xlsx' ,'XLS', 'XLSX'];
        if(event.target.files.length===0){
            setFileSelected('')
            setData([])
        }
        else{
            let uploadedfileExtn = event.target.files[0].name.split('.').pop()
            if (acceptedFormat.includes(uploadedfileExtn)) {
                console.log(('Valid file type'));
                setFileSelected(event.target.files[0].name)
                readExcel(event.target.files[0])
            } 
            else {
                setFileSelected('')
                setData([])
                console.log(('Invalid file type'));
                props.setMessages([{type : "danger", message : 'The selected file extension is not allowed. Allowed file types are xls, xlsx!'}]);
            }
        }
    }
    //Handling file pick multiple times click
    const handleFileClick = event => {
        const { target = {} } = event || {};
        target.value = "";
        setFileSelected('')
        setData([])
      };    

    const submitLog = async (submitData) => {
        try{
            if(submitData.length===0)
                props.setMessages([{type: 'danger', message: "No data available to upload!"}])
            else {
                setUploadingStatus(true);
                let submitDataValue;
                if (isDailyLog) {
                   submitDataValue = await DailyLogAPI.postDailyLog(submitData) 
                } else {
                   submitDataValue = await VesselReportAPI.postVesselReport(submitData);
                }
                setFileSelected('')
                setData([])
                setUploadingStatus(false)
                props.setMessages([{type: 'success', message: "Data uploaded!"}])
                return submitDataValue
            }
        }
        catch(err) {
            props.setMessages([{type: 'danger', message: "Unable to upload!"}])
            setUploadingStatus(false)
            console.log("Error Uploading: ", err);
        }
    };

    const readExcel = (file) => {
        const promise = new Promise((res, rej) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file)
            fileReader.onload = e => {
                const bufferArray = e.target.result;

                const wb = XLSX.read(bufferArray, { type: 'buffer' });
                const wsName = wb.SheetNames[0];
                const ws = wb.Sheets[wsName]
                const data = XLSX.utils.sheet_to_json(ws)
                res(data);
            }
            fileReader.onerror = e => rej(e);
        });

        promise.then(d => {
            let tempErrors = {}
            let temp = {};
            var isUploadedFileDailyLog = false;
            const dateregex = new RegExp('^[0-9]{8}$')
            const optionalregex = new RegExp('optional')
            let tempDates = Object.entries(d[0]).filter(([k, v]) => dateregex.test(v.toString().trim()) && IsEmpty(v) === false)
            if (tempDates.length === 0) {
                throw new Error("Excel values cannot be empty. Minimum 1 submission expected");
            }
            if (d[0]['Report'].trim().toLowerCase().split(" ").shift() === "daily") {
                isUploadedFileDailyLog = true;
            }
            d.forEach(element => {
                tempDates.forEach(date=>{
                    element[date[1]] = element[date[0]]
                    delete element[date[0]]
                })
            })
            let dates = [];
            tempDates.forEach(date=>{
                dates.push(date[1])
            })

            if (isUploadedFileDailyLog) {
                //Dailylog excel upload
                let version = d.filter(e=>e.Report==='Version')
                if(version instanceof Array && version.length>0){
                    if(version[0].Category!==props.versions.dailyLog){
                        throw new Error("Version mis-matched! Please use latest version for submission!");
                    }
                    else{
                        d=d.filter(e=>e.Report!=='Version')
                    }
                }
                else{
                    throw new Error("Document Version not found!");
                }
                d.forEach(element => {
                    dates.forEach(date => {
                        if (IsEmpty(element[date]) && !optionalregex.test(element['Display name'].toLowerCase())) {
                            if(tempErrors[date]===undefined){
                                tempErrors[date] = [`${element['Display name']} is missing.`]
                            }
                            else{
                                tempErrors[date].push(`${element['Display name']} is missing.`)
                            }
                            // throw new Error(`${element['Display name']} on ${date} is missing. Please update before proceeding to upload!`)
                        }
                        else if((element['Category']==='Engine Running Hours' || element['Category']==='Consumables ROB' || element['Category']==='Tank Soundings') && isNaN(element[date])){
                            if(tempErrors[date]===undefined){
                                tempErrors[date] = [`Invalid ${element['Display name']}`]
                            }
                            else{
                                tempErrors[date].push(`Invalid ${element['Display name']}`)
                            }
                            // throw new Error(`Invalid ${element['Display name']} on ${date}. Please update before proceeding to upload!`);
                        }
                        if(IsEmpty(dailyLogStructure[element.Category])===false && IsEmpty(element.Identifiers)===false){
                            if(temp[date] === undefined)
                                temp[date] = {}
                            if(element.Category==='Engine Running Hours'){
                                if(temp[date][dailyLogStructure[element.Category][element.Identifiers]] === undefined)
                                    temp[date][dailyLogStructure[element.Category][element.Identifiers]] = {}
    
                                if(temp[date][dailyLogStructure[element.Category][element.Identifiers]][element.Identifiers] === undefined){
                                    temp[date][dailyLogStructure[element.Category][element.Identifiers]][element.Identifiers] = {}
                                    if(dailyLogStructure[element.Category][element.Identifiers]==='engines'){
                                        temp[date][dailyLogStructure[element.Category][element.Identifiers]][element.Identifiers]['engineIdentifier'] = element.Identifiers
                                    }
                                    else if(dailyLogStructure[element.Category][element.Identifiers]==='generators'){
                                        temp[date][dailyLogStructure[element.Category][element.Identifiers]][element.Identifiers]['generatorIdentifier'] = element.Identifiers
                                    }
                                    else{
                                        temp[date][dailyLogStructure[element.Category][element.Identifiers]]['identifier'] = element.Identifiers
                                    }
                                }
                                if(temp[date][dailyLogStructure[element.Category][element.Identifiers]][element.Identifiers][element['Tag name']] === undefined)
                                    temp[date][dailyLogStructure[element.Category][element.Identifiers]][element.Identifiers][element['Tag name']] = {}
                                temp[date][dailyLogStructure[element.Category][element.Identifiers]][element.Identifiers][element['Tag name']] = element[date]
                            }
                            else {
                                if(temp[date][dailyLogStructure[element.Category]] === undefined)
                                    temp[date][dailyLogStructure[element.Category]] = {}
                                if(temp[date][dailyLogStructure[element.Category]][element.Identifiers] === undefined)
                                    temp[date][dailyLogStructure[element.Category]][element.Identifiers] = {}
                                    temp[date][dailyLogStructure[element.Category]][element.Identifiers]['identifier'] = element.Identifiers
                                if(temp[date][dailyLogStructure[element.Category]][element.Identifiers][element['Tag name']] === undefined)
                                    temp[date][dailyLogStructure[element.Category]][element.Identifiers][element['Tag name']] = {}
                                temp[date][dailyLogStructure[element.Category]][element.Identifiers][element['Tag name']] = element[date]
                            }
                        }
                        else{
                            if(temp[date] === undefined)
                                temp[date] = {}
                            temp[date][element['Tag name']] = element[date]
                        }
                    })
                    delete temp['reportDate']
                });
                let finalResult = []
                Object.values(temp).forEach(dayEntry =>{
                    dayEntry['chiefEngineerSignature'] = dayEntry['chiefEngineerName']
                    dayEntry['captainSignature'] = dayEntry['captainName']
                    dayEntry['reportDate'] = moment(dayEntry['reportDate'], 'YYYYMMDD')
                    dayEntry['formDate'] = dayEntry['reportDate'].toDate()
                    dayEntry['generatedDate'] = dayEntry['reportDate'].toDate()
                    dayEntry['reportDate'] = dayEntry['reportDate'].format('DD-MM-YYYY')
                    dayEntry['vesselId'] = JSON.parse(localStorage.getItem('user')).vessels[0].vesselId;
                    dayEntry['vesselName'] = JSON.parse(localStorage.getItem('user')).vessels[0].name;
                    dayEntry['engines'] = Object.values(dayEntry['engines'])
                    dayEntry['generators'] = Object.values(dayEntry['generators'])
                    dayEntry['rob'] = Object.values(dayEntry['rob'])
                    dayEntry['tanksoundings'] = Object.values(dayEntry['tanksoundings'])
                    dayEntry['is_backdated'] = true
                    dayEntry['is_offline'] = true
                    finalResult.push(dayEntry)
                })
                if(Object.keys(tempErrors).length>0){
                    setErrors(tempErrors)
                    setErrorModalOpen(true)
                    throw new Error(`Some information is invalid/missing. Please update before proceeding to upload!`)
                }
                else {
                    setIsDailyLog(true);
                    setData(finalResult)
                }
            } else {
                //Morning shift / Evening shift excel upload
                let version = d.filter(e=>e.Report==='Version')
                if(version instanceof Array && version.length>0){
                    if(version[0].Category!==props.versions.shift){
                        throw new Error("Version mis-matched! Please use latest version for submission!");
                    }
                    else{
                        d=d.filter(e=>e.Report!=='Version')
                    }
                }
                else{
                    throw new Error("Document Version not found!");
                }
                d.forEach(element => {
                    dates.forEach(date => {
                        if (IsEmpty(element[date]) && !optionalregex.test(element['Display name'].toLowerCase())) {
                            if(tempErrors[date]===undefined){
                                tempErrors[date] = [`${element['Category']} - ${element['Display name']} is missing.`]
                            } else{
                                tempErrors[date].push(`${element['Category']} - ${element['Display name']} is missing.`)
                            }
                        }
                        if (temp[date] === undefined) {
                            temp[date] = {};
                            if (element['Report'].trim().toLowerCase().split(" ").shift() === "morning") {
                                temp[date]['shift'] = 1;
                            } else if(element['Report'].trim().toLowerCase().split(" ").shift() === "evening") {
                                temp[date]['shift'] = 2;
                            } else {
                                if(tempErrors[date]===undefined){
                                    tempErrors[date] = [`${element['Category']} - Report name mismatch.`]
                                } else{
                                    tempErrors[date].push(`${element['Category']} - Report name mismatch.`)
                                }
                            }
                        }
                        if (element['Category'] === VESSELREPORTCATEGORIES.ACKNOWLEDGEMENTS) {
                            temp[date][element['Tag name']] = element[date];
                        }
                        // else if (element['Category'] === VESSELREPORTCATEGORIES.DECKLOGINFO) {
                        //     if (temp[date]['decklogs'] === undefined) {
                        //         temp[date]['decklogs'] = [{}];
                        //     }
                        //     if (element['Tag name'].trim().toLowerCase() === 'starttime' || element['Tag name'].trim().toLowerCase() === 'endtime') {
                        //         console.log(dateregex.test(element[date].toString().trim()));
                        //         if (IsEmpty(element[date]) === false && dateregex.test(element[date].toString().trim())) {
                        //             temp[date]['decklogs'][0][element['Tag name']] = moment(element[date], 'YYYYMMDD').toDate();
                        //         } else {
                        //             if(IsEmpty(element[date]) === false) {
                        //                 if(tempErrors[date]===undefined){
                        //                     tempErrors[date] = [`${element['Category']} - ${element['Display name']} dateFormat is incorrect.`]
                        //                 } else{
                        //                     tempErrors[date].push(`${element['Category']} - ${element['Display name']} dateFormat is incorrect.`)
                        //                 }
                        //             }
                        //         }
                        //     } else if (element['Tag name'].trim().toLowerCase() === 'nooftugs') {
                        //         if (isNaN(element[date])) {
                        //             if(IsEmpty(element[date]) === false) {
                        //                 if(tempErrors[date]===undefined){
                        //                     tempErrors[date] = [`${element['Category']} - ${element['Display name']} must be number.`]
                        //                 } else{
                        //                     tempErrors[date].push(`${element['Category']} - ${element['Display name']} must be number.`)
                        //                 }
                        //             }
                        //         } else {
                        //             temp[date]['decklogs'][0][element['Tag name']] = element[date];
                        //         }
                        //     } else {
                        //         temp[date]['decklogs'][0][element['Tag name']] = element[date];
                        //     }
                        // }
                        else if (element['Category'] === VESSELREPORTCATEGORIES.ENGINES) {
                            if (temp[date]['engines'] === undefined) {
                                temp[date]['engines'] = [{}, {}];
                                temp[date]['engines'][0]['engineIdentifier'] = VESSELREPORTCATEGORIES.SENGINEIDENTIFIER;
                                temp[date]['engines'][1]['engineIdentifier'] = VESSELREPORTCATEGORIES.PENGINEIDENTIFIER;
                            }
                            if (isNaN(element[date])) {
                                if(IsEmpty(element[date]) === false) {
                                    if(tempErrors[date]===undefined){
                                        tempErrors[date] = [`${element['Category']} - ${element['Display name']} must be number.`]
                                    } else{
                                        tempErrors[date].push(`${element['Category']} - ${element['Display name']} must be number.`)
                                    }
                                }
                            }
                            if (element['Identifiers'] === VESSELREPORTCATEGORIES.SENGINEIDENTIFIER) {
                                temp[date]['engines'][0][element['Tag name']] = element[date];
    
                            } else if (element['Identifiers'] === VESSELREPORTCATEGORIES.PENGINEIDENTIFIER) {
                                temp[date]['engines'][1][element['Tag name']] = element[date];
                            }
                        } else if (element['Category'] === VESSELREPORTCATEGORIES.GENERATORS) {
                            if (temp[date]['generators'] === undefined) {
                                temp[date]['generators'] = [{}, {}];
                                temp[date]['generators'][0]['generatorIdentifier'] = VESSELREPORTCATEGORIES.AE1GENERATORIDENTIFIER;
                                temp[date]['generators'][1]['generatorIdentifier'] = VESSELREPORTCATEGORIES.AE2GENERATORIDENTIFIER;
                            }
                            if (element['Units'].trim().toLowerCase() !== 'text' && isNaN(element[date])) {
                                if(IsEmpty(element[date]) === false) {
                                    if(tempErrors[date]===undefined){
                                        tempErrors[date] = [`${element['Category']} - ${element['Display name']} must be number.`]
                                    } else{
                                        tempErrors[date].push(`${element['Category']} - ${element['Display name']} must be number.`)
                                    }
                                }
                            }
                            if (element['Identifiers'] === VESSELREPORTCATEGORIES.AE1GENERATORIDENTIFIER) {
                                temp[date]['generators'][0][element['Tag name']] = element[date];
                                return;
                            } else if (element['Identifiers'] === VESSELREPORTCATEGORIES.AE2GENERATORIDENTIFIER) {
                                temp[date]['generators'][1][element['Tag name']] = element[date];
                                return;
                            } else if (element['Identifiers'] === VESSELREPORTCATEGORIES.AE3GENERATORIDENTIFIER) {
                                temp[date]['generators'].push({});
                                temp[date]['generators'][2]['generatorIdentifier'] = VESSELREPORTCATEGORIES.AE3GENERATORIDENTIFIER;
                                temp[date]['generators'][2][element['Tag name']] = element[date];
                            } 
                        } else if (element['Category'] === VESSELREPORTCATEGORIES.AZIMUTHTHRUSTER) {
                            if (temp[date]['zpClutch'] === undefined) {
                                temp[date]['zpClutch'] = [{}, {}];
                                temp[date]['zpClutch'][0]['identifier'] = VESSELREPORTCATEGORIES.SENGINEIDENTIFIER;
                                temp[date]['zpClutch'][1]['identifier'] = VESSELREPORTCATEGORIES.PENGINEIDENTIFIER;
                            }
                            if (element['Units'].trim().toLowerCase() !== 'text' && isNaN(element[date])) {
                                if(IsEmpty(element[date]) === false) {
                                    if(tempErrors[date]===undefined){
                                        tempErrors[date] = [`${element['Category']} - ${element['Display name']} must be number.`]
                                    } else{
                                        tempErrors[date].push(`${element['Category']} - ${element['Display name']} must be number.`)
                                    }
                                }
                            }
                            if (element['Identifiers'] === VESSELREPORTCATEGORIES.SENGINEIDENTIFIER) {
                                temp[date]['zpClutch'][0][element['Tag name']] = element[date];
    
                            } else if (element['Identifiers'] === VESSELREPORTCATEGORIES.PENGINEIDENTIFIER) {
                                temp[date]['zpClutch'][1][element['Tag name']] = element[date];
                            }
                        } else if (element['Category'] === VESSELREPORTCATEGORIES.AIRCONDITIONING) {
                            if (temp[date]['aircons'] === undefined) {
                                temp[date]['aircons'] = [{}];
                                temp[date]['aircons'][0]['identifier'] = VESSELREPORTCATEGORIES.AC1AIRCONDITIONINGIDENTIFIER;
                            }
                            if (element['Units'].trim().toLowerCase() !== 'text' && isNaN(element[date])) {
                                if(IsEmpty(element[date]) === false) {
                                    if(tempErrors[date]===undefined){
                                        tempErrors[date] = [`${element['Category']} - ${element['Display name']} must be number.`]
                                    } else{
                                        tempErrors[date].push(`${element['Category']} - ${element['Display name']} must be number.`)
                                    }
                                }
                            }
                            temp[date]['aircons'][0][element['Tag name']] = element[date];
                        } else if (element['Category'] === VESSELREPORTCATEGORIES.CREWONBOARD) {
                            if (temp[date]['crew'] === undefined) {
                                temp[date]['crew'] = {working: [],resting: []};
                            }
                            if (element[date].trim().toLowerCase() === "working") {
                                const crewDetails = element['Tag name'].split('_');
                                if (crewDetails.length > 0 && crewDetails.length === 3) {
                                    temp[date]['crew'].working.push(
                                        {
                                            crewId: crewDetails[0],
                                            employeeNo: crewDetails[1],
                                            name: element['Display name'],
                                            rank: crewDetails[2],
                                            isWorking: 1
                                        }
                                    );
                                }
                            } else if (element[date].trim().toLowerCase() === "resting") {
                                const crewDetails = element['Tag name'].split('_');
                                if (crewDetails.length > 0 && crewDetails.length === 3) {
                                    temp[date]['crew'].resting.push(
                                        {
                                            crewId: crewDetails[0],
                                            employeeNo: crewDetails[1],
                                            name: element['Display name'],
                                            rank: crewDetails[2],
                                            isWorking: 2
                                        }
                                    );
                                }
                            } else {
                                if(tempErrors[date]===undefined){
                                    tempErrors[date] = [`${element['Category']} - ${element['Display name']} Value mismatching. It must be Working or Resting.`]
                                }
                                else{
                                    tempErrors[date].push(`${element['Category']} - ${element['Display name']} Value mismatching. It must be Working or Resting.`)
                                }
                            }
                        }
                    });
                });
    
                var finalResult = [];
                Object.values(temp).forEach(dayEntry => {
                    dayEntry['chiefEngineerSignature'] = dayEntry['chiefEngineerName']
                    dayEntry['captainSignature'] = dayEntry['captainName']
                    dayEntry['reportDate'] = moment(dayEntry['reportDate'], 'YYYYMMDD')
                    dayEntry['formDate'] = dayEntry['reportDate'].toDate()
                    dayEntry['generatedDate'] = dayEntry['reportDate'].toDate()
                    dayEntry['reportDate'] = dayEntry['reportDate'].format('DD-MM-YYYY')
                    dayEntry['vesselId'] = JSON.parse(localStorage.getItem('user')).vessels[0].vesselId;
                    dayEntry['vesselName'] = JSON.parse(localStorage.getItem('user')).vessels[0].name;
                    dayEntry['is_backdated'] = true
                    dayEntry['is_offline'] = true
                    finalResult.push(dayEntry);
                });
                if(Object.keys(tempErrors).length>0){
                    setErrors(tempErrors)
                    setErrorModalOpen(true)
                    throw new Error(`Some information is invalid/missing. Please update before proceeding to upload!`)
                } else {
                    setIsDailyLog(false);
                    setData(finalResult);
                }
            }
        }).catch(function (err) {
            console.log(err)
            props.setMessages([{ type: 'danger', message: err.message }]);
            setFileSelected('')
            setData([])
            console.log("Error File : ", err.message);
        })
    }

    //Dailylog excel upload
    // const readExcel = (file) => {
    //     const promise = new Promise((res, rej) =>{
    //         const fileReader = new FileReader();
    //         fileReader.readAsArrayBuffer(file)
    //         fileReader.onload = e => {
    //             const bufferArray = e.target.result;

    //             const wb = XLSX.read(bufferArray,  {type: 'buffer'});
    //             const wsName = wb.SheetNames[0];
    //             const ws = wb.Sheets[wsName]
    //             const data = XLSX.utils.sheet_to_json(ws)
    //             res(data);
    //         }
    //         fileReader.onerror = e => rej(e);
    //     })
    //     promise.then(d=>{
    //         let tempErrors = {}
    //         let temp = {}
    //         const dateregex = new RegExp('^[0-9]{8}$')
    //         const optionalregex = new RegExp('optional')
    //         let tempDates = Object.entries(d[0]).filter(([k, v])=> dateregex.test(v.toString().trim()) && IsEmpty(v)===false)
    //         d.forEach(element=> {
    //             tempDates.forEach(date=>{
    //                 element[date[1]] = element[date[0]]
    //                 delete element[date[0]]
    //             })
    //         })
    //         let dates = [];
    //         tempDates.forEach(date=>{
    //             dates.push(date[1])
    //         })
    //         console.log(dates)
    //         d.forEach(element => {
    //             dates.forEach(date => {
    //                 if (IsEmpty(element[date]) && !optionalregex.test(element['Display name'].toLowerCase())) {
    //                     if(tempErrors[date]===undefined){
    //                         tempErrors[date] = [`${element['Display name']} is missing.`]
    //                     }
    //                     else{
    //                         tempErrors[date].push(`${element['Display name']} is missing.`)
    //                     }
    //                     // throw new Error(`${element['Display name']} on ${date} is missing. Please update before proceeding to upload!`)
    //                 }
    //                 else if((element['Category']==='Engine Running Hours' || element['Category']==='Consumables ROB' || element['Category']==='Tank Soundings') && isNaN(element[date])){
    //                     if(tempErrors[date]===undefined){
    //                         tempErrors[date] = [`Invalid ${element['Display name']}`]
    //                     }
    //                     else{
    //                         tempErrors[date].push(`Invalid ${element['Display name']}`)
    //                     }
    //                     // throw new Error(`Invalid ${element['Display name']} on ${date}. Please update before proceeding to upload!`);
    //                 }
    //                 if(IsEmpty(dailyLogStructure[element.Category])===false && IsEmpty(element.Identifiers)===false){
    //                     if(temp[date] === undefined)
    //                         temp[date] = {}
    //                     if(element.Category==='Engine Running Hours'){
    //                         if(temp[date][dailyLogStructure[element.Category][element.Identifiers]] === undefined)
    //                             temp[date][dailyLogStructure[element.Category][element.Identifiers]] = {}

    //                         if(temp[date][dailyLogStructure[element.Category][element.Identifiers]][element.Identifiers] === undefined){
    //                             temp[date][dailyLogStructure[element.Category][element.Identifiers]][element.Identifiers] = {}
    //                             if(dailyLogStructure[element.Category][element.Identifiers]==='engines'){
    //                                 temp[date][dailyLogStructure[element.Category][element.Identifiers]][element.Identifiers]['engineIdentifier'] = element.Identifiers
    //                             }
    //                             else if(dailyLogStructure[element.Category][element.Identifiers]==='generators'){
    //                                 temp[date][dailyLogStructure[element.Category][element.Identifiers]][element.Identifiers]['generatorIdentifier'] = element.Identifiers
    //                             }
    //                             else{
    //                                 temp[date][dailyLogStructure[element.Category][element.Identifiers]]['identifier'] = element.Identifiers
    //                             }
    //                         }
    //                         if(temp[date][dailyLogStructure[element.Category][element.Identifiers]][element.Identifiers][element['Tag name']] === undefined)
    //                             temp[date][dailyLogStructure[element.Category][element.Identifiers]][element.Identifiers][element['Tag name']] = {}
    //                         temp[date][dailyLogStructure[element.Category][element.Identifiers]][element.Identifiers][element['Tag name']] = element[date]
    //                     }
    //                     else {
    //                         if(temp[date][dailyLogStructure[element.Category]] === undefined)
    //                             temp[date][dailyLogStructure[element.Category]] = {}
    //                         if(temp[date][dailyLogStructure[element.Category]][element.Identifiers] === undefined)
    //                             temp[date][dailyLogStructure[element.Category]][element.Identifiers] = {}
    //                             temp[date][dailyLogStructure[element.Category]][element.Identifiers]['identifier'] = element.Identifiers
    //                         if(temp[date][dailyLogStructure[element.Category]][element.Identifiers][element['Tag name']] === undefined)
    //                             temp[date][dailyLogStructure[element.Category]][element.Identifiers][element['Tag name']] = {}
    //                         temp[date][dailyLogStructure[element.Category]][element.Identifiers][element['Tag name']] = element[date]
    //                     }
    //                 }
    //                 else{
    //                     if(temp[date] === undefined)
    //                         temp[date] = {}
    //                     temp[date][element['Tag name']] = element[date]
    //                 }
    //             })
    //             delete temp['reportDate']
    //         });
    //         let finalResult = []
    //         Object.values(temp).forEach(dayEntry =>{
    //             dayEntry['chiefEngineerSignature'] = dayEntry['chiefEngineerName']
    //             dayEntry['captainSignature'] = dayEntry['captainName']
    //             dayEntry['reportDate'] = moment(dayEntry['reportDate'], 'YYYYMMDD')
    //             dayEntry['formDate'] = dayEntry['reportDate'].toDate()
    //             dayEntry['generatedDate'] = dayEntry['reportDate'].toDate()
    //             dayEntry['reportDate'] = dayEntry['reportDate'].format('DD-MM-YYYY')
    //             dayEntry['vesselId'] = JSON.parse(localStorage.getItem('user')).vessels[0].vesselId;
    //             dayEntry['vesselName'] = JSON.parse(localStorage.getItem('user')).vessels[0].name;
    //             dayEntry['engines'] = Object.values(dayEntry['engines'])
    //             dayEntry['generators'] = Object.values(dayEntry['generators'])
    //             dayEntry['rob'] = Object.values(dayEntry['rob'])
    //             dayEntry['tanksoundings'] = Object.values(dayEntry['tanksoundings'])
    //             dayEntry['is_backdated'] = true
    //             dayEntry['is_offline'] = true
    //             finalResult.push(dayEntry)
    //         })
    //         if(Object.keys(tempErrors).length>0){
    //             setErrors(tempErrors)
    //             setErrorModalOpen(true)
    //             throw new Error(`Some information is invalid/missing. Please update before proceeding to upload!`)
    //         }
    //         else{
    //             setData(finalResult)
    //         }
    //     }).catch(function (err) {
    //         props.setMessages([{ type: 'danger', message: err.message }]);
    //         setFileSelected('')
    //         setData([])
    //         console.log("Error File : ", err.message);
    //     })
    // }
    
    return (
        <Row style={{backgroundColor: config.KSTColors.CARD_BG,height: "150px",borderRadius: "15px",marginTop: "40px",paddingRight: "5px"}}>
            <Col xs={3} lg={3} style={{ padding: "0px" }}>
                <div style={{ display: 'flex', flexFlow: 'column',justifyContent: "center",backgroundColor: config.KSTColors.MAIN,borderColor: config.KSTColors.MAIN,width: "100%",height:"140px",borderRadius: "15px",margin:"5px" }}>
                    <div style={{height: "100%"}}>
                        <input
                            style={{ display: 'none' }}
                            id="raised-button-file2"
                            type="file"
                            name="file"
                            onChange={selectFileHandler}
                            onClick={handleFileClick}
                            disabled={uploadingStatus===true}
                        />
                        <label htmlFor="raised-button-file2" style={{ width: '100%',height:"100%",margin: "0px" }} >
                            <Button size='large' component="span" style={{ backgroundColor: "transparent",borderColor: config.KSTColors.MAIN,width: "100%",height: "100%",borderRadius: "8px"}} disabled={uploadingStatus===true}>
                                {/* <FontAwesomeIcon icon={faFileExcel} style={{ color: config.KSTColors.ICON,fontSize: "60px" }} /> */}
                                <img src={VesselImportIMG} alt="Excel Import" style={{height: "120px"}}/>
                            </Button>
                        </label>
                    </div>   
                    {/* <div style={{ color: "#fff",textAlign: "center",fontWeight: "bold",visibility: data.length===0?'hidden':'visible',padding: "3px" }}>{fileSelected}</div>
                    <div style={{ display: 'flex',visibility: data.length===0?'hidden':'visible',maxHeight: data.length===0?"0px": "50%" }}>
                        <div style={{ display: 'flex', flexGrow: '1',padding: "5px"}}>
                            <Button size='large' variant="contained" component="span" style={useStyles} disabled={uploadingStatus===true} onClick={()=> submitDailyLog(data)}>
                                <CloudUploadIcon style={{ color: config.KSTColors.ICON,fontSize: "22px" }} />
                                <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>{uploadingStatus===true?'Uploading...':'Upload Data'}</span>
                            </Button>
                        </div>
                    </div> */}
                </div>
            </Col>
            <Col xs={6} lg={6}>
                <div style={{ display: "flex", width: "100%", height: "100%", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{width: "100%",height: "20%",color: config.KSTColors.MAIN,fontSize: "32px",
                        display: "flex",justifyContent: "center",alignItems: "center"}}>
                        {uploadingStatus ? 'Uploading...':'Upload Submission'}
                    </div>
                    <span style={{textAlign: "center",paddingTop: "5px",color: config.KSTColors.MAIN,fontSize: "10px"}}>{uploadingStatus ? "" : "(When online connectivity is available)"}</span>
                    <div style={{ color: "#fff",textAlign: "center",fontWeight: "bold",visibility: data.length===0?'hidden':'visible',paddingTop: "5px",fontSize: "13px" }}>{fileSelected}</div>
                    <div style={{ color: "#fff",textAlign: "center",fontWeight: "bold",visibility: data.length===0?'hidden':'visible',paddingTop: "5px",fontSize: "13px" }} className="LogList" onClick={()=>setLogsListModalOpen(true)}>{data.length} submission(s) found!</div>
                </div>
            </Col>
            <Col xs={3} lg={3} style={{ padding: "0px" }}>
                <div style={{ display: 'flex', flexFlow: 'column',justifyContent: "center",backgroundColor: config.KSTColors.MAIN,borderColor: config.KSTColors.MAIN,width: "100%",height:"140px",borderRadius: "15px",marginTop:"5px" }}>
                    <Button size='large' component="span" style={{ backgroundColor: "transparent",borderColor: config.KSTColors.MAIN,width: "100%",height: "100%",borderRadius: "8px"}} disabled={uploadingStatus===true || data.length===0} onClick={() => {setImportModalOpen(true)}}>
                        {/* <FontAwesomeIcon icon={faUpload} style={{ color: config.KSTColors.ICON,fontSize: "60px" }} /> */}
                        <img src={VesselImportSubmitIMG} alt="Excel Import Submit" style={{height: "120px"}}/>
                    </Button> 
                </div>
            </Col>
            <Modal show={importModalOpen} onHide = {() => setImportModalOpen(false)} aria-labelledby="VRUpload" centered>
                <Modal.Header style={{ backgroundColor: '#e6e6e6' }}>
                    <Modal.Title id="VRUpload">Upload Vessel Report Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{fontSize: "12px"}}>Are you sure to upload <span style={{color: "#04588e",fontSize: "12px"}}>{fileSelected}</span> data?</div>
                </Modal.Body>
                <Modal.Footer style={{ color: '#04588e' }}>
                    <Button variant='outlined' onClick={() => setImportModalOpen(false)} style={{ color: '#04588e', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '20px', paddingRight: '20px' }}>Cancel</Button>
                    <Button onClick={() => { setImportModalOpen(false); submitLog(data)}} style={{ backgroundColor: '#04588e', color: 'white', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '20px', paddingRight: '20px' }}>Upload</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={logsListModalOpen} onHide = {() => setLogsListModalOpen(false)} aria-labelledby="VRUpload" centered>
                <Modal.Header style={{ backgroundColor: '#e6e6e6' }}>
                    <Modal.Title id="VRUpload">Submissions found!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {data.map((e, i)=><div key={i} style={{ color: '#04588e' }}>{e.reportDate}</div>)}
                </Modal.Body>
                <Modal.Footer style={{ color: '#04588e' }}>
                    <Button onClick={() => { setLogsListModalOpen(false); }} style={{ backgroundColor: '#04588e', color: 'white', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '20px', paddingRight: '20px' }}>Ok</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={errorModalOpen} onHide = {() => setErrorModalOpen(false)} aria-labelledby="VRUpload" centered>
                <Modal.Header style={{ backgroundColor: '#e6e6e6' }}>
                    <Modal.Title id="VRUpload">Errors in logs!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Object.keys(errors).map((element, i)=>
                        <div key={`i-${i}`} style={{ color: '#04588e' }}>
                            {element}
                            {errors[element].map((error, j)=><div key={`j-${j}`}>{error}</div>)}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ color: '#04588e' }}>
                    <Button onClick={() => { setErrorModalOpen(false); }} style={{ backgroundColor: '#04588e', color: 'white', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '20px', paddingRight: '20px' }}>Ok</Button>
                </Modal.Footer>
            </Modal>
        </Row>
    )

}

export default withMessageManager(UploadExcel)


