import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { CreateTaskDto, UpdateTaskStatusDto } from "./task.dto.js";
import type { Task } from "./task.js";

@Injectable()
export class TasksService {
  // An in-memory store keeps the exercise small. Restarting the API resets it.
  private tasks: Task[] = [
    { id: "1", title: "Make the welcome page feel welcoming", description: "Try a clearer heading, more space, and a friendly colour palette.", status: "todo" },
    { id: "2", title: "Build a reusable task card", description: "Show a title, status badge, and a link to the task details.", status: "in-progress" },
    { id: "3", title: "Connect the frontend to the API", description: "Fetch the task list and handle loading and error states.", status: "done" },
  ];

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: string): Task {
    const task = this.tasks.find((item) => item.id === id);
    if (!task) throw new NotFoundException("Task not found");
    return task;
  }

  create(input: CreateTaskDto): Task {
    const task: Task = { id: randomUUID(), ...input, status: "todo" };
    this.tasks.unshift(task);
    return task;
  }

  updateStatus(id: string, input: UpdateTaskStatusDto): Task {
    const task = this.findOne(id);
    task.status = input.status;
    return task;
  }

  remove(id: string): void {
    this.findOne(id);
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
