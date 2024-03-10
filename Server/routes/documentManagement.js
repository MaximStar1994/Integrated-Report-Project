const express = require("express");
const router = express.Router();
var zip = require('express-zip');

const helper = require('../helper/helper')
const DocumentManagementApi = require('../api/documentManagementApi')
const documentManagementApi = new DocumentManagementApi()
const multiparty = require('multiparty');
const config = require('../config/config');
const { info, err: ErrorLog } = require("../common/log");

module.exports = function(api) {
    router.get("/document/folder/list/:vesselId", async (req, res) => {
        info("Document folder list by vessel ID api starts");
        try{
            var vesselId = req.params.vesselId
            let rtnObj = await documentManagementApi.ListAllFolders({id : vesselId});
            helper.callback(res, rtnObj, null);
            info("Document folder list by vessel ID api ends");
        } catch (err) {
            ErrorLog(`Document folder list by vessel ID error block : ${err.message}`);
            helper.callback(res, null,err)
        }
    })

    
    router.get("/document/folder/:folderId/:foldername", async (req, res) => {
        info("Document folder list by folder name api starts");
        var folderId = req.params.folderId
        var folderName = req.params.foldername
       
        helper.authorize(res,req, async(user)=>{
            try{
                let rtnObj = await documentManagementApi.GetFilesInFolder({id : folderId},{foldername : folderName});
                helper.callback(res, rtnObj, null);
                info("Document folder list by folder name api ends");

            } catch (err) {
                ErrorLog(`Document folder list by folder name error block : ${err.message}`);
                helper.callback(res, null,err)
            }
        });

    })

    /*
        files : [{path : String, name : String}]
    */
    router.post("/report/download", (req, res) => {
        info("report download api starts");
        var files = req.body.files
        helper.authorize(res,req, async(user)=>{
            files.forEach(e=>{
                e.path=config.kstConfig.fileLocationWithoutPublic + e.path;
                e.path = e.path.replace(/\\/g,"/")
            });
            res.zip(files);
        })
    })


    router.post("/document/file/deleteFiles", async (req, res) => {
        info("Document delete file api starts");
        var files = req.body.files;
        //let selectedFiles = req.body.files;
        helper.authorize(res,req, async(user)=>{
            try{
                let result = await documentManagementApi.DeleteFile( files);
                helper.callback(res, [], null);
                info("Document delete file api ends");
            } catch (err) {
                ErrorLog(`Document delete file error block : ${err.message}`);
                helper.callback(res, null,err)
            }
        });
    })
    /////////////////


    /*
        name : String
        parentFolderId : Int?
        id : Int?
    */
   
    router.post("/document/folder", async (req, res) => {
        info("Document folder api starts");
        var folder = req.body
        helper.authorize(res,req, async(user)=>{
            await documentManagementApi.PostFolder(folder,(val,err) => {
                helper.callback(res,val,err)
            }) 
        })
      
    })
   

   // router.post("/document/folder/deleteFolder/:folderId", (req,res) => {
    router.post("/document/folder/deleteFolder", async (req, res) => {
        info("Document folder delete folder api starts");
        var folderId = req.body.folder
        console.log('Routes--Delete--',folderId)
        helper.authorize(res,req, async(user) => {
           await  documentManagementApi.DeleteFolder({ id : folderId}, (val,err) => {
                helper.callback(res, val, err)
            })
        })
    })  

 
    router.delete("/document/file/:fileId", (req, res) => {
        info("Document delete file by fileID api starts");
        var fileId = req.params.fileId
        helper.authorize(res,req, (user) => {
            if (user.apps instanceof Array && user.apps.includes(config.fuellngConfig.apps.DOCUMENTMANAGEMENT)) {
                documentManagementApi.DeleteFile(user, fileId, (val,err) => {
                    helper.callback(res, val, err)
                    info("Document delete file by fileID api ends");
                })
            } else {
                ErrorLog("Document delete file by fileID api error block : User unauthorized to perform this operation");
                helper.callback(res,null,"User unauthorized to perform this operation")
            }
        })
    })

   

    router.post("/document/file/:folderId/file/upload", (req, res) => {
        info("Document file upload api starts");
        var folderId = req.params.folderId
        const form = new multiparty.Form();
        helper.authorize(res,req, (user) => {
            //if (user.apps instanceof Array && user.apps.includes(config.fuellngConfig.apps.DOCUMENTMANAGEMENT)) {
                form.parse(req, async (error, fields, files) => {
                    if (folderId == null) {
                        ErrorLog("Document file upload api error block : Folder Id Missing");
                        res.send({success : false, error : "Folder Id Missing"})
                        return  
                    }
                    if (error) {
                        res.send({success : false, error : error})
                        return  
                    };
                    const filepath = files.file[0].path;
                    const fileName = files.file[0].originalFilename;
                    documentManagementApi.PostFile(filepath, fileName, folderId, (val,err) => {
                        helper.callback(res,val,err)
                    })
                });
           // } 
           // else {
            //    helper.callback(res,null,"User unauthorized to perform this operation")
            //}
        })
    })
    
    return router
}