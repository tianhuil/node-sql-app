import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

const query = gql`
  {
    books {
      title
      author
    }
  }
`

class BookList extends React.Component {
  render() {
    return (
      <Query query = {query}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          return (
            <div className="shopping-list">
              <h1>Book List for {this.props.name}</h1>
              <ul>
                {
                  data.books.map(book =>
                    <li><b>{book.title}:</b> {book.author}</li>
                  )
                }
              </ul>
            </div>
          )
        }}
      </Query>
    );
  }
}

export default BookList
