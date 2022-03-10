import { faBook } from "@fortawesome/pro-duotone-svg-icons";
import { FormBlockEditor, FormPreview, FormTitle } from "./Form";

export const contentTypeGroups = [
    {
        name: 'Form',
        types: [
            {
                id: 'form-form',
                name: 'Form',
                icon: faBook,
                blockEditor: FormBlockEditor,
                blockTitle: FormTitle,
                blockPreview: FormPreview,
                hidePreviewDetails: true,
            },
        ],
    },
];