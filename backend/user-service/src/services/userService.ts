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
  async searchGroup(groupId: string) {
    // Logic to search for a group (Placeholder)
  }

  async viewGroupDetails(groupId: string) {
    // Logic to view group details (Placeholder)
  }

  async requestJoinGroup(userId: string, groupId: string) {
    // Logic to request joining a group (Placeholder)
  }

  async getAllTransactions(userId: string) {
    // Logic to get all transactions (Placeholder)
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
}

export default UserService;
