import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CheckCircle from '@material-ui/icons/CheckCircle';
import NotificationIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CommentIcon from '@material-ui/icons/Comment';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import Footer from './Footer'
import WorkOrderModal from './Records/WorkOrderModal'
import './workorder.css'
import WorkOrder from '../../model/WorkOrder'
import { withLayoutManager } from '../../Helper/Layout/layout'
import moment from 'moment';
import { Collapse } from '@material-ui/core';
function CardItem(props) {
    const { row } = props;
    return (
        <>

            <div className="m-1 rectCard p-2" onClick={(e) => props.handleOpen(e, row, "detail")}   >
                <Row className="justify-content-md-left">
                    <Col xs md lg="1" ><AssignmentIcon /></Col>
                    <Col xs md lg="7" >{row.workorder}</Col>
                    <Col style={{ textAlign: 'right' }}><CheckCircle /></Col>
                </Row>
                <Row className="justify-content-md-left">
                    <Col xs md lg="1" ><SettingsIcon /></Col>
                    <Col xs md lg="7">{row.equipment}</Col>
                    <Col></Col>
                </Row>
                <Row className="justify-content-md-left">
                    <Col xs md lg="1" ><CommentIcon /></Col>
                    <Col xs md lg="7">{row.recommended}</Col>
                    <Col></Col>
                </Row>
                <Row className="justify-content-md-left">
                    <Col xs md lg="1" ><PlaylistAddCheckIcon /></Col>
                    <Col xs md lg="7">{row.status}</Col>
                    <Col style={{ textAlign: 'right' }}>{moment(row.scheduledDate).format('DD-MM')}</Col>
                </Row>
            </div>
        </>
    )
}

class WorkOrderNotification extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            workorderlist: [],
            open: false,
            content: 'feedback',
            rowData: []
        }
        this.workOrderApi = new WorkOrder()
        this.ListWorkOrderLogsForEdge = this.ListWorkOrderLogsForEdge.bind(this);
    }
    ListWorkOrderLogsForEdge() {
        this.workOrderApi.ListWorkOrderLogsForEdge(logs => {
            this.setState({ workorderlist: logs })
        })
    }
    componentDidMount() {
        this.ListWorkOrderLogsForEdge()
    }
    handleOpen = (e, row, content) => {
        this.setState({ rowData: row, open: true })

    }
    colHeader(bgcolor, number) {
        return (<div style={{ 'backgroundColor': bgcolor }} className="rectHeader">
            {number}
        </div>)
    }
    handleClose = () => {
        this.setState({ open: false })
    }

    renderLG() {
        return (<></>)
    }
    renderSM() {
        const workorderlist = this.state.workorderlist
        const { content, open, rowData } = this.state
        let HighPriorities = workorderlist.filter((item, index) => {
            if (item.priority == 'HIGH') {
                return item
            }
        })
        let MediumPriorities = workorderlist.filter((item, index) => {
            if (item.priority == 'MEDIUM') {
                return item
            }
        })
        let LowPriorities = workorderlist.filter((item, index) => {
            if (item.priority == 'LOW') {
                return item
            }
        })



        return (
            <>
                <div className="m-3" >
                    <Row  >
                        <Col xs={4} >
                            <Row>
                                <Col></Col>
                                <Col>
                                    {this.colHeader('#C46ED7', HighPriorities.length)}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="rectbgMagenta">
                                        <div>{HighPriorities.map((row, idx) => (
                                            <CardItem key={idx} row={row} handleOpen={this.handleOpen} />
                                        ))}</div>
                                    </div>
                                </Col>
                            </Row>

                        </Col>
                        <Col xs={4}>
                            <Row>
                                <Col></Col>
                                <Col>
                                    {this.colHeader('red', MediumPriorities.length)}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="rectbgRed">
                                        <div>{MediumPriorities.map((row, idx) => (
                                            <CardItem key={idx} row={row} handleOpen={this.handleOpen} />
                                        ))}</div>
                                    </div>
                                </Col>
                            </Row>

                        </Col>
                        <Col xs={4}>
                            <Row>
                                <Col></Col>
                                <Col>
                                    {this.colHeader('orange', LowPriorities.length)}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="rectbgOrange">
                                        <div>{LowPriorities.map((row, idx) => (
                                            <CardItem key={idx} row={row} handleOpen={this.handleOpen} />
                                        ))}</div>
                                    </div>
                                </Col>
                            </Row>

                        </Col>
                    </Row>
                    <WorkOrderModal content={content} openModal={open} handleClose={this.handleClose} data={rowData} />
                </div>
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
export default withLayoutManager(WorkOrderNotification)