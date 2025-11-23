import { Link } from 'react-router-dom'

export function RegisterLink() {
    return (
        <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-center text-sm text-muted-foreground">
                Нет аккаунта?{' '}
                <Link
                    to="/register"
                    className="text-primary font-semibold hover:underline transition-all duration-200 hover:text-primary/80"
                >
                    Зарегистрироваться
                </Link>
            </p>
        </div>
    )
}
