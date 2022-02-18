import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { GET_FORMS } from "../queries";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { usePrompt } from "../../../../../../../resources/backend/js/tmp-prompt";
import { useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Error from "../../../../../../../resources/backend/js/components/Error";
import { Select } from "../../../../../../../resources/backend/js/components/Form/Select";
import Loading from "../../../../../../../resources/backend/js/components/Loading";

const schema = yup.object({
    form: yup.number().required().positive(),
});

const FormBlockEditor = forwardRef(({ content, save }, ref) => {
    const [cardTemplates, setCardTemplates] = useState([]);
    const {
        control,
        formState: { isDirty, errors },
        handleSubmit,
        register,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    });
    // const formValue = useWatch({ name: 'form', control });
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

            setValue('template', json.template);

            // const cardTemplates = getFormsResult.data.cardTemplates;
            // cardTemplates.forEach(cardTemplate => {
            //     if (cardTemplate.id == json.template) {
            //         const fields = JSON.parse(cardTemplate.config);

            //         fields.forEach(field => {
            //             setValue(field.id, json[field.id]);
            //         });
            //     }
            // });
        }
    }, [getFormsResult.loading, getFormsResult.data, forms]);

    // useEffect(() => {
    //     if (formValue > 0) {
    //         const forms = getFormsResult.data.forms;

    //         forms.forEach(cardTemplate => {
    //             if (cardTemplate.id == formValue) {
    //                 setFields(JSON.parse(cardTemplate.config));
    //             }
    //         });
    //     }
    // }, [formValue]);

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