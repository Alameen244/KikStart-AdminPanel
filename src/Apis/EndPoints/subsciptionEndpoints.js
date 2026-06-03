export const subscriptionEndpoints = {
    GET_USERS_SUMMARY: "api/v1/subs/admin/users-summary",
    GET_USER_TRANSACTIONS: (userId) => `api/v1/subs/admin/user/${userId}/transactions`,
    GET_ANALYTICS_OVERVIEW: "api/v1/subs/admin/analytics/overview",
    GET_REVENUE_CHART: "api/v1/subs/admin/analytics/revenue-chart",
    GET_PLAN_DISTRIBUTION: "api/v1/subs/admin/analytics/plan-distribution",
    GET_REVENUE_BREAKDOWN:"api/v1/subs/admin/revenue-breakdown"
};
