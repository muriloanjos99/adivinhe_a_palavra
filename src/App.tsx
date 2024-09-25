import { useEffect, useReducer, useRef, useState } from "react";
import Swal from "sweetalert2";
import Score from "./components/Score";
import { EGameActions } from "./types/EGameActions";
import initialReducerState from "./utils/initialReducerState";
import { gameReducer } from "./utils/gameReducer";
import "./App.css";
import { TResult } from "./types/TResult";
import randomWord from "./utils/randomWord";

function App() {
    const [state, dispatch] = useReducer(gameReducer, initialReducerState);
    const { currentGame } = state;
    const [currentLine, setCurrentLine] = useState<number | null>(0);
    const [showScore, setShowScore] = useState<boolean>(false);

    const inputRefs = useRef<(HTMLInputElement | null)[][]>(
        Array.from({ length: 5 }, () =>
            Array.from<HTMLInputElement | null>({
                length: currentGame.word.length,
            }).fill(null)
        )
    );

    useEffect(() => {
        const updateWindowWidth = () => {
            const root = document.documentElement;
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            root.style.setProperty("--vw", `${vw}px`);
            root.style.setProperty("--vh", `${vh}px`);
        };

        updateWindowWidth();

        window.addEventListener("resize", updateWindowWidth);
        return () => window.removeEventListener("resize", updateWindowWidth);
    }, []);

    useEffect(() => {
        if (
            currentGame.results[(currentLine || 1) - 1].correctPosition
                .length === currentGame.word.length
        ) {
            setTimeout(() => {
                Swal.fire({
                    icon: "warning",
                    title: "Você acertou!",
                    allowEscapeKey: true,
                    allowOutsideClick: false,
                });
            }, 0);
            dispatch({ type: EGameActions.finishGame, payload: true });
            setCurrentLine(null);
            return;
        } else if (currentGame.usedChances === 5) {
            setTimeout(() => {
                Swal.fire({
                    icon: "warning",
                    title: "Fim do jogo!",
                    allowEscapeKey: true,
                    allowOutsideClick: false,
                });
            }, 0);
            dispatch({ type: EGameActions.finishGame, payload: false });
        }
    }, [currentGame.usedChances]);

    const letterInputHandler = (
        e: React.ChangeEvent<HTMLInputElement>,
        lineIndex: number,
        letterIndex: number
    ) => {
        const currentTry = Array.from(state.currentGame.tries)[lineIndex];
        const newLetter = e.currentTarget.value.toUpperCase();

        currentTry[letterIndex] = newLetter;

        dispatch({
            type: EGameActions.letterInput,
            payload: { newTry: currentTry, lineIndex: lineIndex },
        });

        if (letterIndex < currentGame.word.length - 1) {
            requestAnimationFrame(() => {
                inputRefs.current[lineIndex][letterIndex + 1]!.focus();
            });
        }
    };

    const verifyTry = async (lineIndex: number) => {
        const currentTry = Array.from(state.currentGame.tries)[lineIndex];

        if (currentTry.some((letter) => letter === "" || letter === " ")) {
            throw new Error("Todas as letras devem estar preenchidas");
        }

        const { word } = currentGame;
        const wordArray = word.toUpperCase().split("");
        const newResult: TResult = {
            correctPosition: [],
            wrongPosition: [],
        };

        const tryLetterCount = {} as Record<string, number>;
        currentTry.forEach((letter) => {
            tryLetterCount[letter] = (tryLetterCount[letter] || 0) + 1;
        });

        const wordLetterCount = {} as Record<string, number>;
        wordArray.forEach((letter) => {
            wordLetterCount[letter] = (wordLetterCount[letter] || 0) + 1;
        });

        currentTry.forEach((letter, i) => {
            if (wordArray[i] === letter) {
                newResult.correctPosition.push(i);
                wordLetterCount[letter]--;
                tryLetterCount[letter]--;
            }
        });

        currentTry.forEach((letter, i) => {
            if (
                wordLetterCount[letter] > 0 &&
                !newResult.correctPosition.includes(i)
            ) {
                newResult.wrongPosition.push(i);
                wordLetterCount[letter]--;
                tryLetterCount[letter]--;
            }
        });

        return newResult;
    };

    const submitTryHandler = async (lineIndex: number) => {
        try {
            const newResult = await verifyTry(lineIndex);

            dispatch({
                type: EGameActions.submitResult,
                payload: { newResult, lineIndex },
            });
        } catch {
            return Swal.fire({
                icon: "warning",
                title: "Ei, você precisa preencher todas as letras!",
                allowEnterKey: false,
            });
        }

        setCurrentLine((prev) => prev! + 1);

        if (lineIndex !== 4) {
            requestAnimationFrame(() => {
                inputRefs.current[lineIndex + 1][0]?.focus();
            });
        }
    };

    const handleNewGame = () => {
        if (!currentGame.finished) {
            dispatch({ type: EGameActions.finishGame, payload: false });
        }
        const newWord = randomWord();
        dispatch({ type: EGameActions.newGame, payload: newWord });
        setCurrentLine(0);
        requestAnimationFrame(() => {
            inputRefs.current[0][0]!.focus();
        });
    };

    return (
        <>
            <header id="header">
                <h1>Adivinhe a palavra!</h1>
            </header>
            <main id="main">
                <div className={`section_1 ${showScore ? "hidden" : ""}`}>
                    <div className="game_container">
                        {Array.from({ length: 5 }).map((_, lineIndex) => (
                            <div
                                className="line_container"
                                id={`line_${lineIndex}`}
                                key={`line_${lineIndex}`}
                                onKeyDown={(e) => {
                                    if (
                                        lineIndex === currentLine &&
                                        e.key === "Enter"
                                    ) {
                                        e.preventDefault();
                                        submitTryHandler(lineIndex);
                                    }
                                }}
                            >
                                {state.currentGame.tries[lineIndex].map(
                                    (letter, letterIndex) => (
                                        <input
                                            type="text"
                                            maxLength={1}
                                            className={`letter_container ${
                                                currentGame.results[
                                                    lineIndex
                                                ] &&
                                                (currentGame.results[
                                                    lineIndex
                                                ].correctPosition.includes(
                                                    letterIndex
                                                )
                                                    ? "correct"
                                                    : currentGame.results[
                                                          lineIndex
                                                      ].wrongPosition.includes(
                                                          letterIndex
                                                      )
                                                    ? "yellow"
                                                    : "")
                                            }`}
                                            id={`letter_container_${lineIndex}_${letterIndex}`}
                                            key={letterIndex}
                                            onChange={(e) =>
                                                letterInputHandler(
                                                    e,
                                                    lineIndex,
                                                    letterIndex
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === "ArrowLeft" &&
                                                    letterIndex > 0
                                                ) {
                                                    inputRefs.current[
                                                        lineIndex
                                                    ][letterIndex - 1]?.focus();
                                                }
                                                if (
                                                    e.key === "ArrowRight" &&
                                                    letterIndex <
                                                        currentGame.word
                                                            .length -
                                                            1
                                                ) {
                                                    inputRefs.current[
                                                        lineIndex
                                                    ][letterIndex + 1]?.focus();
                                                }
                                            }}
                                            onKeyUp={(e) => {
                                                if (
                                                    e.key === "ArrowLeft" ||
                                                    e.key === "ArrowRight"
                                                ) {
                                                    e.currentTarget.select();
                                                }
                                            }}
                                            onFocus={(e) => {
                                                if (
                                                    e.currentTarget.value !== ""
                                                ) {
                                                    e.currentTarget.select();
                                                }
                                            }}
                                            disabled={currentLine !== lineIndex}
                                            value={
                                                currentLine === lineIndex
                                                    ? letter
                                                    : currentGame.tries[
                                                          lineIndex
                                                      ][letterIndex]
                                            }
                                            ref={(el) =>
                                                (inputRefs.current[lineIndex][
                                                    letterIndex
                                                ] = el)
                                            }
                                            autoComplete="off"
                                            autoFocus={
                                                lineIndex === 0 &&
                                                letterIndex === 0
                                            }
                                        />
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="buttons_container">
                        <button
                            onClick={handleNewGame}
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
                {window.innerWidth > 1000 && <div className="separator"></div>}
                <Score
                    showScore={showScore}
                    setShowScore={setShowScore}
                    state={state}
                />
            </main>

            <footer id="footer">
                <p>Made by Murilo R. A. - 2024</p>
            </footer>
        </>
    );
}

export default App;
