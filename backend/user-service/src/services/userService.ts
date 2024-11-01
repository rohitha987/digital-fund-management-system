import axios from 'axios';
import User from '../models/User';

class UserService {


  async register(userData: any) {
    const user = new User(userData);
    return user.save();
  }

  async login(userEmail: string) {
    return User.findOne({ userEmail });
  }

  async getAllUsers() {
    return User.find({});
  }

  async getUserById(userId: string) {
    return User.findOne({ userId });
  }

  async getUserByEmail(userEmail: string) {
    return User.findOne({ userEmail });
  }

  async getUsernameById(userId: string) {
    const user = await User.findById(userId).select('userName'); // Adjust the field name as per your schema
    if (!user) {
      throw new Error('User not found');
    }
    return user.userName;
  }
  
  async getListofGroups(userId: string) {
    const userGroupIds = await User.findOne({ userId }).select("groupIds");
    if (!userGroupIds) {
      return null;
    }
    var result: String[] = [];
    for (const element of userGroupIds.groupIds) {
      try {
        const response = await axios.get(`http://localhost:3001/api/groups/${element}`)
        result.push(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    console.log(result);
    return result;
  }
  // Other methods as needed

  async editUserProfile(userEmail: string, updatedData: any): Promise<any> {
    try {
        // Log the updated data for debugging purposes
        console.log('Updated Data:', updatedData);
        
        // Use findOneAndUpdate to find the user by email and update their information
        const updatedUser = await User.findOneAndUpdate(
            { userEmail: userEmail },
            { $set: updatedData }, // Use $set to update only specified fields
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        // Check if a user was found and updated
        if (!updatedUser) {
            throw new Error('User not found');
        }

        return updatedUser; // Return the updated user document
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw new Error('Error updating user profile');
    }
}
}





export default UserService;
