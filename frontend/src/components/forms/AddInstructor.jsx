import React, { useState, useEffect } from 'react';
import { getSpecializations } from '../../requests';

export default function AddInstructor({ setShown, requestFunction, initialData={}}) {
    const {instructor_id, instructor_name, max_teams, specialization_id, teams} = initialData;

    const [newData, setNewData] = useState({
        instructor_name: instructor_name || '',
        max_teams: max_teams || '',
        specialization_id: specialization_id || '',
    });

    const [specializationsList, setSpecializationsList] = useState([]);

    useEffect(() => {
        getSpecializations(setSpecializationsList);
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;

        if(name === "specialization_id" && teams?.length > 0){
            alert("Нельзя сменить специализацию, так как у этого наставника уже есть команды по текущей специализации.");
            return;
        }

        setNewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await requestFunction(newData, instructor_id);
        if (res === 200) {
            setShown(false);
            window.location.reload();
        }
    };

    return (
        <div className="form-block">
            <h2>{instructor_id ? "Редактирование наставника" : "Добавление наставника"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-input-block">
                    <label htmlFor="instructor_name">ФИО:</label>
                    <input
                        name="instructor_name"
                        type="text"
                        placeholder="Иванов И.И."
                        value={newData.instructor_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-input-block">
                    <label htmlFor="max_teams">Максимальное количество команд:</label>
                    <input
                        name="max_teams"
                        type="number"
                        min="2"
                        max="5"
                        value={newData.max_teams}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-select-block">
                    <label htmlFor="specialization_id">Специализация:</label>
                    <select 
                        name="specialization_id"
                        value={newData.specialization_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="" default>--Выберите из списка--</option>
                        {specializationsList.map((profile, index) => (
                            <option key={index} value={profile.specialization_id}>{profile.specialization_name}</option>
                        ))}
                    </select>
                </div>

                <div className="buttons-block">
                    <button className="grey-button" type="button" onClick={() => setShown(false)}>Отменить</button>
                    <button className="filed-button" type="submit">{instructor_id ? "Сохранить" : "Добавить"}</button>
                </div>
            </form>
        </div>
    );
}