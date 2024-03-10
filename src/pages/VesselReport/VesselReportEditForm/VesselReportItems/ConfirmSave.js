import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmSave = props => {
    return (
      <Modal
        show={props.show}
        onHide={props.hide}
        size="lg"
        aria-labelledby="ConfirmSubmitModal"
        centered
      >
        <Modal.Header style={{ backgroundColor: '#e6e6e6' }}>
          <Modal.Title id="ConfirmSaveModal">
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#04588e' }}>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>Please check crew names before saving the page.</div>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>Are you sure you want to save this page?</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '40px' }}>
              <Button onClick={props.hide} style={{ backgroundColor: 'white', color: '#04588e', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '20px', paddingRight: '20px' }}>Cancel</Button>
              <Button
                style={{ backgroundColor: '#04588e', color: 'white', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '20px', paddingRight: '20px' }} 
                disabled={props.savingStatus===true} 
                onClick={e=>{
                  props.setSavingStatus(true); 
                  props.save();  
                  props.hide(); 
                  props.setSavingStatus(false);
                }}>
                  Save
                </Button>
            </div>
        </Modal.Body>
      </Modal>
    );
}

export default ConfirmSave;
  