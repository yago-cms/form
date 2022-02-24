import { faEdit, faPlus } from "@fortawesome/pro-duotone-svg-icons";
import { GET_FORMS } from "../../queries";
import { useNavigate } from "react-router";
import { useQuery } from "@apollo/client";
import Error from "../../../../../../js/components/Error";
import Loading from "../../../../../../js/components/Loading";
import Page from "../../../../../../js/components/Page";
import Table from "../../../../../../js/components/Table";

export default function FormIndex() {
  const getFormsResult = useQuery(GET_FORMS);
  const navigate = useNavigate();

  const loading = getFormsResult.loading;
  const error = getFormsResult.error;

  const actions = [
    { icon: faPlus, text: 'Add form', path: '/forms/create' },
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <Page heading="Forms" actions={actions}>
      <Table
        heading="Forms"
        columns={[
          { name: 'Name', field: 'name' },
          { name: 'Key', field: 'key' },
          { name: 'Created', field: 'created_at' },
          { name: 'Updated', field: 'updated_at' },
          {
            name: 'Actions',
            actions: [
              {
                icon: faEdit,
                text: 'Edit',
                onClick: (event, data) => { navigate(`/forms/${data.id}`); },
              }
            ]
          },
        ]}
        data={getFormsResult.data.forms}
        options={{
          sorting: true,
        }}
      />
    </Page>
  );
}