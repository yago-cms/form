import { faBook } from "@fortawesome/pro-duotone-svg-icons";
import FormBlockEditor, { FormPreview, FormTitle } from "./FormBlockEditor";

export const contentTypeGroups = [
    {
        name: 'Form',
        types: [
            {
                id: 'form-form',
                name: 'Form',
                icon: faBook,
                description: 'Intelligo me intelligere.',
                blockEditor: FormBlockEditor,
                blockTitle: FormTitle,
                blockPreview: FormPreview,
                hidePreviewDetails: true,
            },
        ],
    },
];