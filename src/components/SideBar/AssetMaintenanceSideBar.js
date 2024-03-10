import React from 'react';
import { withRouter } from "react-router-dom";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './SideBar.css'
import RightDropDown from '../RightDropDown/RightDropDown.js'
// import Tag from '../../model/Tag.js'

class AssetMaintenanceSideBar extends React.Component {

    real = {
        1 : { display :"Asset Monitoring", key : "assetmonitoring"}
    }    

    GetMenu = () => {
        var options = ["Work Order"]
        const items = options.map(key => 
            <Row className="sidebarheader clickable"  key = {key} style={{padding : "15px 0"}}>
                <Col style={{color : "white"}} onClick={() => {
                    if (key === "Work Order") {
                        this.props.history.push('/assetmaintenance/workOrderSummary')
                    }
                }}>
                   {key}
                </Col>
            </Row>
        )
        
        return items
    }
    
    render() {
      return (
        <Row className="row-eq-height">
            <Col xs={1} className="sidebar">
                { 
                    this.GetMenu()
                }
            </Col>
            <Col xs={11} className = "" >
                {this.props.children}
            </Col>
        </Row>)
    }
  }

export default withRouter(AssetMaintenanceSideBar);