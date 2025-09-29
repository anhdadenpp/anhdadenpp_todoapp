
import Task from '../models/Task.js';

export const getAllTasks = async (request, response) => {
    const { filter = "today" } = request.query;
    const now = new Date();
    let startDate;
    switch (filter) {
        case "today": {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 2025-08-24 00:00
            break;
        }
        case "week": {
            const mondayDate = now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
            startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
            break;
        }
        case "month": {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        }
        case "all":
        default: {
            startDate = null;
        }
    }
    
      const query = startDate ? { createdAt: { $gte: startDate } } : {};


    try {
        const result = await Task.aggregate([
            {
                $facet: {
                    tasks: [{ $sort: { createdAt: -1 } }],
                    activeCount: [{ $match: { status: 'active' } }, { $count: 'count' }],
                    completeCount: [{ $match: { status: 'complete' } }, { $count: 'count' }]
                }
            }
        ]);

        const tasks = result[0].tasks;
        const activeCount = result[0].activeCount[0]?.count || 0;
        const completeCount = result[0].completeCount[0]?.count || 0;

        response.status(200).json({ tasks, activeCount, completeCount });
    } catch (error) {
        response.status(500).json({ message: "Error fetching tasks" });
    }
};



export const createTask = async (request, response) => {
    const { title, status, completedAt } = request.body;

    const newTask = new Task({
        title,
        status,
        completedAt
    });

    try {
        await newTask.save();
        response.status(201).json(newTask);
    } catch (error) {
        response.status(500).json({ message: "Error creating task" });
    }
};

export const updateTask = async (request, response) => {
    const { id } = request.params;
    const { title, status, completedAt } = request.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, {
            title,
            status,
            completedAt
        }, { new: true });

        if (!updatedTask) {
            return response.status(404).json({ message: "Task not found" });
        }

        response.status(200).json(updatedTask);
    } catch (error) {
        response.status(500).json({ message: "Error updating task" });
    }
};

export const deleteTask = async (request, response) => {
    const { id } = request.params;

    try {
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return response.status(404).json({ message: "Task not found" });
        }

        response.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        response.status(500).json({ message: "Error deleting task" });
    }
};