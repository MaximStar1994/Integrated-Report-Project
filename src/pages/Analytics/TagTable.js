import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import sortUp from '../../assets/Icon/sortUp.png'
import sortDown from '../../assets/Icon/sortDown.png'
import TableGroup from './TagTableGroup'
// `
// tags : {
//     groupName : [tag]
// }
// onSelectTag : (tagname) => {}
// `
import './TrendingPage.css'
class TagTable extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.ref = React.createRef();
        this.state = {
            showI : -1,
            showScreener : false
        }
    }
    handleScroll = (e, key) => {
        const bottom = e.target.scrollHeight - Math.ceil(e.target.scrollTop) - e.target.clientHeight < 100;
        if (bottom) { 
            var sliceIndex = this.state[key] ? this.state[key] : 200
            if (sliceIndex === this.props.tags[key].length) {
                return
            } else {
                sliceIndex += 200
                sliceIndex = Math.min(sliceIndex, this.props.tags[key].length)
                var oldState = this.state
                oldState[key] = sliceIndex
                this.setState(oldState)
            }
        }
    }
    render() {
        var tags = this.props.tags
        var onSelectTag = this.props.onSelectTag
        var noofChosedTags = this.props.noofChosedTags
        var that = this
        return (
            <div ref={(ref) => {this.ref = ref}} style={this.props.style ? this.props.style : {}} >
            {
                Object.keys(tags).map(function(key, index) {
                    var sliceIndex = that.state[key] ? that.state[key] : 200
                    return(
                        <Row key={index}>
                            <Col>
                                <Row>
                                    <Col 
                                    className = "clickable emphasisClickable"
                                    // style={{border : "1px solid #f6f6f6"}}
                                    onClick={()=>{
                                        that.setState({showI : that.state.showI === index ? -1 : index})
                                    }}>
                                        <div style={{display : "flex", border : "1px solid #f6f6f6", backgroundColor : "white", color: '#04588e' }} >
                                            <div style={{padding : "15px", fontSize : "1.2rem"}}>
                                                {key}
                                            </div>
                                            <div style={{marginLeft : 'auto', display : "flex", paddingRight : "15px", alignItems : "center"}}><img src={that.state.showI === index ? sortUp : sortDown} /></div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="scrollable" style={{maxHeight : "50vh", overflowY : "scroll", overflowX : "hidden"}}
                                    id={key}
                                    onScroll={(e) => {that.handleScroll(e,key)}}>
                                        {that.state.showI === index && (
                                            <TableGroup onSelectTag={onSelectTag} tags={tags[key].slice(0,sliceIndex)} noofChosedTags={noofChosedTags}/>
                                        )}
                                    </Col>
                                </Row>
                            </Col>
                        </Row> 
                    )
                })
            }
            </div>
        )
    }
}

export default TagTable;