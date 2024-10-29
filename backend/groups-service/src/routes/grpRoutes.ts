import { Router } from "express";
import { createGroup,getAllGroups,getByGroupId,updateGroup,deleteGroup, addParticipant } from "../controllers/grpController";

const router = Router();

router.post('/',createGroup)

router.get('/all', getAllGroups);

router.get('/:groupId',getByGroupId as any);

router.put('/:groupName', updateGroup);

router.delete('/:groupName', deleteGroup);

router.post('/:groupId/participants', addParticipant as any);

export default router;