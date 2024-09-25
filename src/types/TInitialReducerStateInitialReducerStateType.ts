import { TGame } from "./TGame";
import { TAchievements } from "./TAchievements";

export interface TInitialReducerState {
    currentGame: TGame;
    games: TGame[];
    achievements: TAchievements[];
}
