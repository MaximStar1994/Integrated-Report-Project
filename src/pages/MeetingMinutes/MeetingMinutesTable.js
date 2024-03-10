import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'
import { withAuthManager } from '../../Helper/Auth/auth'
import PastRecordsTable from './PastRecordsTable'
import { withRouter } from "react-router-dom"
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faSync } from '@fortawesome/free-solid-svg-icons';

import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner';
import config from '../../config/config';
import MeetingMinutes from '../../model/MeetingMinute'
const rowsPerPage = 10;

class MeetingMinutesTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false
        }
    }

    componentDidMount() {
        this.setState({loaded: true})
    }

    renderLG() {
        return (<></>)
    }
    renderSM() {
        return (
        <>
        <Container>
            <Row style={{ backgroundColor: '#04384C', padding: '20px' }}>
                <Col>
                    <Row style={{ backgroundColor: '#032A39', padding: '20px' }}>
                        <Col>
                            <Row style={{ color: '#067FAA', justifyContent: 'center', alignItems: 'center', fontSize: '1.2em', paddingBottom: '15px'}}>
                                Shipboard Safety Committee MOM​
                            </Row>
                            <Row style={{ marginTop: '30px' }}>
                                <Col xs={{ span: 4 }} md={{ span: 4}} lg={{ span: 2, offset: 2}}>
                                    <Button variant="contained" type={'submit'} color="primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(5, 100, 255, 100)', width: '100%' , color: 'white' }} 
                                        // disabled={this.state.MMStatus!=='new'|| !this.props.user.apps.includes(config.apps.OPERATION)}
                                        onClick={()=>{
                                            this.props.history.push(`/meetingminutes/form`)
                                        }}> 
                                        <span className="material-icons"> note_add </span>
                                        <span style={{ marginLeft: '5px' }}>NEW</span>
                                    </Button>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '30px', color: '#067FAA', justifyContent: 'center', fontSize: '1.2em', paddingBottom: '15px' }}>
                                MEETING MINUTES RECORDS
                            </Row>
                            <Row>
                                <Col>
                                    <PastRecordsTable />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
        </>
        )

    }
    render() {
        if(this.state.loaded){
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
        else{
            return(<FullScreenSpinner />);
        }
    }
}

export default withRouter(withAuthManager(withMessageManager(withLayoutManager(MeetingMinutesTable))));