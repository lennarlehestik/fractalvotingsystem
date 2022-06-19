import logo from './logo.svg';
import './App.css';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { UALProvider, withUAL } from 'ual-reactjs-renderer'
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";



function App(props) {
  const [vote1, setVote1] = useState("")
  const [vote2, setVote2] = useState("")
  const [vote3, setVote3] = useState("")
  const [vote4, setVote4] = useState("")
  const [vote5, setVote5] = useState("")
  const [vote6, setVote6] = useState("")
  const [accountname, setAccountName] = useState("");
  const vote = async() => {
    if (activeUser) {
      try {
        const transaction = {
          actions: [
            {
              account: "consortiumtt",
              name: "unstakeetf",
              authorization: [
                {
                  actor: displayaccountname(), // use account that was logged in
                  permission: "active",
                },
              ],
              data: {
                user: displayaccountname()
              },
            },
          ],
        };
        await activeUser.signTransaction(transaction, {
          broadcast: true,
          expireSeconds: 300,
        });
        swal_success(`Voted!`);
      } catch (e) {
        swal_error(e);
      }
    }
  }
  const swal_success = (message) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 6000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: "success",
      title: message,
    });
  };

  const swal_error = (message) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 6000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: "error",
      title: message,
    });
  };

  const {
    ual: { showModal, hideModal, activeUser, login, logout },
  } = props;
  useEffect(()=>{
    if (activeUser) {
      const accountName = activeUser.getAccountName();
      accountName.then(function (result) {
        setAccountName(result);
      });
    }
  },[activeUser])

  const displayaccountname = () => {
    if (accountname) {
      return accountname;
    }
  };

  

  const logmeout = () => {
    logout();
    setAccountName("");
  };
  
  return (
    <div className="App">
      {accountname == "" ?
      <Button variant="contained" sx={{position:"absolute", top:"20px", right:"20px"}} onClick={() => showModal()}>Log in</Button>
      :
      <Button variant="contained" sx={{position:"absolute", top:"20px", right:"20px"}} onClick={() => logmeout()}>{displayaccountname()}</Button>
      }
      <header className="App-header">
      <Paper elevation={3} sx={{padding:"20px", width:"400px"}}>
      <TextField onChange={(e) => setVote1(e.target.value)} label="Insert name 1" variant="outlined" sx={{width:"100%", "margin-bottom":"10px"}} />
      <TextField onChange={(e) => setVote2(e.target.value)} label="Insert name 2" variant="outlined" sx={{width:"100%", "margin-bottom":"10px"}} />
      <TextField onChange={(e) => setVote3(e.target.value)} label="Insert name 3" variant="outlined" sx={{width:"100%", "margin-bottom":"10px"}} />
      <TextField onChange={(e) => setVote4(e.target.value)} label="Insert name 4" variant="outlined" sx={{width:"100%", "margin-bottom":"10px"}} />
      <TextField onChange={(e) => setVote5(e.target.value)} label="Insert name 5" variant="outlined" sx={{width:"100%", "margin-bottom":"10px"}} />
      <TextField onChange={(e) => setVote6(e.target.value)} label="Insert name 6" variant="outlined" sx={{width:"100%", "margin-bottom":"10px"}} />
      <Button variant="contained" sx={{width:"100%"}} onClick={()=> vote()}>Vote</Button>
      </Paper>
      </header>
    </div>
  );
}

export default withUAL(App);

