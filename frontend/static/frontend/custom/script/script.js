/*
    KEY COMPONENTS:
    "activeItem" = null until an edit button is clicked. Will contain object of item we are editing
    "list_snapshot" = Will contain previous state of list. Used for removing extra rows on list update
    
    PROCESS:
    1 - Fetch Data and build rows "buildList()"
    2 - Create Item on form submit
    3 - Edit Item click - Prefill form and change submit URL
    4 - Delete Item - Send item id to delete URL
    5 - Cross out completed task - Event handle updated item

    NOTES:
    -- Add event handlers to "edit", "delete", "title"
    -- Render with strike through items completed
    -- Remove extra data on re-render
    -- CSRF Token
*/

import csrftoken from './getCSRF.js';

let activeItem = null;

buildList();

function buildList(){
    let wrapper = document.getElementById('list-wrapper');
    wrapper.innerHTML = '';
    let url = '/api/tasks';
    fetch(url)
    .then(response => {
        if(!response.ok){
            throw Error(response.statusText);
        }
        return response.json()
    })
    .then(data => {
        console.log(data);
        for (let index in data){
            let item = document.createElement('div');
            item.id = `row-${index}`;
            item.className += 'task-wrapper flex-wrapper';

            let taskContainer = document.createElement('div');
            taskContainer.style.flex = 7;
            let editContainer = document.createElement('div');
            editContainer.style.flex = 1;
            let deleteContainer = document.createElement('div');
            deleteContainer.style.flex = 1;

            let task = document.createElement('span');
            task.className += 'title';
            task.textContent = `${data[index].title}`;

            let editBtn = document.createElement('button');
            editBtn.className += 'btn btn-sm btn-outline-info edit';
            let editIco = document.createElement('i');
            editIco.className += 'fas fa-pencil-alt';
            editBtn.appendChild(editIco);

            let deleteBtn = document.createElement('button');
            deleteBtn.className += 'btn btn-sm btn-outline-dark delete';
            let deleteIco = document.createElement('i');
            deleteIco.className += 'fas fa-trash-alt';
            deleteBtn.appendChild(deleteIco);

            taskContainer.appendChild(task);
            editContainer.appendChild(editBtn);
            deleteContainer.appendChild(deleteBtn);
            item.appendChild(taskContainer);
            item.appendChild(editContainer);
            item.appendChild(deleteContainer);

            // add event listener to edit button
            editBtn.addEventListener('click', (e)=>{
                editItem(data[index]);
            });

            // add event listener to delete button
            deleteBtn.addEventListener('click', (e)=>{
                deleteItem(data[index]);
            });

            // add event listener to task text
            task.addEventListener('click', (e)=>{
                toggleCompleted(e.target, data[index]);
            })

            if (data[index].completed){
                task.classList.add('striked');
            }

            wrapper.appendChild(item);
        }
    })
    .catch(error => console.log(error))
}

const form = document.getElementById('form');
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    let task = form.querySelector('input[type=text]').value;
    if (task){
        // whether item is existing or new
        if (activeItem){
            var url = `/api/task/${activeItem.id}/update/`;
            activeItem = null;
        }
        else{
            var url = '/api/task/create/';
        }

        // $.ajax({
        //     url: url, 
        //     type: form.method,
        //     dataType: 'json',
        //     data: {'title': task, "csrfmiddlewaretoken" : csrftoken},
        // });
        
        fetch(url, {
            method: form.method, 
            headers: {
                'Content-Type': 'application/json', 
                'X-CSRFToken': csrftoken,
            },
            // JSON.stringify: convert a JS object or value into a JSON string
            body: JSON.stringify({'title': task}),
        })
        .then(response =>  buildList())
        form.reset();
    }
});

function editItem(item){
    activeItem = item;
    form.querySelector('input[type=text]').value = activeItem.title;
}

function deleteItem(item){
    let url = `/api/task/${item.id}/delete/`;
    fetch(url, {
        method: 'DELETE', 
        headers: {
            'Content-Type': 'application/json', 
            'X-CSRFToken': csrftoken,
        },
    })
    .then(response => response.json())
    .then(data => buildList())
}

function toggleCompleted(elm, item){
    let url = `/api/task/${item.id}/update/`;
    fetch(url, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'title': item.title, 'completed': !item.completed})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        buildList()
    })
}
