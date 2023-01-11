import React, {useState} from 'react';
import {Card} from "react-bootstrap";
import checkmark from './images/checkmark.png'
import edit from './images/edit.png'
import deleteImage from './images/delete.png'
import {onValue, ref} from "firebase/database";
import {auth, db} from "../firebase-config";
import {update} from 'firebase/database'

function Todo(props) {
    const todo = props.todo
    const [key, setKey] = useState("")
    const toDoReference = ref(db, `todos/${auth.currentUser.uid}/`)
    const completeTodo = () => {
        onValue(toDoReference, (snapshot) => {
            const snap = snapshot.val()
            console.log(snap)
            snapshot.forEach(childSnapshot => {
                if (todo.toDoName == snap[childSnapshot.key].toDoName) {
                    setKey(childSnapshot.key)
                }
            })
            console.log(key)
        })
        const toDoChildReference = ref(db, `/todos/${auth.currentUser.uid}/${key}/`)
        update(toDoChildReference, {
            completed: true
        })
    }

    const editTodo = () => {

    }

    const deleteTodo = () => {

    }

    return (
        <Card className="mx-auto" style={{width: '50%', marginTop: '15px', marginBottom: '15px', backgroundColor: 'black', borderStyle: 'solid', borderColor: 'red', borderWidth: '5px'}}>
            <Card.Body>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <button style={{backgroundColor: 'transparent', border: 'none'}} onClick={completeTodo}><img src={checkmark} alt="complete" width="25px" height="25px"/></button>
                    <div style={{color: 'white', marginLeft: '15px', width: '100%'}}>{todo.toDoName}</div>
                    <button style={{backgroundColor: 'transparent', border: 'none'}} onClick={editTodo}><img src={edit} alt="complete" width="25px" height="25px"/></button>
                    <button style={{backgroundColor: 'transparent', border: 'none'}} onClick={deleteTodo}><img src={deleteImage} alt="complete" width="25px" height="25px"/></button>
                </div>
            </Card.Body>
        </Card>
    );
}

export default Todo;