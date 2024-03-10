import React, { useState } from 'react';

import Node from './Node';

const Branch = ({ item, level, selectFilesById,currentFolderId,currentFolderStr }) => {
    const [selected, setSelected] = useState(item.selected ??false);
    const hasChildren = item.subfolders && item.subfolders.length!==0;

    const renderBranches = () => {
        if(hasChildren){
            const newLevel = level+1;

            return item.subfolders.map(child=>{
                return <Branch key={child.id} item={child} level={newLevel} selectFilesById={selectFilesById} currentFolderId={currentFolderId} currentFolderStr={currentFolderStr}/>
            });
        }
        return null;
    }
    const toggleSelected = () => {
        setSelected(selection => !selection);
    }

    return(
        <React.Fragment>
            <Node item={item} selected={selected} hasChildren={hasChildren} level={level} onToggle={toggleSelected} selectFilesById={selectFilesById} currentFolderId={currentFolderId} currentFolderStr={currentFolderStr} />
            {selected && renderBranches()}
        </React.Fragment>
    )
}

export default Branch;