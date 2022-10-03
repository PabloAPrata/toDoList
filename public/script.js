// Variáveis GLOBAIS
let listSize = 0;
const addTaskButton = document.getElementById("add-task-button");
const space = document.getElementById("taks-ul");
let inputTaskText = null;
let dataBase = null;
let lengthDB = 0;
let allTasksHtml = document.getElementsByClassName("task");
let sizeTasksHtml = allTasksHtml.length;

// ---------------------------------------
// Configurações do Ajax
function ajax(config) {

    const xhr = new XMLHttpRequest();
    xhr.open(config.metodo, config.url, true)

    if(config.metodo == "post" || config.metodo == "put"){
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(config.body));
    }
    xhr.onload = e => {
        if (xhr.readyState == 4 && xhr.status === 200) {
            config.sucesso(xhr.response)
        } else if (xhr.status >= 400) {
            config.erro({
                code: xhr.status,
                text: xhr.statusText
            })
        }
    }
 
    if(config.metodo == "get" || config.metodo == "delete")
     xhr.send()

}
// ---------------------------------------

let toggleCheck = () => {
    allTasksHtml = document.getElementsByClassName("task");
    sizeTasksHtml = allTasksHtml.length;

    for (let i = 0; i < sizeTasksHtml; i++) {
        allTasksHtml[i].childNodes[1].onclick = function () {

            let div = this.parentNode;
            let children = div.childNodes;


            if (!this.checked) {
                children[3].style.textDecoration = "none";
                div.style.backgroundColor = "#e0e0e0";

                ajax({
                    url: "check",
                    metodo: "put",
                    body: {index: i, checked: false},
                    sucesso(resposta) {
                    }
                })
                
            } else {
                div.style.backgroundColor = "rgb(158 158 158)";
                children[3].style.textDecoration = "line-through"

                ajax({
                    url: "check",
                    metodo: "put",
                    body: {index: i, checked: true},
                    sucesso(resposta) {
                    }
                })

            }
        }
    }
};

function listAllTasks() {
    ajax({
        url: "tasks",
        metodo: "get",
        sucesso(resposta) {
            dataBase = JSON.parse(resposta);
            lengthDB = dataBase.length
            space.innerHTML = ''
       
            for (let i = 0; i < lengthDB; i++) {
                if(dataBase[i] != null){
                    if(dataBase[i].checked) {
                        const task = ` <li class="task" style="background-color: rgb(158 158 158);">
                        <input type="checkbox" name="" value="" checked>
                        <div class="text-list" onclick="showInput(this)" style="text-decoration: line-through;" title="Clique para editar."><div class="task-text">${dataBase[i].name}</div>
                            <input onkeypress="renameTask(event, this)" class="task-text-input" style="display:none;" type="text" placeholder="Insira o nome de sua tarefa aqui.">
                        </div><span onclick="removeTask(this)" style="color: gray; font-size: 16px;" class="material-icons" title="Remover tarefa">remove</span>
                        </li> `;
        
                        space.insertAdjacentHTML("beforeend", task);
                    } else {
                        const task = ` <li class="task">
                        <input type="checkbox" name="" value="">
                        <div class="text-list" onclick="showInput(this)" title="Clique para editar."><div class="task-text">${dataBase[i].name}</div>
                            <input onkeypress="renameTask(event, this)" class="task-text-input" style="display:none;" type="text" placeholder="Insira o nome de sua tarefa aqui.">
                        </div><span onclick="removeTask(this)" style="color: gray; font-size: 16px;" class="material-icons" title="Remover tarefa">remove</span>
                        </li> `;
        
                        space.insertAdjacentHTML("beforeend", task);
                    }

                toggleCheck();
                }
            }
        
        }
    })
}

listAllTasks()

let showInput = (e) => {

    let input = e.children[1];
    input.style.display = "block";
}

// ---------------------------------------
// Adicionar nova task pelo botão "+"
addTaskButton.addEventListener("click", () => {

    allTasksHtml = document.getElementsByClassName("task");
    sizeTasksHtml = allTasksHtml.length;

    const task = ` <li class="task">
    <input type="checkbox" name="" value="">
    <div class="text-list" onclick="showInput(this)"><div class="task-text">texto aqui</div>
        <input onkeypress="renameTask(event, this)" class="task-text-input" type="text" placeholder="Insira o nome de sua tarefa aqui.">
    </div><span onclick="removeTask(this)" style="color: gray; font-size: 16px;" class="material-icons">remove</span>
    </li> `;


    space.insertAdjacentHTML("beforeend", task);

    toggleCheck();
    lengthDB++;
    let emptyTask =  {name: '', checked: false};

    ajax({
        url: "add-task",
        metodo: "post",
        body: emptyTask,
        sucesso(resposta) {
            dataBase = JSON.parse(resposta); 
        }
    })
});
// ---------------------------------------
  
let renameTask = (event, input) => {

    if (event.key == "Enter") {
        let inputDad = input.parentNode
        let inputBrother = inputDad.children[0]
        let text = input.value
        if(text == ''){
            //Adicionar o input task-text-input
            return
        }
        inputBrother.textContent = text;
        input.style.display = "none";

        let taskFather = input.parentNode.parentNode
        let tasks = document.getElementsByClassName('task');
        let size = tasks.length;
        let body = null;

        for(let i = 0; i < size; i++) {
            if(tasks[i] == taskFather){
                body = {index: i, text: text};
                ajax({
                    url: "rename",
                    metodo: "put",
                    body: body,
                    sucesso(resposta) {
                    }
                })
            }
        }

    }
}

let removeTask = (elemento) => {

    let taskFather = elemento.parentNode
    let tasks = document.getElementsByClassName('task');
    let size = tasks.length;
    let position = null;
    for(let i = 0; i < size; i++) {
        if(tasks[i] == taskFather){
            position = i
        }
    }

    elemento.parentNode.remove();


    ajax({
        url: `${position}`,
        metodo: "delete",
        sucesso(resposta) {
            dataBase = JSON.parse(resposta);
        }
    })
}

