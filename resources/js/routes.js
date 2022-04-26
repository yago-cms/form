import { FormForm } from "./pages/Form/FormForm";
import { FormIndex } from "./pages/Form/FormIndex";

export default [
    {
        path: '/forms',
        exact: true,
        component: <FormIndex />,
    },
    {
        path: '/forms/create',
        component: <FormForm />,
    },
    {
        path: '/forms/:id',
        component: <FormForm />,
    },
];
