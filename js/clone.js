const signin1 = document.getElementById("clone");
    signin1.addEventListener("click", function () {
        const all = document.getElementById("all");  
        const songs = document.getElementById("songs"); 
        const playlist = document.getElementById("playlist"); 
        const albums = document.getElementById("albums"); 
        const books = document.getElementById("books"); 
        const episodes = document.getElementById("episodes"); 
        const shows = document.getElementById("shows"); 
        if (all.checked == true ){  
            console.log("all is checked")
          } 
});

function toggle(source) {
    checkboxes = document.getElementsByName('all');
    for(var i=0, n=checkboxes.length;i<n;i++) {
      checkboxes[i].checked = source.checked;
    }
}

function checkLengthOfChecked(){
    const all = document.getElementById("all");  
    const length = document.querySelectorAll('input[type="checkbox"]:checked').length
    let len;
    if (length == 6){
        all.checked = true;
        len = 7
    } 
}

