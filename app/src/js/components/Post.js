import React from 'react';

const Post = (props) => (
  <div>
    <h3>{props.node.headline}</h3>
    <p>
      { props.node.personByAuthorId.fullName &&
          <em className="mr-3">{props.node.personByAuthorId.fullName}</em> }
      { props.node.topic &&
          <span className="mr-3">({props.node.topic})</span> }
      <button type="button" className="btn btn-primary btn-sm">Edit</button>
    </p>
    <p>{ props.node.summary }</p>
  </div>
)

export default Post
