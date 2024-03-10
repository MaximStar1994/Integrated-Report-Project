import React from 'react';
import './ModuleHeader.css';

class ModuleContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            selectedModule : 1
        };
    }
    AddHighlightToModule = () => {
        var classname = ""
        if (this.props.title !== "Home") {
            classname = "highlightModule"
        }
        return classname
    }
    CheckIfSelected = () => {
        if ( this.props.selected && this.props.title !== "Home" ) {
            return "ModuleSelected"
        } else {
            return ""
        }
    }
    onSelectModule = (key) => {
        this.props.selectHandler(key)
    }
    render() {
        var className = "ModuleContainer " + this.AddHighlightToModule() + " " + this.CheckIfSelected()
        var className2 = "moduleNavbarTitle"
        if (this.props.disabled) {
            className += " disabled"
            className2 += " disabled"
        }
        return (
            <div className={className} style={{height: "100%"}} 
                onClick={() => this.onSelectModule(this.props.eventKey)}>
                <div className="ModuleContent" style={{height: "100%"}}>
                    <div style={{width: "10%"}} ></div>
                    <div className="" style={{width: "15%", alignSelf : "center"}} >
                        <img src={this.props.logo} alt="logo" className="img-responsive" style ={{margin:'auto', padding : "5px 5px"}}></img>
                    </div>
                    <div className={className2} style={{width : "75%", alignSelf : "center"}} >
                        {this.props.title}
                    </div>
                </div>
            </div>
        )
    }
}

export default ModuleContainer