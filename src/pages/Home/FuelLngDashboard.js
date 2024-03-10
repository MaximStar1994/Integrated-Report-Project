import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {withLayoutManager} from '../../Helper/Layout/layout'

import '../../css/App.css';
import '../../css/Dashboard.css';

import Tag from '../../model/Tag.js'
import Operation from './fuelLngDashboard/Operation'
import Reliability from './fuelLngDashboard/Reliability'
import Safety from './fuelLngDashboard/Safety'

class FuelLngDashboard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            organization : "-",
            project : "-",
            renderFor : props.renderFor,
        };
        this.tagController = new Tag()
    }

    static getDerivedStateFromProps(props, state) {
        if (props.renderFor !== state.renderFor) {
            state.renderFor = props.renderFor
            return state
        } else {
            return null
        }
    }

    renderLG() {
        return(
           <>
           <Row style={{height : "100%"}}>
               <Col><Operation/></Col>
               <Col><Reliability/></Col>
               <Col><Safety /></Col>
           </Row>
           </>
        )
    }
    renderMD() {
        return (
            <>
            </>
        )
    }
    renderSM(){
        return (
            <>
            </>
        )
    }
    render() {
        var contents = this.renderLG()
        // if (this.state.renderFor === 1) {
        //     contents = this.renderMD()
        // }
        // if (this.state.renderFor === 2) {
        //     contents = this.renderSM()
        // }
        return (
            <div className="content-inner-all" style={{height : "100%"}}>
            <Container fluid={true} style={{height : "100%"}}>
                {contents}
            </Container>
            </div>)
    }
}

export default withLayoutManager(FuelLngDashboard);
