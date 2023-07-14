import { useState, useEffect, useRef } from 'react'
import goalsService from '../services/goals' 


const Goals = ( {dark} ) => {

    const [goals, setGoals] = useState([])
    const [newGoal, setNewGoal] = useState('')

    const contentTimer = useRef(null)

    useEffect(() => {
        // console.log('rerender goals')

        goalsService.getAll()
            .then(response => {
                setGoals(response)
            })

    }, [])


    const handleInputChange = (e) => {
        setNewGoal(e.target.value)
    }

    const handleAddGoal = async (input = newGoal) => {

        if (input.trim() !== '') { 
            const newGoal = {
                content: input
            }

            const savedGoal = await goalsService.create(newGoal)
            console.log(savedGoal)

            setGoals(goals.concat({...newGoal, id: savedGoal.id}))
            setNewGoal('')
        }
    }

    const handleKeyDown = (e) => {
    
        if(e.key === 'Enter'){
            handleAddGoal()
        }
    
    }

    const handleGoalEdit = async (id, e) => {
        const newContent = e.target.value
        const currGoal = goals.find(goal => goal.id === id)
        const updatedGoals = goals.map(goal => goal.id === id ? {...goal, content: newContent} : goal)
        setGoals(updatedGoals)

        clearTimeout(contentTimer.current)
        contentTimer.current = setTimeout(() => {
            goalsService.update(id, {...currGoal, content: newContent})
                .then(() => {
                    console.log(`goal ${id} saved!`)
                })
        }, 3000)

    }

    const handleDeleteGoal = async (id) => {

        await goalsService.remove(id)
        const updatedGoals = goals.filter(goal => goal.id !== id)
        setGoals(updatedGoals)
    }
    
    return (
        <div className = "goals"> 

            <div className = {`header ${dark}`}>
                <h1> My Goals </h1>

                <input
                    type="text"
                    value = {newGoal}
                    onChange = {handleInputChange}
                    onKeyDown = {handleKeyDown}
                    placeholder = "Add a goal"
                />

                <button onClick = {() => handleAddGoal()}> + </button>
            </div>

            <div className = {`goal-list ${dark}`}>
                <ul>
                    {goals.map(goal => (
                        <li key = {goal.id}>
                            <input className = "goal-content" value = {goal.content} onChange = {event => handleGoalEdit(goal.id, event)}/>
                            <button className = "delete-button" onClick={() => handleDeleteGoal(goal.id)}> - </button>
                        </li>
                    ))}
                </ul>
            </div>



        </div>

    )

}

export default Goals

