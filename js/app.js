let access_token1;
let refresh_token1;
const top_tracks_title = document.getElementById("top_tracks");
const top_artists_title = document.getElementById("top_artists");

function checkAndRefreshToken() {
    access_token1 = localStorage.getItem('access_token1');
    refresh_token = localStorage.getItem('refresh_token1');
    // Check if the access token is expired
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token1}`
        }
    })
        .then(response => {
            if (response.status === 401) {
                // Access token is expired, zsend refresh token to backend
                fetch(`http://localhost:8888/refresh_token?refresh_token=${refresh_token1}`)
                    .then(response => response.json())
                    .then(data => {
                        access_token1 = data.access_token;
                        refresh_token = data.refresh_token;
                        localStorage.setItem('access_token1', access_token1);
                        // localStorage.setItem('refresh_token', refresh_token);
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

function getTopTracks() {
    access_token1 = localStorage.getItem('access_token1');
    fetch('https://api.spotify.com/v1/me/top/tracks', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token1}` } })
        .then(response => response.json())
        .then(data => { 
            top_tracks_title.style = "display: block;"

            // Create an empty array to store the list items
            var listItems = [];

            // Iterate through the data and create a list item for each track
            data.items.forEach(function (track, index) {
                var listItem = document.createElement("li");
                var indexEl = document.createElement("div");
                var indexTxt = document.createTextNode(index + 1);
                var song = document.createTextNode(track.name);
                var artist = document.createTextNode(track.artists[0].name);
                var img = document.createElement('img');
                img.src = track.album.images[0].url;
                var songTitle = document.createElement("h3");
                var artistName = document.createElement("h4");
                songTitle.appendChild(song);
                artistName.appendChild(artist);
                indexEl.appendChild(indexTxt);
                listItem.appendChild(img);
                listItem.appendChild(indexEl);
                listItem.appendChild(songTitle);
                listItem.appendChild(artistName);
                listItems.push(listItem);
            });

            // Get the list element from the HTML
            var list = document.getElementById("topTracksList");
            document.getElementById('top_tracks').innerHTML = "Top Tracks";
            // Append the list items to the list element
            listItems.forEach(function (item) {
                list.appendChild(item);
            });
        })
        .catch(error => {
            console.log(error);
        });
}

function getTopArtists() {
    access_token1 = localStorage.getItem('access_token1');
    fetch('https://api.spotify.com/v1/me/top/artists', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token1}` } })
        .then(response => response.json())
        .then(data => {
            top_artists_title.style = "display: block;"
            // Create an empty array to store the list items
            var listItems = [];

            // Iterate through the data and create a list item for each track
            data.items.forEach(function (artist, index) {
                var listItem = document.createElement("li");
                var indexEl = document.createElement("div");
                var indexTxt = document.createTextNode(index + 1);
                var artist_name = document.createTextNode(artist.name);
                var img = document.createElement('img');
                img.src = artist.images[0].url;
                var artistName = document.createElement("h4");
                artistName.appendChild(artist_name);
                indexEl.appendChild(indexTxt);
                listItem.appendChild(img);
                listItem.appendChild(indexEl);
                listItem.appendChild(artistName);
                listItems.push(listItem);
            });

            // Get the list element from the HTML
            var list = document.getElementById("topArtistsList");
            // document.getElementById('top_tracks').innerHTML = "Top Tracks";
            // Append the list items to the list element
            listItems.forEach(function (item) {
                list.appendChild(item);
            });
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
            access_token1 = data.access_token;
            refresh_token1 = data.refresh_token;
            localStorage.setItem('access_token1', access_token1);
            localStorage.setItem('refresh_token1', refresh_token1);
            window.history.replaceState({}, document.title, "/"); //removes code from url w/o refreshing
            location.reload(); //refreshs the page


            fetch('https://api.spotify.com/v1/me', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token1}` } })
                .then(response => response.json())
                .then(data => {
                    const display_name = data.display_name;
                    const profile_pic = data.images[0].url;
                    document.getElementById('signin_img').innerHTML = `<img id="profile_pic" src=${profile_pic} alt="">`;
                    document.getElementById("signin_text").textContent = display_name;
                    document.getElementById('imagesign').innerHTML = `<img id="profile_pic" src=${profile_pic} alt="">`;
                })
                .catch(error => { console.log(error) })
            // Use access_token here
        })
        .catch(error => {
            console.log(error);
        }) //catches any errors in the request process (invalid code, etc) and logs
}





// Check if access token is stored in session storage
if (localStorage.getItem('access_token1')) {
    checkAndRefreshToken();
    getTopTracks();
    getTopArtists()

    access_token1 = localStorage.getItem('access_token1');
    // Use access token to authenticate requests to protected resources
    fetch('https://api.spotify.com/v1/me', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token1}` } })
        .then(response => response.json())
        .then(data => {
            const display_name = data.display_name;
            const profile_pic = data.images[0].url;
            const user_email = data.email;
            document.getElementById('signin_img').innerHTML = `<img id="profile_pic" src=${profile_pic} alt="">`;
            document.getElementById('profile_pic_clone_page').innerHTML = `<img src=${profile_pic} alt="">`;
            document.getElementById("signin_text").textContent = display_name;
            document.getElementById("profile_name").innerHTML = display_name;
            document.getElementById("user_email").innerHTML = user_email;

        })
        .catch(error => {
            console.log(error)
        })
    const signin = document.getElementById("signin");
    signin.addEventListener("click", function () {
        setTimeout(() => {
            // window.location.href = "https://cloneify-backend.onrender.com/login1";
            // redirect to new page or your profile since you are already signed in
        }, 550);
    });

} else {
    const signin = document.getElementById("signin");
    signin.addEventListener("click", function () {
        setTimeout(() => {
            window.location.href = "http://localhost:8888/login1";
        }, 550);
    });
}

if (localStorage.getItem('access_token2')) {
    document.getElementById("login2Button").style = "display: none;";
    access_token2 = localStorage.getItem('access_token2');
    // Use access token to authenticate requests to protected resources
    fetch('https://api.spotify.com/v1/me', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token2}` } })
        .then(response => response.json())
        .then(data => {
            const display_name = data.display_name;
            const profile_pic = data.images[0].url;
            const user_email = data.email;
            // document.getElementById('signin_img').innerHTML = `<img id="profile_pic" src=${profile_pic} alt="">`;
            // document.getElementById('profile_pic_clone_page').innerHTML = `<img src=${profile_pic} alt="">`;
            // document.getElementById("signin_text").textContent = display_name;
            // document.getElementById("profile_name").innerHTML = display_name;
            // document.getElementById("user_email").innerHTML = user_email;

        })
        .catch(error => {
            console.log(error)
        })

} else {

}