console.log('js');

$(document).ready(function () {
    console.log('JQ');
    setupClickListeners()
    getTask();
});

function setupClickListeners() {
    $('#taskList').on('click', '.deleteBtn', deleteTask);
    $('#taskList').on('click', '.xfrBtn', completeTask);
    $('#addButton').on('click', addTask);
}

function addTask(){
    console.log('in addButton on click');
    // define what is being taken from the click.
    let taskInfo = {
        task: $('#taskIn').val(),
        completed: $('#completedIn').val()
    };
    // send the data over to the server.
    $.ajax({
        method: 'POST',
        url: '/todo',
        data: taskInfo
    }).then((res) => {
        console.log('POST /todo', res);

        // refresh the data.
        getTask();
    }).catch((err) => {
        console.log('POST /todo error', err);
        alert('POST /todo failed!');
    });
};
       

function getTask() {
    console.log('in getTask');

    // empty the current shown tasks for refresh.
    $('#taskList').empty();

    // ajax call to server to receive the new task list.
    $.ajax({
        method: 'GET',
        url: '/todo'
    }).then(function (response) {
        console.log('response from GET /todo is', response);

        // append the data to the display.
        for (task of response) {
            $('#taskList').append(`
        <tr data-id="${task.id}" data-completed="${task.completed}">
          <th>${task.task}</th>
          <th>${task.completed}</th>
          <th>
            ${buttonOrNoButton(task.completed)}
          </th>
          <th>
            <button class="deleteBtn">Delete Task</button>
          </th>
        </tr>
      `);
        }
    });
} // end getTask

function buttonOrNoButton(completed){
    // Determining if completed status is done or not and showing button.
    if (completed === true){
        return '';
    } else {
        return '<button class="xfrBtn">Completed?</button>'
    }
}

function deleteTask() {
    console.log('something');
};

function completeTask() {
    console.log('inside Complete Task');
    let tr = $(this).parents('tr');
    let id = tr.data('id');
    let completed = tr.data('completed');
    console.log(completed);
    console.log(id);
    $.ajax({
        method: 'PUT',
        url: `/todo/${id}`,
        data: {
            completed: false
        }
    }).then(function (response) {
        getTask();
        console.log('response from PUT /todo is', response);
    }).catch((err) => {
        console.log('PUT /todo error', err);
        alert('PUT /todo failed!');
    });
}
