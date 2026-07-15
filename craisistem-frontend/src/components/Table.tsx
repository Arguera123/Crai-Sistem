import { 
  flexRender, 
  type ColumnDef, 
  useReactTable, 
  getCoreRowModel 
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface AutoTableProps {
  data: any[];
  columns: ColumnDef<any, any>[]; 
  pageIndex: number;
  pageSize: number;
  total: number;
  lastPage: number;
  setPageIndex: (page: number) => void;
  setPageSize: (size: number) => void;
}

export default function AutoTable({
  data,
  columns,
  pageIndex,
  pageSize,
  total,
  lastPage,
  setPageIndex,
  setPageSize,
}: AutoTableProps) {
  const pageOptions = [10, 20, 30, 50];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, 
  });

  return (
    <div className="inline-block w-full overflow-x-auto border rounded-lg">
      {/* Tabla */}
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          {/* 2. Renderizamos los grupos de cabeceras de TanStack */}
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {/* 3. Renderizamos las filas utilizando el modelo de TanStack */}
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="text-sm text-gray-600 even:bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 whitespace-normal">
                    {/* flexRender ahora sí recibe el contexto correcto de la celda */}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                No hay datos para mostrar
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 p-3 bg-white border-t gap-2">
        {/* Selector de filas por página */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Mostrar:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(1); // reinicia a primera página
            }}
            className="text-sm px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
          >
            {pageOptions.map((size) => (
              <option key={size} value={size}>
                {size} por página
              </option>
            ))}
          </select>
        </div>

        {/* Botones de navegación */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex <= 1}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Página anterior"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
          </button>

          <span className="text-sm text-gray-700">
            Página {pageIndex} de {lastPage} ({total} registros)
          </span>

          <button
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={pageIndex >= lastPage}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Página siguiente"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}