import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap';
import { withLayoutManager } from '../../Helper/Layout/layout'
import TrendLogo from '../../assets/Analytics/TrendLogo.png';
import exportCSV from '../../assets/KST/exportCSV.png';
import './TrendingPage.css'
import { Link } from "react-router-dom";
class AnalyticsHome extends React.Component {
    constructor() {
        super();
        this.state = {
            managementAppList: [
                {
                    title: 'Trend',
                    category: 'Analytics',
                    imgUrl: TrendLogo,
                    desc: 'Trend Analytics',
                    redirectUrl: '/analytics/trending'
                },
                {
                    title: 'Export',
                    category: 'Analytics',
                    imgUrl: exportCSV,
                    desc: 'Export Data',
                    redirectUrl: '/analytics/exportdata'
                },
            ],
            vesselAppList: [
            ]
        }
    }
    
    getList = () => {
        if(JSON.parse(localStorage.getItem('user')).accountType.toLowerCase() === 'management'){
            return this.state.managementAppList;
        }
        else if(JSON.parse(localStorage.getItem('user')).accountType.toLowerCase() === 'vessel'){
            return this.state.vesselAppList;
        }
        else if(JSON.parse(localStorage.getItem('user')).accountType.toLowerCase() === 'admin'){
            return this.state.managementAppList.concat(this.state.vesselAppList);
        }
        else{
            return [];
        }
    }

    render() {
        return (
            <Container fluid className="appContainer">
                <Row>
                    {this.getList().map((post, i) =>
                        <Col sm={4} md={4} lg={3} xl={2} key={i} >
                            <Link to={post.redirectUrl}>
                                <Card className="appCard">
                                    <div>
                                        <div className="app_cat" ><span>{post.category}</span></div>
                                        <div className="app_title">{post.title}</div>
                                        <img className="app_img" src={post.imgUrl} alt={post.title} />
                                        <div className="app_desc" >{post.desc}</div>
                                    </div>
                                </Card>
                            </Link>
                        </Col>
                    )}
                </Row>
            </Container>)
    }

}
export default withLayoutManager(AnalyticsHome)

// import React from 'react';
// import Container from 'react-bootstrap/Container'
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
// import DashboardCardWithHeader from '../../components/DashboardCard/DashboardCardWithHeader'
// import AnalyticsLogo from '../../assets/Analytics/AnalyticsLogo.png'
// import TrendLogo from '../../assets/Analytics/TrendLogo.png'
// import { Link } from "react-router-dom";
// import '../../css/App.css';
// import './TrendingPage.css'
// class Home extends React.Component {
//     constructor(props, context) {
//         super(props, context);
//         this.state = { 
//             renderFor : 0, // 0 for desktop, 1 for ipad, 2 for mobile 
//         };
//     }

//     updateSize = () => {
//         var width = window.innerWidth
//         if (window.orientation === 90) {
//             if (navigator.userAgent.match(/Android/) === null) {
//                 // android's innerheight has issues
//                 width = window.innerHeight
//             }
//         }
//         if (width >= 1200) {
//             this.setState({ renderFor : 0})
//         } else if (width >= 768) {
//             this.setState({ renderFor : 1})
//         } else {
//             this.setState({ renderFor : 2})
//         }
//     }
//     componentDidMount() {
//         this.updateSize()
//         window.addEventListener('resize', this.updateSize);
//         window.addEventListener("orientationchange", this.updateSize);
//     }
//     componentWillUnmount() {
//         window.removeEventListener('resize', this.updateSize);
//         window.removeEventListener('orientationchange', this.updateSize);
//     }
    
//     renderLG() {
//         return(
//             <>
//             <DashboardCardWithHeader title="&nbsp;Analytics">
//                 <Row style={{marginTop : "15vh", marginBottom : "15vh"}}>
//                     <Col xs={{span:6, offset : 3}}>
//                         <Row>
//                             <Col xs={{span : 3}}>
//                                 <Link to="/analytics/trending"><img src={TrendLogo} /></Link>
//                             </Col>
//                             <Col style={{display : "flex"}}>
//                                 <div style={{alignSelf : "center"}}>
//                                     <h3 className="App-link" style={{fontWeight : "bold"}}>Trend</h3>
//                                     <p>Trend helps you transform data into actionable insights. Explore with visual analytics. Build analytic and perform ad hoc analyses in just a few clicks. Share your work with anyone and make an impact on your rig health.</p>
//                                 </div>
//                             </Col>
//                         </Row>
                       
//                     </Col>
//                 </Row>
//             </DashboardCardWithHeader>
//             </>
//         )
//     }
//     renderMD() {
//         return (
//             <>
//             </>
//         )
//     }
//     render() {
//         var contents = this.renderLG()
//         if (this.state.renderFor === 1) {
//             contents = this.renderMD()
//         }
//         return (
//             <div className="content-inner-all">
//             <Container fluid={true}>
//                 {contents}
//             </Container>
//             </div>)
//     }
// }

// export default Home;