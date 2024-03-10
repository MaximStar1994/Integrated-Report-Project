import React from 'react';
import MainDashboard from './MainDashboard.js';
import FuelLngDashboard from './FuelLngDashboard';
import { useHistory } from "react-router";
import {useAuth} from '../../Helper/Auth/auth'
import "./Home.css"

const queryString = require('query-string');

function HomePage() {
  const history = useHistory();
  const authManager = useAuth();
  if (window.location.search) {
    const parsed = queryString.parse(window.location.search);
    if (parsed && parsed.path != undefined) {
      var pathFragment = parsed.path.split("/")
      while (pathFragment.length > 0 && pathFragment.shift() != "Assetcare") {}
      var path = pathFragment.join("/")
      if (parsed.query != undefined) {
        path +=`?${parsed.query}`
      }
      history.push(path)
    }
  }
  if (authManager.user.projects && authManager.user.projects.includes("FuelLng")) {
    return (
      <FuelLngDashboard />
    );
  } else {
    return (
      <MainDashboard />
    );
  }
}

export default HomePage;
