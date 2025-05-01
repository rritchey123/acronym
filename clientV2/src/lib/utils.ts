import { FeState, ReduxState } from '@/redux/feState'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function selectFeState(state: ReduxState): FeState {
    return state.feState
}
