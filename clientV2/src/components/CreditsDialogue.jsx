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

export function CreditsDialogue() {
    const { theme } = useTheme()
    const dataTheme = `${theme.color}-${theme.mode}`
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Credits</Button>
                </DialogTrigger>
                <DialogContent
                    className="sm:max-w-[425px]"
                    dataTheme={dataTheme}
                >
                    <DialogHeader>
                        <DialogTitle>Credits</DialogTitle>
                        <DialogDescription>
                            Shout out to the following for making this possible
                        </DialogDescription>
                    </DialogHeader>
                    <div>Me</div>
                    <DialogFooter>
                        <div>Thanks for playing!</div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
