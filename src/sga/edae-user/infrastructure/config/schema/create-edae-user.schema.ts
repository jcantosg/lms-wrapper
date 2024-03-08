import * as Joi from 'joi';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';

export const createEdaeUserSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
  name: Joi.string().required(),
  surname1: Joi.string().required(),
  surname2: Joi.string().allow(null, '').optional(),
  email: Joi.string().email().required(),
  identityDocument: Joi.object({
    identityDocumentType: Joi.string().required(),
    identityDocumentNumber: Joi.string().required(),
  }).required(),
  roles: Joi.array()
    .items(Joi.string().valid(...Object.values(EdaeRoles)))
    .required(),
  businessUnits: Joi.array()
    .items(Joi.string().guid({ version: 'uuidv4' }))
    .min(1)
    .required(),
  timeZone: Joi.string()
    .valid(...Object.values(TimeZoneEnum))
    .required(),
  isRemote: Joi.boolean().required(),
  location: Joi.string().required(),
  avatar: Joi.string().optional(),
});
