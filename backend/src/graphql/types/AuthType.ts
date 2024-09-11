import { GraphQLObjectType, GraphQLString } from "graphql";
import { UserType } from './UserType'

export const AuthSignUpType = new GraphQLObjectType({
  name: "AuthSignUpType",
  fields: () => ( {
    token: {type: GraphQLString},
    user : {type: UserType}
  }
 ),
});
