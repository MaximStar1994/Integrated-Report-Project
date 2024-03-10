class Helper {
    static queryParser(querystring){
        // remove ?
        const querystr = querystring.substring(1);
        var params = {}
        querystr.split("&").forEach(keyvalpar => {
            const keyVal = keyvalpar.split("=")
            params[keyVal[0]] = keyVal[1]
        });
        return params
    }
}
export default Helper;