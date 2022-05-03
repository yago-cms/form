import { gql } from "@apollo/client";

// Form
export const GET_FORMS = gql`
    query GetForms($page: Int!) {
        forms(first: 25, page: $page) @connection(key: "form") {
            data {
                id

                name
                key
                config
            }

            paginatorInfo {
                total
            }
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