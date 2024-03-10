import React from 'react';
// data = [a,b]
// labels = [a,b]
// max = 100
class BrakeGauge extends React.Component {
    constructor(props, context) {
        super(props, context);
        
    }
    render() {
        var heights = ["0","0"]
        var labels = this.props.labels
        var max = this.props.max ? this.props.max : 100
        var data = this.props.data ? this.props.data : [0,0,0]
        
        data.forEach((data,idx) => {
            heights[idx] = (80 - data/max * 80) + ""
        })
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={"0 0 100 80"}>
                <rect 
                    fill="#ffffff" 
                    fillRule="nonzero" id="svg_0" x="5" y="0" width="40" height="80" />
                <rect 
                    fill="#4a90d6" 
                    fillRule="nonzero" id="svg_1" x="5" y={heights[0]} width="40" height="80" />
                <rect 
                    fill="#ffffff" 
                    fillRule="nonzero" id="svg_0" x="55" y="0" width="40" height="80" />
                <rect 
                    fill="#4a90d6" 
                    fillRule="nonzero" id="svg_2" x="55" y={heights[1]} width="40" height="80" />
            </svg>
        )
    }
  }

export default BrakeGauge;
