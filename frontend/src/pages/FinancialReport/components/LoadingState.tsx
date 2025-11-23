import { Loader2 } from 'lucide-react'

export function LoadingState() {
    return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Загрузка данных...</span>
        </div>
    )
}
