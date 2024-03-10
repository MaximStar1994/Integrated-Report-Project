import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListItemText from '@material-ui/core/ListItemText';
import { withMessageManager } from '../../Helper/Message/MessageRenderer';
// `
// tags : [{
//    name : String
//    group : String
// }]
// onSelectTag : (tagname) => {}
// `
class TagTableGroup extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.ref = React.createRef();
        this.state = {
            test : true
        }
    }
    render(){
        var onSelectTag = this.props.onSelectTag
        return(
            <div >
                {this.props.tags.map((item,i) => {
                    return(
                        <Row key={i} >
                            <Col className="clickable emphasisClickable" 
                                style={{border : "1px solid #f6f6f6", backgroundColor : "white", marginLeft: '15px', marginRight: '10px'}}
                                onClick={() => {
                                    if(this.props.noofChosedTags<16)
                                        onSelectTag(item)
                                    else{
                                        this.props.setMessages([{type : "danger", message : 'Max 16 tags can be selected!'}]);
                                    }
                                }}
                            >
                                <ListItemText primary={item.name} className="taglist" style={{paddingLeft : "15px"}}/>
                            </Col>
                        </Row>
                    )
                })}
            </div>
        )
    }
}

export default withMessageManager(TagTableGroup);