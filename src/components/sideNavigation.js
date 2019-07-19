import React from "react";
import logo from "../assets/logo.png";
import { MDBListGroup, MDBListGroupItem, MDBIcon } from "mdbreact";
import { NavLink } from "react-router-dom";

const TopNavigation = () => {
  return (
    <div className="sidebar-fixed position-fixed">
      <a href="#!" className="logo-wrapper waves-effect">
        <img alt="MDB React Logo" className="img-fluid" src={logo} />
      </a>
      <MDBListGroup className="list-group-flush">
        <NavLink exact={true} to="/" activeClassName="activeClass">
          <MDBListGroupItem>
            <MDBIcon icon="chart-pie" className="mr-3" />
            LEITURAS
          </MDBListGroupItem>
        </NavLink>

        {/* 
                
                 <NavLink to="/relatorios" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="chart-line" className="mr-3"/>
                        Relatorios
                    </MDBListGroupItem>
                </NavLink>
                
        */}

        {/* 
                <NavLink to="/dispositivos" activeClassName="activeClass">
                <MDBListGroupItem>
                    <MDBIcon icon="project-diagram" className="mr-3" />
                    Dispositivos
                </MDBListGroupItem>
                </NavLink>
        
        */}

        {/* 
         <NavLink to="/usuarios" activeClassName="activeClass">
          <MDBListGroupItem>
            <MDBIcon icon="user-cog" className="mr-3" />
            Usuarios
          </MDBListGroupItem>
        </NavLink>
        
        
        */}
      </MDBListGroup>
    </div>
  );
};

export default TopNavigation;
