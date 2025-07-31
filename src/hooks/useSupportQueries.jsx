// hooks/useSupportQueries.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getMyTickets, 
  getTicketById, 
  createTicket, 
  addComment, 
  updateTicketPriority, 
  updateTicketStatus, 
  resolveTicket 
} from '../services/support/support.service';

// Query Keys
export const supportKeys = {
  all: ['support'],
  tickets: () => [...supportKeys.all, 'tickets'],
  myTickets: () => [...supportKeys.tickets(), 'my'],
  ticket: (id) => [...supportKeys.tickets(), 'detail', id],
};

// Hook to get user's tickets
export const useMyTickets = () => {
  return useQuery({
    queryKey: supportKeys.myTickets(),
    queryFn: getMyTickets,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get single ticket
export const useTicket = (ticketId) => {
  return useQuery({
    queryKey: supportKeys.ticket(ticketId),
    queryFn: () => getTicketById(ticketId),
    enabled: !!ticketId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create ticket
export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTicket,
    onSuccess: (data) => {
      // Invalidate and refetch tickets list
      queryClient.invalidateQueries({ queryKey: supportKeys.myTickets() });
      
      // Add the new ticket to cache if we have the ID
      if (data?.data?._id || data?._id) {
        const ticketId = data?.data?._id || data?._id;
        queryClient.setQueryData(supportKeys.ticket(ticketId), data);
      }
    },
    onError: (error) => {
      console.error('Failed to create ticket:', error);
    }
  });
};

// Hook to add comment
export const useAddComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, message }) => addComment(ticketId, { message }),
    onSuccess: (data, variables) => {
      // Invalidate the specific ticket to refetch with new comment
      queryClient.invalidateQueries({ 
        queryKey: supportKeys.ticket(variables.ticketId) 
      });
      
      // Also invalidate tickets list in case comment count changed
      queryClient.invalidateQueries({ 
        queryKey: supportKeys.myTickets() 
      });
    },
    onError: (error) => {
      console.error('Failed to add comment:', error);
    }
  });
};

// Hook to update ticket priority
export const useUpdateTicketPriority = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, priority }) => updateTicketPriority(ticketId, priority),
    onSuccess: (data, variables) => {
      // Update the specific ticket in cache
      queryClient.invalidateQueries({ 
        queryKey: supportKeys.ticket(variables.ticketId) 
      });
      
      // Update tickets list
      queryClient.invalidateQueries({ 
        queryKey: supportKeys.myTickets() 
      });
    },
    onError: (error) => {
      console.error('Failed to update priority:', error);
    }
  });
};

// Hook to update ticket status
export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, status }) => updateTicketStatus(ticketId, status),
    onSuccess: (data, variables) => {
      // Update the specific ticket in cache
      queryClient.invalidateQueries({ 
        queryKey: supportKeys.ticket(variables.ticketId) 
      });
      
      // Update tickets list
      queryClient.invalidateQueries({ 
        queryKey: supportKeys.myTickets() 
      });
    },
    onError: (error) => {
      console.error('Failed to update status:', error);
    }
  });
};

// Hook to resolve ticket
export const useResolveTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, resolution }) => resolveTicket(ticketId, { resolution }),
    onSuccess: (data, variables) => {
      // Update the specific ticket in cache
      queryClient.invalidateQueries({ 
        queryKey: supportKeys.ticket(variables.ticketId) 
      });
      
      // Update tickets list
      queryClient.invalidateQueries({ 
        queryKey: supportKeys.myTickets() 
      });
    },
    onError: (error) => {
      console.error('Failed to resolve ticket:', error);
    }
  });
};