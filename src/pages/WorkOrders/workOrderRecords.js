import React, { useState,useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { withLayoutManager } from '../../Helper/Layout/layout'
import sync from '../../assets/Icon/sync.png'
import addIcons from '../../assets/Icon/addIcons.png'
import CollapsibleTable from './Records/WorkOrderTable'
import Circles from './Records/CircleBar'
import WorkOrder from '../../model/WorkOrder'
import Footer from './Footer'

class WorkOrderSummary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            workorderlist: []
        }
        this.workOrderApi = new WorkOrder()
        this.ListWorkOrderLogsForEdge = this.ListWorkOrderLogsForEdge.bind(this);
    }
    ListWorkOrderLogsForEdge(){
        this.workOrderApi.ListWorkOrderLogsForEdge(logs => {
            this.setState({ workorderlist: logs })
        })
    }
    componentDidMount() {
        this.ListWorkOrderLogsForEdge()
    }

    renderLG() {
        return (<></>)
    }
    renderSM() {
        const workorderlist = this.state.workorderlist
        return (
        <>
        <Container>
            <Row>
                <Circles />
            </Row>
            <Row><CollapsibleTable data={workorderlist} ListWorkOrderLogsForEdge={this.ListWorkOrderLogsForEdge} />
            </Row>
        </Container>
        <Footer />
        </>
        )

    }
    render() {
        if (this.props.renderFor === undefined) {
            return (<></>)
        }
        var contents = this.renderSM()
        if (this.props.renderFor === 2 || this.props.renderFor === 1) {
            contents = this.renderSM()
        }
        return (
            <div className="content-inner-all">
                {contents}
                
            </div>)
    }
}

export default withLayoutManager(WorkOrderSummary)