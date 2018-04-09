import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

const PostTopics = gql`
{
  __type(name: "PostTopic") {
    name
    enumValues {
      name
    }
    description
  }
}
`
const Authors = gql`
{
  allPeople {
    nodes {
      id
      fullName
    }
  }
}
`

const OptionsWithNull = (props) => (
  <div className="form-group">
    <label htmlFor={props.id}>{props.name}</label>
    <select className="form-control" value={props.select ? props.select : "null"} id={props.id}>
      {
        props.options.map(o => <option key={o.value} value={o.value}>{o.name}</option>)
      }
      <option key="null" value="null">Null</option>
    </select>
  </div>
)

const AuthorsOptions = (props) => (
  <Query query={Authors}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return <OptionsWithNull
        id="author"
        name="Authors"
        select={props.select}
        options={data.allPeople.nodes.map(
          n => ({value: n.id, name: n.fullName ? n.fullName : `(id: ${n.id})`})
        )}
      />
    }}
  </Query>
)

const PostTopicsOptions = (props) => (
  <Query query={PostTopics}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return <OptionsWithNull
        id="topic"
        name="Post Topics"
        select={props.select}
        options={data.__type.enumValues.map(
          v => ({value: v.name, name: v.name})
        )}
      />
    }}
  </Query>
)

export { PostTopicsOptions, AuthorsOptions };

