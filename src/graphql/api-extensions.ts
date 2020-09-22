import { gql } from 'apollo-server-core';

export const shopApiExtensions = gql`
    extend type Query {
        generateBraintreeClientToken(orderId: ID!): String!
    }
`;