const ServiceManager = require('../services/ServiceManager.js')
const helper = require('../helper/helper')
const path = require('path');
const fs = require('fs');
const { uuid } = require('uuidv4');
const config = require("../config/config.js");
"use strict";
/*
folder : {
    id : int,
    name : String,
    parentFolderId : int,
}
*/
class documentManagementApi {
    constructor() {
        this.serviceManager = new ServiceManager()
    }
   
    async ListAllFolders(vesselId){
        var documentService = this.serviceManager.GetDocumentManagementService()
        return await documentService.GetAllFolders(vesselId.id);
    }

    async GetFilesInFolder(folder,folderName, callback) {
        var documentService = this.serviceManager.GetDocumentManagementService()
        return await documentService.GetFilesInFolder(folder.id,folderName);

    }

    GetFullFolderPath(user,folderId, callback) {
        var documentService = this.serviceManager.GetDocumentManagementService()
       // documentService.OwnsFolder(user, {id : folderId}, (ownsFolder) => {
            //if (ownsFolder) {
                documentService.GetFullFolderPath(folderId, (fullPath) => {
                    callback(fullPath, null)
                })
            //} else {
            //    callback(null, "User not authorized to access this folder")
            //    return
           // }
       // })
        
    }

    async DeleteFile(files, callback) {
        var documentService = this.serviceManager.GetDocumentManagementService()

        return await documentService.DeleteFiles(files)

       /* documentService.GetFile(fileId, (file) => {
            if (file == null) {
                callback({fileId : fileId}, null)
                return
            }
            documentService.OwnsFolder(user, { id : file.folderId }, (ownsFolder) => {
                if(ownsFolder) {
                    documentService.DeleteFile(fileId, callback)
                } else {
                    callback(null, "User has no permission to this folder")
                }
            })
        })*/
    }


    async PostFolder( folder, callback) {
        if (helper.IsEmpty(folder.name)) {
            callback(null, "Folder name cannot empty")
            return
        }
        folder.name = folder.name.trim()
        folder.name = folder.name.replace(/ /g,'_')
        if (!helper.IsValidFileName(folder.name)) {
            callback(null, "Folder name is not valid")
            return
        }
        var documentService = this.serviceManager.GetDocumentManagementService()
        // get folder
        if (helper.IsEmpty(folder.id)) {
            await this.CreateFolder(folder, callback)
        } 
        /*else {
            documentService.GetFolder(folder.id, (folder) => {
                if (folder == null) {
                    this.CreateFolder(user,folder, callback)
                } else {
                    this.UpdateFolder(user,folder, callback)
                }
            })
        }*/
    }

    UpdateFolder(user, folder, callback) {
        var documentService = this.serviceManager.GetDocumentApi()
        if (helper.IsEmpty(folder.parentFolderId)) {
            documentService.UpdateFolder(folder, callback)
        } else {
            documentService.OwnsFolder(user, {id: folder.parentFolderId}, (ownsFolder) => {
                if (ownsFolder) {
                    documentService.UpdateFolder(folder, callback)
                } else {
                    callback(null, "User has no permission to this folder")
                    return
                }
            })
        }
    }
    async CreateFolder(folder, callback) {
        var documentService = this.serviceManager.GetDocumentManagementService()
        return await documentService.CreateFolder(folder, callback)
        /* if (helper.IsEmpty(folder.parentFolderId)) {
            documentService.CreateFolder(folder, callback)
        } 
        /*else {
            documentService.OwnsFolder(user, {id: folder.parentFolderId}, (ownsFolder) => {
                if (ownsFolder) {
                    documentService.CreateFolder(folder, user, callback)
                } else {
                    callback(null, "User has no permission to this folder")
                    return
                }
            })
        }*/
    }


    PostFile(tempFilePath, fileName, folderId, callback) {
        var documentService = this.serviceManager.GetDocumentManagementService()
        //documentService.OwnsFolder(user, {id : folderId}, (ownsFolder) => {
            const buffer = fs.readFileSync(tempFilePath);
            try {
              
                documentService.GetFullFolderPath(folderId, (fullFolderPath) => {
                   // let filePath = '\KST Fleet\'+fullFolderPath
                    let dirPath = path.join('public','KST Fleet',fullFolderPath)
                    documentService.GetFilesInFolder_upload(folderId, (files) => {
                        var dbFile = files.find(file => file.name === fileName)
                        if (dbFile !== undefined) {
                            callback({fileId : dbFile.id},null)
                        } else {
                            const relativeDir = uuid()
                            dirPath = path.join(dirPath,relativeDir)
                            let filePath = path.join(dirPath,fileName)
                            var file = {
                                name : fileName,
                                relativeDir : relativeDir,
                                filePath : filePath,
                            }
                            documentService.CreateFile(file, folderId, callback)
                        }
                        var finalPath = path.join(config.kstConfig.fileLocationWithoutPublic,dirPath);
                        fs.mkdirSync(finalPath, { recursive: true });
                        fs.writeFileSync(path.join(finalPath,fileName), buffer);
                        fs.unlink(tempFilePath,()=>{})
                    })
                })
                
            } catch (error) {
                fs.unlink(tempFilePath,()=>{})
                callback(null, error)
            }
     
    }

    async DeleteFolder(folder, callback) {
        var documentService = this.serviceManager.GetDocumentManagementService()
        await documentService.DeleteFolder(folder.id, callback)
        /*documentService.OwnsFolder(user, folder, (ownsFolder) => {
            if (ownsFolder) {
                documentService.DeleteFolder(folder.id, callback)
            } else {
                callback(null, "User has no permission to this folder")
            }
        })*/
    }
    
    
    
}
module.exports = documentManagementApi;
