const axios = require('axios');
const obj = require('object-path');
const cron = require('cron-parser');

class Task {
	host;
	token;
	company_id;

	async run(host, company_id, token) {
		this.host = host;
		this.company_id = company_id;
		this.token = token;

		try {
			// reset dead tasks
			await this.resetDeadTasks();

			// get unscheduled tasks and schedule them
			await this.schedule();

			// get scheduled task and run them
			await this.execute();
		} catch (ex) {
			console.log(ex);
		}
	}

	async resetDeadTasks() {
		// if the task was running for more than 1 hour then reset
		let query = [
			// is running for more than 1 hour than consider it as a dead task
			{
				_updated: {
					$lte: new Date(new Date().getTime() - 60 * 60 * 1000),
				},
			},
			{ status: 'Running' },
		];
		let url = `${this.host}/api/sync/task?$and$=${JSON.stringify(query)}`;
		let deadTasks = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${this.token}`,
				company_id: this.company_id,
			},
		});
		deadTasks = deadTasks.data;

		for (let task of obj.get(deadTasks, 'data', [])) {
			try {
				await axios.post(
					`${this.host}/api/sync/task`,
					{
						_id: task._id,
						next_run_date: null,
						status: null,
						_updated: new Date(),
					},
					{
						headers: {
							Authorization: `Bearer ${this.token}`,
							company_id: this.company_id,
						},
					}
				);
				console.log(`reset task: ${task.name}`);
			} catch (e) {
				console.log(e);
			}
		}
	}

	async schedule() {
		let url = `${this.host}/api/sync/task?next_run_date$=null`;
		let tasks = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${this.token}`,
				company_id: this.company_id,
			},
		});
		tasks = tasks.data;

		//
		for (let task of obj.get(tasks, 'data', [])) {
			if (task.cron) {
				// find next run
				let interval = cron.parseExpression(task.cron);
				task.next_run_date = new Date(interval.next().toString());

				try {
					await axios.post(
						`${this.host}/api/sync/task`,
						{
							_id: task._id,
							next_run_date: task.next_run_date,
							status: 'Scheduled',
							_updated: new Date(),
						},
						{
							headers: {
								Authorization: `Bearer ${this.token}`,
								company_id: this.company_id,
							},
						}
					);
					console.log(`scheduled task: ${task.name} - ${task.next_run_date}`);
				} catch (e) {
					console.log(e);
				}
			}
		}
	}

	async execute() {
		// if the task was running for more than 1 hour then reset
		let url = `${this.host}/api/sync/task?size=100&_sort=next_run_date&$and$=[{"next_run_date":{"$lte": new Date()}},{"$or":[{"status":{"$ne":"Running"}},{"status":{"$ne":"Waiting"}}]}]`;
		let tasks = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${this.token}`,
				company_id: this.company_id,
			},
		});
		tasks = tasks.data;

		// set task to as Waiting
		for (let task of obj.get(tasks, 'data', [])) {
			// initiate the task
			try {
				await axios.post(
					`${this.host}/api/sync/task`,
					{
						_id: task._id,
						status: 'Waiting',
						_updated: new Date(),
					},
					{
						headers: {
							Authorization: `Bearer ${this.token}`,
							company_id: this.company_id,
						},
					}
				);
				console.log(`initiate task: ${task.name} - ${task.next_run_date}`);
			} catch (e) {
				console.log(e);
			}
		}

		// pick first task and run it
		for (let task of obj.get(tasks, 'data', [])) {
			let taskInstanceId = null;
			try {
				////////////////////////////////////////////////
				// initiate the task
				////////////////////////////////////////////////
				await axios.post(
					`${this.host}/api/sync/task`,
					{
						_id: task._id,
						status: 'Running',
						_updated: new Date(),
					},
					{
						headers: {
							Authorization: `Bearer ${this.token}`,
							company_id: this.company_id,
						},
					}
				);
				console.log(`starting task: ${task.name} - ${task.next_run_date}`);

				////////////////////////////////////////////////
				// create a task instance
				////////////////////////////////////////////////
				taskInstanceId = await axios.post(
					`${this.host}/api/sync/task.instance`,
					{
						task_id: `${task._id}`,
						started: new Date(),
					},
					{
						headers: {
							Authorization: `Bearer ${this.token}`,
							company_id: this.company_id,
						},
					}
        );
        taskInstanceId = taskInstanceId.data._id;
				console.log(`creating task instance: ${task.name} - ${taskInstanceId}`);


				////////////////////////////////////////////////
				// run task
				////////////////////////////////////////////////
				await this.executeActions(task, taskInstanceId);

				////////////////////////////////////////////////
				// finish a task instance
				////////////////////////////////////////////////
				await axios.post(
					`${this.host}/api/sync/task.instance`,
					{
						_id: taskInstanceId,
						ended: new Date(),
						status: 'Success',
					},
					{
						headers: {
							Authorization: `Bearer ${this.token}`,
							company_id: this.company_id,
						},
					}
				);
				console.log(`finish task instance: ${task.name} - ${taskInstanceId}`);

				////////////////////////////////////////////////
				// finishing task
				////////////////////////////////////////////////
				await axios.post(
					`${this.host}/api/sync/task`,
					{
						_id: task._id,
						status: 'Success',
						_updated: new Date(),
						next_run_date: null,
					},
					{
						headers: {
							Authorization: `Bearer ${this.token}`,
							company_id: this.company_id,
						},
					}
				);
				console.log(`finishing task: ${task.name} - ${task.next_run_date}`);
			} catch (e) {
        ////////////////////////////////////////////////
				// finish a task instance
				////////////////////////////////////////////////
				await axios.post(
					`${this.host}/api/sync/task.instance`,
					{
						_id: taskInstanceId,
						ended: new Date(),
						status: 'Failed',
					},
					{
						headers: {
							Authorization: `Bearer ${this.token}`,
							company_id: this.company_id,
						},
					}
				);
        console.log(`finish task instance: ${task.name} - ${taskInstanceId}`);

				////////////////////////////////////////////////
				// task error
				////////////////////////////////////////////////
				await axios.post(
					`${this.host}/api/sync/task`,
					{
						_id: task._id,
						status: 'Failed',
						_updated: new Date(),
						next_run_date: null,
					},
					{
						headers: {
							Authorization: `Bearer ${this.token}`,
							company_id: this.company_id,
						},
					}
				);
				console.log(`error task: ${task.name}`);
				console.log(e);
			}
		}
	}

	async executeActions(task, taskInstanceId) {

    // get list of actions
		let url = `${this.host}/api/sync/task.action?size=100&_sort=order$task_id=${task._id}`;
		let actions = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${this.token}`,
				company_id: this.company_id,
			},
		});
		actions = actions.data;

		// go through each action
		let context = {};
		for (let action of obj.get(actions, 'data', [])) {
			if (action.enabled != false) {
				await this.log(task, taskInstanceId, action, `start ${action.name}`);
				try {
					// perform the task
					(await eval(action.script)).catch(async (e) => {
            await this.log(task, taskInstanceId, action, `${e.stack}`);
          });
					if (context.stop == true) {
						await this.log(task, taskInstanceId, action, `== Stop Processing ==`);
						break;
					}
        } catch (e) {}
        await this.log(task, taskInstanceId, action, `finish ${action.name}`);
			}
		}
  }

  async log(task, taskInstanceId, action, msg) {
    await axios.post(
      `${this.host}/api/sync/task.log`,
      {
        _created: new Date(),
        task_id: `${task ? task._id : ''}`,
        task_instance_id: `${taskInstanceId}`,
        action_id: `${action ? action._id : ''}`,
        action: action ? action.name : '',
        msg: `${msg}`,
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          company_id: this.company_id,
        },
      }
    );
  }

}

module.exports = new Task();
