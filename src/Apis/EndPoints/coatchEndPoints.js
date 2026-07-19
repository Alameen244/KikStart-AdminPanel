export const coatchEndpoints = {
  CREATE_COACH: "api/v1/admin/coaches",
  GET_COACHES: "api/v1/admin/coaches",
  GET_COACH_BY_ID: "api/v1/admin/coaches", // + /:id
  UPDATE_COACH: "api/v1/admin/coaches", // + /:id
  ASSIGN_PROGRAMS_TO_COACH: "api/v1/admin/coaches", // + /:id/programs
  UNASSIGN_PROGRAM_FROM_COACH: "api/v1/admin/coaches", // + /:id/programs/:programId
  GET_COACHES_FOR_PROGRAM: "api/v1/admin/coaches/program", // + /:programId
  DELETE_COACH: "api/v1/admin/coaches", // + /:id
};