import { useEffect, useState } from "react";

function Game() {
    const [gamePlayed, setGamePlayed] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("game_index") === null) {
            localStorage.setItem("game_index", "0");
        } else if (gamePlayed) {
            const game_index =
                JSON.parse(localStorage.getItem("game_index")!) + 1;
            localStorage.setItem("game_index", JSON.stringify(game_index));
        }
    }, [word, gamePlayed]);

    const charInput = (
        e: ChangeEvent<HTMLInputElement>,
        lineIndex: number,
        collumnIndex: number
    ) => {
        const newTries = Array.from(tries);
        newTries[lineIndex][collumnIndex] = e.currentTarget.value.toUpperCase();

        setTries(newTries);

        if (collumnIndex < word.length - 1) {
            inputRefs.current[lineIndex][collumnIndex + 1]?.focus();
        }
    };

    const submitTry = async (lineIndex: number) => {
        if (tries[lineIndex].every((letter) => letter !== "")) {
            await validateWord(lineIndex);
            if (lineIndex < word.length - 1) {
                inputRefs.current[lineIndex + 1][0]?.focus();
            }
        }
    };

    return (
        <div className={`section_1 ${showScore ? "hidden" : ""}`}>
            <div className="game_container">
                {Array.from({ length: 5 }).map((_, lineIndex) => (
                    <div
                        className="line_container"
                        id={`word_line_${lineIndex}`}
                        key={lineIndex}
                        onKeyDown={async (e) => {
                            if (
                                lineIndex === currentLine &&
                                e.key === "Enter"
                            ) {
                                await submitTry(lineIndex);
                            }
                        }}
                    >
                        {Array.from({ length: word.length }).map(
                            (_, collumnIndex) => (
                                <input
                                    type="text"
                                    maxLength={1}
                                    className={`letter_container ${
                                        result[lineIndex] &&
                                        (result[
                                            lineIndex
                                        ].correctPosition.includes(collumnIndex)
                                            ? "correct"
                                            : result[
                                                  lineIndex
                                              ].wrongPosition.includes(
                                                  collumnIndex
                                              )
                                            ? "yellow"
                                            : "")
                                    }`}
                                    id={`letter_container_${lineIndex}_${collumnIndex}`}
                                    key={collumnIndex}
                                    onChange={(e) =>
                                        charInput(e, lineIndex, collumnIndex)
                                    }
                                    onKeyDown={async (e) => {
                                        if (e.key === "ArrowLeft") {
                                            inputRefs.current[lineIndex][
                                                collumnIndex - 1
                                            ]!.focus();
                                        }
                                        if (e.key === "ArrowRight") {
                                            inputRefs.current[lineIndex][
                                                collumnIndex + 1
                                            ]!.focus();
                                        }
                                    }}
                                    onKeyUp={async (e) => {
                                        if (
                                            e.key === "ArrowLeft" ||
                                            e.key === "ArrowRight"
                                        ) {
                                            e.currentTarget.select();
                                        }
                                    }}
                                    onFocus={(e) => {
                                        if (e.currentTarget.value !== "") {
                                            e.currentTarget.select();
                                        }
                                    }}
                                    disabled={currentLine !== lineIndex}
                                    value={tries[lineIndex][collumnIndex]}
                                    ref={(el) =>
                                        (inputRefs.current[lineIndex][
                                            collumnIndex
                                        ] = el)
                                    }
                                    autoComplete="off"
                                />
                            )
                        )}
                    </div>
                ))}
            </div>
            <div className="buttons_container">
                <button
                    onClick={() => {
                        resetGame(
                            result[result.length - 1].correctPosition
                                ?.length === word.length
                        );
                    }}
                    className="reset_button button"
                >
                    Novo Jogo
                </button>
                {window.innerWidth < 1000 && (
                    <button
                        onClick={() => setShowScore((prev) => !prev)}
                        className="score_button button"
                    >
                        Sua Pontuação
                    </button>
                )}
            </div>
        </div>
    );
}

export default Game;
