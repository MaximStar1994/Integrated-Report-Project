
import React from 'react';
import Modal from 'react-bootstrap/Modal'

class Popup extends React.Component  {
    render = () => {
        return (
            <Modal show={this.props.show} onHide={() => {this.props.handleClose()}} centered >
                <Modal.Body style={{
                    backgroundColor : "#04384c"
                }}>
                    <span 
                        className="clickable"
                        style={{
                            color : "white",
                            fontSize : "large",
                            position : "absolute",
                            right : "5%"
                        }}
                        onClick={() => {this.props.handleClose()}}
                    >x</span>
                    {this.props.children}
                </Modal.Body>
            </Modal>
        );
    }
}

export default Popup;
