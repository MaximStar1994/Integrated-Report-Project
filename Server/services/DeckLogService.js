const sql = require('mssql')
const config = require('../config/config')
const SQLInterface = require("./interfaces/SQLInterface.js");
const pgSQLInterface = require("./interfaces/PostGreSQLInterface")
const helper = require('../helper/helperWithoutApi')
var moment = require('moment');
const { uuid } = require('uuidv4');
"use strict";
class DeckLogService {
    constructor () {
        this.sqlInterface = new SQLInterface()
        this.sqlInterface.config = config.fuellngConfig.dbConfig
    }
    LockDecklogPage(callback) {
        var lock = uuid()
        let inputs = [{
            name : "lock",type : sql.VarChar(1000),value : lock
        }]
        this.sqlInterface.PerformQuery(`
        UPDATE dbo.${config.fuellngConfig.sqlTables.LOCK} 
        SET lock = @lock WHERE appName = 'decklog'
        `,inputs,(rows,err) => {
            callback({lock : lock},null)
        })
        // pgSQLInterface.PerformQuery(`
        // UPDATE ${config.fuellngConfig.sqlTables.LOCK} 
        // SET lock = $1 WHERE appname = 'decklog'
        // `,[lock],(rows,err) => {
        //     callback({lock : lock},null)
        // })
    }
    UnlockDeckLogPage(callback) {
        this.sqlInterface.PerformQuery(`
        UPDATE dbo.${config.fuellngConfig.sqlTables.LOCK} 
        SET lock = NULL WHERE appName = 'decklog'
        `,[],(rows,err) => {
            callback({},null)
        })
        // pgSQLInterface.PerformQuery(`
        // UPDATE ${config.fuellngConfig.sqlTables.LOCK} 
        // SET lock = NULL WHERE appname = 'decklog'
        // `,[],(rows,err) => {
        //     callback({lock : lock},null)
        // })
    }
    CanViewDecklogPage(userLock, callback) {
        this.sqlInterface.PerformQuery(`
        SELECT lock FROM dbo.${config.fuellngConfig.sqlTables.LOCK} WHERE appName = 'decklog'
        `,[],(rows,err) => {
            callback(rows[0] && (rows[0].lock == userLock || rows[0].lock == null), null)
        })
        // pgSQLInterface.PerformQuery(`
        // SELECT lock FROM ${config.fuellngConfig.sqlTables.LOCK} WHERE appname = 'elog'
        // `,[lock],(rows,err) => {
        //     callback(rows[0] && (rows[0].lock == userLock || rows[0].lock == null), null)
        // })
    }
    ListDeckLogs(callback) {
        this.sqlInterface.PerformQuery(`
        SELECT generated_date AS generatedDate, MAX(filepath) AS filePath FROM dbo.${config.fuellngConfig.sqlTables.DECKLOG}
        GROUP BY generated_date
        ORDER BY generated_date DESC
        `,[], (result,err) => {
            if (result instanceof Array && result.length > 0) {
                callback(result,err)
            } else {
                callback([],err)
            }
        })
    }
    GetDeckLogByGeneratedDate(generatedDate, callback) {
        let input = [{name : "generatedDate",type : sql.DateTime(),value : generatedDate}]
        this.sqlInterface.PerformQuery(`
        SELECT id FROM dbo.${config.fuellngConfig.sqlTables.DECKLOG} WHERE generated_date = @generatedDate
        `,input, (rows,err) => {
            rows.map(row => {
                row.decklogId = row.id
            })
            callback(rows,err)
        })
        // pgSQLInterface.PerformQuery(`
        //     SELECT elogid, time_interval FROM ${config.fuellngConfig.sqlTables.ENGINELOG}
        //     WHERE generated_date=$1
        // `,[generatedDate], (rows,err) => {
        //     rows.map(row => {
        //         row.timeInterval = row.time_interval
        //         row.elogId = row.elogid
        //     })
        //     callback(rows,err)
        // })
    }
    CreateDeckLogTable(callback) {
        this.sqlInterface.PerformQuery(`
        INSERT INTO dbo.${config.fuellngConfig.sqlTables.DECKLOG} DEFAULT VALUES;
        SELECT SCOPE_IDENTITY() AS id;
        `,[],(result,err) => {
            callback({decklogId : result[0].id}, err)
        })
        // pgSQLInterface.PerformQuery(`
        // INSERT INTO ${config.fuellngConfig.sqlTables.DECKLOG} DEFAULT VALUES RETURNING elogid;
        // `,[],(result,err) => {
        //     callback({engineLogId : result[0].elogid}, err)
        // })
    }
    CreateGeneralInfo(decklogId,generalinfo, callback) {
        let input = [
            {name : "decklogId",type : sql.Int(),value : decklogId},
            {name : "infoTo",type : sql.VarChar(255),value : generalinfo.infoTo},
            {name : "infoFrom",type : sql.VarChar(255),value : generalinfo.infoFrom},
            {name : "lyingAt",type : sql.VarChar(255),value : generalinfo.lyingAt}
        ]
        this.sqlInterface.PerformQuery(`
        INSERT INTO dbo.${config.fuellngConfig.sqlTables.GENERALINFO} (decklogId,info_to,info_from,lying_at) VALUES (@decklogId,@infoTo,@infoFrom,@lyingAt);
        SELECT SCOPE_IDENTITY() AS id;
        `,input,(result,err) => {
            callback({generalInfoId : result[0].id}, err)
        })
    }
    RemoveAllGeneralInfo(decklogId, callback) {
        let input = [
            {name : "decklogId",type : sql.Int(),value : decklogId},
        ]
        this.sqlInterface.PerformQuery(`
        DELETE FROM dbo.${config.fuellngConfig.sqlTables.GENERALINFO}
        WHERE decklogId = @decklogId
        `,input,(result,err) => {
            callback({decklogId : decklogId}, err)
        })
    }
    GetGeneralInfoRelatedToDeckLog(decklogId, callback) {
        let input = [
            {name : "decklogId",type : sql.Int(),value : decklogId},
        ]
        this.sqlInterface.PerformQuery(`
        SELECT info_to AS infoTo, info_from AS infoFrom, lying_at AS lyingAt, decklogId, id FROM dbo.${config.fuellngConfig.sqlTables.GENERALINFO} WHERE decklogId = @decklogId
        ORDER BY id
        `,input,(rows,err) => {
            callback(rows, err)
        })
    }
    CreateHourlyInfo(decklogId, hourlyInfo, callback) {
        let input = [
            {name : "decklogId",type : sql.Int(),value : decklogId},
        ]
        this.sqlInterface.PerformQuery(`
        INSERT INTO dbo.${config.fuellngConfig.sqlTables.HOURLYINFO} (decklogId) VALUES (@decklogId);
        SELECT SCOPE_IDENTITY() AS id;
        `,input,(result,err) => {
            var id = result[0].id
            this.UpdateHourlyInfo(id,hourlyInfo, callback)
        })
    }
    UpdateHourlyInfo(hourlyInfoId, hourlyInfo, callback) {
        let input = [
            {name : "id",type : sql.Int(),value : hourlyInfoId},
            {name : "timeInterval",type : sql.Int(),value : hourlyInfo.timeInterval},
            {name : "lat",type : sql.VarChar(255),value : hourlyInfo.lat},
            {name : "lng",type : sql.VarChar(255),value : hourlyInfo.lng},
            {name : "trueCourse",type : sql.VarChar(255),value : hourlyInfo.trueCourse},
            {name : "gyro",type : sql.VarChar(255),value : hourlyInfo.gyro},
            {name : "mag",type : sql.VarChar(255),value : hourlyInfo.mag},
            {name : "windForce",type : sql.VarChar(255),value : hourlyInfo.windForce},
            {name : "windDirection",type : sql.VarChar(255),value : hourlyInfo.windDirection},
            {name : "seaCondition",type : sql.VarChar(255),value : hourlyInfo.seaCondition},
            {name : "visibility",type : sql.VarChar(255),value : hourlyInfo.visibility},
            {name : "swellDirection",type : sql.VarChar(255),value : hourlyInfo.swellDirection},
            {name : "swellHeight",type : sql.VarChar(255),value : hourlyInfo.swellHeight},
            {name : "dryTemp",type : sql.VarChar(255),value : hourlyInfo.dryTemp},
            {name : "wetTemp",type : sql.VarChar(255),value : hourlyInfo.wetTemp},
            {name : "barometricPressure",type : sql.VarChar(255),value : hourlyInfo.barometricPressure},
            {name : "engineRoomWatchStatus",type : sql.VarChar(255),value : hourlyInfo.engineRoomWatchStatus},
            {name : "courseAlteration",type : sql.VarChar(255),value : hourlyInfo.courseAlteration},
        ]
        this.sqlInterface.PerformQuery(`
        UPDATE dbo.${config.fuellngConfig.sqlTables.HOURLYINFO} SET 
            time_interval=@timeInterval,
            lat=@lat,
            lng=@lng,
            true_course=@trueCourse,
            gyro=@gyro,
            mag=@mag,
            wind_force=@windForce,
            wind_direction=@windDirection,
            sea_condition=@seaCondition,
            visibility=@visibility,
            swell_direction=@swellDirection,
            swell_height=@swellHeight,
            dry_temp=@dryTemp,
            wet_temp=@wetTemp,
            barometric_pressure=@barometricPressure,
            engine_room_watch_status=@engineRoomWatchStatus,
            course_alteration=@courseAlteration
        WHERE id=@id
        `,input,(result,err) => {
            callback({hourlyInfoId : hourlyInfoId}, err)
        })
    }
    GetHourlyInfoRelatedToDeckLog(decklogId, callback) {
        let input = [
            {name : "decklogId",type : sql.Int(),value : decklogId},
        ]
        this.sqlInterface.PerformQuery(`
        SELECT 
            time_interval AS timeInterval, lat, lng, true_course AS trueCourse, gyro, mag, wind_force AS windForce, wind_direction AS windDirection, sea_condition AS seaCondition,
            visibility, swell_direction AS swellDirection, swell_height AS swellHeight, dry_temp AS dryTemp, wet_temp AS wetTemp, barometric_pressure AS barometricPressure, 
            engine_room_watch_status AS engineRoomWatchStatus, course_alteration AS courseAlteration, decklogId, id AS hourlyInfoId
        FROM dbo.${config.fuellngConfig.sqlTables.HOURLYINFO} WHERE decklogId = @decklogId
        ORDER BY time_interval
        `,input,(rows,err) => {
            callback(rows, err)
        })
    }
    RemoveAllHourlyInfo(decklogId, callback) {
        let input = [
            {name : "decklogId",type : sql.Int(),value : decklogId},
        ]
        this.sqlInterface.PerformQuery(`
        DELETE FROM dbo.${config.fuellngConfig.sqlTables.HOURLYINFO}
        WHERE decklogId = @decklogId
        `,input,(result,err) => {
            callback({decklogId : decklogId}, err)
        })
    }
    CreateFourHourlyInfo(decklogId, fourHourlyGroupInfo , callback) {
        let input = [
            {name : "decklogId",type : sql.Int(),value : decklogId},
            {name : "name",type : sql.VarChar(255),value : fourHourlyGroupInfo.name},
            {name : "headers",type : sql.VarChar(255),value : fourHourlyGroupInfo.headers.join(',')},
        ]
        this.sqlInterface.PerformQuery(`
        INSERT INTO dbo.${config.fuellngConfig.sqlTables.FOURHOURLYGRPINFO} (decklogId,name,headers) VALUES (@decklogId,@name,@headers);
        SELECT SCOPE_IDENTITY() AS id;
        `,input,(result,err) => {
            let grpInfoId = result[0].id
            let info = fourHourlyGroupInfo.info
            if (info instanceof Array && info.length > 0) {
                var queries = info.length
                info.forEach(fourhourly => {
                    let fourhourlyInputs = [
                        {name : "fourHourlyGroupInfoId",type : sql.Int(),value : grpInfoId},
                        {name : "timeInterval",type : sql.Int(),value : fourhourly.timeInterval},
                        {name : "info",type : sql.VarChar(sql.MAX),value : JSON.stringify(fourhourly.info)},
                    ]
                    this.sqlInterface.PerformQuery(`
                        INSERT INTO dbo.${config.fuellngConfig.sqlTables.FOURHOURLYINFO} (four_hourly_group_info_id,time_interval,info) VALUES (@fourHourlyGroupInfoId,@timeInterval,@info)
                    `,fourhourlyInputs,(result,err) => {
                        queries -= 1
                        if (queries == 0) {
                            callback({grpInfoId : grpInfoId}, null)
                        }
                    })
                })
                
            } else {
                callback({grpInfoId : result[0].id}, err)
            }
        })
    }
    RemoveAllFourHourlyInfo(decklogId, callback) {
        let input = [
            {name : "decklogId",type : sql.Int(),value : decklogId},
        ]
        this.sqlInterface.PerformQuery(`
        DELETE FROM dbo.${config.fuellngConfig.sqlTables.FOURHOURLYINFO}
        WHERE four_hourly_group_info_id IN (
            SELECT id FROM dbo.${config.fuellngConfig.sqlTables.FOURHOURLYGRPINFO} WHERE decklogId = @decklogId
        )
        `,input,(result,err) => {
            this.sqlInterface.PerformQuery(`
            DELETE FROM dbo.${config.fuellngConfig.sqlTables.FOURHOURLYGRPINFO}
            WHERE decklogId = @decklogId
            `,input,(result,err) => {
                callback({decklogId : decklogId}, err)
            })
        })
    }
    GetFourHourlyInfo(decklogId, callback) {
        let input = [
            {name : "decklogId",type : sql.Int(),value : decklogId},
        ]
        this.sqlInterface.PerformQuery(`
        SELECT decklogId, id, name, headers FROM dbo.${config.fuellngConfig.sqlTables.FOURHOURLYGRPINFO} WHERE decklogId = @decklogId
        `,input,(rows,err) => {
            if (rows instanceof Array && rows.length > 0) {
                var queries = rows.length
                rows.forEach(row => {
                    let fourhourlyinput = [
                        {name : "fourHourlyGroupId",type : sql.Int(),value : row.id},
                    ]
                    this.sqlInterface.PerformQuery(`
                    SELECT id AS fourHourlyId, time_interval AS timeInterval, info
                    FROM dbo.${config.fuellngConfig.sqlTables.FOURHOURLYINFO} WHERE four_hourly_group_info_id = @fourHourlyGroupId
                    ORDER BY time_interval
                    `,fourhourlyinput,(fourhourlyrows,err) => {
                        let jsonHeaders = row.headers.split(",")
                        row.headers = jsonHeaders
                        fourhourlyrows.map(fourhourlyrow => {
                            fourhourlyrow.info = JSON.parse(fourhourlyrow.info)
                        })
                        row.info = fourhourlyrows
                        queries -= 1
                        if (queries == 0) {
                            callback(rows,null)
                        }
                    })
                })
            } else {
                callback([],err)
            }
            
        })
    }
    RemoveAllAdditionalCol(decklogId, callback) {
        let input = [
            {name : "decklogId",type : sql.Int(),value : decklogId},
        ]
        this.sqlInterface.PerformQuery(`
        DELETE FROM dbo.${config.fuellngConfig.sqlTables.ADDITIONALCOLINFO}
        WHERE additional_col_group_id IN (
            SELECT id FROM dbo.${config.fuellngConfig.sqlTables.ADDITIONALCOLGROUPINFO} WHERE decklogId = @decklogId
        )
        `,input,(result,err) => {
            this.sqlInterface.PerformQuery(`
            DELETE FROM dbo.${config.fuellngConfig.sqlTables.ADDITIONALCOLGROUPINFO}
            WHERE decklogId = @decklogId
            `,input,(result,err) => {
                callback({decklogId : decklogId}, err)
            })
        })
    }
    CreateAdditionalCol(decklogId, additionalCol, callback) {
        let input = [
            {name : "decklogId",type : sql.Int(),value : decklogId},
            {name : "name",type : sql.VarChar(255),value : additionalCol.name},
            {name : "headers",type : sql.VarChar(255),value : additionalCol.headers.join(',')},
        ]
        this.sqlInterface.PerformQuery(`
        INSERT INTO dbo.${config.fuellngConfig.sqlTables.ADDITIONALCOLGROUPINFO} (decklogId,name,headers) VALUES (@decklogId,@name,@headers);
        SELECT SCOPE_IDENTITY() AS id;
        `,input,(result,err) => {
            let grpInfoId = result[0].id
            let info = additionalCol.info
            if (info instanceof Array && info.length > 0) {
                var queries = info.length
                info.forEach(additionalCol => {
                    let additionalColInputs = [
                        {name : "additionalColGroupId",type : sql.Int(),value : grpInfoId},
                        {name : "info",type : sql.VarChar(sql.MAX),value : JSON.stringify(additionalCol.info)},
                    ]
                    this.sqlInterface.PerformQuery( `
                        INSERT INTO dbo.${config.fuellngConfig.sqlTables.ADDITIONALCOLINFO} (additional_col_group_id,info) VALUES (@additionalColGroupId,@info)
                    `,additionalColInputs,(result,err) => {
                        queries -= 1
                        if (queries == 0) {
                            callback({additionalColGroupInfoId : grpInfoId}, null)
                        }
                    })
                })
                
            } else {
                callback({additionalColGroupInfoId : result[0].id}, err)
            }
        })
    }
    GetAdditionalColInfo(decklogId, callback) {
        let input = [
            {name : "decklogId",type : sql.Int(),value : decklogId},
        ]
        this.sqlInterface.PerformQuery(`
        SELECT decklogId, id AS additionalColGroupId, name, headers FROM dbo.${config.fuellngConfig.sqlTables.ADDITIONALCOLGROUPINFO} WHERE decklogId = @decklogId
        `,input,(rows,err) => {
            if (rows instanceof Array && rows.length > 0) {
                var queries = rows.length
                rows.forEach(row => {
                    let fourhourlyinput = [
                        {name : "additionalColGroupId",type : sql.Int(),value : row.additionalColGroupId},
                    ]
                    this.sqlInterface.PerformQuery(`
                    SELECT id AS additionalColId, info
                    FROM dbo.${config.fuellngConfig.sqlTables.ADDITIONALCOLINFO} WHERE additional_col_group_id = @additionalColGroupId
                    ORDER BY id
                    `,fourhourlyinput,(additionalColRows,err) => {
                        let jsonHeaders = row.headers.split(",")
                        row.headers = jsonHeaders
                        additionalColRows.map(additionalColRow => {
                            additionalColRow.info = JSON.parse(additionalColRow.info)
                        })
                        row.info = additionalColRows
                        queries -= 1
                        if (queries == 0) {
                            callback(rows,null)
                        }
                    })
                })
            } else {
                callback([],err)
            }
            
        })
    }
    UpdateDeckLogTable(decklog, callback) {
        if (helper.IsEmpty(decklog.id)) {
            callback(null, "No Id Provided")
            return
        }
        let input = [
            {name : "id",type : sql.Int(),value : decklog.id},
            {name : "chiefOfficerSignature",type : sql.VarChar(sql.MAX),value : decklog.chiefOfficerSignature},
            {name : "chiefOfficerName",type : sql.VarChar(255),value : decklog.chiefOfficerName},
            {name : "captainSignature",type : sql.VarChar(sql.MAX),value : decklog.captainSignature},
            {name : "captainName",type : sql.VarChar(255),value : decklog.captainName},
            {name : "generatedDate",type : sql.DateTime,value : decklog.generatedDate},
            {name : "noonLat",type : sql.VarChar(255),value : decklog.noon.lat},
            {name : "noonLng",type : sql.VarChar(255),value : decklog.noon.lng},
            {name : "noonAvgSpeed",type : sql.VarChar(255),value : decklog.noon.avgSpeed},
            {name : "noonDistanceRunSeaStreaming",type : sql.VarChar(255),value : decklog.noon.distanceRunSeaStreaming},
            {name : "noonDistanceRunHRStreaming",type : sql.VarChar(255),value : decklog.noon.distanceRunHRStreaming},
            {name : "dailyTank1Sounding",type : sql.VarChar(255),value : decklog.daily.tank1.liquidVolume},
            {name : "dailyTank1LiquidTemp",type : sql.VarChar(255),value : decklog.daily.tank1.liquidTemp},
            {name : "dailyTank1VaporTemp",type : sql.VarChar(255),value : decklog.daily.tank1.vaporTemp},
            {name : "dailyTank1Pressure",type : sql.VarChar(255),value : decklog.daily.tank1.pressure},
            {name : "dailyTank2Sounding",type : sql.VarChar(255),value : decklog.daily.tank2.liquidVolume},
            {name : "dailyTank2LiquidTemp",type : sql.VarChar(255),value : decklog.daily.tank2.liquidTemp},
            {name : "dailyTank2VaporTemp",type : sql.VarChar(255),value : decklog.daily.tank2.vaporTemp},
            {name : "dailyTank2Pressure",type : sql.VarChar(255),value : decklog.daily.tank2.pressure},
            {name : "dailyTank1CSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank1c},
            {name : "dailyTank2PSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank2p},
            {name : "dailyTank3PSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank3p},
            {name : "dailyTank4PSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank4p},
            {name : "dailyTank5PSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank5p},
            {name : "dailyTank6PSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank6p},
            {name : "dailyTank7PSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank7p},
            {name : "dailyTank8PSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank8p},
            {name : "dailyTank9PSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank9p},
            {name : "dailyTank10PSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank10p},
            {name : "dailyTank21PSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank21p},
            {name : "dailyTank2SSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank2s},
            {name : "dailyTank3SSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank3s},
            {name : "dailyTank4SSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank4s},
            {name : "dailyTank5SSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank5s},
            {name : "dailyTank6SSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank6s},
            {name : "dailyTank7SSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank7s},
            {name : "dailyTank8SSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank8s},
            {name : "dailyTank9SSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank9s},
            {name : "dailyTank10SSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank10s},
            {name : "dailyTank21SSounding",type : sql.VarChar(255),value : decklog.daily.sounding.tank21s},
            {name : "dailyVoidSpaceTank6CSounding",type : sql.VarChar(255),value : decklog.daily.voidspaceSounding.tank6c},
            {name : "dailyVoidSpaceTank1PSounding",type : sql.VarChar(255),value : decklog.daily.voidspaceSounding.tank1p},
            {name : "dailyVoidSpaceTank4PSounding",type : sql.VarChar(255),value : decklog.daily.voidspaceSounding.tank4p},
            {name : "dailyVoidSpaceTank5PSounding",type : sql.VarChar(255),value : decklog.daily.voidspaceSounding.tank5p},
            {name : "dailyVoidSpaceTank1SSounding",type : sql.VarChar(255),value : decklog.daily.voidspaceSounding.tank1s},
            {name : "dailyVoidSpaceTank4SSounding",type : sql.VarChar(255),value : decklog.daily.voidspaceSounding.tank4s},
            {name : "dailyVoidSpaceTank5SSounding",type : sql.VarChar(255),value : decklog.daily.voidspaceSounding.tank5s},
            {name : "dailyDraftArrivalForward",type : sql.VarChar(255),value : decklog.daily.draft.arrivalForward},
            {name : "dailyDraftArrivalAft",type : sql.VarChar(255),value : decklog.daily.draft.arrivalAft},
            {name : "dailyDraftSailingForward",type : sql.VarChar(255),value : decklog.daily.draft.sailingForward},
            {name : "dailyDraftSailingAft",type : sql.VarChar(255),value : decklog.daily.draft.sailingAft},
        ]
        this.sqlInterface.PerformQuery(`
        UPDATE dbo.${config.fuellngConfig.sqlTables.DECKLOG}
        SET
            chief_officer_signature = @chiefOfficerSignature,
            chief_officer_name = @chiefOfficerName,
            captain_signature = @captainSignature,
            captain_name = @captainName,
            generated_date = @generatedDate,
            noon_lat = @noonLat,
            noon_lng = @noonLng,
            noon_avg_speed = @noonAvgSpeed,
            noon_distance_run_sea_streaming = @noonDistanceRunSeaStreaming,
            noon_distance_run_hr_streaming = @noonDistanceRunHRStreaming,
            daily_tank1_liquidvolume = @dailyTank1Sounding,
            daily_tank1_liquid_temp = @dailyTank1LiquidTemp,
            daily_tank1_vapor_temp = @dailyTank1VaporTemp,
            daily_tank1_pressure = @dailyTank1Pressure,
            daily_tank2_liquidvolume = @dailyTank2Sounding,
            daily_tank2_liquid_temp = @dailyTank2LiquidTemp,
            daily_tank2_vapor_temp = @dailyTank2VaporTemp,
            daily_tank2_pressure = @dailyTank2Pressure,
            daily_sounding_tank1c = @dailyTank1CSounding,
            daily_sounding_tank2p = @dailyTank2PSounding,
            daily_sounding_tank3p = @dailyTank3PSounding,
            daily_sounding_tank4p = @dailyTank4PSounding,
            daily_sounding_tank5p = @dailyTank5PSounding,
            daily_sounding_tank6p = @dailyTank6PSounding,
            daily_sounding_tank7p = @dailyTank7PSounding,
            daily_sounding_tank8p = @dailyTank8PSounding,
            daily_sounding_tank9p = @dailyTank9PSounding,
            daily_sounding_tank10p = @dailyTank10PSounding,
            daily_sounding_tank21p = @dailyTank21PSounding,
            daily_sounding_tank2s = @dailyTank2SSounding,
            daily_sounding_tank3s = @dailyTank3SSounding,
            daily_sounding_tank4s = @dailyTank4SSounding,
            daily_sounding_tank5s = @dailyTank5SSounding,
            daily_sounding_tank6s = @dailyTank6SSounding,
            daily_sounding_tank7s = @dailyTank7SSounding,
            daily_sounding_tank8s = @dailyTank8SSounding,
            daily_sounding_tank9s = @dailyTank9SSounding,
            daily_sounding_tank10s = @dailyTank10SSounding,
            daily_sounding_tank21s = @dailyTank21SSounding,
            daily_void_sounding_tank6c = @dailyVoidSpaceTank6CSounding,
            daily_void_sounding_tank1p = @dailyVoidSpaceTank1PSounding,
            daily_void_sounding_tank4p = @dailyVoidSpaceTank4PSounding,
            daily_void_sounding_tank5p = @dailyVoidSpaceTank5PSounding,
            daily_void_sounding_tank1s = @dailyVoidSpaceTank1SSounding,
            daily_void_sounding_tank4s = @dailyVoidSpaceTank4SSounding,
            daily_void_sounding_tank5s = @dailyVoidSpaceTank5SSounding,
            daily_draft_arrival_fwd = @dailyDraftArrivalForward,
            daily_draft_arrival_aft = @dailyDraftArrivalAft,
            daily_draft_sailing_fwd = @dailyDraftSailingForward,
            daily_draft_sailing_aft = @dailyDraftSailingAft
        WHERE id = @id
        `,input,(result,err) => {
			callback(result, err);
        })
    }
    CreateGeneralInfos(generalInfos, decklogId, callback) {
        if (generalInfos.length == 0) {
            callback()
        } else {
            this.CreateGeneralInfo(decklogId, generalInfos[0], () => {
                var remainingInfo = generalInfos
                remainingInfo.shift()
                this.CreateGeneralInfos(remainingInfo, decklogId, callback)
            })
        }
    }
    CreateDeckLog(decklog, callback) {
        this.CreateDeckLogTable((val,err) => {
            if (val == null) {
                callback(val,err)
                return
            }
            var queries = 0
            var decklogId = val.decklogId
            decklog.id = decklogId
            if (decklog.general instanceof Array && decklog.general.length > 0) {
                queries += 1
                this.CreateGeneralInfos(decklog.general, decklogId, () => {
                    queries -= 1
                    if (queries == 0) {
                        callback({decklogId : decklogId}, null)
                    }
                })
            }
            if (decklog.hourly instanceof Array && decklog.hourly.length > 0) {
                decklog.hourly.forEach(hourlyInfo => {
                    queries += 1
                    this.CreateHourlyInfo(decklogId, hourlyInfo, () => {
                        queries -= 1
                        if (queries == 0) {
                            callback({decklogId : decklogId}, null)
                        }
                    })
                })
            }
            if (decklog.fourHourly instanceof Array && decklog.fourHourly.length > 0) {
                decklog.fourHourly.forEach(fourHourlyInfo => {
                    queries += 1
                    this.CreateFourHourlyInfo(decklogId, fourHourlyInfo, () => {
                        queries -= 1
                        if (queries == 0) {
                            callback({decklogId : decklogId}, null)
                        }
                    })
                })
            }
            if (decklog.additionalCol instanceof Array && decklog.additionalCol.length > 0) {
                decklog.additionalCol.forEach(additionalColInfo => {
                    queries += 1
                    this.CreateAdditionalCol(decklogId, additionalColInfo, () => {
                        queries -= 1
                        if (queries == 0) {
                            callback({decklogId : decklogId}, null)
                        }
                    })
                })
            }
            queries += 1
            this.UpdateDeckLogTable(decklog, (val,err) => {
                queries -= 1
                if (queries == 0) {
                    callback({decklogId : decklogId}, null)
                }
            })
        }) 
    }
    UpdateDeckLog(decklog,callback) {
        if (helper.IsEmpty(decklog.id)) {
            callback(null, "No Id Provided")
            return
        }
        var decklogId = decklog.id
        var queries = 0
        // update general info
        queries += 1
        this.RemoveAllGeneralInfo(decklogId, () => {
            if (decklog.general instanceof Array && decklog.general.length > 0) {
                queries -= 1
                decklog.general.forEach(generalInfo => {
                    queries += 1
                    this.CreateGeneralInfo(decklogId, generalInfo, () => {
                        queries -= 1
                        if (queries == 0) {
                            callback({decklogId : decklogId}, null)
                        }
                    })
                })
            } else {
                queries -= 1
                if (queries == 0) {
                    callback({decklogId : decklogId}, null)
                }
            }
        })
        // update hourly info
        queries += 1
        this.RemoveAllHourlyInfo(decklogId, () => {
            if (decklog.hourly instanceof Array && decklog.hourly.length > 0) {
                queries -= 1
                decklog.hourly.forEach(hourlyInfo => {
                    queries += 1
                    this.CreateHourlyInfo(decklogId, hourlyInfo, () => {
                        queries -= 1
                        if (queries == 0) {
                            callback({decklogId : decklogId}, null)
                        }
                    })
                })
            } else {
                queries -= 1
                if (queries == 0) {
                    callback({decklogId : decklogId}, null)
                }
            }
        })
        // update 4 hourlyInfo 
        queries += 1
        this.RemoveAllFourHourlyInfo(decklogId, () => {
            if (decklog.fourHourly instanceof Array && decklog.fourHourly.length > 0) {
                queries -= 1
                decklog.fourHourly.forEach(fourHourlyInfo => {
                    queries += 1
                    this.CreateFourHourlyInfo(decklogId, fourHourlyInfo, () => {
                        queries -= 1
                        if (queries == 0) {
                            callback({decklogId : decklogId}, null)
                        }
                    })
                })
            } else {
                queries -= 1
                if (queries == 0) {
                    callback({decklogId : decklogId}, null)
                }
            }
        })
        // remove all additional columns and re create
        queries += 1
        this.RemoveAllAdditionalCol(decklogId, () => {
            if (decklog.additionalCol instanceof Array && decklog.additionalCol.length > 0) {
                queries -= 1
                decklog.additionalCol.forEach(additionalColInfo => {
                    queries += 1
                    this.CreateAdditionalCol(decklogId, additionalColInfo, () => {
                        queries -= 1
                        if (queries == 0) {
                            callback({decklogId : decklogId}, null)
                        }
                    })
                })
            } else {
                queries -= 1
                if (queries == 0) {
                    callback({decklogId : decklogId}, null)
                }
            }
        })
        queries += 1
        this.UpdateDeckLogTable(decklog, (val,err) => {
            queries -= 1
            if (queries == 0) {
                callback({decklogId : decklogId}, null)
            }
        })
    }    
    GetDeckLog(decklogId, callback) {
        let inputs = [{
            name : "decklogId",
            type : sql.Int(),
            value : decklogId
        }]
        this.sqlInterface.PerformQuery(`
        SELECT 
            id, filepath, chief_officer_signature AS chiefOfficerSignature, chief_officer_name AS chiefOfficerName, captain_signature AS captainSignature, captain_name AS captainName, generated_date AS generatedDate,
            noon_lat, noon_lng, noon_avg_speed, noon_distance_run_sea_streaming, noon_distance_run_hr_streaming,
            daily_tank1_liquidvolume, daily_tank1_liquid_temp, daily_tank1_vapor_temp, daily_tank1_pressure, 
            daily_tank2_liquidvolume, daily_tank2_liquid_temp, daily_tank2_vapor_temp, daily_tank2_pressure,
            daily_sounding_tank1c, daily_sounding_tank2p, daily_sounding_tank3p, daily_sounding_tank4p, daily_sounding_tank5p, daily_sounding_tank6p, daily_sounding_tank7p, daily_sounding_tank8p, daily_sounding_tank9p, daily_sounding_tank10p, daily_sounding_tank21p,
            daily_sounding_tank2s, daily_sounding_tank3s, daily_sounding_tank4s, daily_sounding_tank5s, daily_sounding_tank6s, daily_sounding_tank7s, daily_sounding_tank8s, daily_sounding_tank9s, daily_sounding_tank10s, daily_sounding_tank21s,
            daily_void_sounding_tank6c, daily_void_sounding_tank1p, daily_void_sounding_tank4p, daily_void_sounding_tank5p, daily_void_sounding_tank1s, daily_void_sounding_tank4s, daily_void_sounding_tank5s, daily_draft_arrival_fwd, daily_draft_arrival_aft, daily_draft_sailing_fwd, daily_draft_sailing_aft
        FROM dbo.${config.fuellngConfig.sqlTables.DECKLOG}
        WHERE id=@decklogId`,inputs,(rows,err) => {
            if (rows instanceof Array && rows.length > 0) {
                let decklog = rows[0]
                let parsedDeckLog = {}
                parsedDeckLog.decklogId = decklog.id
                parsedDeckLog.filepath = decklog.filepath
                parsedDeckLog.chiefOfficerSignature = decklog.chiefOfficerSignature
                parsedDeckLog.chiefOfficerName = decklog.chiefOfficerName
                parsedDeckLog.captainSignature = decklog.captainSignature
                parsedDeckLog.captainName = decklog.captainName
                parsedDeckLog.generatedDate = decklog.generatedDate
                parsedDeckLog.noon = {
                    lat : decklog.noon_lat,
                    lng : decklog.noon_lng,
                    avgSpeed : decklog.noon_avg_speed,
                    distanceRunSeaStreaming : decklog.noon_distance_run_sea_streaming,
                    distanceRunHRStreaming : decklog.noon_distance_run_hr_streaming,
                }
                parsedDeckLog.daily = {
                    tank1 : {
                        liquidVolume : decklog.daily_tank1_liquidvolume,
                        liquidTemp : decklog.daily_tank1_liquid_temp,
                        vaporTemp : decklog.daily_tank1_vapor_temp,
                        pressure : decklog.daily_tank1_pressure
                    },
                    tank2 : {
                        liquidVolume : decklog.daily_tank2_liquidvolume,
                        liquidTemp : decklog.daily_tank2_liquid_temp,
                        vaporTemp : decklog.daily_tank2_vapor_temp,
                        pressure : decklog.daily_tank2_pressure
                    },
                    sounding : {
                        tank1c : decklog.daily_sounding_tank1c,
                        tank2p : decklog.daily_sounding_tank2p,
                        tank3p : decklog.daily_sounding_tank3p,
                        tank4p : decklog.daily_sounding_tank4p,
                        tank5p : decklog.daily_sounding_tank5p,
                        tank6p : decklog.daily_sounding_tank6p,
                        tank7p : decklog.daily_sounding_tank7p,
                        tank8p : decklog.daily_sounding_tank8p,
                        tank9p : decklog.daily_sounding_tank9p,
                        tank10p : decklog.daily_sounding_tank10p,
                        tank21p : decklog.daily_sounding_tank21p,
                        tank2s : decklog.daily_sounding_tank2s,
                        tank3s : decklog.daily_sounding_tank3s,
                        tank4s : decklog.daily_sounding_tank4s,
                        tank5s : decklog.daily_sounding_tank5s,
                        tank6s : decklog.daily_sounding_tank6s,
                        tank7s : decklog.daily_sounding_tank7s,
                        tank8s : decklog.daily_sounding_tank8s,
                        tank9s : decklog.daily_sounding_tank9s,
                        tank10s : decklog.daily_sounding_tank10s,
                        tank21s : decklog.daily_sounding_tank21s,
                    },
                    voidspaceSounding : {
                        tank6c : decklog.daily_void_sounding_tank6c,
                        tank1p : decklog.daily_void_sounding_tank1p,
                        tank4p : decklog.daily_void_sounding_tank4p,
                        tank5p : decklog.daily_void_sounding_tank5p,
                        tank1s : decklog.daily_void_sounding_tank1s,
                        tank4s : decklog.daily_void_sounding_tank4s,
                        tank5s : decklog.daily_void_sounding_tank5s,
                    },
                    draft : {
                        arrivalForward : decklog.daily_draft_arrival_fwd,
                        arrivalAft : decklog.daily_draft_arrival_aft,
                        sailingForward : decklog.daily_draft_sailing_fwd,
                        sailingAft : decklog.daily_draft_sailing_aft,
                    }
                }
                var queries = 4
                this.GetAdditionalColInfo(decklogId, (additionalCols,err)=> {
                    parsedDeckLog.additionalCol = additionalCols
                    queries -= 1
                    if (queries == 0) {
                        callback(parsedDeckLog, null)
                    }
                })
                this.GetFourHourlyInfo(decklogId, (fourhourlyInfos, err) => {
                    parsedDeckLog.fourHourly = fourhourlyInfos
                    queries -= 1
                    if (queries == 0) {
                        callback(parsedDeckLog, null)
                    }
                })
                this.GetHourlyInfoRelatedToDeckLog(decklogId, (hourlyInfos, err) => {
                    parsedDeckLog.hourly = hourlyInfos
                    queries -= 1
                    if (queries == 0) {
                        callback(parsedDeckLog, null)
                    }
                })
                this.GetGeneralInfoRelatedToDeckLog(decklogId, (generalInfos, err) => {
                    parsedDeckLog.general = generalInfos
                    queries -= 1
                    if (queries == 0) {
                        callback(parsedDeckLog, null)
                    }
                })
            } else {
                callback(null,err)
            }
        })
    }


    RecordDeckLog(decklogId, filepath, callback) {
        let input = [{
            name : "filepath",
            type : sql.VarChar(sql.MAX),
            value : filepath
        },{
            name : "decklogId",
            type : sql.Int(),
            value : decklogId
        }]
        this.sqlInterface.PerformQuery(`
        UPDATE dbo.${config.fuellngConfig.sqlTables.DECKLOG} SET filepath=@filepath WHERE id = @decklogId
        `,input,(result,err) => {
            callback({filepath : filepath}, err)
        })
    }
    
    ListDeckLogsEligibleForPDF(callback) {
        this.sqlInterface.PerformQuery(`
        SELECT id, generated_date AS generatedDate FROM dbo.${config.fuellngConfig.sqlTables.DECKLOG}
        WHERE filepath IS NULL 
        AND chief_officer_signature IS NOT NULL AND chief_officer_signature != ''
        AND chief_officer_name IS NOT NULL AND chief_officer_name != ''
        AND captain_signature IS NOT NULL AND captain_signature != ''
        AND captain_name IS NOT NULL AND captain_name != ''
        `,[], (rows,err) => {
            if (rows instanceof Array && rows.length > 0) {
                var logsEligible = []
                var queries = rows.length
                rows.forEach(row => {
                    this.GetDeckLog(row.id, (log) => {
                        queries -= 1
                        log.generatedDate = moment(row.generatedDate).format('DD-MMM-YY'),
                        logsEligible.push(log)
                        if (queries == 0) {
                            callback(logsEligible)
                        }
                    })
                })
            } else {
                callback([],err)
            }
        })
    }
}
module.exports = DeckLogService;