
import Model from "./Model.js"

class Asset extends Model {
    constructor() {
        super()
        this.assetname = ""
    }

    GetAssetSummary(callback) {
        super.postReq('/asset/parameter/summary',{}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }

    GetAssetHealthTrend(callback) {
        super.postReq('/asset/parameter/trend',{}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }

    GetAssetHealthList(callback) { 
        super.postReq('/asset/parameter/list',{}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }

    GetAssetCurrHealth(assetname, callback) { 
        super.postReq('/asset/current/health',{assetname : assetname}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    
    GetStaticValue(assetname, callback) {
        super.postReq("/asset/equipment/detail", {assetname : assetname}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }

    GetAssetEquipmentHealth(assetname, callback) {
        super.postReq("/asset/equipment/health", {assetname : assetname}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    GetAssetEquipmentHealthTrend(assetname, callback) {
        super.postReq("/asset/equipment/health/trend", {assetname : assetname}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    GetAssetTagAnalytics(assetname, callback) {
        super.postReq("/asset/equipment/tag/analytics", {assetname : assetname}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    GetAssetTags(assetname, callback) {
        super.postReq("/asset/tag", {assetname : assetname}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    GetAssetTagChart(assetname, callback) {
        super.postReq("/asset/equipment/tag/chart", {assetname : assetname}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    GetAssetTagModelChart(assetname, callback) {
        super.postReq("/asset/equipment/tag/model/chart", {assetname : assetname}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    GetAssetVibrationTags(assetname, callback) {
        super.postReq("/asset/tag/vibration", {assetname : assetname}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    GetEngineDetails(engineNo, callback) {
        super.postReq(`/engine/${engineNo}/power`,{},(value,error)=>{
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
}
export default Asset;