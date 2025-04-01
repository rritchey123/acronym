import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTheme } from './ThemeProvider'

export function InfoDialogue() {
    const { theme } = useTheme()
    const dataTheme = `${theme.color}-${theme.mode}`
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mb-4">Info</Button>
                </DialogTrigger>
                <DialogContent
                    className="sm:max-w-[425px]"
                    dataTheme={dataTheme}
                >
                    <DialogHeader>
                        <DialogTitle>Info</DialogTitle>
                        <DialogDescription>How this works:</DialogDescription>
                    </DialogHeader>
                    <div>TODO!</div>
                    <DialogFooter>
                        <div>Have fun!</div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
