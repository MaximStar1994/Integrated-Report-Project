import React, { useState, useEffect } from "react";
import Model from '../../model/Model';
const AuthContext = React.createContext();
const useAuth = () => React.useContext(AuthContext);

const api = new Model();
function AuthProvider(props) {
    const [user, setUser] = useState({loading : true});
    const [selectedVessel, setSelectedVessel] = useState({});
    useEffect(() => {
        api.postReq('/token/verify',{
            token :  localStorage.getItem("authenticationToken")
        },(data,err) => {
            if (data && data.value && data.value.token) {
                localStorage.setItem("authenticationToken",data.value.token)
                var newUser = data.value 
                newUser.loading = false
                newUser.isAuthenticated = true
                newUser.vesselList.unshift({vessel_id: "0", name: 'KST FLEET'});
                localStorage.setItem("user", JSON.stringify(newUser));
                setUser(newUser)
            } else if (data && data.error){
                user.isAuthenticated = false
                user.loading = false
                setUser({isAuthenticated :false, loading : false})
            } else {
                if(localStorage.getItem("user") != null) {
                    setUser(JSON.parse(localStorage.getItem("user")))
                } else {
                    setUser({isAuthenticated :false, loading : false})
                }
            }
        })
    }, []); 
    return (
        <AuthContext.Provider value={{ user, setUser, selectedVessel, setSelectedVessel }} {...props}>
            {props.children}
        </AuthContext.Provider>
    );
}
function authenticate(username, password, isPublic, callback) {
    api.postReq('/login',{username : username, password : password}, (data,err) => {
        if(err){
            if(err.response===undefined||err.response===null||err.response===""){
                callback(false, err.message)
            }
            else{
                // Error from server / Default Case - e.g username/pwd incorrect
                callback(false, err.response.data.error||"Something went wrong, Please contact VesselCare Support.");
            }
        }
        else if (data != null && data.value) {
            if (data.success) {
                localStorage.setItem("authenticationToken",data.value.token)
                callback(true, data.value)
            } else {
                callback(false, data.value)
            }
        } else {
            try{
                let temp = JSON.parse(data);
                // Default Case - e.g Backend server not up.
                callback(false, "Internal Server Error, Please contact VesselCare Support!")
            }catch(err){
                // AWS/Firewall Error Message -e.g Menlo security error
                callback(false, "Invalid Response, Please contact VesselCare Support!");
            }
        }
    })
}

function logout(callback) {
    localStorage.removeItem("authenticationToken")
    localStorage.removeItem("user")
    localStorage.removeItem("selectedVessel")
    callback(true)
}
function withAuthManager(Component) {
    const C = props => {
      const { wrappedComponentRef, ...remainingProps } = props;
      return (
        <AuthContext.Consumer>
          {context => {
              let parsedUser = context.user;
                return (
                <Component
                    {...remainingProps}
                    {...context}
                    user = {parsedUser}
                    ref={wrappedComponentRef}
                />
                );
          }}
        </AuthContext.Consumer>
      );
    };
    C.WrappedComponent = Component;
    return C;
  }
  
export { AuthProvider, useAuth, AuthContext, authenticate, logout , withAuthManager};