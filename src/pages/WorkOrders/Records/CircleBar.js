import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CompositionCircleProgressBar from '../../../components/CircularProgressBar/CompositionCircleProgressBar'
import '../workorder.css'
class Circles extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                <Col xs={6} md={7} >
                    <Row>
                        <Col xs={4} md={4} ><div >
                            <div className="p-medium lightBlueFont2rem" >21</div>
                            <div className="blueHeading1" style={{ textAlign: 'left', padding: "10px", fontSize: '1rem' }}>
                                Priority Completed </div>
                        </div></Col>
                        <Col xs={4} md={4}><div >
                            <div className="lightBlueFont2rem p-high" >21</div>
                            <div className="blueHeading1" style={{ textAlign: 'left', padding: "10px", fontSize: '1rem' }}>
                                Priority Completed </div>
                        </div></Col>
                        <Col xs={4} md={4}><div >
                            <div className="lightBlueFont2rem p-low" >21</div>
                            <div className="blueHeading1" style={{ textAlign: 'left', padding: "10px", fontSize: '1rem' }}>
                                Priority Completed </div>
                        </div></Col>
                    </Row>
                </Col>
                <Col xs={1} md={1}></Col>
                <Col xs={2} md={2}  ><div >
                    <div className="rect-1 lightBlueFont2halfrem" >21</div>
                    <div className="blueHeading1" style={{ textAlign: 'center', fontSize: '1rem' }}>
                        Work Order Completed </div>
                </div></Col>
                <Col xs={2} md={2}><div >
                    <div className="rect-2" style={{ position: 'relative', width: '10vw', justifyContent:'center' }} >
                        <CompositionCircleProgressBar style={{ position: 'absolute', width: '10vw' }}
                            dataArr={[
                                { percentage: 0, color: "#00ff00" }
                            ]}>
                            <div className="lightBlueFont2halfrem" >
                                0%
                                        </div>
                        </CompositionCircleProgressBar></div>
                    <div className="blueHeading1" style={{ textAlign: 'center', marginTop: '1vh', fontSize: '1rem' }}>
                        Pending Order </div>
                </div></Col>
            </>
        )
    }

}
export default Circles