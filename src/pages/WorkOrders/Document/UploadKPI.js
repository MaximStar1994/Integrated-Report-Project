import React from 'react';
import { Container, Row, Col, Form, Modal } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import FolderIcon from '@material-ui/icons/FolderOpen'
import FullScreenSpinner from '../../../components/FullScreenSpinner/FullScreenSpinner'
import { TextField, Button, FormControl, FormHelperText } from '@material-ui/core'
import { withMessageManager } from '../../../Helper/Message/MessageRenderer'
import FuelLng from '../../../model/FuelLng';
import { Formik } from "formik";
class UploadKpi extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.api = new FuelLng()
        this.state = {
            loading : true
        }
    }
    componentDidMount() {
        /*this.api.GetKpi((kpis) => {
            this.setState({kpis : kpis, loading : false})
        })*/
    }
    render() {
        if (this.state.loading) {
            return (<FullScreenSpinner />)
        }
        return (
            <Modal show={this.props.show} onHide={()=> this.props.onHide()}>
                <Modal.Header closeButton style={{border: 'none'}}>
                    <Modal.Title className=''>Edit Kpis</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                    initialValues={this.state.kpis}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        this.api.SetKpi(values,() => {
                            setSubmitting(false)
                            this.props.onHide()
                            this.props.setMessages([{type : "success", message : "KPI updated"}])
                        })
                    }}>
                    {({ values, errors, touched, handleSubmit, handleChange, isSubmitting, setFieldValue }) =>
                        (
                            <Form onSubmit={handleSubmit}>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                        Cargo Operation Monthly Stopage :
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Cargo Operation Monthly Stopage" variant="outlined" fullWidth name="cargoOperationMonthlyStopage"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.cargoOperationMonthlyStopage}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                        Downtime During Navigation : 
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Downtime During Navigation" variant="outlined" fullWidth name="downtimeDuringNavigation"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.downtimeDuringNavigation}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                        Monthly Overdue PMS Items : 
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Monthly Overdue PMS Items" variant="outlined" fullWidth name="monthlyOverduePMSItems"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.monthlyOverduePMSItems}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                        Vessel Availability : 
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Vessel Availability" variant="outlined" fullWidth name="vesselAvailability"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.vesselAvailability}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                        Monthly Bunkering Speed Met : 
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Monthly Bunkering Speed Met" variant="outlined" fullWidth name="monthlyBunkeringSpeedMet"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.monthlyBunkeringSpeedMet}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                        Monthly Loading Pumping Speed Met : 
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Monthly Loading Pumping Speed Met" variant="outlined" fullWidth name="monthlyLoadingPumpingSpeedMet"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.monthlyLoadingPumpingSpeedMet}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                        Timliness Of BDN Delivery : 
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Timliness Of BDN Delivery" variant="outlined" fullWidth name="timlinessOfBDNDelivery"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.timlinessOfBDNDelivery}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                        Loadings Performed Within Booked Slot : 
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Loadings Performed Within Booked Slot" variant="outlined" fullWidth name="loadingsPerformedWithinBookedSlot"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.loadingsPerformedWithinBookedSlot}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                        TmsaElm4 : 
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="TmsaElm4" variant="outlined" fullWidth name="tmsaElm4"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.tmsaElm4}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                        TmsaElm5 : 
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="TmsaElm5" variant="outlined" fullWidth name="tmsaElm5"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.tmsaElm5}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                        TmsaElm6 : 
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="TmsaElm6" variant="outlined" fullWidth name="tmsaElm6"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.tmsaElm6}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                    LTIF : 
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="LTIF" variant="outlined" fullWidth name="LTIF"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.LTIF}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                    Near Miss : 
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Near Miss" variant="outlined" fullWidth name="nearMiss"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.nearMiss}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                        Accident Rate :
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Accident Rate" variant="outlined" fullWidth name="accidentRate"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.accidentRate}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                        No Of Internal Audit :
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="No Of Internal Audit" variant="outlined" fullWidth name="noOfInternalAudit"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.noOfInternalAudit}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                    Rate Of Obs Per Inspection :
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Rate Of Obs Per Inspection" variant="outlined" fullWidth name="rateOfObsPerInspection"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.rateOfObsPerInspection}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                    Environmental Incident :
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Environmental Incident" variant="outlined" fullWidth name="environmentalIncident"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.environmentalIncident}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                    Cargo Accident :
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Cargo Accident" variant="outlined" fullWidth name="cargoAccident"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.cargoAccident}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                    Navigational Accident :
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Navigational Accident" variant="outlined" fullWidth name="navigationalAccident"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.navigationalAccident}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                    Monthly Deliveries On Time :
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Monthly Deliveries On Time" variant="outlined" fullWidth name="monthlyDeliveriesOnTime"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.monthlyDeliveriesOnTime}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                    Monthly Delivery In Full :
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Monthly Delivery In Full" variant="outlined" fullWidth name="monthlyDeliveryInFull"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.monthlyDeliveryInFull}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col className='txtBold' style={{alignSelf : "center"}}>
                                    Delivery Temp Met :
                                    </Col>
                                    <Col className="flex-grow-2">
                                        <TextField
                                            type="text" placeholder="Delivery Temp Met" variant="outlined" fullWidth name="deliveryTempMet"
                                            // inputProps={this.propsForTextFieldInput}
                                            // InputProps={this.propsForTextFieldInputProps}
                                            onChange={handleChange}
                                            value={values.deliveryTempMet}
                                        ></TextField>
                                    </Col>
                                </Row>
                                <Row style={{margin : "1rem 0"}}>
                                    <Col style={{textAlign : "right"}}>
                                        <Button type="submit" disabled={isSubmitting}>
                                            Done
                                        </Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    {this.state.error && <FormHelperText error={true}>{this.state.error}</FormHelperText>}
                                    </Col>
                                </Row>
                            </Form>
                        )
                    }
                    </Formik>
                </Modal.Body>
            </Modal>
        )
    }
}
export default withMessageManager(UploadKpi);
