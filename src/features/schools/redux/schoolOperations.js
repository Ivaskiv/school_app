import { getDatabase, ref, get } from 'firebase/database'; // Імпортуємо функції для Realtime Database

export async function fetchSchools() {
  try {
    // Отримуємо посилання на Realtime Database
    const db = getDatabase();

    // Отримуємо посилання на колекцію "schools"
    const schoolsRef = ref(db, 'schools'); // Вказуємо шлях до колекції schools

    // Отримуємо дані з цієї колекції
    const snapshot = await get(schoolsRef);

    if (!snapshot.exists()) {
      console.error('No schools found');
      return {};
    }
    // Обробляємо отримані дані
    const schools = snapshot.val();
    console.log('Fetched schools:', schools);

    // snapshot.forEach(childSnapshot => {
    //   const schoolData = childSnapshot.val();

    //   // Перевірка на наявність необхідних даних
    //   if (!schoolData.name || !schoolData.address) {
    //     throw new Error(
    //       `Invalid school data: Missing name or address for school ID ${childSnapshot.key}`
    //     );
    //   }

    //   schools.push({
    //     id: childSnapshot.key,
    //     ...schoolData,
    //   });
    // });

    // console.log('Schools:', schools);
    // return snapshot.val() || {};
    return schools;
  } catch (error) {
    console.error('Error fetching schools:', error.message);
    throw error;
  }
}
