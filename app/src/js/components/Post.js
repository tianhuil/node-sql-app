import React from 'react';

const Post = (props) => (
  <div>
    <h3>{props.node.headline}</h3>
    <p>
      { props.node.personByAuthorId.fullName &&
          <em>{props.node.personByAuthorId.fullName}</em> }
      &nbsp;&nbsp;
      { props.node.topic &&
          <span>({props.node.topic})</span> }
    </p>
    <p>{ props.node.summary }</p>
  </div>
)

export default Post
