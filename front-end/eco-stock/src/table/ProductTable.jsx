import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { frFR } from '@mui/x-data-grid/locales'; 
import Paper from '@mui/material/Paper';
import { SquarePen, Trash2 } from 'lucide-react';

const paginationModel = { page: 0, pageSize: 5 };

const ProductTable = ({ products = [], selectedWarehouse, onRowClick, onEdit, onDelete }) => {

  const columns = [
    {
      field: 'product',
      headerName: 'PRODUIT',
      flex: 1.8,
      minWidth: 240,
      sortable: false,
      renderCell: (params) => (
        <div className="flex flex-col justify-center min-h-full font-sans py-2">
          <span className="font-bold text-sm text-[#10141A] tracking-tight block leading-normal">
            {params.row.name}
          </span>
          <span className="text-[10px] font-mono tracking-wider text-[#96A099] mt-1 block uppercase leading-none">
            {params.row.sku}
          </span>
        </div>
      )
    },
    {
      field: 'warehouse',
      headerName: 'ENTREPÔT',
      flex: 1.3,
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <span className="text-xs text-[#5C665F] font-semibold flex items-center min-h-full">
          {params.value}
        </span>
      )
    },
    {
      field: 'quantity',
      headerName: 'QUANTITÉ',
      flex: 0.9,
      minWidth: 110,
      sortable: false,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <div className="flex flex-col justify-center min-h-full font-sans py-2">
          <span className="text-sm font-black text-[#10141A] tracking-tight block leading-normal">
            {params.row.quantity?.toLocaleString()}
          </span>
          <span className="text-[10px] font-semibold text-[#96A099] mt-1 block leading-none">
            {params.row.weight}
          </span>
        </div>
      )
    },
    {
      field: 'expiration',
      headerName: 'DATE DE DURABILITÉ',
      flex: 1.2,
      minWidth: 160,
      sortable: false,
      renderCell: (params) => (
        <span className="text-xs text-[#5C665F] font-mono font-medium flex items-center min-h-full">
          {params.value}
        </span>
      )
    },
    {
      field: 'state',
      headerName: 'ÉTAT',
      flex: 1.1,
      minWidth: 140,
      sortable: false,
      renderCell: (params) => {
        let badgeStyles = "";
        if (params.value === "DISPONIBLE") badgeStyles = "bg-[#E5F7EE] text-[#0FA968]";
        else if (params.value === "PÉREMPTION") badgeStyles = "bg-[#FDEAE8] text-[#EF4438]";
        else if (params.value === "RÉSERVÉ") badgeStyles = "bg-[#FFF4E5] text-[#E8890B]";

        return (
          <div className="flex items-center min-h-full select-none">
            <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 ${badgeStyles}`}>
              <span className="w-1 h-1 rounded-full bg-current" />
              {params.value}
            </span>
          </div>
        );
      }
    },
    {
      field: 'action',
      headerName: 'ACTIONS',
      flex: 0.8,
      minWidth: 90,
      sortable: false,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <div className="flex items-center justify-end gap-1 min-h-full w-full" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => onEdit && onEdit(params.row)}
            className="p-2 hover:bg-[#EAEFFF] text-[#5C665F] hover:text-[#2F5DFF] rounded-xl transition-all duration-150"
          >
            <SquarePen className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => onDelete && onDelete(params.row.id)}
            className="p-2 hover:bg-[#FDEAE8] text-[#96A099] hover:text-[#EF4438] rounded-xl transition-all duration-150"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>
      )
    }
  ];

  const filteredRows = selectedWarehouse 
    ? products.filter(row => row.warehouse === selectedWarehouse)
    : products;

  return (
    <div className="w-full">
      <Paper 
        elevation={0} 
        sx={{ 
          width: '100%', 
          overflow: 'hidden',
          border: '1px solid #EAEFFF',
          borderRadius: '12px',
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            paddingTop: '8px',
            paddingBottom: '8px',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#F8FAFC',
            color: '#5C665F',
            fontWeight: 'bold',
          }
        }}
      >
        <DataGrid 
          rows={filteredRows} 
          columns={columns} 
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          rowHeight={80}
          columnHeaderHeight={48}
          disableRowSelectionOnClick
          disableColumnMenu
          autoHeight
          localeText={{
            ...frFR.components.MuiDataGrid.defaultProps.localeText,
            MuiTablePagination: {
              labelRowsPerPage: 'Lignes par page :',
              labelDisplayedRows: ({ from, to, count }) => `${from}–${to} de ${count}`,
            },
          }}
          onRowClick={(params) => onRowClick && onRowClick(params.row)}
        />
      </Paper>
    </div>
  );
};

export default ProductTable;
