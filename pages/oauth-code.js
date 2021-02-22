import gql from 'graphql-tag';

const UPDATE_PROJECT_ID = gql`
  mutation privateMetafieldUpsert($input: PrivateMetafieldInput!) {
      privateMetafieldUpsert(input: $input) {
        privateMetafield {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
`;



class OAuthCode extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <p>
                Code getter
            </p>
        );
    }
}

export default OAuthCode;

