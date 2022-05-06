import './App.css';
import Board from './board';

import {
  Provider,
  defaultTheme,
  DialogContainer,
  AlertDialog
} from '@adobe/react-spectrum';
import { Component } from 'react';

export default class App extends Component {

  constructor(props){
    super(props)
    this.showDialog = this.showDialog.bind(this)
    this.state = {
      show : false,
      message : ""
  
    }

  }

  showDialog(status, message){
    this.setState({
      show : status,
      message : message  
    })
  }


  render(){
    return (
      <div className="App">
        <header className="App-header">
          2048
        </header>
        <Provider theme={defaultTheme} UNSAFE_className="App-body">
          <Board showDialog ={this.showDialog}/>
          {this.state.show && <_Dialog message={this.state.message} showDialog ={this.showDialog}/>}
        </Provider>
      </div>
    )
  }
}



export class _Dialog extends Component{
  

  constructor(props){
    super(props)
    this.state = {
      message: this.props.message,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    // if(this.props.message !=nextProps.message){
      this.setState({message: nextProps.message,
        open: true
      })
    // }
  }

  render(){
    return <DialogContainer onDismiss={()=>{
      this.props.showDialog(false, "")
    }}>
    {
      <AlertDialog
        title="Alert"
        variant="destructive"
        primaryActionLabel="OK">
          {this.state.message}
      </AlertDialog>
    }
  </DialogContainer>
  }

}