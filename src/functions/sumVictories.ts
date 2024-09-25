import { TGame } from "../types/TGame";

const sumVictories = (games: TGame[]) => {
    return games.reduce((acc, game) => {
        return acc + (game.success ? 1 : 0);
    }, 0);
};

export default sumVictories;
