import React, {useEffect} from 'react';
import ReactDOM from 'react-dom'
import './index.css';
import {Checkbox, Grid, Tab} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const hostName = window.location.hostname;

window.moment = require('moment');
var _ = require('lodash');

const panes = [
    {menuItem: 'Tydzień', render: () => <Tab.Pane><ToDoList/></Tab.Pane>},
    {
        menuItem: 'Taski',
        render: () => <Tab.Pane>
            <div><TaskList/><NameForm/></div>
        </Tab.Pane>
    },
    {menuItem: 'Habit tracker', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane>},
]

export function NameForm(props) {
    const [name, setName] = React.useState("");

    const handleSubmit = (evt) => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: name})
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
            <input type="submit" value="Submit"/>
        </form>
    );
}


function CheckItem(props) {
    const [checked, setChecked] = React.useState(props.item.isDone !== 0);

    const handleChange = () => {
        const newValue = !checked;
        setChecked(newValue);
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: props.item.id, value: newValue ? 1 : 0})
        };
        fetch(`http://${hostName}:3000/toDoItem/changeStatus`, requestOptions)
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

    return <Checkbox toggle label={props.item.name} checked={checked} onChange={handleChange}/>
}

function getDayName(day) {
    return (new Date(day)).toLocaleDateString('pl-PL', {weekday: 'long'});
}

function listForWeek(items, day) {
    return <Grid>
        <Grid.Row style={{padding: 10}}>{getDayName(day)} ({(day.format('DD-MM-YYYY'))})</Grid.Row>
        {items.map((item) => {
            return <Grid.Row><Grid.Column><CheckItem key={item.id} item={item}/></Grid.Column></Grid.Row>
        })}
    </Grid>;
}

function summary(items) {
    return <Grid>
        <Grid.Row>Summary</Grid.Row>
    </Grid>;
}

function getItemsForDate(items, date) {
    return window._.filter(items, function (i) {
        return i.dueDate == date.format('YYYY-MM-DD')
    });
}

function ToDoList(props) {
    const [error, setError] = React.useState(null)
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [items, setItems] = React.useState([])

    useEffect(() => {
        fetch(`http://${hostName}:3000/week`)
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
    } else if (items) {
        var date = window.moment().startOf('isoWeek');
        return <Grid columns={4} celled>
            {window._.times(7, (t) => {
                if (t !== 0) {
                    date.add(1, 'd');
                }
                var itemsForDate = getItemsForDate(items, date);
                return <Grid.Column>{listForWeek(itemsForDate, date)}</Grid.Column>
            })}
            <Grid.Column>{summary(items)}</Grid.Column>
        </Grid>;
    }
}

function TaskList(props) {
    const [error, setError] = React.useState(null)
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [items, setItems] = React.useState([])

    useEffect(() => {
        fetch(`http://${hostName}:3000/task/all`)
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

    const handleChange = (e, {checked}) => {

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: e.target.id, value: checked ? 1 : 0, period: e.target.value})
        };

        fetch(`http://${hostName}:3000/toDoItem/schedule`, requestOptions)
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

    if (error) {
        return <div>Błąd: {error.message}</div>;

    } else if (!isLoaded) {
        return <div>Ładowanie...</div>;
    } else {
        return <Grid>
            {items.map((item) => {
                return <Grid.Row><Grid.Column><Checkbox toggle key={item.id}
                                                        label={item.name}
                                                        id={item.id}
                                                        value='daily'
                                                        onChange={handleChange}/></Grid.Column></Grid.Row>
            })}
        </Grid>;
    }
}

ReactDOM.render(
    <Tab panes={panes}/>,
    document.getElementById('root')
);
