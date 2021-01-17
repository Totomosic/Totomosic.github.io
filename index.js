Chess.Initialize().then(() => {
    const app = Chess.CreateBoard({
        targetElement: "#chess-board",
        draggablePieces: true,
        allowUndo: true,
    })

    const stormPlayer = Chess.CreateStormPlayer()

    const timeSelector = document.getElementById("storm-ttm")
    if (timeSelector) {
        stormPlayer.setTimeToMove(Number(timeSelector.value))
        timeSelector.onchange = (e) => {
            stormPlayer.setTimeToMove(Number(timeSelector.value))
        }
    }

    const levelSelector = document.getElementById("storm-level")
    if (levelSelector) {
        stormPlayer.setLevel(Number(levelSelector))
        levelSelector.onchange = (e) => {
            stormPlayer.setLevel(Number(levelSelector.value))
        }
    }

    const teamSelector = document.getElementById("play-as")
    if (teamSelector) {
        const updateTeam = () => {
            const team = teamSelector.value
            if (team === "white") {
                if (app.board.isFlipped) {
                    app.board.flip()
                }
                app.removePlayer(stormPlayer)
                app.addPlayer("black", stormPlayer)
            } else if (team === "black") {
                if (!app.board.isFlipped) {
                    app.board.flip()
                }
                app.removePlayer(stormPlayer)
                app.addPlayer("white", stormPlayer)
            } else {
                if (app.board.isFlipped) {
                    app.board.flip()
                }
                app.removePlayer(stormPlayer)
            }
        }
        updateTeam()
        teamSelector.onchange = updateTeam
    }

    const undoButton = document.getElementById("undo-button")
    if (undoButton) {
        undoButton.onclick = (e) => {
            app.board.undoLastMove()
        }
    }

    const resetButton = document.getElementById("reset-button")
    if (resetButton) {
        resetButton.onclick = (e) => {
            app.board.setFromStartingPosition()
        }
    }

    const flipButton = document.getElementById("flip-button")
    if (flipButton) {
        flipButton.onclick = (e) => {
            app.board.flip()
        }
    }

    const engineLineEnable = document.getElementById("show-engine-lines")
    if (engineLineEnable) {
        engineLineEnable.onchange = (e) => {
            app.analyzer.linesEnabled = engineLineEnable.checked
        }
        app.analyzer.linesEnabled = engineLineEnable.checked
    }

    const engineEvalEnable = document.getElementById("show-engine-eval")
    if (engineEvalEnable) {
        engineEvalEnable.onchange = (e) => {
            app.analyzer.evalEnabled = engineEvalEnable.checked
        }
        app.analyzer.evalEnabled = engineEvalEnable.checked
    }

    const editButton = document.getElementById("edit-button")
    if (editButton) {
        editButton.onclick = (e) => {
            editor.beginEditing(true)
        }
    }

    window.App = app;
    window.Storm = Chess.Storm

    const loadJsonFile = (data) => {
        const moves = data.RESULT.MOVES
        let currentIndex = 0

        document.addEventListener("keydown", (event) => {
            if (event.code === "ArrowRight") {
                app.board.playMove(moves[currentIndex], true)
                currentIndex++
            }
        })

        app.board.onMovePlayed.addEventListener((info) => {
            if (info.isUndo) {
                currentIndex--
            }
        })
    }

    const loadPgn = (data) => {
        const matches = app.readPgn(data)
        const match = matches[0]
        const moves = match.moves

        let currentIndex = 0

        document.addEventListener("keydown", (event) => {
            if (event.code === "ArrowRight") {
                app.board.playMove(moves[currentIndex], true)
                currentIndex++
            }
        })

        app.board.onMovePlayed.addEventListener((info) => {
            if (info.isUndo) {
                currentIndex--
            }
        })
    }
    
    window.loadJsonFile = loadJsonFile
    window.loadPgn = loadPgn

    app.board.setFromStartingPosition()
})
