import ThemeModeToggle from '../../ThemeModeToggle.jsx'
export const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full bg-primary text-white py-4 text-center flex justify-center items-center z-10">
            <h1 className="text-3xl mb-0 text-center text-primary-foreground">
                ACRONAYM
            </h1>
            <ThemeModeToggle />
        </header>
    )
}
