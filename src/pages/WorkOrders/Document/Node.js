import React from 'react';
import AddBox from '@material-ui/icons/AddBox'
import IndeterminateCheckBox from '@material-ui/icons/IndeterminateCheckBox'
import FolderIcon from '@material-ui/icons/Folder';
const Node = ({ item, hasChildren, level, onToggle, selected, selectFilesById,currentFolderId,parentfolder }) => {
    return(
        <div    style={{ paddingLeft: `${level*30}px`, color: '#707070', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    backgroundColor: (currentFolderId===item.id)?'#e6e6e6': '' }} 
                onClick={()=>{
                // if(hasChildren)
                // else{
                // }               
                onToggle();
                selectFilesById(item.id, item.name);
            }}>    
            <div>{hasChildren===true?selected?<IndeterminateCheckBox/>:<AddBox />:<FolderIcon />}</div>
            <div>{item.name}</div>
        </div>
    )
}
export default Node;