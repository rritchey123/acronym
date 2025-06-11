import { PlayDialogue } from '../../PlayDialogue'
import { InfoDialogue } from '../../InfoDialogue'
import { CreditsDialogue } from '../../CreditsDialogue'

export function HomeRoom() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4">
            <h1 className="text-4xl font-bold text-white text-center">
                Welcome!
            </h1>
            <PlayDialogue />
            <InfoDialogue />
            <CreditsDialogue />
        </div>
    )
}
