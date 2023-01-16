let access_token;
let refresh_token;

function checkAndRefreshToken() {
    access_token = localStorage.getItem('access_token');
    refresh_token = localStorage.getItem('refresh_token');
    // Check if the access token is expired
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }
    })
        .then(response => {
            if (response.status === 401) {
                // Access token is expired, send refresh token to backend
                fetch(`http://localhost:8888/refresh_token?refresh_token=${refresh_token}`)
                    .then(response => response.json())
                    .then(data => {
                        access_token = data.access_token;
                        refresh_token = data.refresh_token;
                        localStorage.setItem('access_token', access_token);
                        localStorage.setItem('refresh_token', refresh_token)
                        location.reload();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        })
        .catch(error => {
            console.log(error);
        });
}


const queryString = window.location.search; // gets url
const urlParams = new URLSearchParams(queryString); // gets params from url
const authCode = urlParams.get("code") || null;
if (authCode) {
    fetch(`http://localhost:8888/callback?code=${authCode}`) //sends req to spotify through backend 
        .then(response => response.json())
        .then(data => {
            access_token = data.access_token;
            refresh_token = data.refresh_token;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            window.history.replaceState({}, document.title, "/"); //removes code from url w/o refreshing
            location.reload(); //refreshs the page


            fetch('https://api.spotify.com/v1/me', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}` } })
                .then(response => response.json())
                .then(data => {
                    const display_name = data.display_name;
                    const profile_pic = data.images[0].url;
                    document.getElementById('signin_img').innerHTML = `<img id="profile_pic" src=${profile_pic} alt="">`;
                    document.getElementById("signin_text").textContent = display_name;
                })
                .catch(error => { console.log(error) })
            // Use access_token here
        })
        .catch(error => {
            console.log(error);
        }) //catches any errors in the request process (invalid code, etc) and logs
}


// Check if access token is stored in session storage
if (localStorage.getItem('access_token')) {
    console.log("Signed In!")
    checkAndRefreshToken();

    access_token = localStorage.getItem('access_token');
    // Use access token to authenticate requests to protected resources
    fetch('https://api.spotify.com/v1/me', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}` } })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            const display_name = data.display_name;
            const profile_pic = data.images[0].url;
            document.getElementById('signin_img').innerHTML = `<img id="profile_pic" src=${profile_pic} alt="">`;
            document.getElementById("signin_text").textContent = display_name;




        })
        .catch(error => {
            console.log(error)
        })
    const signin = document.getElementById("signin");
    signin.addEventListener("click", function () {
        setTimeout(() => {
            // window.location.href = "http://localhost:8888/login1";
            // redirect to new page or your profile since you are already signed in
        }, 550);
    });

} else {
    console.log("Not Signed In!")
    const signin = document.getElementById("signin");
    signin.addEventListener("click", function () {
        setTimeout(() => {
            window.location.href = "http://localhost:8888/login1";
        }, 550);
    });
}


const list = document.querySelectorAll('.list');
let activeTab;
function activelink() {
    list.forEach((item) =>
        item.classList.remove('active'));
    this.classList.add('active');
    activeTab = this.textContent;
    console.log(activeTab);
    localStorage.setItem('current_tab', activeTab);

}
list.forEach((item) =>
    item.addEventListener('click', activelink));