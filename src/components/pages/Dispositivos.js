import React, { Component }  from 'react'
import { Container,  Modal, ModalBody,MDBModalBody, MDBModal, ModalHeader, ModalFooter, Button, MDBBtn } from 'mdbreact';


import ReactTable from "react-table";
import "react-table/react-table.css";

import "../pages/styless.css"
import api from '../../services/api';

class Dispositivos extends Component{


  //==============================================================================
                          // ESTADOS DA CLASSE

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
 
        dispositivos:[],
        defaultSelect: "",
        nomeTela:"",
        loader: false,

        colunas:[
         
          { Header: "NOME", accessor: "nome", maxWidth: 250},
          { Header: "LOCAL", accessor: "local" ,  maxWidth: 200},
          { Header: "TIPO", accessor: "tipo", maxWidth: 100 },
          { Header: "OBSERVAÇÃO", accessor: "observacao" } ],
          modalMenu: false,
          modalAltera: false,
          dispositivoSelecionado: {}
       }
    }

//================================================================================
                      // CARREGA FUNÇÕES AO ABRIR A PAGINA 

  componentDidMount(){
  
    this.validaToken()
    this.carregaDispositivos()
  
  }

//================================================================================
                      // CARREGA TODOS DISPOSITIVOS

  carregaDispositivos = async () => {
    this.setState({ loader: true})
    const response = await api.get("/dispositivo", { headers: {"Authorization" : `Bearer ${ localStorage.getItem('@hortech:token')}`} } );
    this.setState({ dispositivos: response.data})
    this.setState({ loader: false})
  }

//================================================================================= 
                      // VALIDA TOKEN DA APLICAÇÃO

   async validaToken () {
      const data = {}
      data.token = localStorage.getItem('@hortech:token');
      const response = await api.post('/valida', data );
  
      if(!response.data){
          localStorage.removeItem('@hortech:token');
          this.props.history.push('/')
      }
  }
  
//================================================================================
                      // CAPTURA DADOS AO PREENCHER FORMULARIO

        handleChange(event) { 

          const data = this.state.dispositivoSelecionado;
          const campo = event.target.name;

          if(campo === 'tipo'){
            switch (event.target.value.toUpperCase()) {

              case 'SENSOR':
              data[campo] = event.target.value.toUpperCase();
              this.setState({ dispositivoSelecionado: data });
              this.setState({ defaultSelect: "SENSOR"});
              break;

              case 'GATEWAY':
              data[campo] = event.target.value.toUpperCase();
              this.setState({ dispositivoSelecionado: data });
                this.setState({ defaultSelect: "GATEWAY"});
              break;

              default:
              break
            }
          
          }else{
            data[campo] = event.target.value.toUpperCase();
            this.setState({ dispositivoSelecionado: data });
          }  
  }

//======================================================================================
                      // EXCLUI DISPOSITIVO

  excluirDispositivo = async () => {
    this.setState({ modalExcluir: false});
    await api.delete(`/dispositivo/${this.state.dispositivoSelecionado._id}`, { headers: {"Authorization" : `Bearer ${ localStorage.getItem('@hortech:token')}`} } );
    this.carregaDispositivos();
    this.setState({dispositivoSelecionado: []})
  }

//====================================================================================
                      // CONTROLA ABERTURA E FECHAMENTO MODALS

  modal = async (param) => {
    switch (param) {
      case 'menu':
        this.setState({ modalMenu: !this.state.modalMenu});
        break;

      case 'excluir':
      this.setState({ modalMenu: false});
      this.setState({ modalExcluir: !this.state.modalExcluir}); 
      break;

      case 'alterar':
      this.setState({nomeTela: "ALTERA DISPOSITIVO"})
      this.setState({ modalMenu: false});
      this.setState({ modalAltera: !this.state.modalAltera});
      break;

      case 'adicionar':
      this.setState({ dispositivoSelecionado:[]});
      this.setState({ nomeTela: "ADICIONA DISPOSITIVO"});
      this.setState({ modalAltera: !this.state.modalAltera});
      break;

      default:
      break;
    }
  }
//=========================================================================================
                      // ALTERA / ADICIONA DISPOSITIVOS

alteraAdiciona = async (param) => {

  if (param === "ADICIONA DISPOSITIVO"){

    if(!this.state.dispositivoSelecionado.tipo){

    }else{
      const data = {}
      data.nome = this.state.dispositivoSelecionado.nome;
      data.local = this.state.dispositivoSelecionado.local;
      data.tipo = this.state.dispositivoSelecionado.tipo;
      data.token = this.state.dispositivoSelecionado.token;
   
      await api.post('/dispositivo', data, { headers: {"Authorization" : `Bearer ${ localStorage.getItem('@hortech:token')}`} } );
      this.setState({modalAltera: false})
      this.carregaDispositivos();
      this.setState({dispositivoSelecionado: []})
    }
    
  }else{
   
      await api.put(`/dispositivo/${this.state.dispositivoSelecionado._id}`, this.state.dispositivoSelecionado, { headers: {"Authorization" : `Bearer ${ localStorage.getItem('@hortech:token')}`} } );
      this.setState({modalAltera: false})
      this.carregaDispositivos();
      this.setState({dispositivoSelecionado: []})

  } 
}

//================================================================================= 


  render(){
    
    const onRowClick = (state, rowInfo, column, instance) => {
    return {
        onClick: e => {
          this.setState({dispositivoSelecionado: rowInfo.original})
          console.log(rowInfo.original)
          this.modal("menu")
         
        }
    }
  }


  return (

    <div>

    <div className="card" id="navTabela">

  {/* ===================================================================================================================================== */}
                                {/* = TABELA = */}

  <h3 className="card-header text-center font-weight-bold text-uppercase py-4">CADASTRO DISPOSITIVOS</h3>
  <MDBBtn outline color="success" onClick={() => this.modal('adicionar')}>ADICIONAR</MDBBtn>
   <ReactTable
          data={this.state.dispositivos}
          columns={this.state.colunas}           
          defaultPageSize={7}
          className="-striped -highlight"
          getTrProps={onRowClick}
   />

    {/* ===================================================================================================================================== */} 

                                {/* = MODAL MENU AO CLICAR = */}

              <Container>
                <Modal isOpen={this.state.modalMenu}  frame position="bottom">
                <ModalBody className="text-center">
                Dispositivo selecionado: <b>{this.state.dispositivoSelecionado.nome}</b><p/>
                <button type="button" className="btn btn-outline-primary waves-effect" onClick={() => this.modal("alterar")}   >EDITAR</button>
                
                <button type="button" className="btn btn-outline-danger waves-effect" onClick={() => this.modal("excluir")} >EXCLUIR</button>

                <button type="button" className="btn btn-outline-secondary waves-effect"  onClick={() => this.modal("menu")}>SAIR</button>
                </ModalBody>
              </Modal>
              </Container>

   {/* ===================================================================================================================================== */} 

               <Container >
                <Modal isOpen={this.state.modalExcluir} frame position="top">
                <ModalBody className="text-center">
                 <h3>Deseja realmente excluir o dispositivo : <b>{this.state.dispositivoSelecionado._id} - {this.state.dispositivoSelecionado.nome}</b><p/></h3>
                <button type="button" className="btn btn-outline-danger waves-effect" onClick={() =>  this.excluirDispositivo()}>EXCLUIR</button>
                <button type="button" className="btn btn-outline-secondary waves-effect"  onClick={() =>  this.modal("excluir")}>SAIR</button>
                </ModalBody>
              </Modal>
              </Container>

  {/* ===================================================================================================================================== */} 
                <Container >
                <Modal isOpen={this.state.modalAltera}>
                <ModalHeader>{this.state.nomeTela}</ModalHeader>
                <ModalBody>
                 
                <form>
                    <div className="form-row">

                      <div className="form-group col-md-9 auto">
                      <label >Nome:</label>
                      <input type="text" className="form-control" name="nome"  value={this.state.dispositivoSelecionado.nome || ''} onChange={this.handleChange}/>
                      </div>


                     {/* ===================================================================================================================================== */} 

                      <div className="form-group col-md-3 ml-auto">
                      <label >Tipo:</label>
                        <select className="browser-default custom-select" id="tipo" name="tipo" defaultValue={this.state.dispositivoSelecionado.tipo}  onChange={this.handleChange}>
                        <option value="">&nbsp;</option>
                        <option value="SENSOR">SENSOR</option>
                          <option value="GATEWAY">GATEWAY</option>
                         
                        </select>
                      </div> 

                     {/* ===================================================================================================================================== */} 


                      <div className="form-group col-md-12 ml-auto">
                      <label htmlFor="exampleFormControlTextarea2">Local</label>
                      <input type="text" className="form-control" name="local"  value={this.state.dispositivoSelecionado.local || ''} onChange={this.handleChange}/>
                      </div>

                      <div className="form-group col-md-12 ml-auto">
                        <label htmlFor="exampleFormControlTextarea2">Token: </label>
                        <textarea className="form-control rounded-0" rows="2" name="token"  value={this.state.dispositivoSelecionado.token || ''} onChange={this.handleChange}></textarea>
                      </div>

                    </div>
                </form>

                </ModalBody>
                <ModalFooter>   
                <Button color="primary"  onClick={() =>  this.alteraAdiciona(this.state.nomeTela)}>SALVAR</Button>
                <Button color="primary"  onClick={() =>  this.modal("alterar")}>SAIR</Button>
                </ModalFooter>
              </Modal>
              </Container>

      <Container>
     
      <MDBModal isOpen={this.state.loader}   size="sm"  frame position="bottom">
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
      </Container>
       
              

             
    </div>
    
    </div>
  
  )
}

}

export default Dispositivos;