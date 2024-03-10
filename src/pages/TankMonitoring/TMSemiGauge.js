import React from 'react'

// props :
//   maxVal : double
//   minVal : double
//   data : [{
//     value : double
//     color : string
//   }]
class KeppelGauge extends React.Component {
    range = 180
    max = 180
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
            this.interval = this.range / 36
        }
    }
    fillNumbers = () => {
        var ticks = []
        var teta = 0
        let noIterations = this.range / this.interval
        for (var i = 0; i <= noIterations; i++) {
            if (teta % 45 === 0) {
                let textX = this.radius - Math.cos((teta) / 180 * Math.PI) * (this.radius - 30)
                let textY = -1 * Math.sin((teta) / 180 * Math.PI) * (this.radius - 30) + this.radius + 2
                ticks.push(<text x={textX.toString()} y={textY.toString()}
                    key={"text" + i}
                    fontFamily="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
                    fontSize="8"
                    textAnchor="middle"
                    fill="#ffffff">
                    {teta / 180 * this.range + this.min}
                </text>)
            }
            teta = teta + this.interval / this.range * 180
        }
        return ticks
    }
    fillTicks = (ref) => {
        var ticks = []
        var teta = 0
        let noIterations = this.range / this.interval
        for (var i = 0; i < noIterations; i++) {
            let tfm = "rotate(" + (teta - 180) + " " + this.radius + " " + this.radius + ")"
            var parsedref = "#" + ref
            if (teta % 45 === 0) {
                parsedref = "#longer" + ref
            }
            ticks.push(<use key={i} href={parsedref} transform={tfm}></use>)
            teta = teta + this.interval / this.range * 180
        }
        return ticks
    }

    fillData = () => {
        var needle = []
        var teta = 0
        for (var i = 0; i < this.props.data.length; i++) {
            let currDat = this.props.data[i]
            teta = (parseFloat(currDat.value) - this.min) / this.range * 180
            needle.push(
                <polygon key={i}
                    points={this.radius + "," + (this.radius - 5) + " " + this.radius + "," + (this.radius + 5) + ` ${this.outerCircleWidth},` + (this.radius)}
                    fill={currDat.color}
                    transform={"rotate( " + teta + " " + this.radius + " " + this.radius + ")"} />)
        }
        return needle
    }

    fillText = () => {
        var textArr = []
        for (var i = 0; i < this.props.data.length; i++) {
            let currDat = this.props.data[i]
            textArr.push(<><text x="50%" y="65%" text-anchor="middle" dy="0.5em" font-size="1.5rem" fill="#05f5ff" fontWeight="300" >{parseFloat(currDat.value).toFixed(2)}</text>
                <text x="50%" y="90%" text-anchor="middle" dy="0.5em" font-size="0.8rem" fill="#0977a2">{currDat.unit}</text></>)
        }
        return textArr
    }

    render() {
        let diameter = 2 * this.radius
        let height = this.radius + 5
        let xTick = diameter - this.outerCircleWidth * 4
        let xInnerTick = xTick - 0.35 * this.radius
        return (
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox={"0 0 " + diameter + " " + height}>
                <defs>
                    <line id="tick" x1={xTick} y1={this.radius} x2={xTick + this.tickLen} y2={this.radius}
                        stroke="#f9f9f9" strokeWidth="1"></line>
                    <line id="longertick" x1={xTick} y1={this.radius} x2={xTick + this.longerTickLen} y2={this.radius}
                        stroke="#f9f9f9" strokeWidth="1"></line>
                    <line id="longerinnertick" x1={xInnerTick} y1={this.radius} x2={xInnerTick + this.longerTickLen} y2={this.radius}
                        stroke="#f9f9f9" strokeWidth="1"></line>
                    <line id="innertick" x1={xInnerTick + this.tickLen} y1={this.radius} x2={xInnerTick} y2={this.radius}
                        stroke="#f9f9f9" strokeWidth="1"></line>
                </defs>
                <path d={`M${this.outerCircleWidth},${this.radius} a 1 1 0 0 1 ${(this.radius - this.outerCircleWidth) * 2},0`}
                    fill="none" stroke="#f9f9f9" strokeWidth={this.outerCircleWidth} />
                <g className="ticks">
                    {this.fillTicks('tick')}
                    {/* {this.fillTicks('innertick')} */}
                </g>
                <g className="needle">
                    {this.fillData()}
                    <circle cx={this.radius} cy={this.radius} r="55" stroke="#0977a2" stroke-width="3" fill="#032a39" ></circle>
                    {this.fillText()}
                </g>
                <g className="ticks">{this.fillNumbers()}</g>
            </svg>
        )
    }
}

export default KeppelGauge;