import React, {Component} from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableFooter, TableRow, Paper,Checkbox } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';
import './VesselReport.css';
import { withLayoutManager } from '../../Helper/Layout/layout'
import { withRouter } from "react-router-dom"
import { withVesselReport } from './VesselReportContext';
import { withDailyLog } from './DailyLogContext';
import AuthorizedBackDatedApi from "../../model/AuthorizedBackDatedApi";
import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner';
import { MORNINGIDENTIFIER, EVENINGIDENTIFIER, VESSELREPORTEDITFORMIDENTIFIER, DAILYLOGEDITFORMIDENTIFIER } from './VesselReportEditForm/VesselReportFormStructure';
import config from '../../config/config';
// import UnlockAppApi from '../../model/UnlockAppApi';
var TIMEZONE = config.TIMEZONE;

class VesselReport extends Component {
  authorizedBackDatedApi = new AuthorizedBackDatedApi();
  // unlockAppApi = new UnlockAppApi();
    state={
        date: moment(),
        //below field used to get the available report dates list
        authorizedBackDatedFormList: [],
        formList: ["MORNINGSHIFT", "EVENINGSHIFT", "DAILYLOG"],
         //below field used to get the available shifts of a single report date
        shiftList: [],
        CustomTag: Container,
    }
  componentDidMount() {
        // window.addEventListener('unload', this.unlockVesselReportApp);
        if (this.props.match.params.backdated === "true") {
          this.state.CustomTag = `div`;
          this.isAuthorizedBackDatedDataAvailable();
        }
  
        let timeStampToUse = moment.tz(new Date(), TIMEZONE);
        if(moment.tz(new Date(), TIMEZONE).isBefore(
            moment.tz(new Date(), TIMEZONE).set('hour', 8).set('minute', 30).set('second', 0).set('millisecond', 0)
        )){
            timeStampToUse.subtract(1, 'day');
        }
        this.setState({ date: timeStampToUse });
        //Below function first argument set to TRUE because to restrict report forms lock from parent component
        this.props.getVesselReport("true",null, (value, err) => {
        });
        this.props.getDailyLog("true",(value, err) => {
        });
  }
      
    //   unlockVesselReportApp = async(e) => {
    //     try {
    //       if (localStorage.getItem("VesselReportLock") && localStorage.getItem("VesselReportLock") !== null || localStorage.getItem("DailyLogLock") && localStorage.getItem("DailyLogLock") !== null) {
    //         var vesselId = JSON.parse(localStorage.getItem("user")).vessels[0].vesselId;
    //         await this.unlockAppApi.UnlockAppBrowserTabClose(vesselId);
    //       }
    //     }
    //     catch(error){
    //      console.log(error);
    //     }
    // }
    
    isAuthorizedBackDatedDataAvailable = async () => {
      try {
        var vesselId = JSON.parse(localStorage.getItem("user")).vessels[0].vesselId;
        //Fetching list of report date's available from backdated control app
        var fetchBackDatedListByVesselId = await this.authorizedBackDatedApi.isAuthorizedBackDatedDataAvailable(vesselId);
        this.state.authorizedBackDatedFormList = fetchBackDatedListByVesselId;
        // if no data available, navigate it to operation screen
        if (this.props.match.params.backdated === "true" && this.state.authorizedBackDatedFormList.length === 0) {
          this.props.history.push({
            pathname: "/operation",
          })
        }
        this.state.authorizedBackDatedFormList[0].checked = true;
        //Onload first index have to check default
        var firstIndexFormList = await this.authorizedBackDatedApi.fetchShiftBackDatedDataByReportDate(vesselId,this.state.authorizedBackDatedFormList[0].reportdate);
        this.setState({
          shiftList: [...firstIndexFormList],
          authorizedBackDatedFormList: [...fetchBackDatedListByVesselId],
        });
      } catch (error) {
        console.log(error);
      }
    };

    handleCheckboxChange = async (event, index) => {
      try {
        this.state.authorizedBackDatedFormList.map((form) => form.checked = false);
        this.state.authorizedBackDatedFormList[index].checked = event.target.checked;
        var fetchBackDatedShiftByReportDateList = [];
        if (event.target.checked) {
          var vesselId = JSON.parse(localStorage.getItem("user")).vessels[0].vesselId;
          fetchBackDatedShiftByReportDateList = await this.authorizedBackDatedApi.fetchShiftBackDatedDataByReportDate(vesselId, event.target.value);
        }
          this.setState({
          authorizedBackDatedFormList: [...this.state.authorizedBackDatedFormList],
          shiftList: [...fetchBackDatedShiftByReportDateList]
      });
      } catch (error) {
        console.log(error);
      }
    }

  render() {
      const morningShiftUI = (
        <Row style={{backgroundColor: config.KSTColors.CARD_BG,height: "150px",borderRadius: "15px",marginTop: "30px"}}>
          <Col xs={2} style={{ padding: "0px" }}>
            <Button disabled={this.props.match.params.backdated === "true" ? false : this.props.canEditMorningShift === false} className="VesselReportEditButton"
              style={{ backgroundColor: config.KSTColors.MAIN,borderColor: config.KSTColors.MAIN}}
              onClick={() =>
                this.props.history.push({
                  pathname: `${VESSELREPORTEDITFORMIDENTIFIER}${MORNINGIDENTIFIER}/${
                    this.props.match.params.backdated === "false" ? false : true
                  }/${this.props.match.params.backdated === "false" ? "N" : this.state.shiftList[0].reportdate}`,
                })
              }
            >
              <FontAwesomeIcon icon={faEdit} style={{color: config.KSTColors.ICON,fontSize: "50px"}} />
            </Button>
          </Col>
          <Col xs={8}>
            <div style={{display: "flex",width: "100%",height: "100%",flexDirection: "column",justifyContent: "center"}}>
              <div style={{marginTop: "5px",width: "100%",height: "50%",color: config.KSTColors.MAIN,fontSize: "2.5rem",
                  display: "flex",justifyContent: "center",alignItems: "center"}}>
                Morning Shift Log
              </div>
              {/* <div style={{ marginTop: '10px', width: '100%', height: '50%', color: config.KSTColors.WHITE, fontSize: '2.5rem', fontWeight: 'bolder', display: 'flex', justifyContent: 'center' }}>
                                      0730 - 1930
                                  </div> */}
            </div>
          </Col>
          {/* Show Grey icon only for Non-Backdated form  */}
          {this.props.match.params.backdated === "false" ? 
          <Col xs={2}>
              <div style={{display: "flex",width: "100%",height: "100%",justifyContent: "center",alignItems: "center"}}>
                <div style={{height: "40px",width: "40px",borderRadius: "50%",backgroundColor: this.props.canEditMorningShift === true
                        ? config.KSTColors.GREYDOT : config.KSTColors.GREENDOT}} />
              </div>
          </Col> : <div />}
        </Row>
      );
    
      const eveningShiftUI = (
        <Row style={{backgroundColor: config.KSTColors.CARD_BG,height: "150px",borderRadius: "15px",marginTop: "30px"}}>
          <Col xs={2} style={{ padding: "0px" }}>
            <Button disabled={this.props.match.params.backdated === "true" ? false : this.props.canEditEveningShift === false} className="VesselReportEditButton"
              style={{backgroundColor: config.KSTColors.MAIN,borderColor: config.KSTColors.MAIN}}
              onClick={() =>
                this.props.history.push({
                  pathname: `${VESSELREPORTEDITFORMIDENTIFIER}${EVENINGIDENTIFIER}/${
                    this.props.match.params.backdated === "false" ? false : true
                  }/${this.props.match.params.backdated === "false" ? "N" : this.state.shiftList[0].reportdate}`,
                })
              }
            >
              <FontAwesomeIcon icon={faEdit} style={{color: config.KSTColors.ICON,fontSize: "50px"}}/>
            </Button>
          </Col>
          <Col xs={8}>
            <div style={{display: "flex",width: "100%",height: "100%", flexDirection: "column",justifyContent: "center"}}>
              <div style={{ marginTop: "5px",width: "100%",height: "50%",color: config.KSTColors.MAIN,fontSize: "2.5rem",
                  display: "flex",justifyContent: "center",alignItems: "center"}}>
                Evening Shift Log
              </div>
              {/* <div style={{ marginTop: '10px', width: '100%', height: '50%', color: config.KSTColors.WHITE, fontSize: '2.5rem', fontWeight: 'bolder', display: 'flex', justifyContent: 'center' }}>
                                      1930 - 0730
                                  </div> */}
            </div>
          </Col>
          {/* Show Grey color icon only for Non-back dated form */}
          {this.props.match.params.backdated === "false" ? 
            <Col xs={2}>
              <div style={{ display: "flex",width: "100%",height: "100%",justifyContent: "center",alignItems: "center"}}>
                <div style={{ height: "40px",width: "40px",borderRadius: "50%",backgroundColor: this.props.canEditEveningShift === true
                        ? config.KSTColors.GREYDOT : config.KSTColors.GREENDOT}}/>
              </div>
            </Col> : <div />
          }
        </Row>
      );
  
      const dailyLogUI = (
        <Row style={{backgroundColor: config.KSTColors.CARD_BG,height: "150px",borderRadius: "15px"}}>
          <Col xs={2} style={{ padding: "0px" }}>
            <Button key={this.props.canEditDailyLog} disabled={this.props.match.params.backdated === "true" ? false : this.props.canEditDailyLog === false} className="VesselReportEditButton"
              style={{backgroundColor: config.KSTColors.MAIN,borderColor: config.KSTColors.MAIN}}
              onClick={() =>
                this.props.history.push({
                  pathname: `${DAILYLOGEDITFORMIDENTIFIER}/${this.props.match.params.backdated === "false" ? false : true}/${this.props.match.params.backdated === "false" ? "N" : this.state.shiftList[0].reportdate}`,
                })}
                >
              <FontAwesomeIcon icon={faEdit} style={{color: config.KSTColors.ICON,fontSize: "50px"}}/>
            </Button>
          </Col>
          <Col xs={8}>
            <div style={{display: "flex",width: "100%",height: "100%",flexDirection: "column",justifyContent: "center"}}>
              <div style={{marginTop: "5px",width: "100%",height: "50%",color: config.KSTColors.MAIN,fontSize: "2.5rem",
                  display: "flex",justifyContent: "center",alignItems: "center"}}>Daily Log</div>
            </div>
          </Col>
          { 
            this.props.match.params.backdated === "false" ? 
            <Col xs={2}>
              <div style={{display: "flex",width: "100%",height: "100%",justifyContent: "center",alignItems: "center"}}>
                <div key={this.props.canEditDailyLog} style={{height: "40px",width: "40px",borderRadius: "50%",backgroundColor:
                      this.props.canEditDailyLog === true ? config.KSTColors.GREYDOT : config.KSTColors.GREENDOT,
                  }}
                />
              </div>
            </Col> : <div />
          }
        </Row>
      );
    
      return(
        <React.Fragment>
          {this.props.VesselReportTableLoaded === true && this.props.DailyLogTableLoaded === true ? (
        <Container fluid className="KSTBackground" style={{backgroundColor: this.props.match.params.backdated === "false" ? "#f2f2f2" : "#e6e6e6"}}>
          <this.state.CustomTag>
            <Row style={{ height: this.props.match.params.backdated === "true" ? "100vh" : ""}}>
              {this.props.match.params.backdated === "true" && this.state.authorizedBackDatedFormList.length > 0 ? <Col  xs={12} md={2} style={{maxHeight: "100%",overflowY: "scroll", justifyContent: "center", backgroundColor: "#f2f2f2"}}>
                <Col style={{ marginTop: "20px" }}>
                          <Row style={{color: config.KSTColors.WHITE,backgroundColor: config.KSTColors.MAIN,justifyContent: "center",paddingBlock: "10px"}}>
                            Report date
                            </Row>
                        </Col>
                        {this.state.authorizedBackDatedFormList.map((form, index) => (
                          <Col style={{backgroundColor: "#8e91a4",marginTop: "7px"}}>
                            <Checkbox
                              value={form.reportdate}
                              checked={form.checked}
                              onClick={event => this.handleCheckboxChange(event, index)}
                              color="primary"
                            />
                            <span style={{ color: config.KSTColors.WHITE,fontSize: "18px"}}>{form.reportdate}</span>
                          </Col>
                        ))}
                      </Col> : <Container />}
                      {this.props.match.params.backdated === "true" ? <div style={{ width: "15px"}} /> : <div />}
                              <Col xs={12} md={9} style={{ paddingBottom: "15px",paddingTop: "40px"}}>
                              {/* Main Section */}
                                  <Row style={{ textAlign: 'center', height: '2rem' }}>
                                      <Col>
                                          <div style={{textAlign: "center",fontSize: "2rem",color: config.KSTColors.MAIN,fontWeight: "900",height: "100%"}}>
                                              {this.props.match.params.backdated === "false" ? "VESSEL REPORT FORM" : "BACK DATED VESSEL REPORT FORM"}
                                          </div>
                                      </Col>
                                  </Row>
                                  {this.props.match.params.backdated === "false" ? (
                                      <Row style={{textAlign: "center",height: "1.2rem",marginTop: "20px"}}>
                                          <Col>
                                              <Row>
                                              <Col style={{textAlign: "center",fontSize: "1.2rem",color: config.KSTColors.MAIN,fontWeight: "900", }} >
                                                  {this.state.date.format("DD MMM YYYY")}
                                              </Col>
                                              </Row>
                                              <Row style={{ marginTop: "10px" }}>
                                                  <Col style={{ textAlign: "center", fontSize: "1rem", color: config.KSTColors.MAIN, fontWeight: "600", }} >
                                                      New log starts at 08:30 AM every day
                                                  </Col>
                                              </Row>
                                          </Col>
                                      </Row> ) 
                                  : 
                                      (<Container/>)
                                  }

                                  {this.props.match.params.backdated === "false" ? 
                                      (<Row style={{ marginTop: "36px" }}>
                                          <div style={{ width: "100%", textAlign: "center", borderBottom: `3px solid ${config.KSTColors.MAIN}`, lineHeight: "0.1em", margin: "10px 0 20px", }} >
                                              <span style={{ backgroundColor: config.KSTColors.BACKGROUND, padding: "0 10px", color: config.KSTColors.MAIN, fontWeight: "900", }} >
                                              Select Shift Log Timing For Machinery
                                              </span>
                                          </div>
                                      </Row>) 
                                  : 
                                      ( <Container /> )
                                  }

                                  {/* morning shift UI */}
                                  {this.props.match.params.backdated === "false" ? (morningShiftUI) :
                                  this.props.match.params.backdated === "true" && this.state.shiftList.length > 0 &&
                                  this.state.shiftList.filter( (obj) => obj.form == this.state.formList[0] ).length > 0 ? (
                                  morningShiftUI
                                  ) : ( <div /> )}
                                  {/* evening shift UI */}
                                  {this.props.match.params.backdated === "false" ? (eveningShiftUI) :
                                  this.props.match.params.backdated === "true" && this.state.shiftList.length > 0 &&
                                  this.state.shiftList.filter( (obj) => obj.form == this.state.formList[1] ).length > 0 ? (
                                  eveningShiftUI
                                  ) : ( <div /> )}
                                
                                  {this.props.match.params.backdated === "false" ?
                                      (<Row style={{ marginTop: "36px" }}>
                                          <div style={{ width: "100%", textAlign: "center", borderBottom: `3px solid ${config.KSTColors.MAIN}`, lineHeight: "0.1em", margin: "10px 0 20px", }} >
                                              <span style={{ backgroundColor: config.KSTColors.BACKGROUND, padding: "0 10px", color: config.KSTColors.MAIN, fontWeight: "900", }} >
                                              Daily Log to be completed by 0100 hrs for each day
                                              </span>
                                          </div>
                                      </Row>) 
                                  :
                                  ( <Container style={{ height: "30px" }} /> )
                                  }
                                    {/* Daily Log UI */}
                                  {this.props.match.params.backdated === "false" ? (dailyLogUI) :
                                    this.props.match.params.backdated === "true" && this.state.shiftList.length > 0 &&
                                    this.state.shiftList.filter( (obj) => obj.form == this.state.formList[2] ).length > 0 ? (
                                    dailyLogUI
                                    ) : ( <div /> )}
                              </Col>
                              {/* History Records */}
                              {this.props.match.params.backdated === "false" ? (
                                  <Col xs={12} md={3}  style={{marginTop: "20px"}}>
                                      <Paper>
                                          <TableContainer >
                                              <Table stickyHeader aria-label="sticky table" size={'small'}>
                                                  <TableHead>
                                                      <TableRow>
                                                          <TableCell style={{ backgroundColor: config.KSTColors.MAIN, color: config.KSTColors.WHITE, borderBottom: `5px solid ${config.KSTColors.BACKGROUND}` }} align="center"><span> History Records </span></TableCell>
                                                      </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                      
                                                  {this.props.pastVesselReport.concat(this.props.pastDailyLog).sort((a,b)=>{
                                                      if(moment(a.reportDate, 'DD-MM-YYYY').isBefore(moment(b.reportDate, 'DD-MM-YYYY'))){
                                                          return 1;
                                                      }
                                                      else{
                                                          return -1;
                                                      }
                                                  }).map((row, idx) => (
                                                    <TableRow hover  style={{ width: "100%", borderRadius: "15px",pointerEvents: `${row.filepath === null ? "none" : "auto"}` }} tabIndex={-1} key={idx} onClick={() => window.open( `${window.RIGCAREBACKENDURL}/${row.filepath}`, "_blank" ) }>
                                                      <TableCell className="HistoryCells" align="left"
                                                        style={{ borderBottom: `5px solid ${config.KSTColors.BACKGROUND}`,paddingLeft: "20px" }} >
                                                        <span style={{ color: config.KSTColors.ICON, paddingRight: "10px", }} >
                                                          <FontAwesomeIcon icon={faFilePdf} />
                                                        </span>
                                                        <span style={{ color: config.KSTColors.WHITE,fontSize: "14px" }}>
                                                          {moment(row.reportDate, "DD-MM-YYYY").format("DD / MM / YYYY")}{" "}
                                                          {row.shift === 1 && "Morning"}
                                                          {row.shift === 2 && "Afternoon"}
                                                          {(row.shift === undefined ||row.shift === null) && "Daily Log"}
                                                          {row.backdated === true && row.offline === false ? " - BD" : ""}
                                                          {row.offline === true && " - OFL"}
                                                        </span>
                                                      </TableCell>
                                                    </TableRow>
                                                  ))}  
                                                  </TableBody>
                                                  <TableFooter style={{ backgroundColor: config.KSTColors.MAIN}}>
                                                      <TableRow>
                                                          <TableCell className='cursorPointer' style={{ backgroundColor: config.KSTColors.MAIN, color: config.KSTColors.WHITE, borderBottom: `3px solid ${config.KSTColors.MAIN}` }} align="center" ><span> {'MORE >>'} </span></TableCell>
                                                      </TableRow>
                                                  </TableFooter>
                                              </Table>
                                          </TableContainer>
                                      </Paper>
                                  
                                  </Col>)
                                  : 
                                      ( <div></div> )
                              }
                          </Row>
                      </this.state.CustomTag>
                  </Container>
                  ):(
                  <FullScreenSpinner />)
              }
          </React.Fragment>
      );
    }
}

export default withRouter(withLayoutManager(withVesselReport(withDailyLog(VesselReport))));