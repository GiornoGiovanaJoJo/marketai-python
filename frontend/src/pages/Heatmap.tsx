import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Heatmap() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Heatmap</h1>
        <Card>
          <CardHeader>
            <CardTitle>Activity Heatmap</CardTitle>
            <CardDescription>Visual heatmap of campaign activity</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Heatmap will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
