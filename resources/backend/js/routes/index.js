import FormIndex from '../pages/Form/FormIndex';
import FormForm from '../pages/Form/FormForm';

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
