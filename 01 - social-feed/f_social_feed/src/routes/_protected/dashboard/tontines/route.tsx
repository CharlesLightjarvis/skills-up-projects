import { createFileRoute } from '@tanstack/react-router'
import TontineTableList from '../-components/-table_components/tontine/tontine-table-list'

export const Route = createFileRoute('/_protected/dashboard/tontines')({
  component: RouteComponent,
  pendingComponent: () => {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Chargement des tontines...</div>
      </div>
    )
  },
  errorComponent: () => {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-500">
          Erreur lors du chargement des tontines
        </div>
      </div>
    )
  },
})

function RouteComponent() {
  return <TontineTableList />
}
