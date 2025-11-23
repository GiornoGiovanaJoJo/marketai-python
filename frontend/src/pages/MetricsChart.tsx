import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function MetricsChart() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Metrics Chart</h1>
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Visual representation of key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Charts and graphs will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
