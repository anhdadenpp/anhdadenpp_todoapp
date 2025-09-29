import React from 'react'
import Header from '../components/Header'
import AddTask from '@/components/AddTask'
import TaskList from '@/components/TaskList'
import Footer from '@/components/Footer'
import StatsAndFilters from '@/components/StatsAndFilters'
import TaskListPagination from '@/components/TaskListPagination'
import DateTimeFilter from '@/components/DateTimeFilter'
import TaskCard from '@/components/TaskCard'
import TaskEmptyState from '@/components/TaskEmptyState'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { visibleTaskLimit } from '@/lib/data'

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);

   useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/tasks?filter=${dateQuery}`);
      setTaskBuffer(response.data.tasks);
      setActiveTaskCount(response.data.activeCount);
      setCompleteTaskCount(response.data.completeCount);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks. Please try again later.');
    }
  };
  // gọi lại hàm fetchTasks khi có thay đổi trong taskBuffer
  const handleTaskChanged = () => {
    fetchTasks();
  }
   const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // hàm này được truyền vào AddTask và TaskCard để gọi lại fetchTasks khi có thay đổi
  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "complete";
      default:
        return true;
    }
  });

  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );
  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

  if (visibleTasks.length === 0) {
    handlePrev();
  }

  return (
    <div className="min-h-screen w-full relative">
      {/* Aurora Dream Soft Harmony */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
       radial-gradient(ellipse 80% 60% at 60% 20%, rgba(175, 109, 255, 0.50), transparent 65%),
        radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.45), transparent 65%),
        radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.43), transparent 62%),
        radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.48), transparent 68%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
        }}
      />
      {/* Your content goes here */}
      <div className="container pt-8 mx-auto relative z-10 ">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">

          {/* HEADER */}
          <Header />

          {/* ADD TASK */}
          <AddTask handleNewTaskAdded={handleTaskChanged} />

          {/* STATS AND FILTERS */}
          <StatsAndFilters
            filter={filter}
            setFilter={setFilter}
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />

          {/* TASK LIST */}
          <TaskList filteredTasks={visibleTasks} filter={filter}  handleTaskChanged={handleTaskChanged} />

          {/* TASK LIST PAGINATION & DATE TIME FILTER */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination 
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages} />
            <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
          </div>

          {/* FOOTER */}
          <Footer
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />
        </div>
      </div>

    </div>
  )
}

export default HomePage