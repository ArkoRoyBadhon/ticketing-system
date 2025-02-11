import { api } from "../api/appSlice";

const ticketApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation({
      query: (ticketData) => ({
        url: "/t/create",
        method: "POST",
        body: ticketData,
      }),
      invalidatesTags: ["ticket"],
    }),

    viewAllTickets: builder.query({
      query: () => ({
        url: "/t/view-all",
        method: "GET",
      }),
      providesTags: ["ticket"],
    }),

    getTicketById: builder.query({
      query: (id) => ({
        url: `/t/view/${id}`,
        method: "GET",
      }),
      providesTags: ["ticket"],
    }),

    updateTicket: builder.mutation({
      query: ({ id, updateData }) => {
    console.log("inside", id, updateData);

        return {
          url: `/t/update/${id}`,
          method: "PATCH",
          body:  {status: updateData.status },
        };
      },
      invalidatesTags: ["ticket"],
    }),

    deleteTicket: builder.mutation({
      query: (id) => ({
        url: `/t/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ticket"],
    }),

    replyTicket: builder.mutation({
      query: ({ id, message }) => {
        
        return ({
            url: `/t/reply/${id}`,
            method: "POST",
            body: {message: message},
          })
      },
      invalidatesTags: ["ticket"],
    }),
  }),
});
export const {
  useCreateTicketMutation,
  useViewAllTicketsQuery,
  useGetTicketByIdQuery,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useReplyTicketMutation,
} = ticketApi;
