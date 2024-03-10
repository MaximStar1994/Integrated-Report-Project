import Model from "./Model.js"

class TankMonitoring extends Model {
    constructor() {
        super()
    }
    ListTankMonitoringTags(callback) {
        super.get("/tankmonitoringtags/",null, (value,error) => {
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

export default TankMonitoring;