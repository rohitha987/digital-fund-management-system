import transaction from "../models/transaction";

export class TransactionService{
    
    async getAllTransactions(){
        return transaction.find({});
    }

    async getTransactionById(transactionId: string){
        return transaction.findOne({transactionId});
    }

    async getTransactionsByUserId(userId: string){
        return transaction.find({userId: userId});
    }

    async getTransactionsByGroupId(groupId: string){
        return transaction.find({groupId: groupId});
    }

    async getTransactionsByType(transactionType: string){
        return transaction.find({transactionType: transactionType});
    }

    async createTransaction(transactionData: any){
        const newTransaction = new transaction(transactionData);
        return newTransaction.save();
    }
}

export default TransactionService;