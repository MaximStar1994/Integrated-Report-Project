import VesselReport from './src/model/VesselReport'
const syncDeckLogsApi = new syncDeckLogs()

const syncDeckLogs = async () => {
    try {
        await syncDeckLogsApi.SyncVesselReports()
        return 1;
    } catch (err) {
        console.log("error ",err)
        throw new Error("Sync BDN failed");
    }
}

var onSync = (event) => {
    if (event.tag == 'syncVesselReports') {
        event.waitUntil(syncDeckLogs)
    }
}

var onPeriodicSync = (event) => {
    console.log('periodicsync', event.tag);
    // create new work order logs from work order config
}

self.addEventListener('sync', onSync);
// self.addEventListener('periodicsync', onPeriodicSync);