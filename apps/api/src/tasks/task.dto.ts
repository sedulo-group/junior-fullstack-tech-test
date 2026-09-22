import { Transform } from "class-transformer";
import { IsIn, IsString, Length, MaxLength } from "class-validator";
import {
  taskStatuses,
  type CreateTaskInput,
  type TaskStatus,
  type UpdateTaskStatusInput,
} from "./task.js";

export class CreateTaskDto implements CreateTaskInput {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @Length(1, 80)
  title!: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MaxLength(500)
  description!: string;
}

export class UpdateTaskStatusDto implements UpdateTaskStatusInput {
  @IsIn(taskStatuses)
  status!: TaskStatus;
}
