import { useQuery, useMutation } from "@apollo/client";
import { faEdit, faPlus, faTrash } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Error, Loading, Page, PageContent } from "../../../../../cms/resources/js/module";
import { GET_FORMS_PAGINATED, DELETE_FORM } from "../../queries";

export const FormIndex = () => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const getFormsResult = useQuery(GET_FORMS_PAGINATED, {
    variables: {
      page: 1,
    }
  });

  const [deleteForm, deleteFormResult] = useMutation(DELETE_FORM, {
    refetchQueries: [
      {
        query: GET_FORMS_PAGINATED,
        variables: {
          page: 1,
        }
      }
    ]
  });

  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to remove this item?')) {
      deleteForm({
        variables: {
          id
        }
      });
    }
  };


  const isLoading = getFormsResult.loading;
  const error = getFormsResult.error;

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => handleDelete(params.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </IconButton>

          <IconButton size="small" onClick={() => navigate(`/forms/${params.id}`)}>
            <FontAwesomeIcon icon={faEdit} />
          </IconButton>
        </>
      ),
    }
  ];

  const rows = getFormsResult.data.formsPaginated.data.map((form) => ({
    id: form.id,
    name: form.name,
  }));

  return (
    <Page
      heading="Forms"
      fab={{
        handleClick: () => navigate('/forms/create'),
        icon: faPlus,
      }}
    >
      <PageContent>
        <div style={{ height: '60vh', width: '100%' }}>
          <DataGrid
            columns={columns}
            rows={rows}
            paginationMode="server"
            rowCount={getFormsResult.data.formsPaginated.paginatorInfo.total}
            rowsPerPageOptions={[25]}
            pageSize={25}
            onPageChange={(page) => {
              setIsLoadingMore(true);
              getFormsResult.fetchMore({
                variables: {
                  page: page + 1,
                }
              }).then(() => setIsLoadingMore(false))
            }}
            loading={isLoadingMore}
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            disableSelectionOnClick
          />
        </div>
      </PageContent>
    </Page>
  );
}