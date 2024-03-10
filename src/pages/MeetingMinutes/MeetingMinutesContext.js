import React, { useState, useEffect, useContext } from "react";
import { ref } from "yup";
import { MMDatastructure } from './MeetingMinuteDataSet';

import MeetingMinute from '../../model/MeetingMinute';

const MeetingMinutesContext = React.createContext();
const useMeetingMinutes = () => React.useContext(MeetingMinutesContext);

const CanvasToSignatureMap = {
  masterSignatureCanvas: 'masterSignature',
  chiefOfficerSignatureCanvas: 'chiefOfficerSignature',
  chiefEngineerSignatureCanvas: 'chiefEngineerSignature',
  secondOfficerSignatureCanvas: 'secondOfficerSignature',
}

const MeetingMinutesProvider = props => {
    const MeetingMinuteApi = new MeetingMinute();
    const [meetingMinutes, setMeetingMinutes] = useState({});
    const [pastMeetingMinutes, setPastMeetingMinutes] = useState([]);
    const [MMTableLoaded, setMMTableLoaded] = useState(false);
    const [MMLoaded, setMMLoaded] = useState(false);
    let signatureCanvases = {
      masterSignatureCanvas: {},
      chiefOfficerSignatureCanvas: {},
      chiefEngineerSignatureCanvas: {},
      secondOfficerSignatureCanvas: {}
    };

    const setSignatureCanvasRef = (ref, canvas) =>  {
      if(meetingMinutes.general[CanvasToSignatureMap[canvas]] && ref){
        if(ref.isEmpty()){
          ref.fromDataURL(meetingMinutes.general[CanvasToSignatureMap[canvas]]);
        }
      }
      signatureCanvases[canvas] =  ref;
    }
    const clearCanvas = (canvas) =>  {
      let temp = meetingMinutes.general;
      temp[CanvasToSignatureMap[canvas]] = null;
      setMeetingMinutes({...meetingMinutes, general: temp});
      signatureCanvases[canvas].clear();
    }
    const updateSignature = canvas => {
      let temp = meetingMinutes.general;
      if(signatureCanvases[canvas].isEmpty()){
        temp[CanvasToSignatureMap[canvas]] = null;
      }
      else{
        temp[CanvasToSignatureMap[canvas]] =  signatureCanvases[canvas].toDataURL('image/png');
      }
        setMeetingMinutes({...meetingMinutes, general: temp});
    }

    const [signAllowed, setSignAllowed] = useState({
      master: false,
      chiefOfficer: false,
      chiefEngineer: false,
      secondOfficer: false
    })
    
    async function getPastMeetingMinutes(callback) {
      MeetingMinuteApi.ListMeetingMinutes((result, err)=>{
        if(!err)
          setPastMeetingMinutes(result);
        setMMTableLoaded(true);
        callback(result, err);
      })
    }

    const resetPastMeetingMinutes = () => {
      setPastMeetingMinutes([]);
      setMMTableLoaded(false);
    }

    const getMeetingMinutes = id => {
      if (id != undefined) {
        MeetingMinuteApi.GetMeetingMinute(id, (result, err)=>{
          console.log(result, err)
          if(!err){
            setMeetingMinutes(result);
          }
          setMMLoaded(true);     
        })
      }
      else{
        let temp = {...MMDatastructure}
        temp.general.masterSignature = null;
        temp.general.chiefOfficerSignature = null;
        temp.general.chiefEngineerSignature = null;
        temp.general.secondOfficerSignature = null;

        console.log(temp);
        setMeetingMinutes(temp);
        setMMLoaded(true);
      }
    }

    const resetMeetingMinutes = () => {
        setMeetingMinutes({});
        setMMLoaded(false);
        setSignAllowed({
          master: false,
          chiefOfficer: false,
          chiefEngineer: false,
          secondOfficer: false
        });

        signatureCanvases = {
          masterSignatureCanvas: {},
          chiefOfficerSignatureCanvas: {},
          chiefEngineerSignatureCanvas: {},
          secondOfficerSignatureCanvas: {}
        }
    }

    async function postMeetingMinutes (values, callback) {
      console.log(values);
      await MeetingMinuteApi.PostMeetingMinute(values, (result, error)=>{
        callback(result, error);
      })
    }

    return (
        <MeetingMinutesContext.Provider value={{ 
          MMTableLoaded, pastMeetingMinutes, setPastMeetingMinutes, getPastMeetingMinutes, resetPastMeetingMinutes,
          MMLoaded, meetingMinutes, setMeetingMinutes, getMeetingMinutes, resetMeetingMinutes, postMeetingMinutes,
          signatureCanvases, setSignatureCanvasRef, clearCanvas, updateSignature, signAllowed, setSignAllowed
          }} {...props}>
            {props.children}
        </MeetingMinutesContext.Provider>
    );
}
const withMeetingMinutes = Component => {
    const C = props => {
      const { wrappedComponentRef, ...remainingProps } = props;
      return (
        <MeetingMinutesContext.Consumer>
          {context => {
                return (
                <Component
                    {...remainingProps}
                    {...context}
                    ref={wrappedComponentRef}
                />
                );
          }}
        </MeetingMinutesContext.Consumer>
      );
    };
    C.WrappedComponent = Component;
    return C;
  }
export { MeetingMinutesContext, useMeetingMinutes, MeetingMinutesProvider, withMeetingMinutes}