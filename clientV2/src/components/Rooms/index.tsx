import { RoomStatus } from '@shared/index'
import { WaitRoom } from './WaitRoom/WaitRoom'
import { PlayRoom } from './PlayRoom/PlayRoom'
import { EndRoom } from './EndRoom/EndRoom'
import { VoteRoom } from './VoteRoom/VoteRoom'
import { RoundSummaryRoom } from './RoundSummaryRoom/RoundSummaryRoom'
import { ScoreReviewRoom } from './ScoreReviewRoom/ScoreReviewRoom'
import { HomeRoom } from './HomeRoom/HomeRoom'

export const getRoom = (status: RoomStatus | null) => {
    switch (status) {
        case RoomStatus.WAITING:
            return <WaitRoom />
        case RoomStatus.PLAYING:
            return <PlayRoom />
        case RoomStatus.ENDED:
            return <EndRoom />
        case RoomStatus.VOTING:
            return <VoteRoom />
        case RoomStatus.REVIEWING_ROUND_SUMMARY:
            return <RoundSummaryRoom />
        case RoomStatus.REVIEWING_SCORE_SUMMARY:
            return <ScoreReviewRoom />
        default:
            return <HomeRoom />
    }
}
