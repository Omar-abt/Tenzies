import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [timeElapsed, setTimeElapsed] = React.useState(0)
    
    const [startTime, setStartTime] = React.useState(new Date())
    const [endTime, setEndTime] = React.useState()

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [numOfRolls, setNumOfRolls] = React.useState(0)
    
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    React.useEffect(() => {
        setStartTime(new Date());
    }, [tenzies]);


    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
 
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                die :
                generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setNumOfRolls(-1)
            setTimeElapsed(0)
        }

        setEndTime(new Date())
        setTimeElapsed(() => ((endTime - startTime) / 1000))
        
        setNumOfRolls(numOfRolls => numOfRolls + 1)
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))


    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>

            {tenzies && 
            <div>
                <p className="game-score">Total Number of Rolls: <span className="score-number">{numOfRolls}</span></p>
                <p className="game-score">Total time taken: <span className="score-number">{timeElapsed}</span></p>
            </div>}
        </main>
    )
}