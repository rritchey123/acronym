import { FeState, ReduxState } from '@/redux/feState'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { toast } from 'sonner'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function selectFeState(state: ReduxState): FeState {
    return state.feState
}

export function successToast(message: string) {
    toast.success(message, { duration: 5000 })
}

export function infoToast(message: string) {
    toast.info(message, { duration: 5000 })
}

export function warningToast(message: string) {
    toast.warning(message, { duration: 5000 })
}

export function errorToast(message: string) {
    toast.error(message, { duration: 5000 })
}
