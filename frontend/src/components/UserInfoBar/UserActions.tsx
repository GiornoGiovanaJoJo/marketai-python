import { Copy, LogOut, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserActions } from '@/hooks/useUserActions'

interface UserActionsProps {
    referralLink: string
}

export function UserActions({ referralLink }: UserActionsProps) {
    const { isLoading, handleCopyReferralLink, handleLogout } = useUserActions()

    return (
        <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/30 border border-border/40">
                <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-xs text-foreground/80 max-w-[200px] md:max-w-none truncate">
                    {referralLink}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 shrink-0"
                    onClick={() => handleCopyReferralLink(referralLink)}
                    title="Копировать ссылку"
                >
                    <Copy className="h-3.5 w-3.5" />
                </Button>
            </div>

            <Button
                onClick={handleLogout}
                disabled={isLoading}
                variant="ghost"
                size="sm"
                className="shrink-0 hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
                title="Выход из системы"
            >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoading ? 'Выход...' : 'Выход'}
            </Button>
        </div>
    )
}
