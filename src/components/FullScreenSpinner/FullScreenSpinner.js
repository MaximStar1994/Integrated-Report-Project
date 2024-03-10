import { Spinner } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import React from "react";
class FullScreenSpinner extends React.Component { 
    render() {
        return (
            <div style={{position : "fixed", top : 0, left: 0, width: "100vw", height: " 100vh", backgroundColor : "rgba(255,255,255,0.3)", zIndex : 100}}>
                <div style={{position : "absolute", top : "45%", left: "45%", bottom : "45%", right : "45%", zIndex : 101}} >
                    <Spinner color="#727981" size={32} speed={1} animating={true} />
                    <div style={{ marginTop: '10px', fontSize: '1.5rem', marginLeft: '-10%' }}>{this.props.text&&this.props.text}</div>
                </div>
            </div>
        )
    }
}
export default FullScreenSpinner;
