const addForm = document.querySelector(".add");
const list = document.querySelector(".todos");
const search = document.querySelector('.search');

const addTodo = (todo, id) => {
    console.log(todo, id);
    const date = todo.created.toDate().toLocaleString();
    console.log(date.toLocaleString());
    let html = `
    <li class="list-group-item py-3 px-4" data-id="${id}">
    <div>${todo.title}</div>
    <div class="date">${date}<i class="far fa-trash-alt float-right delete text-white"></i></div>
</li>
    `;

    list.innerHTML += html;
}

const deleteTodo = id => {
    const todos = document.querySelectorAll('li');
    todos.forEach(todo => {
        if(todo.getAttribute('data-id') === id){
            todo.remove();
        }
    })
}

// db.collection('todos').get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         addTodo(doc.data(), doc.id);
//     })
// }).catch( err => {
//     console.log(err);
// });

db.collection('todos').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        const doc = change.doc;
        if(change.type === "added"){
            addTodo(doc.data(), doc.id);
        }else if(change.type === "removed"){
            deleteTodo(doc.id);
        }
    });
});

addForm.addEventListener('submit', e => {
    e.preventDefault();
    const todo = addForm.add.value.trim();
    if(todo.length){
        // generateTemplate(todo);
        const now = new Date();
        const todos = {
            title: todo,
            created: firebase.firestore.Timestamp.fromDate(now),
            completed: ""
        };
        db.collection('todos').add(todos).then(() => {
            console.log("Added new todo");
        }).catch(err => {
            console.log(err);
        })
        addForm.reset();
    }
});

list.addEventListener('click', e => {
    if(e.target.classList.contains('delete')){
        const id = e.target.parentElement.parentElement.getAttribute('data-id');
        console.log(id);

        db.collection('todos').doc(id).delete()
            .then(() => {
                console.log(`Todo with id of ${id} deleted!`)
            })
            .catch(err => {
                console.log(err);
            })
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

