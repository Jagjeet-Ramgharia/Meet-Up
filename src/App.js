import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { auth, db } from "./Firebase";
import { Button, makeStyles, Input } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";
function getModelStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  const modalStyle = useStyles(getModelStyle());
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user log in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user log out
        setUser(null);
      }
    });

    return () => {
      //performs some cleane up function
      unSubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);
  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
  };

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
  };
  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerimg"
                src="./images/instagram-logo.png"
                alt="image not found"
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="text"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerimg"
                src="./images/instagram-logo.png"
                alt="image not found"
              />
            </center>
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="text"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      <div className="app">
        <div className="app_header">
          <img
            className="app_headerimg"
            src="./images/instagram-logo.png"
            alt="image not found"
          />
          {user ? (
            <Button onClick={() => auth.signOut()}>Logout</Button>
          ) : (
            <div className="app_logincontainer">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )}
        </div>
        {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>You need to login fisrt</h3>
      )}
        <div className="app_post">
          <div className="app_postleft">
            {posts.map(({ id, post }) => {
              return (
                <Post
                  key={id}
                  postId={id}
                  user={user}
                  username={post.username}
                  caption={post.caption}
                  imgurl={post.imgurl}
                />
              );
            })}
          </div>
          <div className="app_postright">
            <InstagramEmbed
              url="https://instagr.am/p/Zw9o4/"
              clientAccessToken="123|456"
              maxWidth={320}
              hideCaption={false}
              containerTagName="div"
              protocol=""
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
          </div>
        </div>
      </div>

    
    </>
  );
}

export default App;
