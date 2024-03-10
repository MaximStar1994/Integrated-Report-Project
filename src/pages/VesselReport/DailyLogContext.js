import React, { useState } from "react";
import deepCopy from "../../Helper/GeneralFunc/deepCopy";
import { dailyLogTemplate, robTemplate, tankSoundingsTemplate, generatorsTemplate } from "./VesselReportEditForm/VesselReportFormStructure";
import DailyLogAPI123 from "../../model/DailyLog";
import moment from "moment-timezone";
import config from '../../config/config'
var TIMEZONE = config.TIMEZONE;

const DailyLogContext = React.createContext();
const useDailyLog = () => React.useContext(DailyLogContext);

const CanvasToSignatureMap = {
    chiefEngineerSignatureCanvas: "chiefEngineerSignature",
    captainSignatureCanvas: "captainSignature",
};

const DailyLogProvider = (props) => {
    const DailyLogAPI = new DailyLogAPI123();
    const [DailyLogTableLoaded, setDailyLogTableLoaded] = useState(false);
    const [pastDailyLog, setPastDailyLog] = useState([]);
    const [canEditDailyLog, setCanEditDailyLog] = useState(true);
    const [signAllowed, setSignAllowed] = useState({ chiefEngineer: false, captain: false });
    const [canSubmit, setCanSubmit] = useState(false);
    const [DailyLogLoaded, setDailyLogLoaded] = useState(false);
    const [DailyLog, setDailyLog] = useState({});
    let signatureCanvases = { chiefEngineerSignatureCanvas: {}, captainSignatureCanvas: {} };

    const setSignatureCanvasRef = (ref, canvas) => {
        if (DailyLog[CanvasToSignatureMap[canvas]] && ref) {
            if (ref.isEmpty()) {
                ref.fromDataURL(DailyLog[CanvasToSignatureMap[canvas]]);
            }
        }
        signatureCanvases[canvas] = ref;
    };
    const clearCanvas = (canvas) => {
        let temp = DailyLog;
        temp[CanvasToSignatureMap[canvas]] = null;
        setDailyLog(temp);
        signatureCanvases[canvas].clear();
    };
    const updateSignature = (canvas) => {
        let temp = DailyLog;
        if (signatureCanvases[canvas].isEmpty()) {
            temp[CanvasToSignatureMap[canvas]] = null;
        } else {
            temp[CanvasToSignatureMap[canvas]] = signatureCanvases[canvas].toDataURL("image/png");
        }
        setDailyLog(temp);
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
	const createReport = (data) => {
		let robList = [], tankSoundingsList = [], generatorsList = [];
		let dailyLogData = deepCopy(dailyLogTemplate);
        let timeStampToUse = moment.tz(new Date(), TIMEZONE);
        if(moment.tz(new Date(), TIMEZONE).isBefore(
            moment.tz(new Date(), TIMEZONE).set('hour', 1).set('minute', 0).set('second', 0).set('millisecond', 0)
        )){
            timeStampToUse.subtract(1, 'day');
        }
        dailyLogData.reportDate = timeStampToUse.format('DD-MM-YYYY');
		if(data!==undefined){
            dailyLogData.vesselName = data.value.vessel.name;
            dailyLogData.vesselId = parseInt(data.value.vessel.id);
            robList = data.value.rob;
			tankSoundingsList = data.value.tankSounding;
            generatorsList = data.value.generators;
			for (let i = 0; i < generatorsList?.length; i++) {
				dailyLogData.generators.push({...generatorsTemplate, generatorIdentifier: generatorsList[i]["generator_identifier"]});
			}
			for (let i = 0; i < robList?.length; i++) {
				dailyLogData.rob.push({...robTemplate, identifier: robList[i]["rob_identifier"], orderid: robList[i].orderid});
			}
			for (let i = 0; i < tankSoundingsList?.length; i++) {
				dailyLogData.tanksoundings.push({...tankSoundingsTemplate, identifier: tankSoundingsList[i].identifier, maxdepth: tankSoundingsList[i].max_depth, maxvolume: tankSoundingsList[i].max_volume, orderid: tankSoundingsList[i].orderid});
			}
		}
        dailyLogData.LNGProperties = data.value.LNGProperties;
		return dailyLogData;
	}

    const getDailyLog = async(backdatedValue,callback) => {
        setDailyLogLoaded(false);
        setDailyLogTableLoaded(false);
        let timeStampToUse = moment.tz(new Date(), TIMEZONE);
        if(moment.tz(new Date(), TIMEZONE).isBefore(
            moment.tz(new Date(), TIMEZONE).set('hour', 1).set('minute', 0).set('second', 0).set('millisecond', 0)
        )){
            timeStampToUse.subtract(1, 'day');
        }
        try{
            const reportList = await DailyLogAPI.ForceSyncDailyLog();
            let daily = true;
            if(reportList instanceof Array){
                let vesselID = JSON.parse(localStorage.getItem('user')).vessels[0].vesselId;
                setPastDailyLog(reportList.slice(0,10));
                if(reportList.filter(report => report.reportDate===timeStampToUse.format('DD-MM-YYYY') && vesselID === report.vessel_id).length>0)
                    daily = false;
            }
            if(daily === true)
                daily = await DailyLogAPI.CheckLocalDBForSubmission();

            setCanEditDailyLog(daily);
            setDailyLogTableLoaded(true);
            if (daily !== undefined && daily !== null) {
                if(daily===false && backdatedValue === "false"){
                    callback(false, 'Daily Log already submitted!');
                }
                else{
                    DailyLogAPI.CanViewDailyLogPage(backdatedValue,(value, err) => {
                        if (value === true || value === 'true') {
                                DailyLogAPI.GetOpenDailyLogForToday((openDailyLogs, err) => {
                                    let report = openDailyLogs;
                                    if(report.length>0){
                                        setDailyLog(deepCopy(report[0]));
                                        setDailyLogLoaded(true);
                                    }
                                    else{
                                        DailyLogAPI.GetDailyLogStructure((response, err) => {
                                            if (!err) {
                                                if (response.success === true) {
                                                    setDailyLog(createReport(response));
                                                    setDailyLogLoaded(true);
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

    const resetDailyLogTable = () => {
        setDailyLogTableLoaded(false);
        setCanSubmit(false);
    };
    const resetDailyLog = () => {
        setDailyLogLoaded(false);
        setDailyLogTableLoaded(false);
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
    const unlockDailyLog = () => {
        DailyLogAPI.UnlockDailyLogPage((value, err) => {
        })
    };
    const saveDailyLog = async(dailyLog, callback) => {
        dailyLog.formDate = new Date()
        return await DailyLogAPI.SaveDailyLog(dailyLog);
    };
    const submitDailyLog = async (formDate) => {
        // try{
            const submitValue = await DailyLogAPI.SubmitDailyLog(formDate);
            return submitValue;
        // }
        // catch(err) {
        //     console.log("Error Submitting: ", err);
        // }
    };

    return (
        <DailyLogContext.Provider
            value={{
                submitDailyLog,
                DailyLogLoaded,
                pastDailyLog,
                canSubmit,
                canEditDailyLog,
                DailyLogTableLoaded,
                DailyLog,
                setDailyLog,
                getDailyLog,
                resetDailyLogTable,
                resetDailyLog,
                unlockDailyLog,
                saveDailyLog,
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
        </DailyLogContext.Provider>
    );
};
const withDailyLog = (Component) => {
    const C = (props) => {
        const { wrappedComponentRef, ...remainingProps } = props;
        return (
            <DailyLogContext.Consumer>
                {(context) => {
                    return (
                        <Component
                            {...remainingProps}
                            {...context}
                            ref={wrappedComponentRef}
                        />
                    );
                }}
            </DailyLogContext.Consumer>
        );
    };
    C.WrappedComponent = Component;
    return C;
};
export {
    DailyLogContext,
    useDailyLog,
    DailyLogProvider,
    withDailyLog,
};
