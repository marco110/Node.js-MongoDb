let url = 'http://192.168.218.133:3000';
let socket = new WebSocket('ws://192.168.218.133:3000/message');
socket.addEventListener('open', (event) => {
    console.log('socket is open!!!');
})

socket.addEventListener('message', (event) => {
    console.log(event.data + '===> from server.')
});

window.onload = () => {
    let headers = new Headers();
    headers.append('Authorization', window.localStorage.getItem('token'));
    fetch(`${url}/userInfo`, {
        headers: headers
    }).then((res) => {
        res.json().then((res) => {
            socket.send(res.data.userName + ' is online!');
            document.getElementById('welcome').innerHTML = `Welcome -${res.data.userName}-`;
        });
    })
}