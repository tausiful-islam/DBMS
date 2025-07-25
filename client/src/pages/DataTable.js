import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { dataService } from '../services/dataService';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import DataModal from '../components/DataModal';
import FilterModal from '../components/FilterModal';
import toast from 'react-hot-toast';

const DataTable = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [filters, setFilters] = useState({});

  // Fetch data with filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['data', pagination.pageIndex + 1, pagination.pageSize, filters],
    queryFn: () => dataService.getData({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      ...filters,
    }),
    keepPreviousData: true,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: dataService.deleteData,
    onSuccess: () => {
      queryClient.invalidateQueries(['data']);
      toast.success('Entry deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete entry');
    },
  });

  // CSV upload mutation
  const uploadMutation = useMutation({
    mutationFn: dataService.uploadCSV,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['data']);
      toast.success(`Successfully uploaded ${data.uploaded} entries`);
      if (data.errors > 0) {
        toast.error(`${data.errors} entries had errors`);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload CSV');
    },
  });

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'productName',
        header: 'Product',
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        cell: ({ row }) => (
          <div>
            <span className="font-medium">
              {row.original.quantity.toLocaleString()} {row.original.unit}
            </span>
            <br />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({row.original.unitType})
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'pricePerUnit',
        header: 'Unit Price',
        cell: ({ row }) => (
          <span>
            ${row.original.pricePerUnit.toFixed(2)} {row.original.currency}
          </span>
        ),
      },
      {
        accessorKey: 'totalSellingPrice',
        header: 'Total Price',
        cell: ({ row }) => (
          <span className="font-semibold text-green-600 dark:text-green-400">
            ${row.original.totalSellingPrice?.toFixed(2) || '0.00'}
          </span>
        ),
      },
      {
        accessorKey: 'supplier',
        header: 'Supplier',
        cell: ({ getValue }) => getValue() || 'N/A',
      },
      {
        accessorKey: 'area',
        header: 'Area',
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ getValue }) => (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            getValue() === 'supply' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : getValue() === 'demand'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'quality',
        header: 'Quality',
        cell: ({ getValue }) => (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            getValue() === 'Premium'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
              : getValue() === 'Standard'
              ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
          }`}>
            {getValue()}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              title="Edit"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(row.original._id)}
              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
              title="Delete"
              disabled={
                row.original.createdBy._id !== user._id && user.role !== 'admin'
              }
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [user]
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    pageCount: data?.pagination?.pages ?? -1,
    state: {
      pagination,
      sorting,
      columnFilters,
      globalFilter,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  const handleAdd = () => {
    setEditingData(null);
    setShowModal(true);
  };

  const handleEdit = (data) => {
    setEditingData(data);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadMutation.mutate(file);
      event.target.value = '';
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await dataService.exportCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'meat-data-export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    setShowFilterModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="large" text="Loading data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">
            Error loading data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Data Table
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your meat market data entries
        </p>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleAdd}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Entry</span>
          </button>
          
          <label className="btn-secondary flex items-center space-x-2 cursor-pointer">
            <ArrowUpTrayIcon className="w-4 h-4" />
            <span>Upload CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
              disabled={uploadMutation.isLoading}
            />
          </label>
          
          <button
            onClick={handleExportCSV}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilterModal(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <FunnelIcon className="w-4 h-4" />
            <span>Filters</span>
            {Object.keys(filters).length > 0 && (
              <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                {Object.keys(filters).length}
              </span>
            )}
          </button>
          
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search all columns..."
              className="input-field pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="table-header cursor-pointer select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' ↑',
                          desc: ' ↓',
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="table-cell">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {(!data?.data || data.data.length === 0) && (
          <div className="text-center py-12">
            <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No data entries
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by adding a new data entry.
            </p>
            <div className="mt-6">
              <button onClick={handleAdd} className="btn-primary">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Entry
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {data?.data && data.data.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Show
                </span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                  className="input-field w-20"
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  entries
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {data.pagination.current} of {data.pagination.pages} (
                  {data.pagination.total} total entries)
                </span>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {'<<'}
                  </button>
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {'<'}
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {'>'}
                  </button>
                  <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {'>>'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <DataModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          data={editingData}
        />
      )}

      {showFilterModal && (
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
          currentFilters={filters}
        />
      )}
    </div>
  );
};

export default DataTable;
