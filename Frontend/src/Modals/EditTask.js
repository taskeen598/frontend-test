import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const EditTaskPopup = ({ modal, toggle, updateTask, taskObj, stateManage, setStateManage }) => {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [taskPriority, setTaskPriority] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'taskName') {
            setTaskName(value);
        } else if (name === 'description') {
            setDescription(value);
        } else if (name === 'taskPriority') {
            setTaskPriority(value);
        } else if (name === 'dueDate') {
            setDueDate(value);
        }
    };

    async function handleUpdateTodo(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const authToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';

            const response = await axios.put(
                `https://todo-app-y71s.onrender.com/update-task/${taskObj._id}`,
                {
                    Title: taskName,
                    Description: description,
                    Task_Priority: taskPriority,
                    Due_Date: dueDate,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                }
            );

            if (response.status === 200) {
                toggle();
                if (stateManage) {
                    setStateManage(false);
                } else {
                    setStateManage(true);
                }
                updateTask(response.data.data);
                toast.success('Task updated successfully', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            } else {
                console.error('Error updating task:', response.data.message);
                toast.error('Error updating task', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error updating task:', error.message);
            toast.error('Error updating task', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setTaskName(taskObj.Title);
        setDescription(taskObj.Description);
        setTaskPriority(taskObj.Task_Priority);
        setDueDate(taskObj.Due_Date ? new Date(taskObj.Due_Date).toISOString().split('T')[0] : null);
    }, [taskObj]);
    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Update Task</ModalHeader>
            <ModalBody>
                <div className="form-group">
                    <label>Task Name</label>
                    <input type="text" className="form-control" value={taskName} onChange={(e) => handleChange(e)} name="taskName" />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea rows="5" className="form-control" value={description} onChange={(e) => handleChange(e)} name="description"></textarea>
                </div>
                <div className="form-group">
                    <label>Task Priority</label>
                    <select className="form-control" value={taskPriority} onChange={(e) => handleChange(e)} name="taskPriority">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Due Date</label>
                    <input type="date" className="form-control" value={dueDate} onChange={(e) => handleChange(e)} name="dueDate" />
                </div>
            </ModalBody>
            <ModalFooter>
                <Button type="submit" color="primary" onClick={handleUpdateTodo} disabled={loading}>
                    {!loading ? 'Update' : 'Updating...'}
                </Button>
                <Button color="secondary" onClick={toggle}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default EditTaskPopup;