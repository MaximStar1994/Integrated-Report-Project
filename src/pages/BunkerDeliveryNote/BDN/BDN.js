import React from 'react';
import {withRouter} from 'react-router-dom'
import { Container, Row, Col, Card, Form, FormControl } from 'react-bootstrap'
import '../../../css/App.css';
import '../../../css/Dashboard.css';

import FullScreenSpinner from '../../../components/FullScreenSpinner/FullScreenSpinner'

import { withLayoutManager } from '../../../Helper/Layout/layout'
import {withMessageManager} from '../../../Helper/Message/MessageRenderer'
import BunkerDelivery, {getCombustionTempToId} from '../../../model/BunkerDeliveryNote';
import { Button } from '@material-ui/core';

import { Formik } from "formik";
import * as Yup from "yup";
import SignatureCanvas from 'react-signature-canvas'
import moment from 'moment';
import Spinner from 'react-bootstrap/Spinner'

import DisplayCard from './DisplayCard';
import Delivery_ReceiverCard from './Delivery_ReceiverCard';
import AdditionalInputCard from './AdditionalInputCard';
import EventsCard from './EventsCard';
import QtyDeliveredInputCard from './QtyDeliveredInputCard';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { callbackify } from 'util';

import watermark from '../../../assets/VesselCare-Lite_logo/0x/logo.png'

// const LNGPorpertiesAutofillColor = 'rgba(5, 100, 255, 100)';
const LNGPorpertiesAutofillColor = '#00FFA6';
const QtyAutofillColor = '#FFA500';

const CombstionTempToID = getCombustionTempToId()

const MeteringTempToID = {
    '': null,
    '0': 1,
    '15': 2,
    '15.5': 3,
    '20': 4,
    '25': 5 
}

const dataSet = {
    bdnNo: '',
    bdnNumber: '',
    dateOfBDN: '',
    supplier: '',
    shellReference: '',
    deliveringVesselName: '',
    deliveringVesselNo: '',
    portOfLoading: '',
    receiver: '',
    receiverReference: '',
    receivingVesselName: '',
    receivingVesselNo: '',
    deliveryPoint: '',
    nextDest: '',
    combustionTemperatureId: 1,
    meteringTemperatureId: 1,
    vesselArrivalDate: null,
    vesselAllfastDate: null,
    hoseConnectedDate: null,
    openMeasurementCompletedDate: null,
    startTransferDate: null,
    completeTransferDate: null,
    hoseDrainedDate: null,
    hoseDisconnectedDate: null,
    closeMeasurementCompletedDate: null,
    paperWorkCompletedDate: null,
    methane: '',
    ethane: '',
    propane: '',
    isoButane: '',
    nButane: '',
    isoPentane: '',
    nPentane: '',
    nHexane: '',
    nitrogen: '',
    sulphur: '',
    methaneNumber: '',
    grossHeatingValueMass: '',
    netHeatingValueMass: '',
    grossHeatingValueVol: '',
    netHeatingValueVol: '',
    grossWobbeIndex: '',
    netWobbeIndex: '',
    density: '',
    arrivalVaporPressure: '',
    lngTemperatureDelivered: '',
    vaporTempAfterTransfer: '',
    vaporPressureAfterTransfer: '',
    vaporEnergyIncluded: null,
    volume: '',
    mass: '',
    grossEnergy: '',
    vaporDisplaced: '',
    gasConsumed: '',
    netEnergyMMbtu: '',
    netEnergyMWh: '',
    lngSupplierName: '',
    vesselRepresentativeName: ''
}

class BDN extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loaded: false,
            confirmSubmitBox: false,
            online: false,
            supplierSignAllowed: false,
            supplierPassword: '',
            supplierPasswordError: '',
            ...dataSet
        };
        this.bdnApi = new BunkerDelivery()
        this.LNGSupplierCanvas = null
        this.VesselRepresentativeCanvas = null
        this.validationSchema = Yup.object().shape({
            bdnNumber: Yup.string().required('Please input BDN No.'),
            supplier: Yup.string().required('Please input Supplier'),
            shellReference: Yup.string().required('Please input Shell Reference'),
            deliveringVesselName: Yup.string().required('Please input Delivering Vessel Name'),
            deliveringVesselNo: Yup.string().required('Please input Delivering Vessel No'),
            portOfLoading: Yup.string().required('Please input Port Of Loading'),
            receiver: Yup.string().required('Please input Receiver'),
            receiverReference: Yup.string().required('Please input Receiver Reference'),
            receivingVesselName: Yup.string().required('Please input Receiving Vessel Name'),
            receivingVesselNo: Yup.string().required('Please input Receiving Vessel No'),
            deliveryPoint: Yup.string().required('Please input Delivery Point'),
            nextDest: Yup.string().required('Please input Receiving Vessel\'s Next Destination'),
            // combustionTempDeg: Yup.string().required('Please input Combustion Temperature'),
            sulphur: Yup.number().required('Please input Sulphur'),
            vaporEnergyIncluded: Yup.bool().required('Please input Vapor Return Energy Included?'),
            lngTemperatureDelivered: Yup.number().required('Please input LNG Temperature Delivered'),
            arrivalVaporPressure: Yup.number().required('Please input Arrival Vapor Pressure'),
            vaporTempAfterTransfer: Yup.number().required('Please input Vapor Temperature After Transfer'),
            vaporPressureAfterTransfer: Yup.number().required('Please input Vapor Pressure After Transfer'),
            methane: Yup.number().required('Please input Methane'),
            ethane: Yup.number().required('Please input Ethane'),
            propane: Yup.number().required('Please input Propane'),
            isoButane: Yup.number().required('Please input iso-Butane'),
            nButane: Yup.number().required('Please input n-Butane'),
            isoPentane: Yup.number().required('Please input iso-Pentane'),
            nPentane: Yup.number().required('Please input n-Pentane'),
            nHexane: Yup.number().required('Please input n-Hexane'),
            nitrogen: Yup.number().required('Please input Nitrogen'),
            methaneNumber: Yup.number().required('Please input Methane Number'),
            grossHeatingValueMass: Yup.number().required('Please input Gross Heating Value'),
            netHeatingValueMass: Yup.number().required('Please input Net Heating Value'),
            grossHeatingValueVol: Yup.number().required('Please input Gross Heating Value'),
            netHeatingValueVol: Yup.number().required('Please input Net Heating Value'),
            density: Yup.number().required('Please input Density'),
            grossWobbeIndex: Yup.number().required('Please input Gross Wobbe Index'),
            netWobbeIndex: Yup.number().required('Please input Net Wobbe Index'),
            volume: Yup.number().required('Please input Volume'),
            netEnergyMMbtu: Yup.number().required('Please input Net Energy'),
            netEnergyMWh: Yup.number().required('Please input Net Energy'),
            quantityConsumed: Yup.number().required('Please input Quantity Consumed'),
            lngSupplierName: Yup.string().required('Please input LNG Supplier Name'),
            // vesselRepresentativeName: Yup.string().required('Please input Vessel Representative Name'),
        });
        this.labelProps={style : {color : "white"}}
    }
    componentDidMount() {
        this.bdnApi.CanViewBDNPage((value, err) => {
            if(value===true||value==="true"){
                this.bdnApi.GetOpenBDN((data,err) => {
                    let tempData = {...dataSet};
                    for (let [key, value] of Object.entries(tempData)) {
                        tempData[key] = data[key]||(data[key]===0?data[key]:tempData[key]);
                    }
                    tempData.bdnNo = parseInt(this.props.match.params.BDNNo)
                    tempData.dateOfBDN = moment(data.generatedDate).format('YYYY-MM-DD');
                    tempData.vaporEnergyIncluded = data.vaporEnergyIncluded === 1 ? true : false;
                    tempData.netEnergyMMbtu = data.netEnergy||(data.netEnergy===0?data.netEnergy:'');
                    tempData.netEnergyMWh = data.netEnergy||(data.netEnergy===0?data.netEnergy:'');
                    tempData.loaded = true;
                    tempData.quantityConsumed = data.quantityConsumed
                    this.setState({ ...tempData });
                })
                this.bdnApi.ListBunkerDeliveryNoteData((data, online) => {
                    this.setState({ online: online });
                })
            }
            else{
                this.props.setMessages([{type : "danger", message : "Another device is currently in use!"}]);
                this.props.history.push('/bunkerdelivery');
            }
        });
    }

    componentWillUnmount(){
        this.bdnApi.UnlockBDNPage((value, error)=> {
            console.log(value, error);
        });
    }

    autoFill(values) {
        this.setState({loaded : false});
        this.saveForm(values,false, ()=>{
            this.bdnApi.GetBunkerDeliveryNoteData(this.props.match.params.BDNNo, (data,err) => {
                if(err){
                    console.log('Error occured');
                    this.props.setMessages([{type : "danger", message : "No internet!"}]);
                    this.setState({ loaded: true });
                }
                else{
                    let tempData = {...dataSet};
                    for (let [key, value] of Object.entries(tempData)) {
                        tempData[key] = data[key]||(data[key]===0?data[key]:tempData[key]);
                    }
                    data.vaporEnergyIncluded = data.vaporEnergyIncluded === 1 ? true : false;
                    var currState = this.state
                    Object.assign(currState,data)
                    currState = this.bdnApi.Calculate(currState)
                    this.saveForm(currState,false)
                    currState.loaded = true
                    this.setState(currState);
                }
            });
        })
    }
    autoFillAfterTransfer(values) {
        this.setState({loaded : false});
        this.saveForm(values,false, ()=>{
            this.bdnApi.GetBunkerDeliveryNoteDataAfterTransfer(this.props.match.params.BDNNo, (data,err) => {
                if(err){
                    console.log('Error occured');
                    this.props.setMessages([{type : "danger", message : "No internet!"}]);
                    this.setState({ loaded: true });
                }
                else{
                    var currState = this.state
                    console.log(currState);
                    Object.assign(currState,data)
                    currState = this.bdnApi.Calculate(currState)
                    this.saveForm(currState,false)
                    currState.loaded = true
                    this.setState(currState);
                }
            });
        })
    }

    saveForm = (values,showBanner = true, callback=() => {}) => {
        let data = {
            "reportId" : values.bdnNo,
            "bdnNumber": values.bdnNumber,
            "supplier": values.supplier,
            "shellReference": values.shellReference,
            "deliveringVesselName": values.deliveringVesselName,
            "deliveringVesselNo": values.deliveringVesselNo,
            "portOfLoading": values.portOfLoading,
            "receiver": values.receiver,
            "receiverReference": values.receiverReference,
            "receivingVesselName": values.receivingVesselName,
            "receivingVesselNo": values.receivingVesselNo,
            "deliveryPoint": values.deliveryPoint,
            "nextDest": values.nextDest,
            "vesselArrivalDate": values.vesselArrivalDate,
            "vesselAllfastDate": values.vesselAllfastDate,
            "hoseConnectedDate": values.hoseConnectedDate,
            "openMeasurementCompletedDate": values.openMeasurementCompletedDate,
            "startTransferDate": values.startTransferDate,
            "completeTransferDate": values.completeTransferDate,
            "hoseDrainedDate": values.hoseDrainedDate,
            "hoseDisconnectedDate": values.hoseDisconnectedDate,
            "closeMeasurementCompletedDate": values.closeMeasurementCompletedDate,
            "paperWorkCompletedDate": values.paperWorkCompletedDate,
            "combustionTemperatureId": values.combustionTemperatureId,
            "meteringTemperatureId": values.meteringTemperatureId,
            "vaporEnergyIncluded": values.vaporEnergyIncluded,
            "sulphur": values.sulphur,
            "lngTemperatureDelivered" : values.lngTemperatureDelivered,
            "arrivalVaporPressure" : values.arrivalVaporPressure,
            "vaporTempAfterTransfer": values.vaporTempAfterTransfer,
            "vaporPressureAfterTransfer": values.vaporPressureAfterTransfer,
            "volume": values.volume,
            "lngSupplierName": values.lngSupplierName,
            "vesselRepresentativeName": values.vesselRepresentativeName,
            "autoFillTime": values.autoFillTime,
            "carbonDioxide": values.carbonDioxide,
            "density": values.density,
            "ethane": values.ethane,
            "grossWobbeIndex": values.grossWobbeIndex,
            "isoButane": values.isoButane,
            "isoPentane": values.isoPentane,
            "methane": values.methane,
            "methaneNumber": values.methaneNumber,
            "nButane": values.nButane,
            "nHexane": values.nHexane,
            "nPentane": values.nPentane,
            "netEnergyMMbtu": values.netEnergyMMbtu,
            "netEnergyMWh": values.netEnergyMWh,
            "netEnergy": values.netEnergy || values.netEnergyMWh,
            "quantityConsumed" : values.quantityConsumed,
            "netWobbeIndex": values.netWobbeIndex,
            "nitrogen": values.nitrogen,
            "oxygen": values.oxygen,
            "propane": values.propane,
            "grossHeatingValueMass": values.grossHeatingValueMass,
            "netHeatingValueMass": values.netHeatingValueMass,
            "grossHeatingValueVol": values.grossHeatingValueVol,
            "netHeatingValueVol": values.netHeatingValueVol,
            "mass": values.mass,
            "grossEnergy": values.grossEnergy,
            "vaporDisplaced": values.vaporDisplaced,
            "gasConsumed": values.gasConsumed,
            "lastUpdateTime": new Date()
        }
        this.bdnApi.UpdateBunkerDeliveryNoteData(values.bdnNo, data,(dataReturn, error) => {
            if(!error){
                if (showBanner) {
                    this.props.setMessages([{type : "success", message : "Form Saved!"}])
                    window.scrollTo(0,0);
                }
            }
            var currState = this.state
            Object.assign(currState, dataReturn)
            currState.showSaveSpinner = false
            callback()
            this.setState(currState)
        });
        this.setState({showSaveSpinner : true});
    }

    AddWaterMark(signatureCanvas, callback) {
        var cnvs = signatureCanvas.getCanvas()
        var ctx = cnvs.getContext("2d")
        var watermarkImg = new Image(cnvs.width, cnvs.height)
        var signature = new Image(cnvs.width, cnvs.height)
        watermarkImg.src = watermark
        signature.src = signatureCanvas.toDataURL('image/png')
        var imagesLoaded = 0
        signature.onload = () => {
            imagesLoaded += 1
            if (imagesLoaded == 2) {
                ctx.clearRect(0,0,cnvs.width, cnvs.height)
                ctx.drawImage(watermarkImg,0,0,cnvs.width, cnvs.height)
                ctx.drawImage(signature,0,0,cnvs.width, cnvs.height)
                callback(signatureCanvas.toDataURL('image/png'))
            }
        }
        watermarkImg.onload = () => {
            imagesLoaded += 1
            if (imagesLoaded == 2) {
                ctx.clearRect(0,0,cnvs.width, cnvs.height)
                ctx.drawImage(watermarkImg,0,0,cnvs.width, cnvs.height)
                ctx.drawImage(signature,0,0,cnvs.width, cnvs.height)
                callback(signatureCanvas.toDataURL('image/png'))
            }
        }
    }

    submitForm = values => {
        this.AddWaterMark(this.LNGSupplierCanvas,(signature) => {
            values.lngSupplierSignature = signature
            this.submitFormAfterParsing(values)
        })
    }
    submitFormAfterParsing = values => {
        let data = {
            "reportId" : values.bdnNo,
            "bdnNumber": values.bdnNumber,
            "supplier": values.supplier,
            "shellReference": values.shellReference,
            "deliveringVesselName": values.deliveringVesselName,
            "deliveringVesselNo": values.deliveringVesselNo,
            "portOfLoading": values.portOfLoading,
            "receiver": values.receiver,
            "receiverReference": values.receiverReference,
            "receivingVesselName": values.receivingVesselName,
            "receivingVesselNo": values.receivingVesselNo,
            "deliveryPoint": values.deliveryPoint,
            "nextDest": values.nextDest,
            "vesselArrivalDate": values.vesselArrivalDate,
            "vesselAllfastDate": values.vesselAllfastDate,
            "hoseConnectedDate": values.hoseConnectedDate,
            "openMeasurementCompletedDate": values.openMeasurementCompletedDate,
            "startTransferDate": values.startTransferDate,
            "completeTransferDate": values.completeTransferDate,
            "hoseDrainedDate": values.hoseDrainedDate,
            "hoseDisconnectedDate": values.hoseDisconnectedDate,
            "closeMeasurementCompletedDate": values.closeMeasurementCompletedDate,
            "paperWorkCompletedDate": values.paperWorkCompletedDate,
            "combustionTemperatureId": values.combustionTemperatureId,
            "lngTemperatureDelivered" : values.lngTemperatureDelivered,
            "arrivalVaporPressure" : values.arrivalVaporPressure,
            "vaporTempAfterTransfer": values.vaporTempAfterTransfer,
            "vaporPressureAfterTransfer": values.vaporPressureAfterTransfer,
            "sulphur": values.sulphur,
            "vaporEnergyIncluded": values.vaporEnergyIncluded ? 1: 0,
            "volume": values.volume,
            "lngSupplierName": values.lngSupplierName,
            "LNGSupplierSignature":  values.lngSupplierSignature,
            // "VesselRepresentativeSignature": this.VesselRepresentativeCanvas.toDataURL('image/png'),
            "vesselRepresentativeName": values.vesselRepresentativeName,
            "autoFillTime": values.autoFillTime,
            "carbonDioxide": values.carbonDioxide,
            "density": values.density,
            "ethane": values.ethane,
            "grossWobbeIndex": values.grossWobbeIndex,
            "isoButane": values.isoButane,
            "isoPentane": values.isoPentane,
            "methane": values.methane,
            "methaneNumber": values.methaneNumber,
            "nButane": values.nButane,
            "nHexane": values.nHexane,
            "nPentane": values.nPentane,
            "netEnergyMMbtu": values.netEnergyMMbtu,
            "netEnergyMWh": values.netEnergyMWh,
            "netEnergy": values.netEnergy || values.netEnergyMWh,
            "netWobbeIndex": values.netWobbeIndex,
            "nitrogen": values.nitrogen,
            "oxygen": values.oxygen,
            "propane": values.propane,
            "grossHeatingValueMass": values.grossHeatingValueMass,
            "netHeatingValueMass": values.netHeatingValueMass,
            "grossHeatingValueVol": values.grossHeatingValueVol,
            "netHeatingValueVol": values.netHeatingValueVol,
            "mass": values.mass,
            "grossEnergy": values.grossEnergy,
            "vaporDisplaced": values.vaporDisplaced,
            "gasConsumed": values.gasConsumed,
            "quantityConsumed" : values.quantityConsumed
        }
        this.setState({ showSubmitSpinner : true });
        this.bdnApi.UpdateBunkerDeliveryNoteData(values.bdnNo, data,() => {
            this.bdnApi.GenerateBunkerDeliveryNote(values.bdnNo, data,(data, error) => {
                if(!error){
                    this.props.setMessages([{type : "success", message : "Form Saved!"}])
                    window.scrollTo(0,0);
                    this.props.history.push('/bunkerdelivery')
                }
                this.setState({showSubmitSpinner : false, confirmSubmitBox: false})
            })
        })
    }

    checkEvents(values){
        if(!values.vesselArrivalDate){
            this.props.setMessages([{type : "danger", message : "Please input value for Vessel Arrival"}])
        }
        else if(!values.vesselAllfastDate){
            this.props.setMessages([{type : "danger", message : "Please input value for Vessel Allfast"}])
        }
        else if(!values.hoseConnectedDate){
            this.props.setMessages([{type : "danger", message : "Please input value for Hose Connected"}])
        }
        else if(!values.openMeasurementCompletedDate){
            this.props.setMessages([{type : "danger", message : "Please input value for Open Measurement Completed"}])
        }
        else if(!values.startTransferDate){
            this.props.setMessages([{type : "danger", message : "Please input value for Start Transfer"}])
        }
        else if(!values.completeTransferDate){
            this.props.setMessages([{type : "danger", message : "Please input value for Complete Transfer"}])
        }
        else if(!values.hoseDrainedDate){
            this.props.setMessages([{type : "danger", message : "Please input value for Hose Drained/Purged"}])
        }
        else if(!values.hoseDisconnectedDate){
            this.props.setMessages([{type : "danger", message : "Please input value for Hose Disconnected"}])
        }
        else if(!values.closeMeasurementCompletedDate){
            this.props.setMessages([{type : "danger", message : "Please input value for Close Measurement Completed"}])
        }
        else if(!values.paperWorkCompletedDate){
            this.props.setMessages([{type : "danger", message : "Please input value for Paperwork Completed"}])
        }
        else{
            return true;
        }
        window.scrollTo(0,0);
        return false;
    }
    UnlockSupplierSignature = (value) =>{
        value==='Supplier@123'?this.setState({ supplierSignAllowed: true, supplierPasswordError: ''}):this.setState({ supplierSignAllowed: false, supplierPasswordError: 'Invalid Password, Try Again!'});
    }

    renderForm() {
        let init = { ...this.state };
        delete init.loaded;
        delete init.confirmSubmitBox;

        return (
            <Formik
                initialValues={init}
                validationSchema={this.validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    if(this.checkEvents(values)){
                        // if(this.VesselRepresentativeCanvas.isEmpty() || this.LNGSupplierCanvas.isEmpty()){
                        if(!this.LNGSupplierCanvas || this.LNGSupplierCanvas.isEmpty()){
                            this.props.setMessages([{type : "danger", message : "Signatures are mandatory to submit!"}])
                            window.scrollTo(0,0);
                        }
                        else{
                            this.setState({ confirmSubmitBox: true });
                            setSubmitting(false)
                        }
                    }
                }}
            >
            {({values,errors,touched,handleChange,setFieldValue,handleSubmit,isSubmitting,setSubmitting, validateForm})=> 
            {
                let deliveryDetailsData = [
                    {'label': "BDN No.", value: values.bdnNumber, field: 'bdnNumber', touched: touched.bdnNumber, error: errors.bdnNumber},
                    {'label': "Date Of BDN", disabled: true, value: values.dateOfBDN, field: 'dateOfBDN', touched: touched.dateOfBDN, error: errors.dateOfBDN},
                    {'label': "Supplier", value: values.supplier, field: 'supplier', touched: touched.supplier, error: errors.supplier},
                    {'label': "Shell Reference", value: values.shellReference, field: 'shellReference', touched: touched.shellReference, error: errors.shellReference},
                    {'label': "Delivering Vessel Name", value: values.deliveringVesselName, field: 'deliveringVesselName', touched: touched.deliveringVesselName, error: errors.deliveringVesselName},
                    {'label': "Delivering Vessel IMO No", value: values.deliveringVesselNo, field: 'deliveringVesselNo', touched: touched.deliveringVesselNo, error: errors.deliveringVesselNo},
                    {'label': "Port Of Loading", value: values.portOfLoading, field: 'portOfLoading', touched: touched.portOfLoading, error: errors.portOfLoading}, 
                ];
                let receiverDetailsData = [
                    {'label': "Receiver", value: values.receiver, field: 'receiver', touched: touched.receiver, error: errors.receiver},
                    {'label': "Receiver's Reference", value: values.receiverReference, field: 'receiverReference', touched: touched.receiverReference, error: errors.receiverReference},
                    {'label': "Receiving Vessel's Name", value: values.receivingVesselName, field: 'receivingVesselName', touched: touched.receivingVesselName, error: errors.receivingVesselName},
                    {'label': "Receiving Vessel IMO No", value: values.receivingVesselNo, field: 'receivingVesselNo', touched: touched.receivingVesselNo, error: errors.receivingVesselNo},
                    {'label': "Delivery Point", value: values.deliveryPoint, field: 'deliveryPoint', touched: touched.deliveryPoint, error: errors.deliveryPoint},
                    {'label': "Receiving Vessel's Next Destination", value: values.nextDest, field: 'nextDest', touched: touched.nextDest, error: errors.nextDest},
                ];
                let additionalInputDetailsData1 = {
                    combustionTempDeg: {'label': <span>Combustion Temp. <span style={{ color: LNGPorpertiesAutofillColor, fontSize: '1.4rem' }}>*</span></span>, type: 'selection', value: values.combustionTemperatureId, field: 'combustionTemperatureId', touched: touched.combustionTemperatureId, error: errors.combustionTemperatureId},
                    meteringTempDeg: {'label': "Metering Temp.", type: 'selection', value: values.meteringTemperatureId, field: 'meteringTemperatureId', touched: touched.meteringTemperatureId, error: errors.meteringTemperatureId},
                    sulphur: {'label': "Sulphur", type: 'input', 'suffix': (<><span>mg/Nm</span><sup>3</sup></>), value: values.sulphur, field: 'sulphur', touched: touched.sulphur, error: errors.sulphur},
                    lngTemperatureDelivered: {'label': "Liquid Temperature", type: 'input', 'suffix': <>&#8451;</>, value: values.lngTemperatureDelivered, field: 'lngTemperatureDelivered', touched: touched.lngTemperatureDelivered, error: errors.lngTemperatureDelivered},
                    arrivalVaporPressure: {'label': "Absolute Vapor Pressure", type: 'input', 'suffix': "kPa", value: values.arrivalVaporPressure, field: 'arrivalVaporPressure', touched: touched.arrivalVaporPressure, error: errors.arrivalVaporPressure},
                    vaporTempAfterTransfer: {'label': <span>Liquid Temperature</span>, type: 'display', 'suffix': (<>&#8451;</>), value: values.vaporTempAfterTransfer, field: 'vaporTempAfterTransfer', touched: touched.vaporTempAfterTransfer, error: errors.vaporTempAfterTransfer},
                    vaporPressureAfterTransfer: {'label': <span>Absolute Vapor Pressure</span>, type: 'display', 'suffix': 'kPa', value: values.vaporPressureAfterTransfer, field: 'vaporPressureAfterTransfer', touched: touched.vaporPressureAfterTransfer, error: errors.vaporPressureAfterTransfer},
                    vaporEnergyIncluded: {'label': "Vapor Return Energy Included?", value: values.vaporEnergyIncluded, field: 'vaporEnergyIncluded', touched: touched.vaporEnergyIncluded, error: errors.vaporEnergyIncluded},
                };
                let eventsDetailsData = [
                    {'label': "Vessel Arrived", type: 'date', value: values.vesselArrivalDate, field: 'vesselArrivalDate', touched: touched.vesselArrivalDate, error: errors.vesselArrivalDate},
                    {'label': "Vessel Allfast", type: 'date', value: values.vesselAllfastDate, field: 'vesselAllfastDate', touched: touched.vesselAllfastDate, error: errors.vesselAllfastDate},
                    {'label': "Hose Connected", type: 'date', value: values.hoseConnectedDate, field: 'hoseConnectedDate', touched: touched.hoseConnectedDate, error: errors.hoseConnectedDate},
                    {'label': "Open Measurement Completed", type: 'date', value: values.openMeasurementCompletedDate, field: 'openMeasurementCompletedDate', touched: touched.openMeasurementCompletedDate, error: errors.openMeasurementCompletedDate},
                    {'label': <span>Start Transfer<span style={{ color: LNGPorpertiesAutofillColor, fontSize: '1.4rem' }}>*</span></span>, type: 'date', value: values.startTransferDate, field: 'startTransferDate', touched: touched.startTransferDate, error: errors.startTransferDate},
                    {'label': <span>Complete Transfer<span style={{ color: QtyAutofillColor, fontSize: '1.4rem' }}>*</span></span>, type: 'date', value: values.completeTransferDate, field: 'completeTransferDate', touched: touched.completeTransferDate, error: errors.completeTransferDate},
                    {'label': "Hose Drained/Purged", type: 'date', value: values.hoseDrainedDate, field: 'hoseDrainedDate', touched: touched.hoseDrainedDate, error: errors.hoseDrainedDate},
                    {'label': "Hose Disconnected", type: 'date', value: values.hoseDisconnectedDate, field: 'hoseDisconnectedDate', touched: touched.hoseDisconnectedDate, error: errors.hoseDisconnectedDate},
                    {'label': "Close Measurement Completed", type: 'date', value: values.closeMeasurementCompletedDate, field: 'closeMeasurementCompletedDate', touched: touched.closeMeasurementCompletedDate, error: errors.closeMeasurementCompletedDate},
                    {'label': "Paperwork Completed", type: 'date', value: values.paperWorkCompletedDate, field: 'paperWorkCompletedDate', touched: touched.paperWorkCompletedDate, error: errors.paperWorkCompletedDate},
                ];
                let LNGCompositionDisplayDetailsData = {
                    methane: {'label': "Methane", manual: true, field: 'methane', formula: (<><span>CH</span><sub>4</sub></>), 'suffix': "mol%", value: values.methane||values.methane===0?values.methane:'', touched: touched.methane, error: errors.methane},
                    ethane: {'label': "Ethane", manual: true, field: 'ethane', formula: (<><span>C</span><sub>2</sub><span>H</span><sub>6</sub></>), 'suffix': "mol%", value: values.ethane||values.ethane===0?values.ethane:'', touched: touched.ethane, error: errors.ethane},
                    propane: {'label': "Propane", manual: true, field: 'propane', formula: (<><span>C</span><sub>3</sub><span>H</span><sub>6</sub></>), 'suffix': "mol%", value: values.propane||values.propane===0?values.propane:'', touched: touched.propane, error: errors.propane},
                    isoButane: {'label': "iso-Butane", manual: true, field: 'isoButane', formula: (<><span>i-C</span><sub>4</sub><span>H</span><sub>10</sub></>), 'suffix': "mol%", value: values.isoButane||values.isoButane===0?values.isoButane:'', touched: touched.isoButane, error: errors.isoButane},
                    nButane: {'label': "n-Butane", manual: true, field: 'nButane', formula: (<><span>n-C</span><sub>4</sub><span>H</span><sub>6</sub></>), 'suffix': "mol%", value: values.nButane||values.nButane===0?values.nButane:'', touched: touched.nButane, error: errors.nButane},
                    isoPentane: {'label': "iso-Pentane", manual: true, field: 'isoPentane', formula: (<><span>i-C</span><sub>5</sub><span>H</span><sub>12</sub></>), 'suffix': "mol%", value: values.isoPentane||values.isoPentane===0?values.isoPentane:'', touched: touched.isoPentane, error: errors.isoPentane},
                    nPentane: {'label': "n-Pentane", manual: true, field: 'nPentane', formula: (<><span>n-C</span><sub>5</sub><span>H</span><sub>12</sub></>), 'suffix': "mol%", value: values.nPentane||values.nPentane===0?values.nPentane:'', touched: touched.nPentane, error: errors.nPentane},
                    nHexane: {'label': "n-Hexane", manual: true, field: 'nHexane', formula: (<><span>n-C</span><sub>6</sub><span>H</span><sub>14</sub></>), 'suffix': "mol%", value: values.nHexane||values.nHexane===0?values.nHexane:'', touched: touched.nHexane, error: errors.nHexane},
                    nitrogen: {'label': "Nitrogen", manual: true, field: 'nitrogen', formula: (<><span>N</span><sub>2</sub></>), 'suffix': "mol%", value: values.nitrogen||values.nitrogen===0?values.nitrogen:'', touched: touched.nitrogen, error: errors.nitrogen},
                };
                let checkAutofillRequirement1 = () => {
                    if(values.combustionTemperatureId!==''&&values.combustionTemperatureId!==null && 
                    values.methane!==''&&values.methane!==null && 
                    values.ethane!==''&&values.ethane!==null && 
                    values.propane!==''&&values.propane!==null && 
                    values.isoButane!==''&&values.isoButane!==null && 
                    values.nButane!==''&&values.nButane!==null && 
                    values.isoPentane!==''&&values.isoPentane!==null && 
                    values.nPentane!==''&&values.nPentane!==null && 
                    values.nHexane!==''&&values.nHexane!==null && 
                    values.nitrogen!==''&&values.nitrogen!==null)
                        return true;
                    else
                        return false;
                }
                let LNGPropertiesDisplayDetailsData = {
                    autoFill: { enabled: (values.startTransferDate!==null && values.startTransferDate!== '' && checkAutofillRequirement1()===true), online: this.state.online },
                    grossHeatingValueMass: {'label': "Gross Heating Value (Mass Based)", 'suffix': "MJ/kg", autoFill: true, field: 'grossHeatingValueMass', value: values.grossHeatingValueMass||values.grossHeatingValueMass===0?values.grossHeatingValueMass:'', touched: touched.grossHeatingValueMass, error: errors.grossHeatingValueMass },
                    netHeatingValueMass: {'label': "Net Heating Value (Mass Based)", 'suffix': "MJ/kg", autoFill: true, field: 'netHeatingValueMass', value: values.netHeatingValueMass||values.netHeatingValueMass===0?values.netHeatingValueMass:'', touched: touched.netHeatingValueMass, error: errors.netHeatingValueMass },
                    grossHeatingValueVol: {'label': "Gross Heating Value (Volume Based)", 'suffix': (<><span>MJ/m</span><sup>3</sup></>), autoFill: true, field: 'grossHeatingValueVol', value: values.grossHeatingValueVol||values.grossHeatingValueVol===0?values.grossHeatingValueVol:'', touched: touched.grossHeatingValueVol, error: errors.grossHeatingValueVol },
                    netHeatingValueVol: {'label': "Net Heating Value (Volume Based)", 'suffix': (<><span>MJ/m</span><sup>3</sup></>), autoFill: true, field: 'netHeatingValueVol', value: values.netHeatingValueVol||values.netHeatingValueVol===0?values.netHeatingValueVol:'', touched: touched.netHeatingValueVol, error: errors.netHeatingValueVol },
                    methaneNumber: {'label': "Methane Number", manual: true, field: 'methaneNumber', value: values.methaneNumber||values.methaneNumber===0?values.methaneNumber:'', touched: touched.methaneNumber, error: errors.methaneNumber },
                    density: {'label': <span>Density<span style={{ color: QtyAutofillColor, fontSize: '1.4rem' }}>*</span></span>, 'suffix': (<><span>MJ/m</span><sup>3</sup></>), manual: true, field: 'density', value: values.density||values.density===0?values.density:'', touched: touched.density, error: errors.density },
                    grossWobbeIndex: {'label': "Gross Wobbe Index", 'suffix': (<><span>MJ/m</span><sup>3</sup></>), manual: true, field: 'grossWobbeIndex', value: values.grossWobbeIndex||values.grossWobbeIndex===0?values.grossWobbeIndex:'', touched: touched.grossWobbeIndex, error: errors.grossWobbeIndex },
                    netWobbeIndex: {'label': "Net Wobbe Index", 'suffix': (<><span>MJ/m</span><sup>3</sup></>), manual: true, field: 'netWobbeIndex', value: values.netWobbeIndex||values.netWobbeIndex===0?values.netWobbeIndex:'', touched: touched.netWobbeIndex, error: errors.netWobbeIndex },
                };

                let checkAutofillRequirement2 = () => {
                    if(values.vaporPressureAfterTransfer!==''&&values.vaporPressureAfterTransfer!==null && 
                    values.vaporTempAfterTransfer!==''&&values.vaporTempAfterTransfer!==null && 
                    values.density!==''&&values.density!==null)
                        return true;
                    else
                        return false;
                }
                let QtyDeliveredInputDetailsData = {
                    volume: {'label': "Volume", suffix: 'Cubic Meters', value: values.volume, field: 'volume', touched: touched.volume, error: errors.volume},
                    autoFill: { enabled: (values.completeTransferDate!==null && values.completeTransferDate!== '' && checkAutofillRequirement2()===true), online: this.state.online }
                };
                
                let QtyDeliveredDisplayDetailsData1 = {
                    netEnergyMMbtu: {'label': "Net Energy", 'suffix': "MMbtu", manual: true, field: 'netEnergyMMbtu', value: values.netEnergyMMbtu||values.netEnergyMMbtu===0?values.netEnergyMMbtu:'', touched: touched.netEnergyMMbtu, error: errors.netEnergyMMbtu},
                    netEnergyMWh: {'label': "Net Energy", 'suffix': "MWh", manual: true, field: 'netEnergyMWh', value: values.netEnergyMWh||values.netEnergyMWh===0?values.netEnergyMWh:'', touched: touched.netEnergyMWh, error: errors.netEnergyMWh},
                    quantityConsumed: {'label': "Quantity Consumed", 'suffix': "kg", manual: true, field: 'quantityConsumed', value: values.quantityConsumed||values.quantityConsumed===0?values.quantityConsumed:'', touched: touched.quantityConsumed, error: errors.quantityConsumed},
                    
                };
                let QtyDeliveredDisplayDetailsData2 = {
                    gasConsumed: {'label': "Gas Consumed", 'suffix': "MMbtu", value: values.gasConsumed||values.gasConsumed===0?values.gasConsumed:''},
                    mass: {'label': "Mass Metric", 'suffix': "MT", value: values.mass||values.mass===0?values.mass:''},
                    grossEnergy: {'label': "Gross Energy", 'suffix': "MMbtu", value: values.grossEnergy||values.grossEnergy===0?values.grossEnergy:''},
                    vaporDisplaced: {'label': "Vapour Displaced", 'suffix': "MMbtu", value: values.vaporDisplaced||values.vaporDisplaced===0?values.vaporDisplaced:''},
                };
                let LNGSupplierData = {
                    name: {'label': "Name", value: values.lngSupplierName, field: 'lngSupplierName', touched: touched.lngSupplierName, error: errors.lngSupplierName},
                };

                let VesselRepresentativeData = {
                    name: {'label': "Name", value: values.vesselRepresentativeName, field: 'vesselRepresentativeName', touched: touched.vesselRepresentativeName, error: errors.vesselRepresentativeName},
                    information: ['I certify the above goods in the quantities stated have been ordered and have been received in good order and I confirm having received a copy of the IMO Material Safety Data Sheet.',
                                    'I declare the quantity of goods mentioned above will be used exclusively for propelling the mentioned ship or for nautic supplies on board the ship.']
                };

                return( 
                    <Form onSubmit={handleSubmit} className="mx-auto">
                    <Row>
                    <Col style={{ padding: '15px', backgroundColor: '#032A39' }}>
                        <div style={{display: 'flex', flexFlow: 'column', alignItems: 'stretch' }}>
                            <Row>
                                <Col xs={12} xl={7}>
                                    <Row>
                                        <Col>
                                            <Card style={{ backgroundColor: '#04384C', color: '#067FAA', padding: '5px' }}>
                                                <Card.Header style={{ textAlign: 'center', border: '0px', backgroundColor: 'rgba(0,0,0,0)', fontSize: '1.4em', color: '#00bbff' }}>
                                                    {`BUNKER DELIVERY NOTE`}

                                                </Card.Header>
                                                <Row>
                                                    <Col xs={6} style={{ paddingRight: '0px' }}>
                                                        <Delivery_ReceiverCard data={deliveryDetailsData} handleChange={handleChange}/>
                                                    </Col>
                                                    <Col xs={6} style={{ paddingLeft: '0px' }}>
                                                        <Delivery_ReceiverCard data={receiverDetailsData} handleChange={handleChange}/>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: '10px' }}>
                                        <Col>
                                            <Card style={{ backgroundColor: '#04384C', color: '#067FAA', padding: '5px' }}>
                                                <Row>
                                                    <Col xs={12}>
                                                        <AdditionalInputCard autoFill={() => {this.autoFill(values)}} starColor={QtyAutofillColor} data={additionalInputDetailsData1} handleChange={handleChange} setFieldValue={setFieldValue}/>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                    </Row>
                                    
                                </Col>
                                <Col xl={5} xs={12} >
                                    <Row style={{ height: '100%' }}>
                                        <Col>
                                            <Card style={{ height: '100%', backgroundColor: '#032A39', padding: '10px', color: '#067FAA', border: '10px solid #04384C' }}>
                                                <Row style={{ height: '100%' }}>
                                                    <Col style={{ height: '100%' }}>
                                                        <EventsCard data={eventsDetailsData} handleChange={handleChange}/>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                    </Row>
                                    
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} xl={7}>
                                    <Row style={{ marginTop: '10px' }}>
                                        <Col>
                                            <Card style={{ backgroundColor: '#032A39', padding: '10px', color: '#067FAA', border: '10px solid #04384C' }}>
                                                <Row>
                                                    <Col>
                                                        <DisplayCard header={<span>LNG COMPOSITION<span style={{ color: LNGPorpertiesAutofillColor, fontSize: '1.4rem' }}>*</span></span>} headerStar={LNGPorpertiesAutofillColor} data={LNGCompositionDisplayDetailsData} handleChange={handleChange}/>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                    </Row>   
                                </Col>
                                <Col xs={12} xl={5}>
                                    <Row style={{ marginTop: '10px', height: '98%' }}>
                                        <Col>
                                            <Card style={{ backgroundColor: '#04384C', padding: '10px', color: '#067FAA', height: '100%' }}>
                                                <Row>
                                                    <Col>
                                                        <DisplayCard header="LNG PROPERTIES" data={LNGPropertiesDisplayDetailsData} handleChange={handleChange} displayAutofill={LNGPorpertiesAutofillColor} autoFill={() => {this.autoFill(values)}} />
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>


                            </Row>
                        </div>
                        <div style={{ marginTop: '10px', display: 'flex', flexFlow: 'column', backgroundColor: '#032A39', alignItems: 'stretch', border: '10px solid #04384C' }}>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col xs={12} xl={7}>
                                        <Card style={{ backgroundColor: 'rgba(0,0,0,0)', padding: '10px', color: '#067FAA', border: '0px' }}>
                                            <Row>
                                                <Col  xs={12} xl={5}>
                                                    <QtyDeliveredInputCard  displayAutofill={QtyAutofillColor} autoFill={() => {this.autoFillAfterTransfer(values)}} header='QUANTITY DELIVERED' data={QtyDeliveredInputDetailsData} handleChange={handleChange}/>
                                                </Col>
                                                <Col  xs={12} xl={7}>
                                                    <DisplayCard data={QtyDeliveredDisplayDetailsData1} handleChange={handleChange}/>
                                                </Col>
                                            </Row>
                                        </Card>
                                        </Col>
                                        <Col xs={12} xl={5}>
                                            <Card style={{ backgroundColor: 'rgba(0,0,0,0)', padding: '10px', color: '#067FAA', border: '0px' }}>
                                                <Row>
                                                    <Col>
                                                        <DisplayCard data={QtyDeliveredDisplayDetailsData2} handleChange={handleChange}/>
                                                    </Col>
                                                </Row>
                                            </Card>
                                            {/* <Row>
                                                <Col>
                                                    <DisplayCard data={QtyDeliveredDisplayDetailsData2} handleChange={handleChange}/>
                                                </Col>
                                            </Row> */}
                                        </Col>

                                    </Row>
                                </Col>
                            </Row>
                        </div>

                        <Row style={{ marginTop: '10px' }}>
                            <Col xs={12}>
                                <Row>
                                    <Col>
                                        <Card style={{ backgroundColor: '#04384C', color: '#067FAA', padding: '5px' }}>
                                            <Card.Header style={{ textAlign: 'center', border: '0px', backgroundColor: 'rgba(0,0,0,0)', fontSize: '1.2em' }}>
                                                ACKNOWLEDGEMENTS
                                            </Card.Header>
                                            <Row>
                                                <Col xs={12}>
                                                    <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px', paddingBottom: '20px'}}>
                                                            <Card.Header style={{ border: '0px', color: '#067FAA', backgroundColor: '#032A39', textAlign: 'center', paddingBottom: '0px', fontSize: '1.2em' }}>
                                                                LNG SUPPLIER
                                                            </Card.Header>
                                                        <Card.Body style={{ border: '0px', paddingBottom: '0px' }}>
                                                            <Row>
                                                                <Col  style={{ textAlign: 'center' }}>
                                                                    <div style={{ textAlign: 'center', display: 'inline-flex', position: "relative", width: '400px', height: '100px'}}>
                                                                        {this.state.supplierSignAllowed?
                                                                            (
                                                                            <div style={{ position: 'absolute', backgroundColor : "white" }}>
                                                                                <SignatureCanvas 
                                                                                canvasProps={{width: '400', height: '100'}}
                                                                                ref={(ref) => { this.LNGSupplierCanvas = ref }}
                                                                                />
                                                                            </div>):
                                                                            <div style={{ position: 'absolute', height: '100px', width: '400px', 
                                                                                backgroundColor: 'rgba(28, 64, 76, 100)' 
                                                                            }}>
                                                                                <div style={{ paddingTop: '7px', paddingLeft: '40px', paddingRight: '40px' }}>
                                                                                    <FormControl
                                                                                        type="password"
                                                                                        id='supplierPassword' 
                                                                                        aria-describedby='supplierPassword' 
                                                                                        value={values.supplierPassword}
                                                                                        onChange={handleChange}
                                                                                        name='supplierPassword'
                                                                                        className={"InputBox"}
                                                                                        placeholder = 'PASSWORD'
                                                                                        autoComplete='new-password'
                                                                                    />
                                                                                </div>
                                                                                <div className={"ErrorMessage"}>
                                                                                    {this.state.supplierPasswordError}
                                                                                </div>
                                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3px' }}>
                                                                                    <Button variant="contained" color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', color: 'white', display: 'flex', alignItems: 'center', fontSize: '12px' }} onClick={()=>{this.UnlockSupplierSignature(values.supplierPassword); values.supplierPassword=""}}>
                                                                                        <span style={{ marginLeft: '5px' }}>Unlock</span>
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                        {this.state.supplierSignAllowed?
                                                                            <div style={{ position: "absolute", right: '0px' }}>
                                                                                <span className="material-icons"  onClick={()=>{this.LNGSupplierCanvas.clear()}}>
                                                                                    settings_backup_restore
                                                                                </span>
                                                                                <span className="material-icons"  onClick={()=>{this.setState({supplierSignAllowed: false})}}>
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
                                                                    {LNGSupplierData.name.label}
                                                                </Col>
                                                                <Col xs={6}>
                                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                        <div>
                                                                            <FormControl
                                                                                type="text"
                                                                                id={LNGSupplierData.name.field} 
                                                                                aria-describedby={LNGSupplierData.name.field} 
                                                                                value={LNGSupplierData.name.value}
                                                                                onChange={handleChange}
                                                                                name={LNGSupplierData.name.field}
                                                                                className={(LNGSupplierData.name.touched && LNGSupplierData.name.error) !==undefined? "InputBoxError" : "InputBox"}
                                                                            />
                                                                        </div>
                                                                        <div className={"ErrorMessage"}>
                                                                                {(LNGSupplierData.name.touched && LNGSupplierData.name.error) !== undefined? LNGSupplierData.name.touched && LNGSupplierData.name.error:<br></br>}
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                </Row>
                                                                </div>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                {/* <Col xl={6} xs={12}>
                                                    <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px', paddingBottom: '20px'}}>
                                                            <Card.Header style={{ border: '0px', color: '#067FAA', backgroundColor: '#032A39', textAlign: 'center', paddingBottom: '0px', fontSize: '1.2em'}}>
                                                                VESSEL REPRESENTATIVE
                                                            </Card.Header>
                                                        <Card.Body style={{ border: '0px', paddingBottom: '0px' }}>
                                                            <Row>
                                                                <Col  style={{ textAlign: 'center' }}>
                                                                    <div style={{ textAlign: 'center', display: 'inline-flex', position: "relative", width: '400px', height: '100px'}}>
                                                                        <div style={{ position: 'absolute' }}>
                                                                            <SignatureCanvas 
                                                                            canvasProps={{width: '400', height: '100'}}
                                                                            // backgroundColor={"rgba(28,64,76,100)"}
                                                                            // penColor= 'white'
                                                                            backgroundColor={"rgba(255, 255, 255, 100)"}
                                                                            ref={(ref) => { this.VesselRepresentativeCanvas = ref }}
                                                                            />

                                                                        </div>
                                                                        <div style={{ position: "absolute", right: '0px' }} onClick={()=>{this.VesselRepresentativeCanvas.clear()}}>
                                                                        <span className="material-icons">
                                                                            settings_backup_restore
                                                                        </span>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row style={{ margin: '10px', justifyContent: 'center', verticalAlign: 'center' }}>
                                                                <div style={{ width: '400px' }}>
                                                                <Row>
                                                                    <Col xs={1}>
                                                                    </Col>
                                                                    <Col xs={3}>
                                                                        {VesselRepresentativeData.name.label}
                                                                    </Col>
                                                                    <Col xs={6}>
                                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                            <div>
                                                                                <FormControl
                                                                                    type="text"
                                                                                    id={VesselRepresentativeData.name.field} 
                                                                                    aria-describedby={VesselRepresentativeData.name.field} 
                                                                                    value={VesselRepresentativeData.name.value}
                                                                                    onChange={handleChange}
                                                                                    name={VesselRepresentativeData.name.field}
                                                                                    className={(VesselRepresentativeData.name.touched && VesselRepresentativeData.name.error) !==undefined? "InputBoxError" : "InputBox"}
                                                                                />
                                                                            </div>
                                                                            <div className={"ErrorMessage"}>
                                                                                {(VesselRepresentativeData.name.touched && VesselRepresentativeData.name.error) !== undefined? VesselRepresentativeData.name.touched && VesselRepresentativeData.name.error:<br></br>}
                                                                            </div>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                                </div>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    {VesselRepresentativeData.information.map( (info, idx) => (
                                                                        <div key={idx} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                                                                            {info}
                                                                        </div>
                                                                    ))}
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </Col> */}
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>    
                            </Col>
                        </Row>

                        {/* Buttons */}
                        <Row style={{marginTop : "20px", textAlign: 'center'}}>
                            <Col>
                                <Button variant="contained" color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', paddingLeft: '30px', paddingRight: '30px' }} onClick={()=>this.saveForm(values)}> 
                                     {this.state.showSaveSpinner?<Spinner animation="border" variant="light" size='sm' />: ' '}  Save
                                    </Button>
                            </Col>
                            <Col>
                                <Button variant="contained" type={'submit'} color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', paddingLeft: '30px', paddingRight: '30px' }} disabled={this.state.showSubmitSpinner}> 
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                        </Col>
                        </Row>
                        <Dialog
                            open={this.state.confirmSubmitBox}
                            onClose={()=> this.setState({ confirmSubmitBox: false })}
                            aria-labelledby="submit-confirm-title"
                            aria-describedby="submit-confirm-description"
                        >
                            <DialogTitle id="submit-confirm-title">{"Submit Bunkering Delivery Note?"}</DialogTitle>
                            <DialogContent>
                            <DialogContentText id="submit-confirmation-description">
                                Are you sure you want to submit? 
                                <br />
                                Data cannot be changed after submit.
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={()=> this.setState({ confirmSubmitBox: false })} color="primary">
                                Cancel
                            </Button>
                            <Button variant="contained" color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', paddingLeft: '30px', paddingRight: '30px' }} onClick={()=> this.submitForm(values)} disabled={this.state.showSubmitSpinner}> 
                                    {this.state.showSubmitSpinner?<Spinner animation="border" variant="light" size='sm' />: ' '}  Submit
                            </Button>
                            </DialogActions>
                        </Dialog>
                    </Form>
                )
            }}
            </Formik>
        )
    }
    render() {
        return (
            <Container>
                <Row>
                    <Col xs={{span : 11, offset : 1}} style={{ padding: '20px' }}>
                        {!this.state.loaded && <FullScreenSpinner />}
                        {this.state.loaded && this.renderForm()}
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default withRouter(withMessageManager(withLayoutManager(BDN)));