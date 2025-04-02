import { PlayDialogue } from '../../PlayDialogue'
import { InfoDialogue } from '../../InfoDialogue'
import { CreditsDialogue } from '../../CreditsDialogue'

export function HomeRoom() {
    return (
        <div className="mt-8 flex flex-col justify-center items-center">
            <p className="text-foreground text-4xl mb-4">Welcome!</p>
            <PlayDialogue />
            <InfoDialogue />
            <CreditsDialogue />
        </div>
    )
}
