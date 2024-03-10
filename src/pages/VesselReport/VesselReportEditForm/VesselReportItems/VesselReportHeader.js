import React, { useState } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import Spinner from 'react-bootstrap/Spinner'
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import SendIcon from '@material-ui/icons/Send';
import config from '../../../../config/config';
import { setNestedObjectValues } from 'formik';

import {withMessageManager} from '../../../../Helper/Message/MessageRenderer';

import ConfirmSubmit from './ConfirmSubmit';
import ConfirmSave from './ConfirmSave';

const VesselReportHeader = props => {
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(false);
    const [showConfirmSave, setShowConfirmSave] = useState(false);
    const [savingStatus, setSavingStatus] = useState(false);
    const checkErrors = (errors) => {
        if(errors && errors instanceof Object){
            let temp = Object.keys(errors)[0];
            if(temp){
                switch(temp) {
                    case 'allCrews':
                      return "Crew on Board"
                    case 'aircons':
                      return "Air Conditioning"
                    case 'captain':
                      return 'Acknowledgements'
                    case 'chiefEngineer':
                      return 'Acknowledgements'
                    case 'decklogs':
                      return 'Deck Log Info'
                    case 'engines':
                      return 'Engines'
                    case 'generators':
                      return 'Engines'
                    case 'rob':
                      return 'Consumables ROB'
                    case 'tanksoundings':
                      return 'Tank Soundings'
                    case 'zpClutch':
                      return 'Azimuth Thruster'
                    default:
                      return ''
                }
            }
            else return '';
        }
        else return '';
    }
    return(
        <React.Fragment>
            <div className="VesselReportHeaderBase" style={{marginBottom: "50px"}}>
                    <div className="VesselReportNote">
                        <div>{props.notes}</div>
                        <div>Press save to continue logging offline if connectivity is not stable</div>
                    </div>
                    <div className="VesselReportHeaderBackground">
                      <div className="VesselReportHeading">
                        {props.dailyLog === true && props.webUrl === true ? "BACK DATED DAILY LOG" : props.dailyLog === true ? "DAILY LOG" : props.webUrl === false ? "VESSEL REPORT FORM" : "BACK DATED VESSEL REPORT FORM"}
                      </div>
                      <div className="VesselReportSubheading">{props.heading}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', paddingRight: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                        {props.submitButton===true&&
                            <Button variant="contained" type={'submit'} style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px' }} 
                                onClick={async ()=>{
                                  const errors = await props.validateForm();
                                  if (Object.keys(errors).length === 0) {
                                    setShowConfirmSubmit(true)
                                  } else {
                                    props.setTouched(setNestedObjectValues(errors, true));
                                    let errorName = checkErrors(errors);
                                    if(typeof(errorName)==='string' && errorName!==''){
                                        props.setMessages([{type : "danger", message : `Missing input in ${errorName}`}]);
                                    }
                                  }
                                }}
                                disabled={showConfirmSubmit===true||props.isSubmit===true}
                            >
                                {showConfirmSubmit===true||props.isSubmit===true?
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                                :
                                    <SendIcon style={{ color: config.KSTColors.ICON }}/>
                                } 
                                <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Submit</span>
                            </Button>
                        }
                        {props.webUrl === false ? 
                          (<Tooltip style={{ backgroundColor: "white" }} title="Save your work to continue later" >
                            <Button variant="contained"
                              style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: "8px", paddingLeft: "30px", paddingRight: "30px", }}
                              onClick={() => {
                                if (props.saved === true) {
                                  setSavingStatus(true);
                                  props.saveForm();
                                } else {
                                  setShowConfirmSave(true);
                                }
                              }}
                              disabled={showConfirmSubmit === true || props.isSubmit === true}
                            >
                              {showConfirmSave === true || savingStatus === true ? (
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                              ) : ( <SaveAltIcon style={{ color: config.KSTColors.ICON }} /> )}
                              <span style={{ color: config.KSTColors.WHITE, paddingLeft: "10px" }} > Save </span>
                            </Button>
                          </Tooltip>) 
                        : 
                          ( <Button style={{ display: "none" }} /> )
                        }
                    </div>
            </div>
            <ConfirmSubmit
              show={showConfirmSubmit}
              hide={() => setShowConfirmSubmit(false)}
              submit={props.submit}
              submitStatus = {submitStatus}
              setSubmitStatus = {setSubmitStatus}
            />
            <ConfirmSave
              show={showConfirmSave}
              hide={() => setShowConfirmSave(false)}
              save={props.saveForm}
              savingStatus = {savingStatus}
              setSavingStatus = {setSavingStatus}
            />
        </React.Fragment>
    );
}

export default withMessageManager(VesselReportHeader);