import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

const query = gql`
query Query($id: Int!) {
  postById(id: $id) {
    id
    personByAuthorId {
      id
      fullName
    }
    topic
    headline
    body
  }
}
`

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

const OptionsWithNull = (props) => (
  <div className="form-group">
    <label htmlFor={props.id} className="form-text text-muted">{props.name}</label>
    <select className="form-control" value={props.select ? props.select : "null"} id={props.id}>
      {
        props.options.map(o => <option key={o.value} value={o.value}>{o.name}</option>)
      }
      <option key="null" value="null">Null</option>
    </select>
  </div>
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

const EditPost = ({match}) => {
  return <Query query={query} variables={{ id: parseInt(match.params.id) }} >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return <form>
        <div className="form-group">
          <label htmlFor="headline" className="form-text text-muted">Headline</label>
          <input type="text" className="form-control" id="headline" aria-describedby="emailHelp" value={data.postById.headline} />
        </div>
        <div className="row">
          <div className="col-6">
            <AuthorsOptions select={data.postById.personByAuthorId.id}/>
          </div>
          <div className="col-6">
            <PostTopicsOptions select={data.postById.topic}/>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="headline" className="form-text text-muted">Body</label>
          <textarea className="form-control" id="body" rows="5" value={data.postById.body}>
          </textarea>
        </div>
      </form>
    }}
  </Query>
}

export default EditPost
