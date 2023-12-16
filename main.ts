import * as Handlebars from "handlebars";
import { Plugin, TFile } from "obsidian";
import { DataSet, Timeline, TimelineOptions } from "vis-timeline/standalone";

export default class GanttChartPlugin extends Plugin {
	async onload() {
		//@ts-ignore
		window.renderGanttGraph = (
			container: HTMLElement,
			tasks,
			timelineOptions
		) => {
			console.log(timelineOptions);
			const chartContainer = createDiv({
				cls: "gantt-chart-container",
				parent: container,
			});

			const groups = new DataSet(
				Array.from(
					new Set(tasks.filter((t) => t.group).map((t) => t.group))
				).map((t, idx) => {
					return {
						id: t,
						content: t,
						className: idx % 2 == 0 ? "even-group" : undefined,
					};
				})
			);

			const items = new DataSet([...tasks]);
			const clonedTimelineOptions = { ...timelineOptions };
			clonedTimelineOptions.template = 	timelineOptions.template ? Handlebars.compile(timelineOptions.template) : null;
			// Configuration for the Timeline
			const chartBeginAt = new Date();
			chartBeginAt.setDate(chartBeginAt.getDate() - 20);
			const chartEndAt = new Date();
			chartEndAt.setDate(chartEndAt.getDate() + 3);
			const options: TimelineOptions = {
				timeAxis: { scale: "day", step: 1 },
				start: chartBeginAt,
				end: chartEndAt,
				groupHeightMode: "fixed",
				zoomable: false,
				orientation: {
					axis: "top",
					item: "top",
				},
				...clonedTimelineOptions,
			};

			// Create a Timeline
			const timeline = new Timeline(chartContainer, items, options);
			timeline.setGroups(groups);
			timeline.on("click", (properties) => {
				if (properties.item) {
					const clickedItem = tasks.find(
						(t) => t.id === properties.item
					);
					if (clickedItem.path) {
						const tFile = this.app.vault.getAbstractFileByPath(
							clickedItem.path
						);
						if (tFile instanceof TFile) {
							this.app.workspace.getLeaf().openFile(tFile);
						}
					}
				}
			});
		};
	}

	onunload() {}
}
