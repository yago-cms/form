import { useQuery } from "@apollo/client";
import { faEdit, faPlus } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Error, Loading, Page, PageContent } from "../../../../../cms/resources/js/module";
import { GET_FORMS } from "../../queries";

export const FormIndex = () => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const getFormsResult = useQuery(GET_FORMS, {
    variables: {
      page: 1,
    }
  });
  const navigate = useNavigate();

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
        <IconButton size="small" onClick={() => navigate(`/forms/${params.id}`)}>
          <FontAwesomeIcon icon={faEdit} />
        </IconButton>
      ),
    }
  ];

  const rows = getFormsResult.data.forms.data.map((form) => ({
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
            rowCount={getFormsResult.data.forms.paginatorInfo.total}
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