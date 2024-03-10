import React, { useState } from "react";
import deepCopy from "../../Helper/GeneralFunc/deepCopy";
import VesselBreakdownAPI123 from "../../model/VesselBreakdown";
import moment from "moment-timezone";

const VesselBreakdownContext = React.createContext();
const useVesselBreakdown = () => React.useContext(VesselBreakdownContext);

const VesselBreakdownProvider = (props) => {
    const VesselBreakdownAPI = new VesselBreakdownAPI123();
    const [VesselBreakdownTableLoaded, setVesselBreakdownTableLoaded] = useState(false);
    const [VesselBreakdownLoaded, setVesselBreakdownLoaded] = useState(true);
    const [VesselBreakdownList, setVesselBreakdownList] = useState({});
    const [VesselBreakdown, setVesselBreakdown] = useState({});
    const [VesselName, setVesselName] = useState('');
    const VESSELBREAKDOWNTABLEIDENTIFIER = '/vesselbreakdowntable';
    const VESSELBREAKDOWNIDENTIFIER = '/vesselbreakdown';

    const vesselBreakdownTemplate = {
        vesselId : null,
        vesselName : null,
        breakdownDatetime : null,
        backToOperationDatetime : null,
        reason : null,
        status : null,
        support: {
            superintendent : null,
            category : null,
            remarks : null,
            vesselReplacement : null,
            vesselCondition : null
        }
    }
	
	const createVesselBreakdown = () => {
		let vesselBreakdownData = deepCopy(vesselBreakdownTemplate);
		return vesselBreakdownData;
	}

    const canViewVesselBreakdownPage = vesselId => {
        let temp = new Promise((res, rej) =>{
            try{
                VesselBreakdownAPI.CanViewVesselBreakdownPage(vesselId, async (value, err) => {
                    if(!err){
                        if (value === true || value === 'true') {
                            res({success: true});
                        }
                        else
                            res({success: false, err: err});
                    }
                    else {
                        res({err: err});
                    }
                });
            }catch(err){
                rej(err);
            }
        })
        return temp;
    }

    const getVesselBreakdownList = async (vesselId,isManagement) => {
        setVesselBreakdownTableLoaded(false);
        try{
            const BreakdownList = await VesselBreakdownAPI.GetVesselBreakdownData(vesselId,isManagement);
            setVesselName(BreakdownList.vesselName);
            setVesselBreakdownList(BreakdownList.events);
            setVesselBreakdownTableLoaded(true);
            return ({success: true, vesselName: BreakdownList.vesselName, vesselId: BreakdownList.vesselId, events: BreakdownList.events})
        }catch(error) {
            console.log("Getting Data Error:", error);
            return ({success: false, error});
        }
    };

    const resetVesselBreakdownTable = () => {
        VesselBreakdownTableLoaded(false);
    };
    const resetVesselBreakdown = () => {
        setVesselBreakdownLoaded(false);
        setVesselBreakdownTableLoaded(false);
    };
    const unlockVesselBreakdown = vesselId => {
        VesselBreakdownAPI.UnlockVesselBreakdownPage(vesselId, (value, err) => {
        })
    };
    const saveVesselBreakdown = async(vesselBreakdown) => {
        return await VesselBreakdownAPI.PostVesselBreakdownRecords(vesselBreakdown, 'save');
    };
    const submitVesselBreakdown = async (vesselBreakdown) => {
        vesselBreakdown.dateSubmitted = new Date();
        const submitValue = await VesselBreakdownAPI.PostVesselBreakdownRecords(vesselBreakdown, 'submit');
        return submitValue;
    };

    const deleteVesselBreakdown = async (eventId) => {
        return await VesselBreakdownAPI.DeleteVesselBreakdown(eventId);
    }

    const vesselDowntimeStatusChange = async (event) => {
        return await VesselBreakdownAPI.vesselDowntimeStatusChange(event);
    }

    return (
        <VesselBreakdownContext.Provider
            value={{
                VesselBreakdownTableLoaded,
                resetVesselBreakdownTable,
                submitVesselBreakdown,
                VesselBreakdownLoaded,
                VesselBreakdownList,
                setVesselBreakdownList,
                VesselBreakdown,
                setVesselBreakdown,
                getVesselBreakdownList,
                resetVesselBreakdown,
                unlockVesselBreakdown,
                saveVesselBreakdown,
                VESSELBREAKDOWNTABLEIDENTIFIER,
                VESSELBREAKDOWNIDENTIFIER,
                vesselBreakdownTemplate,
                canViewVesselBreakdownPage,
                deleteVesselBreakdown,
                vesselDowntimeStatusChange
            }}
            {...props}
        >
            {props.children}
        </VesselBreakdownContext.Provider>
    );
};
const withVesselBreakdown = (Component) => {
    const C = (props) => {
        const { wrappedComponentRef, ...remainingProps } = props;
        return (
            <VesselBreakdownContext.Consumer>
                {(context) => {
                    return (
                        <Component
                            {...remainingProps}
                            {...context}
                            ref={wrappedComponentRef}
                        />
                    );
                }}
            </VesselBreakdownContext.Consumer>
        );
    };
    C.WrappedComponent = Component;
    return C;
};
export {
    VesselBreakdownContext,
    useVesselBreakdown,
    VesselBreakdownProvider,
    withVesselBreakdown,
};
