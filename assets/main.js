(function() {
	const data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')) : {
	  monday: { todo: [], completed: [] },
	  tuesday: { todo: [], completed: [] },
	  wednesday: { todo: [], completed: [] },
	  thursday: { todo: [], completed: [] },
	  friday: { todo: [], completed: [] },
	  saturday: { todo: [], completed: [] },
	  sunday: { todo: [], completed: [] }
    };
	let windowWidth = $(window).width();
	let counter = 1;

	if(windowWidth <= 720) {
		$('.days-nav').toggleClass('slide-nav');
		$(".button-collapse").sideNav();
	}

	$(window).on('resize', function() {
		windowWidth = $(window).width();
		if(windowWidth >= 720) {
			$('.days-nav').css('transform', 'translateX(0)');
		} else {
			$('.days-nav').toggleClass('slide-nav');
			$(".button-collapse").sideNav();
		}
	});

	function updateData() {
		localStorage.setItem('todoList', JSON.stringify(data));
	}

	function showContent(){
		$('.loader-container').fadeOut('slow');
		$('.wrapper').fadeIn('slow');
	}

	function renderTodoList() {

		for (let i = 0; i <= 6; i++) {
			var day = $('.day')[i];
			var name = $(day).attr('id');
			var tasksTodo = data[name].todo.length;

			for (var j = 0; j < tasksTodo; j++) {
				var task = data[name].todo[j];
				var todoTask = `<li class="todo-list__task">
					<input type="checkbox" class="checkbox" id="${name}-task${j}">
					<label for="${name}-task${j}" class="task__label">${task}</label>
					<button type="button" class="remove-btn material-icons">delete</button>
				</li>`;

				$(day).find('.todo-list').append(todoTask);
			}
		}
	}

	function changeHash() {
		const href = $(this).attr('href');
		location.hash = href;
	}

	function addTask(e) {

		e.preventDefault();

		const day = $(this).closest('.day'),
			  dayName = $(this).closest('.day').attr('id'),
			  newTaskInput = day.find('.day__new-task'),
			  todoList = day.find('.todo-list'),
			  taskCounter = todoList.children().length + 1,
			  maxTasks = 10,
			  taskName = newTaskInput.val(),
			  todoTask = `<li class="todo-list__task">
							<input type="checkbox" class="checkbox" id="task${counter}">
							<label for="task${counter}" class="task__label">${taskName}</label>
							<button type="button" class="remove-btn material-icons">delete</button>
						</li>`;

		counter++;

		if (taskCounter > maxTasks) {
			$('.tasks-info').modal('open');
		} else if ($.trim(taskName) !== ''){
			$(todoList).append(todoTask);
			newTaskInput.val('');

			Materialize.toast('You added a new task', 2000);

			data[dayName].todo.push(taskName);
			updateData();
		}

	}

	function removeTask() {
		const dayName = $(this).closest('.day').attr('id'),
			  thisTask = $(this).parent();

		thisTask.fadeOut('slow', function() {
			thisTask.remove();
		});

        data[dayName].todo.splice(data[dayName].todo.indexOf($(this).prev().text()), 1);
        updateData();
	}

	function completeTask() {
		$(this).toggleClass('completed');
		const dayName = $(this).closest('.day').attr('id'),
			  taskName = $(this).find('.task__label').text();

		if ($(this).hasClass('completed')) {
			data[dayName].completed.push(taskName);
			data[dayName].todo.splice(data[dayName].todo.indexOf(taskName), 1);

		} else {
			data[dayName].completed.splice(data[dayName].todo.indexOf(taskName), 1);
			data[dayName].todo.push(taskName);
		}
		updateData();
	}

	renderTodoList();

	$('.info-modal').modal();
	$(window).on('load', showContent);
	$('.tabs .tab a').on('click', changeHash);
	$('.day__add-btn').on('click', addTask);
	$('.todo-list').on('click', '.remove-btn', removeTask);
	$('.todo-list').on('change', '.todo-list__task', completeTask);

})();
