let access_token1;
let refresh_token1;
let access_token2;
let refresh_token2;
let profile_id1;
let profile_id2;
var url = "http://localhost:8888"
// var url = "https://cloneify-backend-wup0.onrender.com"

const top_tracks_title = document.getElementById("top_tracks");
const top_artists_title = document.getElementById("top_artists");
const logout1 = document.getElementById("logout1Button");
const logout2 = document.getElementById("logout2Button");

logout1.addEventListener('click', function() {
    localStorage.removeItem('access_token1');
    localStorage.removeItem('refresh_token1');
    location.reload();
});
logout2.addEventListener('click', function() {
    localStorage.removeItem('access_token2');
    localStorage.removeItem('refresh_token2');
    location.reload();
});

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
                        profile_id1 = data.id;

                        const profile_pic = data.images.length > 0 ? data.images[0].url : null;
                            if (profile_pic !== null) {
                                document.getElementById('signin_img').innerHTML = `<  img id="profile_pic" src=${profile_pic} alt="">`;
                                document.getElementById('imagesign').innerHTML = `<img id="profile_pic" src=${profile_pic} alt="">`;
                            } else {
                                document.getElementById('signin_img').innerHTML = `<svg role="img" height="50" width="50" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 uPxdw"><path d="M6.233.371a4.388 4.388 0 0 1 5.002 1.052c.421.459.713.992.904 1.554.143.421.263 1.173.22 1.894-.078 1.322-.638 2.408-1.399 3.316l-.127.152a.75.75 0 0 0 .201 1.13l2.209 1.275a4.75 4.75 0 0 1 2.375 4.114V16H.382v-1.143a4.75 4.75 0 0 1 2.375-4.113l2.209-1.275a.75.75 0 0 0 .201-1.13l-.126-.152c-.761-.908-1.322-1.994-1.4-3.316-.043-.721.077-1.473.22-1.894a4.346 4.346 0 0 1 .904-1.554c.411-.448.91-.807 1.468-1.052zM8 1.5a2.888 2.888 0 0 0-2.13.937 2.85 2.85 0 0 0-.588 1.022c-.077.226-.175.783-.143 1.323.054.921.44 1.712 1.051 2.442l.002.001.127.153a2.25 2.25 0 0 1-.603 3.39l-2.209 1.275A3.25 3.25 0 0 0 1.902 14.5h12.196a3.25 3.25 0 0 0-1.605-2.457l-2.209-1.275a2.25 2.25 0 0 1-.603-3.39l.127-.153.002-.001c.612-.73.997-1.52 1.052-2.442.032-.54-.067-1.097-.144-1.323a2.85 2.85 0 0 0-.588-1.022A2.888 2.888 0 0 0 8 1.5z"></path></svg>`;
                                document.getElementById('imagesign').innerHTML = `<svg role="img" height="50" width="50" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 uPxdw"><path d="M6.233.371a4.388 4.388 0 0 1 5.002 1.052c.421.459.713.992.904 1.554.143.421.263 1.173.22 1.894-.078 1.322-.638 2.408-1.399 3.316l-.127.152a.75.75 0 0 0 .201 1.13l2.209 1.275a4.75 4.75 0 0 1 2.375 4.114V16H.382v-1.143a4.75 4.75 0 0 1 2.375-4.113l2.209-1.275a.75.75 0 0 0 .201-1.13l-.126-.152c-.761-.908-1.322-1.994-1.4-3.316-.043-.721.077-1.473.22-1.894a4.346 4.346 0 0 1 .904-1.554c.411-.448.91-.807 1.468-1.052zM8 1.5a2.888 2.888 0 0 0-2.13.937 2.85 2.85 0 0 0-.588 1.022c-.077.226-.175.783-.143 1.323.054.921.44 1.712 1.051 2.442l.002.001.127.153a2.25 2.25 0 0 1-.603 3.39l-2.209 1.275A3.25 3.25 0 0 0 1.902 14.5h12.196a3.25 3.25 0 0 0-1.605-2.457l-2.209-1.275a2.25 2.25 0 0 1-.603-3.39l.127-.153.002-.001c.612-.73.997-1.52 1.052-2.442.032-.54-.067-1.097-.144-1.323a2.85 2.85 0 0 0-.588-1.022A2.888 2.888 0 0 0 8 1.5z"></path></svg>yy`;
                            }

                        document.getElementById("signin_text").textContent = display_name;



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
    
                // Use access_token here
            })
            .catch(error => {
                console.log(error);
            }) //catches any errors in the request process (invalid code, etc) and logs
    }
};
function getImageCovers(){
    access_token1 = localStorage.getItem('access_token1');
    fetch('https://api.spotify.com/v1/me/albums?limit=1', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token1}` } })
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById("album_img1").src = data["items"][0]["album"]["images"][1]["url"];
                        document.getElementById("album_img2").src = data["items"][0]["album"]["images"][1]["url"];
                    })
                    .catch(error => { console.log(error) })
    fetch('https://api.spotify.com/v1/me/playlists?limit=1', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token1}` } })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        document.getElementById("playlist_img1").src = data["items"][0]["images"][0]["url"];
                        document.getElementById("playlist_img2").src = data["items"][0]["images"][0]["url"];
                    })
                    .catch(error => { console.log(error) })
    fetch('https://api.spotify.com/v1/me/shows?limit=1', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token1}` } })
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById("podcast_img1").src = data["items"][0]["show"]["images"][1]["url"];
                        document.getElementById("podcast_img2").src = data["items"][0]["show"]["images"][1]["url"];
                    })
                    .catch(error => { console.log(error) })
    fetch('https://api.spotify.com/v1/me/episodes?offset=1', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token1}` } })
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById("episode_img1").src = data["items"][0]["episode"]["images"][1]["url"];
                        document.getElementById("episode_img2").src = data["items"][0]["episode"]["images"][1]["url"];
                    })
                    .catch(error => { console.log(error) })
    
};

function getTotalData(access_token) {
    // console.log(access_token);
    const headers = {
        "Authorization": `Bearer ${access_token}`,
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
            // console.log(totalData);
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
    getTopArtists();

    getTotalData(access_token1)
        .then(totalData => {
            totalData1 = totalData;
            console.log(totalData1);
            document.querySelector("#songs1 p").textContent = `Total Liked Songs: ${totalData1.songs}`;
            document.querySelector("#albums1 p").textContent = `Total Albums: ${totalData1.albums}`;
            document.querySelector("#playlists1 p").textContent = `Total Playlists: ${totalData1.playlists}`;
            document.querySelector("#podcasts1 p").textContent = `Total Podcasts: ${totalData1.podcasts}`;
            document.querySelector("#episodes1 p").textContent = `Total Episodes: ${totalData1.episodes}`;

        })
        .catch(error => {
            console.error(error);
        });
    // Use access token to authenticate requests to protected resources
    fetch('https://api.spotify.com/v1/me', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token1}` } })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.querySelector("#country1 p").textContent = `${data["country"]}`;
            document.querySelector("#type1 p").textContent = `${data["product"]}`;
            document.querySelector("#followers1 p").textContent = `${data["followers"]["total"]}`;
            const openProfile1 = document.getElementById("openProfile1");

            openProfile1.addEventListener('click', function() {
                window.open(
                    data["external_urls"]["spotify"],
                    '_blank' // <- This is what makes it open in a new window.
                  );
            });

            const display_name = data.display_name;
            const user_email = data.email;
            profile_id1 = data.id;
            document.getElementById("signin_text").textContent = display_name;
            document.getElementById("profile_name1").innerHTML = display_name;
            document.getElementById("account_profile_name1").innerHTML = display_name;
            document.getElementById("user_email1").innerHTML = user_email;
            document.getElementById("account_user_email1").innerHTML = user_email;
            
            const profile_pic = data.images.length > 0 ? data.images[0].url : null;
            if (profile_pic !== null) {
                document.getElementById('signin_img').innerHTML = `<img id="profile_pic" src=${profile_pic} alt="">`;
                document.getElementById('profile_pic_clone_page1').innerHTML = `<img src=${profile_pic} alt="">`;
                document.getElementById('account_profile_pic_clone_page1').innerHTML = `<img src=${profile_pic} alt="">`;
            } else {
                document.getElementById('profile_pic_clone_page1').innerHTML = `<svg role="img" height="50" width="50" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 uPxdw"><path d="M6.233.371a4.388 4.388 0 0 1 5.002 1.052c.421.459.713.992.904 1.554.143.421.263 1.173.22 1.894-.078 1.322-.638 2.408-1.399 3.316l-.127.152a.75.75 0 0 0 .201 1.13l2.209 1.275a4.75 4.75 0 0 1 2.375 4.114V16H.382v-1.143a4.75 4.75 0 0 1 2.375-4.113l2.209-1.275a.75.75 0 0 0 .201-1.13l-.126-.152c-.761-.908-1.322-1.994-1.4-3.316-.043-.721.077-1.473.22-1.894a4.346 4.346 0 0 1 .904-1.554c.411-.448.91-.807 1.468-1.052zM8 1.5a2.888 2.888 0 0 0-2.13.937 2.85 2.85 0 0 0-.588 1.022c-.077.226-.175.783-.143 1.323.054.921.44 1.712 1.051 2.442l.002.001.127.153a2.25 2.25 0 0 1-.603 3.39l-2.209 1.275A3.25 3.25 0 0 0 1.902 14.5h12.196a3.25 3.25 0 0 0-1.605-2.457l-2.209-1.275a2.25 2.25 0 0 1-.603-3.39l.127-.153.002-.001c.612-.73.997-1.52 1.052-2.442.032-.54-.067-1.097-.144-1.323a2.85 2.85 0 0 0-.588-1.022A2.888 2.888 0 0 0 8 1.5z"></path></svg>`;
                document.getElementById('account_profile_pic_clone_page1').innerHTML = `<svg role="img" height="50" width="50" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 uPxdw"><path d="M6.233.371a4.388 4.388 0 0 1 5.002 1.052c.421.459.713.992.904 1.554.143.421.263 1.173.22 1.894-.078 1.322-.638 2.408-1.399 3.316l-.127.152a.75.75 0 0 0 .201 1.13l2.209 1.275a4.75 4.75 0 0 1 2.375 4.114V16H.382v-1.143a4.75 4.75 0 0 1 2.375-4.113l2.209-1.275a.75.75 0 0 0 .201-1.13l-.126-.152c-.761-.908-1.322-1.994-1.4-3.316-.043-.721.077-1.473.22-1.894a4.346 4.346 0 0 1 .904-1.554c.411-.448.91-.807 1.468-1.052zM8 1.5a2.888 2.888 0 0 0-2.13.937 2.85 2.85 0 0 0-.588 1.022c-.077.226-.175.783-.143 1.323.054.921.44 1.712 1.051 2.442l.002.001.127.153a2.25 2.25 0 0 1-.603 3.39l-2.209 1.275A3.25 3.25 0 0 0 1.902 14.5h12.196a3.25 3.25 0 0 0-1.605-2.457l-2.209-1.275a2.25 2.25 0 0 1-.603-3.39l.127-.153.002-.001c.612-.73.997-1.52 1.052-2.442.032-.54-.067-1.097-.144-1.323a2.85 2.85 0 0 0-.588-1.022A2.888 2.888 0 0 0 8 1.5z"></path></svg>`;
                document.getElementById('signin_img').innerHTML = `<svg role="img" height="40" width="40" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 uPxdw"><path d="M6.233.371a4.388 4.388 0 0 1 5.002 1.052c.421.459.713.992.904 1.554.143.421.263 1.173.22 1.894-.078 1.322-.638 2.408-1.399 3.316l-.127.152a.75.75 0 0 0 .201 1.13l2.209 1.275a4.75 4.75 0 0 1 2.375 4.114V16H.382v-1.143a4.75 4.75 0 0 1 2.375-4.113l2.209-1.275a.75.75 0 0 0 .201-1.13l-.126-.152c-.761-.908-1.322-1.994-1.4-3.316-.043-.721.077-1.473.22-1.894a4.346 4.346 0 0 1 .904-1.554c.411-.448.91-.807 1.468-1.052zM8 1.5a2.888 2.888 0 0 0-2.13.937 2.85 2.85 0 0 0-.588 1.022c-.077.226-.175.783-.143 1.323.054.921.44 1.712 1.051 2.442l.002.001.127.153a2.25 2.25 0 0 1-.603 3.39l-2.209 1.275A3.25 3.25 0 0 0 1.902 14.5h12.196a3.25 3.25 0 0 0-1.605-2.457l-2.209-1.275a2.25 2.25 0 0 1-.603-3.39l.127-.153.002-.001c.612-.73.997-1.52 1.052-2.442.032-.54-.067-1.097-.144-1.323a2.85 2.85 0 0 0-.588-1.022A2.888 2.888 0 0 0 8 1.5z"></path></svg>`;
            }
        })
        .catch(error => {
            console.log(error)
        })
        getImageCovers();
        logout1.style = "display: block;"

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
    checkAndRefreshToken2();
    document.getElementById("login2Button").style = "display: none;";
    document.getElementById("account_login2Button").style = "display: none;";
    access_token2 = localStorage.getItem('access_token2');
    getTotalData(access_token2)
        .then(totalData => {
            totalData2 = totalData;
            document.querySelector("#songs2 p").textContent = `Total Liked Songs: ${totalData2.songs}`;
            document.querySelector("#albums2 p").textContent = `Total Albums: ${totalData2.albums}`;
            document.querySelector("#playlists2 p").textContent = `Total Playlists: ${totalData2.playlists}`;
            document.querySelector("#podcasts2 p").textContent = `Total Podcasts: ${totalData2.podcasts}`;
            document.querySelector("#episodes2 p").textContent = `Total Episodes: ${totalData2.episodes}`;
        })
        .catch(error => {
            console.error(error);
        });
    // Use access token to authenticate requests to protected resources
    fetch('https://api.spotify.com/v1/me', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token2}` } })
        .then(response => response.json())
        .then(data => {
            const display_name = data.display_name;
            const user_email = data.email;
        
            document.querySelector("#country2 p").textContent = `${data["country"]}`;
            document.querySelector("#type2 p").textContent = `${data["product"]}`;
            document.querySelector("#followers2 p").textContent = `${data["followers"]["total"]}`;
            const openProfile2 = document.getElementById("openProfile2");

            openProfile2.addEventListener('click', function() {
                window.open(
                    data["external_urls"]["spotify"],
                    '_blank' // <- This is what makes it open in a new window.
                  );
            });
            const profile_pic = data.images.length > 0 ? data.images[0].url : null;
            if (profile_pic !== null) {
                document.getElementById('profile_pic_clone_page2').innerHTML = `<img src=${profile_pic} alt="">`;
                document.getElementById('account_profile_pic_clone_page2').innerHTML = `<img src=${profile_pic} alt="">`;
            } else {
                document.getElementById('profile_pic_clone_page2').innerHTML = `<svg role="img" height="50" width="50" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 uPxdw"><path d="M6.233.371a4.388 4.388 0 0 1 5.002 1.052c.421.459.713.992.904 1.554.143.421.263 1.173.22 1.894-.078 1.322-.638 2.408-1.399 3.316l-.127.152a.75.75 0 0 0 .201 1.13l2.209 1.275a4.75 4.75 0 0 1 2.375 4.114V16H.382v-1.143a4.75 4.75 0 0 1 2.375-4.113l2.209-1.275a.75.75 0 0 0 .201-1.13l-.126-.152c-.761-.908-1.322-1.994-1.4-3.316-.043-.721.077-1.473.22-1.894a4.346 4.346 0 0 1 .904-1.554c.411-.448.91-.807 1.468-1.052zM8 1.5a2.888 2.888 0 0 0-2.13.937 2.85 2.85 0 0 0-.588 1.022c-.077.226-.175.783-.143 1.323.054.921.44 1.712 1.051 2.442l.002.001.127.153a2.25 2.25 0 0 1-.603 3.39l-2.209 1.275A3.25 3.25 0 0 0 1.902 14.5h12.196a3.25 3.25 0 0 0-1.605-2.457l-2.209-1.275a2.25 2.25 0 0 1-.603-3.39l.127-.153.002-.001c.612-.73.997-1.52 1.052-2.442.032-.54-.067-1.097-.144-1.323a2.85 2.85 0 0 0-.588-1.022A2.888 2.888 0 0 0 8 1.5z"></path></svg>`;
                document.getElementById('account_profile_pic_clone_page2').innerHTML = `<svg role="img" height="50" width="50" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 uPxdw"><path d="M6.233.371a4.388 4.388 0 0 1 5.002 1.052c.421.459.713.992.904 1.554.143.421.263 1.173.22 1.894-.078 1.322-.638 2.408-1.399 3.316l-.127.152a.75.75 0 0 0 .201 1.13l2.209 1.275a4.75 4.75 0 0 1 2.375 4.114V16H.382v-1.143a4.75 4.75 0 0 1 2.375-4.113l2.209-1.275a.75.75 0 0 0 .201-1.13l-.126-.152c-.761-.908-1.322-1.994-1.4-3.316-.043-.721.077-1.473.22-1.894a4.346 4.346 0 0 1 .904-1.554c.411-.448.91-.807 1.468-1.052zM8 1.5a2.888 2.888 0 0 0-2.13.937 2.85 2.85 0 0 0-.588 1.022c-.077.226-.175.783-.143 1.323.054.921.44 1.712 1.051 2.442l.002.001.127.153a2.25 2.25 0 0 1-.603 3.39l-2.209 1.275A3.25 3.25 0 0 0 1.902 14.5h12.196a3.25 3.25 0 0 0-1.605-2.457l-2.209-1.275a2.25 2.25 0 0 1-.603-3.39l.127-.153.002-.001c.612-.73.997-1.52 1.052-2.442.032-.54-.067-1.097-.144-1.323a2.85 2.85 0 0 0-.588-1.022A2.888 2.888 0 0 0 8 1.5z"></path></svg>`;
            }
          

            profile_id2 = data.id;
            document.getElementById("profile_name2").innerHTML = display_name;
            document.getElementById("account_profile_name2").innerHTML = display_name;
            document.getElementById("user_email2").innerHTML = user_email;
            document.getElementById("account_user_email2").innerHTML = user_email;

        })
        .catch(error => {
            console.log(error)
        })
    getImageCovers();
    logout2.style = "display: block;"
} else {

    const signin1 = document.getElementById("projects_button");
    const signin2 = document.getElementById("account_login2Button");
    signin2.addEventListener("click", function () {
        window.location.href = `${url}/login2`;
    });
    signin1.addEventListener("click", function () {
        window.location.href = `${url}/login2`;
    });
    login2();
}
