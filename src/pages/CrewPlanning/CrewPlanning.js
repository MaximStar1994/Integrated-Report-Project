import React, { Component } from 'react';
import CrewPlanningApi from '../../model/CrewPlanning';
import CrewPlanningTable from './CrewPlanningTable';
import SpareCrewTable from './SpareCrewTable';
import './CrewPlanning.css';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import Spinner from 'react-bootstrap/Spinner'
import SendIcon from '@material-ui/icons/Send';
import GetAppIcon from '@material-ui/icons/GetApp';

import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner';
import { withLayoutManager } from '../../Helper/Layout/layout';
import { withMessageManager } from '../../Helper/Message/MessageRenderer';
import config from '../../config/config';
import { CSVLink } from "react-csv";
import moment from 'moment';

class CrewPlanning extends Component {
    constructor(){
        super();
        this.crewPlanningAPI = new CrewPlanningApi();
        this.state={
            loaded: false,
            isSubmit: false,
            crew: [],
            spare: [],
            csvCrew: [],
            csvSpare: [],
            totalOptimumCrew: 0
        }
    }
    getData = async () => {
        try{
            this.setState({ loaded: false });
            this.crewPlanningAPI.CanViewCrewPlanningPage( async (value, err) => {
                if(!err){
                    if (value === true || value === 'true') {
                        let crewPlanningData = await this.crewPlanningAPI.GetCrewPlanningData();
                        this.setState({crew: crewPlanningData.crew.crewPlanningData, spare: crewPlanningData.spare, totalOptimumCrew: crewPlanningData.crew.totalOptimumCrew, loaded: true});
                    }
                    else if(value===false){
                        this.props.setMessages([{type : "danger", message : err}]);
                        window.scrollTo(0,0);
                        this.props.history.push('/assetmanagement');
                    }
                }
                else{
                    this.props.setMessages([{type : "danger", message : err}]);
                    window.scrollTo(0,0);
                    this.props.history.push('/assetmanagement');
                }
            });
        }
        catch(err){
            console.log(err);
            this.props.setMessages([{type : "danger", message : "Unable to load Crew Planning! No Internet!"}]);
            this.props.history.push('/assetmanagement');
        }
    }
    
    componentDidMount(){
        this.getData();
        window.onbeforeunload = () => {
            this.crewPlanningAPI.UnlockCrewPlanningPage((value, err)=> {
                console.log('Tying to unlock: ', value, err);
                localStorage.removeItem("CrewPlanningLock")
            });
        }
    }
    componentWillUnmount(){
        this.crewPlanningAPI.UnlockCrewPlanningPage((value, err)=> {
            console.log('Tying to unlock: ', value, err);
            localStorage.removeItem("CrewPlanningLock")
        });
    }
    countNationality = nationality => {
        let temp = 0;
        for(let c1 of this.state.crew){
            for(let c2 of c1.crew){
                if(c2.nationality===nationality)
                    temp++
            }
        }
        return temp;
    }
    changeCrewData = (value, title, keyIdx1, keyIdx2) => {
        let temp = this.state.crew;
        if(title==="LOCATION"){
            temp[keyIdx1]['location'] = value;
        }
        else if(title==="TUGS"){
            temp[keyIdx1]['name'] = value;
        }
        else if(title==="OPTIMUMCREW"){
            if(value==="")
                temp[keyIdx1]['optimumCrew'] = null;
            else
                temp[keyIdx1]['optimumCrew'] = value;
        }
        else if(title==="SHIFT"){
            temp[keyIdx1]['shift'] = value;
        }
        else if(title==="OPS"){
            temp[keyIdx1]['ops'] = value;
        }
        else if(title==="NATIONALITY"){
            temp[keyIdx1]['crew'][keyIdx2]['nationality'] = value;
        }
        else if(title==="RANKS"){
            temp[keyIdx1]['crew'][keyIdx2]['rank'] = value;
        }
        else if(title==="NAMES"){
            temp[keyIdx1]['crew'][keyIdx2]['name'] = value;
        }
        else if(title==="EMPLOYEENO"){
            temp[keyIdx1]['crew'][keyIdx2]['employeeNo'] = value;
        }
        else if(title==="JOININGDATE"){
            temp[keyIdx1]['crew'][keyIdx2]['joiningDate'] = value;
        }
        else if(title==="NOOFMONTHS"){
            if(value==="")
                temp[keyIdx1]['crew'][keyIdx2]['monthsAsOf31Jul2021'] = null;
            else
                temp[keyIdx1]['crew'][keyIdx2]['monthsAsOf31Jul2021'] = parseInt(value);
        }
        else if(title==="REMARKS"){
            temp[keyIdx1]['crew'][keyIdx2]['remarks'] = value;
        }
        this.setState({ crew: temp});
    }
    changeSpareCrewData = (value, title, keyIdx) => {
        let temp = this.state.spare;
        if(title==="LOCATION"){
            temp[keyIdx]['location'] = value;
        }
        else if(title==="TUGS"){
            temp[keyIdx]['name'] = value;
        }
        else if(title==="SHIFT"){
            temp[keyIdx]['shift'] = value;
        }
        else if(title==="OPS"){
            temp[keyIdx]['ops'] = value;
        }
        else if(title==="NATIONALITY"){
            temp[keyIdx]['nationality'] = value;
        }
        else if(title==="RANKS"){
            temp[keyIdx]['rank'] = value;
        }
        else if(title==="NAMES"){
            temp[keyIdx]['name'] = value;
        }
        else if(title==="EMPLOYEENO"){
            temp[keyIdx]['employeeNo'] = value;
        }
        else if(title==="JOININGDATE"){
            temp[keyIdx]['joiningDate'] = value;
        }
        else if(title==="NOOFMONTHS"){
            if(value==='')
                temp[keyIdx]['monthsAsOf31Jul2021'] = null;
            else
                temp[keyIdx]['monthsAsOf31Jul2021'] = parseInt(value);
        }
        else if(title==="REMARKS"){
            temp[keyIdx]['remarks'] = value;
        }
        this.setState({ spare: temp});
    }
    addSpareCrew = () => {
        let temp = this.state.spare;
        temp.push({
            location:"",
            shift:"",
            ops:"",
            nationality:"",
            rank:"",
            name:"",
            employeeNo: "",
            joiningDate: null,
            monthsAsOf31Jul2021: null,
            remarks:""
        });
        this.setState({ spare: temp })
    }
    isEmpty = (element) =>{
        if(element===undefined || element===null || element==='')
            return true;
        else
            return false;
    }
    findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
    testValidity=()=>{
        let validity=true;
        let employeeCodes = [];
        this.state.crew.forEach(element=>{
            element.crew.forEach(crewElement=>{
                if(this.isEmpty(crewElement.name?.trim())===true && this.isEmpty(crewElement.employeeNo?.trim())===false){
                    validity = false;
                    this.props.setMessages([{type : "danger", message : `${crewElement.employeeNo?.trim()} is missing name.`}]);
                }
                else if(this.isEmpty(crewElement.name?.trim())===false && this.isEmpty(crewElement.employeeNo?.trim())===true){
                    validity = false;
                    this.props.setMessages([{type : "danger", message : `${crewElement.name?.trim()} is missing Employee Id.`}]);
                }
                else if(this.isEmpty(crewElement.name?.trim())===false && this.isEmpty(crewElement.employeeNo?.trim())===false){
                    employeeCodes.push(crewElement.employeeNo?.trim());
                }
            })
        })
        let duplicates = [...new Set(this.findDuplicates(employeeCodes))]
        if(duplicates.length>0){
            validity=false;
            this.props.setMessages([{type : "danger", message : `${duplicates[0]} is missing used multiple times.`}]);
        }
        return validity;
    }
    submitCrewData = async() => {
        if(this.testValidity()===true){
            this.setState({isSubmit: true});
            try{
                await this.crewPlanningAPI.PostCrewPlanningData({ crewPlanningData: this.state.crew, spare: this.state.spare });
                this.props.setMessages([{type : "success", message : "Submitted!"}]);
                this.props.history.push('/');
            }
            catch(err){
                this.props.setMessages([{type : "danger", message : "Unable to submit!"}]);
                console.log("Error at submitting crew data: ", err);
            }
            this.setState({isSubmit: false});
        }
    }
    csvHeaders=[
        { label: 'Lcation', key: 'location' },
        { label: 'Tugs', key: 'name' },
        { label: 'Optimum Crew/Tug', key: 'optimumCrew' },
        { label: 'Shift', key: 'shift' },
        { label: 'ops', key: 'ops' },
        { label: 'crew.nationality', key: 'crew.nationality' },
    ];
    updateCrewCSV = () => {
        let temp = [['No.', 'LOCATION', 'TUGS', 'OPTIMUM CREW/TUG', 'SHIFT', 'OPS', 'NATIONALITY', 'RANKS', 'NAMES', 'EMPLOYEE NO', 'JOINING DATE', 'NO. OF MONTHS ON BOARD', 'REMARKS']];
        let count=1;
        for(let i=0; i<this.state.crew.length; i++){
            for(let j=0; j<this.state.crew[i].crew.length; j++){
                temp.push([count, this.state.crew[i].location, this.state.crew[i].name, this.state.crew[i].optimumCrew, this.state.crew[i].shift, this.state.crew[i].ops, this.state.crew[i].crew[j].nationality, this.state.crew[i].crew[j].rank, this.state.crew[i].crew[j].name, this.state.crew[i].crew[j].employeeNo, this.isEmpty(this.state.crew[i].crew[j].joiningDate)?'':moment(this.state.crew[i].crew[j].joiningDate).format('DD-MM-YYYY'), this.isEmpty(this.state.crew[i].crew[j].joiningDate)?'':moment().diff(moment(this.state.crew[i].crew[j].joiningDate), 'months') , this.state.crew[i].crew[j].remarks]);
                count++;
            }
        }
        this.setState({ csvCrew: temp });
        return temp;
    }
    updateSpareCSV = () => {
        let temp = [['No.', 'LOCATION', 'SHIFT', 'OPS', 'NATIONALITY', 'RANKS', 'NAMES', 'EMPLOYEE NO', 'JOINING DATE', 'NO. OF MONTHS ON BOARD', 'REMARKS']];
        let count=1;
        for(let i=0; i<this.state.spare.length; i++){
            temp.push([count, this.state.spare[i].location, this.state.spare[i].shift, this.state.spare[i].ops, this.state.spare[i].nationality, this.state.spare[i].rank, this.state.spare[i].name, this.state.spare[i].employeeNo, this.isEmpty(this.state.spare[i].joiningDate)?'':moment(this.state.spare[i].joiningDate).format('DD-MM-YYYY'), this.isEmpty(this.state.spare[i].joiningDate)?'':moment().diff(moment(this.state.spare[i].joiningDate), 'months') , this.state.spare[i].remarks]);
            count++;
        }
        this.setState({ csvSpare: temp });
        return temp;
    }
    render(){
        return(
            <React.Fragment>
                {this.state.loaded===true?
                    <Container fluid>
                        <Row>
                            <Col style={{ padding: '0px' }}>
                                <Tab.Container id="CrewTabs" defaultActiveKey="CrewPlanningTab">
                                    <Row>
                                        <Col xs={2} className="CrewTabs">
                                        <Nav variant="pills" className="flex-column">
                                            <Nav.Item>
                                                <Nav.Link eventKey="CrewPlanningTab">Crew Planning for KST & MAJU Maritime</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="SpareCrewTab">Spare Local Crew & Cadets</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                        </Col>
                                        <Col xs={10} className="CrewPlanningContent">
                                        <Tab.Content>
                                            <Tab.Pane eventKey="CrewPlanningTab">
                                                <div style={{ marginTop: '10px' }}>
                                                    <div style={{ marginLeft: 'auto', paddingBottom: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                                                        <CSVLink 
                                                            data={this.state.csvCrew} 
                                                            onClick={()=>this.updateCrewCSV()} 
                                                            filename={`Crew Planning Data - ${moment().format('DD-MM-YYYY')}.csv`}
                                                            className="btn btn-primary"
                                                            style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }}
                                                        >
                                                            <GetAppIcon style={{ color: config.KSTColors.ICON }}/>
                                                            <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Export</span>
                                                        </CSVLink>
                                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} onClick={()=> {this.submitCrewData()}} disabled={this.state.isSubmit}>
                                                            {this.state.isSubmit===true?
                                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                                                            :
                                                                <SendIcon style={{ color: config.KSTColors.ICON }}/>
                                                            }
                                                            <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Save Changes</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className='crewPlanningHeaderBase'>
                                                    <div  className="crewPlanningHeaderBackground">
                                                        <div className="VesselReportHeading">
                                                                CREW PLANNING FOR KST & MAJU MARITIME
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <Row>
                                                    <Col>
                                                        <div className="crewSummary">
                                                            <Col>
                                                                <div>TOTAL OPTIMUM <br />NO. OF CREW</div>
                                                                {/* <div className="crewSummaryCounterBox">{this.state.totalOptimumCrew}</div> */}
                                                            </Col>
                                                            <Col>
                                                                <div>TOTAL CREW AS OF MAY 2020 <br /> (SINGAPOREAN & INDONESIAN)</div>
                                                                {/* <div className="crewSummaryCounterBox">{this.countNationality("Indonesian")+this.countNationality("Singaporean")}</div> */}
                                                            </Col>
                                                            <Col>
                                                                <div>TOTAL CREW AS OF MAY 2020 <br /> (INDONESIAN)</div>
                                                                {/* <div className="crewSummaryCounterBox">{this.countNationality("Indonesian")}</div> */}
                                                            </Col>
                                                            <Col>
                                                                <div>TOTAL CREW AS OF MAY 2020 <br /> (SINGAPOREAN)</div>
                                                                {/* <div className="crewSummaryCounterBox">{this.countNationality("Singaporean")}</div> */}
                                                            </Col>
                                                        </div>
                                                        <div className="crewSummary">
                                                            <Col>
                                                                {/* <div>TOTAL OPTIMUM <br />NO. OF CREW</div> */}
                                                                <div className="crewSummaryCounterBox">{this.state.totalOptimumCrew}</div>
                                                            </Col>
                                                            <Col>
                                                                {/* <div>TOTAL CREW AS OF MAY 2020 <br /> (SINGAPOREAN & INDONESIAN)</div> */}
                                                                <div className="crewSummaryCounterBox">{this.countNationality("Indonesian")+this.countNationality("Singaporean")}</div>
                                                            </Col>
                                                            <Col>
                                                                {/* <div>TOTAL CREW AS OF MAY 2020 <br /> (INDONESIAN)</div> */}
                                                                <div className="crewSummaryCounterBox">{this.countNationality("Indonesian")}</div>
                                                            </Col>
                                                            <Col>
                                                                {/* <div>TOTAL CREW AS OF MAY 2020 <br /> (SINGAPOREAN)</div> */}
                                                                <div className="crewSummaryCounterBox">{this.countNationality("Singaporean")}</div>
                                                            </Col>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <CrewPlanningTable crew={this.state.crew} changeCrewData={this.changeCrewData}/>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="SpareCrewTab" style={{ overflowY: 'scroll', height: '100vh' }}>
                                                <div className='crewPlanningHeaderBase'>
                                                    <div style={{ marginLeft: 'auto', marginBottom: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                                                        <CSVLink 
                                                            data={this.state.csvSpare} 
                                                            onClick={()=>this.updateSpareCSV()} 
                                                            filename={`Spare Crew Data - ${moment().format('DD-MM-YYYY')}.csv`}
                                                            className="btn btn-primary"
                                                            style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }}
                                                        >
                                                            <GetAppIcon style={{ color: config.KSTColors.ICON }}/>
                                                            <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Export</span>
                                                        </CSVLink>
                                                        <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON }} onClick={()=> {this.submitCrewData()}} disabled={this.state.isSubmit}>
                                                            {this.state.isSubmit===true?
                                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ color: config.KSTColors.ICON }} />
                                                            :
                                                                <SendIcon style={{ color: config.KSTColors.ICON }}/>
                                                            }
                                                            <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Save Changes</span>
                                                        </Button>
                                                    </div>
                                                    <div  className="crewPlanningHeaderBackground">
                                                        <div className="VesselReportHeading">
                                                            SPARE LOCAL CREW & CADETS
                                                        </div>
                                                    </div>
                                                </div>
                                                <SpareCrewTable spare={this.state.spare} changeCrewData={this.changeSpareCrewData} addSpareCrew={this.addSpareCrew}/>
                                            </Tab.Pane>
                                        </Tab.Content>
                                        </Col>
                                    </Row>
                                </Tab.Container>
                            </Col>
                        </Row>
                    </Container>
                :
                <FullScreenSpinner text={"Loading..."}/>
                }
            </React.Fragment>
        );
    }
}

export default withLayoutManager(withMessageManager(CrewPlanning));
