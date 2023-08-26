import { useCallback, useEffect, useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
// routes
import { usePathname, useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// _mock
// utils
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
  useTable,
} from 'src/components/table';
//
import { useSnackbar } from 'notistack';
import { useGetUserVouchers, useGetVouchers } from 'src/api/voucher';
import axiosInstance from 'src/utils/axios';
import { warning } from 'framer-motion';
import { useAuthContext } from '../../../auth/hooks';
import VoucherTableFiltersResult from '../voucher-table-filters-result';
import VoucherTableRow from '../voucher-table-row';
import VoucherTableToolbar from '../voucher-table-toolbar';
// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }];

const TABLE_HEAD = [
  { id: 'id', label: 'Voucher No', width: 110, align: 'center' },
  { id: 'partyName', label: 'Customer Name', align: 'center' },
  { id: 'voucherDate', label: 'Date', align: 'center', width: 110 },
  { id: 'totalQuantity', label: 'Quantity', align: 'center', width: 80 },
  { id: 'totalAmount', label: 'Price', align: 'center', width: 100 },
  { id: 'is_synced', label: 'Synced', align: 'center', width: 110 },
  { id: 'createdAt', label: 'Created At', align: 'center', width: 110 },
  { id: '', width: 88 },
];

const defaultFilters = {
  partyName: '',
  status: 'all',
  startDate: new Date(),
  endDate: new Date(),
};
defaultFilters.startDate.setHours(0, 0, 0, 0);
defaultFilters.endDate.setHours(23, 59, 59, 999);
// ----------------------------------------------------------------------

export default function VoucherListView() {
  const { user } = useAuthContext();
  const isAdmin = user.permissions.includes('admin');
  let vouchersHook = useGetUserVouchers;

  if (isAdmin) {
    vouchersHook = useGetVouchers;
  }

  const { vouchers, vouchersLoading, vouchersError, vouchersEmpty, refreshVouchers } =
    vouchersHook();

  const table = useTable({ defaultOrderBy: 'id', defaultOrder: 'desc' });

  const settings = useSettingsContext();

  const router = useRouter();

  const pathname = usePathname();
  const confirm = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (party_name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [party_name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
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

  const handleResetFilters = useCallback(() => {
    setFilters({
      partyName: '',
      status: 'all',
      startDate: null,
      endDate: null,
    });
  }, []);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.voucher.details(id));
    },
    [router]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.voucher.details(id));
    },
    [router]
  );

  const handleSyncVoucher = useCallback(
    async (voucher) => {
      await axiosInstance.post('/api/vouchers/syncToTally', voucher).then((res) => {
        const { data } = res;

        console.log(typeof data.HEADER.STATUS[0]);

        console.log(data.HEADER.STATUS[0]);

        if (data.HEADER.STATUS[0] === '1') {
          refreshVouchers();
          // enqueueSnackbar('voucher synced successfully!');
        } else {
          // enqueueSnackbar('Voucher sync failed!', {
          //   variant: 'error',
          // });
        }
      });
    },
    [refreshVouchers]
  );
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  useEffect(() => {
    if (vouchers && vouchers.length) {
      setTableData(vouchers);
      // enqueueSnackbar('Vouchers fetched successfully!', {
      //   variant: 'success',
      // });
    } else {
      // enqueueSnackbar('Error fetching Vouchers', {
      //   variant: 'error',
      // });
    }
  }, [enqueueSnackbar, vouchers]);

  return (
    <>
      <Container
        maxWidth={settings.themeStretch ? false : 'lg'}
        style={pathname === '/dashboard' ? { padding: 0, maxWidth: 'initial' } : {}}
      >
        {pathname === '/dashboard' ? null : (
          <CustomBreadcrumbs
            heading="List"
            links={[
              {
                name: 'Dashboard',
                href: paths.dashboard.root,
              },
              {
                name: 'Voucher',
                href: paths.dashboard.voucher.root,
              },
              { name: 'List' },
            ]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />
        )}
        <Paper variant="" sx={{ p: 2, mb: { xs: 2, md: 3 }, borderRadius: 1 }}>
          <Typography gutterBottom variant="subtitle1" sx={{ color: `warning.main` }}>
            warning
          </Typography>

          <Typography gutterBottom variant="body2" sx={{ color: `warning.main` }}>
            Cras ultricies mi eu turpis hendrerit fringilla. Fusce vel dui. Pellentesque auctor
            neque nec urna. Sed cursus turpis vitae tortor. Curabitur suscipit suscipit tellus.
          </Typography>
        </Paper>
        <Card>
          {/* <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'completed' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'cancelled' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && _orders.length}
                    {tab.value === 'completed' &&
                      _orders.filter((order) => order.status === 'completed').length}

                    {tab.value === 'pending' &&
                      _orders.filter((order) => order.status === 'pending').length}
                    {tab.value === 'cancelled' &&
                      _orders.filter((order) => order.status === 'cancelled').length}
                    {tab.value === 'refunded' &&
                      _orders.filter((order) => order.status === 'refunded').length}
                  </Label>
                }
              />
            ))}
          </Tabs> */}

          <VoucherTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />

          {canReset && (
            <VoucherTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              // numSelected={table.selected.length}
              rowCount={tableData.length}
              // onSelectAllRows={(checked) =>
              //   table.onSelectAllRows(
              //     checked,
              //     tableData.map((row) => row.id)
              //   )
              // }
              // action={
              //   <Tooltip title="Delete">
              //     <IconButton color="primary" onClick={confirm.onTrue}>
              //       <Iconify icon="solar:trash-bin-trash-bold" />
              //     </IconButton>
              //   </Tooltip>
              // }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={(orderBy, sortingOrder) => table.onSort(orderBy, sortingOrder)}
                  onSelectAllRows={(checked) => {
                    const syncedRows = tableData.filter((row) => row.is_synced === 0);
                    const syncedIds = syncedRows.map((row) => row.id);

                    table.onSelectAllRows(checked, syncedIds);
                  }}
                />

                <TableBody>
                  {vouchersLoading ? (
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
                          <VoucherTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}
                            onEditRow={() => {
                              handleEditRow(row.id);
                            }}
                            onSyncVoucher={() => {
                              handleSyncVoucher(row);
                            }}
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

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) =>
        `${order.id}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.party_name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => {
        const orderDate = new Date(order.createdAt);

        const isWithinRange = orderDate >= startDate && orderDate <= endDate;

        return isWithinRange;
      });
    }
  }

  return inputData;
}
