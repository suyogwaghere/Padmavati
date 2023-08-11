import isEqual from 'lodash/isEqual';
import { useCallback, useState } from 'react';
// @mui
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
// routes
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// hooks
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
// api
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { getComparator, useTable } from 'src/components/table';
//
// import { useGetCategories } from 'src/api/category';
import { useGetProducts } from 'src/api/product';
import { useSnackbar } from 'src/components/snackbar';
import OrderTableToolbar from '../order-table-toolbar';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'categoryName', label: 'Category' },
  { id: 'createdAt', label: 'Create at', width: 160 },
  { id: '', width: 88 },
];

const defaultFilters = {
  categoryName: '',
};

const userOptions = ['admin', 'customer'];
// ----------------------------------------------------------------------

export default function OrderListView() {
  const [val, setVal] = useState(userOptions[0]);
  const router = useRouter();

  const table = useTable();

  const { enqueueSnackbar } = useSnackbar();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(10);

  const [filters, setFilters] = useState(defaultFilters);

  // const { categories, categoriesLoading, categoriesEmpty, refreshCategories } = useGetCategories();

  const { products, productsLoading, productsEmpty } = useGetProducts(visibleProducts);

  const confirm = useBoolean();

  // useEffect(() => {
  //   if (categories.length) {
  //     setTableData(categories);
  //   }
  // }, [categories]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  // const notFound = (!dataFiltered.length && canReset) || categoriesEmpty;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  // const handleDeleteRow = useCallback(
  //   async (id, deleteConfirm) => {
  //     await axiosInstance
  //       .delete(`/api/categories/${id}`)
  //       .then((res) => {
  //         enqueueSnackbar('Delete Success!');
  //         // refreshCategories();
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //         enqueueSnackbar(
  //           err.response.data.error.message
  //             ? err.response.data.error.message
  //             : 'something went wrong!',
  //           { variant: 'error' }
  //         );
  //       });
  //     deleteConfirm.onFalse();
  //   },
  //   [enqueueSnackbar, refreshCategories]
  // );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.category.edit(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Order',
              href: paths.dashboard.order.root,
            },
            { name: 'List' },
          ]}
          // action={
          // <Button
          //   component={RouterLink}
          //   href={paths.dashboard.order.new}
          //   variant="contained"
          //   startIcon={<Iconify icon="mingcute:add-line" />}
          // >
          //   New Category
          // </Button>
          //  sada
          // }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Select
          sx={{ width: 200 }}
          name="group"
          label="Select Group"
          // value="Select Group"
          InputLabelProps={{ shrink: true }}
          // onChange={handleInputData}
          onChange={(event, newInputValue) => {
            // setInputValue(newInputValue.props.value);
            setVal(newInputValue.props.value);
            // setUserType(newInputValue.props.value);
          }}
          PaperPropsSx={{ textTransform: 'capitalize' }}
        >
          {products.map((option) => (
            <MenuItem key={option.parentId} value={option.parentName}>
              {option.parentName}
            </MenuItem>
          ))}
        </Select>
        <Card>
          <OrderTableToolbar filters={filters} onFilters={handleFilters} />
          {/* <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {categoriesLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <OrderTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={(deleteConfirm) => handleDeleteRow(row.id, deleteConfirm)}
                            onEditRow={() => handleEditRow(row.id)}
                          />
                        ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer> */}

          {/* <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          /> */}
        </Card>
        {/* {visibleProducts < 915 && (
          <button type="button" onClick={() => setVisibleProducts(visibleProducts + 10)}>
            Load More
          </button>
        )} */}
      </Container>

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { categoryName } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (categoryName) {
    inputData = inputData.filter(
      (category) => category.categoryName.toLowerCase().indexOf(categoryName.toLowerCase()) !== -1
    );
  }
  return inputData;
}
