import {
    TChanceUsed,
    TFinishGame,
    TNewGame,
    TLetterInput,
    TSubmitResult,
} from "./EGameActions";

export type TGameAction =
    | TLetterInput
    | TFinishGame
    | TNewGame
    | TChanceUsed
    | TSubmitResult;
