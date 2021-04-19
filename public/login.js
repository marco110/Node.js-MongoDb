// let testEle = document.getElementById('password');
//console.log(JSON.stringify(testEle.dataset.info));

const url = 'http://192.168.218.133:3000';
const socket = new WebSocket('ws://192.168.218.133:3000/message');
socket.addEventListener('open', (event) => {
    console.log('socket is open!!!');
})

socket.addEventListener('message', (event) => {
    console.log(event.data + '===> from server.')
});

const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
headers.append('Access-Control-Allow-Origin', '*');

const authWithGithubEle = document.getElementById('signInWithGithub');
authWithGithubEle.addEventListener('click', (event) => {
    fetch(`${url}/auth/github`, { method: 'Get', mode: 'no-cors', headers: headers, })
        .then((data) => {
            console.log(data);
        })
        .catch(err =>{
            console.log(err);
        })
})

const formEle = document.getElementById('form');
formEle && formEle.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = document.getElementById('form');
    const formData = new FormData(form);
    const userName = formData.get('userName');
    const password = formData.get('password');

    if (!userName || !password) {
        document.getElementById('errorMessage').innerText = 'User name or password can\'t be null!';
        setTimeout(() => {
            document.getElementById('errorMessage').innerText = null
        }, 3000)
        return;
    }

    fetch(`${url}/login`, {
        body: JSON.stringify({
            userName,
            password
        }),
        headers: headers,
        method: 'Post',
        // mode: 'no-cors'
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if (data.token) {
                window.localStorage.setItem("token", `Bearer ${data.token}`);
                window.location.href = "/home.html";
            } else {
                document.getElementById('errorMessage').innerText = data.message;
                setTimeout(() => {
                    document.getElementById('errorMessage').innerText = null
                }, 3000)
                console.log(data.message);
            }
        })
        .catch((err) => {
            console.log(err.message);
        });
    // console.log("data");
})