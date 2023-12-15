import { Plugin } from 'obsidian';
import { Gantt } from 'frappe-gantt';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		//@ts-ignore
		window.renderGanttGraph = (container: HTMLElement) => {
			createSvg("svg", {
				attr: {
					id: "gantt",
				},
				parent: container
			})
			const tasks = [
				{
					id: 'Task 1',
					name: 'Redesign website',
					start: '2023-12-01',
					end: '2023-12-31',
					progress: 20
				},
				{
					id: 'Task 2',
					name: 'Redesign website2',
					start: '2023-10-01',
					end: '2023-11-31',
					progress: 20
				},
				{
					id: 'Task 3',
					name: 'Redesign website3',
					start: '2023-11-01',
					end: '2023-12-31',
					progress: 20
				}
			]
			new Gantt("#gantt", tasks);
		}

	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
