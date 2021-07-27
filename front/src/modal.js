import React from 'react'
import {Button, Checkbox, Form, Modal} from 'semantic-ui-react'

function AddTaskModal(props) {
    const [open, setOpen] = React.useState(false)
    const [state, setState] = React.useState({
        name: "",
        isHabit: false,
        type: ""
    })

    const createTask = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(state)
        };

        fetch(`http://${window.location.hostname}:3000/task/add`, requestOptions)
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
    const toggle = (prevState) => setState((prevState) => ({...state, isHabit: !prevState.isHabit}))

    const handleChange = (evt) => setState({...state, [evt.target.name]: evt.target.value});

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button circular floated='right' icon='add' color="violet"/>}
        >
            <Modal.Header>Dodaj zadanie</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <label>Name</label>
                        <input placeholder='Name'
                               name="name"
                               value={state.name}
                               onChange={handleChange}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Rodzaj</label>
                        <input placeholder='Rodzaj' name="type"
                               value={state.type}
                               onChange={handleChange}/>
                    </Form.Field>
                    <Checkbox toggle
                              name="isHabit"
                              label='is habit?'
                              onChange={toggle}
                              checked={state.isHabit}
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => setOpen(false)}>
                    Poniechaj!
                </Button>
                <Button
                    content="Utwórz"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => {
                        createTask();
                        setOpen(false)
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}

export default AddTaskModal;