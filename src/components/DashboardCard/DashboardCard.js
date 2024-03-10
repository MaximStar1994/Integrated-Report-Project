import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './DashboardCard.css'
class DashboardCard extends React.Component {
    render() {
      return (
        <>
        <Row className="flex-grow-1" style={{height : "100%"}}>
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

export default DashboardCard;
