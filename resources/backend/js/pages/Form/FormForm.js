import { Checkbox } from "../../../../../../js/components/Form/Checkbox";
import { faArrowLeft, faCaretDown, faCaretUp, faTimes } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GET_FORM, GET_FORMS, UPSERT_FORM } from "../../queries";
import { Input } from "../../../../../../js/components/Form/Input";
import { Select } from "../../../../../../js/components/Form/Select";
import { Textarea } from "../../../../../../js/components/Form/Textarea";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router";
import { v4 as uuidv4 } from 'uuid';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import classNames from "classnames";
import Error from "../../../../../../js/components/Error";
import Loading from "../../../../../../js/components/Loading";
import Page from "../../../../../../js/components/Page";

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

const FieldActions = ({ index, isFirst, isLast, remove, swap }) => {
  return <div className="col">
    <div className="btn-group">
      <button
        className="btn btn-outline-secondary"
        type="button"
        onClick={() => remove(index)}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

      {!isFirst &&
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => swap(index, index - 1)}
        >
          <FontAwesomeIcon icon={faCaretUp} />
        </button>
      }
      {!isLast &&
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => swap(index, index + 1)}
        >
          <FontAwesomeIcon icon={faCaretDown} />
        </button>
      }
    </div>
  </div>
};

const SubFields = ({ field, index, errors, control, register }) => {
  const { fields, remove, append, swap } = useFieldArray({
    control,
    name: `fields.${index}.fields`
  });

  if (field.type == 'dropdown') {
    return <fieldset className="pb-3">
      <legend>Options</legend>

      {fields.map((subField, subIndex) => {
        const isFirst = subIndex == 0;
        const isLast = subIndex == fields.length - 1;

        return <div className="row" key={subIndex}>
          <div className="col-4" key={subIndex}>
            <Input
              label="Option"
              errors={errors}
              {...register(`fields.${index}.fields.${subIndex}.option`)}
            />
          </div>

          <FieldActions
            index={subIndex}
            {...{
              isFirst,
              isLast,
              remove,
              swap,
            }}
          />
        </div>
      })}

      <button
        className="btn btn-outline-secondary"
        type="button"
        onClick={() => append({})}
      >
        Add field
      </button>
    </fieldset>;
  }

  return null;
};

const EmailSettings = ({ control, errors, register, watch }) => {
  const { fields, append, remove, swap, update } = useFieldArray({
    control,
    name: 'recipents',
    keyName: 'key',
  });

  const watchSendEmail = watch('settings.sendEmail');

  return <fieldset className="mb-3">
    <legend>Email settings</legend>

    <Checkbox
      label="Send email"
      errors={errors}
      {...register('settings.sendEmail')}
    />

    {watchSendEmail && <>
      <Input
        label="Subject"
        errors={errors}
        {...register('settings.subject')}
      />

      <div className="mb-3">
        {fields.map((field, index) => {
          const isFirst = index == 0;
          const isLast = index == fields.length - 1;
          const isEven = index % 2 == 0;

          return (
            <div className={classNames('p-3 pb-0', {
              'bg-light': isEven,
            })} key={field.key}>
              <div className="row">
                <div className="col-4">
                  <Input
                    label="Email"
                    errors={errors}
                    {...register(`recipents.${index}.email`)}
                  />
                </div>

                <FieldActions
                  {...{
                    index,
                    isFirst,
                    isLast,
                    remove,
                    swap,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="btn btn-outline-secondary"
        type="button"
        onClick={() => append({})}
      >
        Add email
      </button>
    </>}
  </fieldset>
};

const Fields = ({ control, errors, register }) => {
  const { fields, append, remove, swap, update } = useFieldArray({
    control,
    name: 'fields',
    keyName: 'key',
  });

  return <fieldset>
    <legend>Fields</legend>

    <div className="mb-3">
      {fields.map((field, index) => {
        const isFirst = index == 0;
        const isLast = index == fields.length - 1;
        const isEven = index % 2 == 0;

        return (
          <div className={classNames('p-3 pb-0', {
            'bg-light': isEven,
          })} key={field.key}>
            <input
              type="hidden"
              {...register(`fields.${index}.name`)}
            />

            <div className="row">
              <div className="col">
                <Select
                  label="Type"
                  options={fieldTypes}
                  errors={errors}
                  {...register(`fields.${index}.type`, {
                    onChange: (e) => {
                      update(index, { ...field, type: e.target.value });
                    }
                  })}
                />
              </div>

              <div className="col-2">
                <Input
                  label="Label"
                  errors={errors}
                  {...register(`fields.${index}.label`)}
                />
              </div>

              <div className="col-2">
                <Input
                  label="Placeholder"
                  errors={errors}
                  {...register(`fields.${index}.placeholder`)}
                />
              </div>

              <div className="col-2">
                <Checkbox
                  label="Is required"
                  errors={errors}
                  {...register(`fields.${index}.required`)}
                />
              </div>

              <FieldActions
                {...{
                  index,
                  isFirst,
                  isLast,
                  remove,
                  swap,
                }}
              />
            </div>

            <SubFields
              field={field}
              {...{ index, errors, control, register }}
            />
          </div>
        );
      })}
    </div>

    <button
      className="btn btn-outline-secondary"
      type="button"
      onClick={() => append({ name: uuidv4() })}
    >
      Add field
    </button>
  </fieldset>
};

export default function FormForm() {
  const { id } = useParams();
  const isNew = id === undefined;
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const nameValue = useWatch({
    control,
    name: 'name',
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
    update: (cache, { data: { upsertForm } }) => {
      const data = cache.readQuery({
        query: GET_FORMS
      });

      if (data !== null) {
        const forms = _.cloneDeep(data.forms);

        if (isNew) {
          forms.push(upsertForm);
        } else {
          forms.forEach(form => {
            if (form.id === upsertForm.id) {
              form = upsertForm;
            }
          });
        }

        cache.writeQuery({
          query: GET_FORMS,
          data: {
            forms
          },
        });
      }
    },
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
    <div className="d-flex">
      <div className="ms-auto">
        <button className="btn btn-outline-primary">Save</button>
      </div>
    </div>
  );

  const actions = [
    { icon: faArrowLeft, path: '/forms' },
  ];

  const heading = isNew ? 'Add form' : 'Edit form';

  const loading = getFormResult.loading || upsertFormResult.loading;
  const error = getFormResult.error || upsertFormResult.error;

  useEffect(() => {
    if (getFormResult.loading === false && getFormResult.data) {
      const form = getFormResult.data.form;
      const { settings, fields, recipents } = JSON.parse(form.config);

      setValue('name', form.name);
      setValue('key', form.key);
      setValue('settings', settings);
      setValue('fields', fields);
      setValue('recipents', recipents);
    }
  }, [getFormResult.loading, getFormResult.data]);

  useEffect(() => {
    if (nameValue != '') {
      setValue('key', _.kebabCase(nameValue));
    }
  }, [nameValue]);

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <Page heading={heading} actions={actions} footer={<Footer />}>
        <Input
          label="Name"
          errors={errors}
          {...register('name')}
        />

        <Input
          label="Key"
          errors={errors}
          {...register('key')}
        />

        <Textarea
          label="Success message"
          errors={errors}
          {...register('settings.successMessage')}
        />

        <EmailSettings {...{ control, errors, register, watch }} />

        <Fields {...{ control, errors, register }} />
      </Page>
    </form>
  );
}