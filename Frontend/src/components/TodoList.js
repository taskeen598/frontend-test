import React, { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateTaskPopup from '../Modals/CreateTask';
import { useNavigate } from "react-router-dom";
import Card from './Cards';
import axios from 'axios';

const TodoList = () => {
    const [modal, setModal] = useState(false);
    const [taskList, setTaskList] = useState([]);
    const [stateManage, setStateManage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [counts, setCounts] = useState({
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        lowPriorityTasks: 0,
        mediumPriorityTasks: 0,
        highPriorityTasks: 0,
    });
    const [filterOption, setFilterOption] = useState('all');
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const handleRefresh = () => {
        window.location.reload();
    };

    useEffect(() => {
        handleGetALLTodo();
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [stateManage, filterOption]);

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            localStorage.removeItem("token");
            toast.success('Logout successful');
            navigate("/");
        } catch (error) {
            console.error('Logout failed:', error.message);
            toast.error('Error during logout');
        }
    };
    const handleGetALLTodo = async () => {
        try {
            setLoading(true);
            const authToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
            const response = await axios.get("https://todo-app-y71s.onrender.com/my-tasks", {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            const data = response.data;
            console.log(data.data);
            setLoading(false);
            setTaskList(data.data);
            updateCounts(data.data);
        } catch (error) {
            console.error("Error occurred:", error);
        }
    };

    const updateCounts = (data) => {
        const totalTasks = data.length;
        const pendingTasks = data.filter(task => !task.Completed).length;
        const completedTasks = data.filter(task => task.Completed).length;
        const lowPriorityTasks = data.filter(task => task.Task_Priority === 'low').length;
        const mediumPriorityTasks = data.filter(task => task.Task_Priority === 'medium').length;
        const highPriorityTasks = data.filter(task => task.Task_Priority === 'high').length;

        setCounts({
            totalTasks,
            pendingTasks,
            completedTasks,
            lowPriorityTasks,
            mediumPriorityTasks,
            highPriorityTasks,
        });
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(`https://todo-app-y71s.onrender.com/delete-task/${id}`, {
                method: "delete",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''}`,
                },
            });

            const data = await response.json();
            console.log(data.message);
            toast.success('Task deleted successfully');
            setStateManage((prev) => !prev);
        } catch (error) {
            console.error("Error occurred:", error);
            toast.error('Error deleting task');
        }
    };

    const updateListArray = (obj, index) => {
        let tempList = taskList;
        tempList[index] = obj;
        localStorage.setItem("taskList", JSON.stringify(tempList));
        setTaskList(tempList);
        updateCounts(tempList);
    };

    const toggle = () => {
        setModal(!modal);
    };

    const handleFilterChange = (option) => {
        setFilterOption(option);
        closeDropdown();
    };

    const filterTasks = () => {
        switch (filterOption) {
            case 'completed':
                return taskList.filter(task => task.Completed);
            case 'pending':
                return taskList.filter(task => !task.Completed);
            case 'low':
                return taskList.filter(task => task.Task_Priority === 'low');
            case 'medium':
                return taskList.filter(task => task.Task_Priority === 'medium');
            case 'high':
                return taskList.filter(task => task.Task_Priority === 'high');
            default:
                return taskList;
        }
    };

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };

    const closeDropdown = () => {
        setShowDropdown(false);
    };

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            closeDropdown();
        }
    };

    return (
        <>
            <div className="header text-center">
                <h3 className='heading-task'>Task App</h3>
                <div className="task-counts div-row">
                    <div className='first-div-row'>
                        <div className="count-box">
                            <div className="count-label">Total</div>
                            <div className="count">{counts.totalTasks}</div>
                        </div>
                        <div className="count-box">
                            <div className="count-label">Pending</div>
                            <div className="count">{counts.pendingTasks}</div>
                        </div>
                        <div className="count-box">
                            <div className="count-label">Completed</div>
                            <div className="count">{counts.completedTasks}</div>
                        </div>
                    </div>
                    <div className='second-div-row'>
                        <div className="count-box">
                            <div className="count-label">Low Priority</div>
                            <div className="count">{counts.lowPriorityTasks}</div>
                        </div>
                        <div className="count-box">
                            <div className="count-label">Medium Priority</div>
                            <div className="count">{counts.mediumPriorityTasks}</div>
                        </div>
                        <div className="count-box">
                            <div className="count-label">High Priority</div>
                            <div className="count">{counts.highPriorityTasks}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="dropdown mt-2" ref={dropdownRef}>
                        <div className='create-refresh-filter'>
                            <div className='first-buttons-filter'>
                            <button className="btn btn-secondary" onClick={handleDropdownToggle}>
                                Filter
                            </button>
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <button className="dropdown-item" onClick={() => handleFilterChange('all')}>All</button>
                                    <button className="dropdown-item" onClick={() => handleFilterChange('completed')}>Completed</button>
                                    <button className="dropdown-item" onClick={() => handleFilterChange('pending')}>Pending</button>
                                    <button className="dropdown-item" onClick={() => handleFilterChange('low')}>Low</button>
                                    <button className="dropdown-item" onClick={() => handleFilterChange('medium')}>Medium</button>
                                    <button className="dropdown-item" onClick={() => handleFilterChange('high')}>High</button>
                                </div>
                            )}
                            <button className="btn btn-primary" onClick={() => setModal(true)}>
                                Create Task
                            </button>
                            </div>
                            <div className='second-buttons-filter'>
                            <button className="btn btn-secondary" onClick={handleRefresh}>
                                Refresh
                            </button>
                            <button className="btn btn-danger" onClick={handleLogout}>
                                Logout
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="task-container">
                {loading ? (
                    <h2>Loading...</h2>
                ) : (
                    filterTasks().map((obj, index) => (
                        <Card
                            key={index + "card-task-main"}
                            stateManage={stateManage}
                            setStateManage={setStateManage}
                            taskObj={obj}
                            index={index}
                            deleteTask={deleteTask}
                            updateListArray={updateListArray}
                        />
                    ))
                )}
            </div>
            <CreateTaskPopup toggle={toggle} modal={modal} stateManage={stateManage} setStateManage={setStateManage} />
            <ToastContainer />
        </>
    );
};

export default TodoList;