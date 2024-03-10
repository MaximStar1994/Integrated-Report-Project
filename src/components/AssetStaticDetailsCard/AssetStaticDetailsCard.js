import React from 'react';
import { withRouter } from "react-router-dom";

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'

import './AssetStaticDetails.css'
import EngineDiag from '../../assets/EngineSchematic.png'
import GearboxDiag from '../../assets/Equipment/Gearbox.png'
import AirCompressorDiag from '../../assets/Equipment/Aircompressor.png'
import PumpDiag from '../../assets/Equipment/Pump.png'
import redArrowVib from '../../assets/redArrow.png'
import Asset from '../../model/Asset';

import {withLayoutManager} from '../../Helper/Layout/layout'
// props :
// asset : String
// display : String
// equipment : [ {EquipmentName : String, EquipmentDetail : JsonString }]
class AssetStaticDetails extends React.Component {
    constructor(props,context) {
        super(props,context)
        this.state = {
            showModal : false,
            data : [],
            showStatic : false,
            equipmentDrawing : EngineDiag
        }
        this.assetApi = new Asset
    }
    componentDidMount() {
        // get tags in asset
        if (this.props.asset.includes("compressor")) {
            this.setState({equipmentDrawing : AirCompressorDiag})
        }
        if (this.props.asset.includes("pump")) {
            this.setState({equipmentDrawing : PumpDiag})
        }
        if (this.props.asset.includes("gearbox")) {
            this.setState({equipmentDrawing : GearboxDiag})
        }
        this.assetApi.GetAssetVibrationTags(this.props.asset, (tagData,err)=>{
            this.setState({data : tagData})
        })
    }
    componentDidUpdate(prevProps) {
        if (this.props.asset !== prevProps.asset) {
            if (this.props.asset.includes("compressor")) {
                this.setState({equipmentDrawing : AirCompressorDiag})
            }
            if (this.props.asset.includes("pump")) {
                this.setState({equipmentDrawing : PumpDiag})
            }
            if (this.props.asset.includes("gearbox")) {
                this.setState({equipmentDrawing : GearboxDiag})
            }
            this.assetApi.GetAssetVibrationTags(this.props.asset, (tagData,err)=>{
                this.setState({data : tagData})
            })
        }
    }
    renderEquipmentIndivDetail(details) {
        var detailItems = []
        for(var key in details) {
            detailItems.push(
                <Row    key={key} className="equipmentStaticDetailCard" 
                        style={{marginLeft : "0px", marginRight : "0px", alignItems : "center"}}>
                    <Col xs={4} className="equipmentStaticDetailLabel equipmentStaticDetailContentCard">
                        {key}
                    </Col>
                    <Col xs={8} className="equipmentStaticDetailContentCard">
                        {details[key]}
                    </Col>
                </Row>
            )
        }
        detailItems.push(
            <Row    key="extraSpacing" className="equipmentStaticDetailContentCard equipmentStaticDetailCardBtm" 
                    style={{marginLeft : "0px", marginRight : "0px", alignItems : "center"}} />
        )
        return detailItems
    }

    CamelCase(word) {
        return word.charAt(0).toUpperCase() + word.substring(1);
    }

    renderEquipmentStaticData() {
        var equipmentItems = [];
        var equipmentList = this.props.equipment
        equipmentList.forEach(equipment => {
            const equipmentArr = equipment.EquipmentName.split("_")
            var name = equipmentArr[equipmentArr.length - 1]
            if (equipmentArr[0].includes("mudpump")) {
                name =  this.CamelCase(equipmentArr[equipmentArr.length - 2]) + " " + this.CamelCase(equipmentArr[equipmentArr.length - 1])
            }
            name = this.CamelCase(name)
            var details = JSON.parse(equipment.EquipmentDetail)
            equipmentItems.push(
                <Row key={equipment.EquipmentName}>
                    <Col className="equipmentStaticDetailsHead">
                        <div className="equipmentStaticDetailCard"  style={{paddingTop : "10px"}}>
                            {name}
                        </div>
                    </Col>
                </Row>
            )
            equipmentItems.push(
                this.renderEquipmentIndivDetail(details)
            )
        });
        return equipmentItems
    }

    renderGearBoxVibrationModal() {
        var data = this.state.data
        return (
            <Col>
                {Object.keys(data).map((key,idx) => (
                    <div key={idx}>
                    <Row>
                        <Col>
                            <div style={{textAlign : "center", padding : "10px"}} className="blueHeading1">{key}</div>
                        </Col>
                    </Row>
                    <Row>
                        {data[key].map((obj,i) => (
                            <Col xs={4} lg={2} key={i}>
                                <div style={{borderRadius : "10px", border : "2px solid #045473", margin : "15px 0"}}> 
                                <Row style={{marginTop : "-10px"}}>
                                    <Col>
                                        <div style={{margin : "auto", backgroundColor : "white", width : "fit-content"}} className="blueHeading2" >
                                            {obj.display}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div style={{padding : "5px"}}>
                                            <div style={{textAlign : "center", fontWeight : "600"}}>{parseFloat(obj.value).toFixed(2)} </div>
                                            <div className="blueHeading4" style={{float : "right"}}>{obj.unit}</div>
                                        </div>
                                        
                                    </Col>
                                </Row>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    </div>
                ))}
            </Col>
        )
    }

    renderModal() {
        var showModal = this.state.showModal
        if (showModal) {
            return (
                <Modal 
                size={"lg"} 
                aria-labelledby="contained-modal-title-vcenter"
                centered 
                show={this.state.showModal} 
                onHide={() => {this.setState({showModal : false})}}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{textAlign : "center"}}>{this.props.display}</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            <Row>
                                {
                                    !this.props.asset.includes("gearbox") &&
                                    (this.state.data.map(tagData => 
                                        <Col xs={4} key={tagData.name} style={{marginTop : "15px", marginBottom : "15px"}}>
                                            <Row>
                                                <Col xs={4}>
                                                    {tagData.isOnline ? 
                                                    <img src={require('../../assets/Icon/LEDGreen.png')} ></img> :
                                                    <img src={require('../../assets/Icon/LEDBlue.png')} ></img>}
                                                </Col>
                                                <Col xs={4}>
                                                    <div style={{display : "flex", justifyContent : "center", flexDirection : "column", height : "100%", fontWeight : "bold"}}>{tagData.tagName}</div>
                                                </Col>
                                                <Col xs={4}>
                                                    <div >
                                                        <img 
                                                        style={{width : "100%"}}
                                                        src={require('../../assets/Icon/EmptyBattery.png')}></img>
                                                        <div
                                                        style={{position: "absolute", top: this.props.renderFor == 0 ? "30%" : "auto", left : "25%"}}>{tagData.voltage}</div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row style={{marginTop : "5px", marginBottom : "15px"}}>
                                                <Col xs={4} className="vibrationRealTimeMonitoringLabel">Overall Velocity (mm/s)</Col>
                                                <Col xs={4} className="vibrationRealTimeMonitoringLabel">Peak Vue (G's)</Col>
                                                <Col xs={4} className="vibrationRealTimeMonitoringLabel">Sensor Bias Health</Col>
                                            </Row>
                                            {
                                                (tagData.data.map((dat,i) => 
                                                    <Row key={i}>
                                                        <Col xs={4} className="vibrationRealTimeMonitoringValue">{dat.velocity}</Col>
                                                        <Col xs={4} className="vibrationRealTimeMonitoringValue">{dat.peakVue}</Col>
                                                        <Col xs={4}>
                                                        { dat.sensorHealth ? 
                                                            <img src={require('../../assets/Icon/LEDGreen.png')} ></img> :
                                                            <img src={require('../../assets/Icon/LEDBlue.png')} ></img>
                                                        }
                                                        </Col>
                                                    </Row>)
                                                )
                                            }
                                            
                                        </Col>)
                                    )
                                }
                                {this.props.asset.includes("gearbox") && this.renderGearBoxVibrationModal()}
                            </Row>
                        </Modal.Body>
                    </Modal>
            )
        } else {
            return (<></>)
        }
    }
    renderRightMD() {
        return (
            <>
            <Row>
                <Col>
                    <div className="AssetStaticDetailsHeader">
                        Real-Time Monitoring
                    </div>
                </Col>
            </Row>
            <Row noGutters={true}>
                <Col>
                    <div className="mainAssetVibrationTitle" onClick={()=>
                        {
                            this.setState({showModal : true})
                        }}>
                        <div className="redArrowVib">
                                <img src={redArrowVib} alt="Right Arrow Icon" className="img-responsive" />Vibration
                        </div>
                    </div>
                </Col>
                {this.props.asset.includes("engine") && (
                    <Col>
                        <div className="mainAssetVibrationTitle" onClick={()=>
                        {
                            this.props.history.push(`/assethealth/engine/${this.props.asset.slice(this.props.asset.length - 1)}`)
                        }}>
                            Drive
                        </div>
                    </Col>
                )}
                {this.props.asset.includes("mudpump") && (
                    <Col>
                        <div className="mainAssetVibrationTitle" onClick={()=>
                        {
                            this.props.history.push(`/assethealth/mudpump/${this.props.asset.slice(this.props.asset.length - 1)}`)
                        }}>
                            Drive
                        </div>
                    </Col>
                )}
            </Row>
            {this.renderModal()}
            </>
        )
    }
    renderLeftMD() {
        return (
            <>
            <div style={{position : "relative", zIndex : 90}}>
            <Row>
                <Col>
                    <div style={{zIndex : 100}} className="AssetStaticDetailsHeader" onClick={() => {this.setState({showStatic : !this.state.showStatic})}}>
                        Equipment Info
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div style={{position : "absolute", top : "100%", left : "15px", right : "15px", zIndex : 90}}>
                        {this.state.showStatic && this.renderEquipmentStaticData()}
                        {this.state.showStatic && (
                        <Row>
                            <Col>
                                <div>
                                    <img src={this.state.equipmentDrawing} alt="Equipment Schematic" className="img-responsive" />
                                </div>
                            </Col>
                        </Row>)}
                    </div>
                </Col>
            </Row>
            </div>
            {this.state.showStatic && 
            <div style={{position : "fixed", top : "0", left : "0", right : "0", zIndex : 1, bottom : "0", backgroundColor : "rgba(255,255,255,0.3)"}} onClick={()=>{this.setState({showStatic : !this.state.showStatic})}}></div>}
            </>
        )
    }
    render() {
        if (this.props.renderFor == 1 || this.props.renderFor == 2){
            if (this.props.colRenderingFor == "left") {
                return this.renderLeftMD()
            } else {
                return this.renderRightMD()
            }
        }
        return (
            <Container fluid={true}>
                <Row>
                    <Col>
                        <div className="AssetStaticDetailsHeader">
                            Real-Time Monitoring
                        </div>
                    </Col>
                </Row>
                <Row noGutters={true}>
                    <Col>
                        <div className="mainAssetVibrationTitle" onClick={()=>
                            {
                                this.setState({showModal : true})
                            }}>
                        <div className="redArrowVib">
                                <img src={redArrowVib} alt="Right Arrow Icon" className="img-responsive" />Vibration
                        </div>
                        </div>
                    </Col>
                    {this.props.asset.includes("engine") && (
                        <Col>
                            <div className="mainAssetVibrationTitle" onClick={()=>
                            {
                                this.props.history.push(`/assethealth/engine/${this.props.asset.slice(this.props.asset.length - 1)}`)
                            }}>
                                Status
                            </div>
                        </Col>
                    )}
                    {this.props.asset.includes("mudpump") && (
                        <Col>
                            <div className="mainAssetVibrationTitle" onClick={()=>
                            {
                                this.props.history.push(`/assethealth/mudpump/${this.props.asset.slice(this.props.asset.length - 1)}`)
                            }}>
                                Drive
                            </div>
                        </Col>
                    )}
                </Row>
                {this.renderEquipmentStaticData()}
                {this.renderModal()}
                <Row>
                    <Col>
                        <div className="padTopBtm30">
                            <img src={this.state.equipmentDrawing} alt="Equipment Schematic" className="img-responsive" />
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withLayoutManager(withRouter(AssetStaticDetails));
