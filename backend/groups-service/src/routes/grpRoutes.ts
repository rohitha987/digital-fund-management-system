import { Router } from "express";
import { createGroup,getAllGroups,getByGroupName,updateGroup,deleteGroup } from "../controllers/grpController";

const router = Router();

router.post('/grp',createGroup);

router.get('/', getAllGroups);

router.get('/grp/:groupName',getByGroupName);

router.put('/grp/:groupName', updateGroup);

router.delete('/grp/:groupName', deleteGroup);

export default router;