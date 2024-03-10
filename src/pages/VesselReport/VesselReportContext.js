import React, { useState } from "react";
import deepCopy from "../../Helper/GeneralFunc/deepCopy";
import { vesselReportTemplate, robTemplate, tankSoundingsTemplate, generatorsTemplate, MORNINGIDENTIFIER, EVENINGIDENTIFIER } from "./VesselReportEditForm/VesselReportFormStructure";
import VesselReportAPI123 from "../../model/VesselReport";
import moment from "moment-timezone";
import config from '../../config/config'
var TIMEZONE = config.TIMEZONE;

const VesselReportContext = React.createContext();
const useVesselReport = () => React.useContext(VesselReportContext);

const CanvasToSignatureMap = {
    chiefEngineerSignatureCanvas: "chiefEngineerSignature",
    captainSignatureCanvas: "captainSignature",
};

const VesselReportProvider = (props) => {
    const VesselReportAPI = new VesselReportAPI123();
    const [VesselReportTableLoaded, setVesselReportTableLoaded] = useState(false);
    const [canEditMorningShift, setCanEditMorningShift] = useState(true);
    const [canEditEveningShift, setCanEditEveningShift] = useState(true);
    const [signAllowed, setSignAllowed] = useState({ chiefEngineer: false, captain: false });
    const [pastVesselReport, setPastVesselReport] = useState([]);
    const [canSubmit, setCanSubmit] = useState(false);
    const [VesselReportLoaded, setVesselReportLoaded] = useState(false);
    const [VesselReport, setVesselReport] = useState({});
    let signatureCanvases = { chiefEngineerSignatureCanvas: {}, captainSignatureCanvas: {} };

    const setSignatureCanvasRef = (ref, canvas) => {
        if (VesselReport[CanvasToSignatureMap[canvas]] && ref) {
            if (ref.isEmpty()) {
                ref.fromDataURL(VesselReport[CanvasToSignatureMap[canvas]]);
            }
        }
        signatureCanvases[canvas] = ref;
    };
    const clearCanvas = (canvas) => {
        let temp = VesselReport;
        temp[CanvasToSignatureMap[canvas]] = null;
        setVesselReport(temp);
        signatureCanvases[canvas].clear();
    };
    const updateSignature = (canvas) => {
        let temp = VesselReport;
        if (signatureCanvases[canvas].isEmpty()) {
            temp[CanvasToSignatureMap[canvas]] = null;
        } else {
            temp[CanvasToSignatureMap[canvas]] = signatureCanvases[canvas].toDataURL("image/png");
        }
        setVesselReport(temp);
    };

    const updateSignatures = () => {
        if (signAllowed.chiefEngineer === true) {
            updateSignature('chiefEngineerSignatureCanvas');
        }
        if (signAllowed.captain === true) {
            updateSignature('captainSignatureCanvas');
        }
    };
	const isEmpty = (element) =>{
        if(element===undefined || element===null)
            return true;
        else if(typeof(element) === 'string'){
            if(element.trim()===''){
                return true
            }
            else{
                return false
            }
        }
        else
            return false;
    }
	const createReport = (shift, data) => {
		let crews = { working: [], resting: [] }, generatorsList = [];
		let vesselReportData = deepCopy(vesselReportTemplate);
        let timeStampToUse = moment.tz(new Date(), TIMEZONE);
        if(moment.tz(new Date(), TIMEZONE).isBefore(
            moment.tz(new Date(), TIMEZONE).set('hour', 8).set('minute', 30).set('second', 0).set('millisecond', 0)
        )){
            timeStampToUse.subtract(1, 'day');
        }
        vesselReportData.reportDate = timeStampToUse.format('DD-MM-YYYY');
		if(shift!==undefined){
			vesselReportData.shift = shift;
		}
		if(data!==undefined){
            vesselReportData.vesselName = data.value.vessel.name;
            vesselReportData.vesselId = parseInt(data.value.vessel.id);
            data.value.crews = data.value.crews.map(crew => {crew.crewId = crew.crew_id; crew.employeeNo = crew.employee_no; delete crew.crew_id; delete crew.employee_no; return crew;})
			crews = data.value.crews;
			generatorsList = data.value.generators;
			for (let i = 0; i < generatorsList?.length; i++) {
				vesselReportData.generators.push({...generatorsTemplate, generatorIdentifier: generatorsList[i]["generator_identifier"]});
			}
			if (vesselReportData.shift) {
				let crew = { working: [], resting: [] };
				crews = crews.filter(element => (element.name && isEmpty(element.name)===false && element.rank && isEmpty(element.rank)===false && element.employeeNo && isEmpty(element.employeeNo)===false))
                crews.forEach(element => {
                    element.workingResting=0;    
                });
				vesselReportData.crew = deepCopy(crew);
                vesselReportData.allCrews = deepCopy(crews);
			}
            vesselReportData.LNGProperties = data.value.LNGProperties;
		}
		return vesselReportData;
	}

    const getVesselReport = async(backdatedValue, shift, callback) => {
        setVesselReportLoaded(false);
        setVesselReportTableLoaded(false);
        let timeStampToUse = moment.tz(new Date(), TIMEZONE);
        if(moment.tz(new Date(), TIMEZONE).isBefore(
            moment.tz(new Date(), TIMEZONE).set('hour', 8).set('minute', 30).set('second', 0).set('millisecond', 0)
        )){
            timeStampToUse.subtract(1, 'day');
        }
        try{
            const reportList = await VesselReportAPI.ForceSyncVesselReport();
            let morning = true, evening = true;
            if(reportList instanceof Array){
                let vesselID = JSON.parse(localStorage.getItem('user')).vessels[0].vesselId;
                setPastVesselReport(reportList.slice(0,10));
                if(reportList.filter(report => report.reportDate===timeStampToUse.format('DD-MM-YYYY') && report.shift===MORNINGIDENTIFIER && vesselID === report.vessel_id).length>0)
                    morning = false;
                if(reportList.filter(report => report.reportDate===timeStampToUse.format('DD-MM-YYYY') && report.shift===EVENINGIDENTIFIER && vesselID === report.vessel_id).length>0)
                    evening = false;
            }
            if(morning === true)
                morning = await VesselReportAPI.CheckLocalDBForSubmission(MORNINGIDENTIFIER);
            if(evening === true)
                evening = await VesselReportAPI.CheckLocalDBForSubmission(EVENINGIDENTIFIER);
            setCanEditMorningShift(morning);
            setCanEditEveningShift(evening);
            setVesselReportTableLoaded(true);
        
            if (shift !== undefined && shift !== null) {
                if((morning===false && shift===MORNINGIDENTIFIER && backdatedValue === "false") 
                        || (evening===false && shift === EVENINGIDENTIFIER && backdatedValue === "false")){
                    callback(false, 'Vessel Report already submitted!');
                }
                else{
                    VesselReportAPI.CanViewVesselReportPage(backdatedValue,(value, err) => {
                        if (value === true || value === 'true') {
                                VesselReportAPI.GetOpenVesselReportForToday((openVesselReports, err) => {
                                    let report = openVesselReports.filter(report => report.shift===shift);
                                    if(report.length>0){
                                        setVesselReport(deepCopy(report[0]));
                                        setVesselReportLoaded(true);
                                    }
                                    else{
                                        VesselReportAPI.GetVesselReportStructure((response, err) => {
                                            if (!err) {
                                                if (response.success === true) {
                                                    setVesselReport(createReport(shift, response));
                                                    setVesselReportLoaded(true);
                                                }
                                            }
                                            else {
                                                callback(false, 'No internet!');
                                            }
                                        });
                                    }
                                });
                        }
                        else{
                            callback(false, 'Another Device is using the page now!');
                        }
                    });
                }
            }
        }catch(Syncerror) {
            console.log("Sync Error:", Syncerror);
        }
    };

    const resetVesselReportTable = () => {
        setVesselReportTableLoaded(false);
        setCanSubmit(false);
    };
    const resetVesselReport = () => {
        setVesselReportLoaded(false);
        setVesselReportTableLoaded(false);
        setCanSubmit(false);
        setSignAllowed({
            captain: false,
            chiefEngineer: false,
        });

        signatureCanvases = {
            captainSignatureCanvas: {},
            chiefEngineerSignatureCanvas: {},
        };
    };
    const unlockVesselReport = () => {
        VesselReportAPI.UnlockVesselReportPage((value, err) => {
        })
    };
    const saveVesselReport = async(vesselReport, callback) => {
        vesselReport.formDate = new Date()
        return await VesselReportAPI.SaveVesselReport(vesselReport);
    };
    const submitVesselReport = async (formDate, shift) => {
        // try{
            const submitValue = await VesselReportAPI.SubmitVesselReport(formDate, shift);
            return submitValue;
        // }
        // catch(err) {
        //     console.log("Error Submitting: ", err);
        // }
    };

    return (
        <VesselReportContext.Provider
            value={{
                VesselReportTableLoaded,
                resetVesselReportTable,
                submitVesselReport,
                pastVesselReport,
                canSubmit,
                canEditMorningShift,
                canEditEveningShift,
                VesselReportLoaded,
                VesselReport,
                setVesselReport,
                getVesselReport,
                resetVesselReport,
                unlockVesselReport,
                saveVesselReport,
                signatureCanvases,
                setSignatureCanvasRef,
                clearCanvas,
                updateSignature,
                updateSignatures,
                signAllowed,
                setSignAllowed,
            }}
            {...props}
        >
            {props.children}
        </VesselReportContext.Provider>
    );
};
const withVesselReport = (Component) => {
    const C = (props) => {
        const { wrappedComponentRef, ...remainingProps } = props;
        return (
            <VesselReportContext.Consumer>
                {(context) => {
                    return (
                        <Component
                            {...remainingProps}
                            {...context}
                            ref={wrappedComponentRef}
                        />
                    );
                }}
            </VesselReportContext.Consumer>
        );
    };
    C.WrappedComponent = Component;
    return C;
};
export {
    VesselReportContext,
    useVesselReport,
    VesselReportProvider,
    withVesselReport,
};
