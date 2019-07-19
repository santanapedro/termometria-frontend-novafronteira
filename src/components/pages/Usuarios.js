import React, { Component } from 'react'
import api from '../../services/api';
import { Container,  Modal, ModalBody, ModalHeader, ModalFooter, Button, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';
import ReactTable from "react-table";


import "../pages/styless.css"

class  Usuarios extends Component{


  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
        modalMenu: false,
        modalAltera: false,
        modalSenha: false,
        modalExcluir: false,
        modalTrocaSenha: false,
        loader: false,

        nomeTela: "",
        usuarios:[],
        usuarioSelecionado:{},

        colunas:[
          { Header: "NOME", accessor: "nome",  maxWidth: 250},
          { Header: "E-MAIL", accessor: "email" ,  maxWidth: 250},
          { Header: "TELEFONE", accessor: "telefone" },
          { Header: "TIPO", accessor: "tipo" },
          { Header: "CODIGO", accessor: "codigo" },
          
         ],
         

       }
    }


//================================================================================

componentDidMount(){
  this.validaToken()
  this.carregaUsuarios()
}

//================================================================================
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


carregaUsuarios = async () => {
  this.setState({ loader: true})

 

  const response = await api.get("/usuario", { headers: {"Authorization" : `Bearer ${ localStorage.getItem('@hortech:token')}`} } );
  this.setState({ usuarios: response.data})
  this.setState({ loader: false})
  
}

//====================================================================================
                      // CONTROLA ABERTURA E FECHAMENTO MODALS

        modal = async (param) => {
          switch (param) {
            case 'menu':
            this.setState({ modalMenu: !this.state.modalMenu});
            break;
      
      
            case 'alterar':
            this.setState({nomeTela: "ALTERA USUARIO"})
            this.setState({ modalMenu: false});
            this.setState({ modalAltera: !this.state.modalAltera});
            break;

            case 'trocarSenha':
            this.setState({...this.state.usuarioSelecionado, password: ""});
            this.setState({ modalMenu: false});
            this.setState({ modalTrocaSenha: true});
            break;
      
            case 'adicionar':
            this.setState({ usuarioSelecionado:[]});
            this.setState({ nomeTela: "ADICIONA USUARIO"});
            this.setState({ modalAltera: !this.state.modalAltera});
            break;

            case 'excluir':
            this.setState({ modalMenu: false});
            this.setState({ modalExcluir: !this.state.modalExcluir}); 
            break;
      
      
            default:
            break;
          }
        }


//================================================================================
              // CAPTURA DADOS AO PREENCHER FORMULARIO

              handleChange(event) { 

                const data = this.state.usuarioSelecionado;
                const campo = event.target.name;
      
                if(campo === 'tipo'){
                  switch (event.target.value.toUpperCase()) {
      
                    case 'USUARIO':
                      data[campo] = event.target.value.toUpperCase();
                      this.setState({ usuarioSelecionado: data });
                      this.setState({ defaultSelect: "USUARIO"});
                    break;
      
                    case 'SUPERVISOR':
                      data[campo] = event.target.value.toUpperCase();
                      this.setState({ usuarioSelecionado: data });
                      this.setState({ defaultSelect: "SUPERVISOR"});
                    break;
      
                    default:
                    break
                  }
                
                }else{
                  data[campo] = event.target.value.toUpperCase();
                  this.setState({ usuarioSelecionado: data });
                }  

        }
              
//=========================================================================================
                      // ALTERA / ADICIONA DISPOSITIVOS

  alteraAdiciona = async (param) => {

    if (param === "ADICIONA USUARIO"){

      this.setState({modalAltera: false})
      this.setState({modalSenha: true}) 
      
    }else{
      
        await api.put(`/usuario/${this.state.usuarioSelecionado._id}`, this.state.usuarioSelecionado, { headers: {"Authorization" : `Bearer ${ localStorage.getItem('@hortech:token')}`} });
        this.setState({modalAltera: false})
        this.carregaUsuarios();
        this.setState({usuarioSelecionado: []})
  
    } 
  }

  //=========================================================================================

  cadastraUsuario = async () => {

        const data = {}
        data.nome = this.state.usuarioSelecionado.nome;
        data.email = this.state.usuarioSelecionado.email;
        data.tipo = this.state.usuarioSelecionado.tipo;
        data.telefone = this.state.usuarioSelecionado.telefone;
        data.codigo = this.state.usuarioSelecionado.codigo;
        data.password = this.state.usuarioSelecionado.password;
      
        await api.post('/usuario', data, { headers: {"Authorization" : `Bearer ${ localStorage.getItem('@hortech:token')}`} } );
        this.setState({modalSenha: false})
        this.carregaUsuarios();
        this.setState({usuarioSelecionado: []})

  }

    //=========================================================================================

   trocaSenhaUsuario = async () => {

    this.setState({ modalTrocaSenha: false});
    await api.put(`/usuario/${this.state.usuarioSelecionado._id}`, this.state.usuarioSelecionado, { headers: {"Authorization" : `Bearer ${ localStorage.getItem('@hortech:token')}`} });
    this.carregaUsuarios();
    this.setState({usuarioSelecionado: []})


}


  //======================================================================================
                      // EXCLUI USUARIO

  excluirUsuario = async () => {
    this.setState({ modalExcluir: false});

    await api.delete(`/usuario/${this.state.usuarioSelecionado._id}`, { headers: {"Authorization" : `Bearer ${ localStorage.getItem('@hortech:token')}`} }); 

    this.carregaUsuarios();
    this.setState({usuarioSelecionado: []})
  }


render(){

  const onRowClick = (state, rowInfo, column, instance) => {
    return {
        onClick: e => {
          this.setState({usuarioSelecionado:rowInfo.original })
          console.log(rowInfo.original)
          this.modal("menu")
        }
    }
  }


  return (
    
    <React.Fragment>

  {/* ===================================================================================================================================== */} 


             <div className="card" id="navTabela">
              <h3 className="card-header text-center font-weight-bold text-uppercase py-4">CADASTRO DE USUARIOS</h3>

              <MDBBtn outline color="success" onClick={() => this.modal('adicionar')}>ADICIONAR</MDBBtn>

              <div id="table" className="table-editable">
                 <div className="card-body">       
                    <ReactTable
                      data={this.state.usuarios}
                      columns={this.state.colunas}
                      defaultPageSize={7}
                      className="-striped -highlight"
                      getTrProps={onRowClick}
                    />
              </div>
              </div>
              </div>
    {/* ===================================================================================================================================== */} 

               <Container >
                <Modal isOpen={this.state.modalExcluir} frame position="top">
                <ModalBody className="text-center">
                 <h3>Deseja realmente excluir o usuario : <b>{this.state.usuarioSelecionado.nome}</b><p/></h3>
                <button type="button" className="btn btn-outline-danger waves-effect" onClick={() =>  this.excluirUsuario()}>EXCLUIR</button>
                <button type="button" className="btn btn-outline-secondary waves-effect"  onClick={() =>  this.modal("excluir")}>SAIR</button>
                </ModalBody>
              </Modal>
              </Container>

   {/* ===================================================================================================================================== */} 

                                {/* = MODAL MENU AO CLICAR = */}

                                <Container>
                <Modal isOpen={this.state.modalMenu}   frame position="top">
                <ModalBody className="text-center">
                Usuario selecionado: <b>{this.state.usuarioSelecionado.nome}</b><p/>
                <button type="button" className="btn btn-outline-primary waves-effect" onClick={() => this.modal("alterar")}   >EDITAR</button>

                <button type="button" className="btn btn-outline-primary waves-effect" onClick={() => this.modal("trocarSenha")}   >TROCAR SENHA</button>
                
                <button type="button" className="btn btn-outline-danger waves-effect" onClick={() => this.modal("excluir")} >EXCLUIR</button>

                <button type="button" className="btn btn-outline-secondary waves-effect"  onClick={() => this.modal("menu")}>SAIR</button>
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
                      <input type="text" className="form-control" name="nome"  value={this.state.usuarioSelecionado.nome || ''} onChange={this.handleChange}/>
                      </div>


                     {/* ===================================================================================================================================== */} 

                     <div className="form-group col-md-3 ml-auto">
                      <label >Tipo:</label>
                        <select className="browser-default custom-select" id="tipo" name="tipo" defaultValue={this.state.usuarioSelecionado.tipo}  onChange={this.handleChange}>
                        <option value="">&nbsp;</option>
                        <option value="USUARIO">USUARIO</option>
                          <option value="SUPERVISOR">SUPERVISOR</option>
                         
                        </select>
                      </div> 

                     {/* ===================================================================================================================================== */} 



                      <div className="form-group col-md-6 auto">
                      <label htmlFor="exampleFormControlTextarea2">Telefone</label>
                      <input type="text" className="form-control" name="telefone"  value={this.state.usuarioSelecionado.telefone || ''} onChange={this.handleChange}/>
                      </div>

                      <div className="form-group col-md-6 auto">
                      <label htmlFor="exampleFormControlTextarea2">Codigo</label>
                      <input type="text" className="form-control" name="codigo" value={this.state.usuarioSelecionado.codigo || ''} onChange={this.handleChange}/>
                      </div>

                      <div className="form-group col-md-12 ml-auto">
                        <label htmlFor="exampleFormControlTextarea2">E-mail: </label>
                        <input type="text" className="form-control" name="email"  value={this.state.usuarioSelecionado.email || ''} onChange={this.handleChange}/>
                        
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
                  

 {/* ===================================================================================================================================== */} 

        <MDBModal isOpen={this.state.modalSenha} size="sm">
        <MDBModalHeader><center>DIGITE A SENHA</center></MDBModalHeader>
        <MDBModalBody>
        <input type="password" className="form-control" name="password"  value={this.state.usuarioSelecionado.password || ''} onChange={this.handleChange}/>
        </MDBModalBody>
        <MDBModalFooter>
        <MDBBtn color="primary" size="sm" onClick={() =>  this.cadastraUsuario()}>SALVAR</MDBBtn>
        </MDBModalFooter>
        </MDBModal>


 {/* ===================================================================================================================================== */} 

        <MDBModal isOpen={this.state.modalTrocaSenha} size="sm">
        <MDBModalHeader><center>DIGITE A SENHA</center></MDBModalHeader>
        <MDBModalBody>
        <input type="password" className="form-control" name="password"  value={this.state.usuarioSelecionado.password || ''} onChange={this.handleChange}/>
        </MDBModalBody>
        <MDBModalFooter>
        <MDBBtn color="primary" size="sm" onClick={() =>  this.trocaSenhaUsuario()}>SALVAR</MDBBtn>
        </MDBModalFooter>
        </MDBModal>

{/* ===================================================================================================================================== */} 

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

       

    </React.Fragment>
  )
}

}

export default Usuarios;