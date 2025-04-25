interface Employee {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: string;
  isActive: boolean;
  salary: number;
  place: {
    houseName: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    country: string;
  };
  profilePicture: string;
}

interface EmployeeDataResponse {
  success: boolean;
  message?: string;
  data: {
    employees: Employee[];
    currentPage: number;
    totalPages: number;
    totalEmployees: number;
    message?: string;
  };
}

interface SingleEmployeeDataResponse {
  success: boolean;
  data: Employee;
}

export type { Employee, EmployeeDataResponse, SingleEmployeeDataResponse };
