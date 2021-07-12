import React, {useEffect} from 'react';
import ReactDOM from 'react-dom'
import './index.css';
import moment from 'moment';

const hostName = window.location.hostname;
window.moment = require('moment')

export function NameForm(props) {
    const [name, setName] = React.useState("");
    const [date, setDate] = React.useState(moment().format('YYYY-MM-DD'))

    const handleSubmit = (evt) => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: name, dueDate: date})
        };
        fetch(`http://${hostName}:3000/task/add`, requestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                },
                (error) => {
                    console.log(error)
                }
            )
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" value={name} onChange={e => setName(e.target.value)} required/>
            </label>
            <label>
                Due Date:
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required/>
            </label>
            <input type="submit" value="Submit"/>
        </form>
    );
}


function CheckItem(props) {
    const [checked, setChecked] = React.useState(props.item.isDone);

    const handleChange = () => {
        var newValue = !checked;
        setChecked(newValue);
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: props.item.id, value: newValue ? 1 : 0})
        };
        fetch(`http://${hostName}:3000/task/changeStatus`, requestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                },
                (error) => {
                    console.log(error)
                }
            )
    };

    return <div>
        <input type="checkbox" name={props.item.name} checked={checked} onChange={handleChange}/>{props.item.name}
    </div>
}

function ToDoList(props) {
    const [error, setError] = React.useState(null)
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [items, setItems] = React.useState([])

    useEffect(() => {
        fetch(`http://${hostName}:3000/today`)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result.items)

                },
                (error) => {
                    setIsLoaded(true);
                    setError(error)
                }
            )
    }, [])


    if (error) {
        return <div>Błąd: {error.message}</div>;

    } else if (!isLoaded) {
        return <div>Ładowanie...</div>;
    } else {
        return <div>
            {items.map((item) => {
                return <CheckItem key={item.id} item={item}/>
            })}
            <NameForm/>
        </div>;
    }
}

ReactDOM.render(
    <ToDoList/>,
    document.getElementById('root')
);
