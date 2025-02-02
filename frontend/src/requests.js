// ---------- Адрес сервера ----------

const URL = "http://localhost:5000";

// ---------- Запрос на получение всех менеджеров и клиентов ----------

export const fetchAllData = async (setData) => {
    try {
      const response = await fetch(`${URL}/instructors`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }

      const data = await response.json();
      
      setData(data);
    } catch (error) {
      console.error('Ошибка при первичной загрузке данных:', error.message);
      alert('Ошибка при первичной загрузке данных: ' + error.message);
    }
  };

// ---------- Запрос на добавление инструктора ----------

export const addInstructor = async (data) => {
  try {

    const response = await fetch(`${URL}/instructors/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при добавлении инструктора');
    }

    alert('Инструктор успешно добавлен!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при добавлении инструктора: ' + error.message);
  }
};

// ---------- Запрос на изменение инструктора ----------

export const updateInstructor = async (data, id) => {
  try {

    const response = await fetch(`${URL}/instructors/edit/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при обновлении данных');
    }

    alert('Данные успешно обновлены!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при обновлении данных: ' + error.message);
  }
};

// ---------- Запрос на удаление инструктора ----------

export const deleteInstructor = async (id) => {
    try {
        const response = await fetch(`${URL}/instructors/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка при удалении инструктора');
        }

        const result = await response.json();
        return result; 
    } catch (error) {
        console.error('Ошибка:', error.message);
        alert('Ошибка при удалении инструктора: ' + error.message);
    }
};

// ---------- Запрос на получение всех специализаций ----------

export const getSpecializations= async (setData) => {
  try {
      const response = await fetch(`${URL}/specializations`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Ошибка при получении специализаций');
      }

      const data = await response.json();
      setData(data)
  } catch (error) {
      console.error('Ошибка при загрузке специализаций:', error.message);
      alert('Ошибка при загрузке специализаций: ' + error.message);
  }
};

// ---------- Запрос на добавление команды и участников ----------

export const addTeam = async (data) => {
  try {

    const response = await fetch(`${URL}/teams/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при добавлении команды');
    }

    alert('Команда успешно добавлена!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при добавлении команды: ' + error.message);
  }
};

// ---------- Запрос на удаление команды ----------

export const deleteTeam = async (id) => {
  try {
      const response = await fetch(`${URL}/teams/delete/${id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Ошибка при удалении команды');
      }

      const result = await response.json();
      return result; 
  } catch (error) {
      console.error('Ошибка:', error.message);
      alert('Ошибка при удалении команды: ' + error.message);
  }
};

// ---------- Запрос на перенаправление команды другому инструктору ----------

export const moveTeam = async (id, data) => {
  try {

    const response = await fetch(`${URL}/teams/move/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при перенаправлении команды');
    }

    alert('Команда успешно перенаправлена!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошшибка при перенаправлении команды: ' + error.message);
  }
};