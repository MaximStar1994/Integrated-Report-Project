import React from 'react'
import ReactDOM from 'react-dom';
import ScrollingApp from './ScrollingCards'

class ScrollingItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: this.props.list
        }
    }
    componentWillReceiveProps(newProps) {
        this.setState({list: newProps.list});
    }
    render() {
        const list = this.state.list;
        return (
            <div style={{ width: "90vw", height: "25vh" }}><ScrollingApp list={list} /></div>

        )
    }
}
export default ScrollingItem


