type AlertType = 'success' | 'error' | 'warning' | 'info'

export interface IAlert {
    type: AlertType
    message: string
    showAfterRedirect: boolean
}