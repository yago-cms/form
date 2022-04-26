import { faBlockQuote } from "@fortawesome/pro-duotone-svg-icons";
import { FormBlockEditor } from "./Form";

export const contentTypeGroups = [
    {
        name: 'Form',
        types: [
            {
                id: 'form-form',
                name: 'Form',
                icon: faBlockQuote,
                blockEditor: FormBlockEditor,
                isPreviewDetailsHidden: true,
            },
        ]
    }
];

export const contentTypeModules = [];