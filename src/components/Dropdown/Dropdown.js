import React from 'react';
import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown'

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => {
    const [carret, setCarret] = useState('\u25BC');
    return(
    <div style={{width: "100%", height : "100%"}} 
        ref={ref}
        onClick={e => {
        e.preventDefault();
        onClick(e)
      }} className="clickable">
        <div style={{float: "left", color: "rgb(255,255,255)"}}>{children}</div>
        <span style={{float: "right", color: "rgb(255,255,255)", fontSize: "small" }}>
            {carret}
        </span>
    </div>
    )
})

// Props
// title = string
// options= { key : string}
// id = string
// onSelect = (key, event) => {}
class DropDown extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = { dropdownToggled : false};
    }
    OnSelectItem = (key, event) => {
      this.setState({dropdownToggled: false});
      this.props.onSelect(key, event)
    }
    ToggleDropDown = (e) => {
      var newState = this.state
      newState.dropdownToggled = !newState.dropdownToggled
      this.setState(newState)
    }
    GetDropdownItems = () => {
        var items = [];
        this.props.options.forEach(element=> {
            items.push(<Dropdown.Item key={element[this.props.id]} eventKey={element[this.props.id]} onSelect={this.OnSelectItem}>{element.name}</Dropdown.Item>);
        })
        return items
    }
    render() { return (
        <Dropdown id={this.props.id} style={{height : "100%"}}>
            <Dropdown.Toggle  as={CustomToggle} id="dropdown-custom-components" 
                              isToggled={this.state.dropdownToggled} 
                              toggleDropDown={this.ToggleDropDown}>
                {this.props.title}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {
                  this.GetDropdownItems()
                }
            </Dropdown.Menu>
        </Dropdown>
    )}
}

export default DropDown;
