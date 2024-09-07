import { gql } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      id
      name
      email
    }
  }
`;

export default LOGIN_MUTATION;
