import React from "react";
import {Checkbox} from "semantic-ui-react";

export function CheckItem(props) {
    const hostName = window.location.hostname;

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

export default CheckItem;