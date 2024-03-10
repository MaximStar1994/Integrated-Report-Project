import React from 'react';
import { withRouter } from "react-router-dom";

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import './SideBar.css'
import RightDropDown from '../RightDropDown/RightDropDown.js'
// import Tag from '../../model/Tag.js'

// onAssetSelected
class SideBar extends React.Component {
    constructor(props,context) {
        super(props,context)
        this.state = {}
    }
    jackingOptions = {
        1 : { display :"Asset Monitoring", key : "assetmonitoring"},
        2 : { display :"Data Visualization", key : "datavisualization"},
        3 : { 
            display :"Fwd Leg Chord A", 
            key : "Fwd Leg Chord A", 
            nestedOptions : [{ 
                display :"Gearbox F03", 
                key : "gearboxF03", nestedOptions : []
            },{ 
                display :"Gearbox F04", 
                key : "gearboxF04", nestedOptions : []
            }]
        },
        4 : { 
            display :"Fwd Leg Chord B", 
            key : "Fwd Leg Chord B",
            nestedOptions : [{ 
                display :"Gearbox F07", 
                key : "gearboxF07", nestedOptions : []
            },{ 
                display :"Gearbox F08", 
                key : "gearboxF08", nestedOptions : []
            }]
        },
        5 : { 
            display :"Fwd Leg Chord C", 
            key : "Fwd Leg Chord C",
            nestedOptions : [{ 
                display :"Gearbox F11", 
                key : "gearboxF11", nestedOptions : []
            },{ 
                display :"Gearbox F12", 
                key : "gearboxF12", nestedOptions : []
            }]},
        6 : { 
            display :"Stbd Leg Chord A", 
            key : "Stbd Leg Chord A",
            nestedOptions : [{ 
                display :"Gearbox S03", 
                key : "gearboxS03", nestedOptions : []
            },{ 
                display :"Gearbox S04", 
                key : "gearboxS04", nestedOptions : []
            }]},
        7 : { 
            display :"Stbd Leg Chord B", 
            key : "Stbd Leg Chord B",
            nestedOptions : [{ 
                display :"Gearbox S07", 
                key : "gearboxS07", nestedOptions : []
            },{ 
                display :"Gearbox S08", 
                key : "gearboxS08", nestedOptions : []
            }]},
        8 : { 
            display :"Stbd Leg Chord C", 
            key : "Stbd Leg Chord C",
            nestedOptions : [{ 
                display :"Gearbox S11", 
                key : "gearboxS11", nestedOptions : []
            },{ 
                display :"Gearbox S12", 
                key : "gearboxS12", nestedOptions : []
            }]},
        9 : { 
            display :"Port Leg Chord A", 
            key : "Port Leg Chord A",
            nestedOptions : [{ 
                display :"Gearbox P03", 
                key : "gearboxP03", nestedOptions : []
            },{ 
                display :"Gearbox P04", 
                key : "gearboxP04", nestedOptions : []
            }]},
        10 : { 
            display :"Port Leg Chord B", 
            key : "Port Leg Chord B",
            nestedOptions : [{ 
                display :"Gearbox P07", 
                key : "gearboxP07", nestedOptions : []
            },{ 
                display :"Gearbox P08", 
                key : "gearboxP08", nestedOptions : []
            }]},
        11 : { 
            display :"Port Leg Chord C", 
            key : "Port Leg Chord C",
            nestedOptions : [{ 
                display :"Gearbox P11", 
                key : "gearboxP11", nestedOptions : []
            },{ 
                display :"Gearbox P12", 
                key : "gearboxP12", nestedOptions : []
            }]},
    }
    marineOptions = {
        1 : { display :"Tank Gauging", key : "tankgauging"},
        2 : { display :"Fire Seawater Pump", key : "Fire Seawater Pump"},
        3 : { display :"Emergency Main Fire Pump", key : "Emergency Main Fire Pump"},
        4 : { display :"Drill Water Pump 1", key : "Drill Water Pump 1"},
        5 : { display :"Drill Water Pump 2", key : "Drill Water Pump 2"},
        6 : { display :"Bilge Electric Pump 1", key : "Bilge Electric Pump 1"},
        7 : { display :"Bilge Electric Pump 2", key : "Bilge Electric Pump 2"},
        8 : { display :"Brine Pump", key : "Brine Pump"},
        9 : { display :"Air Compressor 1", key : "Air Compressor 1"},
        10 : { display :"Air Compressor 2", key : "Air Compressor 2"},
        11 : { display : "Air Compressor 3", key : "Air Compressor 3"},
        12 : { display : "Fire Jockey Pump", key : "Fire Jockey Pump"},
    }
    drillingOptions = {
        1 : { display :"Drilling Operation", key : "drillingoperation"},
        2 : { display :"Drilling Overview", key : "drillingoverview"},
        3 : { display :"Mud Pump 1", key : "Mud Pump 1"},
        4 : { display :"Mud Pump 2", key : "Mud Pump 2"},
        5 : { display :"Mud Pump 3", key : "Mud Pump 3"},
        6 : { display :"Mud Charging Pump 1", key : "Mud Charging Pump 1"},
        7 : { display :"Mud Charging Pump 2", key : "Mud Charging Pump 2"},
        8 : { display :"Mud Charging Pump 3", key : "Mud Charging Pump 3"},
        9 : { display :"Mud Mixing Pump 1", key : "Mud Mixing Pump 1"},
        10 : { display :"Mud Mixing Pump 2", key : "Mud Mixing Pump 2"},
        11 : { display :"Mud Mixing Pump 3", key : "Mud Mixing Pump 3"},
        12 : { display :"Desander Pump", key : "Desander Pump"},
        13 : { display :"Degasser Pump 1", key : "Degasser Pump 1"},
        14 : { display :"Degasser Pump 2", key : "Degasser Pump 2"},
        15 : { display :"Desilter Pump", key : "Desilter Pump"},
    }
    powerOptions = {
        1 : { display :"Power Generation", key : "powergeneration"},
        2 : { display :"Power Distribution", key : "powerdistribution"},
        3 : { display :"Main Generator 1", key : "Engine 1"},
        4 : { display :"Main Generator 2", key : "Engine 2"},
        5 : { display :"Main Generator 3", key : "Engine 3"},
        6 : { display :"Main Generator 4", key : "Engine 4"},
        7 : { display :"Main Generator 5", key : "Engine 5"},
    }

    updateSize = () => {
        var width = window.innerWidth
        if (window.orientation === 90) {
            if (navigator.userAgent.match(/Android/) === null) {
                // android's innerheight has issues
                width = window.innerHeight
            }
        }
        if (width >= 1200) {
            this.setState({ renderFor : 0})
        } else if (width >= 768) {
            this.setState({ renderFor : 1})
        } else {
            this.setState({ renderFor : 2})
        }
    }
    componentDidMount() {
        this.updateSize()
        window.addEventListener('resize', this.updateSize);
        window.addEventListener("orientationchange", this.updateSize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateSize);
        window.removeEventListener('orientationchange', this.updateSize);
    }

    GetMenu = () => {
        var options = { "Jacking" : this.jackingOptions, "Marine" : this.marineOptions, "Drilling" : this.drillingOptions, "Power" : this.powerOptions}
        const items = Object.keys(options).map(key => 
            <Row className="sidebarheader"  key = {key} 
            style={{padding : this.state.renderFor !== 2 ? "15px 0" : "0"}}>
                <Col style={{color : "white", padding: this.state.renderFor == 2 && "0 5px"}}>
                    <RightDropDown  title={key}
                                    className = "sidebarheaderdd"
                                    id = "sbdd"
                                    options= {options[key]}
                                    onSelect = { (selectKey,event) => {
                                        if (this.props.onAssetSelected !== undefined) {
                                            this.props.onAssetSelected()
                                        }
                                        var assetName = selectKey.replace(/ /g, '').toLowerCase()
                                        if (assetName === "assetmonitoring") {
                                            this.props.history.push("/assetmonitoring");
                                        } else if (assetName === "datavisualization") {
                                            this.props.history.push("/datavisualization");
                                        } else if (assetName === "tankgauging") {
                                            this.props.history.push("/tankgauging");
                                        } else if (assetName === "drillingoperation") {
                                            this.props.history.push("/drillingoperation");
                                        } else if (assetName === "drillingoverview") {
                                            this.props.history.push("/drillingoverview");
                                        } else if (assetName === "powergeneration") {
                                            this.props.history.push("/powergeneration");
                                        } else if (assetName === "powerdistribution") {
                                            this.props.history.push("/powerdistribution");
                                        } else {
                                            this.props.history.push("/assethealth?assetname="+assetName);
                                        }
                                    }}>
                    </RightDropDown>
                </Col>
            </Row>
        )
        
        return items
    }
    
    render() {
        if (this.state.renderFor === 0) {
            return (
                <Row className="row-eq-height sidebarrow">
                    <Col xs={2} lg={1} className="sidebar">
                        { 
                            this.GetMenu()
                        }
                    </Col>
                    <Col xs={10} lg={11} className = "sidebarcontent" >
                        {this.props.children}
                    </Col>
                </Row>)
        } else {
            return (
            <Row>
                <Col xs={{span : 10, offset : 1}}>
                    {this.GetMenu()}
                </Col>
            </Row>)
        }
    }
  }

export default withRouter(SideBar);