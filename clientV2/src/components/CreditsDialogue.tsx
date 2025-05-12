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

export function CreditsDialogue() {
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mb-4 w-20">Credits</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
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
