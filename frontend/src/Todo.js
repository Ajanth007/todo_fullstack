import { useState, useEffect } from "react";

export default function Todo() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState('');
    const [editId, setEditId] = useState(-1);
    const apiUrl = 'http://localhost:8000';

    //Edit
    const [edittitle, setEdittitle] = useState('');
    const [editdescription, setEditdescription] = useState('');

    const handleSubmit = () => {
        setError("");
        if (title.trim() === '' || description.trim() === '') {
            setError("Please fill all fields");
            setMessage("");
            return;
        }

        fetch(apiUrl + '/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        })
            .then((res) => {
                if (res.ok) {
                    setTodos([...todos, { title, description }]);
                    setMessage("Todo item added successfully!");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);

                    setTitle("");
                    setDescription("");
                    setError(null);
                } else {
                    console.log("server error");
                    setError("Unable to add todo item. Please try again.");
                    setMessage("");
                }
            })
            .catch((err) => {
                setError("Server not reachable.");
                setMessage("");
                console.error("service error may not found");
            });
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiUrl + '/create')
            .then((res) => res.json())
            .then((res) => {
                setTodos(res);
            })
            .catch((err) => {
                console.error("Error fetching items:", err);
            });

    }

    const handleEdit = (item) => {
        setEditId(item.id);
        setEdittitle(item.title);
        setEditdescription(item.description);
    }


    const handleUpdate = () => {
        setError("");
        if (edittitle.trim() === '' || editdescription.trim() === '') {
            setError("Please fill all fields");
            setMessage("");
            return;
        }

        fetch(apiUrl + '/update/' + editId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: edittitle, description: editdescription })
        })
            .then((res) => {
                if (res.ok) {

                    // Update the todo item in the local state
                    const updatedTodos = todos.map((item) => {
                        if (item.id === editId) {
                            item.title = edittitle;
                            item.description = editdescription;
                        }
                        return item;
                    });


                    setTodos(updatedTodos);
                    setMessage("Todo item updated successfully!");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);

                    setEditId(-1);

                } else {
                    console.log("server error");
                    setError("Unable to update todo item. Please try again.");
                    setMessage("");
                }
            })
            .catch((err) => {
                setError("Server not reachable.");
                setMessage("");
                console.error("service error may not found");
            });

    }

    const handleEditCancel = () => {
        setEditId(-1);
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            fetch(apiUrl + '/delete/' + id, {
                method: 'DELETE',
            })
                .then((res) => {
                    if (res.ok) {
                        // Remove the todo item from the local state
                        setTodos(todos.filter((todo) => todo.id !== id));
                    }
                })
                .catch((err) => {
                    setError("Server not reachable.");
                    setMessage("");
                    console.error("service error may not found");
                });
        }
    }

    return (
        <>
            <div className="bg-green-200 p-4 rounded-lg shadow-md">
                <h1 className="mx-125">Todo Project with MERN stack</h1>
            </div>
            <div className="  rounded-lg shadow-md mt-4">
                <h5>Add Item</h5>

                <div className="bg-gray-200 p-4 rounded-lg shadow-md mt-4 flex flex-row gap-5 items-start">
                    <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className="border border-gray-300 rounded px-2 py-1 w-full" />
                    <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className="border border-gray-300 rounded px-2 py-1 w-full" />
                    <button className="bg-gray-500 text-white px-4 py-2 rounded " onClick={handleSubmit}>Submit</button>
                </div>
                {error && <p className="text-red-600">{error}</p>}
                {message && <p className="text-green-600">{message}</p>}
            </div>

            <h1 className=" mx-10 mt-6" >Tasks</h1>
            <div className="flex p-4 bg-gray-100 rounded-lg shadow-md m-6">
                <ul className="w-full">
                    {
                        todos.map((item) =>
                            <li className="flex items-center w-full bg-blue-100 p-4 rounded-lg shadow-md mb-4" key={item.id}>
                                <div className="flex flex-1 flex-col">

                                    {
                                        editId == -1 || editId !== item.id ? <>
                                            <span className=" text-bold p-2 mb-2">{item.title}</span>
                                            <span className=" text-light p-2">{item.description}</span>
                                        </> : <>
                                            <div className="bg-gray-200 p-4 rounded-lg shadow-md mt-4 flex flex-row gap-5 items-start">
                                                <input type="text" placeholder="Title" onChange={(e) => setEdittitle(e.target.value)} value={edittitle} className="border border-gray-300 rounded px-2 py-1 w-full" />
                                                <input type="text" placeholder="Description" onChange={(e) => setEditdescription(e.target.value)} value={editdescription} className="border border-gray-300 rounded px-2 py-1 w-full" />
                                            </div>
                                        </>
                                    }

                                </div>

                                <div className="flex gap-2 ml-auto">
                                    {editId == -1 || editId !== item.id ? <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleEdit(item)}>Edit</button> : <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleUpdate(item)}>Update</button>}
                                    {editId == -1 ? <button className="bg-red-500 text-white mx-6 px-4 py-2 rounded" onClick={() => handleDelete(item.id)}> Delete</button> : <button className="bg-red-500 text-white mx-6 px-4 py-2 rounded" onClick={handleEditCancel}> Cancel</button>}
                                </div>

                            </li>
                        )
                    }

                </ul>
            </div>



        </>
    );
}