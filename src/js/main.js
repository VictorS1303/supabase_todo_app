import { supabase } from './supabase.js'

// DOM Elements
const addTodoFormDialog = document.getElementById('add_todo_form_dialog')
const openAddTodoFormBtn = document.getElementById('open_add_todo_form_btn')
const addTodoInputForm = document.getElementById('add_todo_input_form')
const submitAddTodoBtn = document.getElementById('submit_add_todo_btn')
const updateTodoFormDialog = document.getElementById('update_todo_form_dialog')
const updateTodoInputForm = document.getElementById('update_todo_input_form')
const updateTodoInput = document.getElementById('update_todo_input')
const submitUpdateTodoBtn = document.getElementById('submit_update_todo_btn')
const todoListSection = document.getElementById('todo_list_section')
const todoListContainer = document.getElementById('todo_list_container')
const actionMessageContainer = document.getElementById('action_messages_container')
const actionMessage = document.getElementById('action_message_text')
const actionMessageIcon = document.getElementById('action_message_icon')


// EVENT LISTENERS //
document.addEventListener('DOMContentLoaded', fetchTodos())
openAddTodoFormBtn.addEventListener('click', openAddTodoFormDialog)
submitAddTodoBtn.addEventListener('click', (e) => submitAddTodoForm(e))
updateTodoInputForm.addEventListener('submit', (e) => submitUpdateTodoForm(e))
todoListContainer.addEventListener('click', (e) => determineTodoAction(e))



// Add Todo Form Dialog
function openAddTodoFormDialog()
{
    addTodoFormDialog.showModal()
}

function closeAddTodoFormDialog()
{
    addTodoFormDialog.close()
}

function closeUpdateTodoFormDialog()
{
    updateTodoFormDialog.close()
}


// --- Todo Form Submission Handlers ---
// Submit Add Todo Form
function submitAddTodoForm(e)
{
    e.preventDefault()
    createTodo()
}

// Submit Update Todo Form
function submitUpdateTodoForm(e)
{
    e.preventDefault()
    updateTodoData(e)
    closeUpdateTodoFormDialog()
    updateTodoFormDialog.close()
}





// Determine Todo Action (Complete, Update, Delete)
let currentTodoItem
function determineTodoAction(e)
{
    if (e.target.matches('.complete-todo-btn')) {
        completeTodo(e)
    }
    else if (e.target.matches('.update-todo-btn')) {
        currentTodoItem = e.target.closest('.todo-list-item')
        const currentText = currentTodoItem.querySelector('.todo-text').textContent
        updateTodoInput.value = currentText
        updateTodoFormDialog.showModal()
    }
    else if (e.target.matches('.delete-todo-btn')) {
        deleteTodo(e)
    }
}

// Clear all classes from complete message
function clearCompleteMessageClasses()
{
    actionMessageContainer.classList.remove
        (
            'completed-message',
            'updated-message',
            'deleted-message',
            'active'
        )
}

// Complete Todo
function completeTodo(e)
{
    const completeTodoItem = e.target.closest('.todo-list-item').firstElementChild.classList.toggle('completed')
    completeTodoItem ? showCompletedMessage() : null
}

function showCompletedMessage()
{
    clearCompleteMessageClasses()
    actionMessageContainer.classList.add('completed-message', 'active')
    actionMessage.textContent = 'Todo completed!'

    setTimeout(() =>
    {
        actionMessageContainer.classList.remove('active')
    }, 2000)
}

// Update Todo
function updateTodoData()
{
    // Create a FormData object to access the form data
    const formData = new FormData(updateTodoInputForm)

    // Get the value of the input field with the name "update_todo_input"
    const updateInputData = formData.get('update_todo_input')

    if (currentTodoItem) {
        // Update the todo text
        currentTodoItem.querySelector('.todo-text').textContent = updateInputData

        // Remove the 'completed' class if it exists
        currentTodoItem.querySelector('.todo-text').classList.remove('completed');

        // Show the updated message
        showUpdatedMessage()
    }
}
function showUpdatedMessage()
{
    clearCompleteMessageClasses()

    actionMessageContainer.classList.add('updated-message', 'active')
    actionMessage.textContent = 'Todo updated!'

    setTimeout(() =>
    {
        actionMessageContainer.classList.remove('active')
    }, 2000)
}


// Delete Todo
function deleteTodo(e)
{
    const isWantingToDeleteTodo = confirm('Do you want to delete the todo?')

    if (isWantingToDeleteTodo && confirm('Are you really sure you want to delete the todo? It cannot be undone!')) {
        e.target.closest('.todo-list-item').remove()
        showDeletedMessage()
    }
}

function showDeletedMessage()
{
    clearCompleteMessageClasses()

    actionMessageContainer.classList.add('deleted-message', 'active')
    actionMessage.textContent = 'Todo deleted!'

    setTimeout(() =>
    {
        actionMessageContainer.classList.remove('active')
    }, 2000)
}


// Fetch todos from Supabase
async function fetchTodos()
{
    try
    {
        const { data: todos, error } = await supabase    
            .from('todo_app')
            .select('todo_text')
        
        if(error)
        {
            console.log('Error fetching todos: ', error.message)
            return
        }

        // Clear existing todos
        todoListContainer.innerHTML = ''

        todos.forEach((todo) =>
        {
            createTodoListItem(todo)
            console.log(todo)
        })
    }
    catch (error)
    {
        console.log('Unexpected error: ', error.message)
    }
}

// --- Todo Item Creation ---
// Create Todo List Item
function createTodoListItem(todo)
{
    const todoLI = createTodoLI('todo-list-item', todo)
    const todoSpan = createTodoSpan('todo-text', todo)
    const todoControlButtonsContainer = createTodoControlButtonsContainer('container todo-list-controls-buttons-container', todo)
    const completeTodoBtn = createCompleteTodoControlButton()
    const completeTodoBtnIcon = createCompleteTodoControlButtonIcon()
    const updateTodoBtn = createUpdateTodoControlButton()
    const updateTodoBtnIcon = createUpdateTodoControlButtonIcon()
    const deleteTodoBtn = createDeleteTodoControlButton()
    const deleteTodoBtnIcon = createDeleteTodoControlButtonIcon()

    // Appending from outermost parent inwards
    todoListSection.appendChild(todoListContainer)
    todoListContainer.appendChild(todoLI)
    todoLI.append(todoSpan, todoControlButtonsContainer)
    todoControlButtonsContainer.append(completeTodoBtn, updateTodoBtn, deleteTodoBtn)

    completeTodoBtn.appendChild(completeTodoBtnIcon)
    updateTodoBtn.appendChild(updateTodoBtnIcon)
    deleteTodoBtn.appendChild(deleteTodoBtnIcon)
}

// Create Todo LI
function createTodoLI(todoLIClasses, todo)
{
    const todoLI = document.createElement('li')
    todoLI.classList = todoLIClasses
    todoListContainer.dataset.todoId = todo.id
    return todoLI
}

// Create Todo Text
function createTodoSpan(todoSpanClasses, todo)
{
    const todoTextSpan = document.createElement('span')
    todoTextSpan.textContent = todo.todo_text
    todoTextSpan.classList = todoSpanClasses
    return todoTextSpan
}

// Create Todo Control Buttons Container
function createTodoControlButtonsContainer(todoControlButtonsContainerClasses)
{
    const todoControlButtonsContainer = document.createElement('div')
    todoControlButtonsContainer.classList = todoControlButtonsContainerClasses
    return todoControlButtonsContainer
}


// --- Todo Control Buttons ---
// Create Control Button
function createTodoControlButton(todoControlButtonClasses)
{
    const todoControlButton = document.createElement('button')
    todoControlButton.classList = todoControlButtonClasses
    return todoControlButton
}

// Create Control Button Icon
function createControlTodoButtonIcon(controlTodoButtonIconClasses)
{
    const controlTodoButtonIcon = document.createElement('i')
    controlTodoButtonIcon.classList = controlTodoButtonIconClasses
    return controlTodoButtonIcon
}

// Complete Todo Button
function createCompleteTodoControlButton()
{
    const completeTodoBtn = createTodoControlButton('complete-todo-btn')
    return completeTodoBtn
}

// Complete Todo Button Icon
function createCompleteTodoControlButtonIcon()
{
    const completeTodoControlButtonIcon = createControlTodoButtonIcon('fa-solid fa-check')
    return completeTodoControlButtonIcon
}

// Update Todo Button
function createUpdateTodoControlButton()
{
    const updateTodoBtn = createTodoControlButton('update-todo-btn')
    return updateTodoBtn
}

// Update Todo Button Icon
function createUpdateTodoControlButtonIcon()
{
    const updateTodoControlButtonIcon = createControlTodoButtonIcon('fa-solid fa-pencil-alt')
    return updateTodoControlButtonIcon
}

// Delete Todo Button
function createDeleteTodoControlButton()
{
    const deleteTodoBtn = createTodoControlButton('delete-todo-btn')
    return deleteTodoBtn
}

// Delete Todo Button Icon
function createDeleteTodoControlButtonIcon()
{
    const deleteTodoControlButtonIcon = createControlTodoButtonIcon('fa-solid fa-trash-alt')
    return deleteTodoControlButtonIcon
}


// --- Utility Functions ---
// Get Form Data
function getFormData()
{
    const formData = new FormData(addTodoInputForm)
    const inputData = formData.get('add_todo_input')
    return inputData
}

// Create Todo
/*

*/ 
async function createTodo()
{
    const todoText = getFormData()

    if (todoText)
    {
        try
        {
            const { data, error } = await supabase
                .from('todo_app')
                .insert([{todo_text: todoText}])

            if (error)
            {
                console.error('Error adding todo:', error.message)
                return
            }
            addTodoInputForm.reset()
        }
        catch (err)
        {
            console.error('Unexpected error:', err.message)
        }


        // createTodoListItem(todoText)
        
    }

    closeAddTodoFormDialog()
}
