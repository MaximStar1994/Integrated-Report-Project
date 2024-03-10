import React from 'react';
import '../../css/App.css';

// name : string
// status : string
class GeneratorStatus extends React.Component {
    constructor(props,context) {
        super(props, context);
        this.state={}
        this.refDiv = React.createRef()
    }
    componentDidMount() {
        this.inverval = setInterval((handler) => {
            this.setState({height : this.refDiv.offsetWidth})
            clearInterval(this.inverval)
        },500)
    }
    render() {
        var border = "3px solid clear"
        if (this.props.status === "ready" || this.props.status === "on") {
            border = "3px solid #00b050"
        }
        var bgColor = "#c0c0c0"
        if (this.props.status === "on") {
            bgColor = "#66cc33"
        } 
        let height = this.state.height ? this.state.height+'px' : "auto"
        return (
            <div ref={(ref) => { this.refDiv = ref }} 
                style={{borderRadius : "50%", border : border, width : "100%", height : height, backgroundColor : bgColor, display : "flex"}}>
                <div style={{margin : "auto", alignSelf : "center", color : "black"}}>
                    {this.props.name}
                </div>
            </div>
        )
    }
}

export default GeneratorStatus;
