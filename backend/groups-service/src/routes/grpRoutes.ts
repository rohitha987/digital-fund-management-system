import { Router } from "express";
import { createGroup,getAllGroups,getByGroupId,updateGroup,deleteGroup, addParticipant, getParticipantsOfGroup, requestToJoinGroup, getAllRequests, calculateChit, getOrganizerOfGroup, displayMonthlyPlan } from "../controllers/grpController";

const router = Router();

router.post('/',createGroup)

router.get('/all', getAllGroups);

router.get('/:groupId',getByGroupId as any);

router.put('/:groupId', updateGroup);

router.delete('/:groupName', deleteGroup);

router.get('/:groupId/participants/:userId', addParticipant as any);

router.post('/request',requestToJoinGroup as any);

router.get('/:groupId/requests',getAllRequests as any)

router.get('/:groupId/participants', getParticipantsOfGroup as any);

router.post('/calculateChit', calculateChit as any);

router.get('/getOrganizer/:groupId', getOrganizerOfGroup as any);

router.post('/:groupId/plan', displayMonthlyPlan as any);

export default router;