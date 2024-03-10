import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import { DateTimePicker } from "@material-ui/pickers";
import Button from '@material-ui/core/Button';
import '../../css/App.css';
import '../../css/Dashboard.css';
import RigmoveApi from '../../model/Rigmove.js'
import MyLineChart from '../LineChart_RigMove/LineChart';
// tagnames : csv string
// title : String
class TrendChart extends React.Component {
    constructor(props, context) {
        super(props, context);
        var startDate = new Date()
        var endDate = new Date()
        startDate.setMinutes(startDate.getMinutes()-30)
        // startDate.setDate(startDate.getDate()-1)
        this.state = { 
            organization : "-",
            project : localStorage.getItem("project") || "B357",
            renderFor : 0, // 0 for desktop, 1 for ipad, 2 for mobile 
            modalStartDate : startDate,
            modalEndDate : endDate,
            xOrientation: (props.xOrientation) ? props.xOrientation : 'bottom',
            yOrientation: (props.yOrientation) ? props.yOrientation : 'left',
            startDate:startDate,
            endDate: endDate,
            data:[],
            modalData:[]
        };
        this.RigmoveApi = new RigmoveApi();
        this._isMounted =false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.updateChart()
        this.timerID = setInterval(async () => this.updateChart(), 30000);
    
    }

    updateChart(){
        var tag = this.props.tagnames;
         const {startDate, endDate} = this.state;
        // var startDate = new Date()
        // var endDate = new Date()
        // startDate.setMinutes(startDate.getMinutes()-30)
        this.RigmoveApi.GetTagTrend( this.props.tagnames, startDate, endDate, ((val) =>{
            if (val === null) {
                return
            }
            
            if(this._isMounted==true){this.setState({data : val}) }
        }))
    }

    componentWillUnmount(){
        this._isMounted = false;
        clearInterval(this.timerID);
    }

    onClick(dataSet,title) {
        
         this.setState({modalShow : true, modalData : dataSet, modalTitle : title})
    }
    reloadModalData() {
        // get difference in s tartdate
        const startDate = this.state.modalStartDate
        const endDate = this.state.modalEndDate
        const tagnames = this.props.tagnames
        const timeDiff = endDate.getTime() - startDate.getTime()
        var dayDiff = timeDiff / (1000 * 60 * 60 * 24)
        var hourDiff = timeDiff / (1000 * 60 * 60 )
        var minDiff = timeDiff / (1000 * 60 )
        var interval = 3
        if (dayDiff < 7) {
            if (hourDiff > 2.5) {
                interval = 4
            } else if (minDiff > 2.5) {
                interval = 5
            }
        } else {
            interval = 2
        }
        interval =2
        var tagnamesArr = tagnames.split(",")
        this.RigmoveApi.GetTagTrend(
            tagnames,startDate, endDate, 
            ((val) =>{
                var chartData = []
                val.forEach((dat) => {
                    var newDat = { xval : dat.timestamp}
                    tagnamesArr.forEach((name) => {
                        newDat[name] = dat[name]
                    })
                    chartData.push(newDat)
                })
                this.setState({modalData : chartData})
        }),interval)
    }
    handleDateChange(date, forComponent) {
        if (forComponent === 0) {
            this.setState({modalStartDate : date})
        } else if (forComponent === 1) {
            this.setState({modalEndDate : date})
        } 
    }
    renderModal() {
        if (this.state.modalShow === undefined || this.state.modalShow === false){
            return (<></>)
        }
        var title = this.state.modalTitle
        var data = this.state.modalData

        if(data.length === 0){
            return (<></>)
        }

        var dataMin = undefined
        var dataMax = undefined
        data.forEach((dat) => {
            let dataPresent = Object.keys(dat)
            
            dataPresent.forEach((key) => {
                if (key === "xval") {
                    return
                }
                let yval1 = parseFloat(parseFloat(dat[key]).toFixed(2))
                if (dataMin === undefined || dataMin > yval1) {
                    dataMin = yval1
                } 
                if (dataMax === undefined || dataMax < yval1 ) {
                    dataMax = yval1
                   // console.log("dataMax" + dataMax + "yval1" + yval1 + "dat[key] " + dat[key] )
                } 
            })
        })
        var startDate = this.state.modalStartDate
        var endDate = this.state.modalEndDate
        return (
            <Modal 
            size={"lg"} 
            aria-labelledby="contained-modal-title-vcenter"
            centered 
            show={this.state.modalShow} 
            onHide={() => {this.setState({modalShow : false})}}>
                <Modal.Header closeButton>
                    <Modal.Title style={{textAlign : "center"}}>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row style={{marginBottom : "15px", height : "50vh"}}>
                        <Col>
                            <MyLineChart data={data} title = {title} onClick={(data,title) => {}} dataMax={dataMax} dataMin={dataMin}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Row>
                                <Col>
                                    <DateTimePicker
                                        label="Start Date"
                                        inputVariant="outlined"
                                        value={startDate}
                                        maxDate={endDate}
                                        onChange={(date) => {this.handleDateChange(date,0)}}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <DateTimePicker
                                        label="End Date"
                                        inputVariant="outlined"
                                        value={endDate}
                                        maxDate={new Date()}
                                        minDate={startDate}
                                        onChange={(date) => {this.handleDateChange(date,1)}}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Button variant="contained" color="primary" onClick={()=>{this.reloadModalData()}}>
                                Reload Data
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        )
    }
    
    render() {
        var data = this.state.data
        var chartData = []
        var title = this.props.title ? this.props.title : ""
        var showLegend = this.props.showLegend ? this.props.showLegend : true;
        if (data === undefined || data === null || this.props.tagnames === undefined) {
            return (<></>)
        } else if (data.length === 0) {
            return (
                <div style= {{height : "100%", width : "100%", display: "flex", textAlign : "center", alignItems : "center", backgroundColor : "#0c4458", borderRadius : "15px"}}>
                    <div style={{margin : "auto"}}>No Data Present</div>
                </div>
            )
        } else {
            let tagnames = this.props.tagnames.split(",")
            var dataMin = undefined
            var dataMax = undefined
            data.forEach((dat) => {
                //var newDat = { xval : new Date(dat.timestamp + "z").toLocaleString()}
                var newDat = { xval : dat.timestamp}
                let dataPresent = Object.keys(dat)
                dataPresent.forEach((key) => {
                    if (key === "timestamp") {
                        return
                    }
                    let yval1 = parseFloat(parseFloat(dat[key]).toFixed(2))
                    if (dataMin === undefined || dataMin > yval1) {
                        dataMin = yval1
                    } 
                    if (dataMax === undefined || dataMax < yval1 ) {
                        dataMax = yval1
                    } 
                })
                tagnames.forEach((name) => {
                    
                    let val = dat[name]
                    name = name.replace(`${this.state.project}_`, '');
                    newDat[name] = val
                  
                })
                chartData.push(newDat)
            })

            // console.log("chartData" + JSON.stringify(chartData))


            return(
                <>
                {this.renderModal()}
                <MyLineChart data={chartData} title = {title} onClick={(data,title) => {
                    this.onClick(data,title)
                }} dataMax={dataMax} dataMin={dataMin} showLegend={this.props.showLegend} xOrientation={this.state.xOrientation} yOrientation={this.state.yOrientation}  />
                </>
            )
        }
    }
}
export default TrendChart;
