import React, { useState } from "react";
import { Collapse } from '@material-ui/core';
import AiOutlineFolder from '@material-ui/icons/Folder';
import AddBox from '@material-ui/icons/AddBox'
import IndeterminateCheckBox from '@material-ui/icons/IndeterminateCheckBox'
import "./layout.css";

const FILE_ICONS = {
    js: <AiOutlineFolder />,
    css: <AiOutlineFolder />,
    html: <AiOutlineFolder />,
    jsx: <AiOutlineFolder />
};

const File = ({ name }) => {
    let ext = name.split(".")[1];

    return (
        <div className="files" >
            {FILE_ICONS[ext]}
            <span>{name}</span>
        </div>
    );
};



const Folder = ({ name, children, folderId, selectFiles, isOpen,updateState, parentFolders, childFolders,shouldDisplay}) => {


    const handleToggle = e => {
        e.preventDefault();
        var folderIdst = `folder` + folderId
        updateState(folderIdst,childFolders,parentFolders)
        selectFiles(folderId, name)

    };
     if (!shouldDisplay[[`folder` +folderId]] && folderId != undefined) {
         return (<></>)
     }
    return (
        <div className="pl20" >
            <div className={`folderlabel xspan ${isOpen[[`folder` +folderId]] ? "folderselected" : ""}`} name={folderId} onClick={handleToggle}>
                 {isOpen[[`folder` +folderId]] ? <IndeterminateCheckBox /> : <AddBox />}  
                 {/* <IndeterminateCheckBox />  */}
                <span>{name}{isOpen[[`folder` +folderId]]}</span>
            </div>
            <div 
                 style={{ height: isOpen[[`folder` +folderId]] || folderId == undefined ? "auto" : "0", overflow: 'hidden' }}
            >
                {children}
            </div>
        </div>
    );
};

const Tree = ({ children }) => {

    // return <div style={{ lineHeight: '0.5' }} >{children}</div>;

    return <div className="scrollable" style={{ lineHeight: '0' , overflowY : 'scroll'}} >{children}</div>;

};


Tree.File = File;
Tree.Folder = Folder;

const highlight = { backgroundColor: '#007bff', color: '#dee2e6' }

export default class List extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: [],
            shouldDisplay : {
                folderHome : true
            },
        }
    }

    updateState = (folderId,childFolders,parentFolders) => {
        var isOpen = this.state.isOpen;
        var f ={}
        if (isOpen[[folderId]]!=undefined) { 
            f = !isOpen[[folderId]]
        }else{
            f = true
        }
        let openList = { 
            [folderId]:f 
        };
        let newList = { 
            folderHome : true,
            [folderId]:f 
        };
        if (childFolders instanceof Array) {
            childFolders.forEach(folderId => {
                newList[`folder${folderId}`] = f
            })
        }
        if (parentFolders instanceof Array) {
            parentFolders.forEach(folderId => {
                newList[`folder${folderId}`] = f
            })
        }
        this.setState({ isOpen: openList, shouldDisplay : newList });

    }

    selectFiles = (data, name) => {
        this.props.selectFilesById(data, name)
    }

    createFolder = (data, currentfolderId, parentFolderIds = []) => {
        var parentFolder = JSON.parse(JSON.stringify(parentFolderIds))
        var t = []
        var silibingIds = data.map(row => row.id)
        
        parentFolder.concat(silibingIds)
        data.forEach(element => {
            var folder = []
            if (element.subfolders.length > 0) {
                parentFolder.push(element.id)
                var child = this.createFolder(element.subfolders, currentfolderId, parentFolder)
                folder.push(child)
            }
            var childFolders = element.subfolders.map(elm => elm.id )
            //var childFolders = folder
            var parentFolders = parentFolder
            var f = (<Tree.Folder key={Math.random()} parentFolders={parentFolders} childFolders={childFolders} name={element.name} folderId={element.id}
             selectFiles={this.selectFiles} shouldDisplay={this.state.shouldDisplay} isOpen={this.state.isOpen} updateState={this.updateState}  >{folder}</Tree.Folder>)

            t.push(f)
        });
        return t
    }

    render() {
        if (this.props.data == undefined) {
            return (<></>)
        }
        var currentFolderId = this.props.currentFolderId
        return (
            <div className="folderList" >
                <Tree>
                    <Tree.Folder name="KST FLEET" selectFiles={this.selectFiles} 
                    childFolders={this.props.data.map(folder => folder.id)} 
                    shouldDisplay={this.state.shouldDisplay} 
                    isOpen={this.state.isOpen} updateState={this.updateState}    >
                        {this.createFolder(this.props.data, currentFolderId)}
                    </Tree.Folder>
                </Tree>

            </div>
        );
    }

}
