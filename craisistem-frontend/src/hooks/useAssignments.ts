import { useQuery } from "@tanstack/react-query"
import { getAssignmentsService } from "../services/AssignmentsService"

export const useAssignments = (params: any) => {
  return useQuery({
    queryKey: ["assignments", params],
    queryFn: () => getAssignmentsService(params),
    staleTime: 0,
    placeholderData: (previousData) => previousData,
  })
}