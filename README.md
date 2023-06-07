
# Project Title

Task Management API uses Node.js and express that allows users to create, manage, and track tasks

## Installation

Install Task Manager API with npm

```bash
  npm install
```

After that following command would start the project

```bash
  npm run start
```


## Features

1. User Authentication: User can signup, login and update his profile.
User have following endpoints

post - user/signup     - helps to signup
post - user/login      - helps to login user
post - user/logout     - logs out user from current device
post - user/logoutall  - since we keep track of device's logs. User can logout from all devices at once
get  - user/me         - user can read his personal info
patch- user/me         - user can modify personal info


2. Task Management: Users can create, update, and delete tasks. Each task have a title, description, due date, and status (e.g., "in progress," "completed,"
"pending"). There are following endpoints available

posts - /tasks  -   creating a task
get   - /tasks/created  - reading tasks created by existing user
get   - /tasks/assigned - reading tasks assigned to current user
patch - /tasks/:id      - updating a tasks by it's id
delete- /tasks/:id      - deleting a task if it's created by current user
get   - /tasks?         - filtering tasks by "duedate", "task-status", "assignedto". for example.   /tasks?duedate=2023-06-17&status=pending&assignedto=mahin2@gmail.com


3. Task Assignments: Allows users to assign tasks to other users by "assignedTo" property while creating tasks and track the assignment by "/tasks/created" endpoint.

4. Task Filtering and Sorting: It is possible to filter and sort tasks based on
various parameters, such as due date, status, assigned user, etc. For example using "/tasks" endpoint, user can filer, for example : /tasks?duedate=2023-06-17&status=pending&assignedto=mahin1@gmail.com

5. Notifications: Notifications to alert users of task assignments, updates, or
approaching due dates will be sent via mail. While creating or changing status of a task, user will be notified via mail
## Running Tests

To run tests on Postman, one can use the following link : 

https://planetary-astronaut-629774.postman.co/workspace/My-Workspace~82d5e56b-e5fa-44e8-8fcf-92b68172711a/collection/20159893-5ed4e64d-4308-4807-8d6a-769c32eefb9e?action=share&creator=20159893

