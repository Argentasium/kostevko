import { useState } from "react"
import { deleteTeam, moveTeam} from "../../requests";

import Change from "../../images/icon-change.png"
import Delete from "../../images/icon-delete.png"

export default function InnerCard({data, allData, parentData}) {
    const { team_id, team_name, specialization_id, members=[] } = data;
    const { instructor_id } = parentData;

    const [shown, setShown] = useState(false);
    const [newData, setNewData] = useState({
        new_instructor_id: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if(name === 'new_instructor_id'){
            const curr = allData.filter((element) => {return element.instructor_id === parseInt(value)})[0];
            if(curr?.teams?.length >= curr?.max_teams){
                alert("У этого наставника нет мест для новых команд.");
                return;
            }
        }

        setNewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await moveTeam(team_id, newData);
        if (res === 200) {
            setShown(false);
            window.location.reload();
        }
    };

    const handleChancel = (e) => {
        e.preventDefault();
        setShown(false);
    }

    const handleDelete = async () => {
        if (window.confirm(`Вы уверены, что хотите удалить команду "${team_name}"?`)) {
            const res = await deleteTeam(team_id);
            if(res){
                alert(res.message);
                window.location.reload();
            }
            
        }
    }

    return (
        <div className="inner-card-block">
            <div className="inner-card-block-title">
                <span className="inner-card-block-name">
                    {team_name}
                </span>
                <div className="inner-card-block-buttons">
                    {!shown && (<img src={Change} alt="Перенаправить" onClick={() => setShown(true)}/>)}
                    <img className="inner-card-block-buttons-delete" src={Delete} alt="Удалить" onClick={handleDelete}/>
                </div>
            </div>
            {shown?(
                <>
                    <form onSubmit={handleSubmit} className="form-block inner">
                        <div className="form-input-block">
                            <label htmlFor="new_instructor_id">Новый наставник:</label>
                            <select
                                name="new_instructor_id"
                                value={newData.new_instructor_id}
                                onChange={(e) => handleChange(e)}
                                required
                            >
                                <option value="" disabled>
                                    --Выберите наставника--
                                </option>
                                {allData.filter((element) => {return element.specialization_id === specialization_id && element.instructor_id !== instructor_id}).map((element) => (
                                    <option key={element.instructor_id} value={element.instructor_id}>
                                        {element.instructor_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="buttons-block">
                            <button className="grey-button" type="chancel" onClick={(e) => handleChancel(e)}>Отменить</button>
                            <button className="filed-button" type="submit">Сохранить</button>
                        </div>
                    </form>
                </>
            ):("")}
            <div className="inner-card-block-subitems">
                {members.map((element, index) => (
                    <div key={index} className="inner-card-block-subitems-item">
                        <span>{element.member_name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}