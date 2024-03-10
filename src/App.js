import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import {LayoutManagerProvider} from './Helper/Layout/layout'
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
// import { IndexedDB } from 'react-indexed-db';

import './css/App.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Helper from './Helper.js'
import PrivateRoute from './Helper/Auth/privateRoute.js'
//pages
import HomePage from './pages/Home/Home.js'
import DemoHomePage from './pages/Home/DemoHome'
import AssetManagement from './pages/AssetManagement/Home.js'
import TankMonitoring from './pages/TankMonitoring/Home.js'
import AssetMaintenance from './pages/AssetMaintenance/Home.js'
import workOrderRecords from './pages/WorkOrders/workOrderRecords.js'
import workOrderNotification from './pages/WorkOrders/workOrderNotification.js'
import workOrderDocument from './pages/WorkOrders/workOrderDocument.js'
// import BDNRecords from './pages/BunkerDeliveryNote/BDNRecords'
// import BDN from './pages/BunkerDeliveryNote/BDN/BDN'

import { VesselReportProvider } from './pages/VesselReport/VesselReportContext'
import { DailyLogProvider } from './pages/VesselReport/DailyLogContext';
import VesselReport from './pages/VesselReport/VesselReport';
import VesselReportEditForm from './pages/VesselReport/VesselReportEditForm/VesselReportEditForm';
import DailyLogEditFrom from './pages/VesselReport/VesselReportEditForm/DailyLogEditForm';

import { VesselBreakdownProvider } from './pages/VesselBreakdown/VesselBreakdownContext';
import VesselBreakdownTable from './pages/VesselBreakdown/VesselBreakdownTable';
import VesselBreakdown from './pages/VesselBreakdown/VesselBreakdownForm';

import CrewPlanning from './pages/CrewPlanning/CrewPlanning';

import DisinfectionRecord from './pages/DisinfectionRecord/DisinfectionRecord';

import CrewTemperatureReport from './pages/CrewTemperatureReport/CrewTemperatureReport';

import CrewWorkAndRestHour from './pages/CrewWorkAndRestHours/CrewWorkAndRestHour';
import CrewWorkAndRestHourAdminUpdateForm from './pages/CrewWorkAndRestHours/CrewWorkAndRestHourAdminUpdateForm';
import CrewWorkAndRestHourAdminUpdateTable from './pages/CrewWorkAndRestHours/CrewWorkAndRestHourAdminUpdateTable';
import CrewWorkAndRestHourSelection from './pages/CrewWorkAndRestHours/CrewWorkAndRestHourSelection';
import VesselDashboard from './pages/Dashboards/VesselReportDashboard/VesselDashboard';
import FleetDashboard from './pages/Dashboards/FleetDashboard/FleetDashboard';
import ExportCSV from './pages/ExportCSV/ExportCSV';

// import { EngineLogProvider } from './pages/ELog/ELogContext'
// import ELogTable from './pages/ELog/ELogTable'
// import ELogEditForm from './pages/ELog/ELogEditForm'
// import Remarks from './pages/ELog/ELogRemarks'

// import DeckLogTable from './pages/DeckLog/DeckLogTable'
// import DeckLogEditForm from './pages/DeckLog/DeckLogEditForm'

import ShipGeneralInfo from './pages/ShipGeneralInfo/ShipGeneralInfo'

import AssetMonitoringPage from './pages/AssetMonitoring/Home'
import TankGaugingPage from './pages/TankGauging/Home'
import DataVisualizationPage from './pages/DataVisualization/Home'
import DrillingOperationPage from './pages/DrillingOperation/Home'
import DrillingOverviewPage from './pages/DrillingOverview/Home'
import PowerGenerationPage from './pages/PowerGeneration/Home'
import PowerDistributionPage from './pages/PowerDistribution/Home'
import AssetHealthDetail from './pages/AssetHealth/AssetHealthDetail.js';
import EngineDrive from './pages/AssetHealth/Power/EngineDrive'
import MudpumpDrive from './pages/AssetHealth/Power/MudPumpDrive'
import TrendingPage from './pages/Analytics/TrendingPage.js';
import AnalyticsPage from './pages/Analytics/Home.js'
import OperationPage from './pages/Operation/Home.js'
import Operations from './pages/Operations/Home.js'
import OperationInsightPage from './pages/Operation/Insight'
import OperationMapPage from './pages/Operation/Map'
import HumanFactorPage from './pages/Operation/HumanFactor/humanfactor'
import RigMovePage from './pages/Operation/RigMove/RigMove'
import AlarmMonitoringPage from './pages/Operation/AlarmMonitoring.js'
import ClassInsightPage from './pages/ClassInsight/Home.js'
import RealTimeAlarmPage from './pages/ClassInsight/RealTimeAlarm.js'
import SupportReport from './pages/ClassInsight/SupportReport'
import Login from './pages/Account/Login'
import Signup from './pages/Account/Signup'
import UnlockApp from './pages/UnlockApp/UnlockApp'
import HealthCheck from './pages/HealthCheck/HealthCheck';
import ChatManager from './pages/Chat/ChatManager';

import NavHeader from './Header.js';
import ModuleHeader from './pages/Navbar/ModuleHeader';

import { Messages, MessageProvider, MessageContext } from './Helper/Message/MessageRenderer'
import {AuthContext, AuthProvider, useAuth} from './Helper/Auth/auth'

import AuthorizedBackDated from "./pages/AuthorizedBackDated/AuthorizedBackDated";

import Model from './model/Model'
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import UnlockAppApi from "./model/UnlockAppApi";
import VesselReportExcelGenerator from "./pages/Operations/VRExcelGenerator/VesselReportExcelGenerator";

// import { OfflineStoreProvider,DBConfig } from './Helper/OfflineStore/OfflineStore';
// import { initDB } from 'react-indexed-db';
// initDB(DBConfig);
require('dotenv').config()
const api = new Model()
function App() {
  const handle = useFullScreenHandle();
  const unlockAppApi = new UnlockAppApi();
  // IsEmpty = val => val == undefined || val == null || val.toString() == '';

  useEffect(() => {
    //below code using to unlock locked screens for a particular user when they trying to close browser or tab
    window.addEventListener('unload',unlockLockedScreens);
  }, []);
  
  const unlockLockedScreens =  async () => {
    try {
        var vesselId    = JSON.parse(localStorage.getItem('selectedVessel'))?.vessel_id;
        var accountType = JSON.parse(localStorage.getItem('user')).accountType.toLowerCase();
        var currentUser = JSON.parse(localStorage.getItem('selectedVessel'))?.name;
        if (vesselId && accountType && currentUser) {
          localStorage.removeItem("VesselReportLock");
          localStorage.removeItem("DailyLogLock");
          localStorage.removeItem("CrewTemperatureLock");
          localStorage.removeItem("VesselDisinfectionLock");
          await unlockAppApi.UnlockAppBrowserTabClose(vesselId, accountType, currentUser);
        }
      }
    catch(error){
     console.log(error);
    }
  }

  return (
    <FullScreen handle={handle}>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <AuthProvider>
        {/* <OfflineStoreProvider> */}
        <MessageProvider>
        <LayoutManagerProvider>
          <Router basename={`/${window.FRONTENDSUBDIR}`}> 
          {/* <Router>  */}
            <Container fluid={true} style={{padding : 0, minHeight : "100vh", display : "flex", flexDirection : "column"}}>
            <MessageContext.Consumer>
              { ({messages, setMessages}) => {
                return(<Messages messages={messages} setMessages ={setMessages}></Messages>)}}
            </MessageContext.Consumer>
              <AuthContext.Consumer>
                  {({user, setUser, selectedVessel, setSelectedVessel}) => {
                    return (
                      user.isAuthenticated===true&&
                      <>
                        <Row noGutters = {true}>
                          <Col><NavHeader user={user} setUser={setUser} selectedVessel={selectedVessel} setSelectedVessel={setSelectedVessel} handle={handle}/></Col>
                        </Row>
                        <Row noGutters = {true}>
                          <Col><ModuleHeader user={user} selectedVessel={selectedVessel} /></Col>
                        </Row>
                      </>
                      )
                  }}
              </AuthContext.Consumer>
              <Row noGutters = {true} style={{flexGrow : 2}}>
                <Col className="content-area">
                  <PrivateRoute exact path="/" component={Home} />
                  <Route exact path="/login" component={Login}/>
                  <PrivateRoute exact path="/signup" component={Signup} />
                  <PrivateRoute exact path="/chatmanager" component={ChatManager} />
                  <PrivateRoute exact path="/assetmanagement" component={AssetManagementPage} />
                  <PrivateRoute exact path="/tankmonitoring" component={TankMonitoring} />
                  <PrivateRoute exact path="/assetmaintenance" component={workOrderDocument} />
                  <PrivateRoute exact path="/operation/document" component={workOrderDocument} />
                  <PrivateRoute exact path="/analytics" component={AnalyticsPage} />
                  <PrivateRoute exact path="/analytics/trending" component={TrendingPage} />
                  <PrivateRoute exact path="/operation" component={OperationPageManager} />
                  <PrivateRoute exact path="/operation/rigmove" component={RigMovePage} />
                  <PrivateRoute exact path="/operation/operationInsight" component={OperationInsightPage} />
                  <PrivateRoute exact path="/operation/operationMap" component={OperationMapPage} />
                  <PrivateRoute exact path="/operation/alarmmonitoring" component={AlarmMonitoringPage} />
                  <PrivateRoute exact path="/operation/HumanFactor/humanfactor" component={HumanFactorPage} />
                  {/* <Route exact path="/bunkerdelivery" component ={BDNRecords} />
                  <Route exact path="/bunkerdelivery/:BDNNo" component ={BDN} /> */}
                  {/* <EngineLogProvider>
                    <Route exact path="/elogtable" component ={ELogTable} />
                    <Route exact path="/elogeditform/:id" component ={ELogEditForm} />
                    <Route exact path="/remarks" component ={Remarks} />
                  </EngineLogProvider> */}
                  {/* <Route exact path="/decklog" component ={DeckLogTable} />
                  <Route exact path="/decklogeditform" component ={DeckLogEditForm} />
                  <Route exact path="/shipgeneralinfo" component ={ShipGeneralInfo} /> */}
                  <VesselReportProvider>
                        <DailyLogProvider>
                          <PrivateRoute exact path="/vesselreport/:backdated" component={VesselReport}/>
                          <PrivateRoute exact path="/vesselreporteditform/:shift/:backdated/:reportDate" component={VesselReportEditForm}/>
                          <PrivateRoute exact path="/dailylogeditform/:backdated/:reportDate" component={DailyLogEditFrom}/>
                        </DailyLogProvider>
                  </VesselReportProvider>
                  <VesselBreakdownProvider>
                    <PrivateRoute exact path="/vesselbreakdowntable/:isManagement" component={VesselBreakdownTable} />
                    <PrivateRoute exact path="/vesselbreakdown/:id/:isManagement" component={VesselBreakdown} />
                  </VesselBreakdownProvider>
                    <PrivateRoute exact path="/crewplanning" component={CrewPlanning} />
                    <PrivateRoute exact path="/disinfectionrecord" component={DisinfectionRecord} />
                    <PrivateRoute exact path="/crewtemperaturereport" component={CrewTemperatureReport} />
                    <PrivateRoute exact path="/crewworkandresthour/" component={CrewWorkAndRestHourSelection} />
                    <PrivateRoute exact path="/crewworkandresthour/:id/:month/:year" component={CrewWorkAndRestHour} />
                    <PrivateRoute exact path="/vesseldashboard" component={VesselDashboard} />
                    <PrivateRoute exact path="/fleetdashboard" component={FleetDashboard} />
                    <PrivateRoute exact path="/crewworkandresthourupdateform/" component={CrewWorkAndRestHourAdminUpdateForm} />
                    <PrivateRoute exact path="/crewworkandresthourupdate/" component={CrewWorkAndRestHourAdminUpdateTable} />
                    <PrivateRoute exact path="/analytics/exportdata" component={ExportCSV} />
                    <PrivateRoute exact path="/unlockapp" component={UnlockApp} />
                    <PrivateRoute exact path="/backdatedcontrol" component={AuthorizedBackDated}/>
                    <PrivateRoute exact path='/healthcheck' component={HealthCheck} />
                    <PrivateRoute exact path='/offlinevesselreport' component={VesselReportExcelGenerator} />
                </Col>
              </Row>
            </Container>
          </Router>
          </LayoutManagerProvider>
        </MessageProvider>
        {/* </OfflineStoreProvider> */}
      </AuthProvider>
    </MuiPickersUtilsProvider>
    </FullScreen>
  );
}

function Home() {
  return (
    <AuthContext.Consumer>
      {({user, setUser, selectedVessel, setSelectedVessel}) => {
        return (
          user.isAuthenticated===true&&
          (user.accountType==='admin'||user.accountType==='management')?
            <FleetDashboard />  
            :
            <VesselDashboard />
          )
      }}
    </AuthContext.Consumer>
  )
}

function AssetManagementPage() {
  return (
    <AssetManagement></AssetManagement>
  )
}

function OperationPageManager() {
  const authManager = useAuth();
  return <Operations />
  // if (authManager.user.projects.includes("FuelLng")) {
  //   return <Operations />
  // } else {
  // }
}

class AssetHealthPage extends React.Component {
  componentDidUpdate(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.setState()
    }
  }
  render() {
    const params = Helper.queryParser(this.props.location.search)
    return (
      <AssetHealthDetail assetName={params.assetname}></AssetHealthDetail>
    )
  }
}

export default App;
