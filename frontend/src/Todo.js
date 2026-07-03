export default function Todo() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const apiUrl = 'http://localhost:3000';

    const HandleSubmit = () => {
        //checks input
        if(title.trim() === '' || description.trim() === '') {

            fetch(apiUrl + '/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) =>{
                if(res.ok) {
                     settodos([...todos, { title, description }]);
            }else{
                // Handle error response
                setError('Failed to add todo');
            }
        })   
        }
    }

  return (
    <>
    <div className="bg-green-200 p-4 rounded-lg shadow-md">
      <h1 className="mx-125">Todo Project with MERN stack</h1>
    </div>
    <div className="bg-blue-200  rounded-lg shadow-md mt-4">
        <h5>Add Item</h5>
        <p>Item Added successfully!</p>
        <div className="bg-gray-200 p-4 rounded-lg shadow-md mt-4 flex flex-row gap-5 items-start">
         <input type="text" placeholder="Title" onChange={(e)=> setTitle(e.target.value)} value={title} className="border border-gray-300 rounded px-2 py-1 w-full" />
           <input type="text" placeholder="Description" onChange={(e)=> setDescription(e.target.value)} value={description} className="border border-gray-300 rounded px-2 py-1 w-full" />
            <button className="bg-gray-500 text-white px-4 py-2 rounded " onClick={HandleSubmit}>Submit</button>
         </div>
         {error &&<p>{error}</p>}
     </div>

        
    </>
  );
}