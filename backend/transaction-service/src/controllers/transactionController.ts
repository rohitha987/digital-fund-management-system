import { Request, Response, RequestHandler } from 'express';
import { TransactionService } from '../service/transactionService';

const transactionService = new TransactionService();

export const getAllTransactions: RequestHandler = async  (req: Request, res: Response) => {
    try {
        const transactions = await transactionService.getAllTransactions();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve transactions' });
    }
};

export const getTransactionById : RequestHandler =async( req: Request, res: Response) => {
    try {
        const transaction = await transactionService.getTransactionById(req.params.transactionId);
        if (transaction) {
            res.status(200).json(transaction);
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve transaction' });
    }
};

export const getTransactionsByGroupId :RequestHandler =async( req: Request, res: Response) =>{
    try{
        const transactions = await transactionService.getTransactionsByGroupId(req.params.groupId);
        res.status(200).json(transactions);
    }catch(error){
        res.status(500).json({ message: 'Failed to retrieve transactions' });
    }
}

export const getTransactionsByUserId :RequestHandler =async(req: Request, res: Response) =>{
    try{
        const transactions = await transactionService.getTransactionsByUserId(req.params.userId);
        res.status(200).json(transactions);
    }catch(error){
        res.status(500).json({ message: 'Failed to retrieve transactions' });
    }
}

export const getTransactionsByType :RequestHandler =async(req: Request, res: Response) =>{
    try{
        const transactions = await transactionService.getTransactionsByType(req.params.transactionType);
        res.status(200).json(transactions);
    }catch(error){
        res.status(500).json({ message: 'Failed to retrieve transactions' });
    }
}

export const createTransaction :RequestHandler =async(req: Request, res: Response) =>{
    try{
        const transaction = await transactionService.createTransaction(req.body);
        res.status(201).json(transaction);
    }catch(error){
        res.status(500).json({ message: 'Failed to create transaction' });
    }
}