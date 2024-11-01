import jwt from 'jsonwebtoken';
<<<<<<< HEAD

 

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

 

export const verifyToken = (token: string) => {

  try {

    console.log('Verifying token:', token);

    return jwt.verify(token, JWT_SECRET);

  } catch (error) {

    throw new Error('Token verification failed');

  }

=======
 
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
 
export const verifyToken = (token: string) => {
    try {
        console.log('Verifying token:', token);
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Token verification failed');
    }
>>>>>>> 3754815e9d62662bf9cfd5b2e58b0544e8cd7cfc
};