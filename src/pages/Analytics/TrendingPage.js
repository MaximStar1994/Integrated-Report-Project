import React from 'react';
// import Container from 'react-bootstrap/Container'
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
// import Button from 'react-bootstrap/Button'
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import Tag from '../../model/Tag'
import TagTable from './TagTable'
import cancelIcon from '../../assets/Icon/cancelIcon.png'
import { DatePicker } from "@material-ui/pickers";
import MyLineChart from '../../components/LineChart/LineChart';
import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner'
import Search from '../../components/Search/Search'
import '../../css/App.css';
import './TrendingPage.css'
import { withAuthManager } from '../../Helper/Auth/auth';
import { Select, MenuItem } from '@material-ui/core';

import Checkbox from '@material-ui/core/Checkbox';
import config from '../../config/config';

class TrendingPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            renderFor : 0, // 0 for desktop, 1 for ipad, 2 for mobile 
            allTags : [],
            originalUnselectedTags : [],
            unselectedTags : [],
            chosenTags : [],
            tagData : [],
            startDate : new Date(new Date().getTime() - 24*60*60*1000),
            endDate : new Date(),
            data : [],
            showSpinner : false,
            selectedVessel: null,
            trend: [],
            trendBy: 'ALL'
        };
        this.tagApi = new Tag()
    }

    updateSize = () => {
        var width = window.innerWidth
        if (window.orientation === 90) {
            if (navigator.userAgent.match(/Android/) === null) {
                // android's innerheight has issues
                width = window.innerHeight
            }
        }
        if (width >= 1200) {
            this.setState({ renderFor : 0})
        } else if (width >= 768) {
            this.setState({ renderFor : 1})
        } else {
            this.setState({ renderFor : 2})
        }
    }
    componentDidMount() {
        this.updateSize()
        // let vesselId = this.state.selectedVessel?.vessel_id;
        // this.tagApi.GetTrendingTags((vesselId, tags) => {
        //     var justTags = []
        //     Object.keys(tags).map(function(key, index) {
        //         tags[key].forEach((tag) => {
        //             tag.name = tag.tag
        //             tag.group = key
        //             justTags.push(tag)
        //         })
        //     })
        //     this.setState({allTags : tags, unselectedTags : tags, originalUnselectedTags : justTags})
        // })
        window.addEventListener('resize', this.updateSize);
        window.addEventListener("orientationchange", this.updateSize);
    }
    getTagsOnVesselSelection = () => {
        let vesselId = this.state.selectedVessel.vessel_id;
        var removeTags = []
        this.tagApi.GetTrendingTags(vesselId, tags => {
            var justTags = []
            Object.keys(tags).map(function(key, index) {
                tags[key].forEach((tag) => {
                    tag.name = tag.tag
                    tag.group = key
                    justTags.push(tag)
                })
            })
            this.setState({allTags : tags, unselectedTags : tags, originalUnselectedTags : justTags, chosenTags: removeTags})
            this.reloadModalData()
            this.renderChart()
            
        })
    }
    componentWillUnmount() {
        clearInterval(this.interval)
        window.removeEventListener('resize', this.updateSize);
        window.removeEventListener('orientationchange', this.updateSize);
    }
    choseTagForTrending(tag) {
        var chosenTags = this.state.chosenTags
        var unselectedTags = this.state.unselectedTags
        var originalUnselectedTags = this.state.originalUnselectedTags
        if(this.state.chosenTags.length < 16)
        {
            chosenTags.push(tag)
        }
        else
        {
            console.log('Maximum number of tags to trend has been reached')
        }
        
        let tagPos = unselectedTags[tag.group].findIndex((item) => {
            return item.tag == tag.name
        })
        if (tagPos != -1) {
            unselectedTags[tag.group].splice(tagPos,1)
        }
        let tagPos2 = originalUnselectedTags.findIndex((item) => {
            return item.tag == tag.name
        })
        if (tagPos2 != -1) {
            originalUnselectedTags.splice(tagPos2,1)
        }
        this.setState({unselectedTags : unselectedTags, originalUnselectedTags : originalUnselectedTags, chosenTags : chosenTags})
    }
    unchoseTag(tag) {
        var chosenTags = this.state.chosenTags
        var unselectedTags = this.state.unselectedTags
        unselectedTags[tag.group].push(tag)
        let tagPos = chosenTags.findIndex((item) => {
            return item.name == tag.name
        })
        if (tagPos != -1) {
            chosenTags.splice(tagPos,1)
        }
        this.setState({unselectedTags : unselectedTags, chosenTags : chosenTags})
    }
    reloadModalData() {
        const startDate = this.state.startDate
        const endDate = this.state.endDate
        var tagnames = ""
        var tagIdentifier = ""
        this.state.chosenTags.forEach((tag) => {
            tagnames += tag.name + ','
            tagIdentifier += tag.tagIdentifier + ','
        })
        tagnames = tagnames.slice(0, -1)
        tagIdentifier = tagIdentifier.slice(0, -1)
        const timeDiff = endDate.getTime() - startDate.getTime()
        var dayDiff = timeDiff / (1000 * 60 * 60 * 24)
        var hourDiff = timeDiff / (1000 * 60 * 60 )
        var minDiff = timeDiff / (1000 * 60 )
        // per hour
        var interval = 3
        if (dayDiff < 7) {
            if (minDiff < 2.5) {
                // per sec
                interval = 5
            } else if (hourDiff < 5) {
                // per min
                interval = 4
            }
        } else {
            // per day
            interval = 2
        }
        
        var tagnamesArr = this.state.chosenTags
      
        this.setState({showSpinner : true})
       
       
        if(this.state.selectedVessel!==null&&this.state.selectedVessel!==undefined&&this.state.selectedVessel!=='null')
        {
            let vesselId = this.state.selectedVessel.vessel_id;
            this.tagApi.GetTagTrend(
                vesselId, tagIdentifier,tagnames,startDate, endDate, 
                ((val,err) =>{
                  
                    if (val === null) {
                        this.setState({data : [], showSpinner : false})
                        return
                    }
                    var chartData = []
                    val.forEach((dat) => {
                        if (dat !== null && dat.timestamp!== undefined ) {
                            //var newDat = { xval : new Date(dat.timestamp ).toLocaleString()}
                            var newDat = { xval : dat.timestamp}
                            tagnamesArr.forEach((tag) => {
                                if(dat[tag.name]!== undefined)
                                {
                                    newDat[tag.name] = dat[tag.name]
                                }
                                /*else
                                {
                                    newDat[tag.name] = 0
                                }*/
                            
                        })
                        chartData.push(newDat)
                     }
                    })
                    this.setState({data : chartData, showSpinner : false})
            }),interval)
        }
        
    }

    handleDateChange(date, forComponent) {
        if (forComponent === 0) {
            this.setState({startDate : date})
        } else if (forComponent === 1) {
            this.setState({endDate : date})
        } 
    }

    renderChart() {
        var completeData = this.state.data

        var trendBy_ampm = this.state.trendBy
        let data
        if(trendBy_ampm !== 'ALL')
        {
            data = completeData.filter(el => el.xval.slice(-2) === trendBy_ampm)
        }
        else
        {
            data = completeData
        }
      
        var title =""
        // if (data === undefined || data === null ) {
        //     return (<></>)
        // } else 
        if (data.length === 0) {
            return (
                <div style= {{ minHeight : "50vh", width : "100%", display: "flex", textAlign : "center", alignItems : "center", backgroundColor : "white", color:'#04588e', borderRadius : "15px", marginTop: '10px'}}>
                    <div style={{margin : "auto"}}>No Data Present</div>
                </div>
            )
        } else {
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
                    } 
                })
            })
            return(
                <Row style={{marginBottom : "15px", height : "60vh", marginTop: '10px'}}>
                    <Col style={{backgroundColor : "white", padding : "10px", borderRadius : "15px"}}>
                        <MyLineChart data={data} title = {title} 
                        onClick={(data,title) => {}} dataMax={dataMax} dataMin={dataMin}/>
                    </Col>
                </Row>
            )
        }
    }

    changeTrendBy_AM_PM = (key, value) => {
        this.setState({trendBy : key})
    }
    render() {
        return (
            <Container fluid={true} style={{ backgroundColor: '#e6e6e6', minHeight: '90vh' }}>
                <div>
                    <div className='trendingPageHeaderBase'>
                        <div  className="trendingPageHeaderBackground">
                            <div className="trendingPageHeading">
                                    Trending Module
                            </div>
                        </div>
                    </div>
                    <Row style={{marginTop : "10px"}}>
                        <Col xs={3}>
                            <Row>
                                <Col xs={8}>
                                    {this.props.user.isAuthenticated===true&&
                                        <Select
                                            type={'selection'} 
                                            id={'selectedVessel'}
                                            value={this.state.selectedVessel===null?'':this.state.selectedVessel}
                                            onChange={e=>this.setState({ selectedVessel: e.target.value })}
                                            name={`selectedVessel`} 
                                            style={{ padding: '5px', width: '100%', backgroundColor: 'white', color: '#04588e', marginBottom: '10px', borderRadius: "20px" }}
                                            disableUnderline
                                        >
                                            {this.props.user.vesselList.slice(1).map(element => <MenuItem value={element} key={element.vessel_id}> {element.name}</MenuItem>)}
                                        </Select>
                                    }
                                </Col>
                                <Col xs={4}>
                                    <Button style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', color: '#fff' }} onClick={this.getTagsOnVesselSelection}>Get Tags</Button>
                                </Col>
                            
                            </Row>
                            {(this.state.selectedVessel!==null&&this.state.selectedVessel!==undefined&&this.state.selectedVessel!=='null' 
                                &&this.state.originalUnselectedTags.length>0)&&
                                <React.Fragment>
                                    <Row>
                                        <Col style={{display : "flex"}}>
                                            <Search 
                                            // style={{marginLeft : "auto", paddingRight : "10px", width : "80%"}} 
                                            style={{ padding: '5px', width: '100%', backgroundColor: 'white', marginBottom: '10px', borderRadius: "20px" }}
                                            list={this.state.originalUnselectedTags}
                                            searchOn = {['name']}
                                            minLength = {3}
                                            placeholder = "Type minimum 3 letters to filter tags ..."
                                            searchDidEnd={(tags)=>{
                                                var unselected = {
                                                    Engine : [],
                                                    ROB : [],
                                                    'Tank Soundings' : [],
                                                    'Air Conditioning' : [],
                                                    'Azimuth thruster' : []
                                                }
                                                for(var i in tags) {
                                                    if (unselected[tags[i].group] === undefined) {
                                                        unselected[tags[i].group] = []
                                                    }
                                                    unselected[tags[i].group].push(tags[i])
                                                }
                                                if (this.state.unselectedTags.Engine.length === unselected.Engine.length &&
                                                    this.state.unselectedTags.ROB.length === unselected.ROB.length &&
                                                    this.state.unselectedTags['Tank Soundings'].length === unselected['Tank Soundings'].length &&
                                                    this.state.unselectedTags['Air Conditioning'].length === unselected['Air Conditioning'].length&&
                                                    this.state.unselectedTags['Azimuth thruster'].length === unselected['Azimuth thruster'].length) {
                                                        return
                                                }
                                                this.setState({unselectedTags : unselected})
                                            }}/>
                                        </Col>
                                    </Row>
                                
                                    <Row>
                                        <Col>
                                            <TagTable 
                                            tags={this.state.unselectedTags}
                                            onSelectTag={(tag) => {this.choseTagForTrending(tag)}}
                                            noofChosedTags={this.state.chosenTags.length}
                                            />
                                        </Col>
                                    </Row>
                                
                                    <Row style={{marginTop : "20px"}}>
                                        <Col style={{color : "#04588e"}}>
                                        {this.state.chosenTags.length>0 &&
                                            <Row style={{ marginBottom: '10px', fontWeight: '900' }}>
                                                <Col>
                                                    Selected Tags :
                                                </Col>
                                            </Row>
                                        }
                                            {this.state.chosenTags.map((item,i) => {
                                                return(
                                                    <Row key={i}>
                                                        <Col style={{ fontSize: '0.8rem' }}>
                                                            -> {item.name} <img className="clickable" onClick={() => {this.unchoseTag(item)}} src={cancelIcon} style={{width : "20px", height : "20px"}} />
                                                        </Col>
                                                    </Row>
                                                )
                                            })}
                                        </Col>
                                    </Row>
                                </React.Fragment>
                            }
                        </Col>
                        <Col xs={9}>
                            
                            <Row style={{marginTop:"25px"}}>
                                <Col>
                                    <Row>
                                        <Col>
                                            <DatePicker
                                                className ="whiteLabel"
                                                label="Start Date"
                                                inputVariant="outlined"
                                                value={this.state.startDate}
                                                maxDate={this.state.endDate}
                                                onChange={(date) => {this.handleDateChange(date,0)}}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            <DatePicker
                                                label="End Date"
                                                className ="whiteLabel"
                                                inputVariant="outlined"
                                                value={this.state.endDate}
                                                maxDate={new Date()}
                                                minDate={this.state.startDate}
                                                onChange={(date) => {this.handleDateChange(date,1)}}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                        <div style={{ width: '100%', height: '100%', position: 'relative', border: '1px solid #04588e', borderRadius: '5px' }}>
                                            <div style={{ position: 'absolute', top: '-10px', left: '10px', color: '#04588e', fontSize: '0.8rem', fontWeight: '100', backgroundColor: '#e6e6e6' }}>Trend By</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-evenly', height: '100%' }}>
                                                <div  className ="whiteLabel" style={{ color: '#04588e', fontWeight: '15', marginBottom: '5px', display: 'flex', alignItems: 'center' }} >
                                                    AM <Form.Check
                                                        type='radio' 
                                                        style={{ color: config.KSTColors.MAIN, fontWeight: '15', marginLeft: '10px' }}  
                                                        id={'AM'} 
                                                        aria-describedby={'AM'} 
                                                        checked={this.state.trendBy==='AM'}
                                                        onClick={()=>this.changeTrendBy_AM_PM('AM', 'AM')}
                                                        name={'AM'}
                                                        inline
                                                        />
                                                </div>
                                                <div  className ="whiteLabel" style={{ color: '#04588e', fontWeight: '15', marginBottom: '5px', display: 'flex', alignItems: 'center' }} >
                                                    PM <Form.Check
                                                        type='radio' 
                                                        style={{ color: config.KSTColors.MAIN, fontWeight: '15', marginLeft: '10px' }}  
                                                        id={'PM'} 
                                                        aria-describedby={'PM'} 
                                                        checked={this.state.trendBy==='PM'}
                                                        onClick={()=>this.changeTrendBy_AM_PM('PM', 'PM')}
                                                        name={'PM'}
                                                        inline 
                                                    />
                                                </div>
                                                <div  className ="whiteLabel" style={{ color: '#04588e', fontWeight: '15',  marginBottom: '5px', display: 'flex', alignItems: 'center' }} >
                                                    ALL <Form.Check
                                                        type='radio' 
                                                        style={{ color: config.KSTColors.MAIN, fontWeight: '15', marginLeft: '10px' }}  
                                                        id={'ALL'} 
                                                        aria-describedby={'ALL'} 
                                                        checked={this.state.trendBy==='ALL'}
                                                        onClick={()=>this.changeTrendBy_AM_PM('ALL', 'ALL')}
                                                        name={'ALL'} 
                                                        
                                                        inline
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                </Col>
                                <Col>
                                    <div style={{height : "100%", display : "flex", alignItems : "center"}} >
                                        <Button onClick={()=>{this.reloadModalData()}} style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px' }}>
                                        <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Generate Trend</span>
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                            {this.renderChart()}
                        </Col>
                    </Row>
                </div>
            </Container>
        )
    }
}

export default withAuthManager(TrendingPage);