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
        1 : { display :"Cargo Tank Monitoring", key : "tankmonitoring"},
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
        var options = { "Cargo Tank Monitoring" : "tankmonitoring"}
        const items = Object.keys(options).map(key => 
            <Row className="sidebarheader"  key = {key} 
            style={{padding : this.state.renderFor !== 2 ? "15px 0" : "5px 0"}}>
                <Col style={{color : "white", padding: this.state.renderFor == 2 && "0 5px"}} onClick={()=>{this.props.history.push("/tankmonitoring") }} >
                {key}
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