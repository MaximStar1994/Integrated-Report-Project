import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import FolderIcon from '@material-ui/icons/FolderOpen'
import { TextField, Button, FormControl } from '@material-ui/core'
import config from '../../../config/config';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [foldername, setFoldername] = React.useState('');
  const [errors, setErrors] = React.useState(false)
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setFoldername('');
    setOpen(false);
  };

  const handleClick = async (e) => {
    if(foldername){
      setErrors(false)
      await props.createFolder(foldername)
       setOpen(false);
       setFoldername('');
    } else {
      setErrors(true)
    }

  };

  const body = (
    <form noValidate autoComplete="off">
      {/* <FormControl required  > */}

      <div style={modalStyle} className={classes.paper}>
        {errors ? <span style={{ marginRight: '5px', color: 'red' }}> * Folder name required</span> : ''}
        <h6 id="simple-modal-title">Parent Folder : {props.parentfolder ? props.parentfolder : 'KST Fleet'}</h6>
        {/* <h6 id="simple-modal-title">Parent Folder : KST Fleet</h6> */}
        <span style={{ marginRight: '5px' }}>Folder Name :</span>
        <TextField required style={{paddingTop: "5px"}}
          id="foldername"
          name="foldername"
          variant="outlined"
          value={foldername}
          onInput={(e) => {
            var sliceFolderName = e.target.value.toString().slice(0, 12);
            setFoldername(sliceFolderName)
          }}
          onKeyDown={(e) => {
            if(e.key === "Enter") {
              e.preventDefault();
            }
          }}
        />
        <br />
        <Button component="span" style={{ margin: '5%', cursor: 'pointer',backgroundColor: config.KSTColors.MAIN,color: config.KSTColors.WHITE }} onClick={handleClick} >
          Add New Folder
        </Button>
      </div>
      {/* </FormControl> */}
    </form>
  );

  return (
    <div style={{ display: 'flex' }} >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
       {/* <span className="GreyFont1halfrem" style={{ cursor: props.documanagement?'pointer':'not-allowed' }} onClick={handleOpen} ><FolderIcon className="m-2" /> Add New Folder1</span>  */}
      <span className={props.userEditAllowed()?'GreyFont1halfrem':'UserEditableBlock GreyFont1halfrem'} 
        onClick={()=>
          props.userEditAllowed()&&
          handleOpen()
        } ><FolderIcon className='m-2' /> Add New Folder</span> 

    </div>
  );
}
