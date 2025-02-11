import { useState } from "react";
import {
  useCreateTicketMutation,
  useDeleteTicketMutation,
  useViewAllTicketsQuery,
} from "../redux/features/ticket.api";
import { toast } from "sonner";

const CustomerDash = () => {
  const { data: tickets, isLoading } = useViewAllTicketsQuery();
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const [deleteTicket] = useDeleteTicketMutation();
  const [form, setForm] = useState({ subject: "", description: "" });
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCreateTicket = async () => {
    if (form.subject && form.description) {
      const toastId = toast.loading("Please wait...");
      try {
        await createTicket(form).unwrap();
        setForm({ subject: "", description: "" });
        toast.success("Successfully Ticket Created", {
          description: "Hurray!",
        });
      } catch (error) {
        toast.error("Something went wrong", { id: toastId });
        console.error("Failed to create ticket:", error);
      } finally {
        toast.dismiss(toastId);
      }
    } else {
      toast.error("Please enter subject and description");
    }
  };

  const handleDeleteTicket = async (id) => {
    const toastIdDel = toast.loading("Please wait...");
    try {
      await deleteTicket(id).unwrap();
      toast.success("Successfully Deleted", { id: toastIdDel });
    } catch (error) {
      console.error("Failed to delete ticket:", error);
      toast.error("Something went wrong", { id: toastIdDel });
    } finally {
      toast.dismiss(toastIdDel);
    }
  };

  const handleToggleDetails = (id) => {
    setSelectedTicketId(selectedTicketId === id ? null : id);
  };

  if (isLoading) {
    return <div>Loading tickets...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customer Dashboard</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-bold mb-4">Create a New Ticket</h2>
        <div className="mb-4">
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleInputChange}
            placeholder="Subject"
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
            className="w-full p-2 border rounded-lg"
          ></textarea>
        </div>
        <button
          onClick={handleCreateTicket}
          className="bg-violet-600 text-white py-2 px-4 rounded-lg"
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Submit Ticket"}
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">My Tickets</h2>
        {tickets?.data.length > 0 ? tickets?.data?.map((ticket, index) => (
          <div
            key={ticket.id}
            className="border-b pb-4 mb-4 flex justify-between items-center"
          >
            <div>
              <small className="text-sm text-gray-500">Issue: {index+1}</small>
              <h3 className="font-bold capitalize">{ticket.subject}</h3>
              <p className="capitalize">{ticket.description}</p>
              <p className="text-sm text-gray-500">Status: {ticket.status}</p>
              <button
                onClick={() => handleToggleDetails(ticket.id)}
                className="text-violet-600 hover:underline mt-2"
              >
                {selectedTicketId === ticket.id
                  ? "Hide Details"
                  : "View Replies"}
              </button>

              {selectedTicketId === ticket.id && (
                <div className="mt-4">
                  <h4 className="font-semibold">Replies:</h4>
                  {ticket?.replies?.length > 0 ? (
                    <ul>
                      {ticket?.replies.map((reply, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {reply?.message}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No replies yet.</p>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => handleDeleteTicket(ticket.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        )) : (
          <p>No tickets found.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDash;
