import { Task } from "./task";

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

export default Column;
