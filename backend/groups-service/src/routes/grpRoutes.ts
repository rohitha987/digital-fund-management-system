import { Router } from "express";
import { createGroup,getAllGroups,getByGroupId,updateGroup,deleteGroup, addParticipant, getParticipantsOfGroup, calculateChit, getOrganizerOfGroup } from "../controllers/grpController";

const router = Router();

router.post('/',createGroup)

router.get('/all', getAllGroups);

router.get('/:groupId',getByGroupId as any);

router.put('/:groupName', updateGroup);

router.delete('/:groupName', deleteGroup);

router.get('/:groupId/participants/:userId', addParticipant as any);

router.get('/:groupId/participants', getParticipantsOfGroup as any);

router.post('/calculateChit', calculateChit as any);

router.get('/getOrganizer/:groupId', getOrganizerOfGroup as any);

export default router;