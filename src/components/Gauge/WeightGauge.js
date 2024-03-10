import React from 'react'

// props :
//   maxVal : double
//   minVal : double
//   data : [{
//     value : double
//     color : string
//   }]
class WeightGauge extends React.Component {
   range = 360
   max = 360
   min = 0
   outerCircleWidth = 5
   radius = 100
   longerTickLen = 10
   tickLen = 5
   interval = 100

  constructor(props, context) {
    super(props, context);
    if (props.maxVal !== undefined && props.minVal !== undefined) {
      this.range = props.maxVal - props.minVal
      this.max = props.maxVal
      this.min = props.minVal
    }
  }

  fillTicks = (ref) => {
    var ticks = []
    var teta = 210
    let noIterations = this.range / this.interval
    for (var i=0; i <= noIterations; i++) {
      let tfm = "rotate(" + teta + " " + this.radius + " " + this.radius + ")"
      var parsedref = "#" + ref
      if ( i%5 === 0) {
        parsedref = "#longer" + ref
        let textX = Math.sin((teta) / 180 * Math.PI) * (this.radius - 40) + this.radius
        let textY = -1 * Math.cos((teta) / 180 * Math.PI) * (this.radius - 40) + this.radius + 2
        ticks.push( <text x={textX.toString()} y={textY.toString()} 
                        key={"text" + i}
                        fontFamily="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" 
                        fontSize="12" 
                        textAnchor="middle" 
                        transform = "rotate ( 90 100 100 )"
                        fill="#000000">
                        {(teta-210) / 300 * this.range - 1500}
                  </text>)
      }
      if ( i==0 || i==noIterations) {
        let textX = Math.sin((teta) / 180 * Math.PI) * (this.radius - 40) + this.radius
        let textY = -1 * Math.cos((teta) / 180 * Math.PI) * (this.radius - 40) + this.radius + 2
        ticks.push( <text x={textX.toString()} y={textY.toString()} 
                        key={"textt" + i}
                        fontFamily="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" 
                        fontSize="12" 
                        textAnchor="middle" 
                        transform = "rotate ( 90 100 100 )"
                        fill="#000000">
                        {(teta-210) / 300 * this.range - 1500}
                  </text>)
      }
      ticks.push(<use key={i} href={parsedref} transform={tfm}></use>)
      teta = teta + this.interval / this.range * 300
    }
    return ticks
  }

  fillData = () => {
    var needle = []
    var teta = 210
    for (var i=0; i < this.props.data.length; i++) {
      let currDat = this.props.data[i]
      teta = (currDat.value - this.min) / this.range * 300 + teta - 90
      needle.push(
        <polygon  key = {i}
                  points={this.radius+"," + (this.radius - 5) + " " + this.radius+"," + (this.radius + 5) + " 180," + this.radius} 
                  fill={currDat.color} 
                  transform={"rotate( "+teta+" "+this.radius+" " + this.radius + ")"}/>)
    }
    return needle
  }
  render() {
    let diameter = 2 * this.radius
    let xTick = diameter - this.outerCircleWidth * 4
    let xInnerTick = xTick - 0.35 * this.radius
    return (
      <svg  xmlns="http://www.w3.org/2000/svg"
            viewBox={"0 0 " + diameter + " " + diameter}>
        <defs>
          <line id="tick" x1={xTick} y1={this.radius} x2={xTick + this.tickLen} y2={this.radius} 
                          stroke="#000000" strokeWidth="1"></line>
          <line id="longertick" x1={xTick} y1={this.radius} x2={xTick + this.longerTickLen} y2={this.radius} 
                          stroke="#000000" strokeWidth="1"></line>
          <line id="longerinnertick" x1={xInnerTick} y1={this.radius} x2={xInnerTick + this.longerTickLen} y2={this.radius} 
                          stroke="#000000" strokeWidth="1"></line>
          <line id="innertick" x1={xInnerTick + this.tickLen} y1={this.radius} x2={xInnerTick} y2={this.radius} 
                          stroke="#000000" strokeWidth="1"></line>
        </defs>
        <g transform={"rotate(-90 "+this.radius+" " + this.radius + ")"}>
          <circle cx={this.radius} cy={this.radius} r={this.radius} fill="#ffffff"></circle>
          {/* <circle cx={this.radius} cy={this.radius} r={this.radius - this.outerCircleWidth} fill="none" stroke="#000000" strokeWidth={this.outerCircleWidth}></circle> */}
          <g className="ticks">
            {this.fillTicks('tick')}
          </g>
          <g className="needle">
            <g transform={"rotate(90 "+this.radius+" " + this.radius + ")"}>
              {this.fillData()}
            </g>
            <circle cx={this.radius} cy={this.radius} r="5" fill="#000000"></circle>
            <text x={this.radius} y={this.radius + 20} 
                  fontFamily="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" 
                  fontSize="16" 
                  textAnchor="middle" 
                  transform = "rotate ( 90 100 100 )"
                  fill="#000000" y={140} >
                  kW
            </text>
          </g>
        </g>
      </svg>     
    )
    }
  }

export default WeightGauge;