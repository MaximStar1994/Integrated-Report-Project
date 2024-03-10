import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import CompositionCircleProgressBar from '../../../components/CircularProgressBar/CompositionCircleProgressBar'
import Areas from './Areas'
class ProgressBars extends React.Component {
    constructor(props){
        super(props)
        this.state={
            tasklist: this.props.tasklist
        }
    }
    componentWillReceiveProps(newProps) {
        // console.log("tasklist" + JSON.stringify(newProps.tasklist)) 
        this.setState({tasklist: newProps.tasklist});
      }
    render() {
        
        const {tasklist} = this.state
        let start =0 , todo = 0,  overdue =0, done = 0;

        const c1 = tasklist.filter(item => item.status === 'Start' )
        if(c1){start =c1.length}
    
        const c2 = tasklist.filter(item => item.status === 'Open' || item.status === 'Start' || item.status === 'Pause' )
        if(c2){todo =c2.length}

        const c3 = tasklist.filter(item => item.status === 'Completed')
        if(c3){done =c3.length}

        return (
            <>
                <Col xs md={2} >
                    <Row className="justify-content-md-center"><div className="blueHeading3" style={{ textAlign: "center" }}>
                        To Do
                                        </div></Row>
                    <Row className="justify-content-md-center" >
                        <CompositionCircleProgressBar
                            dataArr={[
                                { percentage: todo ? todo : 0, color: "#00ff00" }
                            ]}>
                            <div className="whiteHeading1" style={{ textAlign: 'center', padding: "10px" }}>
                            {todo?todo:0}
                                        </div>
                        </CompositionCircleProgressBar>
                    </Row>
                </Col>
                <Col xs md={2}>
                    <Row className="justify-content-md-center"><div className="blueHeading3" style={{ textAlign: "center" }}>
                        STARTED
                                        </div></Row>
                    <Row className="justify-content-md-center">
                        <CompositionCircleProgressBar
                            dataArr={[
                                { percentage: start?start:0, color: "#00ff00" }
                            ]}>
                            <div className="whiteHeading1" style={{ textAlign: 'center', padding: "10px" }}>
                                {start?start:0}
                                        </div>
                        </CompositionCircleProgressBar>
                    </Row>
                </Col>
                <Col xs md={2}>
                    <Row className="justify-content-md-center"> <div className="blueHeading3" style={{ textAlign: "center" }}>
                        OVERDUE
                                        </div></Row>
                    <Row className="justify-content-md-center">
                        <CompositionCircleProgressBar
                            dataArr={[
                                { percentage: overdue?overdue:0, color: "#00ff00" }
                            ]}>
                            <div className="whiteHeading1" style={{ textAlign: 'center', padding: "10px" }}>
                            {overdue?overdue:0}
                                        </div>
                        </CompositionCircleProgressBar>
                    </Row>
                </Col>
                <Col xs md={2}>
                    <Row className="justify-content-md-center"><div className="blueHeading3" style={{ textAlign: "center" }}>
                        DONE
                                        </div></Row>
                    <Row className="justify-content-md-center">
                        <CompositionCircleProgressBar
                            dataArr={[
                                { percentage: done?done:0, color: "#00ff00" }
                            ]}>
                            <div className="whiteHeading1" style={{ textAlign: 'center', padding: "10px" }}>
                            {done?done:0}
                                        </div>
                        </CompositionCircleProgressBar>
                    </Row>
                </Col>
            </>
        )
    }
}
export default ProgressBars