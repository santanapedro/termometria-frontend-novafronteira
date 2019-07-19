import React, { Component } from 'react'
import { MDBContainer, MDBRow, MDBCol, MDBBtn, Card, CardHeader, CardBody } from 'mdbreact';

import {
    withRouter
  } from 'react-router-dom'

import api from '../../services/api';


class Login extends Component{


    componentDidMount(){
        localStorage.removeItem("@hortech:token");
    }

//==================================================================================================================

    state = {
        email: '',                  // VARIAVEIS STADE DA APLICAÇÃO
        senha: '',
    }

//==================================================================================================================

    handleSubimit = e => {
        e.preventDefault();   // AUTENTICA USUARIO NO SUBIMIT DO FORMULARIO
        this.autentica();       
    }

//==================================================================================================================


                        //FUNÇÃO PARA ATUENTICAÇÃO

    async autentica () {
        const data = {}                         //  PASSA DADOS DO FORMARIO 
        data.email = this.state.email;          //  CRIANDO UM OBJ PARA ENVIO
        data.password = this.state.senha;       //  DA REQUISIÇÃO

        const response = await api.post('/autentica', data ); //ENVIA PRO BACKEND

        if(response.data.codigo === 401){   // VERIFICA SE RETORNO ESTA CORRETO (USER / SENHA) E
            alert(response.data.error)      // EM CASO DE ERRO EXIBE MENSAGEM NA TELA
            
        }else{                              // CASO DE TRUE PARA ENVIO DA REQUISIÇÃO
           localStorage.setItem('@hortech:token', response.data.token) // ARMAZENA TOKEN AUTHE NO LOCAL STORAGE
           this.props.history.push('/') //ENVIA PARA PAGINA DE INICIO DA APLICAÇÃO
       
        }   
    }
//==================================================================================================================

    handleInputChangeEmail = e =>{
        this.setState({email: e.target.value})    
    }
                                                    /// CAPTURA DADOS DO FORMULARIO AO SER PREENCHIDO
    handleInputChangeSenha = e =>{
        this.setState({senha: e.target.value})
    }

//==================================================================================================================
    render() {
        return (
            <MDBContainer>


                <MDBRow style={{marginTop: "100px"}}>

                <MDBCol></MDBCol>


                   <Card >
                        <CardHeader>Login</CardHeader>
                        <CardBody>
                        <MDBCol >
                             <form onSubmit={ this.handleSubimit}>
                        
                        <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                        E-mail
                        </label>
                                <input
                                        value={this.state.email}
                                        onChange={ this.handleInputChangeEmail}
                                        type="email"
                                        id="defaultFormLoginEmailEx"
                                        className="form-control"
                                />
                        <br />
                        <label htmlFor="defaultFormLoginPasswordEx" className="grey-text">
                        Senha
                        </label>
                                        <input
                                        value={this.state.senha}
                                        onChange={ this.handleInputChangeSenha}
                                        type="password"
                                        id="defaultFormLoginPasswordEx"
                                        className="form-control"
                                        />

                        <div className="text-center mt-4">
                        <MDBBtn color="indigo" type="submit">Login</MDBBtn>
                        </div>
                    </form>
                    </MDBCol>
                        </CardBody>
                    </Card> 

                    
               
               
                <MDBCol></MDBCol>

                </MDBRow>
 
            </MDBContainer>

        )
    }
}

export default withRouter(Login)