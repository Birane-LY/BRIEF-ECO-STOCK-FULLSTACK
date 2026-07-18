import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { frFR } from '@mui/x-data-grid/locales'; 
import Paper from '@mui/material/Paper';
import { SquarePen, Trash2 } from 'lucide-react';

const PAGINATION_MODEL = { page: 0, pageSize: 5 };

const STATE_BADGES = {
  DISPONIBLE: "bg-[#E5F7EE] text-[#0FA968]",
  PÉREMPTION: "bg-[#FDEAE8] text-[#EF4438]",
  RÉSERVÉ: "bg-[#FFF4E5] text-[#E8890B]",
};

const columns = [
  {
    field: 'product',
    headerName: 'PRODUIT',
    flex: 1.8,
    minWidth: 240,
    sortable: false,
    renderCell: ({ row }) => (
      <div className="flex flex-col justify-center font-sans py-2 leading-tight">
        <span className="font-bold text-sm text-[#10141A] tracking-tight">{row.name}</span>
        <span className="text-[10px] font-mono tracking-wider text-[#96A099] mt-1 uppercase">{row.sku}</span>
      </div>
    )
  },
  {
    field: 'warehouse',
    headerName: 'ENTREPÔT',
    flex: 1.3,
    minWidth: 180,
    sortable: false,
    renderCell: ({ value }) => <span className="text-xs text-[#5C665F] font-semibold">{value}</span>
  },
  {
    field: 'quantity',
    headerName: 'QUANTITÉ',
    flex: 0.9,
    minWidth: 110,
    sortable: false,
    renderCell: ({ row }) => (
      <div className="flex flex-col justify-center font-sans py-2 leading-tight">
        <span className="text-sm font-black text-[#10141A] tracking-tight">{row.quantity?.toLocaleString()}</span>
        <span className="text-[10px] font-semibold text-[#96A099] mt-1">{row.weight}</span>
      </div>
    )
  },
  {
    field: 'expiration',
    headerName: 'DATE DE DURABILITÉ',
    flex: 1.2,
    minWidth: 160,
    sortable: false,
    renderCell: ({ value }) => <span className="text-xs text-[#5C665F] font-mono font-medium">{value}</span>
  },
  {
    field: 'state',
    headerName: 'ÉTAT',
    flex: 1.1,
    minWidth: 140,
    sortable: false,
    renderCell: ({ value }) => (
      <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 select-none ${STATE_BADGES[value] || ""}`}>
        <span className="w-1 h-1 rounded-full bg-current" />
        {value}
      </span>
    )
  },
  {
    field: 'action',
    headerName: 'ACTIONS',
    flex: 0.8,
    minWidth: 90,
    sortable: false,
    headerAlign: 'right',
    align: 'right',
    renderCell: (params) => {
      // Récupération propre et sécurisée des actions injectées par slotProps
      const { onEdit, onDelete } = params.cellMode ? {} : params.rowParams?.colDef || {};
      
      // Alternative ultra-fiable : récupération via l'environnement de la ligne (row)
      const rowOnEdit = params.row.onEdit;
      const rowOnDelete = params.row.onDelete;

      return (
        <div className="flex items-center justify-end gap-1 w-full" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => rowOnEdit?.(params.row)}
            className="p-2 hover:bg-[#EAEFFF] text-[#5C665F] hover:text-[#2F5DFF] rounded-xl transition-all duration-150"
          >
            <SquarePen className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => rowOnDelete?.(params.row.id)}
            className="p-2 hover:bg-[#FDEAE8] text-[#96A099] hover:text-[#EF4438] rounded-xl transition-all duration-150"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>
      );
    }
  }
];

const ProductTable = ({ products = [], selectedWarehouse, onRowClick, onEdit, onDelete }) => {
  
  // Injection propre des fonctions d'actions dans l'objet de chaque ligne
  const processedRows = React.useMemo(() => {
    const baseRows = selectedWarehouse 
      ? products.filter(row => row.warehouse === selectedWarehouse)
      : products;
      
    return baseRows.map(row => ({
      ...row,
      onEdit,      // Rattaché à la ligne pour y accéder de façon stable dans renderCell
      onDelete     // sans toucher à l'objet global window
    }));
  }, [products, selectedWarehouse, onEdit, onDelete]);

  return (
    <div className="w-full">
      <Paper 
        elevation={0} 
        sx={{ 
          width: '100%', 
          border: '1px solid #E1E6E1',
          borderRadius: '24px',
          overflow: 'hidden',
          '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center', borderBottom: '1px solid #F4F6F4' },
          '& .MuiDataGrid-columnHeader': { backgroundColor: '#FAFBFA', color: '#5C665F', fontWeight: 'bold' },
          '& .MuiDataGrid-columnHeaders': { borderBottom: '1px solid #E1E6E1' }
        }}
      >
        <DataGrid 
          rows={processedRows} 
          columns={columns} 
          initialState={{ pagination: { paginationModel: PAGINATION_MODEL } }}
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
          onRowClick={(params) => onRowClick?.(params.row)}
        />
      </Paper>
    </div>
  );
};

export default ProductTable;