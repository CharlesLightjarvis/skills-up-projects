import { useTontines } from '@/hooks/use-tontines'
import { createColumns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { useEffect, useState } from 'react'
import type { Tontine } from '@/types/tontine'

export default function TontineTableList() {
  const { tontines, loading, fetchTontines } = useTontines()
  // const [createDialogOpen, setCreateDialogOpen] = useState(false)
  // const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTontine, setSelectedTontine] = useState<Tontine | null>(null)

  useEffect(() => {
    fetchTontines()
  }, [])

  const handleView = (tontine: Tontine) => {
    setSelectedTontine(tontine)
    console.log('View tontine:', tontine)
    // TODO: Navigate to tontine details page or open modal
  }

  const handleEdit = (tontine: Tontine) => {
    setSelectedTontine(tontine)
    // setUpdateDialogOpen(true)
    console.log('Edit tontine:', tontine)
  }

  const handleDelete = (tontine: Tontine) => {
    setSelectedTontine(tontine)
    // setDeleteDialogOpen(true)
    console.log('Delete tontine:', tontine)
  }

  const columns = createColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  if (loading && tontines.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="text-lg">Chargement des tontines...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto space-y-6 p-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des tontines
          </h1>
          <p className="text-muted-foreground">
            Créez, modifiez et gérez toutes vos tontines en un seul endroit
          </p>
        </div>
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={tontines}
            searchFilter={{
              columnId: 'name',
              placeholder: 'Rechercher par nom de tontine...',
            }}
            actionButton={{
              label: 'Créer une tontine',
              // onClick: () => setCreateDialogOpen(true),
              onClick: () => console.log('Create Tontine'),
            }}
          />
        </div>
      </div>

      {/* <CreateTontine
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />

        <UpdateTontine
          tontine={selectedTontine}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
        />

        <DeleteTontine
          tontine={selectedTontine}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        /> */}
    </>
  )
}
