import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmSubmit = props => {
    return (
      <Modal
        show={props.show}
        onHide={props.hide}
        size="lg"
        aria-labelledby="ConfirmSubmitModal"
        centered
      >
        <Modal.Header style={{ backgroundColor: '#e6e6e6' }}>
          <Modal.Title id="ConfirmSubmitModal">
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#04588e' }}>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>Once Submitted, the information provided can no longer be edited.</div>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>Are you sure you want to submit this page?</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '40px' }}>
              <Button onClick={props.hide} style={{ backgroundColor: 'white', color: '#04588e', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '20px', paddingRight: '20px' }}>Cancel</Button>
              <Button
                style={{ backgroundColor: '#04588e', color: 'white', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '20px', paddingRight: '20px' }} 
                disabled={props.submitStatus===true} 
                onClick={e=>{
                  props.setSubmitStatus(true); 
                  props.submit(e);  
                  props.hide(); 
                  props.setSubmitStatus(false);
                }}>
                  Submit
                </Button>
            </div>
        </Modal.Body>
      </Modal>
    );
}

export default ConfirmSubmit;
  