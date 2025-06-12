import { SuggestPromptDialog } from '@/components/SuggestDialogue'
import { ThemeModeToggle } from '@/components/ThemeModeTogle'

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full bg-primary text-white py-4 px-4 text-center flex justify-between items-center z-10 shadow-md">
            <h1 className="text-3xl mb-0 font-bold text-center text-primary-foreground tracking-wide">
                ACRONAYM
            </h1>
            <div className="flex items-center">
                <SuggestPromptDialog />
                <ThemeModeToggle />
            </div>
        </header>
    )
}
