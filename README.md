# Portfolio Generator

A web application that automatically generates professional portfolio websites based on user input.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- Git

## Installation Steps

1. Create project structure
```bash
mkdir Portfolio
cd Portfolio
```

2. Set up server
```bash
# Create server directory and initialize
mkdir server
cd server
npm init -y

# Install server dependencies
npm install express mongoose multer cors dotenv nodemon

# Create necessary directories
mkdir models routes controllers uploads
```

3. Set up client
```bash
# Go back to project root and create React app
cd ..
npx create-react-app client

# Install client dependencies
cd client
npm install react-router-dom axios
```

4. Configure environment variables
```bash
# Go to server directory
cd ../server

# Create .env file (Windows PowerShell)
echo "PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string" | Out-File -Encoding utf8 .env
```

## Running the Application

1. Start MongoDB
```bash
# Open a new PowerShell window as Administrator
Start-Service MongoDB
```

2. Start the Server
```bash
# In the server directory
cd server
npm run dev
```

3. Start the Client
```bash
# Open a new terminal
cd client
npm start
```

The application should now be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Troubleshooting

If you encounter the "Cannot find module" error:
1. Ensure you're in the correct directory:
```bash
# Check current directory
pwd

# Should be in the server directory when running server
cd C:\path\to\Portfolio\server
```

2. Verify file existence:
```bash
# List files to ensure server.js exists
dir
```

3. Reinstall dependencies:
```bash
npm install
```

4. Try running with full path:
```bash
node ./server.js
```

## Project Structure
```
portfolio-generator/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── styles/
└── server/                 # Node.js backend
    ├── models/
    ├── routes/
    ├── controllers/
    └── uploads/           # For storing uploaded files
```

## Usage

1. Open http://localhost:3000 in your browser
2. Fill in your portfolio details:
   - Basic Information (name, bio, profile picture)
   - Skills & Technologies
   - Projects
   - Contact Information
   - Resume
3. Submit the form
4. Access your generated portfolio at the provided URL

## Additional Configuration

To modify the default ports:
- Server: Edit the PORT in `.env`
- Client: Create `.env` in client directory and set `PORT=<desired-port>`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details