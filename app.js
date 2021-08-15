const addForm = document.querySelector(".add");
const list = document.querySelector(".todos");
const search = document.querySelector('.search');

const generateTemplate = todo => {
    list.innerHTML += `
    <li class="list-group-item py-3 px-4">${todo} <i class="far fa-trash-alt delete float-right"></i></li>
    `;
}

addForm.addEventListener('submit', e => {
    e.preventDefault();
    const todo = addForm.add.value.trim();
    if(todo.length){
        generateTemplate(todo);
        addForm.reset();
    }
});

list.addEventListener('click', e => {
    console.log('clicked');
    if(e.target.classList.contains('delete')){
        e.target.parentElement.remove();
    }
});

const filterList = term => {
    Array.from(list.children)
    .filter(todo => !todo.textContent.toLowerCase().includes(term))
    .forEach(todo => {
        todo.classList.add('filtered');
    }); 
    
    Array.from(list.children)
    .filter(todo => todo.textContent.toLowerCase().includes(term))
    .forEach(todo => {
        todo.classList.remove('filtered');
    });
}

search.addEventListener('keyup', e => {
    const term = e.target.value.trim().toLowerCase();
    console.log(term);
    filterList(term);
});

