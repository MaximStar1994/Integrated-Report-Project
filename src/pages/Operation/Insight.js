import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import DashboardCardWithHeader from '../../components/DashboardCard/DashboardCardWithHeader';
import BiaxialLineChart from '../../components/BiaxialLineChart/BiaxialLineChart.js';
import LEDDisplay from '../../components/Display/Display_BlackBGBlueFont.js';
import RigmoveApi from '../../model/Rigmove.js';
import PowerApi from '../../model/Power.js';
import RigApi from '../../model/Rig.js';
import AlarmApi from '../../model/Alarm.js';
import { parseInputwLeadzero4 } from '../../Helper/GeneralFunc/parseInputToFixed2.js';
import { setOperationNovInterval, setOperationPerfInterval, setOperationRealTimeInterval, cycleCountMinutesRange, chartNovMinutesRange } from '../../Helper/GeneralFunc/setIntervals.js';
import { Styletables, Systemsource } from '../../components/Table/table.js'
import { withLayoutManager } from '../../Helper/Layout/layout'

class Insight extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      project: localStorage.getItem("project") || "B357",
      topDriveReturnData: [],
      drawWorkReturnData: [],
      returnData: [],
      powerData: [],
      fuelsData: [],
      efficiencyData: [],
      performanceData: [],
      alarmTable: [],
      systemTable: [],
      cycleCountTable: [],
      cycleTagData: [],
      blackOutRisk: [],
      //chartNovTag: "BIT_DEPTH,TOTAL_DEPTH,AVG_ROP,DW_HOOKLOADGAUGE,DrawworksHmi_Io_TopOfBlockPV",
      chartNovTag: {
        "BIT_DEPTH": "Left_(m)",
        "TOTAL_DEPTH": "Left_(m)",
        "AVG_ROP": "Right_(m/s)",
        "DW_HOOKLOADGAUGE": "Right_(kg)",
        "DrawworksHmi_Io_TopOfBlockPV": "Left_(m)"
      },
      chartPerformanceTag: {
        "powerConsumed": "Left_(kwh)",
        "fuelConsumed": "Left_(L)",
        "value": "Right_(kwh/L)"
      }
    }
    this.RigmoveApi = new RigmoveApi();
    this.PowerApi = new PowerApi();
    this.RigApi = new RigApi();
    this.AlarmApi = new AlarmApi();
    this._isMounted = false;
  }


  GetBiaxialCharts = (tags, isIOtag) => {

    let tagnames = this.SplitTags(tags);
    //is IOTag Direct Binding
    if (isIOtag == true) {
      const addPrefixProjname = v => v.split(',').map(s => `${this.state.project}_${s}`).join(',');
      tagnames = addPrefixProjname(this.SplitTags(tags));
      return (
        <BiaxialLineChart data={this.state.returnData} tagsWyaxisIds={this.state.chartNovTag} tags={tagnames} title="METER, M/S kg" />
      )
    }
    else {
      let per = [];
      if (this.state.fuelsData.length > 0) {
        per = this.state.fuelsData.map((item, i) => {
          //var fuel = this.state.fuelsData[i];
          var power = this.state.powerData[i];
          let t = {};
          if (power != undefined) {
            if (power.day === item.day) {

              t = Object.assign({}, power, item)
            } else {

              t = Object.assign({}, { "day": item.day, "powerConsumed": 0 }, item)
            }
          } else {
            t = Object.assign({}, { "day": item.day, "powerConsumed": 0 }, item)
          }


          return t
        });

      }

      if (this.state.efficiencyData.length > 0 && per.length > 0) {
        per = this.state.efficiencyData.map((item, i) => {
          var perItem = per[i];
          let t = {};
          if (item.day === perItem.day) {

            t = Object.assign({}, item, perItem)
          } else {

            t = Object.assign({}, { "day": perItem.day, "value": 0 }, perItem)
          }
          return t
        });
      }


      return (
        <BiaxialLineChart data={per} tagsWyaxisIds={this.state.chartPerformanceTag} tags={tagnames} />
      )
    }
  }



  GetFrequentAlarmTable = () => {

    const header = ["Most Frequent Alarm", "Count"]
    return (
      <Styletables data={this.state.alarmTable} title={header} ></Styletables>
    )
  }

  GetSystemSource = () => {

    const header = ["System Status", ""]
    let systemData = this.state.systemTable

    return (
      <Systemsource data={systemData} title={header}></Systemsource>
    )
  }

  GetTopAlarmFreq() {
    this.AlarmApi.GetTopAlarmFreq(((val) => {
      if (val === null) {
        return
      }
      if (this._isMounted === true) this.setState({ alarmTable: val });
    }))

  }

  GetBlackoutProbability = () => {
    this.RigmoveApi.GetBlackoutProbability(((val) => {
      if (val === null) {
        return
      }
      if (this._isMounted === true) this.setState({ blackOutRisk: val[0] });
    }))
  }

  GetCycleCountForDrilling = () => {

    var startDate = new Date()
    var endDate = new Date()
    
    startDate.setMinutes(startDate.getMinutes() - cycleCountMinutesRange)
    // console.log("startDate" + startDate)
    // console.log("endDate" + endDate)
    this.RigmoveApi.GetCycleCountForDrilling(startDate, endDate, ((val) => {
      if (val === null) {
        return
      }
      if (this._isMounted === true) this.setState({ cycleTagData: val.recordsets[1][0] });


    }))
  }

  GetSouceProviderHealth() {
    this.RigmoveApi.GetSouceProviderHealth(((val) => {
      if (val === null) {
        return
      }
      if (this._isMounted === true) this.setState({ systemTable: val });
    }))
  }

  GetChartNovData() {
    var startDate = new Date()
    var endDate = new Date()
    startDate.setMinutes(startDate.getMinutes() - chartNovMinutesRange)
    // console.log("GetChartNovData" + startDate)
    // console.log("GetChartNovData endDate" + endDate)
    const addPrefixProjname = v => v.split(',').map(s => `${this.state.project}_${s}`).join(',');
    let tagnames = addPrefixProjname(this.SplitTags(this.state.chartNovTag));
    this.RigmoveApi.GetTagTrend(tagnames, startDate, endDate, ((val) => {
      if (val === null) {
        return
      }
      if (this._isMounted === true) this.setState({ returnData: val });


    }))
  }

  GetPowerFuelEfficiency() {
    this.PowerApi.GetPowerFuelEfficiency(((val) => {
      if (val === null) {
        return
      }
      if (this._isMounted === true) this.setState({ efficiencyData: val });
    }))


  }
  GetMainDashboardFuelConsMonthlyHistory() {

    this.RigApi.GetFuelTrend(((val) => {
      if (val === null) {
        return
      }
      if (this._isMounted === true) this.setState({ fuelsData: val });
    }))
  }

  GetPowerConsumptionHistory() {
    this.PowerApi.GetPowerConsumptionHistory(((val) => {
      if (val === null) {
        return
      }
      if (this._isMounted === true) this.setState({ powerData: val });
    }))
  }

  GetDrillingDrawworksCurrentValue = () => {
    this.RigmoveApi.GetValue(this.state.projectname, 'AC_RC_OperatorView_DrillingDWs', (val, err) => {
      if (val === null) {
        return
      }
      else {
        if (this._isMounted === true) this.setState({ drawWorkReturnData: val });

      }
    })
  }

  componentWillUnmount() {
    this._mounted = false;
    clearInterval(this.timerID);
    clearInterval(this.IoTimerID);
    clearInterval(this.FuelsTimerID);
    clearInterval(this.PowersTimerID);
    clearInterval(this.EffTimerID);
  }
  componentDidMount() {
    this._isMounted = true;
    try {

      this.GetChartNovData()
      this.GetDrillingDrawworksCurrentValue()
      this.GetTopAlarmFreq()
      this.GetSouceProviderHealth()
      this.GetMainDashboardFuelConsMonthlyHistory()
      this.GetPowerConsumptionHistory()
      this.GetPowerFuelEfficiency()
      this.GetBlackoutProbability()
      this.GetCycleCountForDrilling()
      this.timerID = setInterval(async () => this.GetChartNovData(), setOperationNovInterval);
      this.IoTimerID = setInterval(async () => this.GetDrillingDrawworksCurrentValue(), setOperationRealTimeInterval);
      this.FuelsTimerID = setInterval(async () => this.GetMainDashboardFuelConsMonthlyHistory(), setOperationPerfInterval);
      this.PowersTimerID = setInterval(async () => this.GetPowerConsumptionHistory(), setOperationPerfInterval);
      this.EffTimerID = setInterval(async () => this.GetPowerFuelEfficiency(), setOperationPerfInterval);

    } catch (e) {
      console.log(e);
    }

  }

  SplitTags(data) {
    let str = '';
    let key;
    key = Object.keys(data)
    str = key.join(',');

    return str;
  }

  renderLG() {
    const { chartNovTag, drawWorkReturnData, chartPerformanceTag, blackOutRisk, cycleTagData } = this.state
    const { powerAvailable, DrillingEnginePower, DrillingTransformer } = cycleTagData

    let powerAvailableCaculated = Number(powerAvailable) - Number(DrillingTransformer);
    let hookload = drawWorkReturnData.DW_HookLoadGauge * 0.009807
    return (
      <Container fluid={true} >
        <Row >
          <Col className="col-md-8 col-xs-8 col-lg-8 col-lg-8 col-lx-8" >
            <Row className="subhdr-big" >NOV RigSense</Row>
            <Row style={{ height: "35vh" }}>{this.GetBiaxialCharts(chartNovTag, true)}</Row>
            <Row className="subhdr-big"> Performance</Row>
            <Row style={{ height: "35vh" }}>{this.GetBiaxialCharts(chartPerformanceTag, false)}</Row>
          </Col>
          <Col className="col-md-4 col-xs-4 col-lg-4 col-lg-4 col-lx-4"  >
            <Row style={{ height: "12vh", alignItems: "center" }}>
              <Col><LEDDisplay title="Bit Depth" value={parseInputwLeadzero4(drawWorkReturnData.BIT_DEPTH)} unit="m" width="100" font="big" /></Col>
              <Col><LEDDisplay title="Total Depth" value={parseInputwLeadzero4(drawWorkReturnData.TOTAL_DEPTH)} unit="m" width="100" font="big" /></Col>
              <Col><LEDDisplay title="Avg ROP" value={parseInputwLeadzero4(drawWorkReturnData.AVG_ROP)} unit="m/s" width="100" font="big" /></Col>
            </Row>
            <Row>
              <Col><LEDDisplay title="Hookload Gauge" value={parseInputwLeadzero4(hookload)} unit="kg" width="100" font="big" /></Col>
              <Col><LEDDisplay title="Top Of Block" value={parseInputwLeadzero4(drawWorkReturnData.DrawworksHmi_Io_TopOfBlockPV)} unit="m" width="100" font="big" /></Col>
              <Col></Col>
            </Row>
            <Row style={{ height: "25vh", margin: "auto" }}>
              {this.GetFrequentAlarmTable()}
            </Row>
            <Row style={{ verticalAlign: "center" }}>
              <Col xs={3} >
                <LEDDisplay title="Blackout Risk" value={parseInputwLeadzero4(blackOutRisk.result)} unit="%" width="100" font="big" />
                <LEDDisplay title="Drilling Power Usage" value={parseInputwLeadzero4(cycleTagData.DrillingEnginePower)} unit="kw" width="100" font="big" />
                <LEDDisplay title="Spinning Reserve" value={parseInputwLeadzero4(powerAvailableCaculated)} unit="kw" width="100" font="big" />
              </Col>
              <Col>
                {this.GetSystemSource()}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
  renderMD() {
    const { chartNovTag, drawWorkReturnData, chartPerformanceTag, blackOutRisk, cycleTagData } = this.state
    const { powerAvailable, DrillingEnginePower, DrillingTransformer } = cycleTagData
  
    let powerAvailableCaculated = Number(powerAvailable) - Number(DrillingTransformer);
    let hookload = drawWorkReturnData.DW_HookLoadGauge * 0.009807
    return (
      <Container fluid={true} >
        <Row style={{ height: "12vh", alignItems: "center" }}>
          <Col><LEDDisplay title="Bit Depth" value={parseInputwLeadzero4(drawWorkReturnData.BIT_DEPTH)} unit="m" width="100" font="big" /></Col>
          <Col><LEDDisplay title="Total Depth" value={parseInputwLeadzero4(drawWorkReturnData.TOTAL_DEPTH)} unit="m" width="100" font="big" /></Col>
          <Col><LEDDisplay title="Avg ROP" value={parseInputwLeadzero4(drawWorkReturnData.AVG_ROP)} unit="m/s" width="100" font="big" /></Col>
        </Row>
        <Row>
              <Col><LEDDisplay title="Hookload Gauge" value={parseInputwLeadzero4(hookload)} unit="kg" width="100" font="big" /></Col>
              <Col><LEDDisplay title="Top Of Block" value={parseInputwLeadzero4(drawWorkReturnData.DrawworksHmi_Io_TopOfBlockPV)} unit="m" width="100" font="big" /></Col>
              <Col></Col>
            </Row>
        <Row >
          <Col>
            <Row className="subhdr-big" >NOV RigSense</Row>
            <Row style={{ height: "35vh" }}>{this.GetBiaxialCharts(chartNovTag, true)}</Row>
          </Col>

        </Row>
        <Row >
          <Col >
            <Row className="subhdr-big"> Performance</Row>
            <Row style={{ height: "35vh" }}>{this.GetBiaxialCharts(chartPerformanceTag, false)}</Row>
          </Col>

        </Row>
        <Row>
          <Col>

           
            <Row style={{ height: "25vh", margin: "auto" }}>
              {this.GetFrequentAlarmTable()}
            </Row>
            <Row style={{ verticalAlign: "center" }}>
              <Col xs={3} >
                <LEDDisplay title="Blackout Risk" value={parseInputwLeadzero4(blackOutRisk.result)} unit="%" width="100" font="big" />
                <LEDDisplay title="Drilling Power Usage" value={parseInputwLeadzero4(cycleTagData.DrillingEnginePower)} unit="kw" width="100" font="big" />
                <LEDDisplay title="Spinning Reserve" value={parseInputwLeadzero4(powerAvailableCaculated)} unit="kw" width="100" font="big" />
              </Col>
              <Col>
                {this.GetSystemSource()}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
  render() {
    var contents = this.renderLG()
    if (this.props.renderFor === 1 || this.props.renderFor === 2) {
      contents = this.renderMD()
    }
    return (
      <DashboardCardWithHeader title="Operation Data Insight">
        {contents}
      </DashboardCardWithHeader>
    )
  }
}
export default withLayoutManager(Insight);