type Priority = "Indispenssable" | "Recommander" | "Sigma"

type Task = {
  id: number;
  text: string;
  priority: Priority;
}
function App() {

  return (
    <div className="flex justify-center">
      <div className="w-12/13 flex-col gap-4 my-10 bg-base-300 p-5 rounded-2xl">
        <div className="flex gap-4">
          <input type="text" className="input w-full" placeholder="Ajouter une tâche"/>
          <select className="select w-full">
            <option value="Sigma">Sigma</option>
            <option value="Recommander">Recommander</option>
            <option value="Indispenssable">Indispenssable</option>
          </select>
        </div>
      </div>      
    </div>
  )
}

export default App
