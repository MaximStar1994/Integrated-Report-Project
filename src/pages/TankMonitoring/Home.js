import React from 'react'
import Container from 'react-bootstrap/Container'
import SideBar from '../../components/SideBar/SideBarFuelng'
import TMLayout from './TMLayout'
import TMLayout_MD from './TMLayout_MD'
import { withLayoutManager } from '../../Helper/Layout/layout.js'
class TankGauging extends React.Component {
    constructor(props) {
        super(props)
    }
    renderLG() {
        return (
            <>
                <SideBar>
                    <TMLayout />
                </SideBar>
            </>
        )
    }
    renderMD() {
        return (<>
            <TMLayout_MD/>
             </>)
    }
    render() {
        var contents = this.renderLG()
        if (this.props.renderFor === 1 || this.props.renderFor === 2) {
            contents = this.renderMD()
        }
        return (
            <div className="content-inner-all">
                <Container fluid={true} className="justify-content-center">
                    {contents}
                </Container>
            </div>)
    }
}
export default withLayoutManager(TankGauging)