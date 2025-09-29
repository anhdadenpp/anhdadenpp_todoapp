import React from "react";

const Footer = ({ completedTasksCount = 0, activeTasksCount = 0}) => {
  return (
    <>
      {completedTasksCount + activeTasksCount > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {completedTasksCount > 0 && (
              <>
                🎉 Congratulation! You have completed {completedTasksCount} tasks
                {activeTasksCount > 0 &&
                  `, and there are ${activeTasksCount} tasks left. Keep it up!`}
              </>
            )}

            {completedTasksCount === 0 && activeTasksCount > 0 && (
              <>Let's start working on the {activeTasksCount} tasks!</>
            )}
          </p>
        </div>
      )}
    </>
  );
};

export default Footer;