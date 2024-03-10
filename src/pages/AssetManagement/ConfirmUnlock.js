import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmUnlock = props => {
    return (
      <Modal
        show={props.show}
        onHide={props.hide}
        size="lg"
        aria-labelledby="ConfirmSubmitModal"
        centered
      >
        <Modal.Body style={{ color: '#04588e' }}>
            <div style={{ textAlign: 'center', marginTop: '40px', fontSize: 'larger', lineHeight: 'normal' }}>
              There could be saved information on the other device that you may want to continue logging,
              Choose 'Unlock' only if you decide to use this device for a new log.
            </div>
            <div style={{ textAlign: 'center', marginTop: '40px', lineHeight: 'normal' }}>
                Note: Submission from multiple device will result in multiple records of same day.
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '40px' }}>
                <Button onClick={props.hide} style={{ backgroundColor: 'white', color: '#04588e', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '20px', paddingRight: '20px' }}>
                  Cancel
                </Button>
                <Button
                    style={{ backgroundColor: '#04588e', color: 'white', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '20px', paddingRight: '20px' }} 
                    disabled={props.confirmStatus===true} 
                    onClick={e=>{
                    props.setConfirmStatus(true); 
                    props.submit();  
                    props.setConfirmStatus(false);
                    props.hide(); 
                }}>
                    Unlock
                </Button>
            </div>
        </Modal.Body>
      </Modal>
    );
}

export default ConfirmUnlock;
  