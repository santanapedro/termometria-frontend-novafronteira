import React, {Component} from 'react'

import api from '../../services/api';

class  Relatorios extends Component{


  componentDidMount(){
    this.validaToken()
  }
  
   async validaToken () {
      const data = {}
      data.token = localStorage.getItem('@hortech:token');
      const response = await api.post('/valida', data );
  
      if(!response.data){
          localStorage.removeItem('@hortech:token');
          this.props.history.push('/')
      }
  }

  

  render(){
    return (
      <React.Fragment>
          <h1> RELATORIOS </h1>
      </React.Fragment>
    );
  }
  }
 

export default Relatorios;