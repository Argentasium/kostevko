import { useEffect, useState } from "react"
import { fetchAllData, addInstructor, addTeam } from "../requests";

import Card from "./ui/Card";
import AddInstructor from "./forms/AddInstructor";
import AddTeam from "./forms/AddTeam";

export default function Main({visibleState}) {
    const {shown, setShown, shown2, setShown2} = visibleState;
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchAllData(setData);
    }, [])

    return (
        <main className="main-block">
            {(shown || shown2) && (
                <div className="main-block-form">
                    {shown && (<AddInstructor setShown={setShown} requestFunction={addInstructor}/>)}
                    {shown2 && (<AddTeam setShown={setShown2} requestFunction={addTeam} allData={data}/>)}
                </div>
            )}

            <div className="main-block-list">
                {data.map((element, index) => {
                    return (
                        <Card key={index} data={element} allData={data}/>
                    )
                })}
            </div>
        </main>
    )
}