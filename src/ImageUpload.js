import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { db, storage } from "./Firebase";
import firebase from "firebase";
import './ImageUpload.css';

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState();
  const [img, setImg] = useState();

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTaks = storage.ref(`images/${img.name}`).put(img);

    uploadTaks.on(
      "state_changed",
      (snapshot) => {
        //progress function..
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //Error function..
        console.log(error);
        alert(error.message);
      },
      () => {
        //Complete function...
        storage
          .ref("images")
          .child(img.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imgurl: url,
              username: username,
            });
            setProgress(0);
            setImg(null);
            setCaption("");
          });
      }
    );
  };
  return (
    <>
      <div className="imageupload">
        <progress className="img_progress" value={progress} max="100" />
        <input
          className="post_caption"
          type="text"
          placeholder="Caption"
          onChange={(e) => setCaption(e.target.value)}
          value={caption}
        />
        <input type="file" onChange={handleChange} />
        <Button onClick={handleUpload}>POST</Button>
      </div>
    </>
  );
}

export default ImageUpload;
