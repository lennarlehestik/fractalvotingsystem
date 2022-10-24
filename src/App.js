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

function App(props) {
  const [delegate, setDelegate] = useState("");
  const [groupnumber, setGroupnumber] = useState("");
  const [vote1, setVote1] = useState("");
  const [vote2, setVote2] = useState("");
  const [vote3, setVote3] = useState("");
  const [vote4, setVote4] = useState("");
  const [vote5, setVote5] = useState("");
  const [vote6, setVote6] = useState("");
  const [accountname, setAccountName] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const sign = async () => {
    if (activeUser) {
      try {
        const transaction = {
          actions: [
            {
              account: "edenfractest",
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
      if (vote6 == "") {
        let voterlist = [vote5, vote4, vote3, vote2, vote1];
        try {
          const transaction = {
            actions: [
              {
                account: "edenfractest",
                name: "submitcons",
                authorization: [
                  {
                    actor: displayaccountname(), // use account that was logged in
                    permission: "active",
                  },
                ],
                data: {
                  submitter: displayaccountname(),
                  groupnr: parseInt(groupnumber),
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
                  delegate: delegate,
                  groupnr: parseInt(groupnumber),
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
        let voterlist = [vote6, vote5, vote4, vote3, vote2, vote1];
        console.log(voterlist);
        try {
          const transaction = {
            actions: [
              {
                account: "edenfractest",
                name: "submitcons",
                authorization: [
                  {
                    actor: displayaccountname(), // use account that was logged in
                    permission: "active",
                  },
                ],
                data: {
                  submitter: displayaccountname(),
                  groupnr: parseInt(groupnumber),
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
                  delegate: delegate,
                  groupnr: parseInt(groupnumber),
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
            Eden Contributor Agreement{" "}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Agreement could be accessed via this{" "}
            <a
              href="https://eosauthority.com/account/edenfractest?network=eos&scope=edenfractest&table=agreement&limit=10&index_position=1&key_type=i64&reverse=0&mode=contract&sub=tables"
              target="_blank"
            >
              {" "}
              link
            </a>
            . By clicking sign you agree to the terms of the agreement.
          </Typography>
          <br></br>
          <Button
            variant="contained"
            sx={{ width: "100%" }}
            onClick={() => sign()}
          >
            Sign
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
            onClick={handleOpen}
          //onClick={() => handleShow23()}
          >
            Sign the agreement
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
            onChange={(e) => setDelegate(e.target.value)}
            label="Delegate"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />
          <TextField
            onChange={(e) => setGroupnumber(e.target.value)}
            label="Group number"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />

          <TextField
            onChange={(e) => setVote1(e.target.value)}
            label="Level 6"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />
          <TextField
            onChange={(e) => setVote2(e.target.value)}
            label="Level 5"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />
          <TextField
            onChange={(e) => setVote3(e.target.value)}
            label="Level 4"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />
          <TextField
            onChange={(e) => setVote4(e.target.value)}
            label="Level 3"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />
          <TextField
            onChange={(e) => setVote5(e.target.value)}
            label="Level 2"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />
          <TextField
            onChange={(e) => setVote6(e.target.value)}
            label="Level 1"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />
          <Button
            variant="contained"
            sx={{ width: "100%" }}
            onClick={() => vote()}
          >
            Submit
          </Button>
        </Paper>
      </header>
    </div>
  );
}

export default withUAL(App);
