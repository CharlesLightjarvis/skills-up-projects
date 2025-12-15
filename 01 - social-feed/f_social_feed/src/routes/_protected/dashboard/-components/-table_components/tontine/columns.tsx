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
import { Badge } from '@/components/ui/badge'
import type { Tontine, TontineStatus, TontineFrequency } from '@/types/tontine'

interface ColumnsProps {
  onEdit: (tontine: Tontine) => void
  onDelete: (tontine: Tontine) => void
  onView: (tontine: Tontine) => void
}

// Helper function pour afficher le statut avec badge coloré
const getStatusBadge = (status: TontineStatus) => {
  const statusConfig: Record<
    TontineStatus,
    {
      label: string
      variant: 'default' | 'secondary' | 'destructive' | 'outline'
    }
  > = {
    pending: { label: 'En attente', variant: 'secondary' },
    active: { label: 'Active', variant: 'default' },
    completed: { label: 'Terminée', variant: 'outline' },
    cancelled: { label: 'Annulée', variant: 'destructive' },
  }

  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

// Helper function pour afficher la fréquence
const getFrequencyLabel = (frequency: TontineFrequency) => {
  const frequencyLabels: Record<TontineFrequency, string> = {
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    biweekly: 'Bimensuel',
    monthly: 'Mensuel',
  }
  return frequencyLabels[frequency]
}

export const createColumns = ({
  onEdit,
  onDelete,
  onView,
}: ColumnsProps): ColumnDef<Tontine>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      const slogan = row.original.slogan
      return (
        <div className="max-w-[300px]">
          <div className="font-medium truncate" title={name}>
            {name}
          </div>
          {slogan && (
            <div
              className="text-xs text-muted-foreground truncate"
              title={slogan}
            >
              {slogan}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'country',
    header: 'Pays',
    cell: ({ row }) => {
      const country = row.original.country
      return country ? (
        <div className="flex items-center gap-2">
          <span>{country.name}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: 'contribution_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contribution" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue('contribution_amount') as number
      const formatted = new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'frequency',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fréquence" />
    ),
    cell: ({ row }) => {
      const frequency = row.getValue('frequency') as TontineFrequency
      return <div>{getFrequencyLabel(frequency)}</div>
    },
  },
  {
    accessorKey: 'max_members',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Membres max" />
    ),
    cell: ({ row }) => {
      const maxMembers = row.getValue('max_members') as number
      return <div className="text-center">{maxMembers}</div>
    },
  },
  {
    accessorKey: 'current_cycle',
    header: 'Cycle',
    cell: ({ row }) => {
      const currentCycle = row.original.current_cycle
      const totalCycles = row.original.total_cycles
      return (
        <div className="text-center">
          {currentCycle} / {totalCycles}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Statut" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as TontineStatus
      return getStatusBadge(status)
    },
  },
  {
    accessorKey: 'start_date',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date de début
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const startDate = row.getValue('start_date') as string | undefined
      if (!startDate) {
        return <span className="text-muted-foreground">Non définie</span>
      }
      const date = new Date(startDate)
      return <div>{date.toLocaleDateString('fr-FR')}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const tontine = row.original

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
            <DropdownMenuItem onClick={() => onView(tontine)}>
              Voir les détails
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(tontine)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(tontine)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// Export par défaut (backward compatibility)
export const columns: ColumnDef<Tontine>[] = createColumns({
  onEdit: () => {},
  onDelete: () => {},
  onView: () => {},
})
