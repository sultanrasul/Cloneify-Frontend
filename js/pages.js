const list = document.querySelectorAll('.list');

let activeTab;
function activelink() {
    list.forEach((item) =>
        item.classList.remove('active'));
    this.classList.add('active');
    activeTab = this.textContent;
    // console.log(activeTab);
    sessionStorage.setItem('current_tab', activeTab);

}
list.forEach((item) =>
    item.addEventListener('click', activelink));


const pages = document.querySelectorAll(".page");
const translateAmount = 133.3;
let currentPage = 0;

list.forEach((item) => {
    item.addEventListener('click', () => {
        let targetPage = item.getAttribute('data-page');
        slide(targetPage);
    });
});

function slide(targetPage) {
    if (targetPage === currentPage) {
        return; // Exit the function if the target page is the same as the current page
    } else {
        distance = targetPage - currentPage;
        translate = -(distance) * translateAmount;
        pages.forEach(pages => (pages.style.transform = `translateX(${translate}%)`));
    }
};
slide(1);