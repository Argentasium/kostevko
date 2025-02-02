import { useState } from "react"
import { updateInstructor, deleteInstructor} from "../../requests";

import AddInstructor from "../forms/AddInstructor";
import InnerCard from "./InnerCard";

import Edit from "../../images/icon-edit.png"
import Delete from "../../images/icon-delete.png"

export default function Card({data, allData}) {
    const {instructor_id, instructor_name, max_teams, specialization_name, teams = []} = data;
    const parentData = {
        instructor_id: instructor_id,
        instructor_name: instructor_name,
    };
    const[edit, setEdit] = useState(false);

    const handleDelete = async () => {
        if (window.confirm(`Вы уверены, что хотите удалить наставника "${instructor_name}"?`)) {
            const res = await deleteInstructor(instructor_id);
            if(res){
                alert(res.message);
                window.location.reload();
            }
            
        }
    };

    return (
        <div className="card-block">
            {edit?(
                <AddInstructor setShown={setEdit} requestFunction={updateInstructor} initialData={data}/>
            ):(
                <>
                    <div className="card-block-title">
                        <h2 className="card-block-title-name">
                            {instructor_name}
                        </h2>
                        <div>
                            <img src={Edit} onClick={() => setEdit(true)} className="card-block-title-edit-button" alt="Изменить" />
                            <img src={Delete} onClick={() => handleDelete()} className="card-block-title-delete-button" alt="Удалить" />
                        </div>
                    </div>
                    <div className="card-block-subtitle">
                        {specialization_name}
                    </div>
                    <div className="card-block-subtitle">
                        Команды {teams.length}/{max_teams}
                    </div>
                    {teams.length > 0?(
                        <>
                            <div className="card-block-tasks-list">
                                {teams.map((element, index) => {
                                    return (
                                        <InnerCard key={index} data={element} parentData={parentData} allData={allData}/>
                                    )
                                })}

                            </div>
                        </>
                    ):(
                        <div className="card-block-tasks-title">Нет команд</div>
                    )}                 
                </>
            )}
        </div>
    )
}