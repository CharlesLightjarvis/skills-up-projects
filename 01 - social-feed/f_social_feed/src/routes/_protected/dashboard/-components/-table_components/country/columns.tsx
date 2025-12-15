import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import type { Country } from '@/types/country'

interface ColumnsProps {
  onEdit: (country: Country) => void
  onDelete: (country: Country) => void
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Country>[] => [
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
  },
  // 🚩 Flag (image)
  {
    accessorKey: 'flag',
    header: 'Flag',
    cell: ({ row }) => {
      const flagUrl = row.getValue('flag') as string
      return (
        <img src={flagUrl} alt="flag" className="h-6 w-6 rounded-sm border" />
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'Nom',
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      return (
        <div className="max-w-[500px] truncate" title={name}>
          {name}
        </div>
      )
    },
  },
  {
    accessorKey: 'currency',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Devise" />
    ),
  },
  // 💲 Symbol
  {
    accessorKey: 'currency_symbol',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Symbole" />
    ),
  },

  // 🔢 Nkap conversion rate
  {
    accessorKey: 'nkap_rate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Taux Nkap" />
    ),
  },

  // 📅 Created At
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return <div>{date.toLocaleString()}</div>
    },
  },

  // ⋮ Actions
  {
    id: 'actions',
    cell: ({ row }) => {
      const country = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(country)}>
              Edit country
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(country)}
            >
              Delete country
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// Export par défaut (backward compatibility)
export const columns: ColumnDef<Country>[] = createColumns({
  onEdit: () => {},
  onDelete: () => {},
})
