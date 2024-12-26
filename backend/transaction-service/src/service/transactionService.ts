import axios from "axios";
import transaction from "../models/transaction";

export class TransactionService {
    
    async getAllTransactions() {
        return transaction.find({});
    }

    async getTransactionById(transactionId: string) {
        return transaction.findOne({ transactionId });
    }

    async getTransactionsByUserId(userId: string) {
        return transaction.find({ userId: userId });
    }

    async getTransactionsByGroupId(groupId: string) {
        return transaction.find({ groupId: groupId });
    }

    async getTransactionsByType(transactionType: string) {
        return transaction.find({ transactionType: transactionType });
    }

    // Utility function to generate a unique transaction ID
    private generateTransactionId(): string {
        return `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`; // Simple unique ID
    }

    async createTransaction(transactionData: any) {
        const { userId, groupId, transactionAmount, transactionType, transactionDate, transactionFrom, transactionTo } = transactionData;
        
        // Generate a unique transaction ID if not provided
        const transactionId = transactionData.transactionId || this.generateTransactionId();

        console.log("Transaction Data:", transactionData);
        
        // Step 1: Create Debit Transaction for Participant
        const debitTransaction = new transaction({
            userId,
            groupId,
            transactionAmount,
            transactionType: 'debit',
            transactionDate,
            transactionId: transactionId, // Use the generated or provided transaction ID
            transactionFrom, // Added field for sender
            transactionTo: transactionTo || '', // Default to empty if not provided
        });
        console.log("Debit Transaction:", debitTransaction);
        await debitTransaction.save();

        // Step 2: Fetch Organizer ID from Group Service
        // const groupServiceUrl = `http://localhost:3003/api/groups/getOrganizer/${groupId}`; // Adjust the port and path as necessary
        // const response = await axios.get(groupServiceUrl);
        
        // if (!response.data.organizerId) {
        //     throw new Error('Organizer not found for this group');
        // }
        // const organizerId = response.data.organizerId;
        // console.log("Organizer ID:", organizerId);
        
        // Step 3: Create Credit Transaction for Organizer
        const creditTransaction = new transaction({
            userId: transactionTo, // Organizer ID
            groupId,
            transactionAmount,
            transactionType: 'credit',
            transactionDate,
            transactionId: this.generateTransactionId(), // Generate a new transaction ID for the credit transaction
            transactionFrom: transactionFrom|| '', // Default to empty if not provided
            transactionTo: transactionTo, // The organizer will be the recipient in the credit transaction
        });
        console.log("Credit Transaction:", creditTransaction);
        await creditTransaction.save();

        return { message: 'Transaction created successfully' };
    }
}

export default TransactionService;
