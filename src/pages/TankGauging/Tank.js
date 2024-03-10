import React from 'react';

import baseTank from '../../assets/TankGauging/TG_Empty_Tank.png'
import blueTank from '../../assets/TankGauging/Keppel_TG_Tank_Blue.png'
import brownTank from '../../assets/TankGauging/Keppel_TG_Tank_Brown.png'
import brownRedTank from '../../assets/TankGauging/Keppel_TG_Tank_Brown_Red.png'
import greenTank from '../../assets/TankGauging/Keppel_TG_Tank_Green.png'
import yellowTank from '../../assets/TankGauging/Keppel_TG_Tank_Yellow.png'
import defaultFill from '../../assets/TankGauging/TG_Gray_Valve.png'
import defaultDump from '../../assets/TankGauging/TG_Gray_Valve_Dump.png'
// maxSounding : Int
// currVolume : Int
// sondingValue : Int
// dumpEnum : Int
// fillEnum : Int
// tankType : Int
class Tank extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        var maxSounding = this.props.maxSounding
        var currVolume = this.props.currVolume
        var soundingValue = this.props.soundingValue
        var fillPer = (soundingValue > maxSounding) ? "61%" : (soundingValue / maxSounding * 61) + "%"
        var tankImg = blueTank
        var fillImg = defaultFill
        var dumpImg = defaultDump
        var tankType = this.props.tankType
        var name = this.props.name
        soundingValue = soundingValue.toFixed(2)
        currVolume = currVolume.toFixed(2)
        switch(tankType) {
            case 0:
                tankImg = blueTank
                break;
            case 1:
                tankImg = brownTank
                break;
            case 2:
                tankImg = brownRedTank
                break;
            case 3:
                tankImg = yellowTank
                break;
            case 4:
                tankImg = greenTank
                break;
            default:
                break;
        }
        return (
            <div style={{position : "absolute", top:0,left:0,bottom:0,right:0}}>
                <div>
                    <div style={{position : "absolute", width : "80%", left : "0%",marginTop : "60%", color : "black", zIndex : 10, textAlign : "center"}}>{this.props.name}</div>
                    <img src={tankImg} />
                    <img src={fillImg} style={{position : "absolute", left:"47%", top : 0, width : "38%"}} />
                    <img src={baseTank} style={{position : "absolute", top:0,left:0,bottom:0,right:0,clipPath : "inset(0 0 "+fillPer+" 0)"}} />
                    <img src={dumpImg} style={{position : "absolute", width : "28%", right : "6%",marginTop : "70%"}} />
                </div>
                <div style={{position : "relative", textAlign : "center", color : "black"}}><span style={{color : "#2d63f7"}}>{soundingValue}</span> ft</div>
                <div style={{textAlign : "center", color : "black"}}><span style={{color : "#2d63f7"}}>{currVolume}</span> m&sup3;</div>
            </div>)
    }
}

export default Tank;
