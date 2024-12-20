import { Request, Response, RequestHandler } from 'express';
import { TransactionService } from '../service/transactionService';

const transactionService = new TransactionService();

export const getAllTransactions: RequestHandler = async (req: Request, res: Response) => {
    try {
        const transactions = await transactionService.getAllTransactions();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve transactions' });
    }
};

export const getTransactionById: RequestHandler = async (req: Request, res: Response) => {
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

export const getTransactionsByGroupId: RequestHandler = async (req: Request, res: Response) => {
    try {
        const transactions = await transactionService.getTransactionsByGroupId(req.params.groupId);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve transactions' });
    }
};

export const getTransactionsByUserId: RequestHandler = async (req: Request, res: Response) => {
    try {
        const transactions = await transactionService.getTransactionsByUserId(req.params.userId);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve transactions' });
    }
};

export const getTransactionsByType: RequestHandler = async (req: Request, res: Response) => {
    try {
        const transactions = await transactionService.getTransactionsByType(req.params.transactionType);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve transactions' });
    }
};

export const createTransaction = async (req: Request, res: Response) => {
    try {
        const { userId, groupId, transactionAmount, transactionType, transactionDate, transactionFrom, transactionTo } = req.body;
        
        // Check if transactionFrom and transactionTo are provided
        if (!transactionFrom || !transactionTo) {
            return res.status(400).json({ message: 'Both transactionFrom and transactionTo are required' });
        }

        const transactionData = {
            userId,
            groupId,
            transactionAmount,
            transactionType,
            transactionDate,
            transactionFrom,
            transactionTo,
        };

        const result = await transactionService.createTransaction(transactionData);
        res.status(201).json(result); // Return success response
    } catch (error) {
        console.error('Error creating transaction:', error);
        if (error instanceof Error && error.message === 'Organizer not found for this group') {
            return res.status(404).json({ message: error.message }); // Specific error for organizer not found
        }
        res.status(500).json({ message: 'Server error' }); // Generic server error
    }
}