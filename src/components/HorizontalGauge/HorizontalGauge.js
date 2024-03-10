import React from 'react';
// data = a
// min = 0
// max = 100
class HorizontalGauge extends React.Component {
    constructor(props, context) {
        super(props, context);
        
    }
    render() {
        var max = this.props.max ? this.props.max : 100
        var min = this.props.min ? this.props.min : 0
        var data = this.props.data ? this.props.data : 0
        var width = (data - min) / (max - min) * 100 + ""
        
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={"0 0 100 20"}>
                <rect 
                    fill="#ffffff" 
                    fillRule="nonzero" id="svg_0" x="0" y="3" width="100" height="10" />
                <rect 
                    fill="#4a90d6" 
                    fillRule="nonzero" id="svg_1" x="0" y="3" width={width} height="10" />
                <text x="0" y="20" className="svgtext">{min}</text>
                <text x="90" y="20" textAnchor="end" className="svgtext">{max}</text>
            </svg>
        )
    }
  }

export default HorizontalGauge;
