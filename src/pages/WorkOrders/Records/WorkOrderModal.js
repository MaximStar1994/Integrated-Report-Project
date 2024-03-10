import React from 'react';
import Modal from '@material-ui/core/Modal';
import WorkOrderDetail from './WorkOrderContent.js'
import AddWorkOrder from './AddWorkOrder.js'
import WorkOrderFeedback from '../Notification/feedback.js'

export default function SimpleModal(props) {
    const open = props.openModal;

    if (open == false) {
        return (<></>)
    } else {
        let body = (<></>);
        if (props.content == "detail") {
            const row = props.data
            body = (
                <WorkOrderDetail data={row} />
            )
        }
        else if (props.content == "add") {
            body = (
                <AddWorkOrder onClose={props.handleClose} />
            )

        }
        else if (props.content == "feedback") {
            const row = props.data
            body = (
                <WorkOrderFeedback data={row} onClose={props.handleClose} />
            )
        }

        return (
            <div>
                <Modal open={open} onClose={props.handleClose}
                    aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                    {body}
                </Modal>
            </div>
        )
    }





}
