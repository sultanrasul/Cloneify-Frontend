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
                // Access token is expired, zsend refresh token to backend
                fetch(`https://cloneify-backend.onrender.com/refresh_token?refresh_token=${refresh_token}`)
                    .then(response => response.json())
                    .then(data => {
                        access_token = data.access_token;
                        refresh_token = data.refresh_token;
                        console.log(refresh_token);
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

function getTopTracks() {
    access_token = localStorage.getItem('access_token');
    fetch('https://api.spotify.com/v1/me/top/tracks', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}` } })
        .then(response => response.json())
        .then(data => {
            console.log(data);
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
    access_token = localStorage.getItem('access_token');
    fetch('https://api.spotify.com/v1/me/top/artists', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}` } })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Create an empty array to store the list items
            var listItems = [];

            // Iterate through the data and create a list item for each track
            data.items.forEach(function (artist, index) {
                var listItem = document.createElement("li");
                var indexEl = document.createElement("div");
                var indexTxt = document.createTextNode(index + 1);
                var artist_name = document.createTextNode(artist.name);
                console.log(artist_name);
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
    fetch(`https://cloneify-backend.onrender.com/callback?code=${authCode}`) //sends req to spotify through backend 
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
if (localStorage.getItem('access_token')) {
    console.log("Signed In!")
    checkAndRefreshToken();
    getTopTracks();
    getTopArtists()

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
            document.getElementById("displayname").textContent = display_name;
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
    console.log("Not Signed In!")
    const signin = document.getElementById("signin");
    signin.addEventListener("click", function () {
        setTimeout(() => {
            window.location.href = "https://cloneify-backend.onrender.com/login1";
        }, 550);
    });
}