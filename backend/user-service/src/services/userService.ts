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

  async getListofGroups(userEmail: string) {
    const userGroupIds = await User.findOne({ userEmail }).select("groupIds");
    if (!userGroupIds) {
      return null;
    }
    var result: String[] = [];
    for (const element of userGroupIds.groupIds) {
      try {
        const response = await axios.get(`http://localhost:3003/api/groups/${element}`)
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

  async respondToJoinRequest(groupId: string, userId: string, action: any) {
    try {
      // Accept the request
      if (action === 'accept') {
        const group = await axios.get(`http://localhost:3003/api/groups/${groupId}/participants/${userId}`);
        const user = await this.getUserById(userId);
        user?.groupIds.push(groupId);
        const updatedUser = await user?.save();
        return updatedUser;

      } else {
        // Reject the request
        const response = await axios.get(`http://localhost:3003/api/groups/${groupId}`);
        const group = response.data;
        // Find the index of the request
        const requestIndex = group.joinRequests.findIndex((req: string) => req === userId);
        if (requestIndex != -1) {
          group.joinRequests.splice(requestIndex, 1);
          try {
            const updatedGroup = await axios.put(`http://localhost:3003/api/groups/${groupId}`, group);
            return updatedGroup;
          }
          catch(error){
            console.error('Error rejecting join request:', error);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addGroup(groupId: any, userEmail: string) {
    try{
    const user=  await this.getUserByEmail(userEmail);
    if(!user){
      throw new Error('User not found');
    }
    user.groupIds.push(groupId);
    return user.save();
  }
  catch(error){
    console.error('Error adding group:', error);
  }
}

async getIdByUserName(userName: string): Promise<string | null> {
  try {
    // Find user by userName and select only the userId field
    const user = await User.findOne({ userName }).select('userId');
    
    if (!user) {
      throw new Error('User not found');
    }

    // Return the userId
    return user.userId;
  } catch (error) {
    console.error('Error fetching user ID by userName:', error);
    throw new Error('Error fetching user ID');
  }
}


}


export default UserService;
