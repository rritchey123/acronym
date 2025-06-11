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
                    <Button className="mb-4 w-40">Credits</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            Credits
                        </DialogTitle>
                        <DialogDescription>
                            Shout out to the following for making this possible:
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 text-sm text-foreground leading-relaxed">
                        <p>
                            <strong>Ryan Ritchey</strong> – Design, development,
                            and good vibes ✨
                        </p>
                        <p>
                            <strong>Meesh</strong> – Prompt and acroynm ideas ✨
                        </p>
                        <p>
                            <strong>Kim</strong> – For hating the game so deeply
                            ✨
                        </p>
                        {/* You can add more later like this: */}
                        {/* <p><strong>OpenAI</strong> – For powering the backend AI logic</p> */}
                        {/* <p><strong>Shadcn/UI</strong> – For the component library used in the game</p> */}
                    </div>

                    <DialogFooter>
                        <p className="text-center w-full text-muted-foreground text-sm">
                            Thanks for playing!
                        </p>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
