import React from 'react'

// props :
//   maxVal : double
//   minVal : double
//   data : [{
//     value : double
//     color : string
//   }]
class KeppelGauge extends React.Component {
   range = 360
   max = 360
   min = 0
   outerCircleWidth = 5
   radius = 100
   longerTickLen = 10
   tickLen = 5
   interval = 5

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
    var teta = 0
    let noIterations = this.range / this.interval
    for (var i=0; i < noIterations; i++) {
      let tfm = "rotate(" + teta + " " + this.radius + " " + this.radius + ")"
      var parsedref = "#" + ref
      if ( teta%45 === 0) {
        parsedref = "#longer" + ref
        let textX = Math.sin((teta) / 180 * Math.PI) * (this.radius - 30) + this.radius
        let textY = -1 * Math.cos((teta) / 180 * Math.PI) * (this.radius - 30) + this.radius + 2
        ticks.push( <text x={textX.toString()} y={textY.toString()} 
                        key={"text" + i}
                        fontFamily="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" 
                        fontSize="8" 
                        textAnchor="middle" 
                        transform = "rotate ( 90 100 100 )"
                        fill="#ffffff">
                        {teta / 360 * this.range}
                  </text>)
      }
      ticks.push(<use key={i} href={parsedref} transform={tfm}></use>)
      teta = teta + this.interval / this.range * 360
    }
    return ticks
  }

  fillData = () => {
    var needle = []
    var teta = 0
    for (var i=0; i < this.props.data.length; i++) {
      let currDat = this.props.data[i]
      teta = (currDat.value - this.min) / this.range * 360 - 90
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
                          stroke="#055775" strokeWidth="1"></line>
          <line id="longertick" x1={xTick} y1={this.radius} x2={xTick + this.longerTickLen} y2={this.radius} 
                          stroke="#055775" strokeWidth="1"></line>
          <line id="longerinnertick" x1={xInnerTick} y1={this.radius} x2={xInnerTick + this.longerTickLen} y2={this.radius} 
                          stroke="#055775" strokeWidth="1"></line>
          <line id="innertick" x1={xInnerTick + this.tickLen} y1={this.radius} x2={xInnerTick} y2={this.radius} 
                          stroke="#055775" strokeWidth="1"></line>
        </defs>
        <g transform={"rotate(-90 "+this.radius+" " + this.radius + ")"}>
          <circle cx={this.radius} cy={this.radius} r={this.radius - this.outerCircleWidth} fill="none" stroke="#04445d" strokeWidth={this.outerCircleWidth}></circle>
          <g className="ticks">
            {this.fillTicks('tick')}
            {this.fillTicks('innertick')}
          </g>
          <g className="needle">
            <g transform={"rotate(90 "+this.radius+" " + this.radius + ")"}>
              {this.fillData()}
            </g>
            <circle cx={this.radius} cy={this.radius} r="5" fill="#404040"></circle>
          </g>
        </g>
      </svg>     
    )
    }
  }

export default KeppelGauge;