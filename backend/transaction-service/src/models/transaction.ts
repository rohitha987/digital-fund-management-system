import mongoose, {Schema, Document} from "mongoose"
export interface Transaction extends Document{
    transactionId: string;
    transactionAmount: Number;
    transactionDate: Date;
    transactionType: string;
    userId: string;
    groupId: string;
}

const TransactionSchema : Schema = new Schema({
    transactionId: {type: String, required: true, unique: true},
    transactionAmount: {type: Number, required: true},
    transactionDate: {type: Date, default: Date.now},
    transactionType: {type: String, required: true},
    userId: {type: String, required: true},
    groupId: {type: String, required: true},
});

export default mongoose.model<Transaction>('Transaction', TransactionSchema);