import { useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { Error, Loading, Select, usePrompt } from "../../../../cms/resources/js/module";
import { GET_FORMS } from "../queries";

const schema = yup.object({
    form: yup.string().required(),
});

export const FormTitle = ({ content }) => {
    const { loading: isLoading, error, data } = useQuery(GET_FORMS);

    if (isLoading) return null;
    if (error) return <Error message={error.message} />

    let formName = 'N/A';

    data.forms.forEach(form => {
        if (form.id == content.form) {
            formName = form.name;
        }
    });

    return (
        <>
            Form - {formName}
        </>
    );
};

export const FormBlockEditor = forwardRef(({ content, save }, ref) => {
    const [forms, setForms] = useState([]);

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            form: ''
        }
    });

    const getFormsResult = useQuery(GET_FORMS);

    const handleSave = (data) => {
        save(JSON.stringify(data));
    };

    const handleError = () => {
        throw new Error();
    };

    useImperativeHandle(ref, () => ({
        save() {
            return methods.handleSubmit(handleSave, handleError)();
        }
    }));

    usePrompt('Are you sure you want to leave this page? You will lose any unsaved data.', methods.isDirty);

    const loading = getFormsResult.loading;
    const error = getFormsResult.error;

    useEffect(() => {
        if (getFormsResult.loading === false && getFormsResult.data) {
            let forms = getFormsResult.data.forms;

            forms = forms.map(cardTemplate => ({
                value: cardTemplate.id,
                label: cardTemplate.name,
            }));

            setForms(forms);
        }
    }, [getFormsResult.loading, getFormsResult.data]);

    useEffect(() => {
        if (getFormsResult.loading === false && getFormsResult.data) {
            if (!content) {
                return;
            }

            let json = {};

            try {
                json = JSON.parse(content);
            } catch {
                console.log('Invalid JSON');
                return;
            }

            for (const field in json) {
                if (field in schema.fields) {
                    methods.setValue(field, json[field]);
                }
            }
        }
    }, [getFormsResult.loading, getFormsResult.data, forms]);

    if (loading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <FormProvider {...methods}>
            <Select
                label="Form"
                name="form"
                options={forms}
            />
        </FormProvider>
    );
});