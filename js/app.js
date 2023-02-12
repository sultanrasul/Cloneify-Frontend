let access_token1;
let refresh_token1;
let access_token2;
let refresh_token2;
// var url = "http://localhost:8888"
var url = "https://cloneify-backend.onrender.com"

const top_tracks_title = document.getElementById("top_tracks");
const top_artists_title = document.getElementById("top_artists");

function checkAndRefreshToken1() {
    access_token1 = localStorage.getItem('access_token1');
    refresh_token1 = localStorage.getItem('refresh_token1');
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
                fetch(`${url}/refresh_token?refresh_token=${refresh_token1}`)
                    .then(response => response.json())
                    .then(data => {
                        access_token1 = data.access_token;
                        refresh_token1 = data.refresh_token;
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
function checkAndRefreshToken2() {
    access_token2 = localStorage.getItem('access_token2');
    refresh_token2 = localStorage.getItem('refresh_token2');
    // Check if the access token is expired
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token2}`
        }
    })
        .then(response => {
            if (response.status === 401) {
                // Access token is expired, zsend refresh token to backend
                fetch(`${url}/refresh_token?refresh_token=${refresh_token2}`)
                    .then(response => response.json())
                    .then(data => {
                        access_token2 = data.access_token;
                        refresh_token2 = data.refresh_token;
                        localStorage.setItem('access_token2', access_token2);
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



function login1(){
    const queryString = window.location.search; // gets url
    const urlParams = new URLSearchParams(queryString); // gets params from url
    const authCode = urlParams.get("code") || null;
    if (authCode) {
        fetch(`${url}/callback?code=${authCode}`) //sends req to spotify through backend 
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
                        document.getElementById('signin_img').innerHTML = `<  img id="profile_pic" src=${profile_pic} alt="">`;
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
};

function login2(){
    const queryString = window.location.search; // gets url
    const urlParams = new URLSearchParams(queryString); // gets params from url
    const authCode = urlParams.get("code") || null;
    if (authCode) {
        fetch(`${url}/callback?code=${authCode}`) //sends req to spotify through backend 
            .then(response => response.json())
            .then(data => {
                access_token2 = data.access_token;
                refresh_token2 = data.refresh_token;
                localStorage.setItem('access_token2', access_token2);
                localStorage.setItem('refresh_token2', refresh_token2);
                window.history.replaceState({}, document.title, "/"); //removes code from url w/o refreshing
                location.reload(); //refreshs the page
    
    
                fetch('https://api.spotify.com/v1/me', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token2}` } })
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
};
function getFirstAlbumCover(){
    access_token2 = localStorage.getItem('access_token2');
    fetch('https://api.spotify.com/v1/me/albums?limit=1', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token2}` } })
                    .then(response => response.json())
                    .then(data => {
                        const album_cover = data["items"][0]["album"]["images"][1]["url"];
                        console.log(album_cover);
                        const albumImg = document.getElementById("album_img");
                        albumImg.src = album_cover;
                    })
                    .catch(error => { console.log(error) })
};
function getTotalData() {
    access_token1 = localStorage.getItem('access_token1');
    const headers = {
        "Authorization": `Bearer ${access_token1}`,
        "Content-Type": "application/json"
    };

    const totalData = {};

    // Get the total number of songs
    const getSongs = async () => {
        try {
            const response = await fetch("https://api.spotify.com/v1/me/tracks?limit=1", {
                headers: headers
            });
            const data = await response.json();
            totalData.songs = data.total;
        } catch (error) {
            console.error(error);
        }
    };

    // Get the total number of albums
    const getAlbums = async () => {
        try {
            const response = await fetch("https://api.spotify.com/v1/me/albums?limit=1", {
                headers: headers
            });
            const data = await response.json();
            totalData.albums = data.total;
        } catch (error) {
            console.error(error);
        }
    };

    // Get the total number of playlists
    const getPlaylists = async () => {
        try {
            const response = await fetch("https://api.spotify.com/v1/me/playlists?limit=1", {
                headers: headers
            });
            const data = await response.json();
            totalData.playlists = data.total;
        } catch (error) {
            console.error(error);
        }
    };
    const getEpisodes = async () => {
        try {
            const response = await fetch("https://api.spotify.com/v1/me/episodes?limit=1", {
                headers: headers
            });
            const data = await response.json();
            totalData.episodes = data.total;
        } catch (error) {
            console.error(error);
        }
    };
    const getPodcasts = async () => {
        try {
            const response = await fetch("https://api.spotify.com/v1/me/shows?limit=1", {
                headers: headers
            });
            const data = await response.json();
            totalData.podcasts = data.total;
        } catch (error) {
            console.error(error);
        }
    };
    // const getAudiobooks = async () => {
    //     try {
    //         const response = await fetch("https://api.spotify.com/v1/me/audiobooks?limit=1", {
    //             headers: headers
    //         });
    //         const data = await response.json();
    //         totalData.audiobooks = data.total;
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };



    return Promise.all([getSongs(), getAlbums(), getPlaylists(),getEpisodes(),getPodcasts()])
        .then(() => {
            console.log(totalData);
            return totalData;
        })
        .catch((error) => {
            console.error(error);
        });
}
 



// Check if access token is stored in session storage
if (localStorage.getItem('access_token1')) {
    checkAndRefreshToken1();
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
            document.getElementById('profile_pic_clone_page1').innerHTML = `<img src=${profile_pic} alt="">`;
            document.getElementById("signin_text").textContent = display_name;
            document.getElementById("profile_name1").innerHTML = display_name;
            document.getElementById("user_email1").innerHTML = user_email;


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
            window.location.href = `${url}/login1`;
        }, 550);
    });
    login1();
}

if (localStorage.getItem('access_token2')) {
    getFirstAlbumCover()
    checkAndRefreshToken2();
    getTotalData();
    document.getElementById("login2Button").style = "display: none;";
    access_token2 = localStorage.getItem('access_token2');
    // Use access token to authenticate requests to protected resources
    fetch('https://api.spotify.com/v1/me', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token2}` } })
        .then(response => response.json())
        .then(data => {
            const display_name = data.display_name;
            const profile_pic = data.images[0].url;
            const user_email = data.email;
            document.getElementById('profile_pic_clone_page2').innerHTML = `<img src=${profile_pic} alt="">`;
            document.getElementById("profile_name2").innerHTML = display_name;
            document.getElementById("user_email2").innerHTML = user_email;

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
    const signin1 = document.getElementById("projects_button");
    signin1.addEventListener("click", function () {
        window.location.href = `${url}/login2`;
    });
    login2();
}