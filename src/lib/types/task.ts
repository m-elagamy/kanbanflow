type Task = {
  id: string;
  columnId: string;
  title: string;
  description: string | undefined;
  priority: string;
  tags: string[];
};

export default Task;
