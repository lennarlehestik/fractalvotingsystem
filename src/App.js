import logo from "./logo.svg";
import "./App.css";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { UALProvider, withUAL } from "ual-reactjs-renderer";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// TODO: remove if you use react hooks?
import copy from "copy-to-clipboard";
import { useSearchParamsState } from 'react-use-search-params-state'
import * as objectSha from 'object-sha'
import { CSSTransition } from "react-transition-group";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
};

const inputDefaults = {
  delegate: { type: 'string', default: "" },
  groupnumber: { type: 'number', default: null },
  vote1: { type: 'string', default: "" },
  vote2: { type: 'string', default: "" },
  vote3: { type: 'string', default: "" },
  vote4: { type: 'string', default: "" },
  vote5: { type: 'string', default: "" },
  vote6: { type: 'string', default: "" },
}

function App(props) {

  const [landing, setLanding] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const [inputs, setInputs] = useSearchParamsState(inputDefaults); 
  const [accountname, setAccountName] = useState("");
  const [consensusId, setConsensusId] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const nodeRef = useRef(null);


  const handleOpen = async () => {
    const hashable = objectSha.hashable(inputs);
    const inputsHash = await objectSha.digest(hashable, 'SHA-256');
    setConsensusId(inputsHash.substring(0, 2) + " " + inputsHash.substring(2, 4) +
      " " + inputsHash.substring(4, 6) + " " + inputsHash.substring(6, 8));
    setOpen(true);
  }
  /*
  const sign = async () => {
    if (activeUser) {
      try {
        const transaction = {
          actions: [
            {
              account: "eden.fractal",
              name: "sign",
              authorization: [
                {
                  actor: displayaccountname(), // use account that was logged in
                  permission: "active",
                },
              ],
              data: {
                signer: displayaccountname(),
              },
            },
          ],
        };
        await activeUser.signTransaction(transaction, {
          broadcast: true,
          expireSeconds: 300,
        });
        swal_success(`Successfully submitted!`);
      } catch (e) {
        swal_error(e);
      }
    }
  };
*/
  const vote = async () => {
    if (activeUser) {
      // could be more elegant than if (vote6 == "")
      if (inputs.vote6 == "") {
        let voterlist = [inputs.vote5, inputs.vote4, inputs.vote3, inputs.vote2, inputs.vote1];
        try {
          const transaction = {
            actions: [
              {
                account: "eden.fractal",
                name: "submitcons",
                authorization: [
                  {
                    actor: displayaccountname(), // use account that was logged in
                    permission: "active",
                  },
                ],
                data: {
                  submitter: displayaccountname(),
                  groupnr: parseInt(inputs.groupnumber),
                  rankings: voterlist,
                },
              },
              {
                account: "edenfractest",
                name: "electdeleg",
                authorization: [
                  {
                    actor: displayaccountname(), // use account that was logged in
                    permission: "active",
                  },
                ],
                data: {
                  elector: displayaccountname(),
                  delegate: inputs.delegate,
                  groupnr: parseInt(inputs.groupnumber),
                },
              },
            ],
          };
          await activeUser.signTransaction(transaction, {
            broadcast: true,
            expireSeconds: 300,
          });
          swal_success(`Successfully submitted!`);
        } catch (e) {
          swal_error(e);
        }
      } else {
        let voterlist = [inputs.vote6, inputs.vote5, inputs.vote4, inputs.vote3, inputs.vote2, inputs.vote1];
        try {
          const transaction = {
            actions: [
              {
                account: "eden.fractal",
                name: "submitcons",
                authorization: [
                  {
                    actor: displayaccountname(), // use account that was logged in
                    permission: "active",
                  },
                ],
                data: {
                  submitter: displayaccountname(),
                  groupnr: parseInt(inputs.groupnumber),
                  rankings: voterlist,
                },
              },
              {
                account: "edenfractest",
                name: "electdeleg",
                authorization: [
                  {
                    actor: displayaccountname(), // use account that was logged in
                    permission: "active",
                  },
                ],
                data: {
                  elector: displayaccountname(),
                  delegate: inputs.delegate,
                  groupnr: parseInt(inputs.groupnumber),
                },
              },
            ],

          };
          await activeUser.signTransaction(transaction, {
            broadcast: true,
            expireSeconds: 300,
          });
          swal_success(`Successfully submitted!`);
        } catch (e) {
          swal_error(e);
        }
      }
    }
  };
  const shareLink = () => {
    const url = window.location.href;

    if (copy(url, { debug: true })) {
      swal_success("Link copied to clipboard!");
    } else {
      swal_error("Were not able to copy to clipboard.");
    }
  }
  
  const swal_success = (message) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      background: '#190087',
      showConfirmButton: false,
      timer: 8000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: "success",
      title: "<div style='color:white'>" + message + "</div>",
    });
  };

  const swal_error = (message) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      background: '#190087',
      timer: 8000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: "error",
      title: "<div style='color:white'>" + message + "</div>",
    });
  };

  const {
    ual: { showModal, hideModal, activeUser, login, logout },
  } = props;
  useEffect(() => {
    if (activeUser) {
      const accountName = activeUser.getAccountName();
      accountName.then(function (result) {
        setAccountName(result);
      });
    }
  }, [activeUser]);

  const displayaccountname = () => {
    if (accountname) {
      return accountname;
    }
  };

  const logmeout = () => {
    logout();
    setAccountName("");
  };

  /*
          <TextField
            onChange={(e) => setSubmitter(e.target.value)}
            label="Your name"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />
          */

  return (
    <div className="App">
      {showButton &&
        <header className="App-header">

          <div class="zeos"><img src="edenlogo1.png" width="350px"/></div>
          <img src="edensymbol.png" width="18%" class="logo" />
          <button class="button-64 votebutton" role="button" onClick={() => setLanding(true)}><span class="text">Continue</span></button>
          <div class="bg-animation">
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>
            <div id="stars4"></div>
          </div>
        </header>
      }
      <CSSTransition
        in={landing}
        nodeRef={nodeRef}
        timeout={300}
        classNames="alert"
        unmountOnExit
        onEnter={() => setShowButton(false)}
      >
        <div ref={nodeRef}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
            {" "}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please make sure submission represents consensus of a group.
            <br/><br/>
            To help with that, check with other members if they see the same character sequence here: <b>{consensusId}</b>
            <br/><br/>
            If it's the same your submissions are identical (so you're in consensus).
          </Typography>
          <br></br>
          

          {accountname == "" ? (
                       <button
                       variant="contained"
                       class="button-64 button-64-varwidth"
                       //onClick={() => sign()}
                       
                       onClick={() => showModal()}
                       
                     >
                       <span>
                       Sign in
                       </span>
                     </button>
                    ) : (
                      <button
                      variant="contained"
                      class="button-64 button-64-varwidth"
                      //onClick={() => sign()}
                      
                      onClick={() => vote()}
                      
                    >
                      <span>
                      Yeah baby, push it on chain!
                      </span>
                    </button>
                      )}
        </Box>
      </Modal>
      <div class="main-menu">
      <button onClick={() => window.open(`https://mindweb.io/EdenFractalProposals.html`, "_blank")} className="menu-trigger"  >
                <span>MindMap</span>
              </button>
           
            {accountname == "" ? (
              <button onClick={() => showModal()} className="menu-trigger">
                <span>Sign in</span>
              </button>
            ) : (
                <button onClick={() => logmeout()} className="menu-trigger">
                  <span>{displayaccountname()}</span>
                </button>
              )}


              
          </div>

      <header className="App-header">
          <div class="input-wrapper">
          <input
            onChange={(e) => setInputs({ delegate: e.target.value })}
            defaultValue={inputs.delegate ?? ""}
            label="Delegate"
            placeholder="Delegate"
            class="input-field"

          />
          </div>
          <div class="input-wrapper">
          <input
            onChange={(e) => setInputs({ groupnumber: e.target.value })}
            defaultValue={inputs.groupnumber ?? ""}
            label="Group number"
            placeholder="Group number"
            class="input-field"

          />
          </div>
          <div class="input-wrapper">
          <input
            onChange={(e) => setInputs({ vote1: e.target.value })}
            defaultValue={inputs.vote1 ?? ""}
            label="Level 6"
            placeholder="Level 6"
            class="input-field"
          />
          </div>
          <div class="input-wrapper">
          <input
            onChange={(e) => setInputs({ vote2: e.target.value })}
            defaultValue={inputs.vote2 ?? ""}
            label="Level 5"
            placeholder="Level 5"
            class="input-field"
          />
          </div>
          <div class="input-wrapper">
          <input
            onChange={(e) => setInputs({ vote3: e.target.value })}
            defaultValue={inputs.vote3 ?? ""}
            label="Level 4"
            placeholder="Level 4"
            class="input-field"
          />
          </div>
          <div class="input-wrapper">
          <input
            onChange={(e) => setInputs({ vote4: e.target.value })}
            defaultValue={inputs.vote4 ?? ""}
            label="Level 3"
            placeholder="Level 3"
            class="input-field"
          />
          </div>
          <div class="input-wrapper">
          <input
            onChange={(e) => setInputs({ vote5: e.target.value })}
            defaultValue={inputs.vote5 ?? ""}
            label="Level 2"
            placeholder="Level 2"
            class="input-field"
          />
          </div>
          <div class="input-wrapper">
          <input
            onChange={(e) => setInputs({ vote6: e.target.value })}
            defaultValue={inputs.vote6 ?? ""}
            label="Level 1"
            placeholder="Level 1"
            class="input-field"
          />
          </div>
          <button
            class="button-64"
            onClick={handleOpen}
          >
            <span class="text">
            Submit
            </span>
          </button>
          <button
            class="button-64"
            onClick={() => shareLink()}
          >
            <span class="text">
            Share
            </span>
          </button>
      </header>
      </div>
      </CSSTransition>
    </div>
    
  );
}

export default withUAL(App);
