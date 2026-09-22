import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateTaskDto, UpdateTaskStatusDto } from "./task.dto.js";
import type { Task } from "./task.js";
import { TasksService } from "./tasks.service.js";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  findAll(): Task[] {
    return this.tasks.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Task {
    return this.tasks.findOne(id);
  }

  @Post()
  create(@Body() input: CreateTaskDto): Task {
    return this.tasks.create(input);
  }

  @Patch(":id")
  updateStatus(
    @Param("id") id: string,
    @Body() input: UpdateTaskStatusDto,
  ): Task {
    return this.tasks.updateStatus(id, input);
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id") id: string): void {
    this.tasks.remove(id);
  }
}
