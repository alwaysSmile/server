//************
// //Node.js как web-сервер
// var http = require('http');//Полключаем модуль http
// //http.Server() - умеет слушать ip - порт
// //и отвечать на входящие запросы
// var server = new http.Server();//.Server() - это объект модуля http
// //Иерархия наследования .Server
// // http.Server -> net.Server -> EventEmitter
// //Для того, чтобы дать ему ip - порт используется команда .listen
// server.listen(1337, '127.0.0.1');
// //Для того, чтобы отвечать на запросы используется событие,
// //server является EventEmitter - ом
// //При входящих запросах инициирутся событие, которое называется 'request' и
// //его обработчик получает два объекта function (reg, res) {res.end("Привет, мир!")}
// //reg - входящий запрос - он содержит инфу, которую содержит браузер, включая url пришедшего запроса
// //res - объект ответа - из первого - reg мы читаем, во второй res - пишем
//
// var counter = 0;//счётчик запросов
//
// //Все события генерируются вызовом
// var emit = server.emit;//переопределяем этот метод на наш собственный
// //Метод server.emit принимает название события и необходимые данные для него,
// //в данном случае это будет reg, res
// server.emit = function (event /* , arg1, arg2,... */) {
//    console.log(event);//Выводим название события => listening
//    emit.apply(server, arguments);//Передаём вызов исходному методу emit
// }
//
// server.on('request', function (reg, res) {
//     res.end("Привет, мир! " + ++counter);//Заканчиваем выполнение запроса отсылая фразу привет мир
// });
//
// //Событие connection возникает тогда, когда браузер открывет
// //к серверу новое сетевое соединение
// //Событие request присылает запрос
// //Браузер устроен так, что одно сетевое соединение
// //он старается использовать по максимуму, называется это Keep-Alive,
// //он его сохраняет и по нему гонит новые запросы
//************
//************
// //Эхо-сервер на Node.js - это протоип реального приложения
// //Реальное приложение получает запросы различного вида и выдают на них ответы
// //Эхо-сервер - сервер, который при запросе на url http://127.0.0.1:1337/echo?message=Hello -> Hello
// //с параметром message выдаёт значение этого параметра Hello,
// //а на все другие зпросы отвечает страница не найдена
// var http = require('http');
// //Создаём сервер и ему даётся функция-обработчик на request
// var url = require('url');
//
// var server = new http.Server(function (req, res) {
//     console.log(req.method, req.url);//req.method -> GET, req.url -> /echo?message=Hello
//     //Браузер ничего не вывел, он ожидает ответа,
//     //потому что сервер, если не дать явной команды в ответ делать ничего не будет
//     //это явное отличие Node.js - он будет делать то, что ему скажешь
//     var urlParsed = url.parse(req.url, this);//url.parse разбирает переданную строку запроса
//     console.log(urlParsed);
//     //Показывает объект url, в котором находится query: 'message=Hello' pathname: '/echo',
//
//     if (urlParsed.pathname == '/echo' && urlParsed.query.message) {//Т.к query, в объекте Url строка, то в url.parse добавляем this,
// //которая разберёт строку query: 'message=Hello',
// // отсюда urlParsed.query.message будет его значение
//         res.end( urlParsed.query.message )
//     }
//     else{
//         res.statusCode = 404;
//         res.end('Page no found')
//     }
// });
//
// server.listen(1337, '127.0.0.1')
//************
//************
//Работа с заголовками
//http://127.0.0.1:1337/echo?message=Hello -> Hello
var http = require('http');
var url = require('url');

var server = new http.Server(function (req, res) {
    //Когда браузер делает запрос, он вместе с url отправляет дополнительную информацию:
    //что это за браузер и информацию которую он хочет запросить
    console.log(req.headers);

    //В ответ на запрос сервер отвечает телом страницы и то же заголовками,
    //в которых находится статус - statusCode,
    //как правило statusCode = 200 - это значит, что страница сгенерированна нормально
    var urlParsed = url.parse(req.url, this);

    if (urlParsed.pathname == '/echo' && urlParsed.query.message) {
        //******* 1 способ
        //setHeader - добавляет заголовок
        //removeHeader - удаляет заголовок
        res.setHeader('Cache-control', 'no-cache');//Результаты ответа сервера не будут кэшироваться
        //При этом заголовки будут отправляться на сервер ни когда мы написали,
        //а вместе с какой-то записью каких-то данных, например вызов res.end( urlParsed.query.message )
        //отправляет res.end и заголовки тоже
        res.end( urlParsed.query.message )
        //******* 1 способ

        // //******* 2 способ Управления заголовками называется явный
        // res.writeHeader(200, "OK", {'Cache-control': 'no-cache'});//Он отличается от .setHeader тем,
        // // что заголовки пишутся тут же, не ожидая начала ближайшей записи
        // res.end( urlParsed.query.message )
        // //******* 2 способ
    }
    else{
        res.statusCode = 404;//Это статус - страница не найдена
        res.end('Page no found')
    }
});

server.listen(1337, '127.0.0.1');
//************
//**kjkj
