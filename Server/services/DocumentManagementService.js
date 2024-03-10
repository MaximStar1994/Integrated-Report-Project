const config = require('../config/config')
const helperWithoutApi = require('../helper/helperWithoutApi')
const {interfaceObj} = require("./interfaces/PostGreSQLInterface")
var moment = require('moment');
"use strict";
const path = require('path');
const fs = require('fs');


const SUBFOLDERS = [
    'vesselReport',
    'vesselDisinfection',
    'vesselDowntime',
    'crewTemperature',
]

const EMPTY_SUBFOLDERS = []

const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const dirPath = path.join(config.kstConfig.filesLocation,"\\Missing_Submissions","")

class DocumentManagementService {
    constructor() {
        this.sqlInterface = interfaceObj
    }
    
    async GetAllFolders(vesselId,callback) {
        
        let rtnObj = [];

        let vesselObj = [];
        let fleetObj = [];
        let isVesselAccount = true; 
        if(vesselId === 'undefined' || vesselId == null || vesselId == '' ){
            isVesselAccount = false
        }
        let availableMonths
        
        var custFolderData={}
       // if(isVesselAccount===false){ 
            custFolderData = await new Promise((res, rej)=>{
                this.GetKSTFleetFolders(function(data) {
                     res(data);
                 })
            });

            if(custFolderData && custFolderData[0].subfolders.length > 0) {
                custFolderData[0].subfolders.sort(function(a,b) {
                    var folderNameA = a.name.toLowerCase();
                    var folderNameB = b.name.toLowerCase();
                    if(folderNameA < folderNameB) {return -1};
                    if(folderNameA > folderNameB) {return 1};
                    return 0;
                });
            }
            rtnObj.push(custFolderData[0]) 
        //}
       

       //For Folders Created by Customers
      /* if(isVesselAccount===false){
            custFolderList = await this.sqlInterface.PerformQueryPromise(`
            SELECT p.name, p.id
            FROM ${config.kstConfig.sqlTables.FOLDER} AS p 
            WHERE p.parentFolderId IS NULL
            order by id
        `,[])
        }
        if (custFolderList instanceof Array && custFolderList.length > 0) {
            let tmpSubfolders = [];
            for(let i=0; i<custFolderList.length; i++){
               fleetObj.push({
                    id         : custFolderList[i].id,
                    name       : custFolderList[i].name,
                    subfolders :tmpSubfolders,
                })
                tmpSubfolders = [];
            }
        }
        rtnObj.push({
            id         : 1000000002,
            name       : 'KST Fleet',
            subfolders : fleetObj,
        }) 
        */

        let tmpSubfolders = [];
            tmpSubfolders.push({
                id: 0,
                name: 'Report',
                vesselId: 0,
                subfolders: []
            })
        

        //let tmpSubfolders = [];
            vesselObj.push({
            id         : 0,
            name       : 'missingSubmission',
            subfolders :tmpSubfolders,
            })
            tmpSubfolders = [];
        

        //Crew Work and rest Hours
        if(isVesselAccount===false){
            availableMonths = await this.sqlInterface.PerformQueryPromise(`
            select distinct month,year from crew_work_rest order by year desc,month desc 
        `,[])
        }
        
        if (availableMonths instanceof Array && availableMonths.length > 0) {
            
            let tmpSubfolders = [];
       
            for(let i=0; i<availableMonths.length; i++){
                tmpSubfolders.push({
                    id: 0+'-'+i,
                    name: monthsList[availableMonths[i].month]+'_'+availableMonths[i].year,
                    vesselId: 0,
                    subfolders: []
                })
            }
            vesselObj.push({
                id         : 1,
                name       : 'crewWorkAndRestHour',
                subfolders :tmpSubfolders,
            })
            tmpSubfolders = [];
        } 

        let allFolderList
        //For 25 vessels
        if(isVesselAccount===false){
            allFolderList = await this.sqlInterface.PerformQueryPromise(`
            SELECT p.name, p.vessel_id
            FROM ${config.kstConfig.sqlTables.VESSEL} AS p 
            order by vessel_id
            `,[])
        }
        else
        {
            allFolderList = await this.sqlInterface.PerformQueryPromise(`
            SELECT p.name, p.vessel_id
            FROM ${config.kstConfig.sqlTables.VESSEL} AS p where p.vessel_id = $1
            order by vessel_id
            `,[vesselId])
        }
         
        if (allFolderList instanceof Array && allFolderList.length > 0) {
            let tmpSubfolders = [];
           
            for(let i=0; i<allFolderList.length; i++){
                for(let j=0; j<4; j++){
                    tmpSubfolders.push({
                       id: allFolderList[i].vessel_id+'-'+j,
                       name: SUBFOLDERS[j],
                       vesselId: allFolderList[i].vessel_id,
                       subfolders: []
                   })
                }

                vesselObj.push({
                    id         : allFolderList[i].vessel_id,
                    name       : allFolderList[i].name,
                    subfolders :tmpSubfolders,
                })
                // vesselObj.push({
                //     id         : 0,
                //     name       : 'missionSubmission',
                //     subfolders :tmpSubfolders,
                // })
                tmpSubfolders = [];

            }
        }

        rtnObj.push({
            id         : 100001,
            name       : 'KST Vessel Data',
            subfolders :vesselObj,
        }) 
        return rtnObj


    }

    

    GetKSTFleetFolders(callback) {
      
        this.sqlInterface.PerformQuery(`
        SELECT p.name, p.id
        FROM ${config.kstConfig.sqlTables.FOLDER} AS p
        WHERE p.parentfolderid IS NULL
        `,[],(rows,err) => {
            if (rows instanceof Array && rows.length > 0) {
                var folders = []
                var queries = rows.length
                rows.forEach(row => {
                    this.GetWholeFolderRoot(row.id, (fullFolder) => {
                        folders.push(fullFolder)
                        queries -= 1
                        if (queries == 0) { 
                            callback(folders,null) 
                        }
                    },{name : row.name, id: row.id, subfolders : []})
                })
            } else {
                callback([],err)
            }
        })
        
    }

   async GetFilesInFolder(folder,folderName, callback) {
        var folderidSplit = folder.split("-");
        let fileList = []
        
        if(folderidSplit.length >1)
        {
            if(folderName.foldername === 'vesselReport')
            {
                let columns ='form_id AS id,form_date AS createddate,file_path AS fullpath,report_date AS reportDate,shift'
                fileList  = await this.GetFilesfromDB(folderidSplit[0],columns,config.kstConfig.sqlTables.VESSELREPORTFORM,'form_date','vesselReport')
            }
            else if(folderName.foldername === 'vesselDowntime')
            {
                let columns ='event_id AS id,breakdown_datetime AS createddate,file_path AS fullpath,is_redundant as redundant'
                fileList  = await this.GetFilesfromDB(folderidSplit[0],columns,config.kstConfig.sqlTables.VESSELBREAKDOWNEVENT,'breakdown_datetime','vesselDowntime')
            }
            else if(folderName.foldername === 'crewTemperature')
            {
                let columns ='record_id AS id,date_submitted AS createddate,file_path AS fullpath'
                fileList  = await this.GetFilesfromDB(folderidSplit[0],columns,config.kstConfig.sqlTables.TEMPERATURELOG,'date_submitted','crewTemperature')
            }
            else if(folderName.foldername === 'vesselDisinfection')
            {
                let columns ='record_id AS id,date_submitted AS createddate,file_path AS fullpath'
                fileList  = dirPath
            }
            //else if(folderName.foldername === 'crewWorkAndRestHour')
            else 
            {
                console.log("Folder Name", folderName)
                let columns ='form_id AS id,date_submitted AS createddate,file_path AS fullpath,vessel_name AS vesselname,crew_name as crewname,employee_no as empno'
                fileList  = await this.GetCrewRestAndWork_Files(folderidSplit[0],columns,config.kstConfig.sqlTables.CREWWORKREST,'date_submitted','crewWorkAndRestHour',folderName.foldername)
            }
           
        }
        else
        {
            fileList  = await this.GetFiles_KSTFleetFolder(folder)
        }
        return fileList
    }

    async GetFilesfromDB(vesselId,columns,tblName,orderbyCol,reportName) {
        let tmpRelativePath
        let vesselName
        let vesselReportForms
        let dblog = await this.sqlInterface.PerformQueryPromise(`
            SELECT  name 
            FROM ${config.kstConfig.sqlTables.VESSEL} 
            WHERE vessel_id=$1   
            `,[vesselId]) 
        if (dblog instanceof Array && dblog.length > 0) {
            vesselName = dblog[0].name
        } 
       
        if(reportName === 'vesselReport')
        {
            vesselReportForms = await this.sqlInterface.PerformQueryPromise(`
                SELECT form_id AS id,form_date AS createddate,file_path AS fullpath,report_date AS reportDate,shift, is_backdated AS backdated, is_offline as offline
                FROM ${tblName} 
                WHERE vessel_id=$1  AND (delete_flag is null or delete_flag='N') 
                UNION ALL 
                SELECT  form_id AS id,form_date AS createddate,file_path AS fullpath,report_date AS reportDate,'0' as shift, is_backdated AS backdated, is_offline as offline
                FROM daily_log_form 
                WHERE vessel_id=$1 AND (delete_flag is null or delete_flag='N')
                ORDER BY 2  DESC
            `,[vesselId])
        }
        else{
            vesselReportForms = await this.sqlInterface.PerformQueryPromise(`
            SELECT   ${columns} 
            FROM ${tblName} 
            WHERE vessel_id=$1  AND (delete_flag is null or delete_flag='N')  
            ORDER BY ${orderbyCol}  DESC
            `,[vesselId])
        }

       
        return vesselReportForms.map(dbform => {
            let relativeDir
            let displayName

            if(dbform.fullpath !=null)
            {
                tmpRelativePath = dbform.fullpath.split('/');
                relativeDir = tmpRelativePath[ tmpRelativePath.length -2];
                if(reportName === 'vesselReport')
                {
                    //VesselReport_2021Nov17_AM_(VesselName).pdf
                     //VesselReport_2021Nov17_DL_(VesselName).pdf Daily LOG
                    if(dbform.shift ===1)
                    {
                        displayName = reportName +'_'+ moment(dbform.reportdate, 'DD-MM-YYYY').format("DDMMMYYYY")  +'_AM_'+ vesselName +'.pdf'
                    }
                    else if(dbform.shift ===2)
                    {
                        displayName = reportName +'_'+ moment(dbform.reportdate, 'DD-MM-YYYY').format("DDMMMYYYY")  +'_PM_'+ vesselName +'.pdf'
                    }
                    else if(dbform.shift ===0)
                    {
                        displayName = reportName +'_'+ moment(dbform.reportdate, 'DD-MM-YYYY').format("DDMMMYYYY")  +'_DL_'+ vesselName +'.pdf'
                    }
                }
                else if (reportName === 'missionSubmission')
                {
                    displayName = 'missing-submission' +'_'+ moment(dbform.createddate, 'DD-MM-YYYY').format("DDMMMYYYY") +'.pdf'
                }
                else
                {
                    displayName = 'missing-submission' +'_'+ moment(dbform.createddate, 'DD-MM-YYYY').format("DDMMMYYYY")  +'_'+ vesselName +'.pdf'
                }
                return {
                    id : dbform.id,
                    createddate : dbform.createddate,
                    fullPath : dbform.fullpath+'/'+displayName,
                   // name : tmpRelativePath[ tmpRelativePath.length -1],
                    relativeDir: tmpRelativePath[ tmpRelativePath.length -2],
                    name : displayName,
                    backdated: dbform.backdated,
                    offline: dbform.offline,
                    redundant: dbform.redundant
                }
            }
            else{
                return {
                    id : null,
                    createddate : null,
                    fullPath : null,
                   // name : null,
                    relativeDir: null,
                    name : null
                }
            }
        }).filter(element=>element.id!==null)
     
    }

    async GetCrewRestAndWork_Files(vesselId,columns,tblName,orderbyCol,reportName,monthYear) {
      
        let tmpRelativePath
        let vesselName
        let monYrSplit = monthYear.split('_');
        let mon =  monthsList.indexOf(monYrSplit[0])
        let year = monYrSplit[1]
       
        let vesselReportForms = await this.sqlInterface.PerformQueryPromise(`
        SELECT   ${columns} 
        FROM ${tblName} 
        WHERE month=$1 AND YEAR=$2 AND (delete_flag is null or delete_flag='N')
        ORDER BY ${orderbyCol}  DESC
        `,[mon,year])
        return vesselReportForms.map(dbform => {
            let relativeDir
            let displayName

            if(dbform.fullpath !=null)
            {
                tmpRelativePath = dbform.fullpath.split('/');
                relativeDir = tmpRelativePath[ tmpRelativePath.length -2];
            }
            //displayName = dbform.crewname +'_'+dbform.empno +'_'+ moment(dbform.createddate).format("DDMMMYYYY")  +'_'+ dbform.vesselname +'.pdf'
            displayName = dbform.crewname +'_'+dbform.empno +'_'+ monYrSplit[0]+year +'_'+ dbform.vesselname +'.pdf'
            
            return {
                id : dbform.id,
                createddate : dbform.createddate,
                fullPath : dbform.fullpath+'/'+displayName,
               // name : tmpRelativePath[ tmpRelativePath.length -1],
                relativeDir: tmpRelativePath[ tmpRelativePath.length -2],
                name : displayName,
                
            }
        })
     
    }

    async GetFiles_KSTFleetFolder(folderId) {
      
      let filesInFolder = await this.sqlInterface.PerformQueryPromise(`
            SELECT f.id, f.name, f.file_path,f.relative_dir,f.created_date AS createddate
            FROM ${config.kstConfig.sqlTables.FOLDER} AS p
            JOIN ${config.kstConfig.sqlTables.FILEFOLDER} AS ff ON ff.folder_id = p.id
            JOIN ${config.kstConfig.sqlTables.FILE} AS f ON f.id = ff.file_id
            WHERE f.delete_flag='N' AND p.id = $1 
            ORDER BY f.created_date DESC
        `,[folderId])
        return filesInFolder.map(dbform => {
            return {
                id : dbform.id,
                fullPath : dbform.file_path,
                relativeDir: dbform.relative_dir,
                name : dbform.name,
                createddate : dbform.createddate,
            }
        })
     
    }


   
    async DeleteFiles(files, callback) {
        //var folderidSplit = files.split(",");

        var folderidSplit = files[0].split("/");
        let fileList = []
        var folderName = folderidSplit[2]
        if(folderidSplit.length >1)
        {
            if(folderName === 'vesselReport')
            {
                fileList  = await this.UpdateDeleteFlag(config.kstConfig.sqlTables.VESSELREPORTFORM,files)
            }
            else if(folderName === 'vesselDowntime')
            {
                fileList  = await this.UpdateDeleteFlag(config.kstConfig.sqlTables.VESSELBREAKDOWNEVENT,files)
            }
            else if(folderName === 'crewTemperature')
            {
                fileList  = await this.UpdateDeleteFlag(config.kstConfig.sqlTables.TEMPERATURELOG,files)

            }
            else if(folderName === 'vesselDisinfection')
            {
                fileList  = await this.UpdateDeleteFlag(config.kstConfig.sqlTables.VESSELDISINFECTION,files)
            }
            else //CrewRestandhours
            {
               fileList  = await this.UpdateDeleteFlag(config.kstConfig.sqlTables.CREWWORKREST,files)
            }
        }
        else
        {
            fileList  = await this.delete_Fleet_File(config.kstConfig.sqlTables.FILE,files)
        }
        return fileList
    }
    
    async UpdateDeleteFlag(tblName, filepath) {

        await this.sqlInterface.PerformQueryPromise(`
            UPDATE ${tblName}
            SET delete_flag='Y'
            WHERE file_path = ANY($1::text[])
            RETURNING *;
        `,[filepath])
        
        return true
    }

    async delete_Fleet_File(tblName,files) {
        await this.sqlInterface.PerformQueryPromise(`
        DELETE FROM ${tblName}
        WHERE file_path = ANY($1::text[])
        `,[files])

        return true
    }


    

    async GetFullFolderPath(folderId, callback, children = []) {
        
     this.sqlInterface.PerformQuery(`
        SELECT c.name, p.name AS parent_name, p.id AS parentId
        FROM ${config.kstConfig.sqlTables.FOLDER} AS c
        LEFT JOIN ${config.kstConfig.sqlTables.FOLDER} AS p ON c.parentFolderId = p.id
        WHERE c.id = $1
        `,[folderId],(rows,err) => {
            if (rows instanceof Array && rows.length > 0) {
                var child = rows[0]
                children.unshift(child.name)
                if (child.parentId == null) {
                    var fullPath = path.join.apply(null,children)
                    callback(fullPath)
                } else {
                    this.GetFullFolderPath(child.parentId,callback,children)
                }
            } else {
                callback(path.join.apply(null,children))
            }
        })
    
    }

    GetFilesInFolder_upload(folderId, callback) {
        
        this.sqlInterface.PerformQuery(`
        SELECT f.id, f.name, f.relative_dir,f.created_date AS createddate
        FROM ${config.kstConfig.sqlTables.FOLDER} AS p
        JOIN ${config.kstConfig.sqlTables.FILEFOLDER} AS ff ON ff.folder_id = p.id
        JOIN ${config.kstConfig.sqlTables.FILE} AS f ON f.id = ff.file_id
        WHERE p.id = $1  AND (f.delete_flag is null or f.delete_flag='N')
        ORDER BY f.created_date DESC
        `,[folderId],(rows,err) => {
            rows.map(row => {
                row.relativeDir = row.relative_dir
            })
            callback(rows,err)
        })
    }

    CreateFile(file, folderId, callback) {
        this.sqlInterface.PerformQuery(`
        INSERT INTO ${config.kstConfig.sqlTables.FILE} (name, relative_dir,file_path) VALUES ($1,$2,$3) RETURNING id;
        `,[file.name, file.relativeDir,file.filePath],(rows,err) => {
            var fileId = rows[0].id
            this.sqlInterface.PerformQuery(`
            INSERT INTO ${config.kstConfig.sqlTables.FILEFOLDER} (file_id, folder_id) VALUES ($1,$2);
            `,[fileId,folderId],(rows,err) => {
                callback({fileId : fileId}, err)
            })
        })
    }

   async CreateFolder(folder,  callback) {
        var parentFolderId
        if(folder.parentFolderId ==='' || folder.parentFolderId ===null || folder.parentFolderId ===undefined)
        {
            parentFolderId = '1001'
        }
        else
        {
            parentFolderId = folder.parentFolderId
        }

        var availaleFoldersInDB = await this.sqlInterface.PerformQueryPromise(`
        SELECT f.id,f.name from folder AS f WHERE f.parentfolderid=$1;
        `,[folder.parentFolderId]);

        var filteredFolderList = [];
        if(availaleFoldersInDB instanceof Array && availaleFoldersInDB.length > 0) {
           filteredFolderList = availaleFoldersInDB.filter(af => {
                return af.name.toLowerCase() === folder.name.toLowerCase();
            });
        }

        if(filteredFolderList.length > 0) {
            callback(null, "Folder name already exists");
        } else {
            await this.sqlInterface.PerformQueryPromise(`
        INSERT INTO ${config.kstConfig.sqlTables.FOLDER} (name,parentfolderid)
            VALUES ($1,$2)
        `, [folder.name,parentFolderId]);
        callback(`${folder.name} folder successfully created`,null);
        }
   
    }

   async DeleteFolder(folderId, callback) {
        if (folderId == 1001) {
            callback(null, "System folder cannot be deleted")
            return
        }
        this.GetFullFolderPath(folderId, (fullPath) => {
            this.GetFilesInFolder_Delete(folderId, (files) => {
                var queries = files.length
                queries += 2
                
                this.sqlInterface.PerformQuery(`
                DELETE FROM ${config.kstConfig.sqlTables.FILEFOLDER} WHERE folder_id = $1;
                `,[folderId],(rows,err) => {
                    queries -= 1
                    if (queries == 0) { callback ( {folderId : folderId}, null) }
                })
                this.sqlInterface.PerformQuery(`
                DELETE FROM ${config.kstConfig.sqlTables.FOLDER} WHERE id = $1;
                `,[folderId],(rows,err) => {
                    queries -= 1
                    if (queries == 0) { callback ( {folderId : folderId}, null) }
                })

                files.forEach(file => {
                    const filePath = path.join(file.file_path)
                    fs.unlink(filePath, () => {
                        this.sqlInterface.PerformQuery(`
                        DELETE FROM ${config.kstConfig.sqlTables.FILE} WHERE id = $1;
                        `,[file.id],(rows,err) => {
                            queries -= 1
                            if (queries == 0) { callback ( {folderId : folderId}, null) }
                        })
                    })
                })
            })
        })
    }

    GetFilesInFolder_Delete(folderId, callback) {
        
        this.sqlInterface.PerformQuery(`
        SELECT f.id, f.name, f.relative_dir,f.file_path,f.created_date AS createddate
        FROM ${config.kstConfig.sqlTables.FOLDER} AS p
        JOIN ${config.kstConfig.sqlTables.FILEFOLDER} AS ff ON ff.folder_id = p.id
        JOIN ${config.kstConfig.sqlTables.FILE} AS f ON f.id = ff.file_id
        WHERE p.id = $1
        ORDER BY f.created_date DESC
        `,[folderId],(rows,err) => {
            rows.map(row => {
                row.relativeDir = row.relative_dir
            })
            callback(rows,err)
        })
    }
   
 
   GetWholeFolderRoot(folderId, callback, currentFolderObj) {

        this.sqlInterface.PerformQuery(`
          SELECT c.name, c.id
            FROM ${config.kstConfig.sqlTables.FOLDER} AS c
            WHERE c.parentfolderid = $1 ORDER BY c.name asc
        `,[folderId],(rows,err) => {
            if (rows.length == 0) {
                callback(currentFolderObj)
            } else {
                var folders = []
                var queries = rows.length
                rows.forEach(row => {
                    this.GetWholeFolderRoot(row.id, (fullChildFolder) => {
                        folders.push(fullChildFolder)
                        currentFolderObj.subfolders=folders
                        queries -= 1
                        if (queries == 0) { 
                            currentFolderObj.subfolders=folders
                            callback(currentFolderObj,null) 
                        }
                    },{name : row.name, id: row.id, subfolders : []})
                })
            }
        })


    }

}
module.exports = DocumentManagementService;
