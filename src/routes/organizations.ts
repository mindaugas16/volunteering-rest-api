import express from 'express';
import OrganizationsController from '../controllers/organizations';
import AuthMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', OrganizationsController.getOrganizations);
router.get('/:organizationId', OrganizationsController.getOrganization);
router.patch('/:organizationId/join', AuthMiddleware.guard, OrganizationsController.join);
router.patch('/:organizationId/leave', AuthMiddleware.guard, OrganizationsController.leave);

export default router;

