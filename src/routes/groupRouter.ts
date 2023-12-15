import express from "express";
import { notFoundHandler } from "../middleware/notFound/notFoundHandler";
import { errorHandler } from "../middleware/error/errorHandler";
import { authenticateUser, autorizeUser } from "../middleware/auth/authMiddleware";
import createGroupController from "../controller/group/createGroupController";
import { groupsValidator, idValidator } from "../middleware/group/groupValidator";
import getAllGroupsController from "../controller/group/getAllGroupsController";
import getGroupByIdController from "../controller/group/getGroupByIdController";
import { updateGroupValidator } from "../middleware/group/updateGroupValidator";
import updateGroupsController from "../controller/group/updateGroupsController";
import deleteGroupsController from "../controller/group/deleteGroupsController";
import { invitationValidator } from "../middleware/invitation/invitationValidator";
import createInvitationController from "../controller/invitation/createInvitationController";
import getInvitationController from "../controller/invitation/getInvitationController";
import responseInvitationController from "../controller/invitation/responseInvitationController";
import removeUserController from "../controller/users/removeUserController";

export const groupRouter = express.Router();

groupRouter.use(authenticateUser);
groupRouter.get("/invitation", getInvitationController);
groupRouter.post("/accept/:invitationId", idValidator[2], responseInvitationController);
groupRouter.post("/reject/:invitationId", idValidator[2], responseInvitationController);
groupRouter.use(autorizeUser);
groupRouter.get("/", getAllGroupsController);
groupRouter.get("/:groupId", idValidator[1], getGroupByIdController);
groupRouter.post("/", groupsValidator, createGroupController);
groupRouter.put("/:groupId", idValidator[1], updateGroupValidator, updateGroupsController);
groupRouter.delete(
     "/remove-user/:groupId/:id",
     idValidator[0],
     idValidator[1],
     removeUserController
);
groupRouter.delete("/:groupId", deleteGroupsController);
groupRouter.post(
     "/send-invitation/:groupId",
     invitationValidator,
     idValidator[1],
     createInvitationController
);
groupRouter.use(notFoundHandler);
groupRouter.use(errorHandler);
