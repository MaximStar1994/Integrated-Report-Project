import React from 'react';
import {Card, Form, FormControl, Row, Col } from 'react-bootstrap';
import {Button } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import './BDN.css';

const MyRadio = withStyles({
    root: {
      color: '#00bbff',
      '&$checked': {
        color: '#00bbff',
      },
    },
    checked: {
        
    },
})((props) => <Radio color="default" {...props} />);

const AdditionalInputCard = props => (
    <Card style={{ color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px'}}>
        {props.header?
            <Card.Header style={{ border: '0px', color: '#067FAA', backgroundColor: '#032A39'}}>
                {props.header}
            </Card.Header>
        :null}
        <Card.Body style={{ border: '0px', paddingTop: '5px', paddingBottom: '0px' }}>
            <Row style={{ marginTop: '10px' }}>
                <Col>
                    <label>{props.data.combustionTempDeg.label}</label>
                    <Select style={{ width: '100%', paddingLeft: '5px' }} 
                        labelId={props.data.combustionTempDeg.field} 
                        id={props.data.combustionTempDeg.field} 
                        name ={props.data.combustionTempDeg.field} 
                        value={props.data.combustionTempDeg.value} 
                        onChange={props.handleChange} 
                        className={(props.data.combustionTempDeg.touched && props.data.combustionTempDeg.error) !==undefined? "InputBoxError" : "InputBox"} 
                        displayEmpty>
                        <MenuItem value={null}> <em> Select Combustion Temperature </em> </MenuItem>
                        <MenuItem value={1}>0 &#8451;</MenuItem>
                        <MenuItem value={2}>15 &#8451;</MenuItem>
                        <MenuItem value={3}>60 &#8457;</MenuItem>
                        <MenuItem value={4}>20 &#8451;</MenuItem>
                        <MenuItem value={5}>25 &#8451;</MenuItem>
                    </Select>
                    <div style={{ paddingBottom: '50px' }}></div>    
                </Col>
                <Col>
                    <label>{props.data.meteringTempDeg.label}</label>
                    <Select style={{ width: '100%', paddingLeft: '5px' }} 
                        labelId={props.data.meteringTempDeg.field} 
                        id={props.data.meteringTempDeg.field} 
                        name ={props.data.meteringTempDeg.field} 
                        value={props.data.meteringTempDeg.value} 
                        onChange={props.handleChange} 
                        className={(props.data.meteringTempDeg.touched && props.data.meteringTempDeg.error) !==undefined? "InputBoxError" : "InputBox"} 
                        displayEmpty>
                        <MenuItem value={null}> <em> Select Metering Temperature </em> </MenuItem>
                        <MenuItem value={1}>0 &#8451;</MenuItem>
                        <MenuItem value={2}>15 &#8451;</MenuItem>
                        <MenuItem value={3}>60 &#8457;</MenuItem>
                        <MenuItem value={4}>20 &#8451;</MenuItem>
                        <MenuItem value={5}>25 &#8451;</MenuItem>
                    </Select>
                    <div style={{ paddingBottom: '50px' }}></div>    
                </Col>
                <Col>
                    <label>{props.data.sulphur.label}</label>
                    <FormControl
                        type="number"
                        id={props.data.sulphur.field} 
                        aria-describedby={props.data.sulphur.field} 
                        value={props.data.sulphur.value}
                        onChange={props.handleChange}
                        name={props.data.sulphur.field}
                        className={(props.data.sulphur.touched && props.data.sulphur.error) !==undefined? "InputBoxError" : "InputBox"}
                    />
                    <div className={"ErrorMessage"}>
                        {(props.data.sulphur.touched && props.data.sulphur.error) !== undefined? props.data.sulphur.touched && props.data.sulphur.error:null}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '10px'}}>
                        {props.data.sulphur.suffix} 
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Row>
                        <Col><u>Before Transfer</u></Col>
                    </Row>
                    <Row style={{ marginTop: '15px' }}>
                        <Col>
                            <Row>
                                <Col style={{ display: 'flex', alignItems: 'center' }}><label>{props.data.lngTemperatureDelivered.label}</label></Col>
                                <Col style={{ display: 'flex', alignItems: 'center' }}>
                                    <FormControl
                                        type="number"
                                        id={props.data.lngTemperatureDelivered.field} 
                                        aria-describedby={props.data.lngTemperatureDelivered.field} 
                                        defaultValue={props.data.lngTemperatureDelivered.value}
                                        onBlur={props.handleChange}
                                        name={props.data.lngTemperatureDelivered.field}
                                        className={(props.data.lngTemperatureDelivered.touched && props.data.lngTemperatureDelivered.error) !==undefined? "InputBoxError" : "InputBox"}
                                        
                                        />
                                </Col>
                                <Col xs={2}>
                                    {props.data.lngTemperatureDelivered.suffix}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className={"ErrorMessage"}>
                                        {(props.data.lngTemperatureDelivered.touched && props.data.lngTemperatureDelivered.error) !== undefined? props.data.lngTemperatureDelivered.touched && props.data.lngTemperatureDelivered.error:null}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: '15px' }}>
                        <Col>
                            <Row>
                                <Col style={{ display: 'flex', alignItems: 'center' }}><label>{props.data.arrivalVaporPressure.label}</label></Col>
                                <Col style={{ display: 'flex', alignItems: 'center' }}>
                                    <FormControl
                                        type="number"
                                        id={props.data.arrivalVaporPressure.field} 
                                        aria-describedby={props.data.arrivalVaporPressure.field} 
                                        defaultValue={props.data.arrivalVaporPressure.value}
                                        onBlur={props.handleChange}
                                        name={props.data.arrivalVaporPressure.field}
                                        className={(props.data.arrivalVaporPressure.touched && props.data.arrivalVaporPressure.error) !==undefined? "InputBoxError" : "InputBox"}
                                    />
                                </Col>
                                <Col xs={2}>
                                    {props.data.arrivalVaporPressure.suffix} 
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className={"ErrorMessage"}>
                                        {(props.data.arrivalVaporPressure.touched && props.data.arrivalVaporPressure.error) !== undefined? props.data.arrivalVaporPressure.touched && props.data.arrivalVaporPressure.error:null}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <Col><u>After Transfer</u> <span style={{ color: props.starColor, fontSize: '1.4rem' }}>*</span></Col>
                    </Row>
                    <Row style={{ marginTop: '15px' }}>
                        <Col>
                            <Row>
                                <Col style={{ display: 'flex', alignItems: 'center' }}><label>{props.data.vaporTempAfterTransfer.label}</label></Col>
                                <Col style={{ display: 'flex', alignItems: 'center' }}>
                                    <FormControl
                                        type="number"
                                        id={props.data.vaporTempAfterTransfer.field} 
                                        aria-describedby={props.data.vaporTempAfterTransfer.field} 
                                        defaultValue={props.data.vaporTempAfterTransfer.value}
                                        onBlur={props.handleChange}
                                        name={props.data.vaporTempAfterTransfer.field}
                                        className={(props.data.vaporTempAfterTransfer.touched && props.data.vaporTempAfterTransfer.error) !==undefined? "InputBoxError" : "InputBox"}
                                    />
                                </Col>
                                <Col xs={2}>
                                    {props.data.vaporTempAfterTransfer.suffix}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className={"ErrorMessage"}>
                                        {(props.data.vaporTempAfterTransfer.touched && props.data.vaporTempAfterTransfer.error) !== undefined? props.data.vaporTempAfterTransfer.touched && props.data.vaporTempAfterTransfer.error:null}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: '15px' }}>
                        <Col>
                            <Row>
                                <Col style={{ display: 'flex', alignItems: 'center' }}><label>{props.data.vaporPressureAfterTransfer.label}</label></Col>
                                <Col style={{ display: 'flex', alignItems: 'center' }}>
                                    <FormControl
                                        type="number"
                                        id={props.data.vaporPressureAfterTransfer.field} 
                                        aria-describedby={props.data.vaporPressureAfterTransfer.field} 
                                        defaultValue={props.data.vaporPressureAfterTransfer.value}
                                        onBlur={props.handleChange}
                                        name={props.data.vaporPressureAfterTransfer.field}
                                        className={(props.data.vaporPressureAfterTransfer.touched && props.data.vaporPressureAfterTransfer.error) !==undefined? "InputBoxError" : "InputBox"}
                                    />
                                </Col>
                                <Col xs={2}>
                                    {props.data.vaporPressureAfterTransfer.suffix} 
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className={"ErrorMessage"}>
                                        {(props.data.vaporPressureAfterTransfer.touched && props.data.vaporPressureAfterTransfer.error) !== undefined? props.data.vaporPressureAfterTransfer.touched && props.data.vaporPressureAfterTransfer.error:null}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Col>
            </Row>
            <Row style={{ marginTop: '20px', paddingBottom: '10px' }}>
                <Col>
                    {/* <div style={{ padding: '5px', backgroundColor: '#04384c', borderRadius: '5px', display: 'inline-block', marginRight: '10px', alignItems: 'center' }}>
                        <div className={props.data.autoFill.online ? 'BDNAutofillActiveDot' : 'BDNAutofillInActiveDot'} />
                        <Button 
                        onClick={()=>{props.autoFill()}}
                        disabled={!(props.data.autoFill.enabled && props.data.autoFill.online)} variant="contained" color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', paddingLeft: '10px', paddingRight: '10px', fontSize: '0.7em' }}> 
                            Auto Fill
                        </Button>                                                    
                    </div> */}
                </Col>
                <Col xs={8}>
                    <span>{props.data.vaporEnergyIncluded.label}</span>
                    <MyRadio
                        checked={!props.data.vaporEnergyIncluded.value}
                        onChange={(e) => {
                            props.setFieldValue(props.data.vaporEnergyIncluded.field,false)
                        }}
                        name={props.data.vaporEnergyIncluded.field}
                        id={`${props.data.vaporEnergyIncluded.field}-No`}
                        inputProps={{ 'aria-label': 'No' }}
                    /> No
                    <MyRadio
                        checked={props.data.vaporEnergyIncluded.value}
                        onChange={(e) => {
                            props.setFieldValue(props.data.vaporEnergyIncluded.field,true)
                        }}
                        name={props.data.vaporEnergyIncluded.field}
                        id={`${props.data.vaporEnergyIncluded.field}-YES`}
                        inputProps={{ 'aria-label': 'Yes' }}
                    /> Yes
                </Col>
            </Row>
        </Card.Body>
    </Card>
);

export default AdditionalInputCard;