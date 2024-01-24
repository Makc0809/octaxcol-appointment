const axios = require('axios');

// URL для первого GET запроса
const getDatesUrl = 'https://wb-octaxcol.qmatic.cloud/qmaticwebbooking/rest/schedule/branches/fcf7548c8e6d33f3de0b25e36d2e49361969e7f770bbcd962a860e6ed1e33120/dates;servicePublicId=46c063bf2e2763245a0bd2f9822d31a10fc2b1d3973e2eb54812e10329b0be04;customSlotLength=15';

// URL для получения списка всех услуг и отделений
// const branchesWithServicesUrl = 'https://wb-octaxcol.qmatic.cloud/qmaticwebbooking/rest/schedule/appointmentProfiles/'

// const servicesList = [
//     {id: 'b14e172f81ad017b4e168ffd6ae202efe913fe943851e7f43dca7e58846d59f5', name: 'Written test (тестовый экзамен)'},
//     {id: '46c063bf2e2763245a0bd2f9822d31a10fc2b1d3973e2eb54812e10329b0be04', name: 'Road test (вождение)'},
// ];


// Интервал между запросами (в миллисекундах)
const interval = 7000; // 5 секунд

// Нужная дата
const targetDate = '2024-01-23';

//Отправлено ли оповещение
// let notified = false;

// Текущее задание
let intervalId;

// Функция для выполнения GET запроса
async function makeGetRequest(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error making GET request:', error.message);
        return null;
    }
}

// Функция для выполнения POST запроса с JSON данными
async function makePostRequest(url, jsonData) {
    try {
        const response = await axios.post(url, jsonData);
        return response.data;
    } catch (error) {
        console.error('Error making POST request:', error.message);
        return null;
    }
}

// Функция для проверки и обработки полученных данных
async function checkAndNotify() {
    const data = await makeGetRequest(getDatesUrl);

    if (data) {
        // Проверяем каждый элемент в полученных данных
        for (const item of data) {
            console.log('Список дат', data);
            console.log('Нужная дата', item?.date === targetDate)
            if (item?.date === targetDate) {
                // Если найдена нужная дата, делаем второй GET запрос
                // Замените 'YOUR_NOTIFICATION_API_URL' на свой URL для уведомлений
                const jsonData = {
                    chatIds: [167648956],
                    message: `Найдена нужная дата на ${targetDate}, \n https://wb-octaxcol.qmatic.cloud/qmaticwebbooking/#/`,
                    jsonData: JSON.stringify(data),
                }
                await makePostRequest('https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-51969ad8-55e7-4f49-89be-e3dcc3851281/default/sendTgMessage', jsonData);
                console.log('Найдена нужная дата! Отправлен запрос для уведомления.');

                // Останавливаем задание
                clearInterval(intervalId);
            }
        }
    }
}

// Запускаем проверку с интервалом
intervalId = setInterval(checkAndNotify, interval);

