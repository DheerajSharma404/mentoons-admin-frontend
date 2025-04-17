import { FcStatistics } from "react-icons/fc";
import { INavLinkUser, ITaskCards, IUserDashboardCards } from "../types/index"
import { BiTask } from "react-icons/bi";
export const taskConst: ITaskCards[] = [
    {
      id: '1',
      priority: 'Low',
      task:'Task 1',
      projectname:'Project 1',
      status:'To Do',
      dueDate:'15 september',
      assignee:['John Doe', 'Jane Doe'],
      totalMembers: 10,
    },
    {
      id: '2',
      priority: 'Medium',
      task:'Task 2',
      projectname:'Project 2',
      status:'In Progress',
      dueDate:'16 september',
      assignee:['John Doe', 'Jane Doe'],
      totalMembers: 10,
    },
    {
      id: '3',
      priority: 'High',
      task:'Task 3',
      projectname:'Project 3',
      status:'Done',
      dueDate:'17 september',
      assignee:['John Doe', 'Jane Doe'],
      totalMembers: 10,
    },
    {
      id: '4',
      priority: 'Low',
      task:'Task 4',
      projectname:'Project 4',
      status:'To Do',
      dueDate:'18 september',
      assignee:['John Doe', 'Jane Doe'],
      totalMembers: 10,
    },
    {
      id: '5',
      priority: 'Medium',
      task:'Task 5',
      projectname:'Project 5',
      status:'In Progress',
      dueDate:'19 september',
      assignee:['John Doe', 'Jane Doe'],
      totalMembers: 10,
    },
    {
      id: '6',
      priority: 'High',
      task:'Task 6',
      projectname:'Project 6',
      status:'Done',
      dueDate:'20 september',
      assignee:['John Doe', 'Jane Doe'],
      totalMembers: 10,
    },
    {
      id: '7',
      priority: 'Low',
      task:'Task 7',
      projectname:'Project 7',
      status:'To Do',
      dueDate:'21 september',
      assignee:['John Doe', 'Jane Doe'],
      totalMembers: 10,
    },
    {
      id: '8',
      priority: 'Medium',
      task:'Task 8',
      projectname:'Project 8',
      status:'In Progress',
      dueDate:'22 september',
      assignee:['John Doe', 'Jane Doe'],
      totalMembers: 10,
    },  
    {
      id: '9',
      priority: 'High',
      task:'Task 9',
      projectname:'Project 9',
      status:'Done',
      dueDate:'23 september',
      assignee:['John Doe', 'Jane Doe'],
      totalMembers: 10,
    },
    {
      id: '10',
      priority: 'Low',
      task:'Task 10',
      projectname:'Project 10',
      status:'To Do',
      dueDate:'24 september',
      assignee:['John Doe', 'Jane Doe'],
      totalMembers: 10,
    },
]


export const navLinkUserConst : INavLinkUser[] = [
    {
        name: 'Dashboard',
        path: '/taskDashboard',
    },
    {
        name: 'Tasks',
        path: '/tasks',
    },
    {
        name: 'Tasks Statistics',
        path: '/taskStatistics',
    },
    {
        name: 'Calender',
        path: '/calender',
    },
    
]

export const userDashboardCardsConst : IUserDashboardCards[] = [
    {
        title: 'Task Assigned',
        score: 89,
        icon: BiTask,
        totalScore: 100,
    },
    {
        title: 'Task Completion',
        score: 89,
        icon: BiTask,
        totalScore: 100,
    },
    {
        title: 'Attendence %',
        score: 89.7,
        icon: FcStatistics ,
        totalScore: 100,
    },
    {
        title: 'Leaves %',
        score: 100,
        icon: FcStatistics,
        totalScore: 100,
    },
]



export const applyLeaveForm : any[] = [
    {
        name: 'Leave Type',
        type: 'select',
        options: ['Annual Leave', 'Medical Leave', 'Loss of Pay'],
    },
]


export const headings = ['productTitle', 'productDescription', 'productCategory', 'productThumbnail', 'productSample', 'productFile','_id' ];
export const products = [
  {
    productId: 1,
    productName: 'Smartphone X',
    productCategory: 'Electronics',
    productPrice: 999.99,
    productSales: 100,
  },
  {
    productId: 2,
    productName: 'Laptop Pro',
    productCategory: 'Computers',
    productPrice: 1499.99,
    productSales: 100,
  },
  {
    productId: 3,
    productName: 'Wireless Earbuds',
    productCategory: 'Accessories',
    productPrice: 199.99,
    productSales: 100,
  },
];

