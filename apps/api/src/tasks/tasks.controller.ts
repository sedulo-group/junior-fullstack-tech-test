import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { CreateTaskDto, UpdateTaskStatusDto } from "./task.dto.js";
import { TasksService } from "./tasks.service.js";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  findAll() {
    return this.tasks.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tasks.findOne(id);
  }

  @Post()
  create(@Body() input: CreateTaskDto) {
    return this.tasks.create(input);
  }

  @Patch(":id")
  updateStatus(@Param("id") id: string, @Body() input: UpdateTaskStatusDto) {
    return this.tasks.updateStatus(id, input);
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id") id: string) {
    this.tasks.remove(id);
  }
}
