import React from 'react';
// data = [a,b,c]
// max = 100
class LegLoadGauge extends React.Component {
    constructor(props, context) {
        super(props, context);
        
    }
    render() {
        var heights = ["0","0","0"]
        var max = this.props.max ? this.props.max : 100
        var data = this.props.data ? this.props.data : [0,0,0]
        
        data.forEach((data,idx) => {
            heights[idx] = (80 - data/max * 80) + ""
        })
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={"0 0 100 80"}>
                <rect 
                    fill="#ffffff" 
                    fillRule="nonzero" id="svg_0" x="0" y="0" width="30" height="80" />
                <rect 
                    fill="#4a90d6" 
                    fillRule="nonzero" id="svg_1" x="0" y={heights[0]} width="30" height="80" />
                <rect 
                    fill="#ffffff" 
                    fillRule="nonzero" id="svg_0" x="35" y="0" width="30" height="80" />
                <rect 
                    fill="#4a90d6" 
                    fillRule="nonzero" id="svg_2" x="35" y={heights[1]} width="30" height="80" />
                <rect 
                    fill="#ffffff" 
                    fillRule="nonzero" id="svg_0" x="70" y="0" width="30" height="80" />
                <rect 
                    fill="#4a90d6" 
                    fillRule="nonzero" id="svg_3" x="70" y={heights[2]} width="30" height="80"/>
            </svg>
        )
    }
  }

export default LegLoadGauge;
