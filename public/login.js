let formEle = document.getElementById('form');
let testEle = document.getElementById('password');
console.log(JSON.stringify(testEle.dataset.info));
let url = 'http://localhost:3000';
let socket = new WebSocket('ws://localhost:3000/message');
socket.addEventListener('open', (event) => {
    console.log('socket is open!!!');
})

socket.addEventListener('message', (event) => {
    console.log(event.data + '===> from server.')
});

if (formEle) {
    formEle.addEventListener("submit", (event) => {
        event.preventDefault();
        let form = document.getElementById('form');
        let formData = new FormData(form);
        let id = formData.get('id');
        let password = formData.get('password');

        if (!id || !password) {
            document.getElementById('message').innerText = 'Id or password can\'t be null!';
            setTimeout(() => {
                document.getElementById('message').innerText = null
            }, 2000)
            return;
        }

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        fetch(`${url}/login`, {
                body: JSON.stringify({
                    id,
                    password
                }),
                headers: headers,
                method: 'POST',
                //mode: 'no-cors'
            })
            .then((res) => {
                res.json().then((data) => {
                        if (data.token) {
                            window.localStorage.setItem("token", `Bearer ${data.token}`);
                            window.location.href = "/home.html";
                        } else {
                            document.getElementById('message').innerText = data.message;
                            setTimeout(() => {
                                document.getElementById('message').innerText = null
                            }, 2000)
                            console.log(data.message);
                        }
                    })
                    .catch((err) => {
                        console.log(JSON.stringify(err));
                    });
            })
            .catch((err) => {
                console.log(JSON.stringify(err));
            });
        // console.log("data");
    })
}