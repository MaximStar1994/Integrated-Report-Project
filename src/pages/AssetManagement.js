import React from 'react';

import SideBar from '../components/SideBar/SideBar.js';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import mainDeck from '../assets/MainDeck.png'

function AssetManagement() {
  return (
    <SideBar >
      <Row>
        <Col xs={{span : 6, offset: 3 }}>
          <img src={mainDeck} className="img-responsive" alt='Main deck'></img>
        </Col>
      </Row>
    </SideBar>
  );
}

export default AssetManagement;
