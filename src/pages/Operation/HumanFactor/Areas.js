import React from 'react'
import { Col } from 'react-bootstrap';
import { transparent } from 'material-ui/styles/colors';
import './Areas.css'

class Areas extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            AreaList: props.AreaList
        }
    }



    render() {

        const AreaList = this.props.AreaList
        // console.log("AreaList" + JSON.stringify(AreaList))
        var cols = []
        AreaList.forEach(element => {
            cols.push(<Col xs md lg="3" key={element.key}>
                <div style={{ textAlign: 'center', color:'#0b8dbe'}}>{element.title}</div>
                <div className="img-overlay-wrap">
                    <svg style={{ width: '100%', height: '100%' }} >
                        <circle cx="50%" cy="50%" r="28%" fill="#0977a2" stroke="red" strokeWidth="3" />
                        <text x="47%" y="55%" fontSize="2em" fill="#fff">{element.Number}</text>
                    </svg>
                    <img src={element.IconUrl}/>
                </div>


            </Col >)
        });

        return (
            <>{cols}</>
        )
    }

}
export default Areas