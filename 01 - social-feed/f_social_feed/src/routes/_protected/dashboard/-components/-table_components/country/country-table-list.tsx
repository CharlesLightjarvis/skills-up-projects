import { useCountry } from '@/hooks/use-country'
import { createColumns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { useEffect, useState } from 'react'
import type { Country } from '@/types/country'

export default function CountryTableList() {
  const { countries, loading, fetchCountries } = useCountry()
  // const [createDialogOpen, setCreateDialogOpen] = useState(false)
  // const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)

  useEffect(() => {
    fetchCountries()
  }, [])

  const handleEdit = (country: Country) => {
    setSelectedCountry(country)
    // setUpdateDialogOpen(true)
  }

  const handleDelete = (country: Country) => {
    setSelectedCountry(country)
    // setDeleteDialogOpen(true)
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  if (loading && countries.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Chargement des pays...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto space-y-6 p-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des pays
          </h1>
          <p className="text-muted-foreground">
            Créez, modifiez et gérez tous vos pays en un seul endroit
          </p>
        </div>
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={countries}
            searchFilter={{
              columnId: 'name',
              placeholder: 'Filter by country name...',
            }}
            actionButton={{
              label: 'Add Country',
              // onClick: () => setCreateDialogOpen(true),
              onClick: () => console.log('Add Country'),
            }}
          />
        </div>
      </div>

      {/* <CreatePost
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />

        <UpdatePost
          post={selectedPost}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
        />

        <DeletePost
          post={selectedPost}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        /> */}
    </>
  )
}
