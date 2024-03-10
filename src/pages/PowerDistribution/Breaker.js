import React from 'react';
import BreakerClosed from '../../assets/Power/Breaker_Close.png'
import BreakerOpened from '../../assets/Power/Breaker_Opened.png'
import BreakerTripped from '../../assets/Power/Breaker_Tripped.png'
class Breaker extends React.Component {
    render() {
        var imgSrc = BreakerOpened
        if (this.props.closed) {
            imgSrc = BreakerClosed
        }
        if (this.props.tripped) {
            imgSrc = BreakerTripped
        }
        return (
            <img src={imgSrc} alt="Breaker Status" style={{paddingLeft : "10%", paddingRight : "10%"}}/>
        )
    }
}
export default Breaker;