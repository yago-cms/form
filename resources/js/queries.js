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

export const GET_FORMS_PAGINATED = gql`
    query GetFormsPaginated($page: Int!) {
        formsPaginated(first: 25, page: $page) @connection(key: "form") {
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