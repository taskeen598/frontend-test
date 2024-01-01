import React, { useState } from 'react';
import EditTask from '../Modals/EditTask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const Cards = ({ taskObj, index, deleteTask, updateListArray, stateManage, setStateManage }) => {
    const [modal, setModal] = useState(false);
    const [dueDate, setDueDate] = useState(taskObj.Due_Date || null);
    const [taskPriority, setTaskPriority] = useState(taskObj.Task_Priority || 'low');
    const [completed, setCompleted] = useState(taskObj.Completed);

    const handleCheckboxChange = async () => {
        setCompleted(!completed);

        try {
            const authToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';

            const response = await fetch(`https://todo-app-y71s.onrender.com/update-task-status/${taskObj._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    Completed: !completed
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
            } else {
                const errorData = await response.json();
                console.error('Error updating task:', errorData.message);
            }
        } catch (error) {
            console.error('Error updating task:', error.message);
        }
    };

    const colors = [
        {
            primaryColor: "#d4a373",
            secondaryColor: "#ffe1a8"
        },
        {
            primaryColor: "#F9D288",
            secondaryColor: "#fec89a"
        },
        {
            primaryColor: "#51ae69",
            secondaryColor: "#b5e48c"
        },
        {
            primaryColor: "#F48687",
            secondaryColor: "#fec3a6"
        },
        {
            primaryColor: "#e05780",
            secondaryColor: "#ffc2d4"
        }
    ];

    const toggle = () => {
        setModal(!modal);
    };

    const updateTask = (obj) => {
        updateListArray(obj, index);
    };

    const handleDelete = () => {
        deleteTask(taskObj._id);
    };
    return (
        <div className="card-wrapper mr-5">
            <div className="card-top" style={{ backgroundColor: colors[index % 5].primaryColor }}>
                <div className="task-holder">
                    <span className="card-header" style={{ backgroundColor: colors[index % 5].secondaryColor, borderRadius: "5px" }}>{taskObj.Title}</span>
                    <textarea className="mt-3 form-control" style={{ backgroundColor: colors[index % 5].secondaryColor, borderRadius: "5px", padding: "5px", border: "none", minHeight: "100px", resize: "none" }} value={taskObj.Description} readOnly></textarea>
                    <div className="input-group mt-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" style={{ backgroundColor: colors[index % 5].primaryColor, color: "#fff", border: "none" }}>Due Date</span>
                        </div>
                        <input type="text" className="form-control" value={dueDate ? new Date(dueDate).toLocaleDateString() : ''} readOnly />
                    </div>
                    <div className="input-group mt-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" style={{ backgroundColor: colors[index % 5].primaryColor, color: "#fff", border: "none" }}>Task Priority</span>
                        </div>
                        <input type="text" className="form-control" value={taskPriority} readOnly />
                    </div>
                    <div className="form-check mt-3">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            style={{ backgroundColor: colors[index % 5].primaryColor, color: "#fff" }}
                            id={`completionCheckbox-${index}`}
                            checked={completed}
                            onChange={handleCheckboxChange}
                        />
                        <div className='completed-icons-delete-edit'>
                        <label className="form-check-label" style={{ backgroundColor: colors[index % 5].primaryColor, color: "#fff" }} htmlFor={`completionCheckbox-${index}`}>Completed</label>
                        <div className="ml-auto icons-delete-edit">
                            <FontAwesomeIcon icon={faEdit} className="mr-3" style={{ color: colors[index % 5].primaryColor, cursor: "pointer" }} onClick={() => setModal(true)} />
                            <FontAwesomeIcon icon={faTrash} style={{ color: colors[index % 5].primaryColor, cursor: "pointer" }} onClick={handleDelete} />
                        </div>
                        </div>
                    </div>
                </div>
                <EditTask
                    modal={modal}
                    toggle={toggle}
                    updateTask={updateTask}
                    taskObj={{ ...taskObj, Due_Date: dueDate, Task_Priority: taskPriority, Completed: completed }}
                    stateManage={stateManage}
                    setStateManage={setStateManage}
                />
            </div>
        </div>
    );
    
};

export default Cards;