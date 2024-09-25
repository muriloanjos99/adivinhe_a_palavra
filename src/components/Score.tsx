import { useEffect, useRef, useState } from "react";
import { TInitialReducerState } from "../types/TInitialReducerStateInitialReducerStateType";
import sumPoints from "../functions/sumPoints";
import sumVictories from "../functions/sumVictories";
import sumVictoryStreak from "../functions/sumVictoryStreak";
import "./Score.css";

type ScoreProps = {
    showScore: boolean;
    setShowScore: React.Dispatch<React.SetStateAction<boolean>>;
    state: TInitialReducerState;
};

function Score({ showScore, setShowScore, state }: ScoreProps) {
    const [score, setScore] = useState<boolean>(true);
    const tryContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        localStorage.setItem("played_games", JSON.stringify(state.games));

        if (tryContainerRef.current) {
            tryContainerRef.current.scrollTop =
                tryContainerRef.current.scrollHeight;
        }
    }, [state.games]);

    const handleScoreToggle = () => {
        setScore((prev) => !prev);
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement) {
            activeElement.blur();
        }
    };

    return (
        <div
            className={`section_2 ${
                !(window.innerWidth > 1000) && !showScore ? "hidden" : ""
            }`}
        >
            {score ? (
                <div className="games_container" ref={tryContainerRef}>
                    {state.games.map((game, lineIndex) => (
                        <div className="game_played" key={`line_${lineIndex}`}>
                            <div className="game_played_word">
                                {game.word
                                    .toUpperCase()
                                    .split("")
                                    .map((letter: string, letterIndex) => {
                                        return (
                                            <span
                                                className="letter_container score_letter_container"
                                                key={`letter_${letterIndex}`}
                                            >
                                                {letter}
                                            </span>
                                        );
                                    })}
                            </div>
                            <p>
                                Resultado:{" "}
                                {game.success ? "Vitória" : "Derrota"}
                            </p>
                            <p>Chances utilizadas: {game.usedChances}</p>
                            <p>
                                Pontos:{" "}
                                {game.success ? 5 + (5 - game.usedChances) : 0}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="stats_container">
                    <h2>Jogador</h2>
                    <p>Murilo</p>
                    <h2>Partidas Jogadas</h2>
                    <p>{state.games.length}</p>
                    <h2>Vitórias</h2>
                    <p>{sumVictories(state.games)}</p>
                    <h2>Maior Sequência de Vitórias</h2>
                    <p>{sumVictoryStreak(state.games)}</p>
                    <h2>Pontuação Total</h2>
                    <p>{sumPoints(state.games)}</p>
                </div>
            )}
            <div className="buttons_container">
                {window.innerWidth < 1000 && (
                    <button
                        onClick={() => setShowScore((prev) => !prev)}
                        className="game_button button"
                    >
                        Voltar ao jogo
                    </button>
                )}
                <button
                    className="reset_button button"
                    onClick={handleScoreToggle}
                >
                    {score ? "Ver Estatísticas" : "Ver Partidas"}
                </button>
            </div>
        </div>
    );
}

export default Score;
