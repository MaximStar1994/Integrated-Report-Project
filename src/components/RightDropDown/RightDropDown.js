import React from 'react';

import { Dropdown } from 'react-bootstrap'
import './RightDropDown.css'
const CustomToggle = React.forwardRef(({ children, onClick, myClassName }, ref) => {
    if (myClassName) {
        return(
            <div style={{width: "100%", height : "100%"}} 
                ref={ref}
                onClick={e => {
                e.preventDefault();
                console.log("clicked")
                onClick(e)
              }} className={myClassName + " clickable"}>
                {children}
            </div>
            )
    }
    return(
    <div style={{width: "100%", height : "100%"}} 
        ref={ref}
        onClick={e => {
        e.preventDefault();
        console.log("clicked")
        onClick(e)
      }} className={" clickable"}>
        {children}
        <span style={{float: "right", color: "rgb(180,180,180)", fontSize: "1rem"}}>
            {'\u25B8'}
        </span>
    </div>
    )
})

// Props
// title = string
// options= { key : { display: string, key : string, nestedOptions : [ { display: string, key : string, nestedOptions : [ ]} ]}}
// id = string
// class = string
// onSelect = (key, event) => {}
class RightDropDown extends React.Component {
    GetDropdownItems = (options) => {
        var items = [];
        for(var key in options) {
            let value = options[key].display;
            let nestedOptions = options[key].nestedOptions
            if (nestedOptions instanceof Array && nestedOptions.length > 0) {
                items.push(
                    <Dropdown key={options[key].key} id={options[key].key} drop="right" className={this.props.class}>
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" myClassName="dropdown-item">
                            {options[key].display}
                        </Dropdown.Toggle>
                        <Dropdown.Menu >
                            {
                                this.GetDropdownItems(nestedOptions)
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                   );
            } else {
                items.push(
                    <Dropdown.Item key={options[key].key} eventKey={options[key].key} onSelect={this.props.onSelect}>
                        <div>
                            {value}
                        </div>
                    </Dropdown.Item>);
            }
        }
        return items
    }
   
    render() {
      return (
        <Dropdown id={this.props.id} drop="right" className={this.props.class}>
            <Dropdown.Toggle  as={CustomToggle} id="dropdown-custom-components">
                {this.props.title}
            </Dropdown.Toggle>
            <Dropdown.Menu >
                {
                this.GetDropdownItems(this.props.options)
                }
            </Dropdown.Menu>
        </Dropdown>
        )
    }
  }

export default RightDropDown;