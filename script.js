var uid = new ShortUniqueId();
// console.log(uid());

let mainContainer = document.querySelector(".main-container");
let input = document.querySelector(".input_container_text");
let defaultColor = "black";
let colors = ["pink", "blue", "green", "black"]
let cFilter = "";
let addContainer = document.querySelector(".plus-container");
let lockContainer = document.querySelector(".lock-container");
let unlockContainer = document.querySelector(".unlock-container");
let multiplyContainer = document.querySelector(".multiply-container");
let colorChooser = document.querySelector(".color_container");
let allColorChooser = document.querySelectorAll(".color_picker");
let modal = document.querySelector(".modal");
let multiply = false;
let locked = true;

// fetch tasks from the localStorage while starting up from the fist time.
(function (){
    let tasksArr = JSON.parse(localStorage.getItem("tasks")) || [];
    modal.style.display = "none";
    for(let i=0; i<tasksArr.length; i++) {
        let id = tasksArr[i].id;
        let value = tasksArr[i].value;
        let color = tasksArr[i].color;
        createTask(id, value, false, color);
    }
})();

// function for creating task
function createTask(id, value, flag, color) {
    let taskContainer = document.createElement("div");
    taskContainer.setAttribute("class", "task_container");
    
    defaultColor = color;
    
    taskContainer.innerHTML = `
    <div class="task_header ${defaultColor}">

    </div>
    <div class="task_main-container">
        <h3 class="task_id">
            #${id}
        </h3>
        <div class="text" contentEditable="false">
            ${value}
        </div>
    </div>
    `
    
    // flag == true means I am creating the task
    // flag == false means I am fetching the task from localStorage

    // if flag is true it means we are creating the task
    // if flag is false it means we are fetching the task from localStorage
    if(flag == true) {
        // making tasks array
        let taskObject = {
            id: id,
            value: value,
            color: defaultColor,
        }
        let tasksArr = JSON.parse(localStorage.getItem("tasks")) || [];
        tasksArr.push(taskObject);
        localStorage.setItem("tasks", JSON.stringify(tasksArr));
    }
    defaultColor = "black";
    mainContainer.appendChild(taskContainer);

    // making the content editable and non editable
    let textContainer = taskContainer.querySelector(".text");
    if(locked == true){
        textContainer.contentEditable = "false";
    } else {
        textContainer.contentEditable = "true";
    }

    // handling the change of the content of the task.
    let taskId;
    textContainer.addEventListener("focus", function (){
        taskId = textContainer.parentNode.children[0].textContent.trim().substring(1);
        console.log("in focus eventlistener", taskId);
    })
    textContainer.addEventListener("blur", function (){
        let changedText = textContainer.textContent.trim();
        let tasksArr = JSON.parse(localStorage.getItem("tasks")) || [];
        for(let i=0; i<tasksArr.length; i++) {
            // console.log("id is", tasksArr[i].id);
            if(tasksArr[i].id == taskId) {
                tasksArr[i].value = changedText;
                localStorage.setItem("tasks", JSON.stringify(tasksArr));
                break;
            }
        }
    })
    // console.log(taskContainer);
    // console.log(mainContainer.children.length);
    // when we have created task it will attach the eventListener to the task 
    // and we do not have add event listener expllicity.
    // as the event listener is inside the function but the event listener 
    // is already attached to the task_header and can be used easily
    // outside this function.
    let taskHeader = taskContainer.querySelector(".task_header");
    // this event listener will be changing the colors of the task
    taskHeader.addEventListener("click", function (e){
        // console.log(taskHeader.classList);
        // taskHeader.classList -> gives the classes applied on the taskHeader
        let cColor = taskHeader.classList[1];
        // console.log(cColor);
        let idx = colors.indexOf(cColor);
        let nextIndex = (idx+1)%4;
        let nextColor = colors[nextIndex];
        taskHeader.classList.remove(cColor);
        taskHeader.classList.add(nextColor);
        let taskId = taskHeader.parentNode.querySelector(".task_container h3").textContent.trim().substring(1);
        let tasksArr = JSON.parse(localStorage.getItem("tasks")) || [];
        for(let i=0; i<tasksArr.length; i++) {
            // console.log("id is", tasksArr[i].id);
            if(tasksArr[i].id == taskId) {
                tasksArr[i].color = nextColor;
                localStorage.setItem("tasks", JSON.stringify(tasksArr));
                break;
            }
        }
        // console.log(taskHeader.style.backgroundColor);
    })

    // this event listener will be fired when deleting tasks
    taskContainer.addEventListener("click", function (e){
        if(multiply == true){
            // removing from the html file
            // taskContainer.remove();
            // removing from the local Storage
            // let tasksArr = JSON.parse(localStorage.getItem("tasks"));
            let taskId = taskContainer.querySelector(".task_container h3").textContent.trim().substring(1);
            // console.log(taskId);
            
            let tasksArr = JSON.parse(localStorage.getItem("tasks")) || [];
            for(let i=0; i<tasksArr.length; i++) {
                if(tasksArr[i].id == taskId){
                    tasksArr = JSON.parse(localStorage.getItem("tasks"))
                    tasksArr.splice(i, 1);
                    // console.log("deleting item", taskId);
                    localStorage.setItem("tasks", JSON.stringify(tasksArr));
                    displayTasks(tasksArr);
                    break;
                }
            }
        }
    })
}

// helper function to display tasks
// this function is used to refresh the tasks when a task is deleted.
function displayTasks(tasksArr){
    // setting the html of page to empty.
    mainContainer.innerHTML = "";
    // populating the html again.
    for(let i=0; i<tasksArr.length; i++) {
        let id = tasksArr[i].id;
        let value = tasksArr[i].value;
        let color = tasksArr[i].color;
        createTask(id, value, false, color);
    }
}

// event listener to handle the opening of modal on click of + sign.
addContainer.addEventListener("click", function (){
    modal.style.display = "flex";
})

// this eventListener will chose the color while creating the task.
let choosedColor = "black";
colorChooser.addEventListener("click", function (e){
    // console.log("clicked on color chooser");
    // console.log(e.target)
    let element = e.target;
    if(element != colorChooser){
        // deselect the already choosen one -> default -> black
        
        for(let i = 0; i < allColorChooser.length; i++) {
            allColorChooser[i].classList.remove("selected");
        }
        // select the choosed one
        element.classList.add("selected");
        choosedColor = element.classList[1];
        // for(let i = 0; i < allColorChooser.length; i++) {
        //     if(allColorChooser[i].classList[1] == choosedColor ){
        //         allColorChooser[i].classList.add("selected");
        //     }
        // }
    }
    // element.classList.remove("selected");
    // allColorChooser[0].classList.add("selected");
    // choosedColor = "black";
})

// eventListener for taking input
input.addEventListener("keydown", function(e){
    // console.log(e);
    // this will take care if input is empty.
    if(input.value && input.value == "\n"){
        input.value = "";
    } else if(e.code == "Enter" && input.value){
        console.log("task value", input.value);
        let id = uid();
        // true is passed as flag as we are creating the task.
        createTask(id, input.value, true, choosedColor);
        input.value = "";
        modal.style.display = "none";
        // when the task is created removing the previous selected priority and setting it back to black.
        for(let i = 0; i < allColorChooser.length; i++) {
            allColorChooser[i].classList.remove("selected");
        }
        allColorChooser[3].classList.add("selected");
        choosedColor = "black";
    }
});

// // here we are attaching eventListener to all teh elements.
// // we can use event bubbling to modify the code.
// let colorBtns = document.querySelectorAll(".color");
// for(let i=0; i<colorBtns.length; i++){
//     // adding eventListener to all the color btns.
//     colorBtns[i].addEventListener("click", function (){
//         let filterColor = colorBtns[i].classList[1];
//         filterCards(filterColor);
//     })
// }

// this event is fired while filtering tasks according to colors.
let colorContainer = document.querySelector(".color-group_container");
colorContainer.addEventListener("click", function(e){
    let ele = e.target;
    if(ele != colorContainer){
        let filterColor = ele.classList[1];
        filterCards(filterColor);
    }
})
// this is the helper function to filter tasks on the basis of colors.
function filterCards(filterColor){
    let allTasksCards = document.querySelectorAll(".task_container");
    if(cFilter != filterColor){
        // show accordingly and update the cFilter
        for(let i=0; i<allTasksCards.length; i++){
            let taskHeader = allTasksCards[i].querySelector(".task_header");
            let taskColor = taskHeader.classList[1];
            if(taskColor == filterColor){
                allTasksCards[i].style.display = "block";
            } else {
                allTasksCards[i].style.display = "none";
            }
        }
        cFilter = filterColor;
    } else {
        // show all
        for(let i=0; i<allTasksCards.length; i++){
            allTasksCards[i].style.display = "block";
        }
        cFilter = "";
    }
}

// this event listener handles the activation and deactivation of the delete button.
multiplyContainer.addEventListener("click", function (e){
    if(multiply == true){
        multiply = false;
        console.log("multiply unclicked");
        multiplyContainer.classList.remove("active");
    } else {
        multiply = true;
        console.log("multiply clicked");
        multiplyContainer.classList.add("active");
    }
})

// this event listener handles the locking of the tasks
lockContainer.addEventListener("click", function (e){
    locked = true;
    console.log("lock clicked");
    unlockContainer.classList.remove("active");
    lockContainer.classList.add("active");
    let allTasks = document.querySelectorAll(".task_main-container>div");
    for(let i=0; i<allTasks.length; i++){
        allTasks[i].contentEditable = "false";
    }
})

// this event listener handles the unlocking of the tasks
unlockContainer.addEventListener("click", function (e){
    locked = false;
    console.log("unlock clicked");
    lockContainer.classList.remove("active");
    unlockContainer.classList.add("active");
    let allTasks = document.querySelectorAll(".task_main-container>div");
    for(let i=0; i<allTasks.length; i++){
        allTasks[i].contentEditable = "true";
    }
})

// localStorage.clear();