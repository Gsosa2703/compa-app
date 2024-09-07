import { gql } from '@apollo/client';

const SIGNUP_MUTATION = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      id
      name
      email
      token
    }
  }
`;

export default SIGNUP_MUTATION;
