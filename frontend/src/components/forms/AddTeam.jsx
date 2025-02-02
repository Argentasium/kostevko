import { useState, useEffect } from "react";
import { getSpecializations } from "../../requests";

import Delete from "../../images/icon-delete.png"

export default function AddTeam({ setShown, requestFunction, allData=[]}) {
    const [newData, setNewData] = useState({
        instructor_id: '',
        team_name: '',
        specialization_id: '',
        members: [''],
    });

    const [specializationsList, setSpecializationsList] = useState([]);

    useEffect(() => {
        getSpecializations(setSpecializationsList);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'instructor_id') {
            const curr = allData.filter((element) => element.instructor_id === parseInt(value))[0];
            if (curr?.teams?.length >= curr?.max_teams) {
                alert("У этого наставника нет мест для новых команд.");
                return;
            }
        }

        setNewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleMemberChange = (index, value) => {
        const updatedMembers = [...newData.members];
        updatedMembers[index] = value;

        setNewData((prevData) => ({
            ...prevData,
            members: updatedMembers,
        }));
    };

    const addMemberField = () => {
        setNewData((prevData) => ({
            ...prevData,
            members: [...prevData.members, ''],
        }));
    };

    const removeMemberField = (index) => {
        const updatedMembers = newData.members.filter((_, idx) => idx !== index);
        setNewData((prevData) => ({
            ...prevData,
            members: updatedMembers,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await requestFunction(newData);
        if (res === 200) {
            setShown(false);
            window.location.reload();
        }
    };

    console.log(allData)
        // .filter((instructor) => instructor.specialization_id === parseInt(newData.specialization_id)));

    return (
        <div className="form-block">
            <h2>Добавление команды</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-input-block">
                    <label htmlFor="team_name">Тема команды:</label>
                    <input
                        name="team_name"
                        type="text"
                        placeholder="Изучение чего-то..."
                        value={newData.team_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-select-block">
                    <label htmlFor="specialization_id">Необходимая специализация:</label>
                    <select
                        name="specialization_id"
                        type="text"
                        value={newData.specialization_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>--Выберите из списка--</option>
                        {specializationsList.map((profile) => (
                            <option key={profile.specialization_id} value={profile.specialization_id}>
                                {profile.specialization_name}
                            </option>
                        ))}
                    </select>
                </div>
                {newData.specialization_id && (
                    <div className="form-select-block">
                        <label htmlFor="instructor_id">Доступные наставники:</label>
                        <select
                            name="instructor_id"
                            type="text"
                            value={newData.instructor_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>--Выберите из списка--</option>
                            {allData
                                .filter((instructor) => instructor.specialization_id === parseInt(newData.specialization_id))
                                .map((instructor) => (
                                    <option key={instructor.instructor_id} value={instructor.instructor_id}>
                                        {instructor.instructor_name}
                                    </option>
                                ))}
                        </select>
                    </div>
                )}
                <div className="form-members-block">
                    <h3>Члены команды</h3>
                    {newData.members.map((member, index) => (
                        <div key={index} className="form-input-member">
                            <label htmlFor="member">{index+1}</label>
                            <input
                                name="member"
                                type="text"
                                placeholder="Фамилия И.О."
                                value={member}
                                onChange={(e) => handleMemberChange(index, e.target.value)}
                                required
                            />
                            {index > 0 && (
                                <img className="card-block-title-delete-button" src={Delete} alt="Удалить" onClick={() => removeMemberField(index)}/>
                            )}
                        </div>
                    ))}

                    <div className="buttons-block">
                        <button className="unfiled-button" type="button" onClick={addMemberField}>Добавить участника</button>
                    </div>
                </div>
                <div className="buttons-block">
                    <button className="grey-button" type="button" onClick={() => setShown(false)}>Отменить</button>
                    <button className="filed-button" type="submit">Добавить</button>
                </div>
            </form>
        </div>
    );
}