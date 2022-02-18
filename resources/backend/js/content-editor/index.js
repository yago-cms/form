import { faBook, faColumns, faImage, faText } from "@fortawesome/pro-duotone-svg-icons";
import FormBlockEditor from "./FormBlockEditor";

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
            },
        ],
    },
];