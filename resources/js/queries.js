import { gql } from "@apollo/client";

// Form
export const GET_FORMS = gql`
    query GetForms {
        forms {
            id

            name
            key
            config
        }
    }
`;

export const GET_FORM = gql`
    query GetForm($id: ID!) {
        form(id: $id) {
            id

            name
            key
            config
        }
    }
`;

export const UPSERT_FORM = gql`
    mutation UpsertForm($input: UpsertFormInput!) {
        upsertForm(input: $input) {
            id

            name
            key
            config
        }
    }
`;