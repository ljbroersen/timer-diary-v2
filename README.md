# Timer Diary

## Features

## Technologies Used
![image](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) 
![image](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) 
![image](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=ReactQuery&logoColor=white)
![image](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![image](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![image](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![image](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)

## Project Setup
### Prerequisites
Ensure you have the following installed and/or created:

- **Node.js** (v22.6.0+)
- **npm** (v10.8.2+)
- A **PostgreSQL** database for this project

There is a sample environment file provided in the repository.
Please change the name from `.env.sample` to `.env.local` and change the credentials to your own.

### Installation
1. **Clone the repository**:
 ```
git clone https://github.com/yourusername/timer-diary.git
cd timer-diary
```

2. **Install dependencies**:
```
npm install
```

3. **Run the application**:
```
npm run dev
```
The application will be accessible at `http://localhost:5173`.

4. **Run migrations**:
To build the database schema and apply all available migrations:
```
npm run migrate-latest
```

5. **Start the server**:
```
npm run start
```
The server will be accessible at `http://localhost:10000`.

#### Rolling back migrations:
If you need to undo the most recent migration:
```
npm run migrate-down
```

#### Deployment:
For production, build the application:
```
npm run build
```
