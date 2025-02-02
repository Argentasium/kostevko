const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Создаем приложение Express
const app = express();
const port = 5000; 

app.use(cors());
app.use(express.json()); 

// Подключение к базе данных
const db = mysql.createConnection({
    host: 'localhost',       // Хост базы данных
    user: 'root',            // Имя пользователя базы данных
    password: 'root',    // Пароль пользователя базы данных
    database: 'diplomy' // Название базы данных
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключение к базе данных успешно!');
});

// Маршрут для проверки работы сервера
app.get('/', (req, res) => {
    res.send('Сервер работает!');
});

// Получение всех инструкторов с их командами и участниками
app.get('/instructors', (req, res) => {
    const sql = `
        SELECT 
            i.instructor_id,
            i.instructor_name,
            i.max_teams,
            s.specialization_name,
            s.specialization_id,
            t.team_id,
            t.team_name,
            m.member_id,
            m.member_name
        FROM instructors i
        LEFT JOIN specialization s ON i.specialization_id = s.specialization_id
        LEFT JOIN teams t ON i.instructor_id = t.instructor_id
        LEFT JOIN members m ON t.team_id = m.team_id
        ORDER BY i.instructor_id, t.team_id, m.member_name;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).json({ error: 'Ошибка при получении данных', details: err });
        }

        const instructors = {};

        results.forEach(row => {
            const { 
                instructor_id, 
                instructor_name, 
                max_teams, 
                specialization_name, 
                team_id, 
                team_name,
                specialization_id, 
                member_id, 
                member_name 
            } = row;

            if (!instructors[instructor_id]) {
                instructors[instructor_id] = {
                    instructor_id,
                    instructor_name,
                    max_teams,
                    specialization_name,
                    specialization_id,
                    teams: []
                };
            }

            const existingTeam = instructors[instructor_id].teams.find(team => team.team_id === team_id);

            if (!existingTeam && team_id) {
                instructors[instructor_id].teams.push({
                    team_id,
                    team_name,
                    specialization_id,
                    members: []
                });
            }

            if (member_id) {
                const team = instructors[instructor_id].teams.find(team => team.team_id === team_id);
                if (team) {
                    team.members.push({
                        member_id,
                        member_name
                    });
                }
            }
        });

        const response = Object.values(instructors);
        res.json(response);
    });
});

// Добавление инструктора
app.post('/instructors/add', (req, res) => {
    const { instructor_name, specialization_id, max_teams } = req.body;

    const sql = `
        INSERT INTO instructors (instructor_name, specialization_id, max_teams) 
        VALUES (?, ?, ?);
    `;

    db.query(sql, [instructor_name, specialization_id, max_teams], (err, result) => {
        if (err) {
            console.error('Ошибка при добавлении инструктора:', err);
            return res.status(500).json({ error: 'Ошибка при добавлении инструктора', details: err });
        }

        res.status(201).json({ message: 'Инструктор успешно добавлен', instructor_id: result.insertId });
    });
});


// Изменение инструктора
app.put('/instructors/edit/:instructor_id', (req, res) => {
    const { instructor_id } = req.params;
    const { instructor_name, specialization_id, max_teams } = req.body;

    const sql = `
        UPDATE instructors 
        SET instructor_name = ?, specialization_id = ?, max_teams = ? 
        WHERE instructor_id = ?;
    `;

    db.query(sql, [instructor_name, specialization_id, max_teams, instructor_id], (err, result) => {
        if (err) {
            console.error('Ошибка при изменении инструктора:', err);
            return res.status(500).json({ error: 'Ошибка при изменении инструктора', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Инструктор не найден' });
        }

        res.json({ message: 'Инструктор успешно изменен' });
    });
});

// Удаление инструктора
app.delete('/instructors/delete/:instructor_id', (req, res) => {
    const { instructor_id } = req.params;

    const sql = `
        DELETE FROM instructors 
        WHERE instructor_id = ?;
    `;

    db.query(sql, [instructor_id], (err, result) => {
        if (err) {
            console.error('Ошибка при удалении инструктора:', err);
            return res.status(500).json({ error: 'Ошибка при удалении инструктора', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Инструктор не найден' });
        }

        res.json({ message: 'Инструктор успешно удален' });
    });
});

// Получение всех специализаций
app.get('/specializations', (req, res) => {
    const sql = `
        SELECT * 
        FROM specialization;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Ошибка при получении специализаций:', err);
            return res.status(500).json({ error: 'Ошибка при получении специализаций', details: err });
        }

        res.json(results);
    });
});

// Добавление команды и участников
app.post('/teams/add', (req, res) => {
    const { team_name, specialization_id, instructor_id, members } = req.body;

    if (!team_name || !specialization_id || !instructor_id || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({ error: 'Необходимо указать название команды, ID специализации, ID инструктора и список участников' });
    }

    const insertTeamSql = `
        INSERT INTO teams (team_name, specialization_id, instructor_id)
        VALUES (?, ?, ?);
    `;

    db.query(insertTeamSql, [team_name, specialization_id, instructor_id], (err, teamResult) => {
        if (err) {
            console.error('Ошибка при добавлении команды:', err);
            return res.status(500).json({ error: 'Ошибка при добавлении команды', details: err });
        }

        const team_id = teamResult.insertId;

        const memberValues = members.map(member_name => [member_name, team_id]);
        const insertMembersSql = `
            INSERT INTO members (member_name, team_id)
            VALUES ?;
        `;

        db.query(insertMembersSql, [memberValues], (err, memberResult) => {
            if (err) {
                console.error('Ошибка при добавлении участников команды:', err);
                return res.status(500).json({ error: 'Ошибка при добавлении участников команды', details: err });
            }

            res.status(201).json({ 
                message: 'Команда и участники успешно добавлены', 
                team_id: team_id, 
                added_members: members.length 
            });
        });
    });
});

// Удаление команды и всех её участников
app.delete('/teams/delete/:team_id', (req, res) => {
    const { team_id } = req.params;

    if (!team_id) {
        return res.status(400).json({ error: 'Необходимо указать ID команды' });
    }

    const deleteTeamSql = `
        DELETE FROM teams WHERE team_id = ?;
    `;

    db.query(deleteTeamSql, [team_id], (err, result) => {
        if (err) {
            console.error('Ошибка при удалении команды:', err);
            return res.status(500).json({ error: 'Ошибка при удалении команды', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Команда не найдена' });
        }

        res.status(200).json({ message: 'Команда и её участники успешно удалены' });
    });
});

// Перемещение команды к другому инструктору
app.put('/teams/move/:team_id', (req, res) => {
    const { team_id } = req.params;
    const { new_instructor_id } = req.body;

    const updateSql = `
        UPDATE teams
        SET instructor_id = ?
        WHERE team_id = ?;
    `;

    db.query(updateSql, [new_instructor_id, team_id], (err, result) => {
        if (err) {
            console.error('Ошибка при перемещении команды:', err);
            return res.status(500).json({ error: 'Ошибка при перемещении команды', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Команда не найдена' });
        }

        res.json({ message: 'Команда успешно перемещена другому инструктору' });
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});