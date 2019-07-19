import React, { Component } from "react";
import {
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBCardText,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBModal,
  MDBModalBody
} from "mdbreact";

import { Bar, Line } from "react-chartjs-2";
import moment from "moment";
import "moment/locale/pt-br";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import socket from "socket.io-client";
import api from "../../services/api";

moment.locale("pt-BR");

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.notificationDOMRef = React.createRef();
  }

  state = {
    data: "",
    umidade: "",
    temperatura: "",
    dispositivo: "",
    dataBar: [],
    dataBarSetor: [],
    loader: false,
    loaderSetor: false,
    loaderLeituras: false,
    colorS1: <MDBIcon icon="temperature-low" className="primary-color" />,
    colorS2: <MDBIcon icon="temperature-low" className="primary-color" />,
    colorS3: <MDBIcon icon="temperature-low" className="primary-color" />,
    dataSelecionada: moment().format("DD/MM/YYYY"),
    ultimaLeitura: {
      ultimaS1: {
        data: "2000-01-01T23:59:59.000Z",
        setor: "setor-01",
        umidade: 0,
        temperatura: 0
      },
      ultimaS2: {
        data: "2000-01-01T23:59:59.000Z",
        setor: "setor-02",
        umidade: 0,
        temperatura: 0
      },
      ultimaS3: {
        data: "2000-01-01T23:59:59.000Z",
        setor: "setor-03",
        umidade: 0,
        temperatura: 0
      }
    }
  };

  //=========================================================================================================

  async componentDidMount() {
    // this.setState({ loader: true, loaderSetor: true, loaderLeituras: true });
    this.setState({ token: localStorage.getItem("@hortech:token") });
    await this.validaToken();
    this.buscaUltimo();
    this.subscribeToEvents();
    await this.dataBar();

    this.setState({ loader: false, loaderLeituras: false });
  }

  //=========================================================================================================

  async validaToken() {
    const data = {};
    data.token = localStorage.getItem("@hortech:token");
    const response = await api.post("/valida", data);

    if (!response.data) {
      localStorage.removeItem("@hortech:token");
      this.props.history.push("/");
    }
  }

  //=========================================================================================================
  async buscaUltimo() {
    const { token } = this.state;
    const response = await api.get("/ultimo", {
      headers: { Authorization: `Bearer ${token}` }
    });

    this.setState({ ultimaLeitura: response.data });
    const tempAlerta = 30;
    if (response.data.ultimaS1.temperatura >= tempAlerta) {
      this.setState({
        colorS1: (
          <MDBIcon icon="temperature-high" className="danger-color-dark" />
        )
      });
    }
    if (response.data.ultimaS2.temperatura >= tempAlerta) {
      this.setState({
        colorS2: (
          <MDBIcon icon="temperature-high" className="danger-color-dark" />
        )
      });
    }
    if (response.data.ultimaS3.temperatura >= tempAlerta) {
      this.setState({
        colorS3: (
          <MDBIcon icon="temperature-high" className="danger-color-dark" />
        )
      });
    }
  }

  //=========================================================================================================

  async clickGrafico(data) {
    if (data.length > 0) {
      this.setState({
        dataSelecionada: moment(
          this.state.dataBar.labels[data[0]._index],
          "DD/MM/YYYY"
        ).format("DD/MM/YYYY")
      });

      this.setor(this.state.dataBar.labels[data[0]._index]);
    }
  }
  //=========================================================================================================

  async dataBar() {
    const { token } = this.state;
    const response = await api.get("/grafico", {
      headers: { Authorization: `Bearer ${token}` }
    });
    this.setState({ dataBar: response.data });

    this.setor(this.state.dataSelecionada);
  }

  //=========================================================================================================

  async setor(dia) {
    this.setState({ loaderSetor: true });
    const { token } = this.state;
    var diaSelectionado = String(moment(dia, "DD/MM/YYYY").format("YYYY-MM-D"));
    const setor = await api.get(`/setor/${diaSelectionado}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    this.setState({ dataBarSetor: setor.data });
    this.setState({ loaderSetor: false });
  }

  //=========================================================================================================

  subscribeToEvents = () => {
    const io = socket("http://192.168.15.15:3333");

    io.on("leitura", data => {
      this.dataBar();
      this.buscaUltimo();
      this.notificationDOMRef.current.addNotification({
        title: "Nova Leitura",
        message: "Senhor " + data.setor,
        type: "success",
        insert: "top",
        container: "bottom-left",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: { duration: 3000 },
        dismissable: { click: true }
      });
    });

    io.on("erro", data => {
      this.notificationDOMRef.current.addNotification({
        title: "Erro",
        message: data.texto,
        type: "danger",
        insert: "top",
        container: "bottom-left",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: { duration: 30000 },
        dismissable: { click: true }
      });
    });
  };

  //=========================================================================================================

  render() {
    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            barPercentage: 1,
            gridLines: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)"
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)"
            },
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    };

    return (
      <React.Fragment>
        <ReactNotification ref={this.notificationDOMRef} />
        <MDBRow className="mb-4">
          <MDBCol className="mb-r">
            <MDBCard className="cascading-admin-card">
              <div className="admin-up">
                {this.state.colorS1}
                <div className="data">
                  <p>
                    SETOR -{" "}
                    <font size="3">
                      <strong> 01 </strong>{" "}
                    </font>
                  </p>

                  <p align="right">
                    {" "}
                    <MDBCardText>
                      {" "}
                      <font size="2">
                        {this.state.ultimaLeitura.ultimaS1.umidade.toFixed(2)} %
                        /{" "}
                        {this.state.ultimaLeitura.ultimaS1.temperatura.toFixed(
                          2
                        )}{" "}
                        °C{" - "}
                        {moment(
                          this.state.ultimaLeitura.ultimaS1.data
                        ).fromNow()}
                      </font>{" "}
                    </MDBCardText>{" "}
                  </p>
                </div>
              </div>
            </MDBCard>
          </MDBCol>

          <MDBCol>
            <MDBCard className="cascading-admin-card">
              <div className="admin-up">
                {this.state.colorS2}
                <div className="data">
                  <p>
                    SETOR -{" "}
                    <font size="3">
                      <strong> 02 </strong>{" "}
                    </font>
                  </p>
                  <p align="right">
                    {" "}
                    <MDBCardText>
                      {" "}
                      <font size="2">
                        {this.state.ultimaLeitura.ultimaS2.umidade.toFixed(2)} %
                        /{" "}
                        {this.state.ultimaLeitura.ultimaS2.temperatura.toFixed(
                          2
                        )}{" "}
                        °C{" - "}
                        {moment(
                          this.state.ultimaLeitura.ultimaS2.data
                        ).fromNow()}
                      </font>{" "}
                    </MDBCardText>{" "}
                  </p>
                </div>
              </div>
            </MDBCard>
          </MDBCol>

          <MDBCol>
            <MDBCard className="cascading-admin-card">
              <div className="admin-up">
                {this.state.colorS3}
                <div className="data">
                  <p>
                    SETOR -{" "}
                    <font size="3">
                      <strong> 03 </strong>{" "}
                    </font>
                  </p>
                  <p align="right">
                    {" "}
                    <MDBCardText>
                      {" "}
                      <font size="2">
                        {this.state.ultimaLeitura.ultimaS3.umidade.toFixed(2)} %
                        /{" "}
                        {this.state.ultimaLeitura.ultimaS3.temperatura.toFixed(
                          2
                        )}{" "}
                        °C{" - "}
                        {moment(
                          this.state.ultimaLeitura.ultimaS3.data
                        ).fromNow()}
                      </font>{" "}
                    </MDBCardText>{" "}
                  </p>
                </div>
              </div>
            </MDBCard>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol md="8" className="mb-4">
            <MDBCard className="mb-4">
              <MDBCardHeader>
                {this.state.loaderLeituras ? (
                  <MDBCardHeader>
                    <center>
                      <div
                        class="spinner-grow  spinner-grow-sm text-success"
                        role="status"
                      />
                    </center>
                  </MDBCardHeader>
                ) : (
                  <MDBCardHeader>
                    <center> LEITURA SEMANAL</center>
                  </MDBCardHeader>
                )}
              </MDBCardHeader>
              <MDBCardBody>
                <Bar
                  data={this.state.dataBar}
                  height={365}
                  options={barChartOptions}
                  onElementsClick={elems => {
                    this.clickGrafico(elems);
                  }}
                />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol md="12" lg="4" className="mb-4">
            <MDBCard className="mb-4">
              <MDBCardHeader>
                {this.state.loaderSetor ? (
                  <MDBCardHeader>
                    <center>
                      <div
                        class="spinner-grow  spinner-grow-sm text-success"
                        role="status"
                      />
                    </center>
                  </MDBCardHeader>
                ) : (
                  <MDBCardHeader>
                    <center>
                      {" "}
                      SETORES - <strong>{this.state.dataSelecionada} </strong>
                    </center>
                  </MDBCardHeader>
                )}
              </MDBCardHeader>
              <MDBCardBody>
                <Bar
                  data={this.state.dataBarSetor}
                  height={365}
                  options={barChartOptions}
                />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>

        {/* ===================================================================================================================================== */}

        <MDBModal isOpen={this.state.loader} size="sm" frame position="bottom">
          <MDBModalBody>
            <div>
              <center>
                <div className="spinner-grow text-success" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </center>
            </div>
          </MDBModalBody>
        </MDBModal>
      </React.Fragment>
    );
  }
}

export default HomePage;
