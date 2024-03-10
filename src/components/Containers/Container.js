import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ContainerDimensions from 'react-container-dimensions';
import './Home.css'

const DashboardCenterCol = (props) => {
    
  return (
    <Container className="cd"  fluid={true} >
      <Row >
        <Col className="col-lg-2 col-lg-2 col-lx-2"  >{props.ColumnOne}</Col>
        <Col className="col-lg-10 col-lg-10 col-lx-10" >{props.ColumnTwo}</Col>
      </Row>
    </Container>
  );
}

const DashboardSingleCol = (props) => {
    
  return (
    <Container className="cd"  fluid={true} >
      <Row >
        <Col>{props.ColumnOne}</Col>
      </Row>
      <Row >
        <Col>{props.ColumnTwo}</Col>
      </Row>
    </Container>
  );
}

export {DashboardCenterCol,DashboardSingleCol} ;