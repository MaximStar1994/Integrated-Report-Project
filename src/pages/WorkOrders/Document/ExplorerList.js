import React, { Component } from 'react';
import Branch from './Branch';
class ExplorerList extends Component{
    render(){
        return(
            <React.Fragment>
                {this.props.data.map(item => <Branch key={item.id} item={item} level={0} selectFilesById={this.props.selectFilesById} currentFolderId={this.props.currentFolderId} parentfolder={this.props.currentFolderStr} />)}
            </React.Fragment>
        );
    }
}

export default ExplorerList;