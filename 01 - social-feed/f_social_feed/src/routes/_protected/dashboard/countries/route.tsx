import { createFileRoute } from '@tanstack/react-router'
import CountryTableList from '../-components/-table_components/country/country-table-list'

export const Route = createFileRoute('/_protected/dashboard/countries')({
  component: RouteComponent,
  pendingComponent: () => {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Chargement des pays...</div>
      </div>
    )
  },
  errorComponent: () => {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-500">
          Erreur lors du chargement des pays
        </div>
      </div>
    )
  },
})

function RouteComponent() {
  return <CountryTableList />
}
