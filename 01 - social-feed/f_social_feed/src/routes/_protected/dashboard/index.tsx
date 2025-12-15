import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle
} from 'lucide-react'

export const Route = createFileRoute('/_protected/dashboard/')({
  component: DashboardPage,
})

// Données fake pour le dashboard
const FAKE_DATA = {
  stats: {
    totalTontines: 24,
    activeTontines: 12,
    pendingTontines: 5,
    completedTontines: 7,
    totalMembers: 348,
    totalContributions: 2450000,
    monthlyGrowth: 12.5,
    avgContribution: 50000,
  },
  recentTontines: [
    {
      id: 1,
      name: 'Tontine Entrepreneurs 2024',
      members: 15,
      maxMembers: 20,
      contribution: 50000,
      status: 'active' as const,
      nextPayout: '2024-12-15',
      currency: 'XAF',
    },
    {
      id: 2,
      name: 'Épargne Familiale',
      members: 8,
      maxMembers: 10,
      contribution: 25000,
      status: 'active' as const,
      nextPayout: '2024-12-20',
      currency: 'XAF',
    },
    {
      id: 3,
      name: 'Tontine des Commerçants',
      members: 20,
      maxMembers: 20,
      contribution: 100000,
      status: 'pending' as const,
      nextPayout: '2025-01-05',
      currency: 'XAF',
    },
    {
      id: 4,
      name: 'Solidarité Quartier',
      members: 12,
      maxMembers: 15,
      contribution: 30000,
      status: 'active' as const,
      nextPayout: '2024-12-18',
      currency: 'XAF',
    },
  ],
  transactions: [
    {
      id: 1,
      type: 'contribution' as const,
      tontine: 'Tontine Entrepreneurs 2024',
      amount: 50000,
      date: '2024-12-08 10:30',
      member: 'Jean Dupont',
    },
    {
      id: 2,
      type: 'payout' as const,
      tontine: 'Épargne Familiale',
      amount: 200000,
      date: '2024-12-08 09:15',
      member: 'Marie Kamga',
    },
    {
      id: 3,
      type: 'contribution' as const,
      tontine: 'Solidarité Quartier',
      amount: 30000,
      date: '2024-12-07 16:45',
      member: 'Paul Mbarga',
    },
    {
      id: 4,
      type: 'contribution' as const,
      tontine: 'Tontine Entrepreneurs 2024',
      amount: 50000,
      date: '2024-12-07 14:20',
      member: 'Sophie Nkolo',
    },
    {
      id: 5,
      type: 'penalty' as const,
      tontine: 'Épargne Familiale',
      amount: 2500,
      date: '2024-12-06 11:00',
      member: 'Thomas Eyike',
    },
  ],
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de vos tontines et activités financières
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Contributions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contributions
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(FAKE_DATA.stats.totalContributions)} XAF
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">
                +{FAKE_DATA.stats.monthlyGrowth}%
              </span>
              <span className="ml-1">ce mois</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Tontines */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tontines Actives
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {FAKE_DATA.stats.activeTontines}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              sur {FAKE_DATA.stats.totalTontines} tontines totales
            </p>
          </CardContent>
        </Card>

        {/* Total Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Membres Actifs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {FAKE_DATA.stats.totalMembers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Moyenne {Math.round(FAKE_DATA.stats.totalMembers / FAKE_DATA.stats.activeTontines)} membres/tontine
            </p>
          </CardContent>
        </Card>

        {/* Average Contribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contribution Moyenne
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(FAKE_DATA.stats.avgContribution)} XAF
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Par membre et par cycle
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Tontines */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tontines Récentes</CardTitle>
            <CardDescription>
              Vue d'ensemble de vos tontines actives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {FAKE_DATA.recentTontines.map((tontine) => (
                <div
                  key={tontine.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">
                        {tontine.name}
                      </p>
                      {tontine.status === 'active' && (
                        <Badge variant="default" className="h-5">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Active
                        </Badge>
                      )}
                      {tontine.status === 'pending' && (
                        <Badge variant="secondary" className="h-5">
                          <Clock className="mr-1 h-3 w-3" />
                          En attente
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {tontine.members}/{tontine.maxMembers} membres
                      </span>
                      <span className="flex items-center gap-1">
                        <Wallet className="h-3 w-3" />
                        {formatCurrency(tontine.contribution)} {tontine.currency}
                      </span>
                      {tontine.status === 'active' && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Prochain paiement: {new Date(tontine.nextPayout).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-right">
                      <div className="text-sm font-bold">
                        {formatCurrency(tontine.contribution * tontine.members)}
                      </div>
                      <div className="text-xs text-muted-foreground">Total collecté</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Transactions Récentes</CardTitle>
            <CardDescription>
              Dernières activités financières
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {FAKE_DATA.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'contribution'
                        ? 'bg-green-500/10 text-green-500'
                        : transaction.type === 'payout'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-orange-500/10 text-orange-500'
                    }`}>
                      {transaction.type === 'contribution' && (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {transaction.type === 'payout' && (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                      {transaction.type === 'penalty' && (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {transaction.member}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.tontine}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      transaction.type === 'contribution'
                        ? 'text-green-500'
                        : transaction.type === 'payout'
                        ? 'text-blue-500'
                        : 'text-orange-500'
                    }`}>
                      {transaction.type === 'payout' ? '+' : transaction.type === 'penalty' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {transaction.type === 'contribution' ? 'Contribution' :
                       transaction.type === 'payout' ? 'Paiement' : 'Pénalité'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{FAKE_DATA.stats.pendingTontines}</div>
            <p className="text-xs text-muted-foreground">
              Tontines en cours de formation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{FAKE_DATA.stats.completedTontines}</div>
            <p className="text-xs text-muted-foreground">
              Cycles complétés avec succès
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((FAKE_DATA.stats.completedTontines / FAKE_DATA.stats.totalTontines) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Tontines terminées avec succès
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
