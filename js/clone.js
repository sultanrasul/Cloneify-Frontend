document.getElementById("clone").addEventListener("click", function () {
        access_token1 = localStorage.getItem('access_token1');
        access_token2 = localStorage.getItem('access_token2');
        const all = document.getElementById("all");  
        const songs = document.getElementById("songs"); 
        const playlist = document.getElementById("playlist"); 
        const albums = document.getElementById("albums"); 
        const books = document.getElementById("books"); 
        const episodes = document.getElementById("episodes"); 
        const shows = document.getElementById("shows"); 
        if (songs.checked == true ){  
            console.log("all is checked")
            cloneSongs(access_token1);
          } 
});

async function cloneSongs(access_token) {
    access_token1 = localStorage.getItem('access_token1');
    access_token2 = localStorage.getItem('access_token2');
    let results;
    const totalSongs1 = totalData1.songs;
    const allTracks = [];
    let totalRetrieved = 0;
  
    while (totalRetrieved < totalSongs1) {
      const response = await fetch(
        `https://api.spotify.com/v1/me/tracks?limit=50&offset=${totalRetrieved}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token1}`,
          },
        }
      );
  
      if (!response.ok) {
        console.log("Fetch failed with status: " + response.status);
        break;
      }
  
      results = await response.json();
      for (let i = 0; i < results.items.length; i++) {
        allTracks.push(results.items[i]["track"]["id"]);
      }
      totalRetrieved += results.items.length;
  
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    allTracks.reverse();
    for (let i = 0; i < allTracks.length; i++) {
      const response = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${allTracks[i]}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token2}`,
        },
      });
    
      if (!response.ok) {
        console.error(`Failed to add track with id ${allTracks[i]}`);
      }
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

function toggle(source) {
    checkboxes = document.getElementsByName('all');
    for(var i=0, n=checkboxes.length;i<n;i++) {
      checkboxes[i].checked = source.checked;
    }
}

function checkLengthOfChecked(){
    const all = document.getElementById("all");  
    const length = document.querySelectorAll('input[type="checkbox"]:checked').length
    if (length == 6){
        all.checked = true;
}
}

