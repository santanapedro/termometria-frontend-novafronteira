import React, { Component } from "react";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBIcon,
  MDBBtn,
  MDBModal,
  MDBModalHeader,
  MDBModalFooter
} from "mdbreact";

class TopNavigation extends Component {
  state = {
    collapse: false,
    modal: false
  };

  onClick() {
    this.setState({ modal: !this.state.modal });
  }

  sair() {
    this.setState({ modal: false });
    localStorage.removeItem("@hortech:token");
    window.location.reload();
  }

  render() {
    return (
      <div>
        <MDBNavbar className="flexible-navbar" light expand="md" scrolling>
          <MDBNavbarBrand href="/">
            <strong> SEMENTES NOVA FRONTEIRA </strong>
          </MDBNavbarBrand>

          <MDBNavbarNav right>
            <MDBNavItem>
              <MDBBtn color="default" size="sm" onClick={() => this.onClick()}>
                <MDBIcon icon="power-off" className="ml-1" />
              </MDBBtn>
            </MDBNavItem>
          </MDBNavbarNav>
        </MDBNavbar>

        <MDBModal isOpen={this.state.modal} size="sm">
          <MDBModalHeader> Deseja realmente sair ?</MDBModalHeader>

          <MDBModalFooter id="modalSair">
            <MDBBtn color="warning" onClick={() => this.sair()}>
              SIM
            </MDBBtn>
            <MDBBtn color="primary" onClick={() => this.onClick()}>
              NÃO
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </div>
    );
  }
}

export default TopNavigation;
