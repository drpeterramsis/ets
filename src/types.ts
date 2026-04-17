export type EmployeeRole = 'employee' | 'facilitator' | 'superuser';

export type Employee = {
    "Employee Number": string;
    "Employee Name": string;
    "Email Address": string;
    "Division": string;
    "Unit": string | null;
    "Title": string;
    "Level": string;
    "Wave": string;
    "Kingdom": string;
    "Team": string;
    "Job"?: string;
    "role"?: EmployeeRole;
};

export type ThemeMode = 'light' | 'dark';
