import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Areas from './Areas'
import ScrollingItem from '../../../components/HorizontalScrollingMenu/Home'
import vessel3D from '../../../assets/fuelngLayout/LBVgrey.png'
import Group541 from '../../../assets/fuelngLayout/area.jpg'
import Intersection from '../../../assets/fuelngLayout/ship.jpg'
import mapIcon from '../../../assets/Icon/mapIcon.png'
import profile from '../../../assets/Icon/profile.png'
import GreenCircle from '../../../assets/Icon/GreenCircle.png'
import { withLayoutManager } from '../../../Helper/Layout/layout'
import './Areas.css'
import socketIOClient from "socket.io-client";
import HumanFactorApi from '../../../model/HumanFactor.js';
import Boundingbox from 'react-bounding-box'
import DrawLine from './DrawLine'
import IconMetroYellow from '../../../assets/Icon/IconMetroYellow.png'
import bell from '../../../assets/Icon/bell.png'
import heartbeats from '../../../assets/Icon/heartbeats.png'
import CrewList from './ListCrew.js'
require('dotenv').config()

class GeoFencing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [
                { id: "item1", content: 1, log: "xx", name: "John Doe", title: "Engineer", heartRate: '80', batteryLife: '0' },
                { id: "item2", content: 1, log: "xx", name: "John Doe", title: "Engineer", heartRate: '80', batteryLife: '0' },
                { id: "item3", content: 1, log: "xx", name: "John Doe", title: "Engineer", heartRate: '80', batteryLife: '0' },
                { id: "item4", content: 1, log: "xx", name: "John Doe", title: "Engineer", heartRate: '80', batteryLife: '0' },
                { id: "item5", content: 1, log: "xx", name: "John Doe", title: "Engineer", heartRate: '80', batteryLife: '0' },
                { id: "item6", content: 1, log: "xx", name: "John Doe", title: "Engineer", heartRate: '80', batteryLife: '0' },
                { id: "item7", content: 1, log: "xx", name: "John Doe", title: "Engineer", heartRate: '80', batteryLife: '0' },
                { id: "item8", content: 1, log: "xx", name: "John Doe", title: "Engineer", heartRate: '80', batteryLife: '0' }
            ],
            AreaList: [
                { key: 0, title: 'NON-HAZARDOUS AREA', IconUrl: bell, Number: 0 },
                { key: 1, title: 'NUMBER IN HAZARDOUS AREA', IconUrl: IconMetroYellow, Number: 0 },
                { key: 2, title: 'HEART RATE ABOVE 110 BPM', IconUrl: heartbeats, Number: 0 }
            ],
            Areas: [
                { title: 'NON-HAZARDOUS AREA', Ids: [1] },
                { title: 'HAZARDOUS AREA', Ids: [2] }
            ],
            SOS: 0,
            location: 'roomA',
            timestamp: '',
            heartRate: 80,
            battery: 0
        }

        this.HumanFactorApi = new HumanFactorApi();
    }

    updateBPM() {
        const nlist = this.state.list;
        const min = 1;
        const max = 100;
        const rand = min + Math.random() * (max - min);

        this.HumanFactorApi.GetBPM(((val) => {
            if (val === null) {
                return
            }
            nlist[0].bpm = parseInt(val + rand);
            this.setState({ list: nlist });
        }))
    }

    updateheartrate(data) {
        // console.log("heart" + data.battery)
        this.setState({ heartRate: data.heartrate, battery: data.battery });
        var heartrate = this.state.heartRate;
        var battery = this.state.battery;
        const nlist = this.state.list;
        nlist[0].bpm = heartrate;
        nlist[0].battery = battery;
        this.setState({ list: nlist });
    }


    GetCrewList() {
        let Areas = this.state.Areas
        this.HumanFactorApi.GetCrew(((val) => {
            if (val === null) {
                return
            }
            let nonhazaCount = 0
            let hazaCount = 0
            let hr110Count = 0
            const newList = val.map((list) => {

                if (Areas[0].Ids.indexOf(list.areaId) > -1) nonhazaCount++;
                if (Areas[1].Ids.indexOf(list.areaId) > -1) hazaCount++;
                if (list.heartRate > 110) hr110Count++;

                return { ...list, content: 1, picture: profile };
            });

            let areaslist = [...this.state.AreaList];
            let area = { ...areaslist[0] };
            area.Number = nonhazaCount;
            let hazaArea = { ...areaslist[1] };
            hazaArea.Number = hazaCount;
            let hrs = { ...areaslist[2] };
            hrs.Number = hr110Count;

            areaslist[0] = area;
            areaslist[1] = hazaArea;
            areaslist[2] = hrs;
            this.setState({ AreaList: areaslist });
            this.setState({ list: newList });
        }))
    }


    componentDidMount() {

        this.GetCrewList()
        this.timerID = setInterval(async () => this.GetCrewList(), 3000);

    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    renderLG() {
        const list = this.state.list
        const location = [];
        const greenLocation = [];
        var count = 0;
        list.map(el => {
            if (el.locationId != null) {
                location.push(<div key={count} style={{ width: "8%", height: "10%", top: el.xOffset + '%', right: el.yOffset + '%', position: "absolute" }}>
                    <img className="under" src={mapIcon} />
                    <img className="over" src={profile} />
                </div>)
                greenLocation.push(<div key={count} style={{ width: "10%", height: "10%", top: el.xOffset + '%', right: el.yOffset + '%', position: "absolute" }}>
                    <img src={GreenCircle} />
                </div>)
                count++;
            }

        });
        const params = {
            image: Intersection,
            boxes: [
                // coord(0,0) = top left corner of image
                //[x, y, width, height]
                // [150, 50, 250, 250],
                // [450, 50, 250, 250],
                // [800, 50, 300, 25],
                [1000, 10, 500, 800],

            ],
            options: {
                colors: {
                    normal: 'rgba(255,225,255,1)',
                    selected: 'rgba(0,225,204,1)',
                    unselected: 'rgba(100,100,100,1)'
                },
                style: {
                    maxWidth: '100%',
                    maxHeight: '90vh',
                    color: 'rgba(155,205,255,1)'
                }
            }
        };
        var cols = []
        this.state.AreaList.forEach(element => {
            cols.push(<Col key={element.key}>
                <div style={{ textAlign: 'center', color: '#0b8dbe', fontSize: '12px' }}>{element.title}</div>
                <div className="img-overlay-wrap">
                    <svg style={{ width: '100%', height: '100%' }} >
                        <circle cx="50%" cy="50%" r="28%" fill="#0977a2" stroke="red" strokeWidth="3" />
                        <text x="47%" y="55%" fontSize="2em" fill="#fff">{element.Number}</text>
                    </svg>
                    <img style={{ width: '15%', height: '15%' }} src={element.IconUrl} />
                </div>


            </Col >)
        });

        // var crewList = [];
        // this.state.crewList.forEach(ele=>{
        //     crewList.push()
        // })

        return (
            <>
                <Container fluid={true} >
                    <Row>
                        <Col >
                        <Row  >{cols}</Row>
                        <Row  >
                            <CrewList list={list} />
                        </Row>
                    </Col>
                        <Col  lg={8} md={8}>
                            <Row className="justify-content-md-center">
                                <Col>
                                    <div >NON-HAZARDOUS AREA 1 </div>
                                    <img className="d-block mx-auto img-fluid w-100 h-80" style={{ position: "relative" }} src={Group541} />
                                    {location}


                                </Col>
                                <Col>
                                    <div>NON-HAZARDOUS AREA 1 </div>
                                    <img className="d-block mx-auto img-fluid w-100 h-80" src={vessel3D} />
                                    {greenLocation}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Row >
                                        <Col><div className="GeoLabel">HAZARDOUS AREA 1 (0)</div></Col>
                                        <Col><div className="GeoLabel">HAZARDOUS AREA 2 (0)</div></Col>
                                        <Col><div className="GeoLabel">NON-HAZARDOUS AREA 1 (0)</div></Col>
                                    </Row>
                                    <Row style={{ border: '2px solid #0977a2' }}>
                                        <Col></Col>
                                        <div className="under">
                                            <Col>
                                                <Row>
                                                    <Boundingbox image={params.image}
                                                        boxes={params.boxes}
                                                        options={params.options}
                                                    />
                                                    {greenLocation}
                                                </Row>

                                            </Col>
                                        </div>
                                        {/* <div className="over"><DrawLine /></div> */}
                                        <Col></Col>
                                    </Row>
                                    <Row>
                                        <Col><div className="GeoLabel" >ROOM 1 (0)</div></Col>
                                        <Col><div className="GeoLabel">NON-HAZARDOUS AREA 3 (0)</div></Col>
                                        <Col><div className="GeoLabel">NON-HAZARDOUS AREA 2 (0)</div></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>


                </Container>
            </>
        )
    }

    renderMD() {
        const list = this.state.list
        const location = [];
        const greenLocation = [];
        var count = 0;
        list.map(el => {
            if (el.locationId != null) {
                location.push(<div key={count} style={{ width: "8%", height: "10%", top: el.xOffset + '%', right: el.yOffset + '%', position: "absolute" }}>
                    <img className="under" src={mapIcon} />
                    <img className="over" src={profile} />
                </div>)
                greenLocation.push(<div key={count} style={{ width: "10%", height: "10%", top: el.xOffset + '%', right: el.yOffset + '%', position: "absolute" }}>
                    <img src={GreenCircle} />
                </div>)
                count++;
            }

        });
        const params = {
            image: Intersection,
            boxes: [
                // coord(0,0) = top left corner of image
                //[x, y, width, height]
                // [150, 50, 250, 250],
                // [450, 50, 250, 250],
                // [800, 50, 300, 25],
                [1000, 10, 500, 800],

            ],
            options: {
                colors: {
                    normal: 'rgba(255,225,255,1)',
                    selected: 'rgba(0,225,204,1)',
                    unselected: 'rgba(100,100,100,1)'
                },
                style: {
                    maxWidth: '100%',
                    maxHeight: '90vh',
                    color: 'rgba(155,205,255,1)'
                }
            }
        };


        return (
            <>

                <Container fluid={true} >
                    <Row className="justify-content-md-center" ><Areas AreaList={this.state.AreaList} /></Row>
                    <Row style={{ height: "25vh", backgroundColor: '#1b4150' }}  >
                        <ScrollingItem list={list} />
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col xs={6} sm={6} md={6}>
                            <div >NON-HAZARDOUS AREA 1 </div>
                            <img className="d-block mx-auto img-fluid w-100 h-80" style={{ position: "relative" }} src={Group541} />
                            {location}


                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            <div>NON-HAZARDOUS AREA 1 </div>
                            <img className="d-block mx-auto img-fluid w-100 h-80" src={vessel3D} />
                            {greenLocation}
                        </Col>
                    </Row>
                    <Row>
                        <Col><div className="GeoLabel">HAZARDOUS AREA 1 (0)</div></Col>
                        <Col><div className="GeoLabel">HAZARDOUS AREA 2 (0)</div></Col>
                        <Col><div className="GeoLabel">NON-HAZARDOUS AREA 1 (0)</div></Col>
                    </Row>
                    <Row className="justify-content-md-center" style={{ border: '2px solid #0977a2' }}>
                        <div className="under">
                            <Col>

                                <Row>
                                    {/* <img className="d-block mx-auto w-100 h-100" src={Intersection} />
                                {greenLocation} */}

                                    <Boundingbox image={params.image}
                                        boxes={params.boxes}
                                        options={params.options}
                                    />
                                    {greenLocation}


                                </Row>

                            </Col>
                        </div>
                        <div className="over"><DrawLine /></div>

                    </Row>
                    <Row>
                        <Col><div className="GeoLabel" >ROOM 1 (0)</div></Col>
                        <Col><div className="GeoLabel">NON-HAZARDOUS AREA 3 (0)</div></Col>
                        <Col><div className="GeoLabel">NON-HAZARDOUS AREA 2 (0)</div></Col>
                    </Row>
                    {/* <Row>
                    <DrawLine className="over"/>
                    </Row> */}
                </Container>
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
export default withLayoutManager(GeoFencing)