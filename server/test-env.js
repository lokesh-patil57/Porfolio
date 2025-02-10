require('dotenv').config();
console.log('Testing .env file reading:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI); 