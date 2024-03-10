import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

import StatusLight from '../StatusLight/StatusLight.js'
import "./StatusLightTimeChart.css"

class StatusLightTimeChart extends React.Component {
    render() {
        return (
            <Container fluid={true}>
                <Row noGutters={true}>
                    <Col className="StatusLightContainer">
                        <StatusLight status="marginal" ></StatusLight>
                    </Col>
                    <Col className="StatusLightContainer">
                        <StatusLight status="satisfactory" ></StatusLight>
                    </Col>
                    <Col className="StatusLightContainer">
                        <StatusLight status="unsatisfactory" ></StatusLight>
                    </Col>
                    <Col className="StatusLightContainer">
                        <StatusLight status="default" ></StatusLight>
                    </Col>
                    <Col className="StatusLightContainer">
                        <StatusLight status="default" ></StatusLight>
                    </Col>
                    <Col className="StatusLightContainer">
                        <StatusLight status="default" ></StatusLight>
                    </Col>
                    <Col className="StatusLightContainer">
                        <StatusLight status="default" ></StatusLight>
                    </Col>
                    <Col className="StatusLightContainer">
                        <StatusLight status="default" ></StatusLight>
                    </Col>
                    <Col className="StatusLightContainer">
                        <StatusLight status="default" ></StatusLight>
                    </Col>
                    <Col className="StatusLightContainer">
                        <StatusLight status="default" ></StatusLight>
                    </Col>
                    <Col className="StatusLightContainer">
                        <StatusLight status="default" ></StatusLight>
                    </Col>
                    <Col className="StatusLightContainer"   >
                        <StatusLight status="default" ></StatusLight>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default StatusLightTimeChart
