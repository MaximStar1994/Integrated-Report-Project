import React from 'react';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import 'react-circular-progressbar/dist/styles.css';

// accepts dataArr : [ { percentage : 50, color : String }]
class CompositionSemiCircleProgressBar extends React.Component {
    radius = 0
    getPaths = () => {
        var paths = [];
        var currAngle = 0;
        var strokeWidth = 5;
        if (this.props.strokeWidth !== undefined) {
            strokeWidth = this.props.strokeWidth
        }
        let rad = 50 - strokeWidth
        this.radius = rad
        let emptyPathpt1 = "a "+rad+","+rad+` 0 0,1 ${rad*2} 0`
        let emptyPathD = `M ${strokeWidth},${50 + strokeWidth} ` + emptyPathpt1
        for (var i=0; i < this.props.dataArr.length; i++) {
            let currDat = this.props.dataArr[i]
            currAngle = currAngle + currDat.percentage / 100 * Math.PI
            let xPoint = Math.cos(currAngle) * -rad + rad;
            let yPoint = Math.sin(currAngle) * -rad;
            let xy = xPoint.toString() + "," + yPoint.toString()
            var d = `M ${strokeWidth},${50 + strokeWidth} a `+rad+","+rad+" 0 0 1 "+ xy
            if (currAngle > Math.PI) {
                d = `M ${strokeWidth},${50 + strokeWidth} m 0,-`+rad+" a "+rad+","+rad+" 0 1 1 "+ xy
            }
            paths.push(
                <path 
                        key={i}
                        className="CircularProgressbar-trail" d={d}
                        strokeWidth={strokeWidth} fillOpacity="0" style={{
                        stroke: currDat.color}}>
                </path>
            )
        } 
        paths.push(
            <path 
                    key="emptyPath"
                    className="CircularProgressbar-trail" d={emptyPathD}
                    strokeWidth={strokeWidth} fillOpacity="0" style={{
                    stroke: "#02404f",
                    }}>
            </path>
        )
        
        return paths.reverse();
    }
    render() {
      return (
            <Row noGutters={true}>
                <Col>
                    <svg className="CircularProgressbar" viewBox = "0 0 100 55">
                        {this.getPaths()}
                    </svg>
                    <div
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            left : 0,
                            marginTop: "-50%",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            padding : "0 "+(100 - 2 * this.radius)+"%"}}>
                        {this.props.children}
                    </div>
                </Col>
            </Row>
            )
    }
  }

export default CompositionSemiCircleProgressBar;
