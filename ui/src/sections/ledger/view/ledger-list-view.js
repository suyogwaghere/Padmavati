import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
// routes
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
// api
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
  emptyRows,
  getComparator,
  useTable,
} from 'src/components/table';
//
import { useGetLedgers } from 'src/api/ledger';
import { useSnackbar } from 'src/components/snackbar';
import axiosInstance, { endpoints } from 'src/utils/axios';
import BrandTableRow from '../ledger-table-row';
import BrandTableToolbar from '../ledger-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', width: 80, minWidth: 80 }, // Adjust minWidth as needed
  { id: 'name', label: 'Name', width: 220, minWidth: 260 },
  { id: 'group', label: 'Group', width: 160, minWidth: 140 },
  { id: 'openingValue', label: 'Current Balance', width: 160, minWidth: 140 },
  { id: 'address', label: 'Address', width: 190, minWidth: 190 },
  { id: 'country', label: 'Country', width: 160, minWidth: 120 },
  { id: 'state', label: 'State', width: 160, minWidth: 120 },
  { id: 'gstIn', label: 'GST-IN', width: 170, minWidth: 170 },
  { id: 'whatsapp_no', label: 'WhatsApp No', width: 160, minWidth: 140 },
  { id: 'mobile_no', label: 'Mobile No', width: 160, minWidth: 140 },
  { id: 'pincode', label: 'Pincode', width: 160, minWidth: 120 },
  { id: 'station', label: 'Station', width: 170, minWidth: 170 },
];
const defaultFilters = {
  name: '',
};

// ----------------------------------------------------------------------

export default function LedgerListView() {
  // const router = useRouter();

  const table = useTable();

  const { enqueueSnackbar } = useSnackbar();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const { ledgers, ledgersLoading, ledgersEmpty, refreshLedgers } = useGetLedgers();

  const confirm = useBoolean();

  useEffect(() => {
    if (ledgers.length) {
      setTableData(ledgers);
    }
  }, [ledgers]);

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

  const notFound = (!dataFiltered.length && canReset) || ledgersEmpty;

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

  const handleLedgerSyncFromTally = () => {
    axiosInstance
      .post(endpoints.ledger.sync)
      .then((res) => {
        const { data } = res;
        enqueueSnackbar(data?.message || 'Sync successfull');
      })
      .catch((err) => {
        enqueueSnackbar(
          err.response.data.error.message
            ? err.response.data.error.message
            : 'something went wrong!',
          { variant: 'error' }
        );
      });
  };

  const handleDeleteRow = useCallback(
    async (id, deleteConfirm) => {
      await axiosInstance
        .delete(`/api/brands/${id}`)
        .then((res) => {
          enqueueSnackbar('Delete Success!');
          refreshLedgers();
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar(
            err.response.data.error.message
              ? err.response.data.error.message
              : 'something went wrong!',
            { variant: 'error' }
          );
        });
      deleteConfirm.onFalse();
    },
    [enqueueSnackbar, refreshLedgers]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Ledger',
              href: paths.dashboard.ledger.root,
            },
            { name: 'List' },
          ]}
          // action={
          //   <Button
          //     component={RouterLink}
          //     onClick={() => {
          //       handleLedgerSyncFromTally();
          //     }}
          //     variant="contained"
          //     startIcon={<Iconify icon="ci:arrows-reload-01" />}
          //   >
          //     Sync
          //   </Button>
          // }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <BrandTableToolbar filters={filters} onFilters={handleFilters} />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
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
                  {ledgersLoading ? (
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
                          <BrandTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={(deleteConfirm) => handleDeleteRow(row.id, deleteConfirm)}
                            onEditRow={() => {}}
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
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
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
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (brand) => brand.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  return inputData;
}
