import { TGame } from "../types/TGame";

const sumPoints = (games: TGame[]) => {
    return games.reduce((acc, game) => {
        return acc + (game.success ? 5 + (5 - game.usedChances) : 0);
    }, 0);
};

export default sumPoints;
