export const subscriptionEndpoints = {
    GET_USERS_SUMMARY:       "api/v1/subs/admin/users-summary",
    GET_USER_TRANSACTIONS:   (userId) => `api/v1/subs/admin/user/${userId}/transactions`,
};
