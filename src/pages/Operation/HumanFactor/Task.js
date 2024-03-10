import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProgressBars from './ProgressBars.js'
import PinnedSubheaderList from './ListItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons'
import ScrollingItem from '../../../components/HorizontalScrollingMenu/Home'
import './Areas.css'
import { withLayoutManager } from '../../../Helper/Layout/layout'
import HumanFactorApi from '../../../model/HumanFactor.js';
import AddTask from './AddTask'
import ListCrewTask from './ListCrewTask.js'

class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            tasklist: [],
            modalOpen: false
        }
        this.HumanFactorApi = new HumanFactorApi();
        this.handleClose = this.handleClose.bind(this);
        this._isMounted = false;
    }

    GetCrewList() {
        this.HumanFactorApi.GetCrew(((val) => {
            if (val === null) {
                return
            }
            const newList = val.map((list) => {

                return { ...list, content: 2, picture: this.HumanFactorApi.apiEndPoint + list.profilePic };
            });
            this.setState({ list: newList });
        }))
    }

    GetTaskList() {
        this.HumanFactorApi.GetTask(((val) => {
            if (val === null) {
                return
            }
            const newList = val.map((list) => {

                return { ...list };
            });
            this.setState({ tasklist: newList });
        }))
    }

    componentDidMount() {
        this._isMounted = true;
        this.GetCrewList()
        this.GetTaskList()
        this.timerID = setInterval(async () => this.GetTaskList(), 10000);
        this.timerIDCrew = setInterval(async () => this.GetCrewList(), 10000);
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this.timerID);
        clearInterval(this.timerIDCrew);
    }

    handleOpenModal = () => {

        this.setState({ modalOpen: true })
    }

    handleClose = () => {
        this.setState({ modalOpen: false })
        this.GetTaskList()
    }



    renderLG() {
        const { list, tasklist, modalOpen } = this.state

        return (
            <>
                <Container fixed="true"  >
                    {/* <Row className="justify-content-md-space-around"><ProgressBars tasklist={tasklist} /></Row> */}
                    <Row>
                        <Col md={4} sm={4} style={{margin:'5px'}}  >
                            <Row style={{justifyContent:'space-around', height:'10vh', marginBottom:'10%'}}>
                                <ProgressBars tasklist={tasklist} /></Row>
                          
                            <Row><ListCrewTask list={list} /></Row>
                        </Col>
                        <Col  >
                            
                            <Row style={{marginTop:'2%'}} >
                                <Col md={8}><div><FontAwesomeIcon icon={faFilter} />&nbsp;Filter</div></Col>
                                <Col onClick={() => this.handleOpenModal()} md={4} style={{ textAlign: "right" }} >
                                    <div><FontAwesomeIcon icon={faPlus} />&nbsp;New Task</div></Col>
                            </Row>
                            
                            <Row  > <PinnedSubheaderList tasklist={tasklist} /></Row>


                        </Col>
                    </Row>

                    {/* <Row style={{justifyContent: 'space-evenly',margin:'5px'}} ><ProgressBars tasklist={tasklist} /></Row>
                <Row style={{ height: "25vh", backgroundColor:'#1b4150' }}  >
                <ScrollingItem list={list} />
                </Row>
                <Row >
                    <Col md={8}><div><FontAwesomeIcon icon={faFilter} />&nbsp;Filter</div></Col>
                    <Col  onClick={() => this.handleOpenModal()}  md={4} style={{textAlign:"right"}} >
                        <div><FontAwesomeIcon icon={faPlus} />&nbsp;New Task</div></Col>
                </Row>
                <Row>
                    <PinnedSubheaderList tasklist={tasklist} />
                </Row> */}
                </Container>
                <AddTask openModal={modalOpen} crewList={list} handleClose={this.handleClose} />
            </>
        )
    }

    renderMD() {
        const { list, tasklist, modalOpen } = this.state

        return (
            <>
                <Container fluid={true} >
                    <Row style={{ justifyContent: 'space-evenly', margin: '5px' }} ><ProgressBars tasklist={tasklist} /></Row>
                    <Row style={{ height: "25vh", backgroundColor: '#1b4150' }}  >
                        <ScrollingItem list={list} />
                    </Row>
                    <Row >
                        <Col md={8}><div><FontAwesomeIcon icon={faFilter} />&nbsp;Filter</div></Col>
                        <Col onClick={() => this.handleOpenModal()} md={4} style={{ textAlign: "right" }} >
                            <div><FontAwesomeIcon icon={faPlus} />&nbsp;New Task</div></Col>
                    </Row>
                    <Row>
                        <PinnedSubheaderList tasklist={tasklist} />
                    </Row>
                </Container>
                <AddTask openModal={modalOpen} crewList={list} handleClose={this.handleClose} />
            </>
        )
    }

    render() {
        var contents = this.renderLG()
        if (this.props.renderFor === 1 || this.props.renderFor === 2) {
            contents = this.renderMD()
        }
        return (
            <>
                {contents}
            </>
        )

    }
}
export default withLayoutManager(Task)
