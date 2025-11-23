import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function UnitEconomics() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Unit Economics</h1>
        <Card>
          <CardHeader>
            <CardTitle>Unit Economics Analysis</CardTitle>
            <CardDescription>Per-unit profitability metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Unit economics data will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
