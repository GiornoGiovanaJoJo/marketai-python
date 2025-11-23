export function EmptyState() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <p className="text-lg font-semibold mb-2">Нет кампаний</p>
                <p className="text-sm text-muted-foreground">
                    Создайте кампанию для просмотра финансовых отчетов
                </p>
            </div>
        </div>
    )
}
