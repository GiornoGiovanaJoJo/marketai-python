import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function OPIDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">OPI Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>OPI Overview</CardTitle>
            <CardDescription>Operational Performance Indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">OPI metrics will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
