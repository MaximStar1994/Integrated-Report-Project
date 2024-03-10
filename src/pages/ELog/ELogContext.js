import React, { useState, useEffect, useContext } from "react";
import { ref } from "yup";
import { ELogDataset } from './ELogDataset';

import EngineLogKST from '../../model/EngineLogKST';

const EngineLogContext = React.createContext();
const useEngineLog = () => React.useContext(EngineLogContext);

const CanvasToSignatureMap = {
  captainSignatureCanvas: 'captainSignature',
  chiefEngineerSignatureCanvas: 'chiefEngineerSignature'
}

const EngineLogProvider = props => {
    const EngineLogAPI = new EngineLogKST();

    const [engineLogTableLoaded, setEngineLogTableLoaded] = useState(false);
    const [signAllowed, setSignAllowed] = useState({
      captain: false,
      chiefEngineer: false,
    })
    const [pastEngineLog, setPastEngineLog] = useState([]);
    const [canSubmit, setCanSubmit] = useState(false);
    const [engineLogLoaded, setEngineLogLoaded] = useState(false);
    const [engineLog, setEngineLog] = useState({});
    let signatureCanvases = {
      captainSignatureCanvas: {},
      chiefEngineerSignatureCanvas: {}
    };

    const setSignatureCanvasRef = (ref, canvas) =>  {
      if(engineLog[CanvasToSignatureMap[canvas]] && ref){
        if(ref.isEmpty()){
          ref.fromDataURL(engineLog[CanvasToSignatureMap[canvas]]);
        }
      }
      signatureCanvases[canvas] =  ref;
    }
    const clearCanvas = canvas =>  {
      let temp = engineLog;
      temp[CanvasToSignatureMap[canvas]] = null;
      setEngineLog(temp);
      signatureCanvases[canvas].clear();
    }
    const updateSignature = canvas => {
      let temp = engineLog;
      if(signatureCanvases[canvas].isEmpty()){
        temp[CanvasToSignatureMap[canvas]] = null;
      }
      else{
        temp[CanvasToSignatureMap[canvas]] =  signatureCanvases[canvas].toDataURL('image/png');
      }
        setEngineLog(temp);
    }

    const getEngineLog = id => {
      if (id != undefined) {
        EngineLogAPI.GetEngineLog(id, (result, err)=>{
          console.log(result, err)
          if(!err){
            EngineLogAPI.ListEngineLogs((res, error) => {
              if(!error){
                setPastEngineLog(res);
              }
            })
            setEngineLog(result);
          }
          setEngineLogTableLoaded(true);     
          setEngineLogLoaded(true);     
        })
      }
      else{
        EngineLogAPI.GetOpenEngineLog((result, err)=>{
          console.log(result, err)
          if(!err){
            if(result.logs[0]['isSaved']===true || result.logs[1]['isSaved']===true || result.logs[2]['isSaved']===true || result.logs[3]['isSaved']===true || result.logs[4]['isSaved']===true || result.logs[5]['isSaved']===true)
              setCanSubmit(true);
            EngineLogAPI.ListEngineLogs((res, error) => {
              if(!error){
                setPastEngineLog(res);
              }
            })
            setEngineLog(result);
          }
          setEngineLogTableLoaded(true);     
          setEngineLogLoaded(true);     
        })
      }
    }

    const resetEngineLogTable = () => {
      setEngineLogTableLoaded(false);
      setCanSubmit(false);
      setSignAllowed({
        captain: false,
        chiefEngineer: false
      });

      signatureCanvases = {
        captainSignatureCanvas: {},
        chiefEngineerSignatureCanvas: {},
      }
    }
    const resetEngineLog = () => {
        setEngineLogLoaded(false);
    }

    async function postEngineLog (values, callback) {
      await EngineLogAPI.PostEngineLog(values, (result, error)=>callback(result, error));
    }
    const saveEngineLog = (values, callback) => {
      let temp = engineLog.logs;
      let idx = temp.findIndex(elog=>elog.id===values.id);
      temp[idx] = values;
      temp = {...engineLog, logs: temp}
      postEngineLog(temp, callback);
    }
    const saveRemarks = (value, callback) => {
      let temp = engineLog;
      temp.remarks = value;
      postEngineLog(temp, callback);
    }
    const submitEngineLog = (captainName, chiefEngineerName, callback) => {
      let temp = engineLog;
      temp.captainName = captainName;
      if(signAllowed.captain===true){
        updateSignature('captainSignatureCanvas');
      }
      temp.chiefEngineerName = chiefEngineerName;
      if(signAllowed.chiefEngineer===true){
        updateSignature('chiefEngineerSignatureCanvas');
      }
      if(!engineLog.captainSignature || !engineLog.chiefEngineerSignature)
        callback(null, 'Signatures are mandatory to submit');
      else{
        postEngineLog(temp, callback);
      }
    }

    return (
        <EngineLogContext.Provider value={{ 
          engineLogTableLoaded, resetEngineLogTable, submitEngineLog, pastEngineLog, canSubmit,
          engineLogLoaded, engineLog, setEngineLog, getEngineLog, resetEngineLog, saveEngineLog, saveRemarks,
          signatureCanvases, setSignatureCanvasRef, clearCanvas, updateSignature, signAllowed, setSignAllowed
          }} {...props}>
            {props.children}
        </EngineLogContext.Provider>
    );
}
const withEngineLog = Component => {
    const C = props => {
      const { wrappedComponentRef, ...remainingProps } = props;
      return (
        <EngineLogContext.Consumer>
          {context => {
                return (
                <Component
                    {...remainingProps}
                    {...context}
                    ref={wrappedComponentRef}
                />
                );
          }}
        </EngineLogContext.Consumer>
      );
    };
    C.WrappedComponent = Component;
    return C;
  }
export { EngineLogContext, useEngineLog, EngineLogProvider, withEngineLog }