import { axiosInstance } from "../../helper/helper.js";
import { coatchEndpoints } from "../EndPoints/coatchEndPoints.js";

export const createCoach = async (payload) => {
  const res = await axiosInstance.post(coatchEndpoints.CREATE_COACH, payload);
  return res?.data;
};
/**
 * Get all coaches
 * @param {Object} params - query parameters
 */
export const getCoaches = async (params = {}) => {
  const res = await axiosInstance.get(coatchEndpoints.GET_COACHES, { params });
  return res?.data;
};

/**
 * Get coach by id
 * @param {string} id - coach user id
 */
export const getCoachById = async (id) => {
  const res = await axiosInstance.get(
    `${coatchEndpoints.GET_COACH_BY_ID}/${id}`,
  );
  return res?.data;
};

/**
 * Update coach profile fields (name, experience, bio, maxStudents, isActive).
 * @param {string} id - coach user id
 * @param {Object} payload - fields to update
 */
export const updateCoach = async (id, payload) => {
  const res = await axiosInstance.put(
    `${coatchEndpoints.UPDATE_COACH}/${id}`,
    payload,
  );
  return res?.data;
};

/**
 * Assign one or more programs to a coach.
 * @param {string} id - coach user id
 * @param {string[]} programIds - array of program subdocument ids
 */
export const assignProgramsToCoach = async (id, programIds) => {
  const res = await axiosInstance.put(
    `${coatchEndpoints.ASSIGN_PROGRAMS_TO_COACH}/${id}/programs`,
    { programIds },
  );
  return res?.data;
};

/**
 * Unassign a program from a coach.
 * @param {string} id - coach user id
 * @param {string} programId - program subdocument id
 */
export const unassignProgramFromCoach = async (id, programId) => {
  const res = await axiosInstance.delete(
    `${coatchEndpoints.UNASSIGN_PROGRAM_FROM_COACH}/${id}/programs/${programId}`,
  );
  return res?.data;
};

export const getCoachesForProgram = async (programId) => {
  const res = await axiosInstance.get(
    `${coatchEndpoints.GET_COACHES_FOR_PROGRAM}/${programId}`,
  );
  return res?.data;
};

export const deleteCoachById = async (id) => {
  const res = await axiosInstance.delete(
    `${coatchEndpoints.DELETE_COACH}/${id}`,
  );
  return res?.data;
};