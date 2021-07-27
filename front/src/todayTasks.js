import {Grid} from "semantic-ui-react";
import React, {useEffect} from "react";
import {CheckItem} from "./checkItem";

var _ = require('lodash');

function TodayTasks(props) {

    const [error, setError] = React.useState(null)
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [items, setItems] = React.useState([])

    useEffect(() => {
        fetch(`http://${window.location.hostname}:3000/today`)
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
        var itemsForWork = _.filter(items, function (i) {
            return i.type === 'work'
        });
        var itemsForHome = _.filter(items, function (i) {
            return i.type === 'home'
        });

        return <div>
            <Grid columns={2}>
                <Grid.Column>Dom</Grid.Column>
                <Grid.Column>Praca</Grid.Column>
                <Grid.Column><CheckboxList list={itemsForHome}/></Grid.Column>
                <Grid.Column><CheckboxList list={itemsForWork}/></Grid.Column>

            </Grid>
        </div>
    }
}

function CheckboxList(props) {

    return <Grid columns={1}>
        {props.list.map((item) => {
            return <Grid.Column><CheckItem key={item.id} item={item}/></Grid.Column>
        })}
    </Grid>;
}

export default TodayTasks;