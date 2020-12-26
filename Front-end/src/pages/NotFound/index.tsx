// @flow
// libs
import React from "react";
// others
import "./style.scss";
import Logo from "@/Images/3D.gif";
import { Link } from 'react-router-dom';
import ROUTERS from '@/constants/routers';

/**
 * NotFound
 * TODO: Create NotFound
 */
const styles = {
    background:`url(${Logo})`,
    backgroundSize: "inherit",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
}
const NotFound = () => <div className="not-found-wrapper" style={styles}>Not Found <Link to={ROUTERS.HOME}>Back Home</Link></div>;

export default NotFound;
