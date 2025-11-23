import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PlanFact() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Plan vs Fact</h1>
        <Card>
          <CardHeader>
            <CardTitle>Plan vs Fact Analysis</CardTitle>
            <CardDescription>Compare planned and actual performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Analysis will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
