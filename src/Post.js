import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./Firebase";
import firebase from "firebase";

function Post({ username, caption, imgurl, postId, user }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      console.log(postId)
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          console.log("snapshot",snapshot.docs)
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);
    console.log("These are comments",comments);
  const postComment = (e) => {
    e.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };
  return (
    <>
      <div className="post">
        <div className="post_header">
          <Avatar
            className="post_avatar"
            alt="Jagjeet"
            src="/static/images/avatar/1.jpg"
          />
          <h3>{username}</h3>
        </div>

        <img className="post_img" src={imgurl} alt="" />
        <h4 className="post_text">
          <strong>{username}</strong> {caption}
        </h4>
        <div className="post_comment">{
          comments.map((cmt)=>{
            return(
              <p>
                <strong>{cmt.username}</strong> {cmt.text}
              </p>
            )
          })
        }</div>
        {user && (
          <form className="post_commentbox">
          <input
            className="post_comments"
            type="text"
            placeholder="add a comment.."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post_button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            POST
          </button>
        </form>
        )}

      </div>
    </>
  );
}

export default Post;
