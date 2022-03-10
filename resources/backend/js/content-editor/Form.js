import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { GET_FORMS } from "../queries";
import { Select } from "../../../../../js/components/Form/Select";
import { useForm } from "react-hook-form";
import { usePrompt } from "../../../../../js/tmp-prompt";
import { useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Error from "../../../../../js/components/Error";
import Loading from "../../../../../js/components/Loading";

const schema = yup.object({
    form: yup.number().required().positive(),
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
        <div>
            Form <span className="fw-normal">- {formName}</span>
        </div>
    );
};

export const FormPreview = () => {
    return null;
};

export const FormBlockEditor = forwardRef(({ content, save }, ref) => {
    const {
        formState: { isDirty, errors },
        handleSubmit,
        register,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [forms, setForms] = useState([]);
    const getFormsResult = useQuery(GET_FORMS);

    const handleSave = (data) => {
        save(JSON.stringify(data));
    };

    const handleError = () => {
        throw new Error();
    };

    useImperativeHandle(ref, () => ({
        save() {
            return handleSubmit(handleSave, handleError)();
        }
    }));

    usePrompt('Are you sure you want to leave this page? You will lose any unsaved data.', isDirty);

    const loading = getFormsResult.loading;
    const error = getFormsResult.error;

    useEffect(() => {
        if (getFormsResult.loading === false && getFormsResult.data) {
            let forms = getFormsResult.data.forms;
            forms = forms.map(cardTemplate => ({
                value: cardTemplate.id,
                label: cardTemplate.name,
            }));
            forms.unshift({ value: 0, label: 'Choose form...' });
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
                    setValue(field, json[field]);
                }
            }
        }
    }, [getFormsResult.loading, getFormsResult.data, forms]);

    if (loading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <div>
            <Select
                label="Form"
                options={forms}
                errors={errors}
                {...register('form')}
            />
        </div>
    );
});

export default FormBlockEditor;