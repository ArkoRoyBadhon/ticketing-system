import { api } from "../api/appSlice";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (post) => ({
        url: "/register",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["user"],
    }),
    login: builder.mutation({
      query: (post) => ({
        url: "/login",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["user"],
    }),
    getAuthor: builder.query({
      query: (token) => {
        return {
          url: `/author`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["user"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["user"],
  }),


  }),
});
export const {
  useRegisterMutation,
  useLoginMutation,
  useGetAuthorQuery,
  useLogoutMutation
} = userApi;
