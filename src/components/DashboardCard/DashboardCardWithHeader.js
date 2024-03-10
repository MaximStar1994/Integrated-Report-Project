import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import SlantedHeader from '../SlantedHeader/SlantedHeader'
import './DashboardCard.css'
class DashboardCardWithHeader extends React.Component {
 
    render() {
      return (
        <>
        <Row >
            <Col xs={12} className="cardContent cardTitle" style={{height: '100%'}}>
                <SlantedHeader title={this.props.title} />
            </Col>
        </Row>
        <Row className="flex-grow-1">
            <Col xs={12} style={{display : 'flex'}}>
                <div className="cardContent flex-grow-1" style={{backgroundColor : '#022a39'}} >
                    {this.props.children}
                </div>
            </Col>
        </Row>
        </>
        )
    }
  }

export default DashboardCardWithHeader;
