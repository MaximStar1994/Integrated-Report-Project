import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import '../../css/App.css';
// `
// groupName : String
// items : [{
//     name : String
// }]
// onClickItem : (Item) => {}
// `
import './MyExpandableGroup.css'
class ExpandableGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expanded : props.defaultExpanded
        }
    }
    render() {
        return(
            <ExpansionPanel TransitionProps={{ mountOnEnter: true }} className={this.props.className ? this.props.className : ""} 
            expanded={this.state.expanded} onClick={()=>{this.setState({expanded : !this.state.expanded})}}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    {this.props.groupName}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{padding : "0"}}>
                    {
                        this.state.expanded && (
                            <List style={{width : "100%"}}>
                                {this.props.items.map((item,i) => {
                                    console.log("rendering" , i)
                                    return(
                                        <div key={i} >
                                        <ListItem button onClick={() => {this.props.onClickItem(item)}}>
                                            <ListItemText primary={item.name} style={{paddingLeft : "15px"}}/>
                                        </ListItem>
                                        <Divider />
                                        </div>
                                    )
                                })}
                            </List>
                        )
                    }
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

export default ExpandableGroup;