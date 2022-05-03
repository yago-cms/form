import { useMutation, useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { Checkbox, Error, FieldActions, Input, Loading, Page, PageCard, PageContent, Select, Textarea } from "../../../../../cms/resources/js/module";
import { GET_FORM, GET_FORMS_PAGINATED, UPSERT_FORM } from "../../queries";

const schema = yup.object({
  name: yup.string().required(),
  key: yup.string().required(),
  settings: yup.object().shape({
    successMessage: yup.string(),
  }),
  fields: yup.array().of(
    yup.object().shape({
      type: yup.string().required(),
      label: yup.string().required(),
      fields: yup.array().of(
        yup.object().shape({
          option: yup.string().required(),
        }),
      ),
    }),
  ),
});

const fieldTypes = [
  {
    value: '',
    label: 'Choose type...',
  },
  {
    value: 'text',
    label: 'Text',
  },
  {
    value: 'textarea',
    label: 'Textarea',
  },
  {
    value: 'checkbox',
    label: 'Checkbox',
  },
  {
    value: 'dropdown',
    label: 'Dropdown',
  },
];

const SubFields = ({ field, index }) => {
  const { fields, remove, append, swap } = useFieldArray({
    name: `fields.${index}.fields`
  });

  if (field.type == 'dropdown') {
    return <>
      {fields.map((field, subIndex) => {
        return (
          <PageCard
            key={field.id}
            footer={
              <FieldActions
                fields={fields}
                index={subIndex}
                remove={remove}
                swap={swap}
              />
            }
          >
            <Input
              label="Option"
              name={`fields.${index}.fields.${subIndex}.option`}
            />
          </PageCard>
        )
      })}

      <Button onClick={() => append({})}>
        Add option
      </Button>
    </>;
  }

  return null;
};

const EmailSettings = () => {
  const { fields, append, remove, swap } = useFieldArray({
    name: 'recipents',
    keyName: 'key',
  });

  const methods = useFormContext();

  const watchSendEmail = methods.watch('settings.sendEmail');

  return <>
    <Checkbox
      label="Send email"
      name="settings.sendEmail"
    />

    {watchSendEmail && <>
      <Input
        label="Subject"
        name="settings.subject"
      />

      {fields.map((field, index) => {
        return (
          <PageCard
            key={field.key}
            footer={
              <FieldActions
                fields={fields}
                index={index}
                remove={remove}
                swap={swap}
              />
            }
          >
            <Input
              label="E-mail"
              name={`recipents.${index}.email`}
            />
          </PageCard>
        );
      })}

      <Button onClick={() => append({})}>
        Add email
      </Button>
    </>}
  </>
};

const Fields = () => {
  const { fields, append, remove, swap, update } = useFieldArray({
    name: 'fields',
    keyName: 'key',
  });

  return <>
    {fields.map((field, index) => {
      return (
        <PageCard
          key={field.key}
          footer={
            <FieldActions
              fields={fields}
              index={index}
              remove={remove}
              swap={swap}
            />
          }
        >
          <Input
            type="hidden"
            name={`fields.${index}.name`}
          />

          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Select
                label="Type"
                name={`fields.${index}.type`}
                options={fieldTypes}
                onChange={(event) => update(index, { ...field, type: event.target.value })}
              />
            </Grid>

            <Grid item xs={3}>
              <Input
                label="Label"
                name={`fields.${index}.label`}
              />
            </Grid>

            {!['checkbox'].includes(field.type) && (
              <Grid item xs={3}>
                <Input
                  label="Placeholder"
                  name={`fields.${index}.placeholder`}
                />
              </Grid>
            )}

            <Grid item xs={3}>
              <Checkbox
                label="Required"
                name={`fields.${index}.required`}
              />
            </Grid>
          </Grid>

          <SubFields
            field={field}
            {...{ index }}
          />
        </PageCard>
      );
    })}

    <Button onClick={() => append({ name: crypto.randomUUID() })}>
      Add field
    </Button>
  </>
};

export const FormForm = () => {
  const { id } = useParams();
  const isNew = id === undefined;

  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const getFormResult = useQuery(GET_FORM, {
    variables: {
      id
    },
    skip: isNew,
  });

  const [upsertForm, upsertFormResult] = useMutation(UPSERT_FORM, {
    onCompleted: (data) => {
      navigate(`/forms/${data.upsertForm.id}`);
    },
    refetchQueries: () => [{
      query: GET_FORMS_PAGINATED,
      variables: {
        page: 1,
      }
    }]
  });

  const handleSave = (data) => {
    const { settings, fields, recipents } = data;

    const form = {
      id: !isNew ? id : null,

      name: data.name,
      key: data.key,
      config: JSON.stringify({
        settings,
        fields,
        recipents,
      }),
    };

    upsertForm({
      variables: {
        input: form
      }
    });
  };

  const Footer = () => (
    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
      <Button color="secondary" onClick={methods.handleSubmit(handleSave)}>Save</Button>
    </Box>
  );

  const heading = isNew ? 'Add form' : 'Edit form';

  const isLoading = getFormResult.loading
    || upsertFormResult.loading;
  const error = getFormResult.error
    || upsertFormResult.error;

  useEffect(() => {
    if (getFormResult.loading === false && getFormResult.data) {
      const form = getFormResult.data.form;
      const { settings, fields, recipents } = JSON.parse(form.config);

      methods.setValue('name', form.name);
      methods.setValue('key', form.key);
      methods.setValue('settings', settings);
      methods.setValue('fields', fields);
      methods.setValue('recipents', recipents);
    }
  }, [getFormResult.loading, getFormResult.data]);

  useEffect(() => {
    const subscription = methods.watch((value, { name, type }) => {
      if (name === 'name') {
        methods.setValue('key', _.kebabCase(value.name));
      }
    });

    return () => subscription.unsubscribe();
  }, [methods.watch]);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <FormProvider {...methods}>
      <Page
        heading={heading}
        footer={<Footer />}
      >
        <PageContent>
          <Input
            label="Name"
            name="name"
          />

          <Input
            label="Key"
            name="key"
            disabled
          />

          <Textarea
            label="Success message"
            name="settings.successMessage"
          />
        </PageContent>

        <PageContent heading="E-mail settings">
          <EmailSettings />
        </PageContent>

        <PageContent heading="Fields">
          <Fields />
        </PageContent>
      </Page>
    </FormProvider>
  );
}