import logo from './logo.svg';
import './App.css';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { UALProvider, withUAL } from 'ual-reactjs-renderer'
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";



function App(props) {
  return (
    <div className="App">
      <header className="App-header">
          Admin panel
      </header>
    </div>
  );
}

export default withUAL(App);

