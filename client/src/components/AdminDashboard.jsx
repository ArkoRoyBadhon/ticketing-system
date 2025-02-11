import { useState } from "react";
import { useReplyTicketMutation, useUpdateTicketMutation, useViewAllTicketsQuery } from "../redux/features/ticket.api";


const AdminDashboard = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");

  const { data: tickets = [], isLoading } = useViewAllTicketsQuery();
  const [replyTicket] = useReplyTicketMutation();
  const [updateTicket] = useUpdateTicketMutation();

  const handleReplyChange = (e) => {
    setReplyText(e.target.value);
  };

  const handleAddReply = async (ticketId) => {
    try {
      console.log("Reply Text:", replyText);
  
      const response = await replyTicket({ id: ticketId, message: replyText }).unwrap();
  
      setSelectedTicket((prev) => ({
        ...prev,
        replies: [...prev.replies, response.data],
      }));
  
      setReplyText(""); 
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };
  

  const handleStatusChange = async (ticketId, status) => {
    try {
      await updateTicket({ id: ticketId, updateData: { status } });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const closeTicketDetails = () => {
    setSelectedTicket(null);
  };

  if (isLoading) return <div>Loading tickets...</div>;


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">All Tickets</h2>
          <div className="space-y-4">
            {tickets.data.map((ticket) => (
              <div key={ticket.id} className="border-b pb-4 mb-4">
                <h3 className="font-bold">{ticket.subject}</h3>
                <p>{ticket.description}</p>
                <p className="text-sm text-gray-500">Status: {ticket.status}</p>
                <button
                  onClick={() => setSelectedTicket(ticket)}
                  className="text-blue-600 hover:underline"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Details Section */}
        {selectedTicket && (
          <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Ticket Details</h2>
              <button
                onClick={closeTicketDetails}
                className="text-red-600 hover:underline"
              >
                Close
              </button>
            </div>
            <div>
              <h3 className="font-bold">{selectedTicket.subject}</h3>
              <p>{selectedTicket.description}</p>
              <p className="text-sm text-gray-500">Status: {selectedTicket.status}</p>
              <div className="mt-4">
                <h4 className="font-semibold">Replies</h4>
                <div className="space-y-2">
                  {selectedTicket?.replies.length > 0 ? (
                    selectedTicket.replies.map((reply, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded-lg">
                        {reply?.message}
                      </div>
                    ))
                  ) : (
                    <p>No replies yet.</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold">Add a Reply</h4>
                <textarea
                  value={replyText}
                  onChange={handleReplyChange}
                  placeholder="Write your reply..."
                  className="w-full p-2 border rounded-lg"
                ></textarea>
                <button
                  onClick={() => handleAddReply(selectedTicket.id)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-2"
                >
                  Reply
                </button>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold">Change Status</h4>
                <select
                  className="w-full p-2 border rounded-lg"
                  onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                  value={selectedTicket.status}
                >
                  <option value="OPEN">Open</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
