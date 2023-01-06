import logo from "./logo.svg";
import "./App.css";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { UALProvider, withUAL } from "ual-reactjs-renderer";
import React, { useState, useEffect } from "react";
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
  console.log("props: ", props);

  const [inputs, setInputs] = useSearchParamsState(inputDefaults); 
  const [accountname, setAccountName] = useState("");
  const [consensusId, setConsensusId] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const handleOpen = async () => {
    const hashable = objectSha.hashable(inputs);
    const inputsHash = await objectSha.digest(hashable, 'SHA-256');
    setConsensusId(inputsHash.substring(0, 2) + " " + inputsHash.substring(2, 4) +
      " " + inputsHash.substring(4, 6) + " " + inputsHash.substring(6, 8));
    setOpen(true);
  }
  
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
    console.log('Url: ', url);

    if (copy(url, { debug: true })) {
      swal_success("Link copied to clipboard!");
    } else {
      swal_error("Were not able to copy to cliboard.");
    }
  }
  const swal_success = (message) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
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
      title: message,
    });
  };

  const swal_error = (message) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 8000,
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            This is Patrick speaking...{" "}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please make sure submission represents consensus of a group.
            <br/><br/>
            To help with that check with other members if they see the same character sequence here: <b>{consensusId}</b>
            <br/><br/>
            If it's the same your submissions are identical.
          </Typography>
          <br></br>
          <Button
            variant="contained"
            sx={{ width: "100%" }}
            //onClick={() => sign()}
            onClick={() => vote()}
          >
            Yeah baby, push it on chain!
          </Button>
        </Box>
      </Modal>
      <AppBar
        position="fixed"
        color="transparent"
        style={{
          "background-color": "white",
          height: "64px",
        }}
      >
        <Toolbar>
          <Button
            sx={{ position: "absolute", right: "180px" }}
            style={{
              color: "inherit",
            }}
          //onClick={handleOpen}
          //onClick={() => handleShow23()}
          >
            Code is law
          </Button>
          {accountname == "" ? (
            <Button
              sx={{ position: "absolute", right: "40px" }}
              style={{
                color: "inherit",
                //left: "1600px",
                float: "right",

                "border-radius": "50px",
              }}
              onClick={() => showModal()}
            >
              Log in
            </Button>
          ) : (
              <Button
                sx={{ position: "absolute", right: "40px" }}
                style={{ color: "inherit", "border-radius": "50px" }}
                onClick={() => logmeout()}
              >
                {displayaccountname()}
              </Button>
            )}
        </Toolbar>
      </AppBar>

      <header className="App-header">
        <Paper elevation={3} sx={{ padding: "20px", width: "400px" }}>
          <TextField
            onChange={(e) => setInputs({ delegate: e.target.value })}
            defaultValue={inputs.delegate ?? ""}
            label="Delegate"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />
          <TextField
            onChange={(e) => setInputs({ groupnumber: e.target.value })}
            defaultValue={inputs.groupnumber ?? ""}
            label="Group number"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />

          <TextField
            onChange={(e) => setInputs({ vote1: e.target.value })}
            defaultValue={inputs.vote1 ?? ""}
            label="Level 6"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />
          <TextField
            onChange={(e) => setInputs({ vote2: e.target.value })}
            defaultValue={inputs.vote2 ?? ""}
            label="Level 5"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />
          <TextField
            onChange={(e) => setInputs({ vote3: e.target.value })}
            defaultValue={inputs.vote3 ?? ""}
            label="Level 4"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />
          <TextField
            onChange={(e) => setInputs({ vote4: e.target.value })}
            defaultValue={inputs.vote4 ?? ""}
            label="Level 3"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />
          <TextField
            onChange={(e) => setInputs({ vote5: e.target.value })}
            defaultValue={inputs.vote5 ?? ""}
            label="Level 2"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />
          <TextField
            onChange={(e) => setInputs({ vote6: e.target.value })}
            defaultValue={inputs.vote6 ?? ""}
            label="Level 1"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />
          <Button
            variant="contained"
            sx={{ width: "100%" }}

            onClick={handleOpen}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            sx={{ width: "100%" }}
            onClick={() => shareLink()}
          >
            Share
          </Button>
        </Paper>
      </header>
    </div>
  );
}

export default withUAL(App);
