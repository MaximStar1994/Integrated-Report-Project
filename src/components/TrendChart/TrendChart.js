import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import { DateTimePicker } from "@material-ui/pickers";
import Button from '@material-ui/core/Button';
import '../../css/App.css';
import '../../css/Dashboard.css';
import Tag from '../../model/Tag.js'
import MyLineChart from '../LineChart/LineChart';
import moment from 'moment';
// tagnames : csv string
// title : String
class TrendChart extends React.Component {
    constructor(props, context) {
        super(props, context);
        var startDate = new Date()
        var endDate = new Date()
        startDate.setDate(startDate.getDate()-1);
        // startDate.setDate(startDate.getDate()-1)
        this.state = { 
            organization : "-",
            project : "-",
            renderFor : 0, // 0 for desktop, 1 for ipad, 2 for mobile 
            modalStartDate : startDate,
            modalEndDate : endDate,
        };
        this.tagController = new Tag()
        this.interval = undefined
    }

    updateData() {
        var startDate = new Date()
        var endDate = new Date()
        startDate.setDate(startDate.getDate()-1);
        this.tagController.GetTagTrend( this.props.tagnames, startDate, endDate, ((val) =>{
            if (val === null) {
                return
            }
            this.setState({data : val})
        }))
    }
    componentDidMount() {
        this.updateData()
        this.interval = setInterval(() => {
            this.updateData()
        }, 10000);
    }
    componentWillUnmount() {
        if (this.interval !== undefined) {
            clearInterval(this.interval)
        }
    }
    onClick(dataSet,title) {
        this.setState({modalShow : true, modalData : dataSet, modalTitle : title})
    }
    parseChartData(rawData) {
        var tagnamesArr = this.props.tagnames.split(",")
        var dataMin = undefined
        var dataMax = undefined
        var chartData = []
        rawData.forEach((dat) => {
            // var newDat = { xval : new Date(dat.timestamp + "z").toLocaleString()}
            var momentObj = moment(new Date(dat.timestamp + "z"))
            var momentTimeObj = moment(new Date(dat.timestamp + "z"))
            var newDat = { xval : momentObj.format("yyyy-MM-DD") + " " + momentTimeObj.format("HH:mm:ss")}
            let dataPresent = Object.keys(dat)
            dataPresent.forEach((key) => {
                if (key === "timestamp") {
                    return
                }
                let yval1 = parseFloat(parseFloat(dat[key]).toFixed(2))
                let numyval = parseFloat(dat[key])
                if (dataMin === undefined || dataMin > yval1) {
                    if (numyval < 0) {
                        if (numyval > -1) {
                            if (numyval > -0.9) {
                                dataMin = parseFloat((yval1 - 0.01).toFixed(2))
                            } else {
                                dataMin = parseFloat((yval1 - 0.1).toFixed(2))
                            }
                        } else {
                            dataMin = yval1 - parseFloat((yval1 - 1).toFixed(2))
                        }
                    } else {
                        if (numyval > 1) {
                            dataMin = yval1 - 1
                        } else {
                            dataMin = parseFloat((yval1 - 0.1).toFixed(2))
                        }
                    }
                } 
                if (dataMax === undefined || dataMax < yval1 ) {
                    if (numyval < 1) {
                        dataMax = parseFloat((yval1 + 0.1).toFixed(2))
                    } else {
                        dataMax = parseFloat((yval1 + 1).toFixed(2))
                    }
                } 
            })
            tagnamesArr.forEach((name) => {
                var legendName = name
                if (name.startsWith("B357_") || name.startsWith("B356_")) {
                    legendName = name.slice(5)
                }
                newDat[legendName] = dat[name]
            })
            chartData.push(newDat)
        })
        return [chartData,dataMin,dataMax]
    }
    reloadModalData() {
        // get difference in startdate
        const startDate = this.state.modalStartDate
        const endDate = this.state.modalEndDate
        const tagnames = this.props.tagnames
        const tagnamesArr = tagnames.split(",")
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
        this.tagController.GetTagTrend(
            tagnames,startDate, endDate, 
            ((val) => {
                var data = [];
                if (val instanceof Array) {
                    val.forEach((dat) => {
                        var newDat = { xval : new Date(dat.timestamp + "z")}
                        tagnamesArr.forEach((name) => {
                            newDat[name] = dat[name]
                        })
                        data.push(newDat)
                    })
                }
                var dataArr = this.parseChartData(data)
                this.setState({modalData : dataArr[0], dataMax : dataArr[1], dataMin : dataArr[2]})
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
        var dataMin = this.state.dataMin
        var dataMax = this.state.dataMax
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
        var title = this.props.title ? this.props.title : ""
        if (data === undefined || data === null || this.props.tagnames === undefined) {
            return (<></>)
        } else if (data.length === 0) {
            return (
                <div onClick={(data,title) => {
                    this.onClick(data,title)
                }}
                style= {{height : "100%", width : "100%", display: "flex", textAlign : "center", alignItems : "center", backgroundColor : "#0c4458", borderRadius : "15px"}}>
                    {this.renderModal()}
                    <div style={{margin : "auto"}}>No Data Present</div>
                </div>
            )
        } else {
            let tagnames = this.props.tagnames.split(",")
            var dataMin = undefined
            var dataMax = undefined
            var chartData = []
            data.forEach((dat) => {
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
                    newDat[name] = dat[name]
                })
                chartData.push(newDat)
            })

            var dataArr = this.parseChartData(data)
            return(
                <>
                {this.renderModal()}
                <MyLineChart data={dataArr[0]} title = {title} onClick={(data,title) => {
                    this.onClick(data,title)
                }} dataMax={dataArr[2]} dataMin={dataArr[1]}/>
                </>
            )
        }
    }
}
export default TrendChart;
