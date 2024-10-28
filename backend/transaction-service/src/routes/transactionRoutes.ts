import express from "express";
import { createTransaction, getAllTransactions, getTransactionById, getTransactionsByGroupId, getTransactionsByType, getTransactionsByUserId } from "../controllers/transactionController";

const router=express.Router();

router.post('/', createTransaction);

router.get('/all', getAllTransactions);

router.get('/find/:transactionId', getTransactionById);

router.get('/find/user/:userId', getTransactionsByUserId);

router.get('/find/group/:groupId', getTransactionsByGroupId);

router.get('/find/type/:transactionType', getTransactionsByType);

export default router;

