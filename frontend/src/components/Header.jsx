export default function Header({visibleState}) {
    const {shown, setShown, shown2, setShown2} = visibleState;
    return (
        <header className="header-block">
            <div className="header-block-left-part">
                <h1>Конкурс студенческих работ</h1>
            </div>
            <div className="header-block-middle-part">
                {!shown && (<button className="unfiled-button" onClick={() => {setShown(true); window.scrollTo(0,0);}}>Добавить наставника</button>)}
                {!shown2 && (<button className="filed-button" onClick={() => {setShown2(true); window.scrollTo(0,0);}}>Добавить команду</button>)}
            </div>
            <div className="header-block-right-part">
                <img
                    src="/images/avatar.png"
                    className="header-block-right-part-avatar"
                    alt="header-block-right-part-avatar"
                />
                <span className="header-block-right-part-name">
                    Организатор
                </span>
            </div>
        </header>
    );
}
